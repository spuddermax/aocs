// AOCS-ROLE: config
// AOCS-INPUTS: none
// AOCS-OUTPUTS: rule registry
// @module: aocs-validator/rules
// @exports: universalRules
// @depends: checks/*

import { checkAocsJson } from '../checks/aocs-json.js';
import { checkAgentReadme } from '../checks/agent-readme.js';
import { checkFileRoles } from '../checks/file-roles.js';
import { checkContracts } from '../checks/contracts.js';
import { checkHints } from '../checks/hints.js';
import { checkForbidden } from '../checks/forbidden.js';
import { checkModuleManifest } from '../checks/module-manifest.js';

// @contract: () -> object[]
// @pure: true
// @complexity: O(1)
// AOCS-INVARIANT: all rules have id, name, level, and check function
export const universalRules = [
  {
    id: 'U8-repo-contract',
    name: 'Repository contract (aocs.json) exists and valid',
    level: 'error',
    check: checkAocsJson
  },
  {
    id: 'U13-agent-readme',
    name: 'Agent README exists and ≤200 tokens',
    level: 'warn',
    check: checkAgentReadme
  },
  {
    id: 'U9-file-roles',
    name: 'File roles declared (AOCS-ROLE)',
    level: 'error',
    check: checkFileRoles
  },
  {
    id: 'U2-contracts',
    name: 'Function contracts (@contract)',
    level: 'error',
    check: checkContracts
  },
  {
    id: 'U10-hints',
    name: 'Structured hints well-formed',
    level: 'warn',
    check: checkHints
  },
  {
    id: 'U12-forbidden',
    name: 'Forbidden patterns not present',
    level: 'error',
    check: checkForbidden
  },
  {
    id: 'U1-module-manifest',
    name: 'Module manifests (@module)',
    level: 'warn',
    check: checkModuleManifest
  }
];
