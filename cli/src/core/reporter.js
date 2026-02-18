// AOCS-ROLE: ui-binding
// AOCS-INPUTS: check results
// AOCS-OUTPUTS: formatted terminal output
// @module: aocs-validator/reporter
// @exports: report
// @depends: none

// @contract: (results:object[]) -> {passed:num, failed:num, warnings:num}
// @pure: true
// @complexity: O(n) where n = results.length
// AOCS-INVARIANT: passed + failed >= 0
export function report(results) {
  let passed = 0;
  let failed = 0;
  let warnings = 0;
  
  for (const result of results) {
    if (result.level === 'error') {
      if (result.violations && result.violations.length > 0) {
        failed++;
        console.log(`❌ FAIL: ${result.name}`);
        for (const v of result.violations) {
          if (v.file && v.line) {
            console.log(`  ${v.file}:${v.line} — ${v.message}`);
          } else {
            console.log(`  ${v.message}`);
          }
        }
      } else {
        passed++;
        console.log(`✅ PASS: ${result.name}`);
      }
    } else if (result.level === 'warn') {
      if (result.violations && result.violations.length > 0) {
        warnings++;
        console.log(`⚠️  WARN: ${result.name}`);
        for (const v of result.violations) {
          if (v.file && v.line) {
            console.log(`  ${v.file}:${v.line} — ${v.message}`);
          } else {
            console.log(`  ${v.message}`);
          }
        }
      }
    }
  }
  
  console.log('');
  console.log(`Summary: ${passed} passed, ${failed} failed, ${warnings} warnings`);
  
  return { passed, failed, warnings };
}
