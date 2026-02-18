// AOCS-ROLE: pure-logic
// AOCS-INPUTS: source files, config
// AOCS-OUTPUTS: validation results
// @module: aocs-validator/checks/forbidden
// @exports: checkForbidden
// @depends: fs, path

import { readFile } from 'fs/promises';
import { extname, relative } from 'path';

const patternCheckers = {
  'dynamic-eval': {
    pattern: /(eval\s*\(|new\s+Function\s*\()/,
    message: 'Dynamic eval or Function constructor detected'
  },
  'dynamic-import': {
    pattern: /import\s*\(/,
    message: 'Dynamic import() detected'
  },
  'reflection': {
    pattern: /(Reflect\.|Object\.defineProperty)/,
    message: 'Reflection API usage detected'
  },
  'implicit-global': {
    // Only match bare assignments at start of line with no indentation
    // This reduces false positives from reassignments inside functions
    pattern: /^[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*[^=]/m,
    message: 'Possible implicit global assignment (use const/let/var)',
    warn: true
  }
};

// @contract: (projectPath:str, config:object, files:str[]) -> Promise<object>
// @pure: false
// @complexity: O(n*m*p) where n=files, m=file size, p=patterns
export async function checkForbidden(projectPath, config, files) {
  const violations = [];
  const warnings = [];
  
  if (!config || !config.forbiddenPatterns) {
    return { violations, warnings };
  }
  
  const jsFiles = files.filter(f => {
    const ext = extname(f);
    return ['.js', '.mjs', '.cjs', '.ts', '.tsx'].includes(ext);
  });
  
  for (const file of jsFiles) {
    try {
      const content = await readFile(file, 'utf-8');
      const lines = content.split('\n');
      
      for (const pattern of config.forbiddenPatterns) {
        const checker = patternCheckers[pattern];
        
        if (!checker) {
          // Unknown pattern - warn once (not a violation)
          if (!warnings.some(w => w.message && w.message.includes(`No checker for forbidden pattern: ${pattern}`))) {
            warnings.push({
              message: `No checker for forbidden pattern: ${pattern}`
            });
          }
          continue;
        }
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          // Skip comments
          if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
            continue;
          }
          
          if (checker.pattern.test(line)) {
            violations.push({
              file: relative(projectPath, file),
              line: i + 1,
              message: checker.message
            });
          }
        }
      }
    } catch (err) {
      // Skip files we can't read
    }
  }
  
  return { violations, warnings };
}
