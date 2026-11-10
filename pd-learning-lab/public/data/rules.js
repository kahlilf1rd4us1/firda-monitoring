// Transparent, EDUCATIONAL comparison rules for the PRPD simulator.
// These are deliberately simple and are NOT a diagnostic algorithm. They compare a set of
// points with idealised textbook shapes, using features that are explained on screen.
//
// Editing guide:
//  - `minPoints`: below this the app reports "insufficient data".
//  - Each rule has criteria { feature, op, value, key, label, why }.
//      feature: one of the names computed in js/features.js (see FEATURE_INFO there)
//      op: '>=' | '<=' | '>' | '<'
//      key: true = essential for the shape; all key criteria must hold for "partial" or "strong"
//  - Resemblance levels: strong = every criterion met; partial = all key criteria met;
//    weak = at least half of criteria met. Anything else is not shown.

export const minPoints = 10;

export const rules = [
  {
    id: 'internal',
    name: 'Internal (void) discharge',
    criteria: [
      { feature: 'countBalance', op: '>=', value: 0.5, key: true,
        label: 'Both half-cycles active with similar pulse counts',
        why: 'A void enclosed by insulation discharges in both polarities.' },
      { feature: 'risingShare', op: '>=', value: 0.85, key: true,
        label: 'Most pulses on the rising slopes (≈ 330–95° and 150–275°)',
        why: 'Voids fire while |voltage| is increasing towards each peak.' },
      { feature: 'asymmetry', op: '<=', value: 1.5, key: false,
        label: 'Similar magnitudes and counts in both halves (asymmetry ≤ 1.5)',
        why: 'Symmetry suggests a cavity not touching an electrode.' },
      { feature: 'occupiedBins', op: '<=', value: 9, key: false,
        label: 'Phase-correlated (not spread over the whole cycle)',
        why: 'Real PD is tied to the voltage waveform; noise is not.' },
      { feature: 'coronaLikeShare', op: '<', value: 0.25, key: true,
        label: 'No large corona-like sub-group at a voltage peak (< 25% of points)',
        why: 'A dense, constant-magnitude cluster at a peak suggests a second, corona-type source mixed in.' },
    ],
  },
  {
    id: 'surface',
    name: 'Surface discharge',
    criteria: [
      { feature: 'countBalance', op: '>=', value: 0.2, key: true,
        label: 'Activity in both half-cycles',
        why: 'Surface discharges usually occur in both polarities.' },
      { feature: 'asymmetry', op: '>=', value: 1.8, key: true,
        label: 'Clearly asymmetric between halves (asymmetry ≥ 1.8)',
        why: 'Electrode on one side of the surface makes polarities behave differently.' },
      { feature: 'risingShare', op: '>=', value: 0.75, key: false,
        label: 'Mostly on the rising slopes',
        why: 'Like voids, surface PD is driven by the rising voltage.' },
      { feature: 'magCV', op: '>=', value: 0.3, key: false,
        label: 'Wide spread of magnitudes (CV ≥ 0.3)',
        why: 'Surface discharges vary in length and size.' },
      { feature: 'coronaLikeShare', op: '<', value: 0.25, key: true,
        label: 'No large corona-like sub-group at a voltage peak (< 25% of points)',
        why: 'A dense, constant-magnitude cluster at a peak suggests a second, corona-type source mixed in.' },
    ],
  },
  {
    id: 'corona',
    name: 'Corona',
    criteria: [
      { feature: 'peakShare', op: '>=', value: 0.8, key: true,
        label: 'Concentrated around one voltage peak (within ±40° of 90° or 270°)',
        why: 'Corona incepts where the field at a sharp point is highest — near a voltage peak.' },
      { feature: 'magCV', op: '<=', value: 0.3, key: true,
        label: 'Nearly constant magnitude (CV ≤ 0.3)',
        why: 'Trichel-type corona pulses are very regular.' },
      { feature: 'dominantHalfShare', op: '>=', value: 0.85, key: false,
        label: 'Mostly in one half-cycle',
        why: 'At moderate voltage corona appears in one polarity first.' },
    ],
  },
  {
    id: 'noise',
    name: 'Noise / not phase-correlated',
    criteria: [
      { feature: 'occupiedBins', op: '>=', value: 10, key: true,
        label: 'Spread across the whole cycle (≥ 10 of 12 phase bins used)',
        why: 'Random interference does not follow the voltage waveform.' },
      { feature: 'maxBinShare', op: '<=', value: 0.2, key: true,
        label: 'No dominant phase region (busiest 30° bin ≤ 20% of points)',
        why: 'PD would cluster at particular phases.' },
      { feature: 'countBalance', op: '>=', value: 0.6, key: false,
        label: 'Similar counts in both halves',
        why: 'Random pulses fall equally in both halves.' },
    ],
  },
];

// Short educational text shown under "How the comparison rules work".
export const rulesExplanation = `
<p>The tool calculates a few simple <strong>features</strong> from your points and checks them against idealised textbook shapes. Every check is listed with ✓ or ✗ so you can see exactly why a suggestion was made.</p>
<ul>
<li><strong>Strong resemblance</strong>: all checks for a shape pass.</li>
<li><strong>Partial resemblance</strong>: the essential checks pass, some secondary ones do not.</li>
<li><strong>Weak resemblance</strong>: some checks pass, an essential one fails.</li>
</ul>
<p>If there are fewer than 10 points, or no single shape clearly fits, or more than one shape fits, the result is <strong>“Insufficient data or ambiguous pattern”</strong>. No confidence percentages are given, because these rules are not validated against real measurements.</p>
<p>Real PRPD interpretation also uses the test method, sensor, voltage level, trend over time, source separation and location results. Patterns from different defects can look alike.</p>`;
