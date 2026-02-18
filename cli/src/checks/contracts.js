// AOCS-ROLE: pure-logic
// AOCS-INPUTS: source files
// AOCS-OUTPUTS: validation results
// @module: aocs-validator/checks/contracts
// @exports: checkContracts
// @depends: fs, path

import { readFile } from 'fs/promises';
import { extname, relative } from 'path';

// @contract: (lines:str[], idx:num) -> bool
// @pure: true
function hasContractAbove(lines, idx) {
  // Check up to 5 lines above
  const start = Math.max(0, idx - 5);
  for (let i = start; i < idx; i++) {
    if (lines[i].includes('@contract')) {
      return true;
    }
  }
  return false;
}

// @contract: (line:str) -> bool
// @pure: true
function isExportedFunction(line) {
  // Only check for explicitly exported functions
  // AOCS requires @contract on exported functions, not internal ones
  if (line.includes('export') && (
    line.includes('function') ||
    /export\s+(const|let|var)\s+\w+\s*=\s*(async\s*)?\(/.test(line) ||
    /export\s+(const|let|var)\s+\w+\s*=\s*(async\s*)?function/.test(line) ||
    /export\s+async\s+function/.test(line)
  )) {
    return true;
  }
  
  return false;
}

// @contract: (projectPath:str, config:object, files:str[]) -> Promise<object>
// @pure: false
// @complexity: O(n*m) where n=files, m=lines per file
export async function checkContracts(projectPath, config, files) {
  const violations = [];
  
  // Only check JS/TS files for now
  const jsFiles = files.filter(f => {
    const ext = extname(f);
    return ['.js', '.mjs', '.cjs', '.ts', '.tsx'].includes(ext);
  });
  
  for (const file of jsFiles) {
    try {
      const content = await readFile(file, 'utf-8');
      const lines = content.split('\n');
      
      let inMultilineComment = false;
      let inClass = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Track multiline comments
        if (trimmed.includes('/*')) inMultilineComment = true;
        if (trimmed.includes('*/')) inMultilineComment = false;
        
        // Skip comments and blank lines
        if (inMultilineComment || trimmed.startsWith('//') || trimmed.length === 0) {
          continue;
        }
        
        // Track class scope
        if (/^(export\s+)?class\s+/.test(trimmed)) {
          inClass = true;
        }
        
        if (isExportedFunction(line)) {
          if (!hasContractAbove(lines, i)) {
            violations.push({
              file: relative(projectPath, file),
              line: i + 1,
              message: 'Exported function missing @contract annotation'
            });
          }
        }
      }
    } catch (err) {
      // Skip files we can't read
    }
  }
  
  return { violations };
}
