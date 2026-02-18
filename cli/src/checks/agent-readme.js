// AOCS-ROLE: io-boundary
// AOCS-INPUTS: filesystem
// AOCS-OUTPUTS: validation results
// @module: aocs-validator/checks/agent-readme
// @exports: checkAgentReadme
// @depends: fs, path

import { readFile } from 'fs/promises';
import { join } from 'path';

// @contract: (projectPath:str, config:object, files:str[]) -> Promise<object>
// @pure: false
// @complexity: O(1)
// AOCS-INVARIANT: returns {violations: object[]}
export async function checkAgentReadme(projectPath, config, files) {
  const violations = [];
  const readmePath = join(projectPath, 'README.agent.md');
  
  try {
    const content = await readFile(readmePath, 'utf-8');
    
    // Approximate token count (split on whitespace)
    const tokens = content.split(/\s+/).filter(t => t.length > 0);
    
    if (tokens.length > 200) {
      violations.push({
        file: 'README.agent.md',
        message: `Token count ${tokens.length} exceeds recommended 200 tokens`
      });
    }
  } catch (err) {
    violations.push({
      message: 'README.agent.md not found'
    });
  }
  
  return { violations };
}
