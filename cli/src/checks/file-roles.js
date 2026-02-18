// AOCS-ROLE: pure-logic
// AOCS-INPUTS: source files
// AOCS-OUTPUTS: validation results
// @module: aocs-validator/checks/file-roles
// @exports: checkFileRoles
// @depends: fs, path

import { readFile } from 'fs/promises';
import { extname, relative } from 'path';

const validRoles = new Set([
  'pure-logic',
  'state-machine',
  'adapter',
  'ui-binding',
  'io-boundary',
  'config'
]);

// @contract: (line:str, ext:str) -> str|null
// @pure: true
function extractRole(line, ext) {
  const patterns = [
    /\/\/\s*AOCS-ROLE:\s*(\S+)/,  // JS/TS/Go/Rust/Java
    /#\s*AOCS-ROLE:\s*(\S+)/,     // Python
    /<!--\s*AOCS-ROLE:\s*(\S+)/,  // HTML
    /\/\*\s*AOCS-ROLE:\s*(\S+)/   // CSS
  ];
  
  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
}

// @contract: (projectPath:str, config:object, files:str[]) -> Promise<object>
// @pure: false
// @complexity: O(n*m) where n=files, m=lines per file (max 15 for HTML, 5 for others)
export async function checkFileRoles(projectPath, config, files) {
  const violations = [];
  
  for (const file of files) {
    try {
      const content = await readFile(file, 'utf-8');
      const ext = extname(file);
      
      // HTML files may have AOCS-ROLE inside multi-line comment blocks
      const maxLines = (ext === '.html' || ext === '.htm') ? 15 : 5;
      const lines = content.split('\n').slice(0, maxLines);
      
      let roleFound = false;
      let roleLine = 0;
      let roleValue = null;
      
      // For HTML, also check if we're inside a comment block
      if (ext === '.html' || ext === '.htm') {
        const headerText = lines.join('\n');
        // Match AOCS-ROLE anywhere in the first comment block
        const commentMatch = headerText.match(/<!--[\s\S]*?-->/);
        if (commentMatch) {
          const roleMatch = commentMatch[0].match(/AOCS-ROLE:\s*(\S+)/);
          if (roleMatch) {
            roleFound = true;
            roleValue = roleMatch[1].trim();
            // Find line number
            const beforeRole = headerText.substring(0, headerText.indexOf('AOCS-ROLE:'));
            roleLine = beforeRole.split('\n').length;
          }
        }
      }
      
      // Fall back to line-by-line check for non-HTML or if not found in comment
      if (!roleFound) {
        for (let i = 0; i < lines.length; i++) {
          const role = extractRole(lines[i], ext);
          if (role) {
            roleFound = true;
            roleLine = i + 1;
            roleValue = role;
            break;
          }
        }
      }
      
      if (!roleFound) {
        violations.push({
          file: relative(projectPath, file),
          line: 1,
          message: `Missing AOCS-ROLE declaration in first ${maxLines} lines`
        });
      } else if (!validRoles.has(roleValue)) {
        violations.push({
          file: relative(projectPath, file),
          line: roleLine,
          message: `Invalid role "${roleValue}". Must be one of: ${Array.from(validRoles).join(', ')}`
        });
      }
    } catch (err) {
      // Skip files we can't read
    }
  }
  
  return { violations };
}
