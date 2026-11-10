# Partial Discharge Learning Lab (v1)

An educational web app that helps electrical technicians and engineers understand partial discharge (PD), learn how PD test equipment works, and explore simulated PRPD patterns.

- **Tab 1 – Theory & References**: PD fundamentals, defects and field stress, internal/surface discharge, corona, apparent charge, phase angle, PRPD plots. Plain-English first, deeper theory in expandable panels, SVG diagrams, and a filterable reference list with “cited in” links.
- **Tab 2 – How PD Testing Works**: organised by equipment (MV cables, switchgear, transformers, rotating machines). Each method shows the full chain: principle → voltage source → sensor → signal path → output → interpretation → limitations, tagged ONLINE/OFFLINE. Includes a units section (why pC, dBmV, dBµV and dBm don’t convert), an IEC 60270 circuit diagram, a cable TDR diagram and a PD-location calculator.
- **Tab 3 – PRPD Simulator**: click or tap to add points (0–360° × simulated magnitude in arbitrary units), inspect points, undo, clear, type points in exactly, and load five **synthetic** examples. Transparent rules compare the points with textbook shapes and show every check. The result can be “Insufficient data or ambiguous pattern”, and no confidence percentages are given.

## Run locally (port 3001)

Requirements: [Node.js](https://nodejs.org) 18 or newer. There are no dependencies to install.

```bash
cd pd-learning-lab
npm start            # or: node server.js
```

Then open **http://localhost:3001** in your browser.

- Use another port with `PORT=4000 npm start` (Windows PowerShell: `$env:PORT=4000; npm start`).
- To open it from a phone on the same network, run `HOST=0.0.0.0 npm start` and browse to `http://<your-PC-IP>:3001`.
- Run the classifier tests with `npm test`.

## Project structure

```
pd-learning-lab/
├── server.js                 # tiny static server (Node built-ins only), default port 3001
├── public/
│   ├── index.html            # page shell, tabs, simulator layout
│   ├── css/styles.css        # responsive layout, light/dark themes
│   ├── js/app.js             # routing, rendering, citations, simulator UI
│   ├── js/diagrams.js        # inline SVG diagrams
│   ├── js/features.js        # PRPD feature extraction + rule evaluation (pure functions)
│   └── data/                 # ← edit content here, no code changes needed
│       ├── theory.js         # Tab 1 text
│       ├── testing.js        # Tab 2 text (methods use a fixed set of fields)
│       ├── references.js     # reference list (id, edition, URL, access status, notes)
│       ├── examples.js       # synthetic example generators (clusters, seeds)
│       └── rules.js          # comparison rules and thresholds
├── tests/classifier.test.mjs # checks each synthetic example gets the intended result
└── docs/research-claims.md   # research notes: which technical claims were verified, and how
```

### Updating content

- **Citations**: write `[[reference-id]]` or `[[reference-id:clause 3.1]]` in any text in `data/theory.js` or `data/testing.js`. Ids are defined in `data/references.js`.
- **Diagrams**: add a function to `js/diagrams.js` and reference it by name (`diagram: 'myDiagram'`).
- **Examples**: add an entry to `data/examples.js` with phase/magnitude clusters.
- **Rules**: change thresholds or add criteria in `data/rules.js`. Feature names are listed in `FEATURE_INFO` in `js/features.js`. Run `npm test` afterwards.

## Reference verification status

The research workstream could not open publisher pages or full texts (network restrictions in its environment). Titles, editions, dates and identifiers were checked against catalogue entries, bibliographic indexes and manufacturer pages seen in search results. Each reference in the app is labelled **“Checked via catalogue / index only”** or **“Could not access”**. Clause numbers are given only where a secondary source confirmed them. See `docs/research-claims.md` for details, including newer editions (e.g. IEC 60270 Ed. 4.0, 2025) and claims that could not be verified.

## Planned extension: real measurement data import

v1 is client-side only and uses `{ phase, magnitude }` points. Planned additions:

1. CSV import with explicit units.
2. A density (2-D histogram) view for large files.
3. Rules for keeping each method’s units separate.
4. Converters for documented vendor export formats.

## Disclaimer

Educational use only. Synthetic patterns and the comparison rules are not validated diagnostics. Follow manufacturer instructions, applicable standards and site safety rules, and rely on qualified engineering judgement.
