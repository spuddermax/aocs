// AOCS-ROLE: pure-logic
// AOCS-INPUTS: projectPath, options
// AOCS-OUTPUTS: validation summary
// @module: aocs-validator
// @exports: validate
// @depends: core/config, core/scanner, core/reporter, core/rules, languages

import { loadConfig } from './core/config.js';
import { scanFiles } from './core/scanner.js';
import { report } from './core/reporter.js';
import { universalRules } from './core/rules.js';
import { loadLanguageRules } from './languages/index.js';

// @contract: (projectPath:str, options?:{fix:bool}) -> Promise<{passed:num, failed:num, warnings:num, results:object[]}>
// @throws: never
// @pure: false
// @complexity: O(n*m) where n=files, m=checks
// AOCS-INVARIANT: passed + failed >= 0
export async function validate(projectPath, options = {}) {
  // 1. Load config
  const { config, errors } = await loadConfig(projectPath);
  
  // If config has errors, report them and stop
  if (errors.length > 0) {
    const configResult = {
      id: 'config-load',
      name: 'Configuration loading',
      level: 'error',
      violations: errors.map(e => ({ message: e }))
    };
    
    const summary = report([configResult]);
    return { ...summary, results: [configResult] };
  }
  
  // 2. Scan files
  const files = await scanFiles(projectPath, config);
  
  // 3. Collect all rules (universal + language-specific)
  const rules = [...universalRules, ...loadLanguageRules(config)];
  
  // 4. Run all checks
  const results = [];
  
  for (const rule of rules) {
    try {
      const result = await rule.check(projectPath, config, files);
      const entry = {
        id: rule.id,
        name: rule.name,
        level: rule.level,
        violations: result.violations || []
      };
      // Merge check-level warnings as separate warn-level results
      if (result.warnings && result.warnings.length > 0) {
        results.push(entry);
        results.push({
          id: rule.id + '-warnings',
          name: rule.name + ' (warnings)',
          level: 'warn',
          violations: result.warnings
        });
      } else {
        results.push(entry);
      }
    } catch (err) {
      results.push({
        id: rule.id,
        name: rule.name,
        level: 'error',
        violations: [{ message: `Check failed: ${err.message}` }]
      });
    }
  }
  
  // 5. Report results
  const summary = report(results);
  
  // 6. Return summary
  return { ...summary, results };
}
