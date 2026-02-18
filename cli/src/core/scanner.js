// AOCS-ROLE: pure-logic
// AOCS-INPUTS: config, filesystem
// AOCS-OUTPUTS: file list
// @module: aocs-validator/scanner
// @exports: scanFiles
// @depends: fs, path

import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const langExtMap = {
  javascript: ['.js', '.mjs', '.cjs'],
  js: ['.js', '.mjs', '.cjs'],
  typescript: ['.ts', '.tsx'],
  ts: ['.ts', '.tsx'],
  python: ['.py'],
  html: ['.html', '.htm'],
  css: ['.css'],
  go: ['.go'],
  rust: ['.rs'],
  java: ['.java']
};

const skipDirs = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '.next', 'out']);

// @contract: (dir:str, extensions:str[]) -> Promise<string[]>
// @pure: false
async function walkDir(dir, extensions) {
  const results = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip test fixtures (intentionally invalid files)
        if (fullPath.includes('/test/fixtures/') || fullPath.includes('\\test\\fixtures\\')) {
          continue;
        }
        
        if (!skipDirs.has(entry.name) && !entry.name.startsWith('.')) {
          const subFiles = await walkDir(fullPath, extensions);
          results.push(...subFiles);
        }
      } else if (entry.isFile()) {
        // Skip minified files (vendor/generated)
        if (entry.name.endsWith('.min.js') || entry.name.endsWith('.min.css')) {
          continue;
        }
        
        const ext = extname(entry.name);
        if (extensions.includes(ext)) {
          results.push(fullPath);
        }
      }
    }
  } catch (err) {
    // Skip directories we can't read
  }
  
  return results;
}

// @contract: (projectPath:str, config:object) -> Promise<string[]>
export async function scanFiles(projectPath, config) {
  if (!config || !config.languages) {
    return [];
  }
  
  const extensions = new Set();
  
  for (const lang of config.languages) {
    const exts = langExtMap[lang.toLowerCase()];
    if (exts) {
      exts.forEach(e => extensions.add(e));
    }
  }
  
  if (extensions.size === 0) {
    return [];
  }
  
  return await walkDir(projectPath, Array.from(extensions));
}
