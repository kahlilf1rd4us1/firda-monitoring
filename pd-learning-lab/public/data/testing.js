// Tab 2 content: how PD testing works, organised by equipment type.
// Editing guide: same conventions as data/theory.js ([[ref-id]] citations, HTML allowed).
// Each method uses the same fields so the page renders a consistent "measurement chain".
// mode: 'offline' (external voltage source, asset out of service), 'online' (in service), or 'both'.

export const testingIntro = `
<h2>How PD Testing Works</h2>
<p>Every PD test answers three separate questions. Keep them apart when you read a test report:</p>
<ol>
<li><strong>Initiation — what makes the PD happen?</strong> Either the normal <em>operating voltage</em> (online) or an <em>external test voltage source</em> applied to equipment taken out of service (offline).</li>
<li><strong>Detection — which physical effect is sensed?</strong> Current/charge pulses, electromagnetic waves (TEV, HF, UHF), sound (ultrasonic/acoustic), light or chemical by-products.</li>
<li><strong>Location — where is the source?</strong> Time-of-arrival between sensors, travelling-wave reflections (TDR), signal strength mapping, or direction-sensitive sensors.</li>
</ol>`;

export const onlineOffline = `
<div class="table-scroll"><table>
<thead><tr><th></th><th><span class="tag online">ONLINE</span> in service</th><th><span class="tag offline">OFFLINE</span> external source</th></tr></thead>
<tbody>
<tr><th>Voltage</th><td>Normal operating voltage (phase-to-earth); cannot be raised.</td><td>Separate test set: power-frequency AC (often resonant), VLF, or damped AC (DAC). Voltage can be raised above operating level to find inception (PDIV/PDEV).</td></tr>
<tr><th>Conditions</th><td>Real temperature, load, vibration and voltage distribution (all three phases energised).</td><td>Usually cold, unloaded; one phase at a time, so the field between phases may differ from service.</td></tr>
<tr><th>Noise</th><td>High: other plant, power electronics, radio, corona on overhead lines.</td><td>Lower and more controllable; calibration with known charge possible.</td></tr>
<tr><th>Typical use</th><td>Surveys, screening, trending, continuous monitoring.</td><td>Commissioning/acceptance, after repair, detailed diagnosis and location.</td></tr>
<tr><th>Typical units</th><td>dBmV (TEV), dBµV (ultrasonic), dBm or mV (UHF), mV or pC-scaled (HFCT, couplers)</td><td>pC (IEC 60270 apparent charge), plus PDIV/PDEV in kV</td></tr>
</tbody></table></div>`;

export const unitsSection = {
  simple: `
<p>Different methods measure <strong>different physical quantities</strong> at different places and frequencies, so their numbers are not interchangeable:</p>
<div class="table-scroll"><table>
<thead><tr><th>Method</th><th>What is measured</th><th>Typical unit</th></tr></thead>
<tbody>
<tr><td>Conventional (IEC 60270)</td><td>Apparent charge via quasi-integration at the terminals, after calibration</td><td>pC</td></tr>
<tr><td>HFCT (high-frequency current transformer)</td><td>Current pulse on an earth or neutral conductor</td><td>mV, or pC after a site-specific charge calibration</td></tr>
<tr><td>Rotating machine couplers (online)</td><td>Voltage pulse across the coupler’s measuring impedance</td><td>mV (Q<sub>m</sub>, NQN)</td></tr>
<tr><td>TEV (transient earth voltage)</td><td>Transient voltage on the outside of a metal enclosure</td><td>dBmV (decibels relative to 1 mV)</td></tr>
<tr><td>Airborne ultrasonic</td><td>Sound pressure picked up by an ultrasonic transducer</td><td>dBµV (decibels relative to 1 µV)</td></tr>
<tr><td>UHF (≈ 300 MHz – 3 GHz)</td><td>Electromagnetic wave picked up by an antenna</td><td>dBm or mV</td></tr>
<tr><td>Acoustic emission (contact)</td><td>Mechanical stress waves in a tank wall</td><td>mV, dB, or count rate</td></tr>
</tbody></table></div>
<p><strong>There is no universal conversion between pC, dBmV, dBµV and dBm.</strong> A 20&nbsp;dBmV TEV reading is not “equal to” any particular pC value.[[iec-ts-62478-2016]][[cigre-tb-444]]</p>`,
  deep: `
<p>Why a conversion is impossible in general:</p>
<ul>
<li><strong>Different quantity</strong>: charge (integral of current) vs. peak voltage of a high-frequency field vs. acoustic pressure.</li>
<li><strong>Different frequency band</strong>: conventional IEC 60270 systems integrate in a band below about 1 MHz; electromagnetic methods work in the HF (3–30 MHz), VHF (30–300 MHz) or UHF (≥ 300 MHz) ranges; airborne ultrasonic detectors work at acoustic frequencies around 40 kHz.[[iec-60270-2000-amd1-2015]][[iec-ts-62478-2016]]</li>
<li><strong>Different propagation path</strong>: the signal is attenuated and distorted by distance, joints, enclosure openings, oil, barriers and the windings between source and sensor — all of which depend on the specific asset and the defect location.</li>
<li><strong>Different sensor transfer function</strong>: every sensor model and position responds differently.</li>
</ul>
<p>EA Technology and Megger both stress that voltage-based TEV/ultrasonic/UHF readings are not charge measurements.[[ea-pd-units-blog-2023]][[megger-qa-pd-2021]] For UHF in transformers and GIS a <em>sensitivity verification</em> (injecting an artificial pulse equivalent to a known pC level in a reference setup) is used to show the system <em>can</em> detect a certain level, but it is not a calibration that converts every UHF reading to pC.[[cigre-tb-444]][[iec-ts-62478-2016]][[qualitrol-uhf-amplitude]]</p>
<p>Practical consequence: compare readings <strong>with the same method, same instrument, same sensor position</strong> over time (trending), and against the manufacturer’s or standard’s guidance for that method.</p>`,
};

export const equipment = [
  /* ------------------------------------------------------------------ CABLES */
  {
    id: 'cables',
    title: 'MV cables, joints and terminations',
    simple: `
<p>Most cable PD comes from <strong>accessories</strong> — joints and terminations made on site — and from damage or water trees in older cable. Offline tests energise the cable from a test set and use the cable itself as a transmission line to locate PD by <strong>time-domain reflectometry (TDR)</strong>. Online tests listen at the terminations while the cable is in service.[[ieee-400-2023]][[ieee-400-3-2022]]</p>`,
    methods: [
      {
        name: 'VLF (very low frequency) AC + PD',
        mode: 'offline',
        principle: 'A compact source generates a very slow AC voltage (typically 0.1 Hz) so a long, highly capacitive cable can be energised with little reactive power. PD pulses are coupled out at the near end and located by TDR.',
        source: 'VLF generator, sinusoidal or cosine-rectangular waveform, typically 0.1 Hz; test levels set by the applicable standard or utility practice.[[ieee-400-2-2024]]',
        sensor: 'Coupling capacitor + measuring impedance at the near-end termination (IEC 60270-type circuit), sometimes an HFCT.',
        signalPath: 'PD at the defect → pulses travel both ways along the cable → near end (direct) and far end (reflected) → coupler → detector.',
        output: 'Apparent charge (pC) per pulse, PDIV/PDEV (kV), PD map: number and magnitude of pulses vs distance along the cable, PRPD at 0.1 Hz.',
        interpretation: 'Concentrations of PD at a fixed location (often a joint position) indicate a localised defect; PDIV relative to operating voltage indicates urgency.',
        applications: 'Commissioning of new circuits, after repairs, condition assessment of service-aged cables.',
        limitations: 'Inception and magnitudes at 0.1 Hz can differ from 50/60 Hz behaviour; few cycles are recorded in a practical test time; long cables attenuate pulses.[[ieee-400-2-2024]][[ieee-400-3-2022]]',
      },
      {
        name: 'Damped AC (DAC, also called oscillating wave) + PD',
        mode: 'offline',
        principle: 'The cable is slowly charged with DC to the test level, then a switch connects it to an inductor. The cable capacitance and inductor form an LC circuit that oscillates at its resonant frequency, decaying over a number of cycles — an AC-like stress for PD measurement.',
        source: 'DAC test system; the frequency f = 1/(2π√(L·C)) depends on cable capacitance and is typically in the tens to a few hundred Hz range — one commercial DAC system specifies 20–300 Hz.[[ieee-400-4-2015]][[megger-hv-dac]]',
        sensor: 'Built-in coupling capacitor and IEC 60270 measuring circuit at the near end.',
        signalPath: 'As for VLF: direct and reflected pulses arrive at the near end and are recorded during each damped oscillation.',
        output: 'pC, PDIV/PDEV, PD location map, phase-resolved pattern, plus dissipation factor estimate from the decay.',
        interpretation: 'Same as VLF; frequency closer to service frequency, so PRPD patterns are closer to 50/60 Hz behaviour.',
        applications: 'Commissioning and diagnostics of MV and HV cables where a resonant AC set is impractical.',
        limitations: 'Only a short burst of cycles per shot (many shots needed); DC charging period; frequency and decay depend on the cable.',
      },
      {
        name: 'Power-frequency / resonant AC (20–300 Hz) + PD',
        mode: 'offline',
        principle: 'A series-resonant test system (variable inductor or variable frequency) supplies AC close to service frequency. Closest to service stress.',
        source: 'Resonant AC test set (typically 20–300 Hz for cable testing).[[ieee-400-2023]]',
        sensor: 'Coupling capacitor or HFCT; sometimes sensors at each accessory.',
        signalPath: 'Pulses travel to the termination(s) and are measured as in VLF/DAC.',
        output: 'pC, PRPD, location map.',
        interpretation: 'Patterns most comparable to service and to factory tests.',
        applications: 'HV cable commissioning, long or critical circuits.',
        limitations: 'Larger and heavier equipment; higher cost.',
      },
      {
        name: 'Online cable PD (HFCT, TEV, UHF at terminations)',
        mode: 'online',
        principle: 'PD pulses in service travel along the cable screen. An HFCT clamped round the screen earth at the termination picks up the current pulse; TEV/ultrasonic detect activity in the termination enclosure.',
        source: 'Normal operating voltage (no external source).',
        sensor: 'HFCT on the earth strap; TEV or ultrasonic sensors on the switchgear cable box.[[ea-ultratev-plus2-brochure]]',
        signalPath: 'PD → screen current pulse → earth strap → HFCT → instrument (with noise separation).',
        output: 'Pulse magnitude (mV or calibrated pC equivalent), pulse count, PRPD. Two synchronised sensors at both ends can estimate location.',
        interpretation: 'Trending over time; comparison between phases; location only if two-ended or reflection measurements are possible.',
        applications: 'Screening of networks without outages, monitoring of critical circuits.',
        limitations: 'High noise; cannot raise the voltage; single-ended location in service is hard because the far-end termination is connected to other plant.',
      },
    ],
    extra: 'tdr',
    deep: [
      {
        title: 'TDR location: assumptions and limitations',
        html: `
<ul>
<li><strong>Known cable length L</strong> and a strong reflection at the far end (open circuit). The test set usually measures L by injecting a pulse and timing its echo.</li>
<li><strong>Known propagation velocity v</strong>. For XLPE cables this is commonly about half to two-thirds of the speed of light (published figures roughly 150–190 m/µs) but must be measured or set for the actual cable: v = 2L / t<sub>echo</sub>.[[ieee-400-3-2022]]</li>
<li><strong>Uniform cable</strong>: mixed cable types (e.g. PILC and XLPE sections) have different velocities, so a single v causes location errors.</li>
<li><strong>No branches</strong>: tee-offs and ring connections create extra reflections that break the simple two-pulse picture.</li>
<li><strong>Attenuation and dispersion</strong>: the reflected pulse travels further, so it is smaller and wider. On long cables the reflection may be lost in noise, limiting both sensitivity and location. Very close to the far end the two pulses overlap and cannot be separated in time.</li>
<li><strong>Accessory reflections</strong>: joints with impedance changes produce small reflections that can be mistaken for PD. Repeated activity at the same distance across many pulses is what builds confidence.</li>
<li>Long circuits can be measured from both ends, or with synchronised sensors at both ends (double-sided location).[[mashikian-1990]]</li>
<li>Note: x = L − v·Δt/2 follows directly from the travel times shown in the diagram (the same reasoning as the general TDR relation d = v·t/2); it is derived here for teaching rather than quoted from a standard.</li>
</ul>`,
      },
    ],
    instruments: `
<p>Model-specific references used here: Megger TDS NT (VLF cosine-rectangular withstand plus DAC for PD diagnosis)[[megger-tds-nt]] and the Megger HV DAC series[[megger-hv-dac]], OMICRON MPD 800 (IEC 60270-compliant AC/DC PD measurement with TDR-based cable PD location)[[omicron-mpd-800]], and EA Technology UltraTEV Plus² for online screening at terminations[[ea-ultratev-plus2-brochure]][[ea-ultratev-plus2-manual]]. Check the current manual for the exact model before relying on any specification.</p>`,
  },

  /* ------------------------------------------------------------------ SWITCHGEAR */
  {
    id: 'switchgear',
    title: 'MV switchgear panels',
    diagram: 'switchgearDiagram',
    diagramCaption: 'Where common switchgear PD sensors are placed (simplified metal-clad panel).',
    simple: `
<p>In metal-clad switchgear the PD source is hidden behind earthed steel. Field surveys therefore use <strong>non-invasive</strong> sensors that pick up effects escaping the enclosure: electromagnetic transients on the metalwork (TEV) and ultrasound leaking through gaps and vents. Conventional apparent-charge testing is used in the factory and in some site acceptance tests.[[ea-ultratev-plus2-brochure]][[iec-62271-200-2021]]</p>`,
    methods: [
      {
        name: 'TEV (Transient Earth Voltage)',
        mode: 'online',
        principle: 'A PD inside the panel launches a high-frequency electromagnetic wave. Because of the skin effect the resulting currents flow on the inner surface of the metal; at gaps, seams and openings they escape onto the outer surface, creating a short transient voltage relative to earth. The TEV technique was developed in the UK in the 1970s at the organisation that is now EA Technology (commonly credited to Dr John Reeves; published sources differ on the exact year).',
        source: 'Operating voltage.',
        sensor: 'Capacitive TEV probe pressed against the outside of the panel metalwork.',
        signalPath: 'PD → EM wave inside → leakage at openings → transient on outer skin → capacitive coupling into the probe → peak detector.',
        output: 'Peak amplitude in dBmV, pulses per cycle, sometimes PRPD and a “severity” indication.',
        interpretation: 'Compare with background readings (on metal not connected to the switchgear) and between panels; the highest reading and earliest arrival point toward the source.',
        applications: 'Routine surveys of indoor metal-clad switchgear; mainly internal PD in insulation.',
        limitations: 'Sensitive to external noise; poor for surface discharge and corona in air (use ultrasonic); readings depend strongly on panel construction and sensor position.',
      },
      {
        name: 'Airborne ultrasonic',
        mode: 'online',
        principle: 'Surface discharges and corona in air create pressure waves with energy above the audible range (around 40 kHz). An ultrasonic microphone at a vent or gap detects them, and the signal is often converted to an audible sound for the operator.',
        source: 'Operating voltage.',
        sensor: 'Ultrasonic transducer (typically ≈ 40 kHz) with or without parabolic dish; contact sensors for some enclosures.',
        signalPath: 'PD → sound in air → must find an air path (gap, vent, seam) to the sensor → amplifier/heterodyne → readout.',
        output: 'dBµV, audible sound, sometimes phase-resolved display.',
        interpretation: 'A characteristic “frying/crackling” sound synchronised with 50/60 Hz suggests surface PD or corona; locate by scanning for the loudest point.',
        applications: 'Surface tracking on insulators, contaminated cable terminations, corona on air-insulated components.',
        limitations: 'Needs an airborne path — sealed or fully enclosed compartments may block it; does not detect internal voids well; mechanical noise (fans, vibration) can interfere.',
      },
      {
        name: 'UHF',
        mode: 'online',
        principle: 'Very fast PD pulses radiate electromagnetic energy up to the GHz range. Antennas (internal couplers, or external sensors at dielectric windows/gaskets) receive it.',
        source: 'Operating voltage (also used during factory tests).',
        sensor: 'UHF antenna or coupler, typically 300 MHz – 3 GHz.',
        signalPath: 'PD → radiated UHF → enclosure acts as resonant cavity → antenna → UHF detector.',
        output: 'dBm or mV, PRPD, time-of-arrival between sensors.',
        interpretation: 'Mainly used in gas-insulated switchgear (GIS), where closed metal enclosures give good propagation and shielding; in air-insulated MV panels it is a complement to TEV and ultrasonic.[[cigre-tb-444]]',
        applications: 'GIS monitoring; some MV switchgear with built-in or window sensors.',
        limitations: 'Not calibratable in pC; mobile phones/radar and other RF sources can interfere; strong attenuation at some barriers.',
      },
      {
        name: 'Conventional apparent-charge test (IEC 60270)',
        mode: 'offline',
        principle: 'The switchgear (or its insulating components) is energised from an external AC source; PD current pulses are measured with a calibrated coupling capacitor circuit as in IEC 60270.',
        source: 'AC test transformer or resonant set in a factory or site test; voltage levels from the product standard.[[iec-62271-200-2021]]',
        sensor: 'Coupling capacitor + measuring impedance.',
        signalPath: 'PD → current pulse in the test circuit → coupling device → instrument.',
        output: 'pC, PDIV/PDEV, PRPD.',
        interpretation: 'Compared with acceptance levels specified in the product standard or purchase specification.',
        applications: 'Type/routine tests of switchgear components (e.g. cast-resin insulators, instrument transformers) and assemblies when specified.',
        limitations: 'Requires outage and a low-noise environment; does not locate the source by itself.',
      },
    ],
    deep: [
      {
        title: 'Locating PD in switchgear',
        html: `
<ul>
<li><strong>Amplitude mapping</strong>: scan TEV/ultrasonic around the panel(s) and find the maximum.</li>
<li><strong>Time of flight</strong>: two TEV sensors on different panels; the one that receives the leading edge first is closer to the source. EA Technology’s UltraTEV Locator uses this principle.[[ea-ultratev-locator-manual]]</li>
<li><strong>Ultrasonic direction</strong>: directional (dish) sensors pinpoint surface PD in air.</li>
<li>Confirm by inspection during an outage — e.g. tracking marks, white powder, damaged stress cones.</li>
</ul>`,
      },
    ],
    instruments: `
<p>EA Technology UltraTEV Plus² (handheld TEV and airborne ultrasonic survey instrument; the brochure describes ultrasonic for classification and TEV for interpretation)[[ea-ultratev-plus2-brochure]][[ea-ultratev-plus2-manual]]; UltraTEV Locator probe (first-arrival time-of-flight location, an accessory to the Plus²)[[ea-ultratev-locator-manual]]; UltraTEV Detector 2 (simple indicator — its brochure uses TEV indication thresholds of 20 and 29 dBmV and an ultrasonic threshold of 6 dBµV, which are product-specific, not universal limits)[[ea-ultratev-detector2]]; Megger PD Scan handheld scanner[[megger-pd-scan]] and Megger UHF PD Detector (phase-resolved UHF survey)[[megger-uhf-pdd]]. Check the manual of the exact model for frequency ranges and alarm thresholds.</p>`,
  },

  /* ------------------------------------------------------------------ TRANSFORMERS */
  {
    id: 'transformers',
    title: 'Power transformers',
    diagram: 'transformerDiagram',
    diagramCaption: 'Electrical, UHF and acoustic access points on an oil-filled transformer (simplified).',
    simple: `
<p>Transformer insulation is a combination of oil, paper/pressboard and bushings. PD is measured electrically in the factory during the induced-voltage test, and in service with electromagnetic (UHF/HFCT) and acoustic methods. Dissolved gas analysis (DGA) of the oil is a complementary chemical indicator — hydrogen in particular is associated with PD.[[iec-60076-3-2013-amd1-2018]][[ieee-c57-113-2023]][[ieee-c57-127-2018]]</p>`,
    methods: [
      {
        name: 'Electrical (IEC 60270) via bushing taps',
        mode: 'offline',
        principle: 'During the induced-voltage withstand test the transformer is excited (usually at raised frequency to avoid core saturation) and PD current pulses are measured at each line terminal through the bushing capacitance and its test tap.',
        source: 'Factory or mobile test system supplying the induced voltage; voltage profile and duration from IEC 60076-3 (induced voltage test with PD measurement, IVPD) / IEEE C57.113 and the purchase specification.[[iec-60076-3-2013-amd1-2018]][[ieee-c57-113-2023]]',
        sensor: 'Bushing capacitance (C1) acting as coupling capacitor; measuring impedance on the test tap.',
        signalPath: 'PD in winding/insulation → transferred through the winding to terminals → bushing → tap → measuring impedance → instrument.',
        output: 'Apparent charge in pC per terminal, PRPD, PDIV/PDEV.',
        interpretation: 'Compared with specified acceptance limits; comparing magnitudes at different terminals and with calibration pulses injected at each terminal (calibration matrix) helps identify the likely winding/region.',
        applications: 'Factory acceptance, after repair, site commissioning with mobile test systems.',
        limitations: 'Outage required; attenuation through the winding makes the measured pC depend on source location; external corona must be suppressed.',
      },
      {
        name: 'UHF',
        mode: 'both',
        principle: 'The metal tank behaves like a Faraday cage; UHF signals from PD in oil are received by probes inserted through the oil drain valve or dielectric windows. External noise is strongly shielded.',
        source: 'Operating voltage (online) or test voltage (offline).',
        sensor: 'UHF drain-valve probe or plate sensor; the UHF band is roughly 300 MHz – 3 GHz (one commercial instrument covers 100 MHz – 2 GHz).[[judd-yang-hunter-2005]][[omicron-uhf-800]]',
        signalPath: 'PD → UHF wave in oil → reflections inside tank → probe → UHF instrument.',
        output: 'dBm/mV, PRPD, time differences between multiple probes.',
        interpretation: 'Presence of phase-correlated UHF signals indicates internal PD; with several probes, time-of-arrival helps locate the source. Sensitivity checks per CIGRE guidance.[[cigre-tb-444]]',
        applications: 'Factory tests as a noise-immune complement to IEC 60270; online monitoring of large transformers and shunt reactors.',
        limitations: 'Readings not convertible to pC; requires suitable valves or ports; probes must not compromise the tank seal.',
      },
      {
        name: 'Acoustic emission (AE)',
        mode: 'both',
        principle: 'Each discharge creates a pressure wave in the oil. Piezoelectric sensors on the tank wall detect it. Comparing arrival times at several sensors (and with the electrical or UHF trigger) gives the distance to each sensor.',
        source: 'Operating voltage or test voltage.',
        sensor: 'Piezoelectric AE sensors (tens to a few hundred kHz; e.g. one system uses 10–400 kHz) magnetically mounted on the tank wall.[[ieee-c57-127-2018]][[omicron-pdl-650]]',
        signalPath: 'PD → acoustic wave through oil (≈ 1.4 km/s) and barriers → tank wall (where sound travels much faster in steel) → sensor.',
        output: 'Acoustic signals, arrival times, estimated 3-D source position.',
        interpretation: 'Consistent arrival-time differences that triangulate to a point inside the tank indicate a localised PD source.',
        applications: 'Locating PD after DGA or electrical tests indicate activity.',
        limitations: 'Signals are weakened and re-routed by windings and pressboard; deep sources may be undetectable; mechanical noise (pumps, fans, magnetostriction) interferes.',
      },
      {
        name: 'HFCT on neutral / tank earth',
        mode: 'online',
        principle: 'Measures the PD current pulses flowing in earth or neutral connections.',
        source: 'Operating voltage.',
        sensor: 'HFCT clamped around the neutral or tank earth, or a bushing-tap adapter for online monitoring.',
        signalPath: 'PD → current pulse to earth → HFCT → instrument.',
        output: 'mV (or calibrated pC equivalent), PRPD.',
        interpretation: 'Trending; must be separated from cable and external noise.',
        applications: 'Online screening and monitoring.',
        limitations: 'Noise from connected network; cannot distinguish internal from external sources without additional methods.',
      },
    ],
    deep: [
      {
        title: 'Combining methods for a transformer investigation',
        html: `
<p>A common sequence: DGA shows rising hydrogen → online UHF confirms phase-correlated internal PD → acoustic sensors placed on the tank locate it → findings guide an internal inspection or an offline IEC 60270 test. Each method covers a weakness of another: UHF is noise-immune but not in pC; acoustic locates but may miss deep sources; electrical gives pC but needs an outage.[[ieee-c57-127-2018]][[cigre-tb-444]]</p>`,
      },
    ],
    instruments: `
<p>OMICRON MPD 800 (IEC 60270 measurement on bushing taps)[[omicron-mpd-800]] , OMICRON UHF 800 (UHF measurement with transformer drain-valve sensors; can trigger acoustic location)[[omicron-uhf-800]] and OMICRON PDL 650 (4-channel acoustic PD localisation in transformers using an electrical/UHF trigger)[[omicron-pdl-650]]. Follow IEEE C57.127 for acoustic sensor placement and interpretation.[[ieee-c57-127-2018]]</p>`,
  },

  /* ------------------------------------------------------------------ ROTATING MACHINES */
  {
    id: 'rotating',
    title: 'Generators and motors (stator insulation)',
    diagram: 'statorDiagram',
    diagramCaption: 'Coupling capacitors at the stator terminals used for both offline and online PD measurement (simplified).',
    simple: `
<p>Stator windings of machines rated about 3.3 kV and above use mica-based insulation that is quite resistant to PD, so <strong>some PD is normal</strong>. What matters is the <strong>trend</strong> and the <strong>pattern</strong>: rapidly rising PD, or patterns typical of slot discharge, delamination or endwinding problems, indicate ageing from thermal, electrical, ambient or mechanical stress.[[ieee-1434-2014]][[stone-2005]]</p>`,
    methods: [
      {
        name: 'Offline PD test (IEC 60034-27-1)',
        mode: 'offline',
        principle: 'The machine is stopped and each phase (or the whole winding) is energised from an external AC source while PD is measured through coupling capacitors at the terminals.',
        source: 'AC test transformer, resonant set or VLF source — IEC 60034-27-1 covers sinusoidal test voltages from 0.1 Hz to 400 Hz — typically raised up to about the phase-to-earth operating voltage (and above for PDIV/PDEV).[[iec-60034-27-1-2017]]',
        sensor: 'Coupling capacitor (typically ≈ 1 nF) + measuring impedance at the line terminal.',
        signalPath: 'PD in the winding → pulse travels through the winding → terminal → coupling capacitor → instrument.',
        output: 'Q<sub>m</sub> or Q<sub>IEC</sub> (pC/nC), PDIV/PDEV, PRPD per phase.',
        interpretation: 'PRPD patterns are compared with the reference patterns in IEC 60034-27-1 (e.g. internal voids, delamination, slot discharge, endwinding surface PD). Results are best compared with earlier tests on the same machine.',
        applications: 'Acceptance of new windings, outage diagnostics, before/after rewinds or cleaning.',
        limitations: 'Calibration in pC is only approximate because of the winding’s complex high-frequency behaviour; values are not comparable between different machines; no thermal/mechanical stress as in service; the standard’s interpretation guidance is given for 50/60 Hz, so VLF results need care.[[iec-60034-27-1-2017]]',
      },
      {
        name: 'Online PD monitoring (IEC 60034-27-2)',
        mode: 'online',
        principle: 'Permanently installed or temporary sensors pick up PD while the machine runs under real load, temperature and vibration.',
        source: 'Operating voltage.',
        sensor: 'Capacitive couplers (e.g. 80 pF) on the terminals or bus, stator slot couplers in large generators, or HFCTs on surge-capacitor earths.[[iec-60034-27-2-2023]][[omicron-montesto-200]]',
        signalPath: 'PD → high-frequency pulse → coupler → noise separation (pulse shape, directional couplers, time of arrival) → instrument.',
        output: 'Q<sub>m</sub> (usually in mV for capacitive couplers; the unit depends on the system) and normalised quantity number (NQN), PRPD, trends vs. load and temperature.',
        interpretation: 'Trend of Q<sub>m</sub> over months/years for the same machine and sensor; comparison with statistical databases of similar machines when the same sensor type is used.',
        applications: 'Condition-based maintenance of large motors and generators.',
        limitations: 'Readings depend strongly on sensor type and position — mV values from different systems are not comparable; electrical noise from drives and the grid must be separated.',
      },
    ],
    deep: [
      {
        title: 'Typical stator PD sources',
        html: `
<ul>
<li><strong>Internal voids / micro-voids</strong> in the groundwall: roughly symmetric pattern.</li>
<li><strong>Delamination</strong> next to the copper conductor or between layers: often asymmetric, with predominance in one polarity depending on where the delamination is.</li>
<li><strong>Slot discharge</strong>: loose bars or damaged semiconductive coating in the slot; asymmetric, typically larger in one half-cycle.</li>
<li><strong>Endwinding surface discharge</strong> at the end of the slot coating or between phases: asymmetric, sensitive to contamination and humidity.</li>
</ul>
<p>IEC 60034-27-1, IEEE 1434 and Hudon &amp; Bélec give example patterns and caution that real patterns may contain several superimposed sources. (IEEE 1434-2014 was made inactive in 2025 but is still widely cited.)[[iec-60034-27-1-2017]][[ieee-1434-2014]][[hudon-belec-2005]][[stone-2014-book]]</p>`,
      },
    ],
    instruments: `
<p>OMICRON MPD 800 for offline testing with external sources[[omicron-mpd-800]] (its predecessor MPD 600 is still common in the field[[omicron-mpd-600]]) and OMICRON MONTESTO 200 for portable online measurement and temporary monitoring with coupling capacitors (also usable with bushing-tap/UHF sensors on transformers and HFCTs on cables)[[omicron-montesto-200]]. Check the current manual of the exact model for coupler compatibility and measurement ranges.</p>`,
  },
];
