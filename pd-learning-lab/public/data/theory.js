// Tab 1 content: PD theory.
// Editing guide:
//  - Each topic has `simple` (always visible), optional `keypoints`, optional `diagram`
//    (name of a function exported from js/diagrams.js) and `deep` (expandable sections).
//  - Cite a reference with [[ref-id]] or [[ref-id:section text]]. Ref ids live in data/references.js.
//  - HTML is allowed inside strings.

export const theoryIntro = `
<h2>Theory &amp; References</h2>
<p>Start with the plain-English explanation in each section. Open the <strong>“Deeper theory”</strong> panels when you want the physics, equations and standard definitions. Small numbers like <a class="cite" href="#references">[1]</a> link to the reference list at the bottom of this tab.</p>`;

export const theoryTopics = [
  {
    id: 'what-is-pd',
    title: 'What is partial discharge?',
    simple: `
<p>A <strong>partial discharge (PD)</strong> is a tiny electrical spark that happens <em>inside or on</em> insulation but does <strong>not</strong> bridge the whole gap between the high-voltage conductor and earth. The insulation still holds the voltage, so the equipment keeps working — but every spark damages a little bit of material.[[iec-60270-2000-amd1-2015:clause 3.1]]</p>
<p>Over months or years, repeated PD can erode the insulation, form carbonised tracks or “electrical trees”, and eventually cause a full breakdown (a fault). That is why PD is one of the most widely used early-warning indicators of insulation problems in cables, switchgear, transformers and rotating machines.[[stone-2005]][[bartnikas-2002]]</p>`,
    keypoints: [
      'PD = a local discharge that only <em>partly</em> bridges the insulation.',
      'It is a <strong>symptom</strong> of a weak spot (a defect or high local stress) and also a <strong>cause</strong> of further ageing.',
      'Each PD event creates a very short current pulse (nanoseconds), plus light, sound, heat, radio-frequency energy and chemical by-products — every PD test method detects one of these effects.',
    ],
    deep: [
      {
        title: 'Deeper theory: what physically happens in one PD event',
        html: `
<p>A discharge needs (1) a local electric field above the inception field of the gas or surface, and (2) a free “starting” electron. When both are present an electron avalanche develops (Townsend or streamer mechanism) and collapses the local field within nanoseconds.[[bartnikas-2002]][[kuffel-2000]]</p>
<p>The rapid charge movement produces a current pulse with rise times of roughly nanoseconds, which travels out to the terminals of the equipment. The same event also releases electromagnetic radiation (up to the UHF range in gas-insulated equipment), acoustic pressure waves, light (UV) and chemical decomposition products (for example ozone in air, or dissolved gases such as hydrogen in transformer oil).[[boggs-1990-pd1]][[cigre-tb-444]]</p>
<p>Because a free electron is not always available, the inception of PD is <strong>statistical</strong>: there is a time lag, and pulse magnitude and phase vary from cycle to cycle. That is why PD is analysed statistically over many cycles (see PRPD below).</p>`,
      },
      {
        title: 'Deeper theory: why PD ages insulation',
        html: `
<ul>
<li><strong>Ion and electron bombardment</strong> erodes the void walls or surface.</li>
<li><strong>Chemical attack</strong>: discharge by-products (ozone, nitrogen oxides, acids in the presence of moisture) degrade organic insulation.</li>
<li><strong>Local heating</strong> and <strong>UV</strong> break polymer chains.</li>
<li>In polymers such as XLPE, erosion at a void tip can start <strong>electrical treeing</strong> that grows towards the opposite electrode. Mica-based machine insulation is much more PD-resistant, so stator windings can tolerate PD for many years; polymeric cable insulation generally cannot.[[stone-2005]][[ieee-1434-2014]]</li>
</ul>`,
      },
    ],
  },
  {
    id: 'field-stress',
    title: 'Insulation defects and electric-field stress',
    diagram: 'defectsDiagram',
    diagramCaption: 'Three families of PD source. Exact location and appearance vary widely in real equipment.',
    simple: `
<p>Insulation is designed so that the electric field (the “stress”, measured in kV/mm) stays well below what the material can withstand. A <strong>defect</strong> changes the local field. Typical defects are:</p>
<ul>
<li><strong>Gas voids or cavities</strong> trapped in solid insulation during manufacture or created by ageing (delamination).</li>
<li><strong>Contamination and moisture</strong> on surfaces, e.g. dirty or damp cable terminations and switchgear insulators.</li>
<li><strong>Sharp edges, protrusions and loose metal</strong> that concentrate the field.</li>
<li><strong>Poor workmanship</strong> in cable joints and terminations: cuts in the insulation, a misplaced stress-control layer, semiconductive screen not cut cleanly.</li>
<li><strong>Floating metal parts</strong> that are not bonded to HV or earth.</li>
</ul>
<p>Gas has a lower permittivity and a much lower breakdown strength than solid insulation, so a small gas-filled defect can discharge at a voltage the healthy insulation easily withstands.[[kuffel-2000]]</p>`,
    deep: [
      {
        title: 'Deeper theory: field enhancement in a void',
        diagram: 'voidFieldDiagram',
        html: `
<p>For a thin, flat void oriented across the field in a solid with relative permittivity ε<sub>r</sub>, continuity of the electric displacement gives</p>
<p class="eq"><strong>E<sub>void</sub> ≈ ε<sub>r</sub> · E<sub>solid</sub></strong></p>
<p>For a spherical void the enhancement is smaller: E<sub>void</sub> = 3ε<sub>r</sub> / (2ε<sub>r</sub> + 1) · E<sub>solid</sub> (≈ 1.3× for ε<sub>r</sub> ≈ 2.3). So the gas in the void sees a higher field than the surrounding solid while also having a lower breakdown strength.[[kuffel-2000]][[lemke-2012]]</p>
<p>The breakdown voltage of a small gas gap depends on the product of gas pressure and gap length (<strong>Paschen’s law</strong>). Very small voids therefore need a <em>higher</em> field to discharge than large ones, which is one reason why PD inception voltage depends strongly on void size and gas pressure.[[kuffel-2000]]</p>
<p><strong>The a-b-c (three-capacitor) model.</strong> The void is represented by capacitor C<sub>c</sub> with a spark gap across it, in series with C<sub>b</sub> (the healthy insulation above and below the void), all in parallel with C<sub>a</sub> (the rest of the insulation). When the voltage across C<sub>c</sub> reaches the inception voltage, the gap fires and C<sub>c</sub> partly discharges. This model is useful for explaining why pulses repeat during each half-cycle, but it is a simplification: the charge induced at the terminals is not simply related to the charge moved in the void.[[lemke-2012]][[kreuger-1989]]</p>`,
      },
      {
        title: 'Deeper theory: inception and extinction voltage',
        html: `
<p><strong>PD inception voltage (PDIV)</strong>: the lowest applied voltage at which PD above a specified level is first observed when the voltage is increased. <strong>PD extinction voltage (PDEV)</strong>: the voltage at which PD stops when the voltage is decreased. PDEV is usually lower than PDIV because space charge and surface conductivity left by earlier discharges make it easier to keep discharging. Both are defined in IEC 60270 and are used in many acceptance tests.[[iec-60270-2000-amd1-2015]]</p>
<p>A defect that is active at 1.5–2 × the operating voltage during an offline test may be silent at operating voltage, and vice versa if temperature, load or moisture change. This is a main reason why online and offline test results can differ.</p>`,
      },
    ],
  },
  {
    id: 'internal',
    title: 'Internal discharge',
    simple: `
<p><strong>Internal discharges</strong> occur in gas-filled cavities <em>inside</em> solid insulation: manufacturing voids, delaminations between layers, gaps between insulation and a conductor or screen, or the channels of an electrical tree.</p>
<p>Because the void is inside, there is often <strong>nothing to see or hear</strong> from outside. Electrical (charge or current pulse) and electromagnetic methods (TEV, UHF, HFCT) are normally needed to detect it.</p>
<p>Typical PRPD signature: pulses during the <strong>rising</strong> part of both half-cycles (roughly 0–90° and 180–270°, often starting a little before the zero crossing), with similar magnitudes in both halves when the void is surrounded by insulation on both sides. The exact phase ranges vary; treat the quadrant figures as a rule of thumb.[[gulski-kreuger-1992]][[ea-prpd-faq]]</p>`,
    deep: [
      {
        title: 'Deeper theory: why pulses appear on the rising slope',
        html: `
<p>Once a void discharges, charges deposited on the void walls create a field that opposes the applied field. The void must then wait for the applied voltage to rise by about another inception step before it fires again. Pulses therefore cluster where |dV/dt| is positive — the rising slope towards each peak. Near the peak, dV/dt approaches zero and discharge activity stops; it restarts on the next half-cycle with opposite polarity.</p>
<p>Residual wall charge can make the internal field exceed the inception level already <em>before</em> the applied voltage crosses zero, so the clusters often begin at roughly 315–360° and 135–180°.[[lemke-2012]][[gulski-kreuger-1992]]</p>
<p>Deviations from symmetry are informative: a void bordering a conductor or semicon screen (electrode-bounded cavity) can show different positive and negative magnitudes because the electrode supplies electrons more easily in one polarity.[[gulski-kreuger-1992]]</p>`,
      },
    ],
  },
  {
    id: 'surface',
    title: 'Surface discharge',
    simple: `
<p><strong>Surface discharges</strong> run <em>along</em> an insulating surface where there is a strong field component parallel to the surface — for example at the end of a cable screen in a termination, on dirty or damp switchgear insulators, or on the endwindings of motors and generators.</p>
<p>They often leave visible <strong>tracking</strong> (carbonised paths) or white powder, and in air they may produce ozone smell, hissing and ultrasonic noise. Contamination and humidity strongly influence them, so readings can change from day to day.</p>
<p>Typical PRPD signature: activity in both half-cycles but <strong>asymmetric</strong> — one polarity shows larger pulses or a different shape than the other.[[gulski-kreuger-1992]][[ea-prpd-faq]]</p>`,
    deep: [
      {
        title: 'Deeper theory: where the asymmetry comes from',
        html: `
<p>The discharge starts at the electrode edge (for example the cut end of an earth screen) and spreads across the surface. The two polarities behave differently because electron emission from the metal electrode, charge accumulation on the surface and the geometry are not symmetric. Positive and negative surface streamers also propagate differently.[[kuffel-2000]][[lemke-2012]]</p>
<p>In rotating machines, endwinding surface discharge between phases or at the end of the slot-section conductive coating is a well-known pattern, usually shown with a clear asymmetry between half-cycles.[[iec-60034-27-1-2017]][[hudon-belec-2005]][[ieee-1434-2014]]</p>`,
      },
    ],
  },
  {
    id: 'corona',
    title: 'Corona',
    simple: `
<p><strong>Corona</strong> is discharge in a gas (usually air) around a sharp point, thin wire or edge at high voltage, where the field is high only very close to the conductor. It does not involve solid insulation directly, so it is usually <strong>less dangerous</strong> to the equipment itself — but it creates noise that can hide more serious internal PD, and its by-products (ozone, nitric acid in moist air) can attack nearby materials.</p>
<p>Typical PRPD signature for a sharp point at high voltage: many small pulses of <strong>nearly constant magnitude</strong> grouped around the <strong>negative voltage peak (≈ 270°)</strong>. At higher voltage, larger pulses can also appear around the positive peak (≈ 90°).[[kuffel-2000]][[gulski-kreuger-1992]]</p>`,
    deep: [
      {
        title: 'Deeper theory: Trichel pulses and polarity',
        html: `
<p>With a negative point in air, corona appears as very regular <strong>Trichel pulses</strong>: a negative ion space charge builds up in front of the point, chokes the discharge, drifts away, and the cycle repeats. This gives many pulses of similar small amplitude. Because negative corona incepts at a lower voltage than positive corona for a point-plane gap, the first activity appears near the negative peak of the AC wave.[[kuffel-2000]]</p>
<p>If the sharp point is on the <em>earthed</em> side instead (for example a protrusion on an enclosure), the polarity relative to the applied voltage reverses, and the cluster appears near the positive peak. Always check which electrode the defect is on and how the instrument’s phase reference is connected before reading polarity from a pattern.</p>`,
      },
    ],
  },
  {
    id: 'apparent-charge',
    title: 'Apparent charge',
    simple: `
<p>We cannot put a meter inside a void, so we measure what arrives at the <strong>terminals</strong>. <strong>Apparent charge</strong> (symbol q, unit <strong>picocoulomb, pC</strong>) is the charge which, if injected very quickly between the test object’s terminals, would give the same instrument reading as the PD pulse.[[iec-60270-2000-amd1-2015:clause 3.3.1]]</p>
<p>Before measuring, the circuit is <strong>calibrated</strong> by injecting a known charge (for example 100 pC) with a calibrator. The instrument then scales its readings in pC. The apparent charge is <strong>not</strong> the actual charge in the void — it is usually much smaller — but it gives a repeatable, comparable quantity for a given test circuit.[[iec-60270-2000-amd1-2015]][[lemke-2012]]</p>`,
    keypoints: [
      'Unit: pC (1 pC = 10<sup>−12</sup> C).',
      'Valid only for the calibrated test circuit and frequency band; a pC value from one object or circuit cannot simply be compared with another.',
      'Conventional apparent-charge measurement is standardised in IEC 60270. The current edition is Ed. 4.0 (2025), retitled “Charge-based measurement of partial discharges”, which also covers DC; most literature still quotes clause numbers from Ed. 3.0 (2000) + A1 (2015).[[iec-60270-2025]][[iec-60270-2000-amd1-2015]]',
    ],
    deep: [
      {
        title: 'Deeper theory: quasi-integration and frequency bands',
        html: `
<p>The PD current pulse at the terminals lasts only nanoseconds. IEC 60270 instruments do not try to capture its true shape. Instead they apply a band-pass filter below the dominant frequency content of the pulse and read the peak of the filter output, which is proportional to the <strong>integral of the current</strong> — the charge (“quasi-integration”). The standard defines <strong>wide-band</strong> and <strong>narrow-band</strong> instrument characteristics (for example a wide-band system with lower limit frequency of tens of kHz and upper limit up to about 1 MHz).[[iec-60270-2000-amd1-2015]][[hauschild-lemke-2019]]</p>
<p>Using the a-b-c model, the apparent charge is approximately q ≈ C<sub>b</sub>·ΔU<sub>c</sub>, where ΔU<sub>c</sub> is the voltage collapse across the void — much smaller than the charge moved in the void itself. Electromagnetic and acoustic methods (TEV, UHF, ultrasonic) measure different physical quantities and are therefore <strong>not</strong> expressed in pC (see Tab 2).[[lemke-2012]][[iec-ts-62478-2016]]</p>`,
      },
      {
        title: 'Deeper theory: other quantities you will see',
        html: `
<ul>
<li><strong>Pulse repetition rate n</strong>: pulses per second (or per cycle).</li>
<li><strong>Average discharge current I</strong>, <strong>discharge power P</strong> and <strong>quadratic rate D</strong> — integrated quantities defined in IEC 60270.[[iec-60270-2000-amd1-2015]]</li>
<li><strong>Q<sub>IEC</sub></strong>: the largest repeatedly occurring PD magnitude, as defined for IEC 60270 test reporting.</li>
<li><strong>Q<sub>m</sub></strong> (rotating machines): the peak PD magnitude at a defined repetition rate, often reported in mV online or in pC/nC offline.[[iec-60034-27-2-2023]][[iec-60034-27-1-2017]]</li>
</ul>`,
      },
    ],
  },
  {
    id: 'phase-angle',
    title: 'Phase angle',
    simple: `
<p>An AC test voltage repeats every cycle. One cycle is <strong>360°</strong>: it starts at 0° where the voltage crosses zero going positive, peaks at <strong>90°</strong>, crosses zero again at <strong>180°</strong>, reaches the negative peak at <strong>270°</strong>, and returns to zero at 360°.</p>
<p>The <strong>phase angle</strong> of a PD pulse is simply <em>where in the cycle</em> it happened. At 50&nbsp;Hz one cycle takes 20&nbsp;ms, so 1° ≈ 56&nbsp;µs; at 60&nbsp;Hz one cycle takes 16.7&nbsp;ms, so 1° ≈ 46&nbsp;µs.</p>
<p>Different defects fire at different points in the cycle, so phase is one of the most useful clues for recognising them.</p>`,
    deep: [
      {
        title: 'Deeper theory: getting the phase reference right',
        html: `
<p>The instrument needs a <strong>synchronisation signal</strong>: the test voltage itself (via a divider or the coupling capacitor), the mains supply, or another phase. If the reference is taken from a different phase or through a transformer, the whole pattern shifts by 120°, 30° or another angle; inductive or capacitive dividers can add a few degrees. Many instruments allow a manual phase offset for this reason.[[hauschild-lemke-2019]]</p>
<p>For VLF (e.g. 0.1&nbsp;Hz) and damped AC tests the cycle is not 50/60&nbsp;Hz, so the “phase” is relative to the test waveform. Patterns can look different from power-frequency patterns because discharge physics (e.g. surface charge decay) depends on the rate of voltage change.[[ieee-400-2-2024]][[ieee-400-4-2015]]</p>`,
      },
    ],
  },
  {
    id: 'prpd',
    title: 'Phase-resolved partial discharge (PRPD) plots',
    diagram: 'prpdConceptDiagram',
    diagramCaption: 'Pulses from many AC cycles are “folded” onto a single 0–360° axis to build a PRPD pattern.',
    simple: `
<p>A <strong>PRPD plot</strong> (also called a phase-resolved pattern or φ-q-n diagram) stacks thousands of AC cycles on top of each other. Each PD pulse becomes a dot: <strong>horizontal position = phase angle</strong>, <strong>vertical position = magnitude</strong>. Areas where many dots land are often shown with brighter colours (pulse count).</p>
<p>Because different defects fire at characteristic phases and magnitudes, the overall <strong>shape</strong> of the cloud is a strong hint about the type of defect. Experienced engineers compare patterns with known reference patterns, together with other evidence such as location, trend over time and other test methods.[[gulski-kreuger-1992]][[ea-prpd-faq]]</p>
<p>Try it yourself in <a href="#simulator">Tab 3 — PRPD Simulator</a>.</p>`,
    keypoints: [
      'Internal (void) PD: rising slopes of both half-cycles, fairly symmetric.',
      'Surface PD: both half-cycles, clearly asymmetric.',
      'Corona (point at HV in air): small, uniform pulses near the negative peak (≈ 270°).',
      'Noise / interference: not tied to phase — spread across the cycle, or fixed vertical lines from switching devices.',
    ],
    deep: [
      {
        title: 'Deeper theory: statistical PRPD analysis',
        html: `
<p>Classic PRPD analysis builds distributions such as H<sub>n</sub>(φ) (pulse count vs phase), H<sub>qmax</sub>(φ) and H<sub>qn</sub>(φ) (maximum and mean magnitude vs phase) for each half-cycle, then calculates features such as <strong>skewness</strong>, <strong>kurtosis</strong>, <strong>asymmetry</strong> and <strong>cross-correlation</strong> between half-cycles. These features were used to build recognition systems in the 1990s.[[gulski-kreuger-1992]][[hudon-belec-2005]]</p>
<p>Real measurements often contain <strong>several sources at once</strong> plus noise. Modern instruments therefore separate sources before interpreting patterns — for example by pulse shape (time/frequency clustering), by comparing amplitudes in the three phases simultaneously (e.g. OMICRON’s 3PARD diagram), or by time-of-arrival at several sensors.[[omicron-mpd-800]][[cigre-tb-662]]</p>
<p>Limitations: patterns change with voltage level, test frequency, temperature, defect age and measuring bandwidth, and different defects can produce similar shapes. Pattern recognition supports — but does not replace — engineering judgement.[[stone-2005]]</p>`,
      },
    ],
  },
];
