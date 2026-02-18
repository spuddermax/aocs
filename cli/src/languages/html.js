// AOCS-ROLE: pure-logic
// AOCS-INPUTS: source files
// AOCS-OUTPUTS: language-specific rules
// @module: aocs-validator/languages/html
// @exports: htmlRules
// @depends: fs, path

import { readFile } from 'fs/promises';
import { relative } from 'path';

// @contract: (projectPath:str, config:object, files:str[]) -> Promise<object>
// @pure: false
async function checkInteractiveElements(projectPath, config, files) {
  const violations = [];
  
  const htmlFiles = files.filter(f => f.endsWith('.html') || f.endsWith('.htm'));
  
  for (const file of htmlFiles) {
    try {
      const content = await readFile(file, 'utf-8');
      const lines = content.split('\n');
      
      const interactiveTags = /<(button|a|input|select|textarea)[^>]*>/gi;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let match;
        
        while ((match = interactiveTags.exec(line)) !== null) {
          const element = match[0];
          
          // Skip external links (target="_blank") - they don't need identifiers
          if (element.includes('target="_blank"') || element.includes("target='_blank'")) {
            continue;
          }
          
          // Accept id= or any data-* attribute (data-action, data-page, etc.)
          if (!element.includes('id=') && !/data-[a-z]+=/i.test(element)) {
            violations.push({
              file: relative(projectPath, file),
              line: i + 1,
              message: 'Interactive element should have id or data-action attribute'
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

export const htmlRules = [
  {
    id: 'HTML1-interactive-ids',
    name: 'Interactive elements have id or data-action',
    level: 'warn',
    check: checkInteractiveElements
  }
];
