// AOCS-ROLE: pure-logic
// AOCS-INPUTS: projectPath, config
// AOCS-OUTPUTS: validation results
// @module: aocs-validator/checks/aocs-json
// @exports: checkAocsJson
// @depends: core/config

// @contract: (projectPath:str, config:object|null, files:str[]) -> Promise<object>
// @pure: true
// @complexity: O(1)
// AOCS-INVARIANT: returns {violations: object[]}
export async function checkAocsJson(projectPath, config, files) {
  const violations = [];
  
  // Config errors are violations
  if (!config) {
    violations.push({
      message: 'aocs.json missing or invalid'
    });
  }
  
  return { violations };
}
