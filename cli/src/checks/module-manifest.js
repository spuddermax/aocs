// AOCS-ROLE: pure-logic
// AOCS-INPUTS: source files
// AOCS-OUTPUTS: validation results
// @module: aocs-validator/checks/module-manifest
// @exports: checkModuleManifest
// @depends: fs, path

import { readFile } from 'fs/promises';
import { extname, relative } from 'path';

// @contract: (projectPath:str, config:object, files:str[]) -> Promise<object>
// @pure: false
// @complexity: O(n*m) where n=files, m=lines per file (max 20)
export async function checkModuleManifest(projectPath, config, files) {
  const violations = [];
  
  // Only check JS/TS files
  const jsFiles = files.filter(f => {
    const ext = extname(f);
    return ['.js', '.mjs', '.cjs', '.ts', '.tsx'].includes(ext);
  });
  
  for (const file of jsFiles) {
    try {
      const content = await readFile(file, 'utf-8');
      const lines = content.split('\n').slice(0, 20);
      
      let hasModule = false;
      let hasExports = false;
      let hasDepends = false;
      
      for (const line of lines) {
        if (line.includes('@module:')) hasModule = true;
        if (line.includes('@exports:')) hasExports = true;
        if (line.includes('@depends:')) hasDepends = true;
      }
      
      // Check if file has exports
      const hasExportKeyword = content.includes('export ');
      
      if (hasExportKeyword && !hasModule) {
        violations.push({
          file: relative(projectPath, file),
          line: 1,
          message: 'File has exports but missing @module declaration'
        });
      }
      
      if (hasModule && !hasExports) {
        violations.push({
          file: relative(projectPath, file),
          line: 1,
          message: 'Module declaration present but missing @exports'
        });
      }
    } catch (err) {
      // Skip files we can't read
    }
  }
  
  return { violations };
}
