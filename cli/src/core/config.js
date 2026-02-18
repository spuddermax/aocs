// AOCS-ROLE: config
// AOCS-INPUTS: filesystem (aocs.json)
// AOCS-OUTPUTS: parsed config object
// @module: aocs-validator/config
// @exports: loadConfig
// @depends: fs, path

import { readFile } from 'fs/promises';
import { join } from 'path';

// @contract: (projectPath:str) -> Promise<{config:object|null, errors:str[]}>
// @throws: never
// @pure: false
// @complexity: O(1) time, O(1) space
// AOCS-FAILS-ON: missing aocs.json, invalid JSON, schema violations
export async function loadConfig(projectPath) {
  const errors = [];
  const configPath = join(projectPath, 'aocs.json');
  
  let rawContent;
  try {
    rawContent = await readFile(configPath, 'utf-8');
  } catch (err) {
    errors.push(`aocs.json not found at ${configPath}`);
    return { config: null, errors };
  }
  
  let config;
  try {
    config = JSON.parse(rawContent);
  } catch (err) {
    errors.push(`aocs.json contains invalid JSON: ${err.message}`);
    return { config: null, errors };
  }
  
  // Validate required fields
  if (!config.aocsVersion) {
    errors.push('aocs.json missing required field: aocsVersion');
  }
  
  if (!config.languages) {
    errors.push('aocs.json missing required field: languages');
  } else if (!Array.isArray(config.languages)) {
    errors.push('aocs.json: languages must be an array');
  } else if (config.languages.length === 0) {
    errors.push('aocs.json: languages array cannot be empty');
  }
  
  if (!config.mode) {
    errors.push('aocs.json missing required field: mode');
  } else if (!['lite', 'strict'].includes(config.mode)) {
    errors.push('aocs.json: mode must be "lite" or "strict"');
  }
  
  // Validate optional fields
  if (config.modulePattern && !['agent-module', 'traditional', 'hybrid'].includes(config.modulePattern)) {
    errors.push('aocs.json: modulePattern must be one of: agent-module, traditional, hybrid');
  }
  
  if (config.stateOwnership && !['local-only', 'shared-explicit', 'global-allowed'].includes(config.stateOwnership)) {
    errors.push('aocs.json: stateOwnership must be one of: local-only, shared-explicit, global-allowed');
  }
  
  if (config.sideEffects && !['explicit', 'implicit-allowed'].includes(config.sideEffects)) {
    errors.push('aocs.json: sideEffects must be one of: explicit, implicit-allowed');
  }
  
  if (config.namingSchema && !['verbNoun', 'nounVerb', 'free'].includes(config.namingSchema)) {
    errors.push('aocs.json: namingSchema must be one of: verbNoun, nounVerb, free');
  }
  
  if (config.allowedPatterns && !Array.isArray(config.allowedPatterns)) {
    errors.push('aocs.json: allowedPatterns must be an array');
  }
  
  if (config.forbiddenPatterns && !Array.isArray(config.forbiddenPatterns)) {
    errors.push('aocs.json: forbiddenPatterns must be an array');
  }
  
  if (config.roles && !Array.isArray(config.roles)) {
    errors.push('aocs.json: roles must be an array');
  } else if (config.roles) {
    const validRoles = ['pure-logic', 'state-machine', 'adapter', 'ui-binding', 'io-boundary', 'config'];
    const invalidRoles = config.roles.filter(r => !validRoles.includes(r));
    if (invalidRoles.length > 0) {
      errors.push(`aocs.json: invalid roles: ${invalidRoles.join(', ')}`);
    }
  }
  
  return { config, errors };
}
