// Run: npm test   (Node 18+). Checks that each synthetic example gets the expected educational result.
import assert from 'node:assert/strict';
import { examples, generateExample } from '../public/data/examples.js';
import { rules, minPoints } from '../public/data/rules.js';
import { evaluate } from '../public/js/features.js';

const expected = { internal: 'internal', surface: 'surface', corona: 'corona', noise: 'noise', mixed: 'ambiguous' };
let failed = 0;
for (const ex of examples) {
  const pts = generateExample(ex);
  const r = evaluate(pts, rules, minPoints);
  const got = r.status === 'match' ? r.best.id : r.status;
  const summary = r.matches.map((m) => `${m.id}:${m.level}`).join(' ');
  const ok = got === expected[ex.id];
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${ex.id.padEnd(9)} -> ${got.padEnd(10)} [${summary}]`);
  if (!ok) console.log('   features', JSON.stringify(r.features, (k, v) => (typeof v === 'number' ? +v.toFixed(2) : v)));
}
// Edge cases
assert.equal(evaluate([], rules, minPoints).status, 'empty');
assert.equal(evaluate([{ phase: 45, magnitude: 20 }], rules, minPoints).status, 'single');
assert.equal(evaluate(Array.from({ length: 5 }, (_, i) => ({ phase: 30 + i, magnitude: 20 })), rules, minPoints).status, 'insufficient');
// determinism
assert.deepEqual(generateExample(examples[0]), generateExample(examples[0]));
console.log(failed ? `${failed} example(s) failed` : 'All classifier checks passed');
process.exit(failed ? 1 : 0);
