// AOCS-ROLE: pure-logic
// AOCS-INPUTS: source files
// AOCS-OUTPUTS: language-specific rules
// @module: aocs-validator/languages/javascript
// @exports: javascriptRules
// @depends: fs, path

import { readFile } from 'fs/promises';
import { relative } from 'path';

// @contract: (projectPath:str, config:object, files:str[]) -> Promise<object>
// @pure: false
async function checkStateManifest(projectPath, config, files) {
  const violations = [];
  
  for (const file of files) {
    try {
      const content = await readFile(file, 'utf-8');
      const lines = content.split('\n');
      
      // Check if file declares state-machine role
      const hasStateRole = lines.slice(0, 5).some(l => 
        l.includes('AOCS-ROLE:') && l.includes('state-machine')
      );
      
      if (hasStateRole) {
        // Should have @state-manifest
        const hasStateManifest = content.includes('@state-manifest');
        
        if (!hasStateManifest) {
          violations.push({
            file: relative(projectPath, file),
            line: 1,
            message: 'state-machine role requires @state-manifest declaration'
          });
        }
      }
    } catch (err) {
      // Skip files we can't read
    }
  }
  
  return { violations };
}

export const javascriptRules = [
  {
    id: 'JS1-state-manifest',
    name: 'State manifests for state-machine files',
    level: 'warn',
    check: checkStateManifest
  }
];
