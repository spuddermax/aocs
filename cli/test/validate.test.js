// AOCS-ROLE: pure-logic
// AOCS-INPUTS: test fixtures
// AOCS-OUTPUTS: test results
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validate } from '../src/index.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('aocs validate', () => {
  it('passes on valid fixture', async () => {
    const result = await validate(path.join(__dirname, 'fixtures/valid'));
    assert.strictEqual(result.failed, 0);
  });

  it('finds violations in invalid fixture', async () => {
    const result = await validate(path.join(__dirname, 'fixtures/invalid'));
    assert.ok(result.failed > 0);
  });
});
