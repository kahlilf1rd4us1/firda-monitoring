// Partial Discharge Learning Lab — main script (no framework, no build step).
import * as diagrams from './diagrams.js';
import { theoryIntro, theoryTopics } from '../data/theory.js';
import { testingIntro, onlineOffline, unitsSection, equipment } from '../data/testing.js';
import { references } from '../data/references.js';
import { examples, generateExample } from '../data/examples.js';
import { rules, minPoints, rulesExplanation } from '../data/rules.js';
import { evaluate, FEATURE_INFO, halfCycle } from './features.js';

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/* ------------------------------------------------------------------ Theme */
const THEME_KEY = 'pdlab-theme';
function initTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) document.documentElement.dataset.theme = saved;
  } catch { /* storage unavailable */ }
  $('#themeToggle').addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    const next = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch { /* ignore */ }
  });
}

/* ------------------------------------------------------------------ References + citations */
const CATEGORY_ORDER = ['standard', 'manufacturer', 'paper', 'book'];
const CATEGORY_LABEL = { standard: 'Standards & CIGRE', manufacturer: 'Manufacturer documents', paper: 'Papers & guidelines', book: 'Books' };
const ACCESS_LABEL = {
  'verified-full': ['Verified (full text)', 'ok'],
  'verified-catalogue-only': ['Checked via catalogue / index only', 'cat'],
  'could-not-access': ['Could not access', 'no'],
};
const orderedRefs = [...references].sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category));
const refNum = new Map(orderedRefs.map((r, i) => [r.id, i + 1]));
const refById = new Map(references.map((r) => [r.id, r]));
const citedIn = new Map(); // ref id -> [{anchor, title}]

function cite(html, context) {
  return html.replace(/\[\[([a-z0-9-]+)(?::([^\]]+))?\]\]/g, (_, id, section) => {
    const ref = refById.get(id);
    if (!ref) {
      console.warn('Unknown reference id:', id);
      return '';
    }
    if (context) {
      const list = citedIn.get(id) || [];
      if (!list.some((c) => c.anchor === context.anchor)) list.push(context);
      citedIn.set(id, list);
    }
    const tip = ref.title + (section ? ' — ' + section : '');
    return `<a class="cite" href="#ref-${id}" title="${esc(tip)}">[${refNum.get(id)}${section ? ', ' + esc(section) : ''}]</a>`;
  });
}

function renderReferences() {
  const chips = ['all', ...CATEGORY_ORDER]
    .map((c) => `<button type="button" class="chip" data-cat="${c}" aria-pressed="${c === 'all'}">${c === 'all' ? 'All' : CATEGORY_LABEL[c]}</button>`)
    .join('');
  const items = orderedRefs
    .map((r) => {
      const [accLabel, accCls] = ACCESS_LABEL[r.access] || ['Unknown', 'cat'];
      const cites = (citedIn.get(r.id) || []).map((c) => `<a href="#${c.anchor}">${esc(c.title)}</a>`).join(', ');
      const title = r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.title)}</a>` : esc(r.title);
      return `<li id="ref-${r.id}" data-cat="${r.category}">
        <span class="ref-num">[${refNum.get(r.id)}]</span>${title}
        <span class="badge ${accCls}">${accLabel}</span>
        <div class="ref-meta">${esc(r.publisher_or_authors)}${r.edition_or_year ? ' · ' + esc(r.edition_or_year) : ''}${r.sections ? ' · Relevant: ' + esc(r.sections) : ''}</div>
        ${r.notes ? `<div class="ref-meta">Note: ${esc(r.notes)}</div>` : ''}
        ${cites ? `<div class="ref-meta">Cited in: ${cites}</div>` : '<div class="ref-meta">Further reading (not cited in the text)</div>'}
      </li>`;
    })
    .join('');
  const total = references.length;
  const catOnly = references.filter((r) => r.access === 'verified-catalogue-only').length;
  const noAccess = references.filter((r) => r.access === 'could-not-access').length;
  return `
  <section class="card topic" id="references">
    <h3>References</h3>
    <div class="prose">
      <p><strong>Verification status (research carried out November 2026).</strong> The research workstream could not open publisher web pages or full texts from its environment (network restrictions). Titles, editions, dates and identifiers were checked against publisher catalogue entries, bibliographic indexes and manufacturer pages as shown in search results. Of ${total} references, ${catOnly} are marked <span class="badge cat">Checked via catalogue / index only</span> and ${noAccess} <span class="badge no">Could not access</span>. None could be read in full, so section or clause numbers are given only where they were confirmed by a secondary source. Standards are paywalled; always check the current edition before relying on a value.</p>
      <p>Edition notes: IEC 60270 Ed. 4.0 (2025) replaces Ed. 3.0 (2000) + A1 (2015); IEC 60034-27-2:2023 replaces TS 60034-27-2:2012; IEEE 1434-2014 is listed by IEEE as inactive since March 2025.</p>
    </div>
    <div class="ref-filter" role="group" aria-label="Filter references">${chips}</div>
    <ol class="ref-list">${items}</ol>
  </section>`;
}

function bindRefFilter(root) {
  root.querySelectorAll('.ref-filter .chip').forEach((btn) =>
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      root.querySelectorAll('.ref-filter .chip').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      root.querySelectorAll('.ref-list li').forEach((li) => (li.hidden = cat !== 'all' && li.dataset.cat !== cat));
    })
  );
}

/* ------------------------------------------------------------------ Content rendering */
function figure(name, caption) {
  if (!name || !diagrams[name]) return '';
  return `<figure class="diagram">${diagrams[name]()}${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>`;
}

function deepSections(list, ctx) {
  return (list || [])
    .map((d) => `<details class="deep"><summary>${esc(d.title)}</summary><div class="prose">${figure(d.diagram)}${cite(d.html, ctx)}</div></details>`)
    .join('');
}

function renderTheory() {
  const panel = $('#panel-theory');
  const nav = theoryTopics.map((t) => `<a href="#${t.id}">${esc(t.title)}</a>`).join('') + '<a href="#references">References</a>';
  const topics = theoryTopics
    .map((t) => {
      const ctx = { anchor: t.id, title: t.title };
      return `<section class="card topic" id="${t.id}">
        <h3>${esc(t.title)}</h3>
        <span class="simple-label">In simple terms</span>
        <div class="prose simple">${cite(t.simple, ctx)}</div>
        ${t.keypoints ? `<ul class="keypoints prose">${t.keypoints.map((k) => `<li>${cite(k, ctx)}</li>`).join('')}</ul>` : ''}
        ${figure(t.diagram, t.diagramCaption)}
        ${deepSections(t.deep, ctx)}
      </section>`;
    })
    .join('');
  // Testing content is rendered first (see init) so "cited in" includes Tab 2 too.
  panel.innerHTML = `<div class="intro">${theoryIntro}</div><nav class="subnav" aria-label="Theory topics">${nav}</nav>${topics}${renderReferences()}`;
  bindRefFilter(panel);
}

const CHAIN_FIELDS = [
  ['principle', 'Physical principle'],
  ['source', 'Voltage source'],
  ['sensor', 'Sensor'],
  ['signalPath', 'Signal path'],
  ['output', 'Instrument output'],
  ['interpretation', 'Interpretation'],
  ['applications', 'Typical applications'],
  ['limitations', 'Limitations'],
];
const MODE_TAG = {
  online: '<span class="tag online">ONLINE</span>',
  offline: '<span class="tag offline">OFFLINE</span>',
  both: '<span class="tag online">ONLINE</span><span class="tag offline">OFFLINE</span>',
};

function renderMethod(m, ctx) {
  const chain = CHAIN_FIELDS.filter(([k]) => m[k]).map(([k, label]) => `<dt>${label}</dt><dd>${cite(m[k], ctx)}</dd>`).join('');
  return `<details class="method">
    <summary><h4 style="display:inline">${esc(m.name)}</h4> ${MODE_TAG[m.mode] || ''}</summary>
    <dl class="chain">${chain}</dl>
  </details>`;
}

function tdrBlock(ctx) {
  return `
  <h4>Locating cable PD with time-domain reflectometry (TDR)</h4>
  <div class="prose"><p>In an offline test the far end is left open. A PD pulse splits into two: one travels straight to the measuring end, the other travels to the far end, reflects, and comes back. The <strong>time gap</strong> between the two arrivals tells you how far the defect is from the far end.${cite('[[mashikian-1990]][[ieee-400-3-2022]][[omicron-mpd-800]]', ctx)}</p></div>
  ${figure('tdrDiagram', 'Direct (①) and reflected (②) pulses from a PD at distance x. Simplified: real pulses are noisy and the reflection is smaller and wider.')}
  <div class="card" style="background:var(--surface-2)">
    <strong>Try it: PD location calculator</strong>
    <form class="calc" id="tdrCalc" onsubmit="return false">
      <label>Cable length L (m)<input type="number" id="tdrL" value="1200" min="1" step="1"></label>
      <label>Velocity v (m/µs)<input type="number" id="tdrV" value="165" min="50" max="300" step="1"></label>
      <label>Time gap Δt (µs)<input type="number" id="tdrDt" value="9" min="0" step="0.01"></label>
    </form>
    <div class="calc-out" id="tdrOut" aria-live="polite"></div>
    <p class="small muted" id="tdrNote"></p>
  </div>`;
}

function bindTdr() {
  const L = $('#tdrL'), V = $('#tdrV'), D = $('#tdrDt'), out = $('#tdrOut'), note = $('#tdrNote');
  if (!L) return;
  const update = () => {
    const l = +L.value, v = +V.value, dt = +D.value;
    if (!(l > 0 && v > 0 && dt >= 0)) {
      out.textContent = 'Enter positive values.';
      note.textContent = '';
      return;
    }
    const x = l - (v * dt) / 2;
    const maxDt = (2 * l) / v;
    if (x < 0) {
      out.textContent = 'Δt is longer than a full round trip — check L, v or the pulse pairing.';
    } else {
      out.textContent = `PD source ≈ ${x.toFixed(0)} m from the near (measuring) end  (${(l - x).toFixed(0)} m from the far end)`;
    }
    note.textContent = `x = L − v·Δt/2. Far-end echo of an injected pulse would arrive after 2L/v = ${maxDt.toFixed(2)} µs. A 1% error in v moves the answer by about ${((v * dt) / 200).toFixed(1)} m.`;
  };
  [L, V, D].forEach((el) => el.addEventListener('input', update));
  update();
}

function renderTesting() {
  const panel = $('#panel-testing');
  const nav = [['initiation', 'Online vs offline'], ['units', 'Units'], ['conventional', 'Measuring circuit'], ...equipment.map((e) => [e.id, e.title])]
    .map(([id, t]) => `<a href="#${id}">${esc(t)}</a>`)
    .join('');
  const unitsCtx = { anchor: 'units', title: 'Units and conversion' };
  const sections = equipment
    .map((e) => {
      const ctx = { anchor: e.id, title: e.title };
      return `<section class="card topic" id="${e.id}">
        <h3>${esc(e.title)}</h3>
        <span class="simple-label">In simple terms</span>
        <div class="prose simple">${cite(e.simple, ctx)}</div>
        ${figure(e.diagram, e.diagramCaption)}
        <p class="small muted">Open each method to see the full measurement chain.</p>
        <div class="method-grid">${e.methods.map((m) => renderMethod(m, ctx)).join('')}</div>
        ${e.extra === 'tdr' ? tdrBlock(ctx) : ''}
        ${deepSections(e.deep, ctx)}
        ${e.instruments ? `<details class="deep"><summary>Instrument examples (model-specific documents)</summary><div class="prose">${cite(e.instruments, ctx)}</div></details>` : ''}
      </section>`;
    })
    .join('');
  panel.innerHTML = `
    <div class="intro">${testingIntro}</div>
    <nav class="subnav" aria-label="Testing topics">${nav}</nav>
    <section class="card topic" id="initiation"><h3>Online vs offline testing</h3>${onlineOffline}</section>
    <section class="card topic" id="units"><h3>Units — and why they don’t convert</h3>
      <div class="prose">${cite(unitsSection.simple, unitsCtx)}</div>
      <details class="deep"><summary>Deeper: why there is no universal conversion</summary><div class="prose">${cite(unitsSection.deep, unitsCtx)}</div></details>
    </section>
    <section class="card topic" id="conventional"><h3>The conventional measuring circuit (IEC 60270)</h3>
      <div class="prose"><p>Most offline tests use the same basic circuit: a voltage source energises the test object through a filter; a <strong>coupling capacitor C<sub>k</sub></strong> provides a path for the fast PD current pulse; a <strong>measuring impedance Z<sub>m</sub></strong> converts it to a voltage for the instrument. A calibrator injects a known charge before the test so readings can be scaled in pC.${cite('[[iec-60270-2000-amd1-2015]][[iec-60270-2025]][[hauschild-lemke-2019]]', { anchor: 'conventional', title: 'Conventional measuring circuit' })}</p></div>
      ${figure('iec60270Diagram', 'Simplified IEC 60270-style circuit (coupling device in series with the coupling capacitor). Other arrangements place Zm in series with the test object.')}
    </section>
    ${sections}`;
  bindTdr();
}

/* ------------------------------------------------------------------ Router */
const PANELS = ['theory', 'testing', 'simulator'];
function route() {
  const hash = decodeURIComponent(location.hash.slice(1)) || 'theory';
  let panelId = PANELS.includes(hash) ? hash : null;
  let target = null;
  if (!panelId) {
    target = document.getElementById(hash);
    const panel = target?.closest('.panel');
    panelId = panel ? panel.id.replace('panel-', '') : 'theory';
  }
  PANELS.forEach((p) => {
    const active = p === panelId;
    $('#panel-' + p).hidden = !active;
    $('#tab-' + p).setAttribute('aria-selected', String(active));
  });
  if (target) {
    target.closest('details')?.setAttribute('open', '');
    requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  } else window.scrollTo(0, 0);
  if (panelId === 'simulator') sim.render();
}

/* ------------------------------------------------------------------ Simulator */
const sim = (() => {
  const svg = $('#prpdPlot');
  const tip = $('#plotTip');
  const state = { points: [], selected: null, mode: 'add', history: [], nextId: 1, snap: false };
  let geom = null;

  const geometry = () => {
    const narrow = svg.parentElement.clientWidth < 560;
    const W = 800, H = narrow ? 640 : 440;
    const m = { l: narrow ? 92 : 70, r: narrow ? 36 : 22, t: 30, b: narrow ? 74 : 56 };
    return { W, H, m, pw: W - m.l - m.r, ph: H - m.t - m.b, narrow };
  };
  const xOf = (phase) => geom.m.l + (phase / 360) * geom.pw;
  const yOf = (mag) => geom.m.t + geom.ph - (mag / 100) * geom.ph;

  function toData(evt) {
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    const phase = ((p.x - geom.m.l) / geom.pw) * 360;
    const magnitude = ((geom.m.t + geom.ph - p.y) / geom.ph) * 100;
    return { phase, magnitude, sx: p.x, sy: p.y };
  }
  const inside = (d) => d.phase >= 0 && d.phase <= 360 && d.magnitude >= 0 && d.magnitude <= 100;

  function snapshot() {
    state.history.push(state.points.map((p) => ({ ...p })));
    if (state.history.length > 200) state.history.shift();
  }

  function addPoint(phase, magnitude) {
    if (state.snap) {
      phase = Math.round(phase / 5) * 5;
      magnitude = Math.round(magnitude);
    }
    phase = Math.min(359.9, Math.max(0, phase));
    magnitude = Math.min(100, Math.max(0, magnitude));
    snapshot();
    const p = { id: state.nextId++, phase: +phase.toFixed(1), magnitude: +magnitude.toFixed(1) };
    state.points.push(p);
    state.selected = p.id;
    update();
  }

  function deletePoint(id) {
    snapshot();
    state.points = state.points.filter((p) => p.id !== id);
    if (state.selected === id) state.selected = null;
    update();
  }

  function undo() {
    if (!state.history.length) return;
    state.points = state.history.pop();
    if (!state.points.some((p) => p.id === state.selected)) state.selected = null;
    $('#exampleNote').textContent = '';
    update();
  }

  function clear() {
    if (!state.points.length) return;
    snapshot();
    state.points = [];
    state.selected = null;
    $('#exampleNote').textContent = 'Plot cleared. Use Undo to bring the points back.';
    update();
  }

  function loadExample(ex) {
    snapshot();
    state.points = generateExample(ex).map((p) => ({ id: state.nextId++, ...p }));
    state.selected = null;
    $('#exampleNote').innerHTML = `<strong>${esc(ex.name)}</strong> — ${esc(ex.note)}`;
    update();
  }

  function nearest(d, radiusPx = 16) {
    // radius measured in SVG units (≈ screen px scaled); compare in SVG coordinates
    const scale = svg.getBoundingClientRect().width / geom.W || 1;
    const r = radiusPx / scale;
    let best = null, bestD = Infinity;
    for (const p of state.points) {
      const dist = Math.hypot(xOf(p.phase) - d.sx, yOf(p.magnitude) - d.sy);
      if (dist < bestD) { bestD = dist; best = p; }
    }
    return bestD <= r ? best : null;
  }

  function render() {
    if ($('#panel-simulator').hidden) return;
    geom = geometry();
    const { W, H, m, pw, ph, narrow } = geom;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.classList.toggle('inspect', state.mode === 'inspect');
    const fs = narrow ? 1.5 : 1; // scale fonts up on narrow screens (SVG gets scaled down)
    let s = '';
    s += `<rect x="${xOf(0)}" y="${m.t}" width="${pw / 2}" height="${ph}" class="half-pos"/>`;
    s += `<rect x="${xOf(180)}" y="${m.t}" width="${pw / 2}" height="${ph}" class="half-neg"/>`;
    for (let p = 0; p <= 360; p += 45) {
      s += `<line x1="${xOf(p)}" y1="${m.t}" x2="${xOf(p)}" y2="${m.t + ph}" class="grid"/>`;
      if (!narrow || p % 90 === 0) s += `<text x="${xOf(p)}" y="${m.t + ph + 20 * fs}" text-anchor="middle" class="tick" style="font-size:${12 * fs}px">${p}°</text>`;
    }
    for (let v = 0; v <= 100; v += 20) {
      s += `<line x1="${m.l}" y1="${yOf(v)}" x2="${m.l + pw}" y2="${yOf(v)}" class="grid"/>`;
      s += `<text x="${m.l - 8}" y="${yOf(v) + 4}" text-anchor="end" class="tick" style="font-size:${12 * fs}px">${v}</text>`;
    }
    let wave = '';
    for (let p = 0; p <= 360; p += 3) wave += (p ? 'L' : 'M') + xOf(p).toFixed(1) + ' ' + yOf(50 + 40 * Math.sin((p * Math.PI) / 180)).toFixed(1);
    s += `<path d="${wave}" class="wave"/>`;
    s += `<text x="${xOf(90)}" y="${m.t - 10}" text-anchor="middle" class="quad-label" style="font-size:${11 * fs}px">+ half-cycle</text>`;
    s += `<text x="${xOf(270)}" y="${m.t - 10}" text-anchor="middle" class="quad-label" style="font-size:${11 * fs}px">− half-cycle</text>`;
    s += `<line x1="${m.l}" y1="${m.t + ph}" x2="${m.l + pw}" y2="${m.t + ph}" class="axis"/>`;
    s += `<line x1="${m.l}" y1="${m.t}" x2="${m.l}" y2="${m.t + ph}" class="axis"/>`;
    s += `<text x="${m.l + pw / 2}" y="${H - 12}" text-anchor="middle" class="axis-title" style="font-size:${13 * fs}px">Phase angle of test voltage (°)</text>`;
    const yl = narrow ? 'Simulated magnitude (a.u.)' : 'Simulated pulse magnitude (arbitrary units)';
    s += `<text transform="translate(${18 * fs} ${m.t + ph / 2}) rotate(-90)" text-anchor="middle" class="axis-title" style="font-size:${13 * fs}px">${yl}</text>`;
    const r = narrow ? 7 : 4.5;
    const sel = state.points.find((p) => p.id === state.selected);
    s += state.points
      .filter((p) => p.id !== state.selected)
      .map((p) => `<circle cx="${xOf(p.phase).toFixed(1)}" cy="${yOf(p.magnitude).toFixed(1)}" r="${r}" class="pt"/>`)
      .join('');
    if (sel) s += `<circle cx="${xOf(sel.phase)}" cy="${yOf(sel.magnitude)}" r="${r + 3}" class="pt sel"/>`;
    svg.innerHTML = s;
  }

  function pointExplanation(p) {
    const v = Math.sin((p.phase * Math.PI) / 180);
    const dv = Math.cos((p.phase * Math.PI) / 180);
    const rising = v * dv > 0 || Math.abs(v) < 0.02; // |V| increasing
    const half = halfCycle(p.phase);
    let region;
    if (p.phase < 90) region = 'between the positive-going zero crossing and the positive peak';
    else if (p.phase < 180) region = 'after the positive peak, while the voltage falls back towards zero';
    else if (p.phase < 270) region = 'between the negative-going zero crossing and the negative peak';
    else region = 'after the negative peak, while the voltage returns towards zero';
    const nearPeak = Math.abs(p.phase - 90) <= 20 ? 'positive' : Math.abs(p.phase - 270) <= 20 ? 'negative' : null;
    return `
      <dl class="info-kv">
        <dt>Phase</dt><dd>${p.phase.toFixed(1)}°</dd>
        <dt>Magnitude</dt><dd>${p.magnitude.toFixed(1)} a.u.</dd>
        <dt>Half-cycle</dt><dd>${half}</dd>
        <dt>Voltage at this moment</dt><dd>${(v * 100).toFixed(0)}% of peak, |V| ${rising ? 'rising' : 'falling'}</dd>
        <dt>Time after 0°</dt><dd>${((p.phase / 360) * 20).toFixed(2)} ms @50 Hz · ${((p.phase / 360) * 16.667).toFixed(2)} ms @60 Hz</dd>
      </dl>
      <div class="prose small">
        <p><strong>Phase:</strong> this pulse occurred ${region}. ${
          rising
            ? 'The voltage magnitude was <em>increasing</em> — the part of the cycle where void and surface discharges usually occur.'
            : 'The voltage magnitude was <em>decreasing</em> — fewer void discharges are expected here, although residual charge can shift activity.'
        }${nearPeak ? ` It is close to the ${nearPeak} voltage peak, where corona from a sharp point typically appears.` : ''}</p>
        <p><strong>Magnitude:</strong> ${p.magnitude.toFixed(1)} on a 0–100 arbitrary scale. In a real test this would be a value in pC (IEC 60270), mV, dBmV, dBµV or dBm depending on the method — and these cannot be converted into each other.</p>
        <p class="muted">One pulse alone cannot identify a defect type: patterns emerge only from many pulses over many cycles.</p>
      </div>
      <button type="button" class="btn btn-danger" data-del="${p.id}">Delete this point</button>`;
  }

  function renderInfo() {
    const box = $('#pointInfo');
    const p = state.points.find((q) => q.id === state.selected);
    if (!p) {
      box.innerHTML = '<p class="muted small">Switch to <strong>Inspect</strong> and tap a point, or pick one from the table below. Newly added points are selected automatically.</p>';
      return;
    }
    box.innerHTML = pointExplanation(p);
    box.querySelector('[data-del]').addEventListener('click', () => deletePoint(p.id));
  }

  function checkList(m) {
    return `<ul>${m.checks
      .map((c) => `<li class="${c.met ? 'met' : 'unmet'}" title="${esc(c.why)}">${esc(c.label)}${c.key ? '' : ' <span class="muted">(secondary)</span>'} — measured ${FEATURE_INFO[c.feature].fmt(c.actual)}</li>`)
      .join('')}</ul>`;
  }

  function renderAnalysis() {
    const box = $('#analysis');
    const r = evaluate(state.points, rules, minPoints);
    let html = '';
    if (r.status === 'empty') {
      html = '<p class="muted small">Add points or load an example to see a pattern comparison.</p>';
    } else if (r.status === 'single') {
      html = '<p class="verdict">One point</p><p class="small">See “Selected point” for what its phase and magnitude mean. Add more points to compare with reference patterns.</p>';
    } else {
      if (r.status === 'match') {
        html += `<p class="verdict">Resembles: ${esc(r.best.name)}</p><p class="small muted">Educational comparison with a synthetic textbook shape — not a diagnosis.</p>`;
      } else {
        html += `<p class="verdict">Insufficient data or ambiguous pattern</p><p class="small">${esc(r.message)}</p>`;
      }
      const shown = r.status === 'match' ? r.matches : r.matches;
      html += shown
        .map((m) => `<div class="result"><h4>${esc(m.name)} <span class="level ${m.level}">${m.level} resemblance</span></h4>${checkList(m)}</div>`)
        .join('');
      if (!shown.length && r.status !== 'insufficient') html += '<p class="small muted">No reference shape meets at least half of its checks.</p>';
      const rows = Object.entries(FEATURE_INFO)
        .filter(([k]) => r.features[k] !== undefined)
        .map(([k, info]) => `<tr><td>${esc(info.label)}</td><td>${info.fmt(r.features[k])}</td></tr>`)
        .join('');
      html += `<details class="small"><summary>Features calculated from your points</summary><div class="table-scroll"><table class="features-table">${rows}</table></div></details>`;
    }
    box.innerHTML = html;
  }

  function renderTable() {
    const n = state.points.length;
    $('#pointCount').textContent = `${n} point${n === 1 ? '' : 's'}`;
    const rows = [...state.points].sort((a, b) => a.phase - b.phase);
    $('#pointsBody').innerHTML = rows
      .map((p, i) => `<tr data-id="${p.id}" class="${p.id === state.selected ? 'sel' : ''}"><td>${i + 1}</td><td>${p.phase.toFixed(1)}</td><td>${p.magnitude.toFixed(1)}</td><td>${halfCycle(p.phase)}</td><td><button type="button" class="btn-link" data-del="${p.id}" aria-label="Delete point at ${p.phase.toFixed(1)} degrees">Delete</button></td></tr>`)
      .join('') || '<tr><td colspan="5" class="muted">No points yet.</td></tr>';
  }

  function update() {
    $('#undoBtn').disabled = !state.history.length;
    $('#clearBtn').disabled = !state.points.length;
    render();
    renderInfo();
    renderAnalysis();
    renderTable();
  }

  function setMode(mode) {
    state.mode = mode;
    document.querySelectorAll('.seg-btn').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.mode === mode)));
    svg.classList.toggle('inspect', mode === 'inspect');
  }

  function init() {
    $('#exampleButtons').innerHTML = examples.map((ex) => `<button type="button" class="btn" data-ex="${ex.id}">${esc(ex.name)}</button>`).join('');
    $('#exampleButtons').addEventListener('click', (e) => {
      const b = e.target.closest('[data-ex]');
      if (b) loadExample(examples.find((x) => x.id === b.dataset.ex));
    });
    $('#rulesExplain').innerHTML = rulesExplanation;
    document.querySelectorAll('.seg-btn').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
    $('#undoBtn').addEventListener('click', undo);
    $('#clearBtn').addEventListener('click', clear);
    $('#snapToggle').addEventListener('change', (e) => (state.snap = e.target.checked));

    svg.addEventListener('pointerup', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      const d = toData(e);
      if (state.mode === 'inspect') {
        const p = nearest(d, e.pointerType === 'mouse' ? 12 : 24);
        state.selected = p ? p.id : null;
        update();
        if (p && matchMedia('(max-width: 900px)').matches) $('#pointInfo').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else if (inside(d)) {
        addPoint(d.phase, d.magnitude);
      }
    });
    svg.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const d = toData(e);
      if (!inside(d)) { tip.hidden = true; return; }
      const p = nearest(d, 12);
      const rect = svg.getBoundingClientRect(), scale = rect.width / geom.W;
      tip.hidden = false;
      tip.style.left = (p ? xOf(p.phase) : d.sx) * scale + 'px';
      tip.style.top = (p ? yOf(p.magnitude) : d.sy) * scale + 'px';
      tip.textContent = p ? `Point: ${p.phase.toFixed(1)}°, ${p.magnitude.toFixed(1)} a.u.` : `${d.phase.toFixed(1)}°, ${d.magnitude.toFixed(1)} a.u.`;
    });
    svg.addEventListener('pointerleave', () => (tip.hidden = true));

    $('#pointsBody').addEventListener('click', (e) => {
      const del = e.target.closest('[data-del]');
      if (del) return deletePoint(+del.dataset.del);
      const row = e.target.closest('tr[data-id]');
      if (row) {
        state.selected = +row.dataset.id;
        update();
      }
    });
    $('#manualForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const ph = +$('#mPhase').value, mg = +$('#mMag').value;
      if (ph >= 0 && ph <= 360 && mg >= 0 && mg <= 100) addPoint(ph % 360, mg);
    });
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !$('#panel-simulator').hidden && !e.target.closest('input')) {
        e.preventDefault();
        undo();
      }
    });
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(render, 120); });
    update();
  }

  return { init, render, state, _test: { addPoint, undo, clear, loadExample } };
})();

/* ------------------------------------------------------------------ Init */
initTheme();
renderTesting(); // first, so the reference list can show "cited in" for both tabs
renderTheory();
sim.init();
window.addEventListener('hashchange', route);
route();
window.pdLab = { sim }; // handy for debugging in the browser console
