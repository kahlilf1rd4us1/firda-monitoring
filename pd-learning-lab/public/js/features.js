// Feature extraction + rule evaluation for the PRPD simulator. Pure functions (no DOM),
// so they can be unit-tested with Node (see tests/classifier.test.mjs).

export const FEATURE_INFO = {
  n: { label: 'Number of points', fmt: (v) => String(v) },
  posCount: { label: 'Points in positive half (0–180°)', fmt: (v) => String(v) },
  negCount: { label: 'Points in negative half (180–360°)', fmt: (v) => String(v) },
  countBalance: { label: 'Count balance (smaller half ÷ larger half)', fmt: (v) => v.toFixed(2) },
  asymmetry: { label: 'Asymmetry index (max of count ratio and mean-magnitude ratio)', fmt: (v) => (isFinite(v) ? v.toFixed(2) : '∞ (one half empty)') },
  risingShare: { label: 'Share on rising slopes', fmt: pct },
  peakShare: { label: 'Share within ±40° of the busier peak', fmt: pct },
  dominantHalfShare: { label: 'Share in the busier half-cycle', fmt: pct },
  magCV: { label: 'Magnitude variation (std ÷ mean)', fmt: (v) => v.toFixed(2) },
  occupiedBins: { label: '30° phase bins with activity (of 12)', fmt: (v) => String(v) },
  maxBinShare: { label: 'Share in the busiest 30° bin', fmt: pct },
  coronaLikeShare: { label: 'Corona-like sub-group (near a peak, magnitude within ±20% of its median)', fmt: pct },
};

function pct(v) {
  return Math.round(v * 100) + '%';
}

const inWindow = (p, from, to) => (from <= to ? p >= from && p < to : p >= from || p < to);
const angDist = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

export function halfCycle(phase) {
  return phase < 180 ? 'positive' : 'negative';
}

export function computeFeatures(points) {
  const n = points.length;
  const f = { n };
  if (!n) return f;
  const pos = points.filter((p) => p.phase < 180);
  const neg = points.filter((p) => p.phase >= 180);
  f.posCount = pos.length;
  f.negCount = neg.length;
  const big = Math.max(pos.length, neg.length);
  const small = Math.min(pos.length, neg.length);
  f.countBalance = big ? small / big : 0;
  f.dominantHalfShare = big / n;

  const mean = (arr) => arr.reduce((s, p) => s + p.magnitude, 0) / arr.length;
  let magRatio = Infinity;
  if (pos.length >= 3 && neg.length >= 3) {
    const a = mean(pos), b = mean(neg);
    magRatio = Math.max(a, b) / Math.max(1e-9, Math.min(a, b));
  }
  const countRatio = small ? big / small : Infinity;
  f.asymmetry = Math.max(countRatio, magRatio);

  // Rising |V| slopes, widened slightly before each zero crossing (residual charge effect).
  f.risingShare = points.filter((p) => inWindow(p.phase, 330, 95) || inWindow(p.phase, 150, 275)).length / n;

  const near90 = points.filter((p) => angDist(p.phase, 90) <= 40).length;
  const near270 = points.filter((p) => angDist(p.phase, 270) <= 40).length;
  f.peakShare = Math.max(near90, near270) / n;
  f.peakAt = near270 >= near90 ? 270 : 90;

  // Corona-like sub-population: points close to the busier peak whose magnitudes are tightly grouped.
  const nearPeak = points.filter((p) => angDist(p.phase, f.peakAt) <= 25);
  if (nearPeak.length) {
    const mags = nearPeak.map((p) => p.magnitude).sort((a, b) => a - b);
    const med = mags[Math.floor(mags.length / 2)];
    f.coronaLikeShare = nearPeak.filter((p) => Math.abs(p.magnitude - med) <= 0.2 * med).length / n;
  } else f.coronaLikeShare = 0;

  const m = mean(points);
  const sd = Math.sqrt(points.reduce((s, p) => s + (p.magnitude - m) ** 2, 0) / n);
  f.magCV = m > 0 ? sd / m : 0;

  const bins = new Array(12).fill(0);
  points.forEach((p) => bins[Math.min(11, Math.floor(p.phase / 30))]++);
  const threshold = Math.max(1, 0.03 * n);
  f.occupiedBins = bins.filter((c) => c >= threshold).length;
  f.maxBinShare = Math.max(...bins) / n;
  f.bins = bins;
  return f;
}

const OPS = {
  '>=': (a, b) => a >= b,
  '<=': (a, b) => a <= b,
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
};

/**
 * Evaluate rules. Returns { status, features, matches, message }.
 * status: 'empty' | 'single' | 'insufficient' | 'match' | 'ambiguous'
 */
export function evaluate(points, rules, minPoints) {
  const features = computeFeatures(points);
  if (points.length === 0) return { status: 'empty', features, matches: [] };
  if (points.length === 1) return { status: 'single', features, matches: [] };

  const results = rules.map((rule) => {
    const checks = rule.criteria.map((c) => ({ ...c, actual: features[c.feature], met: OPS[c.op](features[c.feature], c.value) }));
    const keysMet = checks.filter((c) => c.key).every((c) => c.met);
    const metCount = checks.filter((c) => c.met).length;
    let level = null;
    if (keysMet && metCount === checks.length) level = 'strong';
    else if (keysMet) level = 'partial';
    else if (metCount >= checks.length / 2) level = 'weak';
    return { id: rule.id, name: rule.name, level, checks, metCount };
  });
  const rank = { strong: 3, partial: 2, weak: 1 };
  const matches = results.filter((r) => r.level).sort((a, b) => rank[b.level] - rank[a.level] || b.metCount - a.metCount);

  if (points.length < minPoints) {
    return { status: 'insufficient', features, matches, message: `Only ${points.length} points. Add at least ${minPoints} for a pattern comparison.` };
  }
  const strong = matches.filter((m) => m.level === 'strong');
  const strongOrPartial = matches.filter((m) => m.level !== 'weak');
  if (strong.length === 1 && strongOrPartial.length === 1) {
    return { status: 'match', features, matches, best: strong[0] };
  }
  let message;
  if (!strongOrPartial.length) message = 'No reference shape fits well. The points may contain several sources, noise, or a shape not covered by these simple rules.';
  else if (strongOrPartial.length > 1) message = `Several reference shapes fit partly (${strongOrPartial.map((m) => m.name).join(', ')}). This can happen when more than one source is present.`;
  else message = `Closest shape is ${strongOrPartial[0].name}, but not every check passes.`;
  return { status: 'ambiguous', features, matches, message };
}
