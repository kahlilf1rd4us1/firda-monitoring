# Verified technical claims – Partial Discharge Learning Lab

How these were checked: WebFetch could not reach any site from this session (DNS blocked for webstore.iec.ch, webstore.ansi.org, vde-verlag.de), so everything below is based on web-search result text from publisher catalogues, bibliographic indexes and vendor pages. No standard was read in full. Status labels:
- **VERIFIED**: the claim appeared in search text from the cited source, or from a secondary source quoting it.
- **PARTIAL**: the core claim is supported, but a detail (a number or phase angle) is not.
- **NOT VERIFIED**: no source was found. Rephrase the claim or keep it out of the app.

---

## 1. PD definition — VERIFIED (via secondary quotation)
"Partial discharge: localized electrical discharge that only partially bridges the insulation between conductors and which can or cannot occur adjacent to a conductor." IEC 60270:2000, clause 3.1.
- Sources: `iec-60270-2000-amd1-2015`, quoted in `zvei-pd-lv-guideline-2017` (which cites DIN EN 60270 / VDE 0434 §3.1). Some secondary sources write "will or will not" instead of "can or cannot". The exact wording should be checked against the standard.
- **Edition note:** IEC 60270:2000 + A1:2015 has been **superseded by IEC 60270:2025 (Ed. 4.0, 2025-06-05)**, retitled "Charge-based measurement of partial discharges" (`iec-60270-2025`). I could not confirm whether Ed. 4.0 keeps the definition at clause 3.1. Suggested app wording: "IEC 60270 defines…", citing Ed. 3.0 §3.1 and noting Ed. 4.0 (2025) as current.

## 2. Apparent charge — VERIFIED (via secondary quotation)
- Definition (IEC 60270:2000 §3.3.1, paraphrased): the charge that, if injected within a very short time between the test-object terminals in a specified test circuit, would give the same instrument reading as the PD current pulse. It is usually expressed in pC.
- Note to §3.3.1, quoted by a secondary source: the apparent charge "is not equal to the amount of charge locally involved at the site of the discharge, which cannot be measured directly."
- The pC scale is set by calibration, i.e. injecting a known charge at the terminals. Ed. 4.0 adds a normative Annex A on calibrator performance tests. Vendor calibrators such as the OMICRON CAL 542 inject 0.1 pC–10 nC.
- Sources: `iec-60270-2000-amd1-2015`, `iec-60270-2025`, `omicron-mpd-800`, `boggs-1990-pd1` (abstract: measured PD magnitudes "rarely have absolute meaning" and are "effective" magnitudes), `lemke-2012`, and `tudelft-induced-vs-apparent-charge`. The last two give an academic counter-view: apparent charge correlates with the dipole moment at the site. That makes a good "going deeper" note.

## 3. Measurement units and non-convertibility — PARTIAL
- TEV is reported in **dBmV** (20·log10(V / 1 mV)). VERIFIED: `ea-pd-units-blog-2023`; `ea-ultratev-detector2` gives TEV thresholds of 20 and 29 dBmV.
- Airborne ultrasonic is reported in **dBµV**. VERIFIED: `ea-ultratev-detector2` gives an ultrasonic threshold of 6 dBµV.
- UHF is reported in **dBm** (or dBµV). VERIFIED: `megger-qa-pd-2021` says UHF readings are in dBµV or dBm rather than pC because the method cannot be calibrated. `qualitrol-uhf-amplitude` says dBm→pC conversion is controversial and needs a known source location plus a sensitivity check.
- No universal conversion exists. VERIFIED in substance: `ea-pd-units-blog-2023`, `qualitrol-uhf-amplitude`, `megger-qa-pd-2021`, `boggs-1990-pd1`.
- On-line rotating-machine PD reported in **mV**: **NOT VERIFIED** from an accessed source. It is very likely covered in `stone-2014-book`, `stone-2005` and `iec-60034-27-2-2023`, but I did not see that text. Mark it as "commonly reported" or verify it before publishing.
- Caution: EA criticises a bare "dB" with no reference as technically incorrect. The app should always show the reference unit (dBmV, dBµV, dBm).

## 4. Cable PD location by single-ended TDR — PARTIAL
- Principle (VERIFIED): single-ended measurement uses the time difference between the direct pulse and its reflection from the far end, together with cable length. Sources: `mashikian-1990`, `energies-2023-double-end` (snippet only), `omicron-mpd-800` (TDR-based location), `ieee-400-3-2022`.
- Formula (derived, not quoted from a source): with the far end open, a PD at distance x from the measuring end sends one pulse straight to the instrument and one to the far end, which reflects back. The extra path is 2(L − x), so Δt = 2(L − x)/v and **x = L − v·Δt/2**. This is consistent with the general TDR relation d = v·t/2 from Megger's TDR notes. No source was found that prints this exact form, so present it as a derivation.
- Propagation velocity (PARTIAL): sources report velocity factor 0.54–0.62 for power XLPE (≈162–186 m/µs, Megger basic TDR note), 0.5–0.56 c (≈150–168 m/µs, NETA study guide) and ≈160 m/µs (field article). Suggested wording: "typically about 150–190 m/µs for XLPE (roughly half the speed of light); measure or calibrate per cable." "Half of 300 m/µs" is only a rough mnemonic, and v depends on the cable and temperature.
- Caveats (VERIFIED in secondary literature): the reflected pulse is more attenuated and dispersed, and mixed XLPE/PILC sections make location uncertain.

## 5. Test-voltage frequencies — PARTIAL
- VLF: "The most commonly used, commercially available, VLF test frequency is 0.1 Hz." VLF is defined as < 1 Hz. VERIFIED: `ieee-400-2-2024` (catalogue abstract).
- DAC: **the range in IEEE 400.4 is NOT VERIFIED** (paywalled). A vendor datasheet (Megger HV DAC-200) gives **20–300 Hz**, and an INMR article describes 20–300 Hz as close to 50/60 Hz service stress (`megger-hv-dac`). The "20–500 Hz" figure could not be confirmed. Suggested wording: "typically tens to a few hundred Hz (e.g. 20–300 Hz for common DAC sets); oscillation frequency set by cable capacitance and test-set inductance." The resonance mechanism is textbook physics, not taken from a cited source.
- Related: IEC 60034-27-1 off-line machine PD covers 0.1–400 Hz, but its interpretation guidance applies only at 50/60 Hz (`iec-60034-27-1-2017`). IEC 60270:2025 covers AC up to 500 Hz and DC.

## 6. PRPD signatures — PARTIAL (vendor-level support; specific angles weakly sourced)
- Internal void discharges are roughly symmetric between the positive and negative half-cycles and sit on the rising slopes of the voltage. Symmetry is VERIFIED from an academic snippet (cris.unibo.it IEEE-format paper) and an HV-motor study. Concentration on rising slopes is supported by vendor text ("rising edges and peak regions"). Primary references to cite: `gulski-kreuger-1992`, `hudon-belec-2005`, `bartnikas-2002` (not read in full). The "0–90° and 180–270°" quadrant wording is a common simplification. Present it as approximate, because real patterns often begin before the zero crossing and spread past the peak.
- Surface discharge appears in both half-cycles but is asymmetric, with different amplitude and pulse density in each. Vendor-level only (Hertzinno blog, EA material). Cite `hudon-belec-2005` as the primary source and treat it as needing confirmation.
- Corona (point-to-plane, point at HV) starts first in the negative half-cycle as Trichel pulses concentrated around the negative peak (≈270°). Positive corona appears near the positive peak at higher voltage. VERIFIED in substance from a TU Delft study: "inception of corona on the negative half-cycle before the positive half-cycle, the concentration of the Trichel pulses over the peak of the sine wave". A vendor blog (Hertzinno) gives ≈250°–290°. Caveat: the polarity flips if the sharp point is on the earthed side.
- General caveats (VERIFIED, vendor/academic): noise can mimic PRPD patterns, several simultaneous sources superimpose, and the pattern depends on sensor bandwidth. Phase referencing must be correct (EA PRPD FAQ).

## 7. Other useful verified facts
- IEC TS 62478 bands: HF 3–30 MHz, VHF 30–300 MHz, plus UHF (`iec-ts-62478-2016`).
- OMICRON UHF 800 band: 100 MHz–2 GHz (vendor). PDL 650 acoustic band: 10–400 kHz with 4 channels (vendor).
- IEEE C57.113-2023: wideband apparent-charge method, 40–400 Hz, measuring circuit per IEC 60270.
- The TEV phenomenon is attributed to Dr John Reeves at EA Technology. Sources disagree on the year (1974 vs 1979). **No "Davies 1974 Transient Earth Voltage" paper could be found**; Neil Davies (EA Technology) wrote later papers, e.g. 2008 with D. Jones. Don't cite "Davies 1974".
- Judd UHF transformer paper authors are Judd, Yang and Hunter (IEEE EI Mag. 2005), not Farish/Hampton.
