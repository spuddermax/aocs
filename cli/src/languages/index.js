// AOCS-ROLE: config
// AOCS-INPUTS: config
// AOCS-OUTPUTS: language-specific rules
// @module: aocs-validator/languages
// @exports: loadLanguageRules
// @depends: languages/*

import { javascriptRules } from './javascript.js';
import { htmlRules } from './html.js';
import { cssRules } from './css.js';

const languageModules = {
  javascript: javascriptRules,
  js: javascriptRules,
  typescript: javascriptRules,
  ts: javascriptRules,
  html: htmlRules,
  css: cssRules
};

// @contract: (config:object) -> object[]
// @pure: true
// @complexity: O(n) where n = config.languages.length
export function loadLanguageRules(config) {
  if (!config || !config.languages) {
    return [];
  }
  
  const rules = [];
  
  for (const lang of config.languages) {
    const langRules = languageModules[lang.toLowerCase()];
    if (langRules) {
      rules.push(...langRules);
    }
  }
  
  return rules;
}
