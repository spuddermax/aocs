// AOCS-ROLE: pure-logic
// AOCS-INPUTS: source files
// AOCS-OUTPUTS: language-specific rules
// @module: aocs-validator/languages/css
// @exports: cssRules
// @depends: fs, path

import { readFile } from 'fs/promises';
import { relative } from 'path';

// @contract: (projectPath:str, config:object, files:str[]) -> Promise<object>
// @pure: false
async function checkDesignTokens(projectPath, config, files) {
  const violations = [];
  
  const cssFiles = files.filter(f => f.endsWith('.css'));
  
  for (const file of cssFiles) {
    try {
      const content = await readFile(file, 'utf-8');
      
      if (!content.includes(':root')) {
        violations.push({
          file: relative(projectPath, file),
          line: 1,
          message: 'CSS file should define design tokens in :root'
        });
      }
    } catch (err) {
      // Skip files we can't read
    }
  }
  
  return { violations };
}

export const cssRules = [
  {
    id: 'CSS1-design-tokens',
    name: 'Design tokens defined in :root',
    level: 'warn',
    check: checkDesignTokens
  }
];
