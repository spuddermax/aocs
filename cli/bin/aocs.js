#!/usr/bin/env node

// AOCS-ROLE: ui-binding
// AOCS-INPUTS: command-line arguments
// AOCS-OUTPUTS: terminal output, exit code
// @module: aocs-cli
// @exports: none (CLI entry point)
// @depends: ../src/index.js, fs, path, readline

import { validate } from '../src/index.js';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const command = args[0];

// @contract: () -> Promise<string>
// @pure: false
async function getVersion() {
  const pkgPath = join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
  return pkg.version;
}

// @contract: () -> void
// @pure: true
function showHelp() {
  console.log(`
AOCS Validator v0.7.0

Usage:
  aocs validate [path]     Validate an AOCS project (default: current directory)
  aocs validate --fix      Auto-fix violations (not yet implemented)
  aocs init                Initialize aocs.json and README.agent.md
  aocs --version           Show version
  aocs --help              Show this help

Examples:
  aocs validate
  aocs validate /path/to/project
  aocs init
`);
}

// @contract: (prompt:str) -> Promise<str>
// @pure: false
function ask(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    rl.question(prompt, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

// @contract: () -> Promise<void>
// @pure: false
async function initProject() {
  console.log('Initialize AOCS project\n');
  
  const name = await ask('Project name: ');
  const languagesInput = await ask('Languages (comma-separated, e.g. javascript,html,css): ');
  const mode = await ask('Mode (lite/strict) [strict]: ') || 'strict';
  
  const languages = languagesInput.split(',').map(l => l.trim()).filter(l => l.length > 0);
  
  if (languages.length === 0) {
    console.error('Error: At least one language is required');
    process.exit(1);
  }
  
  const config = {
    aocsVersion: '0.7',
    languages,
    mode,
    forbiddenPatterns: ['dynamic-eval', 'implicit-global']
  };
  
  const readme = `# Agent Context — ${name}

This repo follows AOCS v0.7. See aocs.json for constraints.

## Rules
- File roles declared via AOCS-ROLE in first 5 lines
- Function contracts (@contract) on all public functions
- No forbidden patterns (see aocs.json)

## Key Files
- aocs.json — repository contract
`;

  try {
    await writeFile('aocs.json', JSON.stringify(config, null, 2), 'utf-8');
    console.log('✅ Created aocs.json');
    
    await writeFile('README.agent.md', readme, 'utf-8');
    console.log('✅ Created README.agent.md');
    
    console.log('\nDone! Run `aocs validate` to check your project.');
  } catch (err) {
    console.error('Error creating files:', err.message);
    process.exit(1);
  }
}

// @contract: (path:str, fix:bool) -> Promise<void>
// @pure: false
async function runValidate(projectPath, fix = false) {
  if (fix) {
    console.log('⚠️  Auto-fix not yet implemented\n');
  }
  
  const result = await validate(projectPath);
  
  process.exit(result.failed > 0 ? 1 : 0);
}

// Main
(async () => {
  try {
    if (!command || command === '--help' || command === 'help') {
      showHelp();
      process.exit(0);
    }
    
    if (command === '--version' || command === 'version') {
      const version = await getVersion();
      console.log(`aocs v${version}`);
      process.exit(0);
    }
    
    if (command === 'init') {
      await initProject();
      process.exit(0);
    }
    
    if (command === 'validate') {
      const hasFix = args.includes('--fix');
      const pathArg = args[1]; // First arg after 'validate'
      const projectPath = pathArg && !pathArg.startsWith('--') ? pathArg : process.cwd();
      
      await runValidate(projectPath, hasFix);
    } else {
      console.error(`Unknown command: ${command}`);
      console.error('Run `aocs --help` for usage information');
      process.exit(1);
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
