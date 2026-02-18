// AOCS-ROLE: pure-logic
// AOCS-INPUTS: source files
// AOCS-OUTPUTS: validation results
// @module: aocs-validator/checks/hints
// @exports: checkHints
// @depends: fs, path

import { readFile } from 'fs/promises';
import { relative } from 'path';

// Build hint patterns dynamically to avoid self-flagging by validator
const hintPatterns = [
  'AOCS-' + 'INVARIANT',
  'AOCS-' + 'FAILS-ON',
  'AOCS-' + 'PURE',
  'AOCS-' + 'COMPLEXITY'
];

// @contract: (projectPath:str, config:object, files:str[]) -> Promise<object>
// @pure: false
// @complexity: O(n*m) where n=files, m=lines per file
export async function checkHints(projectPath, config, files) {
  const violations = [];
  
  for (const file of files) {
    try {
      const content = await readFile(file, 'utf-8');
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        for (const hint of hintPatterns) {
          if (line.includes(hint)) {
            // Check if it has a colon and value
            const regex = new RegExp(`${hint}:\\s*(.+)`);
            const match = line.match(regex);
            
            if (!match || match[1].trim().length === 0) {
              violations.push({
                file: relative(projectPath, file),
                line: i + 1,
                message: `${hint} hint is malformed or empty (must have format: ${hint}: value)`
              });
            }
          }
        }
      }
    } catch (err) {
      // Skip files we can't read
    }
  }
  
  return { violations };
}
