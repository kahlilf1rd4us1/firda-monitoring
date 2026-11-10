// Inline SVG diagrams. Each function returns an SVG string. Colours come from CSS classes
// (see .dg-* in styles.css) so the diagrams follow light/dark mode automatically.

let uid = 0;
const arrowDefs = (id) => `
  <defs>
    <marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 10 5 0 10z" class="dg-arrow"/>
    </marker>
    <marker id="${id}a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 10 5 0 10z" class="dg-arrow-acc"/>
    </marker>
  </defs>`;

const spark = (x, y, s = 1) =>
  `<path class="dg-spark" transform="translate(${x} ${y}) scale(${s})" d="M2-9-5 1h4l-2 8 8-11H1l2-7z"/>`;

/** Cross-section of an insulation system showing the three defect families. */
export function defectsDiagram() {
  const m = 'm' + ++uid;
  return `<svg viewBox="0 0 760 300" role="img" aria-labelledby="${m}t">
  <title id="${m}t">Insulation cross-section with an internal void, a surface discharge path and a sharp point causing corona</title>
  ${arrowDefs(m)}
  <!-- HV conductor -->
  <rect x="20" y="30" width="720" height="34" class="dg-cond" rx="4"/>
  <text x="380" y="52" text-anchor="middle" class="dg-bold" style="fill:var(--surface)">High-voltage conductor</text>
  <!-- Solid insulation -->
  <rect x="20" y="64" width="470" height="150" class="dg-ins"/>
  <text x="34" y="86" class="dg-small">Solid insulation (e.g. XLPE, epoxy, mica)</text>
  <!-- Earth -->
  <rect x="20" y="214" width="720" height="24" class="dg-fill"/>
  <text x="380" y="231" text-anchor="middle" class="dg-text">Earthed screen / tank / core</text>
  <!-- 1. internal void -->
  <ellipse cx="140" cy="142" rx="34" ry="14" fill="var(--surface)" class="dg-line"/>
  ${spark(140, 142, 1.1)}
  <text x="140" y="270" text-anchor="middle" class="dg-bold">① Internal discharge</text>
  <text x="140" y="288" text-anchor="middle" class="dg-small">gas void inside the insulation</text>
  <line x1="140" y1="252" x2="140" y2="162" class="dg-thin" marker-end="url(#${m})"/>
  <!-- 2. surface -->
  <path d="M490 64 Q500 140 490 214" class="dg-line"/>
  <path d="M492 90 q10 8 2 18 q-8 10 4 20 q10 8 0 20" class="dg-accent"/>
  ${spark(500, 120, .9)}
  <text x="430" y="270" text-anchor="middle" class="dg-bold">② Surface discharge</text>
  <text x="430" y="288" text-anchor="middle" class="dg-small">along an interface / contaminated surface</text>
  <line x1="450" y1="252" x2="488" y2="160" class="dg-thin" marker-end="url(#${m})"/>
  <!-- 3. corona -->
  <path d="M640 64 L652 120 L664 64 z" class="dg-cond"/>
  <path d="M652 126 l-14 18 M652 126 l0 22 M652 126 l14 18 M652 126 l-20 6 M652 126 l20 6" class="dg-accent"/>
  <text x="652" y="196" text-anchor="middle" class="dg-small">air / gas</text>
  <text x="652" y="270" text-anchor="middle" class="dg-bold">③ Corona</text>
  <text x="652" y="288" text-anchor="middle" class="dg-small">sharp point in a gas</text>
  <line x1="652" y1="252" x2="652" y2="206" class="dg-thin" marker-end="url(#${m})"/>
  <!-- field arrows -->
  <line x1="300" y1="72" x2="300" y2="206" class="dg-dash" marker-end="url(#${m})"/>
  <text x="308" y="148" class="dg-small">E (electric field)</text>
</svg>`;
}

/** Why a gas void sees a higher field than the solid around it. */
export function voidFieldDiagram() {
  const m = 'm' + ++uid;
  return `<svg viewBox="0 0 760 230" role="img" aria-labelledby="${m}t">
  <title id="${m}t">Field enhancement in a flat void and the a-b-c capacitor model</title>
  ${arrowDefs(m)}
  <rect x="20" y="20" width="300" height="16" class="dg-cond"/>
  <rect x="20" y="36" width="300" height="140" class="dg-ins"/>
  <rect x="20" y="176" width="300" height="16" class="dg-cond"/>
  <rect x="110" y="96" width="120" height="20" fill="var(--surface)" class="dg-line"/>
  <text x="170" y="111" text-anchor="middle" class="dg-small">gas, εr≈1</text>
  <text x="34" y="58" class="dg-small">solid, εr≈2.3–5</text>
  <line x1="60" y1="40" x2="60" y2="172" class="dg-thin" marker-end="url(#${m})"/>
  <text x="66" y="140" class="dg-small">E</text>
  <line x1="170" y1="118" x2="170" y2="172" class="dg-thin" marker-end="url(#${m})"/>
  <line x1="170" y1="40" x2="170" y2="94" class="dg-thin" marker-end="url(#${m})"/>
  <line x1="186" y1="98" x2="186" y2="114" class="dg-accent" marker-end="url(#${m}a)"/>
  <text x="240" y="92" class="dg-small">E in void ≈ εr × E</text>
  <text x="170" y="214" text-anchor="middle" class="dg-text">Flat void across the field</text>

  <!-- abc model -->
  <g transform="translate(400 0)">
    <line x1="170" y1="20" x2="170" y2="40" class="dg-line"/>
    <line x1="30" y1="40" x2="300" y2="40" class="dg-line"/>
    <line x1="30" y1="190" x2="300" y2="190" class="dg-line"/>
    <!-- Ca -->
    <line x1="60" y1="40" x2="60" y2="108" class="dg-line"/><line x1="40" y1="108" x2="80" y2="108" class="dg-line"/>
    <line x1="40" y1="120" x2="80" y2="120" class="dg-line"/><line x1="60" y1="120" x2="60" y2="190" class="dg-line"/>
    <text x="86" y="118" class="dg-text">C<tspan font-size="10" dy="3">a</tspan></text>
    <text x="40" y="214" class="dg-small">healthy bulk</text>
    <!-- Cb -->
    <line x1="220" y1="40" x2="220" y2="66" class="dg-line"/><line x1="200" y1="66" x2="240" y2="66" class="dg-line"/>
    <line x1="200" y1="76" x2="240" y2="76" class="dg-line"/><line x1="220" y1="76" x2="220" y2="104" class="dg-line"/>
    <text x="246" y="75" class="dg-text">C<tspan font-size="10" dy="3">b</tspan></text>
    <!-- Cc with gap -->
    <line x1="220" y1="104" x2="220" y2="124" class="dg-line"/><line x1="200" y1="124" x2="240" y2="124" class="dg-line"/>
    <line x1="200" y1="134" x2="240" y2="134" class="dg-line"/><line x1="220" y1="134" x2="220" y2="190" class="dg-line"/>
    <text x="246" y="133" class="dg-text">C<tspan font-size="10" dy="3">c</tspan></text>
    <path d="M220 104 h-40 v12" class="dg-line"/><path d="M180 142 v48" class="dg-line"/>
    <circle cx="180" cy="122" r="5" class="dg-line"/><circle cx="180" cy="136" r="5" class="dg-line"/>
    ${spark(180, 129, .7)}
    <text x="120" y="160" class="dg-small">gap fires</text>
    <text x="236" y="214" class="dg-small">void path</text>
    <text x="170" y="14" text-anchor="middle" class="dg-small">HV</text>
  </g>
</svg>`;
}

/** Sine wave with PD pulses and their projection onto a PRPD plot. */
export function prpdConceptDiagram() {
  const m = 'm' + ++uid;
  const W = 300, x0 = 40, y0 = 110, A = 70;
  let wave = '';
  for (let d = 0; d <= 360; d += 5) {
    const x = x0 + (d / 360) * W, y = y0 - A * Math.sin((d * Math.PI) / 180);
    wave += (d ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
  }
  const pulses = [[30, 34], [52, 46], [70, 28], [210, 36], [232, 48], [250, 30]];
  const pulseSvg = pulses
    .map(([d, h]) => {
      const x = x0 + (d / 360) * W, cls = d < 180 ? 'dg-pos' : 'dg-neg';
      const s = d < 180 ? -1 : 1;
      return `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + s * h}" class="${cls}"/>`;
    })
    .join('');
  const pts = pulses
    .map(([d, h]) => `<circle cx="${430 + (d / 360) * W}" cy="${180 - h * 1.9}" r="4.5" class="dg-spark"/>`)
    .join('');
  return `<svg viewBox="0 0 760 230" role="img" aria-labelledby="${m}t">
  <title id="${m}t">PD pulses occurring at specific phases of the AC voltage, plotted as phase versus magnitude</title>
  ${arrowDefs(m)}
  <line x1="${x0}" y1="${y0}" x2="${x0 + W}" y2="${y0}" class="dg-thin"/>
  <path d="${wave}" class="dg-dash"/>
  ${pulseSvg}
  <text x="${x0}" y="20" class="dg-bold">1. Pulses during the AC cycle (time view)</text>
  <text x="${x0}" y="210" class="dg-small">0°</text><text x="${x0 + W / 2}" y="210" text-anchor="middle" class="dg-small">180°</text><text x="${x0 + W}" y="210" text-anchor="end" class="dg-small">360°</text>
  <text x="${x0 + 8}" y="40" class="dg-small">+ half-cycle</text><text x="${x0 + W - 8}" y="196" text-anchor="end" class="dg-small">− half-cycle</text>
  <line x1="350" y1="110" x2="410" y2="110" class="dg-accent" marker-end="url(#${m}a)"/>
  <text x="380" y="100" text-anchor="middle" class="dg-small">fold many</text><text x="380" y="128" text-anchor="middle" class="dg-small">cycles</text>
  <g>
    <text x="430" y="20" class="dg-bold">2. PRPD plot (phase vs magnitude)</text>
    <line x1="430" y1="180" x2="${430 + W}" y2="180" class="dg-line"/><line x1="430" y1="40" x2="430" y2="180" class="dg-line"/>
    <line x1="${430 + W / 2}" y1="40" x2="${430 + W / 2}" y2="180" class="dg-dash"/>
    ${pts}
    <text x="430" y="198" class="dg-small">0°</text><text x="${430 + W / 2}" y="198" text-anchor="middle" class="dg-small">180°</text><text x="${430 + W}" y="198" text-anchor="end" class="dg-small">360°</text>
    <text x="${430 + W / 2}" y="218" text-anchor="middle" class="dg-small">phase angle →</text>
    <text x="420" y="110" text-anchor="end" class="dg-small" transform="rotate(-90 420 110)">magnitude (|q|) →</text>
  </g>
</svg>`;
}

/** IEC 60270 style measuring circuit. */
export function iec60270Diagram() {
  const m = 'm' + ++uid;
  return `<svg viewBox="0 0 760 250" role="img" aria-labelledby="${m}t">
  <title id="${m}t">Conventional apparent-charge measuring circuit: HV source, filter, test object, coupling capacitor, measuring impedance and instrument</title>
  ${arrowDefs(m)}
  <!-- top HV bus -->
  <line x1="80" y1="50" x2="620" y2="50" class="dg-line"/>
  <line x1="80" y1="200" x2="620" y2="200" class="dg-line"/>
  <!-- source -->
  <circle cx="80" cy="125" r="28" class="dg-fill"/><path d="M64 125 q8-14 16 0 t16 0" class="dg-line"/>
  <line x1="80" y1="50" x2="80" y2="97" class="dg-line"/><line x1="80" y1="153" x2="80" y2="200" class="dg-line"/>
  <text x="80" y="236" text-anchor="middle" class="dg-text">HV source</text>
  <text x="80" y="250" text-anchor="middle" class="dg-small">AC / VLF / DAC</text>
  <!-- filter -->
  <rect x="150" y="38" width="70" height="24" class="dg-fill"/><text x="185" y="30" text-anchor="middle" class="dg-small">filter Z</text>
  <!-- Test object Ca -->
  <line x1="320" y1="50" x2="320" y2="112" class="dg-line"/><line x1="296" y1="112" x2="344" y2="112" class="dg-line"/>
  <line x1="296" y1="124" x2="344" y2="124" class="dg-line"/><line x1="320" y1="124" x2="320" y2="200" class="dg-line"/>
  ${spark(352, 104, .8)}
  <text x="320" y="236" text-anchor="middle" class="dg-text">Test object C<tspan font-size="10" dy="3">a</tspan></text>
  <!-- Coupling capacitor Ck -->
  <line x1="500" y1="50" x2="500" y2="92" class="dg-line"/><line x1="476" y1="92" x2="524" y2="92" class="dg-line"/>
  <line x1="476" y1="104" x2="524" y2="104" class="dg-line"/><line x1="500" y1="104" x2="500" y2="132" class="dg-line"/>
  <text x="530" y="102" class="dg-text">C<tspan font-size="10" dy="3">k</tspan></text>
  <!-- Zm -->
  <rect x="486" y="132" width="28" height="44" class="dg-fill"/><line x1="500" y1="176" x2="500" y2="200" class="dg-line"/>
  <text x="458" y="160" text-anchor="end" class="dg-text">Z<tspan font-size="10" dy="3">m</tspan></text>
  <!-- instrument -->
  <line x1="514" y1="154" x2="620" y2="154" class="dg-line" marker-end="url(#${m})"/>
  <rect x="622" y="126" width="118" height="56" rx="6" class="dg-fill"/>
  <text x="681" y="150" text-anchor="middle" class="dg-bold">PD instrument</text>
  <text x="681" y="168" text-anchor="middle" class="dg-small">pC, phase, PRPD</text>
  <text x="500" y="236" text-anchor="middle" class="dg-text">Coupling device</text>
  <!-- calibrator -->
  <rect x="380" y="70" width="70" height="24" rx="4" class="dg-fill" style="stroke-dasharray:4 3"/>
  <text x="415" y="86" text-anchor="middle" class="dg-small">calibrator</text>
  <path d="M380 82 H350" class="dg-dash" marker-end="url(#${m})"/>
  <!-- current loop -->
  <path d="M330 140 q60 30 160 4" class="dg-accent" marker-end="url(#${m}a)"/>
  <text x="408" y="182" text-anchor="middle" class="dg-small">PD current pulse loop</text>
</svg>`;
}

/** Cable TDR: direct and reflected pulses. */
export function tdrDiagram() {
  const m = 'm' + ++uid;
  return `<svg viewBox="0 0 760 330" role="img" aria-labelledby="${m}t">
  <title id="${m}t">Single-ended PD location on a cable: a PD at distance x sends one pulse directly to the near end and one to the far end, where it reflects back</title>
  ${arrowDefs(m)}
  <rect x="20" y="40" width="96" height="44" rx="6" class="dg-fill"/>
  <text x="68" y="60" text-anchor="middle" class="dg-bold">Test set</text><text x="68" y="76" text-anchor="middle" class="dg-small">+ PD detector</text>
  <rect x="116" y="56" width="600" height="12" rx="6" class="dg-ins"/>
  <text x="120" y="34" class="dg-small">near end (x = 0)</text>
  <text x="716" y="34" text-anchor="end" class="dg-small">far end (x = L), open</text>
  ${spark(400, 62, 1)}
  <text x="400" y="104" text-anchor="middle" class="dg-bold">PD site at x</text>
  <!-- paths -->
  <path d="M396 120 H124" class="dg-pos" marker-end="url(#${m})"/>
  <text x="260" y="114" text-anchor="middle" class="dg-small">① direct pulse travels x</text>
  <path d="M404 140 H708 v16 H124" class="dg-neg" marker-end="url(#${m})"/>
  <text x="560" y="134" text-anchor="middle" class="dg-small">② travels L − x, reflects</text>
  <text x="420" y="172" text-anchor="middle" class="dg-small">… then travels back the full length L</text>
  <!-- time trace -->
  <line x1="120" y1="280" x2="720" y2="280" class="dg-line" marker-end="url(#${m})"/>
  <text x="720" y="300" text-anchor="end" class="dg-small">time at near end →</text>
  <path d="M120 280 H240 l4 -64 l4 64 H520 l4 -40 l4 40 H700" class="dg-line"/>
  <text x="244" y="206" text-anchor="middle" class="dg-text">① t₁ = x / v</text>
  <text x="524" y="230" text-anchor="middle" class="dg-text">② t₂ = (2L − x) / v</text>
  <line x1="246" y1="300" x2="522" y2="300" class="dg-thin" marker-start="url(#${m})" marker-end="url(#${m})"/>
  <text x="384" y="320" text-anchor="middle" class="dg-bold">Δt = t₂ − t₁ = 2(L − x)/v  ⇒  x = L − v·Δt/2</text>
  <text x="540" y="262" class="dg-small">smaller + wider (attenuation, dispersion)</text>
</svg>`;
}

/** MV switchgear panel with TEV, ultrasonic and UHF sensors. */
export function switchgearDiagram() {
  const m = 'm' + ++uid;
  return `<svg viewBox="0 0 760 300" role="img" aria-labelledby="${m}t">
  <title id="${m}t">Metal-clad switchgear panel showing where TEV, airborne ultrasonic, UHF and HFCT sensors are applied</title>
  ${arrowDefs(m)}
  <rect x="250" y="20" width="230" height="260" rx="4" class="dg-fill"/>
  <rect x="270" y="40" width="190" height="70" class="dg-ins"/><text x="365" y="80" text-anchor="middle" class="dg-small">busbar chamber</text>
  <rect x="270" y="120" width="190" height="70" class="dg-ins"/><text x="365" y="160" text-anchor="middle" class="dg-small">circuit breaker</text>
  <rect x="270" y="200" width="190" height="60" class="dg-ins"/><text x="365" y="236" text-anchor="middle" class="dg-small">cable box</text>
  ${spark(320, 150, .9)}
  <line x1="250" y1="116" x2="250" y2="118" class="dg-line"/>
  <!-- seam gap -->
  <line x1="480" y1="114" x2="500" y2="114" class="dg-dash"/>
  <!-- TEV -->
  <rect x="226" y="130" width="22" height="34" rx="3" class="dg-cond"/>
  <path d="M220 147 H150" class="dg-line" marker-end="url(#${m})"/>
  <text x="140" y="138" text-anchor="end" class="dg-bold">TEV sensor</text>
  <text x="140" y="154" text-anchor="end" class="dg-small">on the metal skin;</text>
  <text x="140" y="168" text-anchor="end" class="dg-small">dBmV, internal PD</text>
  <!-- ultrasonic -->
  <path d="M488 108 q12 6 0 12 M496 102 q18 12 0 24" class="dg-accent"/>
  <rect x="520" y="100" width="40" height="28" rx="4" class="dg-cond"/>
  <text x="572" y="108" class="dg-bold">Airborne ultrasonic</text>
  <text x="572" y="124" class="dg-small">at vents / gaps; dBµV,</text>
  <text x="572" y="138" class="dg-small">surface PD &amp; corona in air</text>
  <!-- UHF -->
  <path d="M520 40 l20 -10 l0 20 z" class="dg-cond"/>
  <text x="550" y="40" class="dg-bold">UHF antenna</text>
  <text x="550" y="56" class="dg-small">via window / gasket; dBm or mV</text>
  <!-- HFCT -->
  <ellipse cx="365" cy="282" rx="22" ry="8" class="dg-line"/>
  <line x1="365" y1="260" x2="365" y2="296" class="dg-line"/>
  <path d="M392 282 H560" class="dg-line" marker-start="url(#${m})"/>
  <text x="572" y="278" class="dg-bold">HFCT on cable earth</text>
  <text x="572" y="294" class="dg-small">pC-like or mV; cable PD</text>
</svg>`;
}

/** Power transformer with electrical, UHF and acoustic sensors. */
export function transformerDiagram() {
  const m = 'm' + ++uid;
  return `<svg viewBox="0 0 760 300" role="img" aria-labelledby="${m}t">
  <title id="${m}t">Power transformer showing bushing-tap electrical coupling, UHF drain-valve probe and acoustic sensors on the tank</title>
  ${arrowDefs(m)}
  <rect x="220" y="90" width="300" height="180" rx="8" class="dg-fill"/>
  <rect x="270" y="120" width="70" height="130" rx="6" class="dg-ins"/><rect x="400" y="120" width="70" height="130" rx="6" class="dg-ins"/>
  <text x="370" y="286" text-anchor="middle" class="dg-small">oil-filled tank, windings + core</text>
  ${spark(440, 170, .9)}
  <!-- bushings -->
  <path d="M290 90 v-50 M310 90 v-50" class="dg-line"/><rect x="285" y="40" width="30" height="12" class="dg-cond"/>
  <path d="M420 90 v-50 M440 90 v-50" class="dg-line"/><rect x="415" y="40" width="30" height="12" class="dg-cond"/>
  <circle cx="300" cy="80" r="5" class="dg-spark"/>
  <path d="M294 80 H170" class="dg-line" marker-end="url(#${m})"/>
  <text x="160" y="72" text-anchor="end" class="dg-bold">Bushing test tap</text>
  <text x="160" y="88" text-anchor="end" class="dg-small">IEC 60270, pC (factory/site)</text>
  <!-- UHF drain valve -->
  <rect x="200" y="226" width="20" height="18" class="dg-cond"/>
  <path d="M198 235 H140" class="dg-line" marker-end="url(#${m})"/>
  <text x="130" y="230" text-anchor="end" class="dg-bold">UHF probe</text>
  <text x="130" y="246" text-anchor="end" class="dg-small">drain valve / window; dBm</text>
  <!-- acoustic sensors -->
  <rect x="520" y="120" width="14" height="22" class="dg-cond"/><rect x="520" y="200" width="14" height="22" class="dg-cond"/>
  <rect x="380" y="270" width="22" height="12" class="dg-cond"/>
  <path d="M446 168 L518 132 M446 172 L518 210 M442 176 L390 268" class="dg-dash"/>
  <text x="548" y="150" class="dg-bold">Acoustic emission sensors</text>
  <text x="548" y="166" class="dg-small">on tank wall; time of arrival</text>
  <text x="548" y="180" class="dg-small">differences → location</text>
</svg>`;
}

/** Stator winding with coupling capacitors. */
export function statorDiagram() {
  const m = 'm' + ++uid;
  return `<svg viewBox="0 0 760 260" role="img" aria-labelledby="${m}t">
  <title id="${m}t">Rotating machine stator: coupling capacitors at the line terminals feed a PD instrument; defects in the slot and the endwinding</title>
  ${arrowDefs(m)}
  <rect x="140" y="60" width="380" height="120" rx="10" class="dg-fill"/>
  <text x="330" y="80" text-anchor="middle" class="dg-small">stator core (earthed)</text>
  <rect x="170" y="104" width="320" height="22" rx="4" class="dg-ins"/>
  <rect x="170" y="140" width="320" height="22" rx="4" class="dg-ins"/>
  <text x="330" y="120" text-anchor="middle" class="dg-small">bar / coil in slot (groundwall insulation)</text>
  ${spark(230, 118, .7)}<text x="230" y="98" text-anchor="middle" class="dg-small">slot / void PD</text>
  <path d="M490 115 q40 0 40 30 q0 30 -40 30" class="dg-line"/>
  ${spark(528, 140, .7)}<text x="560" y="128" class="dg-small">endwinding</text><text x="560" y="142" class="dg-small">surface PD</text>
  <!-- terminals -->
  <line x1="140" y1="115" x2="60" y2="115" class="dg-line"/><text x="56" y="110" text-anchor="end" class="dg-text">U</text>
  <line x1="60" y1="115" x2="60" y2="160" class="dg-line"/>
  <line x1="44" y1="160" x2="76" y2="160" class="dg-line"/><line x1="44" y1="170" x2="76" y2="170" class="dg-line"/>
  <line x1="60" y1="170" x2="60" y2="200" class="dg-line"/><rect x="48" y="200" width="24" height="30" class="dg-fill"/>
  <text x="84" y="168" class="dg-small">coupling capacitor</text><text x="84" y="182" class="dg-small">(e.g. 80 pF – 1 nF)</text>
  <path d="M72 215 H200" class="dg-line" marker-end="url(#${m})"/>
  <rect x="202" y="200" width="150" height="34" rx="6" class="dg-fill"/>
  <text x="277" y="222" text-anchor="middle" class="dg-bold">PD instrument</text>
  <text x="370" y="214" class="dg-small">offline: external source (pC)</text>
  <text x="370" y="230" class="dg-small">online: machine in service (mV)</text>
</svg>`;
}
