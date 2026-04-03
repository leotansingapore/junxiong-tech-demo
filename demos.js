/* ============================================================
   DEMOS.JS — Hero, Platform Grid, Modal System, Scroll Reveal
   ============================================================ */

/* ============================================================
   PLATFORM DATA
   ============================================================ */
const PLATFORMS = [
  {
    id: 'calculator',
    icon: '🧮',
    iconClass: 'calculator',
    title: 'Investment Plan Simulator',
    desc: 'Illustrate long-term investment growth with fees, premium holidays & dividend modes',
    features: [
      '10-year investment projections',
      'Fee impact analysis',
      'Premium holiday simulation',
      'Dividend withdrawal mode',
    ],
  },
  {
    id: 'tracker',
    icon: '🌳',
    iconClass: 'tracker',
    title: 'Activity Tracker',
    desc: '11-module gamified performance platform for advisory teams',
    features: [
      'Real-time activity feed with GPS',
      'Hall of Fame leaderboard',
      'Interactive pricing builder',
      'AI coaching & team reflections',
    ],
  },
  {
    id: 'compass',
    icon: '🧭',
    iconClass: 'compass',
    title: 'Product Compass',
    desc: 'AI-powered training platform for exam prep & roleplay',
    features: [
      'CMFAS exam modules',
      'AI roleplay',
      'Product knowledge base',
      'Progress tracking',
    ],
  },
  {
    id: 'launchpad',
    icon: '🚀',
    iconClass: 'launchpad',
    title: 'Ad Launchpad',
    desc: 'Self-service Meta ad campaigns in 5 steps',
    features: [
      'Campaign templates',
      'Copy editor with preview',
      'Audience targeting',
      'Lead tracking',
    ],
  },
  {
    id: 'financehub',
    icon: '💼',
    iconClass: 'financehub',
    title: 'Finance Hub',
    desc: 'Client financial planning dashboard',
    features: [
      'Cash flow analysis',
      'Net worth tracking',
      'Insurance coverage gap',
      'CPF projections',
    ],
  },
];

/* ============================================================
   DEMO RENDERERS — populated by Tasks 5-9
   ============================================================ */
const DEMO_RENDERERS = {};

/* ============================================================
   CALCULATOR DEMO — Long-Term Investment Plan Simulator
   Single-view professional investment illustrator
   ============================================================ */

/* --- Shared slider helper (used by Investment Plan Simulator) --- */
function calcSlider(id, label, min, max, step, defaultVal, fmt) {
  var wrap  = document.createElement('div');
  wrap.className = 'demo-slider-wrap';

  var labelRow = document.createElement('div');
  labelRow.className = 'demo-slider-label';

  var lSpan = document.createElement('span');
  lSpan.textContent = label;

  var vSpan = document.createElement('span');
  vSpan.className = 'demo-slider-value';
  vSpan.id = id + 'Val';
  vSpan.textContent = fmt(defaultVal);

  labelRow.appendChild(lSpan);
  labelRow.appendChild(vSpan);

  var input = document.createElement('input');
  input.type = 'range';
  input.className = 'demo-slider';
  input.id = id;
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = defaultVal;

  wrap.appendChild(labelRow);
  wrap.appendChild(input);
  return wrap;
}

/* --- Result card helper --- */
function calcCard(labelText, valueId, colorClass) {
  var card = document.createElement('div');
  card.className = 'result-card';

  var lbl = document.createElement('div');
  lbl.className = 'result-card-label';
  lbl.textContent = labelText;

  var val = document.createElement('div');
  val.className = 'result-card-value' + (colorClass ? ' ' + colorClass : '');
  val.id = valueId;
  val.textContent = '—';

  card.appendChild(lbl);
  card.appendChild(val);
  return card;
}

/* --- Wire slider helper (fires updateFn on change) --- */
function wireCalcSlider(slider, valId, fmt, updateFn) {
  var input = slider.querySelector('input');
  input.addEventListener('input', function() {
    document.getElementById(valId).textContent = fmt(this.value);
    updateFn();
  });
}

/* ============================================================
   INVESTMENT PLAN SIMULATOR — helpers & renderer
   ============================================================ */

/* --- Plan duration segmented control --- */
function buildDurationControl(durations, defaultDuration, onChange) {
  var wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;';

  durations.forEach(function(d) {
    var btn = document.createElement('button');
    btn.textContent = d + ' yr' + (d === 1 ? '' : 's');
    btn.dataset.duration = d;
    btn.style.cssText = [
      'padding:6px 14px',
      'font-size:0.82rem',
      'font-weight:600',
      'border-radius:6px',
      'border:1px solid var(--border)',
      'background:' + (d === defaultDuration ? 'var(--accent)' : 'var(--surface2)'),
      'color:' + (d === defaultDuration ? '#fff' : 'var(--text2)'),
      'cursor:pointer',
      'transition:background .15s,color .15s,border-color .15s',
    ].join(';');
    btn.addEventListener('click', function() {
      wrap.querySelectorAll('button').forEach(function(b) {
        var isActive = b === btn;
        b.style.background = isActive ? 'var(--accent)' : 'var(--surface2)';
        b.style.color = isActive ? '#fff' : 'var(--text2)';
        b.style.borderColor = isActive ? 'var(--accent)' : 'var(--border)';
      });
      onChange(d);
    });
    wrap.appendChild(btn);
  });

  return wrap;
}

/* --- Pill toggle switch --- */
function buildToggle(id, labelText, defaultOn, onChange) {
  var wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);';

  var lbl = document.createElement('span');
  lbl.style.cssText = 'font-size:0.85rem;color:var(--text2);';
  lbl.textContent = labelText;

  var track = document.createElement('div');
  track.style.cssText = [
    'position:relative',
    'width:40px',
    'height:22px',
    'border-radius:11px',
    'background:' + (defaultOn ? 'var(--accent)' : 'var(--surface3,#374151)'),
    'cursor:pointer',
    'transition:background .2s',
    'flex-shrink:0',
  ].join(';');

  var knob = document.createElement('div');
  knob.style.cssText = [
    'position:absolute',
    'top:3px',
    'left:' + (defaultOn ? '21px' : '3px'),
    'width:16px',
    'height:16px',
    'border-radius:50%',
    'background:#fff',
    'transition:left .2s',
    'box-shadow:0 1px 3px rgba(0,0,0,.3)',
  ].join(';');

  track.appendChild(knob);
  wrap.appendChild(lbl);
  wrap.appendChild(track);

  var isOn = defaultOn;
  track.addEventListener('click', function() {
    isOn = !isOn;
    track.style.background = isOn ? 'var(--accent)' : 'var(--surface3,#374151)';
    knob.style.left = isOn ? '21px' : '3px';
    onChange(isOn);
  });

  return { el: wrap, getId: function() { return isOn; } };
}

/* ============================================================
   INVESTMENT PLAN SIMULATOR — calculator / computation engine
   ============================================================ */

function invSimCompute(cfg) {
  /* cfg: { duration, monthlyPremium, returnRate, feeRate, premiumHoliday, dividendMode } */
  var rows = [];
  var balance = 0;
  for (var yr = 1; yr <= cfg.duration; yr++) {
    var contribution = (cfg.premiumHoliday && yr === 6) ? 0 : cfg.monthlyPremium * 12;
    var growth       = balance * (cfg.returnRate / 100);
    var fees         = (balance + contribution) * (cfg.feeRate / 100);
    var dividend     = (cfg.dividendMode && yr >= 5) ? balance * 0.04 : 0;
    balance          = balance + contribution + growth - fees - dividend;
    rows.push({
      year:          yr,
      contribution:  contribution,
      growth:        growth,
      fees:          fees,
      dividend:      dividend,
      balance:       Math.max(balance, 0),
    });
  }
  return rows;
}

function invSimTotals(cfg) {
  var rows          = invSimCompute(cfg);
  var last          = rows[rows.length - 1];
  var totalPaid     = rows.reduce(function(s, r) { return s + r.contribution; }, 0);
  var projectedVal  = last.balance;
  var netReturn     = projectedVal - totalPaid;
  /* Annualized return (CAGR) after fees */
  var cagr = totalPaid > 0 ? (Math.pow(projectedVal / totalPaid, 1 / cfg.duration) - 1) * 100 : 0;
  return { rows: rows, totalPaid: totalPaid, projectedVal: projectedVal, netReturn: netReturn, cagr: cagr };
}

/* ============================================================
   INVESTMENT PLAN SIMULATOR — DOM renderer
   ============================================================ */
DEMO_RENDERERS.calculator = function(container) {
  container.id = 'invSimDemo';

  var fmtDollar = function(v) { return '$' + Math.round(Number(v)).toLocaleString(); };
  var fmtPct    = function(v) { return parseFloat(v).toFixed(1) + '%'; };

  /* ---- SECTION HEADER helper ---- */
  function sectionHeader(text) {
    var h = document.createElement('div');
    h.style.cssText = [
      'font-size:0.72rem',
      'font-weight:700',
      'letter-spacing:.08em',
      'text-transform:uppercase',
      'color:var(--text3)',
      'margin-bottom:12px',
      'padding-bottom:6px',
      'border-bottom:1px solid var(--border)',
    ].join(';');
    h.textContent = text;
    return h;
  }

  /* ======================================================
     TAB BAR
     ====================================================== */
  var TAB_DEFS = [
    { id: 'plan',       label: 'Plan Simulator' },
    { id: 'retirement', label: 'Retirement Planner' },
    { id: 'insurance',  label: 'Insurance Needs' },
    { id: 'tools',      label: 'All 50+ Tools' },
  ];

  var tabBar = document.createElement('div');
  tabBar.style.cssText = [
    'display:flex',
    'gap:4px',
    'margin-bottom:20px',
    'background:var(--surface2)',
    'border:1px solid var(--border)',
    'border-radius:10px',
    'padding:4px',
    'flex-wrap:wrap',
  ].join(';');

  var panels = {};
  var tabBtns = {};
  var activeTab = 'plan';

  function switchTab(id) {
    activeTab = id;
    TAB_DEFS.forEach(function(t) {
      var isActive = t.id === id;
      tabBtns[t.id].style.background = isActive ? 'var(--accent)' : 'transparent';
      tabBtns[t.id].style.color      = isActive ? '#fff' : 'var(--text3)';
      panels[t.id].style.display     = isActive ? 'block' : 'none';
    });
    /* Trigger chart re-renders when switching to a tab that has a canvas */
    if (id === 'plan')       { setTimeout(updateSim, 0); }
    if (id === 'retirement') { setTimeout(updateRetirement, 0); }
  }

  TAB_DEFS.forEach(function(t) {
    var btn = document.createElement('button');
    btn.textContent = t.label;
    btn.style.cssText = [
      'padding:7px 14px',
      'font-size:0.82rem',
      'font-weight:600',
      'border-radius:7px',
      'border:none',
      'cursor:pointer',
      'transition:background .15s,color .15s',
      'background:transparent',
      'color:var(--text3)',
      'white-space:nowrap',
    ].join(';');
    btn.addEventListener('click', function() { switchTab(t.id); });
    tabBtns[t.id] = btn;
    tabBar.appendChild(btn);
  });

  container.appendChild(tabBar);

  /* ======================================================
     PANEL 1 — PLAN SIMULATOR (existing content)
     ====================================================== */
  var panelPlan = document.createElement('div');
  panels['plan'] = panelPlan;

  /* --- State --- */
  var cfg = {
    duration:       10,
    monthlyPremium: 500,
    returnRate:     7,
    feeRate:        1.5,
    premiumHoliday: false,
    dividendMode:   false,
  };

  /* ---- TWO-COLUMN LAYOUT ---- */
  var layout = document.createElement('div');
  layout.style.cssText = 'display:grid;grid-template-columns:1fr 1.3fr;gap:24px;align-items:start;';
  var mq = window.matchMedia('(max-width:620px)');
  function applyMQ(e) { layout.style.gridTemplateColumns = e.matches ? '1fr' : '1fr 1.3fr'; }
  mq.addEventListener('change', applyMQ);
  applyMQ(mq);

  /* ======================================================
     LEFT COLUMN — PLAN CONFIGURATION
     ====================================================== */
  var leftCol = document.createElement('div');

  leftCol.appendChild(sectionHeader('Plan Configuration'));

  /* Duration segmented control */
  var durWrap = document.createElement('div');
  durWrap.className = 'demo-slider-wrap';
  var durLabel = document.createElement('div');
  durLabel.className = 'demo-slider-label';
  var durLabelTxt = document.createElement('span');
  durLabelTxt.textContent = 'Plan Duration';
  durLabel.appendChild(durLabelTxt);
  durWrap.appendChild(durLabel);
  var durControl = buildDurationControl([5, 8, 10, 15, 20], cfg.duration, function(d) {
    cfg.duration = d;
    updateSim();
  });
  durControl.style.marginTop = '6px';
  durWrap.appendChild(durControl);
  leftCol.appendChild(durWrap);

  /* Monthly Premium slider */
  var sPremium = calcSlider('invSimPremium', 'Monthly Premium', 100, 5000, 50, cfg.monthlyPremium, fmtDollar);
  wireCalcSlider(sPremium, 'invSimPremiumVal', fmtDollar, function() {
    cfg.monthlyPremium = parseFloat(document.getElementById('invSimPremium').value);
    updateSim();
  });
  leftCol.appendChild(sPremium);

  /* Return Rate slider */
  var sReturn = calcSlider('invSimReturn', 'Expected Return (IIRR)', 4, 12, 0.5, cfg.returnRate, fmtPct);
  wireCalcSlider(sReturn, 'invSimReturnVal', fmtPct, function() {
    cfg.returnRate = parseFloat(document.getElementById('invSimReturn').value);
    updateSim();
  });
  leftCol.appendChild(sReturn);

  /* Fee Rate slider */
  var sFee = calcSlider('invSimFee', 'Annual Fee', 0.5, 3, 0.25, cfg.feeRate, fmtPct);
  wireCalcSlider(sFee, 'invSimFeeVal', fmtPct, function() {
    cfg.feeRate = parseFloat(document.getElementById('invSimFee').value);
    updateSim();
  });
  leftCol.appendChild(sFee);

  /* Toggles */
  var togglesWrap = document.createElement('div');
  togglesWrap.style.cssText = 'margin-top:16px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:4px 14px;';
  var toggleHeader = document.createElement('div');
  toggleHeader.style.cssText = 'font-size:0.72rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--text3);padding:10px 0 4px;';
  toggleHeader.textContent = 'Plan Options';
  togglesWrap.appendChild(toggleHeader);

  var holidayToggle = buildToggle('invSimHoliday', 'Premium Holiday (skip Year 6)', false, function(on) {
    cfg.premiumHoliday = on;
    updateSim();
  });
  togglesWrap.appendChild(holidayToggle.el);

  var dividendToggle = buildToggle('invSimDividend', 'Dividend Withdrawal Mode (4%/yr from Yr 5)', false, function(on) {
    cfg.dividendMode = on;
    updateSim();
  });
  togglesWrap.appendChild(dividendToggle.el);
  leftCol.appendChild(togglesWrap);

  /* Result cards */
  var cards = document.createElement('div');
  cards.className = 'result-cards';
  cards.style.marginTop = '20px';
  cards.appendChild(calcCard('Total Premiums Paid', 'invSimTotalPaid', ''));
  cards.appendChild(calcCard('Projected Value',     'invSimProjected', 'green'));
  cards.appendChild(calcCard('Net Return',          'invSimNetReturn', 'accent'));
  cards.appendChild(calcCard('Annualized Return',   'invSimCAGR',      'blue'));
  leftCol.appendChild(cards);

  /* ======================================================
     RIGHT COLUMN — PROJECTED GROWTH + TABLE
     ====================================================== */
  var rightCol = document.createElement('div');

  rightCol.appendChild(sectionHeader('Projected Growth'));

  /* Chart container */
  var chartWrap = document.createElement('div');
  chartWrap.className = 'chart-container';
  chartWrap.style.marginBottom = '0';

  /* Chart legend */
  var legend = document.createElement('div');
  legend.style.cssText = 'display:flex;gap:16px;margin-bottom:8px;font-size:0.76rem;';
  [['#6b9bdb','Portfolio Value'],['#94a3b8','Total Premiums Paid','dashed']].forEach(function(item) {
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:5px;color:var(--text3);';
    var line = document.createElement('div');
    line.style.cssText = 'width:20px;height:2px;background:' + item[0] + ';' + (item[2] === 'dashed' ? 'background:repeating-linear-gradient(90deg,' + item[0] + ' 0,'+item[0]+' 4px,transparent 4px,transparent 8px);' : '');
    var lbl = document.createElement('span');
    lbl.textContent = item[1];
    row.appendChild(line);
    row.appendChild(lbl);
    legend.appendChild(row);
  });
  chartWrap.appendChild(legend);

  var canvas = document.createElement('canvas');
  canvas.id = 'invSimChart';
  chartWrap.appendChild(canvas);
  rightCol.appendChild(chartWrap);

  /* Breakdown table */
  var tableSection = document.createElement('div');
  tableSection.style.cssText = 'margin-top:20px;';

  var tableHeader = document.createElement('div');
  tableHeader.style.cssText = [
    'font-size:0.72rem',
    'font-weight:700',
    'letter-spacing:.08em',
    'text-transform:uppercase',
    'color:var(--text3)',
    'margin-bottom:8px',
    'padding-bottom:6px',
    'border-bottom:1px solid var(--border)',
  ].join(';');
  tableHeader.textContent = 'Year-by-Year Breakdown';
  tableSection.appendChild(tableHeader);

  var tableWrap = document.createElement('div');
  tableWrap.style.cssText = 'overflow-x:auto;border-radius:8px;border:1px solid var(--border);';

  var table = document.createElement('table');
  table.id = 'invSimTable';
  table.style.cssText = 'width:100%;border-collapse:collapse;font-size:0.78rem;';

  /* Table head */
  var thead = document.createElement('thead');
  var headRow = document.createElement('tr');
  headRow.style.cssText = 'background:var(--surface2);';
  ['Year','Premiums Paid','Growth','Fees','Portfolio Value'].forEach(function(h) {
    var th = document.createElement('th');
    th.style.cssText = 'padding:7px 10px;text-align:right;color:var(--text3);font-weight:600;white-space:nowrap;';
    if (h === 'Year') th.style.textAlign = 'center';
    th.textContent = h;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  var tbody = document.createElement('tbody');
  tbody.id = 'invSimTbody';
  table.appendChild(tbody);
  tableWrap.appendChild(table);
  tableSection.appendChild(tableWrap);
  rightCol.appendChild(tableSection);

  /* ---- Assemble layout ---- */
  layout.appendChild(leftCol);
  layout.appendChild(rightCol);
  panelPlan.appendChild(layout);
  container.appendChild(panelPlan);

  /* ======================================================
     UPDATE FUNCTION — PLAN SIMULATOR
     ====================================================== */
  function updateSim() {
    var totals = invSimTotals(cfg);

    /* Update result cards */
    function setEl(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }
    setEl('invSimTotalPaid', fmtDollar(totals.totalPaid));
    setEl('invSimProjected', fmtDollar(totals.projectedVal));
    setEl('invSimNetReturn', (totals.netReturn >= 0 ? '+' : '') + fmtDollar(totals.netReturn));
    setEl('invSimCAGR',      totals.cagr.toFixed(1) + '%');

    /* Update chart */
    var growthSeries  = [{ value: 0, label: 'Start' }];
    var premiumSeries = [{ value: 0, label: 'Start' }];
    var cumulPaid = 0;
    totals.rows.forEach(function(r) {
      cumulPaid += r.contribution;
      growthSeries.push({ value: r.balance, label: 'Yr ' + r.year });
      premiumSeries.push({ value: cumulPaid, label: 'Yr ' + r.year });
    });

    var chartEl = document.getElementById('invSimChart');
    if (chartEl) {
      Charts.multiLine(chartEl, [
        { data: growthSeries,  color: '#6b9bdb', label: 'Portfolio Value' },
        { data: premiumSeries, color: '#94a3b8', label: 'Premiums Paid' },
      ], { height: 200 });
    }

    /* Update breakdown table */
    var tbodyEl = document.getElementById('invSimTbody');
    if (tbodyEl) {
      while (tbodyEl.firstChild) tbodyEl.removeChild(tbodyEl.firstChild);
      var cumulContrib = 0;
      totals.rows.forEach(function(r, i) {
        cumulContrib += r.contribution;
        var tr = document.createElement('tr');
        tr.style.background = i % 2 === 0 ? 'var(--surface1,#111827)' : 'var(--surface2)';
        var cells = [
          { text: r.year,                    center: true,  color: 'var(--text3)' },
          { text: fmtDollar(cumulContrib),   center: false, color: 'var(--text2)' },
          { text: '+' + fmtDollar(r.growth), center: false, color: '#34d399' },
          { text: '-' + fmtDollar(r.fees),   center: false, color: '#ef4444' },
          { text: fmtDollar(r.balance),      center: false, color: '#6b9bdb', bold: true },
        ];
        cells.forEach(function(c) {
          var td = document.createElement('td');
          td.style.cssText = 'padding:6px 10px;' +
            'text-align:' + (c.center ? 'center' : 'right') + ';' +
            'color:' + c.color + ';' +
            (c.bold ? 'font-weight:600;' : '');
          td.textContent = c.text;
          tr.appendChild(td);
        });
        tbodyEl.appendChild(tr);
      });
    }
  }

  /* ======================================================
     PANEL 2 — RETIREMENT PLANNER
     ====================================================== */
  var panelRetirement = document.createElement('div');
  panelRetirement.style.display = 'none';
  panels['retirement'] = panelRetirement;

  var retCfg = { curAge: 30, retAge: 62, expenses: 4000, savings: 50000 };

  var retLayout = document.createElement('div');
  retLayout.style.cssText = 'display:grid;grid-template-columns:1fr 1.3fr;gap:24px;align-items:start;';
  var retMq = window.matchMedia('(max-width:620px)');
  retMq.addEventListener('change', function(e) {
    retLayout.style.gridTemplateColumns = e.matches ? '1fr' : '1fr 1.3fr';
  });
  retLayout.style.gridTemplateColumns = retMq.matches ? '1fr' : '1fr 1.3fr';

  /* Left col */
  var retLeft = document.createElement('div');
  retLeft.appendChild(sectionHeader('Retirement Parameters'));

  var sRetCurAge = calcSlider('retCurAge', 'Current Age', 25, 60, 1, retCfg.curAge, function(v) { return v + ' yrs'; });
  wireCalcSlider(sRetCurAge, 'retCurAgeVal', function(v) { return v + ' yrs'; }, function() {
    retCfg.curAge = parseInt(document.getElementById('retCurAge').value, 10);
    updateRetirement();
  });
  retLeft.appendChild(sRetCurAge);

  var sRetRetAge = calcSlider('retRetAge', 'Retirement Age', 55, 70, 1, retCfg.retAge, function(v) { return v + ' yrs'; });
  wireCalcSlider(sRetRetAge, 'retRetAgeVal', function(v) { return v + ' yrs'; }, function() {
    retCfg.retAge = parseInt(document.getElementById('retRetAge').value, 10);
    updateRetirement();
  });
  retLeft.appendChild(sRetRetAge);

  var sRetExp = calcSlider('retExpenses', 'Monthly Expenses', 2000, 15000, 200, retCfg.expenses, fmtDollar);
  wireCalcSlider(sRetExp, 'retExpensesVal', fmtDollar, function() {
    retCfg.expenses = parseFloat(document.getElementById('retExpenses').value);
    updateRetirement();
  });
  retLeft.appendChild(sRetExp);

  var sRetSav = calcSlider('retSavings', 'Current Savings', 0, 500000, 5000, retCfg.savings, fmtDollar);
  wireCalcSlider(sRetSav, 'retSavingsVal', fmtDollar, function() {
    retCfg.savings = parseFloat(document.getElementById('retSavings').value);
    updateRetirement();
  });
  retLeft.appendChild(sRetSav);

  var retCards = document.createElement('div');
  retCards.className = 'result-cards';
  retCards.style.marginTop = '20px';
  retCards.appendChild(calcCard('Total Needed', 'retTotalNeeded', ''));
  retCards.appendChild(calcCard('Future Savings', 'retFutureSavings', 'green'));
  retCards.appendChild(calcCard('Funding Gap', 'retGap', 'accent'));
  retCards.appendChild(calcCard('Monthly Savings Needed', 'retMonthly', 'blue'));
  retLeft.appendChild(retCards);

  /* Right col */
  var retRight = document.createElement('div');
  retRight.appendChild(sectionHeader('Savings Projection'));

  var retChartWrap = document.createElement('div');
  retChartWrap.className = 'chart-container';
  retChartWrap.style.marginBottom = '0';

  var retCanvas = document.createElement('canvas');
  retCanvas.id = 'retChart';
  retChartWrap.appendChild(retCanvas);
  retRight.appendChild(retChartWrap);

  retLayout.appendChild(retLeft);
  retLayout.appendChild(retRight);
  panelRetirement.appendChild(retLayout);
  container.appendChild(panelRetirement);

  function updateRetirement() {
    var cur = retCfg.curAge;
    var ret = retCfg.retAge;
    var exp = retCfg.expenses;
    var sav = retCfg.savings;
    var years = Math.max(ret - cur, 1);

    var totalNeeded    = exp * 12 * (90 - ret);
    var futureSavings  = sav * Math.pow(1.06, years);
    var gap            = Math.max(totalNeeded - futureSavings, 0);
    /* Monthly needed: annuity formula — FV = PMT * ((1+r)^n - 1) / r */
    var r = 0.06 / 12;
    var n = years * 12;
    var monthlyNeeded  = gap > 0 ? gap * r / (Math.pow(1 + r, n) - 1) : 0;

    function setEl(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }
    setEl('retTotalNeeded',   fmtDollar(totalNeeded));
    setEl('retFutureSavings', fmtDollar(futureSavings));
    setEl('retGap',           gap > 0 ? fmtDollar(gap) : 'Funded');
    setEl('retMonthly',       gap > 0 ? fmtDollar(monthlyNeeded) + '/mo' : 'On Track');

    /* Build projection series */
    var series = [];
    var bal = sav;
    series.push({ value: bal, label: 'Now' });
    for (var i = 1; i <= years; i++) {
      bal = bal * 1.06 + monthlyNeeded * 12;
      series.push({ value: bal, label: 'Yr ' + i });
    }

    var retChartEl = document.getElementById('retChart');
    if (retChartEl) {
      Charts.area(retChartEl, series, { color: '#34d399', height: 200, currency: true });
    }
  }

  /* ======================================================
     PANEL 3 — INSURANCE NEEDS
     ====================================================== */
  var panelInsurance = document.createElement('div');
  panelInsurance.style.display = 'none';
  panels['insurance'] = panelInsurance;

  var insCfg = { income: 80000, dependents: 2, existing: 200000 };

  var insLayout = document.createElement('div');
  insLayout.style.cssText = 'display:grid;grid-template-columns:1fr 1.3fr;gap:24px;align-items:start;';
  var insMq = window.matchMedia('(max-width:620px)');
  insMq.addEventListener('change', function(e) {
    insLayout.style.gridTemplateColumns = e.matches ? '1fr' : '1fr 1.3fr';
  });
  insLayout.style.gridTemplateColumns = insMq.matches ? '1fr' : '1fr 1.3fr';

  var insLeft = document.createElement('div');
  insLeft.appendChild(sectionHeader('Your Profile'));

  var sInsIncome = calcSlider('insIncome', 'Annual Income', 30000, 300000, 5000, insCfg.income, fmtDollar);
  wireCalcSlider(sInsIncome, 'insIncomeVal', fmtDollar, function() {
    insCfg.income = parseFloat(document.getElementById('insIncome').value);
    updateInsurance();
  });
  insLeft.appendChild(sInsIncome);

  var sInsDeps = calcSlider('insDeps', 'Dependents', 0, 5, 1, insCfg.dependents, function(v) {
    return v == 1 ? '1 person' : v + ' people';
  });
  wireCalcSlider(sInsDeps, 'insDepsVal', function(v) {
    return v == 1 ? '1 person' : v + ' people';
  }, function() {
    insCfg.dependents = parseInt(document.getElementById('insDeps').value, 10);
    updateInsurance();
  });
  insLeft.appendChild(sInsDeps);

  var sInsExist = calcSlider('insExisting', 'Existing Coverage', 0, 1000000, 10000, insCfg.existing, fmtDollar);
  wireCalcSlider(sInsExist, 'insExistingVal', fmtDollar, function() {
    insCfg.existing = parseFloat(document.getElementById('insExisting').value);
    updateInsurance();
  });
  insLeft.appendChild(sInsExist);

  var insSummaryCards = document.createElement('div');
  insSummaryCards.className = 'result-cards';
  insSummaryCards.style.marginTop = '20px';
  insSummaryCards.appendChild(calcCard('Total Needed', 'insTotalNeeded', ''));
  insSummaryCards.appendChild(calcCard('Current Coverage', 'insCurrentCov', 'green'));
  insSummaryCards.appendChild(calcCard('Coverage Gap', 'insGap', 'accent'));
  insLeft.appendChild(insSummaryCards);

  /* Right col — coverage bars */
  var insRight = document.createElement('div');
  insRight.appendChild(sectionHeader('Coverage Analysis'));

  var insBarsWrap = document.createElement('div');
  insBarsWrap.id = 'insBars';
  insBarsWrap.style.cssText = 'display:flex;flex-direction:column;gap:16px;';
  insRight.appendChild(insBarsWrap);

  insLayout.appendChild(insLeft);
  insLayout.appendChild(insRight);
  panelInsurance.appendChild(insLayout);
  container.appendChild(panelInsurance);

  function updateInsurance() {
    var inc  = insCfg.income;
    var deps = insCfg.dependents;
    var exist = insCfg.existing;

    var coverages = [
      { label: 'Death / TPD',           recommended: inc * (10 + deps * 2), color: '#6b9bdb' },
      { label: 'Total Permanent Disability', recommended: inc * 8,          color: '#a78bfa' },
      { label: 'Critical Illness',       recommended: inc * 4,               color: '#f59e0b' },
      { label: 'Hospitalisation',        recommended: 200000,                color: '#34d399' },
    ];

    /* Distribute existing coverage proportionally to death bucket */
    coverages[0].actual = Math.min(exist, coverages[0].recommended);
    coverages[1].actual = Math.min(Math.max(exist - coverages[0].recommended, 0) * 0.5, coverages[1].recommended);
    coverages[2].actual = Math.min(Math.max(exist - coverages[0].recommended, 0) * 0.3, coverages[2].recommended);
    coverages[3].actual = Math.min(Math.max(exist - coverages[0].recommended, 0) * 0.2, coverages[3].recommended);

    var totalNeeded = coverages.reduce(function(s, c) { return s + c.recommended; }, 0);
    var totalActual = coverages.reduce(function(s, c) { return s + c.actual; }, 0);
    var totalGap    = Math.max(totalNeeded - totalActual, 0);

    function setEl(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }
    setEl('insTotalNeeded',  fmtDollar(totalNeeded));
    setEl('insCurrentCov',   fmtDollar(totalActual));
    setEl('insGap',          totalGap > 0 ? fmtDollar(totalGap) : 'Fully Covered');

    var barsEl = document.getElementById('insBars');
    if (!barsEl) return;
    while (barsEl.firstChild) barsEl.removeChild(barsEl.firstChild);

    coverages.forEach(function(cov) {
      var pct     = Math.min(cov.actual / cov.recommended, 1);
      var status  = pct >= 1 ? 'Adequate' : pct >= 0.5 ? 'Partial' : 'Gap';
      var statusColor = pct >= 1 ? '#34d399' : pct >= 0.5 ? '#f59e0b' : '#ef4444';

      var row = document.createElement('div');

      var rowTop = document.createElement('div');
      rowTop.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;';

      var lbl = document.createElement('span');
      lbl.style.cssText = 'font-size:0.82rem;color:var(--text2);font-weight:500;';
      lbl.textContent = cov.label;

      var badge = document.createElement('span');
      badge.style.cssText = [
        'font-size:0.72rem',
        'font-weight:700',
        'padding:2px 8px',
        'border-radius:20px',
        'background:' + statusColor + '22',
        'color:' + statusColor,
        'border:1px solid ' + statusColor + '55',
      ].join(';');
      badge.textContent = status;

      rowTop.appendChild(lbl);
      rowTop.appendChild(badge);
      row.appendChild(rowTop);

      /* Bar track */
      var track = document.createElement('div');
      track.style.cssText = 'height:8px;background:var(--surface3,#374151);border-radius:4px;overflow:hidden;';
      var fill = document.createElement('div');
      fill.style.cssText = 'height:100%;border-radius:4px;background:' + cov.color + ';transition:width .4s;width:' + (pct * 100).toFixed(1) + '%;';
      track.appendChild(fill);
      row.appendChild(track);

      /* Sub-label */
      var sub = document.createElement('div');
      sub.style.cssText = 'display:flex;justify-content:space-between;margin-top:4px;font-size:0.72rem;color:var(--text3);';
      var subLeft = document.createElement('span');
      subLeft.textContent = 'Actual: ' + fmtDollar(cov.actual);
      var subRight = document.createElement('span');
      subRight.textContent = 'Recommended: ' + fmtDollar(cov.recommended);
      sub.appendChild(subLeft);
      sub.appendChild(subRight);
      row.appendChild(sub);

      barsEl.appendChild(row);
    });
  }

  /* ======================================================
     PANEL 4 — ALL 50+ TOOLS
     ====================================================== */
  var panelTools = document.createElement('div');
  panelTools.style.display = 'none';
  panels['tools'] = panelTools;

  /* Header */
  var toolsHeader = document.createElement('div');
  toolsHeader.style.cssText = 'margin-bottom:20px;';
  var toolsTitle = document.createElement('div');
  toolsTitle.style.cssText = [
    'font-size:0.72rem',
    'font-weight:700',
    'letter-spacing:.10em',
    'text-transform:uppercase',
    'color:var(--text3)',
    'margin-bottom:4px',
  ].join(';');
  toolsTitle.textContent = '50+ FINANCIAL CALCULATORS \u00B7 ALL CATEGORIES';
  var toolsSub = document.createElement('div');
  toolsSub.style.cssText = 'font-size:0.82rem;color:var(--text3);';
  toolsSub.textContent = 'Full-featured calculators with data models, interactive charts, and PDF export.';
  toolsHeader.appendChild(toolsTitle);
  toolsHeader.appendChild(toolsSub);
  panelTools.appendChild(toolsHeader);

  var TOOL_CATEGORIES = [
    {
      label: 'INVESTMENT PLANNING',
      color: '#6b9bdb',
      tools: [
        'Long-Term Investment Illustrator',
        '5-Year Investing Plan',
        '8-Year Investing Plan',
        'Hybrid Investment Plan',
        'Smart Wealth Builder',
        'Lump Sum Plan',
        'Universal Illustrator',
        'Flexi-Term Plan',
      ],
    },
    {
      label: 'RETIREMENT',
      color: '#34d399',
      tools: [
        'CPF Life Estimator',
        'Retirement Funding',
        'Income Tax Calculator',
        'Retirement Saver',
        'Retirement Lifestyle',
      ],
    },
    {
      label: 'INSURANCE',
      color: '#f59e0b',
      tools: [
        'Insurance Needs Assessment',
        'Total Wealth Concept',
        'Healthshield Gold Max',
        'Critical Illness Stats',
        'Accident Plan',
        'Hospital Income',
      ],
    },
    {
      label: 'PORTFOLIO',
      color: '#a78bfa',
      tools: [
        'Interactive Portfolio Builder',
        'All-Weather Portfolio',
        'Fear & Greed Index',
        'Morningstar Funds',
      ],
    },
    {
      label: 'PROPERTY',
      color: '#fb7185',
      tools: [
        'HDB Mortgage Calculator',
        'Premium Rates',
        'Yield Calculator',
      ],
    },
    {
      label: 'BUSINESS',
      color: '#38bdf8',
      tools: [
        'Financial Advisor Differentiation',
        'Personal Branding Hub',
      ],
    },
  ];

  TOOL_CATEGORIES.forEach(function(cat) {
    var section = document.createElement('div');
    section.style.cssText = 'margin-bottom:24px;';

    var catLabel = document.createElement('div');
    catLabel.style.cssText = [
      'font-size:0.70rem',
      'font-weight:700',
      'letter-spacing:.10em',
      'text-transform:uppercase',
      'color:' + cat.color,
      'margin-bottom:10px',
      'padding-bottom:6px',
      'border-bottom:1px solid var(--border)',
    ].join(';');
    catLabel.textContent = cat.label;
    section.appendChild(catLabel);

    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;';

    cat.tools.forEach(function(toolName) {
      var card = document.createElement('div');
      card.style.cssText = [
        'display:flex',
        'align-items:center',
        'gap:8px',
        'padding:9px 12px',
        'background:var(--surface2)',
        'border:1px solid var(--border)',
        'border-radius:8px',
        'cursor:default',
        'transition:border-color .15s',
      ].join(';');
      card.addEventListener('mouseenter', function() { card.style.borderColor = cat.color + '88'; });
      card.addEventListener('mouseleave', function() { card.style.borderColor = 'var(--border)'; });

      var dot = document.createElement('div');
      dot.style.cssText = 'width:7px;height:7px;border-radius:50%;background:' + cat.color + ';flex-shrink:0;';

      var name = document.createElement('span');
      name.style.cssText = 'font-size:0.78rem;color:var(--text2);line-height:1.3;';
      name.textContent = toolName;

      card.appendChild(dot);
      card.appendChild(name);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    panelTools.appendChild(section);
  });

  container.appendChild(panelTools);

  /* ======================================================
     ACTIVATE DEFAULT TAB + INITIAL RENDERS
     ====================================================== */
  switchTab('plan');
  setTimeout(updateSim, 0);
  /* Pre-compute retirement & insurance so first switch is instant */
  setTimeout(updateRetirement, 50);
  setTimeout(updateInsurance, 50);
};

/* ============================================================
   SVG CHECKMARK BULLET
   ============================================================ */
function checkmarkSVG() {
  return '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="7" r="7" fill="rgba(52,211,153,0.15)"/><path d="M4 7l2 2 4-4" stroke="#34d399" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

/* ============================================================
   RENDER HERO
   ============================================================ */
function renderHero() {
  const heroEl = document.getElementById('hero');
  if (!heroEl) return;

  const badge = document.createElement('div');
  badge.className = 'hero-badge';
  const dot = document.createElement('span');
  dot.className = 'hero-badge-dot';
  badge.appendChild(dot);
  badge.appendChild(document.createTextNode(' 5 Integrated Platforms — Live Demo'));

  const h1 = document.createElement('h1');
  h1.textContent = 'The Complete Financial Advisory Tech Stack';

  const sub = document.createElement('p');
  sub.className = 'hero-sub';
  sub.textContent = "See how our suite of tools helps financial advisors close more clients, train faster, and run better campaigns — all in one ecosystem.";

  const statsData = [
    { color: '#34d399', value: '70+', label: 'Financial Calculators' },
    { color: '#6b9bdb', value: '5',   label: 'Integrated Platforms' },
    { color: '#C4A24D', value: 'AI-Powered', label: 'Training & Campaigns' },
    { color: '#a78bfa', value: 'Built For', label: 'Financial Advisors' },
  ];

  const statsBar = document.createElement('div');
  statsBar.className = 'hero-stats';
  statsData.forEach(s => {
    const stat = document.createElement('div');
    stat.className = 'hero-stat';

    const dotEl = document.createElement('span');
    dotEl.className = 'hero-stat-dot';
    dotEl.style.background = s.color;

    const valueEl = document.createElement('span');
    valueEl.className = 'hero-stat-value';
    valueEl.textContent = s.value;

    const labelEl = document.createElement('span');
    labelEl.textContent = s.label;

    stat.appendChild(dotEl);
    stat.appendChild(valueEl);
    stat.appendChild(labelEl);
    statsBar.appendChild(stat);
  });

  heroEl.appendChild(badge);
  heroEl.appendChild(h1);
  heroEl.appendChild(sub);
  heroEl.appendChild(statsBar);
}

/* ============================================================
   RENDER PLATFORM GRID
   ============================================================ */
function renderPlatformGrid() {
  const platformsEl = document.getElementById('platforms');
  if (!platformsEl) return;

  const heading = document.createElement('div');
  heading.className = 'platforms-heading';
  const h2 = document.createElement('h2');
  h2.textContent = 'Everything Your Team Needs';
  const subp = document.createElement('p');
  subp.textContent = 'Five powerful platforms, one unified tech suite.';
  heading.appendChild(h2);
  heading.appendChild(subp);

  const grid = document.createElement('div');
  grid.className = 'platform-grid';
  grid.id = 'platformGrid';

  PLATFORMS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'platform-card';
    card.dataset.id = p.id;

    // Icon box
    const iconBox = document.createElement('div');
    iconBox.className = 'platform-icon-box ' + p.iconClass;
    iconBox.textContent = p.icon;

    // Title
    const title = document.createElement('h3');
    title.textContent = p.title;

    // Description
    const desc = document.createElement('p');
    desc.textContent = p.desc;

    // Features
    const ul = document.createElement('ul');
    ul.className = 'platform-features';
    p.features.forEach(f => {
      const li = document.createElement('li');
      // Safe SVG insertion via DOMParser
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(checkmarkSVG(), 'image/svg+xml');
      const svgEl  = svgDoc.documentElement;
      li.appendChild(svgEl);
      li.appendChild(document.createTextNode(f));
      ul.appendChild(li);
    });

    // Button
    const btn = document.createElement('button');
    btn.className = 'platform-demo-btn';
    btn.textContent = 'Try Interactive Demo ';
    const arrow = document.createElement('span');
    arrow.className = 'btn-arrow';
    arrow.textContent = '→';
    btn.appendChild(arrow);
    btn.addEventListener('click', () => {
      history.pushState(null, '', '/' + p.id);
      route();
    });

    card.appendChild(iconBox);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(ul);
    card.appendChild(btn);
    grid.appendChild(card);
  });

  platformsEl.appendChild(heading);
  platformsEl.appendChild(grid);
}

/* ============================================================
   DEMO PAGE RENDERER
   ============================================================ */
function renderDemoPage(demoId, platform) {
  const container = document.getElementById('demoPageContainer');
  if (!container) return;

  // Clear previous content
  while (container.firstChild) container.removeChild(container.firstChild);

  const main = document.createElement('main');
  main.className = 'demo-page';

  // Header
  const header = document.createElement('div');
  header.className = 'demo-page-header';

  const backLink = document.createElement('a');
  backLink.className = 'back-link';
  backLink.href = '/';
  backLink.textContent = '← Back to Platform Suite';
  backLink.addEventListener('click', function(e) {
    e.preventDefault();
    history.pushState(null, '', '/');
    route();
  });

  const h1 = document.createElement('h1');
  h1.textContent = platform.icon + '  ' + platform.title;

  const desc = document.createElement('p');
  desc.textContent = platform.desc;

  header.appendChild(backLink);
  header.appendChild(h1);
  header.appendChild(desc);
  main.appendChild(header);

  // Content container — DEMO_RENDERERS write into this
  const content = document.createElement('div');
  content.className = 'demo-page-content';
  content.id = 'modalBody'; // keep ID so existing renderers work unchanged
  main.appendChild(content);

  container.appendChild(main);

  if (DEMO_RENDERERS[demoId]) {
    DEMO_RENDERERS[demoId](content);
  } else {
    const placeholder = document.createElement('div');
    placeholder.style.cssText = 'text-align:center;padding:60px 20px;color:var(--text3);';

    const iconEl = document.createElement('div');
    iconEl.style.cssText = 'font-size:3rem;margin-bottom:16px;';
    iconEl.textContent = platform.icon;

    const nameEl = document.createElement('div');
    nameEl.style.cssText = 'font-size:1.1rem;color:var(--text2);font-weight:600;margin-bottom:8px;';
    nameEl.textContent = platform.title;

    const msgEl = document.createElement('div');
    msgEl.style.cssText = 'font-size:0.9rem;';
    msgEl.textContent = 'Interactive demo coming soon.';

    placeholder.appendChild(iconEl);
    placeholder.appendChild(nameEl);
    placeholder.appendChild(msgEl);
    content.appendChild(placeholder);
  }
}

/* ============================================================
   SCROLL REVEAL — IntersectionObserver with staggered reveals
   ============================================================ */
function initScrollReveal() {
  const cards = Array.from(document.querySelectorAll('.platform-card'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const card  = entry.target;
            const index = cards.indexOf(card);
            setTimeout(function() {
              card.classList.add('revealed');
            }, index * 100);
            observer.unobserve(card);
          }
        });
      },
      { threshold: 0.12 }
    );
    cards.forEach(function(card) { observer.observe(card); });
  } else {
    cards.forEach(function(card) { card.classList.add('revealed'); });
  }
}

/* ============================================================
   ACTIVITY TRACKER DEMO — Full Product Demo with Pricing Builder
   ============================================================ */
DEMO_RENDERERS.tracker = function(container) {
  container.id = 'trackerDemo';
  while (container.firstChild) { container.removeChild(container.firstChild); }

  /* ---- Shared helpers ---- */
  function sgd(n) {
    return '$' + n.toLocaleString();
  }

  function showToast(msg) {
    var t = document.createElement('div');
    t.style.cssText = [
      'position:fixed', 'bottom:28px', 'left:50%', 'transform:translateX(-50%)',
      'background:#1a2235', 'border:1px solid var(--border)',
      'color:var(--text)', 'font-size:0.82rem', 'font-weight:600',
      'padding:10px 20px', 'border-radius:8px',
      'box-shadow:0 4px 24px rgba(0,0,0,.5)',
      'z-index:9999', 'white-space:nowrap',
      'opacity:0', 'transition:opacity .2s',
    ].join(';');
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function() { t.style.opacity = '1'; });
    setTimeout(function() {
      t.style.opacity = '0';
      setTimeout(function() { t.remove(); }, 300);
    }, 2600);
  }

  function clearChildren(el) {
    while (el.firstChild) { el.removeChild(el.firstChild); }
  }

  /* ================================================================
     SECTION 1: PLATFORM OVERVIEW
     ================================================================ */
  var s1 = document.createElement('div');
  s1.style.cssText = 'text-align:center;padding:28px 20px 24px;background:linear-gradient(135deg,rgba(59,130,246,.08),rgba(52,211,153,.06));border-radius:12px;margin-bottom:24px;border:1px solid var(--border);';

  var s1h = document.createElement('h2');
  s1h.style.cssText = 'font-size:1.28rem;font-weight:800;color:var(--text);margin:0 0 8px;line-height:1.3;';
  s1h.textContent = 'The Complete Activity Tracking Platform';
  s1.appendChild(s1h);

  var s1sub = document.createElement('p');
  s1sub.style.cssText = 'font-size:0.84rem;color:var(--text2);margin:0 0 18px;max-width:480px;margin-left:auto;margin-right:auto;line-height:1.6;';
  s1sub.textContent = '11 integrated modules for financial advisory teams. Everything from daily tracking to AI-powered coaching.';
  s1.appendChild(s1sub);

  var statsRow = document.createElement('div');
  statsRow.style.cssText = 'display:flex;flex-wrap:wrap;justify-content:center;gap:6px;';
  var statItems = ['11 Modules', '4 Core', '7 Add-ons', 'Built for Teams of 5\u2013100'];
  statItems.forEach(function(st) {
    var pill = document.createElement('span');
    pill.style.cssText = 'padding:4px 14px;background:rgba(107,155,219,.12);border:1px solid rgba(107,155,219,.25);border-radius:99px;font-size:0.74rem;font-weight:600;color:var(--primary-light,#6b9bdb);white-space:nowrap;';
    pill.textContent = st;
    statsRow.appendChild(pill);
  });
  s1.appendChild(statsRow);
  container.appendChild(s1);

  /* ================================================================
     SECTION 2: MODULE CARDS GRID
     ================================================================ */
  var s2head = document.createElement('div');
  s2head.style.cssText = 'display:flex;align-items:baseline;gap:10px;margin-bottom:14px;';
  var s2title = document.createElement('h3');
  s2title.style.cssText = 'font-size:1rem;font-weight:700;color:var(--text);margin:0;';
  s2title.textContent = 'All 11 Modules';
  var s2sub = document.createElement('span');
  s2sub.style.cssText = 'font-size:0.74rem;color:var(--text3);';
  s2sub.textContent = 'Click any card to explore';
  s2head.appendChild(s2title);
  s2head.appendChild(s2sub);
  container.appendChild(s2head);

  var moduleData = [
    { emoji: '\u{1F4CA}', name: 'Activity Tracking & Feed',    type: 'core',   desc: 'Real-time activity logging, team feed, reactions, GPS verification, daily progress tracking' },
    { emoji: '\u{1F3C6}', name: 'Leaderboard & Analytics',     type: 'core',   desc: 'Hall of Fame podium, full activity leaderboard, sales funnel, team trends & inactivity alerts' },
    { emoji: '\u2705',    name: 'Habit Tracker',               type: 'core',   desc: 'Daily habits, streak tracking, contribution heatmaps, work & personal separation' },
    { emoji: '\u{1F4CB}', name: 'Digital Pledge Sheet',        type: 'core',   desc: 'Reverse-engineer activity targets from FYC goals. Presets, save/load sheets, PDF export' },
    { emoji: '\u{1F4B0}', name: 'Commission Calculator',       type: 'addon',  desc: '30+ AIA product commission rates with SPI, AI bonuses, and career totals' },
    { emoji: '\u{1F4C8}', name: 'Income Projection',           type: 'addon',  desc: 'Multi-year income layering with 9 streams: FYC, SPI, renewals, career benefits' },
    { emoji: '\u{1F4CA}', name: 'Sales Dashboard',             type: 'addon',  isNew: true, desc: 'Centralized FYC leaderboard with Life, HSG, A&H breakdowns, filters, PDF export' },
    { emoji: '\u{1F3B0}', name: 'Gamification & Rewards',      type: 'addon',  isNew: true, desc: 'Wheel of Fortune, activity credits, real-life reward redemptions' },
    { emoji: '\u{1F4C5}', name: 'Coaching & Booking',          type: 'addon',  desc: 'Public booking pages, calendar view, Google Calendar sync, email confirmations' },
    { emoji: '\u{1F4AD}', name: 'Team Reflections',            type: 'addon',  desc: 'Weekly reflections, submission tracking, AI coaching feedback, automated reminders' },
    { emoji: '\u2705',    name: 'Accountability Board',        type: 'addon',  isNew: true, desc: 'Scheduled to-do lists, shared tasks, XP streaks, team visibility' },
  ];

  var grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin-bottom:28px;';

  moduleData.forEach(function(mod) {
    var card = document.createElement('div');
    card.style.cssText = [
      'background:var(--bg2)',
      'border:1px solid var(--border)',
      'border-radius:10px',
      'padding:16px',
      'display:flex',
      'flex-direction:column',
      'gap:10px',
      'cursor:pointer',
      'transition:border-color .15s,box-shadow .15s',
    ].join(';');

    card.addEventListener('mouseenter', function() {
      card.style.borderColor = 'var(--accent,#3b82f6)';
      card.style.boxShadow = '0 2px 12px rgba(59,130,246,.15)';
    });
    card.addEventListener('mouseleave', function() {
      card.style.borderColor = 'var(--border)';
      card.style.boxShadow = 'none';
    });

    /* Top row: icon + badges */
    var topRow = document.createElement('div');
    topRow.style.cssText = 'display:flex;align-items:flex-start;justify-content:space-between;';

    var iconCircle = document.createElement('div');
    var iconBg = mod.type === 'core'
      ? 'background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.25);'
      : 'background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.2);';
    iconCircle.style.cssText = 'width:48px;height:48px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.3rem;' + iconBg;
    iconCircle.textContent = mod.emoji;
    topRow.appendChild(iconCircle);

    var badges = document.createElement('div');
    badges.style.cssText = 'display:flex;flex-direction:column;align-items:flex-end;gap:4px;';

    var typeBadge = document.createElement('span');
    typeBadge.style.cssText = mod.type === 'core'
      ? 'padding:2px 8px;border-radius:4px;font-size:0.62rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;background:rgba(52,211,153,.15);color:var(--green-bright,#34d399);border:1px solid rgba(52,211,153,.3);'
      : 'padding:2px 8px;border-radius:4px;font-size:0.62rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;background:rgba(59,130,246,.15);color:#60a5fa;border:1px solid rgba(59,130,246,.3);';
    typeBadge.textContent = mod.type === 'core' ? 'Core' : 'Add-on';
    badges.appendChild(typeBadge);

    if (mod.isNew) {
      var newBadge = document.createElement('span');
      newBadge.style.cssText = 'padding:2px 8px;border-radius:4px;font-size:0.62rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;background:rgba(251,146,60,.15);color:#fb923c;border:1px solid rgba(251,146,60,.3);';
      newBadge.textContent = 'New';
      badges.appendChild(newBadge);
    }

    topRow.appendChild(badges);
    card.appendChild(topRow);

    /* Module name */
    var mname = document.createElement('h3');
    mname.style.cssText = 'font-size:0.9rem;font-weight:700;color:var(--text);margin:0;line-height:1.3;';
    mname.textContent = mod.name;
    card.appendChild(mname);

    /* Description */
    var mdesc = document.createElement('p');
    mdesc.style.cssText = 'font-size:0.78rem;color:var(--text2);margin:0;line-height:1.6;flex:1;';
    mdesc.textContent = mod.desc;
    card.appendChild(mdesc);

    /* CTA link */
    var cta = document.createElement('a');
    cta.style.cssText = 'font-size:0.76rem;font-weight:600;color:var(--primary-light,#6b9bdb);cursor:pointer;text-decoration:none;margin-top:4px;';
    cta.textContent = 'Try Interactive Demo \u2192';
    cta.addEventListener('click', function(e) {
      e.preventDefault();
      showToast('Full demo available in the live platform');
    });
    card.appendChild(cta);

    grid.appendChild(card);
  });

  container.appendChild(grid);

  /* ================================================================
     SECTION 3: PRICING BUILDER (Interactive)
     ================================================================ */
  var pricingComponents = [
    { emoji: '\u{1F4CA}', name: 'Activity Tracking',    setup: 2000, perUser: 19, preselected: true  },
    { emoji: '\u{1F3C6}', name: 'Leaderboard',          setup: 1500, perUser: 15, preselected: true  },
    { emoji: '\u2705',    name: 'Habit Tracker',        setup: 1500, perUser:  5, preselected: true  },
    { emoji: '\u{1F4CB}', name: 'Pledge Sheet',         setup: 1000, perUser:  5, preselected: true  },
    { emoji: '\u{1F4B0}', name: 'Commission Calc',      setup: 1500, perUser:  5, preselected: false },
    { emoji: '\u{1F4C8}', name: 'Income Projection',    setup: 1500, perUser:  5, preselected: false },
    { emoji: '\u{1F4CA}', name: 'Sales Dashboard',      setup: 2000, perUser:  5, preselected: false },
    { emoji: '\u{1F3B0}', name: 'Gamification',         setup: 1500, perUser:  5, preselected: false },
    { emoji: '\u{1F4C5}', name: 'Coaching & Booking',   setup: 2000, perUser:  5, preselected: false },
    { emoji: '\u{1F4AD}', name: 'Team Reflections',     setup: 1500, perUser:  5, preselected: false },
    { emoji: '\u2705',    name: 'Accountability Board', setup: 2500, perUser:  5, preselected: false },
  ];

  /* State */
  var teamSize = 15;
  var selected = pricingComponents.map(function(c) { return c.preselected; });

  var pricingSection = document.createElement('div');
  pricingSection.style.cssText = 'margin-bottom:28px;';

  var ph2 = document.createElement('h3');
  ph2.style.cssText = 'font-size:1rem;font-weight:700;color:var(--text);margin:0 0 6px;';
  ph2.textContent = 'Interactive Pricing Builder';
  pricingSection.appendChild(ph2);

  var psub = document.createElement('p');
  psub.style.cssText = 'font-size:0.78rem;color:var(--text2);margin:0 0 18px;';
  psub.textContent = 'Select modules and team size to calculate your investment.';
  pricingSection.appendChild(psub);

  /* Team size slider */
  var sliderWrap = document.createElement('div');
  sliderWrap.style.cssText = 'background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:16px 18px;margin-bottom:16px;';

  var sliderLabel = document.createElement('div');
  sliderLabel.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;';

  var sliderTitle = document.createElement('span');
  sliderTitle.style.cssText = 'font-size:0.84rem;font-weight:600;color:var(--text);';
  sliderTitle.textContent = 'Team Size';

  var sliderVal = document.createElement('span');
  sliderVal.style.cssText = 'font-size:0.9rem;font-weight:700;color:var(--accent,#3b82f6);';
  sliderVal.textContent = '15 consultants';

  sliderLabel.appendChild(sliderTitle);
  sliderLabel.appendChild(sliderVal);
  sliderWrap.appendChild(sliderLabel);

  var slider = document.createElement('input');
  slider.type = 'range';
  slider.className = 'demo-slider';
  slider.min = 5;
  slider.max = 100;
  slider.step = 1;
  slider.value = 15;
  slider.style.cssText = 'width:100%;';
  sliderWrap.appendChild(slider);

  var sliderHints = document.createElement('div');
  sliderHints.style.cssText = 'display:flex;justify-content:space-between;margin-top:4px;';
  var hMin = document.createElement('span');
  hMin.style.cssText = 'font-size:0.68rem;color:var(--text3);';
  hMin.textContent = '5';
  var hMax = document.createElement('span');
  hMax.style.cssText = 'font-size:0.68rem;color:var(--text3);';
  hMax.textContent = '100';
  sliderHints.appendChild(hMin);
  sliderHints.appendChild(hMax);
  sliderWrap.appendChild(sliderHints);
  pricingSection.appendChild(sliderWrap);

  /* Layout: component grid + summary panel */
  var pricingLayout = document.createElement('div');
  pricingLayout.style.cssText = 'display:grid;grid-template-columns:1fr 300px;gap:16px;align-items:start;';

  /* Component toggles grid */
  var compGrid = document.createElement('div');
  compGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;';

  pricingComponents.forEach(function(comp, idx) {
    var cc = document.createElement('div');
    var selBorder = selected[idx] ? 'border-color:var(--green-bright,#34d399);box-shadow:0 0 0 1px rgba(52,211,153,.2);' : 'border-color:var(--border);';
    cc.style.cssText = 'background:var(--bg2);border:1.5px solid;border-radius:8px;padding:12px 14px;cursor:pointer;position:relative;transition:border-color .15s,box-shadow .15s;' + selBorder;

    /* Checkmark */
    var check = document.createElement('div');
    var checkStyle = selected[idx]
      ? 'background:var(--green-bright,#34d399);color:#000;'
      : 'background:var(--border);color:transparent;';
    check.style.cssText = 'position:absolute;top:8px;right:8px;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;' + checkStyle;
    check.textContent = '\u2713';
    cc.appendChild(check);

    var topArea = document.createElement('div');
    topArea.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:8px;padding-right:20px;';

    var eIcon = document.createElement('span');
    eIcon.style.cssText = 'font-size:1.1rem;';
    eIcon.textContent = comp.emoji;
    topArea.appendChild(eIcon);

    var cname = document.createElement('span');
    cname.style.cssText = 'font-size:0.78rem;font-weight:700;color:var(--text);line-height:1.3;';
    cname.textContent = comp.name;
    topArea.appendChild(cname);

    cc.appendChild(topArea);

    var priceRow = document.createElement('div');
    priceRow.style.cssText = 'display:flex;flex-direction:column;gap:1px;';

    var setupLine = document.createElement('div');
    setupLine.style.cssText = 'font-size:0.68rem;color:var(--text3);';
    setupLine.textContent = sgd(comp.setup) + ' setup';

    var monthLine = document.createElement('div');
    monthLine.style.cssText = 'font-size:0.72rem;color:var(--text2);font-weight:600;';
    monthLine.textContent = sgd(comp.perUser) + '/user/mo';

    priceRow.appendChild(setupLine);
    priceRow.appendChild(monthLine);
    cc.appendChild(priceRow);

    cc.addEventListener('click', function() {
      selected[idx] = !selected[idx];
      if (selected[idx]) {
        cc.style.borderColor = 'var(--green-bright,#34d399)';
        cc.style.boxShadow = '0 0 0 1px rgba(52,211,153,.2)';
        check.style.background = 'var(--green-bright,#34d399)';
        check.style.color = '#000';
      } else {
        cc.style.borderColor = 'var(--border)';
        cc.style.boxShadow = 'none';
        check.style.background = 'var(--border)';
        check.style.color = 'transparent';
      }
      updateSummary();
    });

    compGrid.appendChild(cc);
  });

  pricingLayout.appendChild(compGrid);

  /* Summary panel */
  var summaryPanel = document.createElement('div');
  summaryPanel.style.cssText = 'background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:18px;position:sticky;top:16px;';

  var sumTitle = document.createElement('div');
  sumTitle.style.cssText = 'font-size:0.84rem;font-weight:700;color:var(--text);margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--border);';
  sumTitle.textContent = 'Your Plan';
  summaryPanel.appendChild(sumTitle);

  var sumModuleList = document.createElement('div');
  sumModuleList.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin-bottom:14px;min-height:60px;';
  summaryPanel.appendChild(sumModuleList);

  var sumDivider = document.createElement('div');
  sumDivider.style.cssText = 'border-top:1px solid var(--border);padding-top:12px;display:flex;flex-direction:column;gap:8px;';
  summaryPanel.appendChild(sumDivider);

  var sumSetupRow = document.createElement('div');
  sumSetupRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;';
  var sumSetupLabel = document.createElement('span');
  sumSetupLabel.style.cssText = 'font-size:0.76rem;color:var(--text2);';
  sumSetupLabel.textContent = 'One-time setup';
  var sumSetupVal = document.createElement('span');
  sumSetupVal.style.cssText = 'font-size:0.8rem;font-weight:600;color:var(--text);';
  sumSetupRow.appendChild(sumSetupLabel);
  sumSetupRow.appendChild(sumSetupVal);
  sumDivider.appendChild(sumSetupRow);

  var sumMonthlyRow = document.createElement('div');
  sumMonthlyRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;background:rgba(52,211,153,.07);border-radius:6px;padding:8px 10px;margin-top:2px;';
  var sumMonthlyLabel = document.createElement('span');
  sumMonthlyLabel.style.cssText = 'font-size:0.8rem;font-weight:600;color:var(--text2);';
  sumMonthlyLabel.textContent = 'Monthly total';
  var sumMonthlyVal = document.createElement('span');
  sumMonthlyVal.style.cssText = 'font-size:1.1rem;font-weight:800;color:var(--green-bright,#34d399);';
  sumMonthlyRow.appendChild(sumMonthlyLabel);
  sumMonthlyRow.appendChild(sumMonthlyVal);
  sumDivider.appendChild(sumMonthlyRow);

  var sumPerDay = document.createElement('div');
  sumPerDay.style.cssText = 'font-size:0.7rem;color:var(--text3);text-align:center;margin-top:2px;';
  sumDivider.appendChild(sumPerDay);

  var sumNote = document.createElement('div');
  sumNote.style.cssText = 'font-size:0.68rem;color:var(--text3);text-align:center;margin-top:10px;padding-top:10px;border-top:1px solid var(--border);line-height:1.6;';
  sumNote.textContent = '14-day free trial \u00B7 No long-term contract';
  summaryPanel.appendChild(sumNote);

  pricingLayout.appendChild(summaryPanel);
  pricingSection.appendChild(pricingLayout);
  container.appendChild(pricingSection);

  /* Update summary function */
  function updateSummary() {
    var totalSetup   = 0;
    var totalPerUser = 0;
    var activeModules = [];

    pricingComponents.forEach(function(comp, idx) {
      if (selected[idx]) {
        totalSetup   += comp.setup;
        totalPerUser += comp.perUser;
        activeModules.push(comp);
      }
    });

    var monthly = totalPerUser * teamSize;

    /* Clear and rebuild module list using DOM methods */
    clearChildren(sumModuleList);
    if (activeModules.length === 0) {
      var empty = document.createElement('div');
      empty.style.cssText = 'font-size:0.74rem;color:var(--text3);font-style:italic;';
      empty.textContent = 'No modules selected';
      sumModuleList.appendChild(empty);
    } else {
      activeModules.forEach(function(m) {
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;';
        var ml = document.createElement('span');
        ml.style.cssText = 'font-size:0.72rem;color:var(--text2);';
        ml.textContent = m.emoji + ' ' + m.name;
        var mr = document.createElement('span');
        mr.style.cssText = 'font-size:0.72rem;color:var(--text);font-weight:600;';
        mr.textContent = sgd(m.perUser * teamSize) + '/mo';
        row.appendChild(ml);
        row.appendChild(mr);
        sumModuleList.appendChild(row);
      });
    }

    sumSetupVal.textContent   = sgd(totalSetup);
    sumMonthlyVal.textContent = sgd(monthly);

    var perConPerDay = monthly > 0 ? (monthly / teamSize / 30).toFixed(2) : '0.00';
    sumPerDay.textContent = '$' + perConPerDay + ' per consultant per day';
  }

  /* Wire slider */
  slider.addEventListener('input', function() {
    teamSize = parseInt(this.value, 10);
    sliderVal.textContent = teamSize + ' consultant' + (teamSize === 1 ? '' : 's');
    updateSummary();
  });

  /* Initial render */
  updateSummary();

  /* ================================================================
     SECTION 4: PLATFORM COMPARISON
     ================================================================ */
  var compSection = document.createElement('div');
  compSection.style.cssText = 'margin-bottom:12px;';

  var ch3 = document.createElement('h3');
  ch3.style.cssText = 'font-size:1rem;font-weight:700;color:var(--text);margin:0 0 12px;';
  ch3.textContent = 'Platform Comparison';
  compSection.appendChild(ch3);

  var tableWrap = document.createElement('div');
  tableWrap.style.cssText = 'overflow-x:auto;border-radius:10px;border:1px solid var(--border);';

  var table = document.createElement('table');
  table.style.cssText = 'width:100%;border-collapse:collapse;font-size:0.78rem;';

  var thead = document.createElement('thead');
  var hrow = document.createElement('tr');
  var headers = ['Feature', 'ActivityTracker', 'Spreadsheets', 'Generic CRM'];
  headers.forEach(function(h, i) {
    var th = document.createElement('th');
    th.style.cssText = [
      'padding:10px 14px',
      'text-align:' + (i === 0 ? 'left' : 'center'),
      'font-size:0.74rem',
      'font-weight:700',
      'color:' + (i === 1 ? 'var(--green-bright,#34d399)' : 'var(--text2)'),
      'background:var(--bg2)',
      'border-bottom:1px solid var(--border)',
      i > 0 ? 'border-left:1px solid var(--border)' : '',
    ].join(';');
    th.textContent = h;
    hrow.appendChild(th);
  });
  thead.appendChild(hrow);
  table.appendChild(thead);

  var tbody = document.createElement('tbody');
  var compRows = [
    ['Real-time activity feed',        '\u2713', '\u2717', '\u2717'],
    ['Gamification & leaderboards',    '\u2713', '\u2717', '\u2717'],
    ['Built for financial advisory',   '\u2713', '\u2717', '\u2717'],
    ['AI coaching feedback',           '\u2713', '\u2717', '\u2717'],
    ['GPS activity verification',      '\u2713', '\u2717', '\u2717'],
    ['FYC goal reverse-engineering',   '\u2713', '\u2717', '\u2717'],
  ];

  compRows.forEach(function(row, ri) {
    var tr = document.createElement('tr');
    if (ri % 2 !== 0) { tr.style.background = 'rgba(255,255,255,.02)'; }
    row.forEach(function(cell, ci) {
      var td = document.createElement('td');
      var isCheck = cell === '\u2713';
      td.style.cssText = [
        'padding:9px 14px',
        'color:' + (ci === 0 ? 'var(--text2)' : (isCheck ? 'var(--green-bright,#34d399)' : '#ef4444')),
        'text-align:' + (ci === 0 ? 'left' : 'center'),
        'font-weight:' + (ci === 0 ? '400' : '700'),
        'font-size:' + (ci === 0 ? '0.78rem' : '1rem'),
        ci > 0 ? 'border-left:1px solid var(--border)' : '',
        ri < compRows.length - 1 ? 'border-bottom:1px solid var(--border)' : '',
      ].join(';');
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  tableWrap.appendChild(table);
  compSection.appendChild(tableWrap);
  container.appendChild(compSection);
};

/* ============================================================
   PRODUCT COMPASS DEMO
   ============================================================ */

DEMO_RENDERERS.compass = function(container) {
  container.innerHTML = '';
  container.id = 'compassDemo';

  /* ---- Subtab definitions ---- */
  var subtabs = [
    { id: 'track',    label: 'Learning Track' },
    { id: 'products', label: 'Product Knowledge' },
    { id: 'cards',    label: 'Concept Cards' },
    { id: 'scripts',  label: 'Script Database' },
    { id: 'qbank',    label: 'Question Bank' },
    { id: 'roleplay', label: 'AI Roleplay' },
    { id: 'videos',   label: 'Video Lectures' },
  ];

  /* ---- Header ---- */
  var header = document.createElement('div');
  header.style.cssText = 'margin-bottom:16px;';
  var title = document.createElement('div');
  title.style.cssText = 'font-size:1.1rem;font-weight:700;color:var(--text);margin-bottom:2px;';
  title.textContent = 'Product Compass';
  var subtitle = document.createElement('div');
  subtitle.style.cssText = 'font-size:0.75rem;color:var(--text3);';
  subtitle.textContent = 'All-in-one learning platform for financial advisors';
  header.appendChild(title);
  header.appendChild(subtitle);
  container.appendChild(header);

  /* ---- Subtab bar ---- */
  var tabBar = document.createElement('div');
  tabBar.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:4px;';

  var panes = {};

  subtabs.forEach(function(st) {
    var btn = document.createElement('button');
    btn.id = 'cpTab_' + st.id;
    btn.style.cssText = [
      'background:transparent',
      'border:none',
      'border-bottom:2px solid transparent',
      'color:var(--text3)',
      'font-size:0.75rem',
      'font-weight:600',
      'padding:6px 10px',
      'cursor:pointer',
      'transition:color 0.2s,border-color 0.2s',
      'white-space:nowrap',
    ].join(';');
    btn.textContent = st.label;
    btn.onclick = function() { compassTab(st.id); };
    tabBar.appendChild(btn);

    var pane = document.createElement('div');
    pane.id = 'cpPane_' + st.id;
    pane.style.display = 'none';
    panes[st.id] = pane;
    container.appendChild(pane);
  });

  container.insertBefore(tabBar, panes[subtabs[0].id]);

  /* ============================================================
     PANE 1: LEARNING TRACK
     ============================================================ */
  (function() {
    var pane = panes.track;

    /* YOUR PROGRESS summary card */
    var progressCard = document.createElement('div');
    progressCard.style.cssText = 'background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px 16px;margin-bottom:16px;';
    var progressCardLabel = document.createElement('div');
    progressCardLabel.style.cssText = 'font-size:0.62rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--primary-light);margin-bottom:10px;';
    progressCardLabel.textContent = 'Your Progress';
    var progressCardRow = document.createElement('div');
    progressCardRow.style.cssText = 'display:flex;align-items:center;gap:20px;flex-wrap:wrap;';
    [
      { val: '47%',      label: 'Complete',   color: 'var(--primary-light)' },
      { val: '142/302',  label: 'Lessons',    color: 'var(--text)' },
      { val: '~28h',     label: 'Remaining',  color: 'var(--amber)' },
      { val: 'Phase 2/5',label: 'Phase',      color: 'var(--text)' },
    ].forEach(function(pi) {
      var item = document.createElement('div');
      item.style.cssText = 'display:flex;flex-direction:column;';
      var val = document.createElement('div');
      val.style.cssText = 'font-size:1.1rem;font-weight:800;color:' + pi.color + ';line-height:1;';
      val.textContent = pi.val;
      var lbl = document.createElement('div');
      lbl.style.cssText = 'font-size:0.62rem;color:var(--text3);margin-top:3px;';
      lbl.textContent = pi.label;
      item.appendChild(val);
      item.appendChild(lbl);
      progressCardRow.appendChild(item);
    });
    progressCard.appendChild(progressCardLabel);
    progressCard.appendChild(progressCardRow);
    pane.appendChild(progressCard);

    /* Stepper */
    var phases = [
      { name: 'Foundation',       pct: 100, status: 'done',    color: 'var(--green-bright)', desc: 'Company basics, compliance, CRM setup' },
      { name: 'Product Knowledge',pct: 72,  status: 'active',  color: 'var(--primary-light)', desc: 'Life, health, investment products' },
      { name: 'Sales Skills',     pct: 45,  status: 'active',  color: 'var(--primary-light)', desc: 'Client conversations, objection handling' },
      { name: 'Exam Prep',        pct: 18,  status: 'partial', color: 'var(--text3)',         desc: 'M9, M9A, HI, RES5 practice' },
      { name: 'Field-Ready',      pct: 0,   status: 'locked',  color: 'var(--border)',        desc: 'Live roleplay, mentorship' },
    ];

    var stepper = document.createElement('div');
    stepper.style.cssText = 'display:flex;align-items:flex-start;gap:0;margin-bottom:20px;overflow-x:auto;padding-bottom:4px;';

    phases.forEach(function(ph, i) {
      var step = document.createElement('div');
      step.style.cssText = 'display:flex;flex-direction:column;align-items:center;flex:1;min-width:100px;position:relative;';

      /* Connector line */
      if (i < phases.length - 1) {
        var line = document.createElement('div');
        var lineColor = ph.pct === 100 ? 'var(--green-bright)' : 'var(--border)';
        line.style.cssText = 'position:absolute;top:16px;left:50%;width:100%;height:2px;background:' + lineColor + ';z-index:0;';
        step.appendChild(line);
      }

      /* Circle */
      var circle = document.createElement('div');
      var circleBg = ph.status === 'done' ? 'var(--green-bright)' : ph.pct > 0 ? 'var(--primary-light)' : 'var(--bg3)';
      var circleText = ph.status === 'done' ? '\u2713' : ph.status === 'locked' ? '\uD83D\uDD12' : String(i + 1);
      circle.style.cssText = [
        'width:32px',
        'height:32px',
        'border-radius:50%',
        'background:' + circleBg,
        'border:2px solid ' + ph.color,
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'font-size:0.75rem',
        'font-weight:700',
        'color:' + (ph.pct > 0 ? '#0a0f1a' : 'var(--text3)'),
        'position:relative',
        'z-index:1',
        'flex-shrink:0',
      ].join(';');
      circle.textContent = circleText;

      /* Phase name */
      var phaseName = document.createElement('div');
      phaseName.style.cssText = 'font-size:0.68rem;font-weight:700;color:' + (ph.pct > 0 ? 'var(--text)' : 'var(--text3)') + ';margin-top:6px;text-align:center;line-height:1.3;';
      phaseName.textContent = ph.name;

      /* Phase desc */
      var phaseDesc = document.createElement('div');
      phaseDesc.style.cssText = 'font-size:0.62rem;color:var(--text3);text-align:center;margin-top:3px;line-height:1.3;max-width:90px;';
      phaseDesc.textContent = ph.desc;

      /* Mini progress bar */
      var miniBar = document.createElement('div');
      miniBar.style.cssText = 'width:80%;height:3px;background:var(--bg1);border-radius:99px;margin-top:5px;overflow:hidden;';
      var miniFill = document.createElement('div');
      miniFill.style.cssText = 'height:100%;width:' + ph.pct + '%;background:' + ph.color + ';border-radius:99px;';
      miniBar.appendChild(miniFill);
      var miniPct = document.createElement('div');
      miniPct.style.cssText = 'font-size:0.6rem;color:' + ph.color + ';margin-top:2px;font-weight:700;';
      miniPct.textContent = ph.pct + '%';

      step.appendChild(circle);
      step.appendChild(phaseName);
      step.appendChild(phaseDesc);
      step.appendChild(miniBar);
      step.appendChild(miniPct);
      stepper.appendChild(step);
    });

    pane.appendChild(stepper);

    /* Current assignment checklist */
    var checklistCard = document.createElement('div');
    checklistCard.className = 'chart-container';
    checklistCard.style.cssText = 'padding:14px;margin-bottom:0;';

    var checklistTitle = document.createElement('div');
    checklistTitle.className = 'demo-section-heading';
    checklistTitle.style.cssText = 'margin-top:0;margin-bottom:12px;';
    checklistTitle.textContent = 'Current Assignments';
    checklistCard.appendChild(checklistTitle);

    var tasks = [
      { text: 'Complete Life Insurance module (Unit Trusts section)', done: true },
      { text: 'Read product comparison sheet: Term vs Whole Life', done: true },
      { text: 'Watch: CPF & Retirement Planning lecture (18:45)', done: true },
      { text: 'Complete quiz: Life Insurance fundamentals (80% pass)', done: true },
      { text: 'Review Health Insurance product comparison sheet', done: true },
      { text: 'Practice 20 M9 exam questions', done: false },
      { text: 'Submit case study: Mrs Lim retirement portfolio', done: false },
      { text: 'Roleplay session: Objection Handling with AI Coach', done: false },
    ];

    var doneCount = tasks.filter(function(t) { return t.done; }).length;
    var taskProgress = document.createElement('div');
    taskProgress.style.cssText = 'font-size:0.72rem;color:var(--text3);margin-bottom:10px;';
    taskProgress.textContent = doneCount + ' of ' + tasks.length + ' tasks complete';
    checklistCard.appendChild(taskProgress);

    tasks.forEach(function(task) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--bg1);';

      var checkbox = document.createElement('div');
      checkbox.style.cssText = task.done
        ? 'width:18px;height:18px;border-radius:4px;background:var(--green-bright);display:flex;align-items:center;justify-content:center;flex-shrink:0;'
        : 'width:18px;height:18px;border-radius:4px;border:1.5px solid var(--border);flex-shrink:0;';
      if (task.done) {
        checkbox.innerHTML = '<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#0a0f1a" stroke-width="1.8" stroke-linecap="round"/></svg>';
      }

      var label = document.createElement('div');
      label.style.cssText = 'font-size:0.78rem;line-height:1.4;color:' + (task.done ? 'var(--text3)' : 'var(--text)') + ';' + (task.done ? 'text-decoration:line-through;' : '');
      label.textContent = task.text;

      row.appendChild(checkbox);
      row.appendChild(label);
      checklistCard.appendChild(row);
    });

    pane.appendChild(checklistCard);
  })();

  /* ============================================================
     PANE 2: PRODUCT KNOWLEDGE
     ============================================================ */
  (function() {
    var pane = panes.products;

    var heading = document.createElement('div');
    heading.className = 'demo-section-heading';
    heading.style.cssText = 'margin-top:0;margin-bottom:10px;';
    heading.textContent = 'Product Categories';
    pane.appendChild(heading);

    /* Search bar */
    var searchWrap = document.createElement('div');
    searchWrap.style.cssText = 'position:relative;margin-bottom:14px;';
    var searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search products, concepts, keywords…';
    searchInput.style.cssText = [
      'width:100%',
      'box-sizing:border-box',
      'background:var(--bg3)',
      'border:1px solid var(--border)',
      'border-radius:var(--radius-sm)',
      'color:var(--text)',
      'font-size:0.78rem',
      'padding:8px 12px 8px 34px',
      'outline:none',
      'transition:border-color 0.2s',
    ].join(';');
    searchInput.onfocus = function() { this.style.borderColor = 'var(--primary-light)'; };
    searchInput.onblur  = function() { this.style.borderColor = 'var(--border)'; };
    var searchIcon = document.createElement('div');
    searchIcon.style.cssText = 'position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text3);font-size:0.85rem;pointer-events:none;';
    searchIcon.textContent = '\uD83D\uDD0D';
    searchWrap.appendChild(searchIcon);
    searchWrap.appendChild(searchInput);
    pane.appendChild(searchWrap);

    var categories = [
      { id: 'life',    icon: '\uD83D\uDEE1\uFE0F', name: 'Life Insurance',     count: 12, sub: '12 products',  items: ['Term Life \u2014 affordable pure protection', 'Whole Life \u2014 lifetime cover with cash value', 'ILP \u2014 investment + life cover combined', 'Endowment \u2014 savings with guaranteed maturity', 'Key rider: Critical Illness, TPD, WOP'] },
      { id: 'health',  icon: '\uD83C\uDFE5',       name: 'Health Insurance',   count: 9,  sub: '9 products',   items: ['MediShield Life \u2014 mandatory base layer', 'Integrated Shield Plans \u2014 private ward top-up', 'Critical Illness \u2014 lump sum on diagnosis', 'Hospital Cash \u2014 daily income benefit', 'MultiPay CI \u2014 multiple claims allowed'] },
      { id: 'invest',  icon: '\uD83D\uDCC8',       name: 'Investment Products',count: 7,  sub: '7 products',   items: ['Unit Trusts \u2014 pooled managed funds', 'ETFs \u2014 index-tracking, exchange-listed', 'ILPs \u2014 insurance wrapper over funds', 'RSP \u2014 regular savings plan', 'Structured deposits \u2014 capital-protected'] },
      { id: 'retire',  icon: '\uD83C\uDFD6\uFE0F', name: 'Retirement',         count: 6,  sub: '6 products',   items: ['CPF Life \u2014 national annuity scheme', 'Supplementary Retirement Scheme (SRS)', 'Private annuities \u2014 guaranteed payout', 'Retirement Sum Scheme options', 'Income drawdown plans'] },
      { id: 'general', icon: '\uD83C\uDFE0',       name: 'General Insurance',  count: 8,  sub: '8 products',   items: ['Motor \u2014 TPFT and comprehensive', 'Travel \u2014 medical, cancellation, baggage', 'Home Contents & Fire insurance', 'Personal Accident \u2014 daily payout', 'Domestic helper insurance'] },
      { id: 'biz',     icon: '\uD83D\uDCBC',       name: 'Business Solutions', count: 5,  sub: '5 products',   items: ['Group Term Life \u2014 employee benefit', 'Key Man Insurance \u2014 protect key personnel', 'Business Continuity planning', 'Group health & hospitalisation', 'Directors & Officers liability'] },
    ];

    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;';

    categories.forEach(function(cat) {
      var card = document.createElement('div');
      card.id = 'cpProdCard_' + cat.id;
      card.style.cssText = [
        'background:var(--bg3)',
        'border:1px solid var(--border)',
        'border-radius:var(--radius-sm)',
        'padding:14px',
        'cursor:pointer',
        'transition:border-color 0.2s',
      ].join(';');

      var iconEl = document.createElement('div');
      iconEl.style.cssText = 'font-size:1.4rem;margin-bottom:8px;';
      iconEl.textContent = cat.icon;

      var nameEl = document.createElement('div');
      nameEl.style.cssText = 'font-size:0.82rem;font-weight:700;color:var(--text);margin-bottom:3px;';
      nameEl.textContent = cat.name;

      var subRow = document.createElement('div');
      subRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:0;';
      var subEl = document.createElement('div');
      subEl.style.cssText = 'font-size:0.68rem;color:var(--text3);';
      subEl.textContent = cat.sub;
      var countBadge = document.createElement('div');
      countBadge.style.cssText = 'font-size:0.62rem;background:var(--bg1);border:1px solid var(--border);border-radius:var(--radius-pill);padding:1px 7px;color:var(--text3);';
      countBadge.textContent = cat.count + ' products';
      subRow.appendChild(subEl);
      subRow.appendChild(countBadge);

      /* Expanded detail */
      var detail = document.createElement('div');
      detail.id = 'cpProdDetail_' + cat.id;
      detail.style.cssText = 'display:none;margin-top:10px;border-top:1px solid var(--border);padding-top:10px;';

      cat.items.forEach(function(item) {
        var row = document.createElement('div');
        row.style.cssText = 'font-size:0.72rem;color:var(--text2);padding:3px 0;display:flex;align-items:flex-start;gap:6px;';
        var dot = document.createElement('span');
        dot.style.cssText = 'color:var(--primary-light);flex-shrink:0;margin-top:1px;';
        dot.textContent = '\u25B8';
        var txt = document.createElement('span');
        txt.textContent = item;
        row.appendChild(dot);
        row.appendChild(txt);
        detail.appendChild(row);
      });

      card.appendChild(iconEl);
      card.appendChild(nameEl);
      card.appendChild(subRow);
      card.appendChild(detail);

      card.onmouseover = function() { card.style.borderColor = 'var(--primary-light)'; };
      card.onmouseout  = function() {
        var det = document.getElementById('cpProdDetail_' + cat.id);
        if (!det || det.style.display === 'none') card.style.borderColor = 'var(--border)';
      };
      card.onclick = function() {
        var det = document.getElementById('cpProdDetail_' + cat.id);
        if (!det) return;
        var open = det.style.display !== 'none';
        det.style.display = open ? 'none' : 'block';
        card.style.borderColor = open ? 'var(--border)' : 'var(--primary-light)';
      };

      grid.appendChild(card);
    });

    pane.appendChild(grid);
  })();

  /* ============================================================
     PANE 3: CONCEPT CARDS
     ============================================================ */
  (function() {
    var pane = panes.cards;

    var heading = document.createElement('div');
    heading.className = 'demo-section-heading';
    heading.style.cssText = 'margin-top:0;margin-bottom:4px;';
    heading.textContent = 'Concept Cards';
    var hintRow = document.createElement('div');
    hintRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;';
    var hint = document.createElement('div');
    hint.style.cssText = 'font-size:0.72rem;color:var(--text3);';
    hint.textContent = 'Click a card to reveal the answer';
    var navGroup = document.createElement('div');
    navGroup.style.cssText = 'display:flex;align-items:center;gap:8px;';
    var cardCounter = document.createElement('div');
    cardCounter.id = 'cpCardCounter';
    cardCounter.style.cssText = 'font-size:0.72rem;color:var(--text3);font-weight:600;';
    cardCounter.textContent = 'Card 1 of 5';
    var prevBtn = document.createElement('button');
    prevBtn.style.cssText = 'background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text2);font-size:0.8rem;padding:3px 9px;cursor:pointer;';
    prevBtn.textContent = '\u2039';
    var nextBtn = document.createElement('button');
    nextBtn.style.cssText = 'background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text2);font-size:0.8rem;padding:3px 9px;cursor:pointer;';
    nextBtn.textContent = '\u203A';
    navGroup.appendChild(prevBtn);
    navGroup.appendChild(cardCounter);
    navGroup.appendChild(nextBtn);
    hintRow.appendChild(hint);
    hintRow.appendChild(navGroup);
    pane.appendChild(heading);
    pane.appendChild(hintRow);

    /* Inject flip-card CSS once */
    if (!document.getElementById('compassFlipStyle')) {
      var style = document.createElement('style');
      style.id = 'compassFlipStyle';
      style.textContent = [
        '.cp-flip-scene{perspective:800px;height:160px;}',
        '.cp-flip-card{width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform 0.5s;}',
        '.cp-flip-card.flipped{transform:rotateY(180deg);}',
        '.cp-flip-front,.cp-flip-back{position:absolute;width:100%;height:100%;backface-visibility:hidden;border-radius:var(--radius-sm);padding:16px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;}',
        '.cp-flip-front{background:var(--bg3);border:1px solid var(--border);}',
        '.cp-flip-back{background:var(--primary);border:1px solid var(--primary-light);transform:rotateY(180deg);}',
      ].join('');
      document.head.appendChild(style);
    }

    var conceptCards = [
      {
        q: 'What is the incontestability clause?',
        a: 'After 2 years, insurer cannot deny claims based on non-disclosure or misrepresentation. Protects policyholders from retroactive rejection.',
        diagram: 'Policy issued \u2192 2-year window \u2192 Incontestable \u2713',
        difficulty: 'Basic',
      },
      {
        q: 'What is Dollar Cost Averaging?',
        a: 'Investing a fixed amount regularly regardless of market conditions. Buys more units when prices are low, fewer when high \u2014 reduces timing risk.',
        diagram: 'Jan $100 \u2192 10 units \u00B7 Feb $100 \u2192 12 units \u00B7 Avg cost < market price',
        difficulty: 'Basic',
      },
      {
        q: 'Explain the Total Wealth Concept',
        a: 'Three pillars: Human Capital (earning power), Financial Capital (accumulated assets), and Passive Income (dividends, annuities). Goal: grow financial capital as human capital peaks then declines.',
        diagram: 'Human Capital \u2193 over time + Financial Capital \u2191 = Retirement readiness',
        difficulty: 'Intermediate',
      },
      {
        q: 'What is the difference between Term and Whole Life insurance?',
        a: 'Term Life: pure protection for a fixed period, no cash value. Whole Life: lifetime coverage with a cash value component that accumulates over time. Term is cheaper; Whole Life has a savings element.',
        diagram: 'Term = rent \u00B7 Whole Life = buy property \u2014 both protect, one builds equity',
        difficulty: 'Basic',
      },
      {
        q: 'How does MAS FAA suitability requirement affect your sales process?',
        a: 'MAS Financial Advisers Act requires advisors to conduct a fact-find before recommending any product. You must assess income, liabilities, existing coverage, risk appetite, and investment horizon. Non-compliance can result in license suspension.',
        diagram: 'Fact-Find \u2192 Needs Analysis \u2192 Product Match \u2192 Recommendation \u2192 Documentation',
        difficulty: 'Advanced',
      },
    ];

    var cpCardIndex = [0]; /* wrapped in array so closures can mutate */

    function updateCardNav(idx, total) {
      var counter = document.getElementById('cpCardCounter');
      if (counter) counter.textContent = 'Card ' + (idx + 1) + ' of ' + total;
      var scenes = document.querySelectorAll('.cp-flip-scene');
      scenes.forEach(function(s, i) {
        s.style.display = i === idx ? 'block' : 'none';
        /* reset flip when navigating */
        var fc = s.querySelector('.cp-flip-card');
        if (fc && i !== idx) fc.classList.remove('flipped');
      });
    }

    prevBtn.onclick = function() {
      if (cpCardIndex[0] > 0) { cpCardIndex[0]--; updateCardNav(cpCardIndex[0], conceptCards.length); }
    };
    nextBtn.onclick = function() {
      if (cpCardIndex[0] < conceptCards.length - 1) { cpCardIndex[0]++; updateCardNav(cpCardIndex[0], conceptCards.length); }
    };

    var cardsGrid = document.createElement('div');
    cardsGrid.style.cssText = 'display:block;';

    conceptCards.forEach(function(cc, i) {
      var scene = document.createElement('div');
      scene.className = 'cp-flip-scene';
      scene.style.display = i === 0 ? 'block' : 'none';

      var flipCard = document.createElement('div');
      flipCard.className = 'cp-flip-card';
      flipCard.id = 'cpFlip_' + i;

      /* Front */
      var front = document.createElement('div');
      front.className = 'cp-flip-front';

      var qTopRow = document.createElement('div');
      qTopRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;';
      var qLabel = document.createElement('div');
      qLabel.style.cssText = 'font-size:0.62rem;color:var(--text3);font-weight:700;letter-spacing:0.06em;text-transform:uppercase;';
      qLabel.textContent = 'Question';
      var diffBadge = document.createElement('div');
      var diffColor = cc.difficulty === 'Basic' ? 'var(--green-bright)' : cc.difficulty === 'Advanced' ? 'var(--red)' : 'var(--amber)';
      diffBadge.style.cssText = 'font-size:0.58rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:' + diffColor + ';border:1px solid ' + diffColor + ';border-radius:var(--radius-pill);padding:1px 7px;';
      diffBadge.textContent = cc.difficulty;
      qTopRow.appendChild(qLabel);
      qTopRow.appendChild(diffBadge);

      var qText = document.createElement('div');
      qText.style.cssText = 'font-size:0.8rem;font-weight:600;color:var(--text);line-height:1.4;flex:1;display:flex;align-items:center;';
      qText.textContent = cc.q;

      var tapHint = document.createElement('div');
      tapHint.style.cssText = 'font-size:0.62rem;color:var(--primary-light);text-align:right;';
      tapHint.textContent = 'Click to flip \u2192';

      front.appendChild(qTopRow);
      front.appendChild(qText);
      front.appendChild(tapHint);

      /* Back */
      var back = document.createElement('div');
      back.className = 'cp-flip-back';

      var aLabel = document.createElement('div');
      aLabel.style.cssText = 'font-size:0.62rem;color:rgba(255,255,255,0.6);font-weight:700;letter-spacing:0.06em;text-transform:uppercase;';
      aLabel.textContent = 'Answer';

      var aText = document.createElement('div');
      aText.style.cssText = 'font-size:0.75rem;color:#e2e8f0;line-height:1.5;flex:1;display:flex;align-items:center;';
      aText.textContent = cc.a;

      var diagram = document.createElement('div');
      diagram.style.cssText = 'font-size:0.62rem;color:rgba(255,255,255,0.55);font-style:italic;border-top:1px solid rgba(255,255,255,0.2);padding-top:6px;margin-top:4px;';
      diagram.textContent = cc.diagram;

      back.appendChild(aLabel);
      back.appendChild(aText);
      back.appendChild(diagram);

      flipCard.appendChild(front);
      flipCard.appendChild(back);
      scene.appendChild(flipCard);

      scene.onclick = (function(fc) {
        return function() { fc.classList.toggle('flipped'); };
      })(flipCard);

      cardsGrid.appendChild(scene);
    });

    pane.appendChild(cardsGrid);
    /* Initialize nav - show first card */
    setTimeout(function() { updateCardNav(0, conceptCards.length); }, 0);
  })();

  /* ============================================================
     PANE 4: SCRIPT DATABASE
     ============================================================ */
  (function() {
    var pane = panes.scripts;

    var heading = document.createElement('div');
    heading.className = 'demo-section-heading';
    heading.style.cssText = 'margin-top:0;margin-bottom:12px;';
    heading.textContent = 'Script Database';
    pane.appendChild(heading);

    var scriptCats = [
      {
        label: 'Cold Calling',
        scripts: [
          { title: 'New Grad Approach', uses: 284, rating: 4.3, lines: ['"Hi, is this [Name]? I\'m Leo from AIA. Congrats on graduating \u2014 I work with a lot of fresh graduates on getting their financial basics right..."', '"I know it might not be top of mind yet, but the best time to start is when you have zero commitments. Do you have 15 minutes this week?"'] },
          { title: 'Working Professional Approach', uses: 512, rating: 4.7, lines: ['"Hi [Name], I noticed we\'re both connected through [mutual contact]. I help working professionals in their 30s make sure their income is protected and their savings are actually growing..."', '"A lot of my clients started with just a quick review \u2014 no commitment at all. Would that be useful for you?"'] },
          { title: 'Parent Approach', uses: 196, rating: 4.4, lines: ['"Hi [Name], I specialise in working with young parents to make sure the family is covered if anything unexpected happens..."', '"Most parents I speak to don\'t realise there are gaps in their coverage until something happens. I can do a free coverage review \u2014 takes 20 minutes."'] },
        ],
      },
      {
        label: 'SMS/WhatsApp',
        scripts: [
          { title: 'Cold Introduction', uses: 341, rating: 4.1, lines: ['"Hi [Name], I\'m Leo, a financial consultant with AIA. I help young professionals with financial planning. Would you be open to a quick 20-min chat?"', '"No pressure at all \u2014 even if we decide it\'s not the right fit, you\'ll walk away with clarity on where you stand financially."'] },
          { title: 'Post-Meeting Follow-up', uses: 228, rating: 4.6, lines: ['"Hi [Name]! Great meeting you today. As promised, I\'ve sent the proposal to your email. Let me know if you have questions \u2014 happy to walk through it."', '"I\'ll follow up in 3 days. In the meantime, feel free to WhatsApp me anytime \uD83D\uDE0A"'] },
        ],
      },
      {
        label: 'Objection Handling',
        scripts: [
          { title: '"I need to think about it"', uses: 673, rating: 4.8, lines: ['"Of course, this is an important decision. Can I ask what specifically you\'d like to think through? That way I can make sure you have all the info you need."', '"Usually when clients say that, there\'s either a concern about affordability, timing, or they\'re not 100% sure it\'s suitable. Which of those resonates most with you?"'] },
          { title: '"I\'m already covered through work"', uses: 445, lines: ['"Group coverage is a great starting point. The challenge is \u2014 if you leave the company, the coverage stops. Personal coverage follows you regardless."', '"Also, most group policies don\'t cover critical illness or total permanent disability. Can I do a quick gap analysis so you can see exactly where you stand?"'] },
          { title: '"I can\'t afford it right now"', uses: 389, lines: ['"I totally understand. The good news is protection doesn\'t have to start big. We can start with the essentials \u2014 sometimes as low as $80-100/month \u2014 and build from there."', '"The real risk is not having coverage and something happening. Let me show you what the bare minimum looks like."'] },
        ],
      },
      {
        label: 'Referral',
        scripts: [
          { title: 'After Successful Policy', uses: 157, lines: ['"[Name], really glad we got your coverage sorted. Quick question \u2014 do you have a friend or family member who might benefit from the same peace of mind?"', '"I work on referrals mostly, so any intro you can make would mean a lot. I promise to take good care of them."'] },
          { title: 'Referral Introduction', uses: 93, lines: ['"Hi [Referral Name], I\'m Leo \u2014 [Client Name] suggested I reach out. I helped them with their financial planning recently and they thought you might find it useful too."', '"No hard sell, I promise. Happy to just do a free 20-minute coverage check to give you a clearer picture."'] },
        ],
      },
      {
        label: 'Servicing',
        scripts: [
          { title: 'Annual Policy Review', uses: 208, rating: 4.4, lines: ['"Hi [Name]! It\'s been about a year since we set up your policy. I\'d love to do a quick annual review \u2014 life changes and we want to make sure you\'re still fully covered."', '"Takes 30 minutes, and we can do it over Zoom. When works best for you this month?"'] },
          { title: 'Birthday/Life Event', uses: 176, rating: 4.3, lines: ['"Happy birthday [Name]! \uD83C\uDF89 Hope you have an amazing year ahead. Just a quick check-in \u2014 any big life changes this year? New job, house, baby? Those can affect your coverage needs."', '"No rush to review now, but whenever you\'re ready, I\'m here. Take care!"'] },
        ],
      },
    ];

    /* Category tab bar */
    var catBar = document.createElement('div');
    catBar.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;';

    var scriptPanes = {};

    scriptCats.forEach(function(cat, ci) {
      var btn = document.createElement('button');
      btn.id = 'cpScriptTab_' + ci;
      btn.style.cssText = [
        'background:var(--bg3)',
        'border:1px solid var(--border)',
        'border-radius:var(--radius-pill)',
        'color:var(--text3)',
        'font-size:0.72rem',
        'font-weight:600',
        'padding:5px 12px',
        'cursor:pointer',
        'transition:all 0.2s',
      ].join(';');
      btn.textContent = cat.label;
      btn.onclick = function() { compassScriptTab(ci, scriptCats.length); };
      catBar.appendChild(btn);

      var sp = document.createElement('div');
      sp.id = 'cpScriptPane_' + ci;
      sp.style.display = 'none';
      sp.style.cssText += 'display:none;';

      var sg = document.createElement('div');
      sg.style.cssText = 'display:flex;flex-direction:column;gap:10px;';

      cat.scripts.forEach(function(sc, si) {
        var card = document.createElement('div');
        card.style.cssText = 'background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;';

        var cardTop = document.createElement('div');
        cardTop.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;';

        var cardTitle = document.createElement('div');
        cardTitle.style.cssText = 'font-size:0.8rem;font-weight:700;color:var(--text);';
        cardTitle.textContent = sc.title;

        var usageBadge = document.createElement('div');
        usageBadge.style.cssText = 'font-size:0.65rem;color:var(--text3);background:var(--bg1);border:1px solid var(--border);border-radius:var(--radius-pill);padding:2px 8px;';
        usageBadge.textContent = 'Used ' + sc.uses + ' times';

        cardTop.appendChild(cardTitle);
        cardTop.appendChild(usageBadge);
        card.appendChild(cardTop);

        /* Star rating */
        if (sc.rating) {
          var starRow = document.createElement('div');
          starRow.style.cssText = 'display:flex;align-items:center;gap:4px;margin-bottom:8px;';
          var starsEl = document.createElement('div');
          starsEl.style.cssText = 'display:flex;gap:1px;';
          var fullStars = Math.floor(sc.rating);
          var hasHalf = (sc.rating - fullStars) >= 0.5;
          for (var s = 0; s < 5; s++) {
            var star = document.createElement('span');
            star.style.cssText = 'font-size:0.65rem;';
            if (s < fullStars) { star.textContent = '\u2605'; star.style.color = 'var(--amber)'; }
            else if (s === fullStars && hasHalf) { star.textContent = '\u2BEA'; star.style.color = 'var(--amber)'; }
            else { star.textContent = '\u2606'; star.style.color = 'var(--text3)'; }
            starsEl.appendChild(star);
          }
          var ratingNum = document.createElement('span');
          ratingNum.style.cssText = 'font-size:0.65rem;color:var(--text3);';
          ratingNum.textContent = sc.rating.toFixed(1) + '/5';
          starRow.appendChild(starsEl);
          starRow.appendChild(ratingNum);
          card.appendChild(starRow);
        }

        sc.lines.forEach(function(line) {
          var lineEl = document.createElement('div');
          lineEl.style.cssText = 'font-size:0.75rem;color:var(--text2);line-height:1.5;margin-bottom:5px;font-style:italic;border-left:2px solid var(--border);padding-left:10px;';
          lineEl.textContent = line;
          card.appendChild(lineEl);
        });

        var copyBtn = document.createElement('button');
        copyBtn.style.cssText = [
          'background:transparent',
          'border:1px solid var(--border)',
          'border-radius:var(--radius-sm)',
          'color:var(--primary-light)',
          'font-size:0.7rem',
          'font-weight:600',
          'padding:5px 12px',
          'cursor:pointer',
          'margin-top:8px',
          'transition:all 0.2s',
        ].join(';');
        copyBtn.textContent = 'Copy Script';
        copyBtn.onclick = (function(btn, lines) {
          return function() {
            btn.textContent = 'Copied!';
            btn.style.color = 'var(--green-bright)';
            btn.style.borderColor = 'var(--green-bright)';
            setTimeout(function() {
              btn.textContent = 'Copy Script';
              btn.style.color = 'var(--primary-light)';
              btn.style.borderColor = 'var(--border)';
            }, 1500);
          };
        })(copyBtn, sc.lines);

        card.appendChild(copyBtn);
        sg.appendChild(card);
      });

      sp.appendChild(sg);
      scriptPanes[ci] = sp;
      pane.appendChild(sp);
    });

    pane.insertBefore(catBar, scriptPanes[0]);

    /* expose for onclick */
    window._compassScriptPaneCount = scriptCats.length;

    /* Default: show first category */
    setTimeout(function() { compassScriptTab(0, scriptCats.length); }, 0);
  })();

  /* ============================================================
     PANE 5: QUESTION BANK
     ============================================================ */
  (function() {
    var pane = panes.qbank;

    var heading = document.createElement('div');
    heading.className = 'demo-section-heading';
    heading.style.cssText = 'margin-top:0;margin-bottom:14px;';
    heading.textContent = 'Question Bank';
    pane.appendChild(heading);

    /* Stats bar */
    var statsBar = document.createElement('div');
    statsBar.style.cssText = 'display:flex;gap:16px;flex-wrap:wrap;background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 14px;margin-bottom:14px;';
    var stats = [
      { label: 'Available', val: '1,024' },
      { label: 'Attempted', val: '342' },
      { label: 'Accuracy', val: '78%', color: 'var(--green-bright)' },
    ];
    stats.forEach(function(s) {
      var st = document.createElement('div');
      st.style.cssText = 'display:flex;flex-direction:column;';
      var sv = document.createElement('div');
      sv.style.cssText = 'font-size:1rem;font-weight:800;color:' + (s.color || 'var(--text)') + ';line-height:1;';
      sv.textContent = s.val;
      var sl = document.createElement('div');
      sl.style.cssText = 'font-size:0.65rem;color:var(--text3);margin-top:2px;';
      sl.textContent = s.label;
      st.appendChild(sv);
      st.appendChild(sl);
      statsBar.appendChild(st);
    });
    pane.appendChild(statsBar);

    /* Module selector */
    var modules = ['M9', 'M9A', 'HI', 'RES5'];
    var modBar = document.createElement('div');
    modBar.style.cssText = 'display:flex;gap:6px;margin-bottom:14px;';
    modules.forEach(function(m, mi) {
      var btn = document.createElement('button');
      btn.id = 'cpQMod_' + mi;
      btn.style.cssText = [
        'background:' + (mi === 0 ? 'var(--primary)' : 'var(--bg3)'),
        'border:1px solid ' + (mi === 0 ? 'var(--primary-light)' : 'var(--border)'),
        'border-radius:var(--radius-pill)',
        'color:' + (mi === 0 ? '#fff' : 'var(--text3)'),
        'font-size:0.75rem',
        'font-weight:700',
        'padding:5px 14px',
        'cursor:pointer',
        'transition:all 0.2s',
      ].join(';');
      btn.textContent = m;
      btn.onclick = function() {
        modules.forEach(function(_, j) {
          var b = document.getElementById('cpQMod_' + j);
          if (!b) return;
          b.style.background = j === mi ? 'var(--primary)' : 'var(--bg3)';
          b.style.borderColor = j === mi ? 'var(--primary-light)' : 'var(--border)';
          b.style.color = j === mi ? '#fff' : 'var(--text3)';
        });
      };
      modBar.appendChild(btn);
    });
    pane.appendChild(modBar);

    /* Progress indicator */
    var qProgress = document.createElement('div');
    qProgress.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:10px;';
    var qProgText = document.createElement('span');
    qProgText.style.cssText = 'font-size:0.72rem;color:var(--text3);white-space:nowrap;';
    qProgText.textContent = 'Question 3 of 10 \u2014 M9 Life Insurance';
    var qProgBar = document.createElement('div');
    qProgBar.style.cssText = 'flex:1;height:5px;background:var(--bg3);border-radius:99px;overflow:hidden;';
    var qProgFill = document.createElement('div');
    qProgFill.style.cssText = 'height:100%;width:30%;background:var(--primary-light);border-radius:99px;transition:width 0.4s;';
    qProgBar.appendChild(qProgFill);
    qProgress.appendChild(qProgText);
    qProgress.appendChild(qProgBar);
    pane.appendChild(qProgress);

    /* Question card */
    var qCard = document.createElement('div');
    qCard.className = 'chart-container';
    qCard.style.cssText = 'padding:16px;margin-bottom:0;';

    var qTopBar = document.createElement('div');
    qTopBar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;';
    var qTopLabel = document.createElement('div');
    qTopLabel.style.cssText = 'font-size:0.62rem;color:var(--text3);font-weight:600;';
    qTopLabel.textContent = 'Life Insurance \u00B7 M9';
    var qDiffBadge = document.createElement('div');
    qDiffBadge.style.cssText = 'font-size:0.62rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:var(--amber);border:1px solid var(--amber);border-radius:var(--radius-pill);padding:1px 8px;';
    qDiffBadge.textContent = 'Medium';
    qTopBar.appendChild(qTopLabel);
    qTopBar.appendChild(qDiffBadge);
    qCard.appendChild(qTopBar);

    var qText = document.createElement('div');
    qText.style.cssText = 'font-size:0.85rem;font-weight:600;color:var(--text);line-height:1.5;margin-bottom:16px;';
    qText.textContent = 'Which of the following is NOT a standard exclusion in a typical life insurance policy?';
    qCard.appendChild(qText);

    var qOpts = [
      { letter: 'A', text: 'Suicide within the first year' },
      { letter: 'B', text: 'Death from pre-existing conditions after 2 years', correct: true },
      { letter: 'C', text: 'Death due to war or military service' },
      { letter: 'D', text: 'Death from illegal activities' },
    ];

    var qOptsList = document.createElement('div');
    qOptsList.id = 'compassQBankOptions';
    qOptsList.style.cssText = 'display:flex;flex-direction:column;gap:8px;';

    qOpts.forEach(function(opt, i) {
      var row = document.createElement('div');
      row.id = 'compassQOpt_' + i;
      row.style.cssText = [
        'display:flex',
        'align-items:flex-start',
        'gap:10px',
        'background:var(--bg1)',
        'border:1px solid var(--border)',
        'border-radius:var(--radius-sm)',
        'padding:10px 12px',
        'cursor:pointer',
        'transition:border-color 0.2s,background 0.2s',
      ].join(';');

      var letter = document.createElement('div');
      letter.id = 'compassQLetter_' + i;
      letter.style.cssText = 'width:24px;height:24px;border-radius:50%;background:var(--bg3);border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:700;color:var(--text2);flex-shrink:0;';
      letter.textContent = opt.letter;

      var optTxt = document.createElement('span');
      optTxt.style.cssText = 'font-size:0.78rem;color:var(--text);line-height:1.4;padding-top:2px;';
      optTxt.textContent = opt.text;

      row.onmouseover = function() { if (!row.dataset.answered) row.style.borderColor = 'var(--primary-light)'; };
      row.onmouseout  = function() { if (!row.dataset.answered) row.style.borderColor = 'var(--border)'; };
      row.onclick = function() { compassSelectQBank(i, qOpts); };

      row.appendChild(letter);
      row.appendChild(optTxt);
      qOptsList.appendChild(row);
    });

    qCard.appendChild(qOptsList);

    var qExplain = document.createElement('div');
    qExplain.id = 'compassQExplain';
    qExplain.style.cssText = 'display:none;margin-top:12px;background:rgba(52,211,153,0.08);border:1px solid var(--green-bright);border-radius:var(--radius-sm);padding:12px;font-size:0.78rem;color:var(--text2);line-height:1.5;';
    qExplain.textContent = '\u2713 Correct! After the 2-year contestability period, pre-existing conditions are generally covered. The incontestability clause protects policyholders from claim denial after this period.';
    qCard.appendChild(qExplain);

    var nextQBtn = document.createElement('button');
    nextQBtn.id = 'compassNextQBtn';
    nextQBtn.style.cssText = [
      'display:none',
      'margin-top:12px',
      'background:var(--primary)',
      'border:none',
      'border-radius:var(--radius-sm)',
      'color:#fff',
      'font-size:0.78rem',
      'font-weight:700',
      'padding:8px 16px',
      'cursor:pointer',
      'transition:opacity 0.2s',
    ].join(';');
    nextQBtn.textContent = 'Next Question \u2192';
    nextQBtn.onclick = function() {
      /* In a real app this would load the next question; here we reset */
      var opts = document.getElementById('compassQBankOptions');
      var expl = document.getElementById('compassQExplain');
      var nb   = document.getElementById('compassNextQBtn');
      if (opts) {
        var rows = opts.querySelectorAll('[id^="compassQOpt_"]');
        rows.forEach(function(r) {
          delete r.dataset.answered;
          r.style.background  = 'var(--bg1)';
          r.style.borderColor = 'var(--border)';
          r.style.cursor      = 'pointer';
        });
        var letters = opts.querySelectorAll('[id^="compassQLetter_"]');
        letters.forEach(function(l) {
          l.style.background  = 'var(--bg3)';
          l.style.color       = 'var(--text2)';
          l.style.borderColor = 'var(--border)';
        });
      }
      if (expl) expl.style.display = 'none';
      if (nb)   nb.style.display   = 'none';
    };
    qCard.appendChild(nextQBtn);

    pane.appendChild(qCard);
  })();

  /* ============================================================
     PANE 6: AI ROLEPLAY
     ============================================================ */
  (function() {
    var pane = panes.roleplay;

    var heading = document.createElement('div');
    heading.className = 'demo-section-heading';
    heading.style.cssText = 'margin-top:0;margin-bottom:6px;';
    heading.textContent = 'AI Roleplay Coach';
    pane.appendChild(heading);

    /* Scenario context */
    var scenarioBox = document.createElement('div');
    scenarioBox.style.cssText = 'background:rgba(107,155,219,0.1);border:1px solid var(--primary-light);border-radius:var(--radius-sm);padding:10px 14px;margin-bottom:10px;';
    var scenarioTitle = document.createElement('div');
    scenarioTitle.style.cssText = 'font-size:0.75rem;color:var(--primary-light);font-weight:700;margin-bottom:6px;';
    scenarioTitle.textContent = 'Scenario: Mr. Tan, 38, married with 2 kids. Employed, asking about retirement planning. No existing coverage review done.';
    var scenarioMeta = document.createElement('div');
    scenarioMeta.style.cssText = 'display:flex;gap:14px;flex-wrap:wrap;';
    [
      { label: 'Difficulty', val: 'Intermediate', color: 'var(--amber)' },
      { label: 'Topic', val: 'Retirement Planning', color: 'var(--text2)' },
      { label: 'Duration', val: '~5 min', color: 'var(--text2)' },
    ].forEach(function(m) {
      var metaEl = document.createElement('div');
      metaEl.style.cssText = 'font-size:0.68rem;color:var(--text3);';
      var metaLabel = document.createElement('span');
      metaLabel.textContent = m.label + ': ';
      var metaVal = document.createElement('span');
      metaVal.style.cssText = 'font-weight:700;color:' + m.color + ';';
      metaVal.textContent = m.val;
      metaEl.appendChild(metaLabel);
      metaEl.appendChild(metaVal);
      scenarioMeta.appendChild(metaEl);
    });
    scenarioBox.appendChild(scenarioTitle);
    scenarioBox.appendChild(scenarioMeta);
    pane.appendChild(scenarioBox);

    /* Scoring rubric */
    var rubricBox = document.createElement('div');
    rubricBox.style.cssText = 'background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 14px;margin-bottom:14px;';
    var rubricTitle = document.createElement('div');
    rubricTitle.style.cssText = 'font-size:0.68rem;font-weight:700;color:var(--text3);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:8px;';
    rubricTitle.textContent = "You'll be scored on:";
    var rubricCriteria = document.createElement('div');
    rubricCriteria.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';
    ['Needs Analysis', 'Product Knowledge', 'Compliance', 'Communication'].forEach(function(c) {
      var chip = document.createElement('div');
      chip.style.cssText = 'font-size:0.68rem;font-weight:600;background:var(--bg1);border:1px solid var(--border);border-radius:var(--radius-pill);padding:3px 10px;color:var(--text2);';
      chip.textContent = c;
      rubricCriteria.appendChild(chip);
    });
    rubricBox.appendChild(rubricTitle);
    rubricBox.appendChild(rubricCriteria);
    pane.appendChild(rubricBox);

    /* Chat window */
    var chatWin = document.createElement('div');
    chatWin.id = 'cpRoleplayChatWin';
    chatWin.style.cssText = 'background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;margin-bottom:12px;min-height:100px;';

    /* Client avatar row */
    var clientRow = document.createElement('div');
    clientRow.style.cssText = 'display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;';

    var avatar = document.createElement('div');
    avatar.style.cssText = 'width:34px;height:34px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:700;color:#fff;flex-shrink:0;';
    avatar.textContent = 'T';

    var clientMsgWrap = document.createElement('div');
    var clientName = document.createElement('div');
    clientName.style.cssText = 'font-size:0.65rem;color:var(--text3);margin-bottom:4px;font-weight:600;';
    clientName.textContent = 'Mr. Tan (Client)';

    var clientBubble = document.createElement('div');
    clientBubble.style.cssText = 'background:var(--bg1);border-radius:0 8px 8px 8px;padding:10px 12px;font-size:0.78rem;color:var(--text);line-height:1.5;max-width:85%;';
    clientBubble.textContent = "I'm 38 years old and honestly I haven't done any proper financial planning. My wife and I are both working but we're worried \u2014 if something happens to me, will my family be okay? We have two kids in primary school.";

    clientMsgWrap.appendChild(clientName);
    clientMsgWrap.appendChild(clientBubble);
    clientRow.appendChild(avatar);
    clientRow.appendChild(clientMsgWrap);
    chatWin.appendChild(clientRow);
    pane.appendChild(chatWin);

    /* Response options */
    var responseLabel = document.createElement('div');
    responseLabel.id = 'cpRoleplayRespLabel';
    responseLabel.style.cssText = 'font-size:0.75rem;color:var(--text2);font-weight:600;margin-bottom:8px;';
    responseLabel.textContent = 'Choose your response as the advisor:';
    pane.appendChild(responseLabel);

    var optionsList = document.createElement('div');
    optionsList.id = 'cpRoleplayOptions';
    optionsList.style.cssText = 'display:flex;flex-direction:column;gap:8px;margin-bottom:12px;';

    var roleplayOpts = [
      { text: "Mr. Tan, I totally understand your concern. Before I recommend anything, I'd like to understand your full picture \u2014 your income, existing protection, and what your goals are for the family. May I ask a few questions?", score: 9, good: true, feedback: 'Excellent needs-based approach. You\'re showing empathy and following MAS FAA suitability guidelines by gathering information before recommending. Score: 9/10 \u2014 Strong opening, builds trust.' },
      { text: "You need term life insurance immediately. At 38 with two kids, you should have at least $1M coverage. Let me prepare a quote.", score: 5, good: false, feedback: 'Product-first approach without needs analysis is a compliance risk. You haven\'t confirmed his existing coverage, income, or liabilities. Score: 5/10 \u2014 Right instinct, wrong process.' },
      { text: "Don\u2019t worry, I\u2019ll take care of everything. Just tell me your monthly budget and I\u2019ll find something suitable.", score: 3, good: false, feedback: 'Overly casual and skips the fact-find entirely. \u201cJust tell me your budget\u201d implies budget-fitting rather than needs-based planning. Non-compliant with suitability requirements. Score: 3/10.' },
    ];

    roleplayOpts.forEach(function(opt, i) {
      var btn = document.createElement('button');
      btn.style.cssText = [
        'background:var(--bg3)',
        'border:1px solid var(--border)',
        'border-radius:var(--radius-sm)',
        'color:var(--text)',
        'font-size:0.75rem',
        'padding:10px 12px',
        'text-align:left',
        'cursor:pointer',
        'line-height:1.4',
        'transition:border-color 0.2s,background 0.2s',
      ].join(';');
      btn.textContent = 'Option ' + (i + 1) + ': ' + opt.text;
      btn.onmouseover = function() { this.style.borderColor = 'var(--primary-light)'; };
      btn.onmouseout  = function() { this.style.borderColor = 'var(--border)'; };
      btn.onclick = (function(o) {
        return function() { compassRoleplaySelect(o); };
      })(opt);
      optionsList.appendChild(btn);
    });

    pane.appendChild(optionsList);

    /* AI feedback area */
    var feedback = document.createElement('div');
    feedback.id = 'cpRoleplayFeedback';
    feedback.style.display = 'none';
    pane.appendChild(feedback);
  })();

  /* ============================================================
     PANE 7: VIDEO LECTURES
     ============================================================ */
  (function() {
    var pane = panes.videos;

    var heading = document.createElement('div');
    heading.className = 'demo-section-heading';
    heading.style.cssText = 'margin-top:0;margin-bottom:10px;';
    heading.textContent = 'Video Lectures';
    pane.appendChild(heading);

    /* Total stats bar */
    var videoStatsBar = document.createElement('div');
    videoStatsBar.style.cssText = 'display:flex;gap:16px;flex-wrap:wrap;background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 14px;margin-bottom:14px;';
    [
      { val: '48', label: 'Lectures', color: 'var(--text)' },
      { val: '12h 30m', label: 'Total', color: 'var(--text)' },
      { val: '8', label: 'Completed', color: 'var(--green-bright)' },
      { val: '40', label: 'Remaining', color: 'var(--amber)' },
    ].forEach(function(vs) {
      var vsi = document.createElement('div');
      vsi.style.cssText = 'display:flex;flex-direction:column;';
      var vsv = document.createElement('div');
      vsv.style.cssText = 'font-size:1rem;font-weight:800;color:' + vs.color + ';line-height:1;';
      vsv.textContent = vs.val;
      var vsl = document.createElement('div');
      vsl.style.cssText = 'font-size:0.62rem;color:var(--text3);margin-top:3px;';
      vsl.textContent = vs.label;
      vsi.appendChild(vsv);
      vsi.appendChild(vsl);
      videoStatsBar.appendChild(vsi);
    });
    pane.appendChild(videoStatsBar);

    var lectures = [
      { title: 'Understanding Whole Life Insurance', instructor: 'Daniel Ng, CFP', duration: '12:30', watched: 100, notes: 3 },
      { title: 'CPF & Retirement Planning',          instructor: 'Sarah Lim, FA',  duration: '18:45', watched: 65,  notes: 5 },
      { title: 'Objection Handling Masterclass',      instructor: 'Marcus Tan',    duration: '24:12', watched: 30,  notes: 1 },
      { title: 'First Client Meeting Framework',      instructor: 'Sarah Lim, FA', duration: '09:58', watched: 0,   notes: 0 },
      { title: 'Investment Products Deep Dive',       instructor: 'Daniel Ng, CFP',duration: '21:05', watched: 0,   notes: 0 },
      { title: 'Compliance & Ethics (MAS FAA)',        instructor: 'Rachel Chua',  duration: '15:40', watched: 0,   notes: 0 },
    ];

    var videoGrid = document.createElement('div');
    videoGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-bottom:20px;';

    lectures.forEach(function(lec, i) {
      var card = document.createElement('div');
      card.style.cssText = 'background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;cursor:pointer;transition:border-color 0.2s;';
      card.onmouseover = function() { card.style.borderColor = 'var(--primary-light)'; };
      card.onmouseout  = function() { card.style.borderColor = 'var(--border)'; };

      /* Thumbnail */
      var thumb = document.createElement('div');
      thumb.style.cssText = 'background:var(--bg1);height:100px;display:flex;align-items:center;justify-content:center;position:relative;';
      var playBtn = document.createElement('div');
      playBtn.style.cssText = 'width:36px;height:36px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;';
      playBtn.innerHTML = '<svg width="12" height="14" viewBox="0 0 12 14" fill="none"><path d="M1 1L11 7L1 13V1Z" fill="#fff"/></svg>';
      var durBadge = document.createElement('div');
      durBadge.style.cssText = 'position:absolute;bottom:6px;right:8px;background:rgba(0,0,0,0.7);color:#fff;font-size:0.62rem;font-weight:700;padding:2px 6px;border-radius:3px;';
      durBadge.textContent = lec.duration;
      thumb.appendChild(playBtn);
      thumb.appendChild(durBadge);

      /* Video info */
      var info = document.createElement('div');
      info.style.cssText = 'padding:10px 12px 12px;';

      var vtitle = document.createElement('div');
      vtitle.style.cssText = 'font-size:0.78rem;font-weight:600;color:var(--text);line-height:1.3;margin-bottom:3px;';
      vtitle.textContent = lec.title;

      var vinstructor = document.createElement('div');
      vinstructor.style.cssText = 'font-size:0.65rem;color:var(--text3);margin-bottom:8px;';
      vinstructor.textContent = lec.instructor;

      /* Progress bar */
      var vpWrap = document.createElement('div');
      vpWrap.style.cssText = 'background:var(--bg1);border-radius:99px;height:4px;margin-bottom:6px;overflow:hidden;';
      var vpFill = document.createElement('div');
      var vpColor = lec.watched === 100 ? 'var(--green-bright)' : lec.watched > 0 ? 'var(--primary-light)' : 'var(--border)';
      vpFill.style.cssText = 'height:100%;width:' + lec.watched + '%;background:' + vpColor + ';border-radius:99px;';
      vpWrap.appendChild(vpFill);

      var vMeta = document.createElement('div');
      vMeta.style.cssText = 'display:flex;align-items:center;justify-content:space-between;font-size:0.65rem;color:var(--text3);';
      var vWatched = document.createElement('span');
      vWatched.textContent = lec.watched === 100 ? '\u2713 Completed' : lec.watched + '% watched';
      if (lec.watched === 100) vWatched.style.color = 'var(--green-bright)';
      var vNotes = document.createElement('span');
      vNotes.textContent = lec.notes > 0 ? '\uD83D\uDCDD ' + lec.notes + ' notes' : '';
      vMeta.appendChild(vWatched);
      vMeta.appendChild(vNotes);

      info.appendChild(vtitle);
      info.appendChild(vinstructor);
      info.appendChild(vpWrap);
      info.appendChild(vMeta);

      card.appendChild(thumb);
      card.appendChild(info);
      videoGrid.appendChild(card);
    });

    pane.appendChild(videoGrid);

    /* AI Summary section */
    var aiSummary = document.createElement('div');
    aiSummary.className = 'chart-container';
    aiSummary.style.cssText = 'padding:14px;margin-bottom:0;';

    var aiTitle = document.createElement('div');
    aiTitle.style.cssText = 'font-size:0.7rem;color:var(--purple);font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:10px;display:flex;align-items:center;gap:6px;';
    aiTitle.innerHTML = '<span style="font-size:0.85rem;">\u2728</span> AI Summary \u2014 CPF & Retirement Planning';
    aiSummary.appendChild(aiTitle);

    var summaryPoints = [
      'CPF Life provides a lifelong monthly payout from age 65. There are three plans (Basic, Standard, Escalating) \u2014 choosing depends on your client\u2019s need for legacy vs income certainty.',
      'The Full Retirement Sum (FRS) for 2025 is $205,800. Clients who top up early benefit from compounding at 4\u20136% p.a. on their SA/RA balances.',
      'Private annuities complement CPF Life for clients above the FRS, offering additional guaranteed income, critical illness riders, and more flexible payout structures.',
    ];

    summaryPoints.forEach(function(pt) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid var(--bg1);font-size:0.76rem;color:var(--text2);line-height:1.5;';
      var bullet = document.createElement('div');
      bullet.style.cssText = 'width:6px;height:6px;border-radius:50%;background:var(--purple);flex-shrink:0;margin-top:6px;';
      var ptText = document.createElement('span');
      ptText.textContent = pt;
      row.appendChild(bullet);
      row.appendChild(ptText);
      aiSummary.appendChild(row);
    });

    pane.appendChild(aiSummary);
  })();

  /* ---- Activate first tab ---- */
  compassTab('track');
};

/* ---- Compass helpers (global) ---- */
function compassTab(id) {
  var subtabs = ['track', 'products', 'cards', 'scripts', 'qbank', 'roleplay', 'videos'];
  subtabs.forEach(function(st) {
    var pane = document.getElementById('cpPane_' + st);
    var btn  = document.getElementById('cpTab_' + st);
    if (!pane || !btn) return;
    var active = st === id;
    pane.style.display = active ? 'block' : 'none';
    btn.style.color       = active ? 'var(--primary-light)' : 'var(--text3)';
    btn.style.borderColor = active ? 'var(--primary-light)' : 'transparent';
  });
}

function compassScriptTab(idx, total) {
  for (var i = 0; i < total; i++) {
    var sp = document.getElementById('cpScriptPane_' + i);
    var sb = document.getElementById('cpScriptTab_' + i);
    if (!sp || !sb) continue;
    var active = i === idx;
    sp.style.display    = active ? 'block' : 'none';
    sb.style.background = active ? 'var(--primary)' : 'var(--bg3)';
    sb.style.borderColor= active ? 'var(--primary-light)' : 'var(--border)';
    sb.style.color      = active ? '#fff' : 'var(--text3)';
  }
}

function compassSelectQBank(idx, opts) {
  var optsList    = document.getElementById('compassQBankOptions');
  var explanation = document.getElementById('compassQExplain');
  if (!optsList) return;

  var rows = optsList.querySelectorAll('[id^="compassQOpt_"]');
  if (rows[0] && rows[0].dataset.answered) return;

  var correctIdx = opts.findIndex(function(o) { return o.correct; });

  rows.forEach(function(row, i) {
    row.dataset.answered = '1';
    row.style.cursor = 'default';
    row.onmouseover = null;
    row.onmouseout  = null;
    row.onclick     = null;

    var letter = document.getElementById('compassQLetter_' + i);

    if (i === correctIdx) {
      row.style.background  = 'rgba(52,211,153,0.1)';
      row.style.borderColor = 'var(--green-bright)';
      if (letter) { letter.style.background = 'var(--green-bright)'; letter.style.color = '#0a0f1a'; letter.style.borderColor = 'var(--green-bright)'; }
    } else if (i === idx && idx !== correctIdx) {
      row.style.background  = 'rgba(239,68,68,0.1)';
      row.style.borderColor = 'var(--red)';
      if (letter) { letter.style.background = 'var(--red)'; letter.style.color = '#fff'; letter.style.borderColor = 'var(--red)'; }
    }
  });

  if (explanation) {
    if (idx === correctIdx) {
      explanation.style.display = 'block';
    } else {
      explanation.style.background = 'rgba(239,68,68,0.08)';
      explanation.style.borderColor = 'var(--red)';
      explanation.style.color = 'var(--text2)';
      explanation.textContent = '\u2717 Incorrect. The correct answer is B. After the 2-year contestability period, pre-existing conditions are generally covered. The incontestability clause protects policyholders from claim denial after this window.';
      explanation.style.display = 'block';
    }
  }
  var nextQBtn = document.getElementById('compassNextQBtn');
  if (nextQBtn) nextQBtn.style.display = 'block';
}

function compassRoleplaySelect(opt) {
  var optionsList   = document.getElementById('cpRoleplayOptions');
  var responseLabel = document.getElementById('cpRoleplayRespLabel');
  var chatWin       = document.getElementById('cpRoleplayChatWin');
  var feedbackEl    = document.getElementById('cpRoleplayFeedback');
  if (!optionsList) return;

  /* Advisor bubble */
  var advRow = document.createElement('div');
  advRow.style.cssText = 'display:flex;flex-direction:column;align-items:flex-end;margin-top:10px;';

  var advLabel = document.createElement('div');
  advLabel.style.cssText = 'font-size:0.65rem;color:var(--text3);margin-bottom:4px;font-weight:600;';
  advLabel.textContent = 'You (Advisor)';

  var advBubble = document.createElement('div');
  advBubble.style.cssText = 'background:var(--primary);border-radius:8px 0 8px 8px;padding:10px 12px;font-size:0.78rem;color:#fff;line-height:1.5;max-width:85%;';
  advBubble.textContent = opt.text;

  advRow.appendChild(advLabel);
  advRow.appendChild(advBubble);
  if (chatWin) chatWin.appendChild(advRow);

  /* Hide options */
  optionsList.style.display = 'none';
  if (responseLabel) responseLabel.style.display = 'none';

  /* AI feedback */
  if (feedbackEl) {
    var isGood = opt.good;
    feedbackEl.style.cssText = [
      'display:block',
      'padding:12px 14px',
      'border-radius:var(--radius-sm)',
      'font-size:0.78rem',
      'line-height:1.6',
      'background:' + (isGood ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.1)'),
      'border:1px solid ' + (isGood ? 'var(--green-bright)' : 'var(--amber)'),
      'color:' + (isGood ? 'var(--green-bright)' : 'var(--amber)'),
    ].join(';');

    var scoreEl = document.createElement('div');
    scoreEl.style.cssText = 'font-weight:800;font-size:0.9rem;margin-bottom:6px;';
    scoreEl.textContent = (isGood ? '\u2713' : '\u26A0') + ' Score: ' + opt.score + '/10';

    var fbText = document.createElement('div');
    fbText.style.cssText = 'color:var(--text2);font-size:0.76rem;line-height:1.5;';
    fbText.textContent = opt.feedback;

    feedbackEl.innerHTML = '';
    feedbackEl.appendChild(scoreEl);
    feedbackEl.appendChild(fbText);
  }
}

/* Legacy stubs kept for safety (no longer called) */
function toggleModule() {}
function selectChatOption() {}
function selectExam() {}

/* ============================================================
   AD LAUNCHPAD DEMO — Agency Launchpad 90 full platform
   ============================================================ */

/* ---------- shared state ---------- */
window._lpTab = window._lpTab || 'wizard';
window._wizardStep = window._wizardStep || 0;
window._wizardData = window._wizardData || {
  template: null,
  headline: "Protect Your Family's Future Today",
  text: "As a parent, your family's financial security matters most. Get a free consultation with a certified financial advisor.",
  cta: "Learn More",
  pageName: "Financial Advisory",
  ageMin: 25, ageMax: 54,
  gender: 'all',
  locations: ['Singapore'],
  interests: ['Insurance', 'Retirement'],
  advantagePlus: true,
  budget: 30,
  startDate: '2026-04-07',
  endDate: '2026-04-21',
  bidStrategy: 'Lowest Cost'
};
window._leadStatuses = window._leadStatuses || [
  'New','New','Contacted','Qualified','Converted','New','Contacted','Lost'
];

/* ---------- helper: make element ---------- */
function _lp_el(tag, style, text) {
  var el = document.createElement(tag);
  if (style) el.style.cssText = style;
  if (text !== undefined) el.textContent = text;
  return el;
}

/* ---------- helper: show toast ---------- */
function _lp_toast(msg) {
  var t = _lp_el('div',
    'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);' +
    'background:#1e293b;border:1px solid rgba(59,130,246,0.4);color:#fff;' +
    'padding:10px 20px;border-radius:8px;font-size:13px;z-index:9999;' +
    'box-shadow:0 4px 20px rgba(0,0,0,0.5);transition:opacity .3s;',
    msg);
  document.body.appendChild(t);
  setTimeout(function() { t.style.opacity = '0'; setTimeout(function() { if (t.parentNode) t.parentNode.removeChild(t); }, 300); }, 2400);
}

/* ---------- tab switcher (global so onclick can call it) ---------- */
window.launchpadTab = function(id) {
  window._lpTab = id;
  var tabs = document.querySelectorAll('.lp-tab-btn');
  tabs.forEach(function(btn) {
    var active = btn.getAttribute('data-tab') === id;
    btn.style.cssText = _lpTabBtnStyle(active);
  });
  var panels = document.querySelectorAll('.lp-tab-panel');
  panels.forEach(function(p) {
    p.style.display = p.getAttribute('data-panel') === id ? 'block' : 'none';
  });
};

function _lpTabBtnStyle(active) {
  return 'padding:8px 18px;border-radius:8px;border:1px solid;cursor:pointer;font-size:13px;font-weight:600;transition:all .15s;' +
    (active
      ? 'background:rgba(59,130,246,0.2);border-color:var(--blue-bright,#3b82f6);color:#fff;'
      : 'background:transparent;border-color:rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);');
}

DEMO_RENDERERS.launchpad = function(container) {
  container.innerHTML = '';

  var wrap = _lp_el('div', 'max-width:900px;margin:0 auto;padding:20px 16px;font-family:inherit;');

  /* ---- Tab bar ---- */
  var tabBar = _lp_el('div', 'display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;');
  var tabDefs = [
    { id: 'wizard',    label: 'Campaign Wizard' },
    { id: 'dashboard', label: 'Agency Dashboard' },
    { id: 'blueprints',label: 'Blueprint Library' },
    { id: 'leads',     label: 'Lead Management' },
    { id: 'preview',   label: 'Ad Preview Studio' },
  ];
  tabDefs.forEach(function(td) {
    var btn = _lp_el('button', _lpTabBtnStyle(window._lpTab === td.id), td.label);
    btn.setAttribute('data-tab', td.id);
    btn.className = 'lp-tab-btn';
    btn.onclick = function() { launchpadTab(td.id); };
    tabBar.appendChild(btn);
  });
  wrap.appendChild(tabBar);

  /* ============================================================
     TAB 1: CAMPAIGN WIZARD
  ============================================================ */
  var wizPanel = _lp_el('div');
  wizPanel.setAttribute('data-panel', 'wizard');
  wizPanel.className = 'lp-tab-panel';
  wizPanel.style.display = window._lpTab === 'wizard' ? 'block' : 'none';

  var stepLabels = ['Template', 'Ad Copy', 'Audience', 'Budget', 'Review'];

  // Wrapper
  var wrap = document.createElement('div');
  wrap.id = 'launchpadWizard';
  wrap.style.cssText = 'max-width:780px;margin:0 auto;padding:24px 16px;font-family:inherit;';

  // ---- Progress bar ----
  var progressBar = document.createElement('div');
  progressBar.style.cssText = 'display:flex;flex-direction:column;align-items:center;margin-bottom:28px;';

  var dotsRow = document.createElement('div');
  dotsRow.style.cssText = 'display:flex;align-items:center;width:100%;max-width:520px;';

  var labelsRow = document.createElement('div');
  labelsRow.style.cssText = 'display:flex;justify-content:space-between;width:100%;max-width:520px;margin-top:8px;';

  stepLabels.forEach(function(label, i) {
    var dot = _lp_el('div');
    dot.style.cssText = 'width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;transition:all .2s;' +
      (i < window._wizardStep
        ? 'background:var(--green-bright,#34d399);color:#0a0f1a;border:2px solid var(--green-bright,#34d399);'
        : i === window._wizardStep
          ? 'background:var(--blue-bright,#3b82f6);color:#fff;border:2px solid var(--blue-bright,#3b82f6);box-shadow:0 0 0 4px rgba(59,130,246,0.2);'
          : 'background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);border:2px solid rgba(255,255,255,0.12);');
    dot.textContent = i < window._wizardStep ? '\u2713' : (i + 1);
    dotsRow.appendChild(dot);
    if (i < stepLabels.length - 1) {
      var line = _lp_el('div', 'flex:1;height:2px;' + (i < window._wizardStep ? 'background:var(--green-bright,#34d399);' : 'background:rgba(255,255,255,0.1);'));
      dotsRow.appendChild(line);
    }
    var lbl = _lp_el('div', 'font-size:11px;text-align:center;' +
      (i === window._wizardStep ? 'color:var(--blue-bright,#3b82f6);font-weight:600;' : i < window._wizardStep ? 'color:var(--green-bright,#34d399);' : 'color:rgba(255,255,255,0.35);'), label);
    labelsRow.appendChild(lbl);
  });

  progressBar.appendChild(dotsRow);
  progressBar.appendChild(labelsRow);

  // Step counter "Step X of 5"
  var stepCounter = _lp_el('div',
    'font-size:12px;color:rgba(255,255,255,0.35);margin-top:10px;letter-spacing:0.04em;',
    'Step ' + (window._wizardStep + 1) + ' of 5 \u2014 ' + stepLabels[window._wizardStep]);
  progressBar.appendChild(stepCounter);

  wizPanel.appendChild(progressBar);

  // ---- Step content ----
  var stepContent = _lp_el('div', 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;min-height:320px;');
  stepContent.id = 'launchpadStepContent';
  wizPanel.appendChild(stepContent);

  // ---- Nav row ----
  var navRow = _lp_el('div', 'display:flex;justify-content:space-between;align-items:center;margin-top:20px;');
  var backBtn = _lp_el('button', 'padding:10px 24px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.7);cursor:pointer;font-size:14px;display:' + (window._wizardStep === 0 ? 'none' : 'block') + ';', '\u2190 Back');
  backBtn.id = 'wizardBackBtn';
  backBtn.onclick = function() { wizardBack(); };
  var nextBtn = _lp_el('button',
    'padding:10px 28px;border-radius:8px;border:none;cursor:pointer;font-size:14px;font-weight:600;transition:all .2s;' +
    (window._wizardStep === 4 ? 'background:var(--green-bright,#34d399);color:#0a0f1a;' : 'background:var(--blue-bright,#3b82f6);color:#fff;'),
    window._wizardStep === 4 ? 'Launch Campaign (Paused)' : 'Next \u2192');
  nextBtn.id = 'wizardNextBtn';
  nextBtn.onclick = function() { wizardNext(); };
  navRow.appendChild(backBtn);
  navRow.appendChild(nextBtn);
  wizPanel.appendChild(navRow);
  wrap.appendChild(wizPanel);

  /* ============================================================
     TAB 2: AGENCY DASHBOARD
  ============================================================ */
  var dashPanel = _lp_el('div');
  dashPanel.setAttribute('data-panel', 'dashboard');
  dashPanel.className = 'lp-tab-panel';
  dashPanel.style.display = window._lpTab === 'dashboard' ? 'block' : 'none';

  // Date range selector
  var dateRangeRow = _lp_el('div', 'display:flex;gap:8px;margin-bottom:20px;align-items:center;');
  dateRangeRow.appendChild(_lp_el('span', 'font-size:12px;color:rgba(255,255,255,0.4);margin-right:4px;', 'Period:'));
  var dateRanges = ['7 Days', '30 Days', '90 Days'];
  if (!window._lpDashRange) window._lpDashRange = '30 Days';
  dateRanges.forEach(function(r) {
    var active = window._lpDashRange === r;
    var btn = _lp_el('button',
      'padding:5px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid;transition:all .15s;' +
      (active ? 'background:rgba(59,130,246,0.2);border-color:var(--blue-bright,#3b82f6);color:#3b82f6;' : 'background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.12);color:rgba(255,255,255,0.5);'),
      r);
    btn.onclick = function() {
      window._lpDashRange = r;
      launchpadTab('dashboard');
    };
    dateRangeRow.appendChild(btn);
  });
  dashPanel.appendChild(dateRangeRow);

  var dashMetrics = [
    { label: 'Total Spend',       value: '$4,280',  color: '#3b82f6' },
    { label: 'Total Leads',       value: '142',     color: '#34d399' },
    { label: 'Avg CPL',           value: '$30.14',  color: '#f59e0b' },
    { label: 'CTR',               value: '2.8%',    color: '#a78bfa' },
    { label: 'Active Campaigns',  value: '5',       color: '#34d399' },
    { label: 'ROAS',              value: '3.2x',    color: '#f59e0b' },
    { label: 'Total ROI',         value: '+218%',   color: '#34d399' },
  ];
  var dashGrid = _lp_el('div', 'display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px;');
  dashMetrics.forEach(function(m) {
    var card = _lp_el('div', 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;');
    card.appendChild(_lp_el('div', 'font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;', m.label));
    card.appendChild(_lp_el('div', 'font-size:24px;font-weight:700;color:' + m.color + ';', m.value));
    dashGrid.appendChild(card);
  });
  dashPanel.appendChild(dashGrid);

  // Campaign table
  dashPanel.appendChild(_lp_el('div', 'font-size:12px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;', 'Campaign Performance'));
  var tbl = _lp_el('div', 'background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden;');
  var tblHead = _lp_el('div', 'display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr 1fr;padding:10px 16px;background:rgba(255,255,255,0.05);font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;gap:8px;');
  ['Campaign','Status','Budget','Spend','Leads','CPL'].forEach(function(h) {
    tblHead.appendChild(_lp_el('div', '', h));
  });
  tbl.appendChild(tblHead);

  var campaigns = [
    { name:'Retirement Planning',  status:'active',    budget:'$50/d', spend:'$1,820', leads:54,  cpl:33.70, target:35 },
    { name:'Health Shield Promo',  status:'active',    budget:'$40/d', spend:'$1,120', leads:38,  cpl:29.47, target:35 },
    { name:'Seminar Registration', status:'learning',  budget:'$30/d', spend:'$690',   leads:23,  cpl:30.00, target:35 },
    { name:'Brand Story Q2',       status:'paused',    budget:'$25/d', spend:'$450',   leads:15,  cpl:30.00, target:35 },
    { name:'Insurance Retarget',   status:'active',    budget:'$20/d', spend:'$200',   leads:12,  cpl:16.67, target:25 },
    { name:'Year-End Promo',       status:'completed', budget:'$60/d', spend:'$2,100', leads:68,  cpl:30.88, target:35 },
    { name:'Wealth Planning Q1',   status:'learning',  budget:'$35/d', spend:'$310',   leads:9,   cpl:34.44, target:35 },
  ];
  var statusStyles = {
    'active':    { bg:'rgba(52,211,153,0.15)',  color:'#34d399' },
    'paused':    { bg:'rgba(245,158,11,0.15)',  color:'#f59e0b' },
    'completed': { bg:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.45)' },
    'learning':  { bg:'rgba(59,130,246,0.15)',  color:'#3b82f6' },
  };
  campaigns.forEach(function(c, i) {
    var cplColor = c.cpl < c.target * 0.9 ? '#34d399' : c.cpl > c.target ? '#ef4444' : '#f59e0b';
    var row = _lp_el('div',
      'display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr 1fr;padding:12px 16px;gap:8px;align-items:center;font-size:13px;' +
      (i % 2 === 1 ? 'background:rgba(255,255,255,0.02);' : '') +
      'border-top:1px solid rgba(255,255,255,0.05);');
    row.appendChild(_lp_el('div', 'color:#fff;font-weight:500;', c.name));
    var ss = statusStyles[c.status] || statusStyles['completed'];
    var badge = _lp_el('div',
      'display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:' + ss.bg + ';color:' + ss.color + ';',
      c.status.charAt(0).toUpperCase() + c.status.slice(1));
    row.appendChild(badge);
    row.appendChild(_lp_el('div', 'color:rgba(255,255,255,0.6);', c.budget));
    row.appendChild(_lp_el('div', 'color:rgba(255,255,255,0.6);', c.spend));
    row.appendChild(_lp_el('div', 'color:rgba(255,255,255,0.6);', c.leads));
    row.appendChild(_lp_el('div', 'font-weight:700;color:' + cplColor + ';', '$' + c.cpl.toFixed(2)));
    tbl.appendChild(row);
  });
  dashPanel.appendChild(tbl);
  wrap.appendChild(dashPanel);

  /* ============================================================
     TAB 3: BLUEPRINT LIBRARY
  ============================================================ */
  var bpPanel = _lp_el('div');
  bpPanel.setAttribute('data-panel', 'blueprints');
  bpPanel.className = 'lp-tab-panel';
  bpPanel.style.display = window._lpTab === 'blueprints' ? 'block' : 'none';

  bpPanel.appendChild(_lp_el('div', 'font-size:18px;font-weight:700;color:#fff;margin-bottom:6px;', 'Blueprint Library'));
  bpPanel.appendChild(_lp_el('div', 'font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:16px;', 'Pre-built campaign templates. Assign to any client in one click.'));

  // Filter row
  if (!window._lpBpFilter) window._lpBpFilter = 'All';
  var bpFilterRow = _lp_el('div', 'display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;');
  ['All', 'Lead Gen', 'Awareness', 'Events'].forEach(function(f) {
    var active = window._lpBpFilter === f;
    var fb = _lp_el('button',
      'padding:5px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid;transition:all .15s;' +
      (active ? 'background:rgba(59,130,246,0.2);border-color:var(--blue-bright,#3b82f6);color:#3b82f6;' : 'background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.12);color:rgba(255,255,255,0.5);'),
      f);
    fb.onclick = function() { window._lpBpFilter = f; launchpadTab('blueprints'); };
    bpFilterRow.appendChild(fb);
  });
  bpPanel.appendChild(bpFilterRow);

  var blueprints = [
    { icon: '\ud83d\udcca', name: 'Insurance Lead Gen',   cat: 'Lead Gen',   catColor: '#3b82f6', budget: '$30/day', clients: 12, created: 'Jan 2026', launched: 34, successRate: 84 },
    { icon: '\ud83c\udf93', name: 'Seminar Registration', cat: 'Events',     catColor: '#f59e0b', budget: '$25/day', clients: 8,  created: 'Feb 2026', launched: 19, successRate: 72 },
    { icon: '\ud83c\udf1f', name: 'Brand Story',          cat: 'Awareness',  catColor: '#a78bfa', budget: '$20/day', clients: 15, created: 'Dec 2025', launched: 42, successRate: 79 },
    { icon: '\ud83c\udfe6', name: 'Retirement Planning',  cat: 'Lead Gen',   catColor: '#3b82f6', budget: '$40/day', clients: 11, created: 'Jan 2026', launched: 28, successRate: 88 },
    { icon: '\ud83d\udee1\ufe0f', name: 'Health Shield Promo',  cat: 'Lead Gen',   catColor: '#3b82f6', budget: '$35/day', clients: 7,  created: 'Mar 2026', launched: 14, successRate: 77 },
    { icon: '\ud83d\udcc5', name: 'Year-End Campaign',    cat: 'Awareness',  catColor: '#a78bfa', budget: '$50/day', clients: 5,  created: 'Nov 2025', launched: 11, successRate: 91 },
  ];
  var bpFiltered = blueprints.filter(function(bp) {
    if (window._lpBpFilter === 'All') return true;
    if (window._lpBpFilter === 'Events') return bp.cat === 'Events';
    return bp.cat === window._lpBpFilter;
  });
  var bpGrid = _lp_el('div', 'display:grid;grid-template-columns:repeat(3,1fr);gap:16px;');
  bpFiltered.forEach(function(bp) {
    var card = _lp_el('div', 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:12px;transition:border-color .15s;');
    card.onmouseenter = function() { card.style.borderColor = 'rgba(59,130,246,0.4)'; };
    card.onmouseleave = function() { card.style.borderColor = 'rgba(255,255,255,0.08)'; };
    var top = _lp_el('div', 'display:flex;align-items:center;gap:12px;');
    top.appendChild(_lp_el('div', 'font-size:28px;line-height:1;', bp.icon));
    var info = _lp_el('div');
    info.appendChild(_lp_el('div', 'font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;', bp.name));
    info.appendChild(_lp_el('span',
      'font-size:11px;font-weight:600;padding:2px 8px;border-radius:4px;background:' + bp.catColor + '22;color:' + bp.catColor + ';',
      bp.cat));
    top.appendChild(info);
    card.appendChild(top);
    // Stats row: created date, campaigns launched, success rate
    var stats = _lp_el('div', 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;');
    var statItems = [
      { label: 'Created', value: bp.created },
      { label: 'Launched', value: bp.launched + ' campaigns' },
      { label: 'Success', value: bp.successRate + '%' },
    ];
    statItems.forEach(function(s) {
      var st = _lp_el('div', 'background:rgba(255,255,255,0.03);border-radius:6px;padding:6px 8px;');
      st.appendChild(_lp_el('div', 'font-size:10px;color:rgba(255,255,255,0.3);margin-bottom:2px;', s.label));
      st.appendChild(_lp_el('div', 'font-size:12px;font-weight:600;color:rgba(255,255,255,0.75);', s.value));
      stats.appendChild(st);
    });
    card.appendChild(stats);
    var meta = _lp_el('div', 'display:flex;justify-content:space-between;font-size:12px;color:rgba(255,255,255,0.45);');
    meta.appendChild(_lp_el('span', '', 'Default: ' + bp.budget));
    meta.appendChild(_lp_el('span', '', bp.clients + ' clients'));
    card.appendChild(meta);
    var assignBtn = _lp_el('button',
      'width:100%;padding:8px;border-radius:8px;border:1px solid rgba(59,130,246,0.3);background:rgba(59,130,246,0.1);color:#3b82f6;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;',
      'Assign to Client');
    assignBtn.onmouseenter = function() { assignBtn.style.background = 'rgba(59,130,246,0.2)'; };
    assignBtn.onmouseleave = function() { assignBtn.style.background = 'rgba(59,130,246,0.1)'; };
    assignBtn.onclick = function() { _lp_toast(bp.name + ' blueprint assigned to client successfully.'); };
    card.appendChild(assignBtn);
    bpGrid.appendChild(card);
  });
  bpPanel.appendChild(bpGrid);
  wrap.appendChild(bpPanel);

  /* ============================================================
     TAB 4: LEAD MANAGEMENT
  ============================================================ */
  var leadPanel = _lp_el('div');
  leadPanel.setAttribute('data-panel', 'leads');
  leadPanel.className = 'lp-tab-panel';
  leadPanel.style.display = window._lpTab === 'leads' ? 'block' : 'none';

  // Top bar: summary + Export CSV button
  var leadTopBar = _lp_el('div', 'display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;');
  var summaryBar = _lp_el('div',
    'display:flex;gap:24px;padding:10px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;font-size:13px;color:rgba(255,255,255,0.6);flex-wrap:wrap;align-items:center;');
  ['142 leads','38 qualified','12 converted','$30.14 avg CPL'].forEach(function(s, i) {
    if (i > 0) summaryBar.appendChild(_lp_el('span', 'color:rgba(255,255,255,0.15);', '|'));
    summaryBar.appendChild(_lp_el('span', 'color:#fff;font-weight:600;', s));
  });
  leadTopBar.appendChild(summaryBar);
  var exportBtn = _lp_el('button',
    'padding:8px 16px;border-radius:8px;border:1px solid rgba(52,211,153,0.3);background:rgba(52,211,153,0.1);color:#34d399;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;white-space:nowrap;',
    '↓ Export CSV');
  exportBtn.onmouseenter = function() { exportBtn.style.background = 'rgba(52,211,153,0.2)'; };
  exportBtn.onmouseleave = function() { exportBtn.style.background = 'rgba(52,211,153,0.1)'; };
  exportBtn.onclick = function() { _lp_toast('142 leads exported to leads_export_2026-04-02.csv'); };
  leadTopBar.appendChild(exportBtn);
  leadPanel.appendChild(leadTopBar);

  // Pipeline value
  leadPanel.appendChild(_lp_el('div',
    'font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:16px;',
    'Estimated pipeline value: \u0024' + '42,600'));

  // Table header
  var ltWrap = _lp_el('div', 'background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden;');
  var ltHead = _lp_el('div',
    'display:grid;grid-template-columns:1.5fr 2fr 1.4fr 1.6fr 0.9fr 1fr 1.2fr 1fr;' +
    'padding:10px 16px;background:rgba(255,255,255,0.05);font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;gap:8px;');
  ['Name','Email','Phone','Campaign','Source','Quality','Status','Date'].forEach(function(h) { ltHead.appendChild(_lp_el('div','',h)); });
  ltWrap.appendChild(ltHead);

  var leadsData = [
    { name:'Ahmad Razif',     email:'ahmad.r@gmail.com',   phone:'+65 9123 4567', campaign:'Insurance Lead Gen',  source:'Facebook',  quality:92, date:'Mar 30' },
    { name:'Sarah Lim',       email:'sarah.lim@yahoo.com', phone:'+65 8234 5678', campaign:'Seminar Registration',source:'Instagram',  quality:78, date:'Mar 30' },
    { name:'David Chen',      email:'dchen@hotmail.com',   phone:'+65 9345 6789', campaign:'Retirement Planning', source:'Lead Form',  quality:65, date:'Mar 29' },
    { name:'Priya Nair',      email:'priya.n@gmail.com',   phone:'+65 8456 7890', campaign:'Health Shield Promo', source:'Facebook',   quality:88, date:'Mar 29' },
    { name:'Kevin Tan',       email:'ktan@outlook.com',    phone:'+65 9567 8901', campaign:'Insurance Lead Gen',  source:'Instagram',  quality:45, date:'Mar 28' },
    { name:'Michelle Wong',   email:'mwong@gmail.com',     phone:'+65 8678 9012', campaign:'Brand Story',         source:'Facebook',   quality:72, date:'Mar 27' },
    { name:'Raj Sharma',      email:'raj.s@gmail.com',     phone:'+65 9789 0123', campaign:'Insurance Lead Gen',  source:'Lead Form',  quality:28, date:'Mar 27' },
    { name:'Hui Ling Chua',   email:'hlchua@yahoo.com',    phone:'+65 8890 1234', campaign:'Retirement Planning', source:'Facebook',   quality:81, date:'Mar 26' },
  ];

  var sourceStyles = {
    'Facebook':  { bg:'rgba(24,119,242,0.15)', color:'#4a90f5' },
    'Instagram': { bg:'rgba(225,48,108,0.15)', color:'#e1306c' },
    'Lead Form': { bg:'rgba(168,85,247,0.15)', color:'#a855f7' },
  };

  var qualityConfig = [
    { min:90, label:'Excellent', color:'#34d399', bg:'rgba(52,211,153,0.12)' },
    { min:70, label:'Good',      color:'#3b82f6', bg:'rgba(59,130,246,0.12)' },
    { min:50, label:'Average',   color:'#f59e0b', bg:'rgba(245,158,11,0.12)' },
    { min:30, label:'Low',       color:'#f97316', bg:'rgba(249,115,22,0.12)' },
    { min:0,  label:'Poor',      color:'#ef4444', bg:'rgba(239,68,68,0.12)' },
  ];
  var statusConfig = {
    'New':       { color:'#3b82f6', bg:'rgba(59,130,246,0.12)',  next:'Contacted'  },
    'Contacted': { color:'#f59e0b', bg:'rgba(245,158,11,0.12)',  next:'Qualified'  },
    'Qualified': { color:'#34d399', bg:'rgba(52,211,153,0.12)',  next:'Converted'  },
    'Converted': { color:'#06b6d4', bg:'rgba(6,182,212,0.12)',   next:'Lost'       },
    'Lost':      { color:'rgba(255,255,255,0.3)', bg:'rgba(255,255,255,0.06)', next:'New' },
  };
  var statusCycle = ['New','Contacted','Qualified','Converted','Lost'];

  leadsData.forEach(function(lead, idx) {
    var qConf = qualityConfig.find(function(q) { return lead.quality >= q.min; }) || qualityConfig[4];
    var row = _lp_el('div',
      'display:grid;grid-template-columns:1.5fr 2fr 1.4fr 1.6fr 0.9fr 1fr 1.2fr 1fr;padding:11px 16px;gap:8px;align-items:center;font-size:12px;' +
      (idx % 2 === 1 ? 'background:rgba(255,255,255,0.02);' : '') +
      'border-top:1px solid rgba(255,255,255,0.05);');
    row.appendChild(_lp_el('div','color:#fff;font-weight:500;', lead.name));
    row.appendChild(_lp_el('div','color:rgba(255,255,255,0.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;', lead.email));
    row.appendChild(_lp_el('div','color:rgba(255,255,255,0.5);', lead.phone));
    row.appendChild(_lp_el('div','color:rgba(255,255,255,0.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;', lead.campaign));
    var sStyle = sourceStyles[lead.source] || sourceStyles['Facebook'];
    row.appendChild(_lp_el('span',
      'padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600;background:' + sStyle.bg + ';color:' + sStyle.color + ';',
      lead.source));
    var qBadge = _lp_el('span',
      'padding:3px 8px;border-radius:20px;font-size:11px;font-weight:600;background:' + qConf.bg + ';color:' + qConf.color + ';',
      qConf.label + ' ' + lead.quality);
    row.appendChild(qBadge);

    // Status badge — clickable, cycles through statuses
    var curStatus = window._leadStatuses[idx] || 'New';
    var sCfg = statusConfig[curStatus] || statusConfig['New'];
    var sBadge = _lp_el('span',
      'padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;background:' + sCfg.bg + ';color:' + sCfg.color + ';',
      curStatus);
    (function(i, badge) {
      badge.onclick = function() {
        var cur = window._leadStatuses[i];
        var nextIdx = (statusCycle.indexOf(cur) + 1) % statusCycle.length;
        window._leadStatuses[i] = statusCycle[nextIdx];
        var nc = statusConfig[window._leadStatuses[i]];
        badge.textContent = window._leadStatuses[i];
        badge.style.background = nc.bg;
        badge.style.color = nc.color;
      };
    })(idx, sBadge);
    row.appendChild(sBadge);
    row.appendChild(_lp_el('div','color:rgba(255,255,255,0.35);', lead.date));
    ltWrap.appendChild(row);
  });
  leadPanel.appendChild(ltWrap);
  wrap.appendChild(leadPanel);

  /* ============================================================
     TAB 5: AD PREVIEW STUDIO
  ============================================================ */
  var prevPanel = _lp_el('div');
  prevPanel.setAttribute('data-panel', 'preview');
  prevPanel.className = 'lp-tab-panel';
  prevPanel.style.display = window._lpTab === 'preview' ? 'block' : 'none';

  prevPanel.appendChild(_lp_el('div','font-size:18px;font-weight:700;color:#fff;margin-bottom:6px;','Ad Preview Studio'));
  prevPanel.appendChild(_lp_el('div','font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:20px;','Edit your ad copy and see all 3 formats update live.'));

  var studioLayout = _lp_el('div','display:grid;grid-template-columns:280px 1fr;gap:24px;');

  // Left: form inputs
  var studioForm = _lp_el('div','display:flex;flex-direction:column;gap:14px;');

  function _lp_field(labelText, id, defaultVal, rows) {
    var g = _lp_el('div');
    g.appendChild(_lp_el('label','display:block;font-size:12px;color:rgba(255,255,255,0.45);margin-bottom:5px;font-weight:600;',labelText));
    var inp;
    if (rows) {
      inp = document.createElement('textarea');
      inp.rows = rows;
      inp.style.cssText = 'width:100%;padding:9px 11px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;font-size:13px;resize:vertical;box-sizing:border-box;font-family:inherit;line-height:1.5;';
    } else {
      inp = document.createElement('input');
      inp.type = 'text';
      inp.style.cssText = 'width:100%;padding:9px 11px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;font-size:13px;box-sizing:border-box;';
    }
    inp.id = id;
    inp.value = defaultVal;
    inp.oninput = function() { _lp_updatePreviews(); };
    inp.onfocus = function() { inp.style.borderColor = 'var(--blue-bright,#3b82f6)'; };
    inp.onblur  = function() { inp.style.borderColor = 'rgba(255,255,255,0.1)'; };
    g.appendChild(inp);
    return g;
  }

  // CTA select
  var ctaGroup = _lp_el('div');
  ctaGroup.appendChild(_lp_el('label','display:block;font-size:12px;color:rgba(255,255,255,0.45);margin-bottom:5px;font-weight:600;','Call-to-Action'));
  var ctaSel = document.createElement('select');
  ctaSel.id = 'studio_cta';
  ctaSel.style.cssText = 'width:100%;padding:9px 11px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;font-size:13px;box-sizing:border-box;cursor:pointer;';
  ['Learn More','Sign Up','Book Now','Get Quote','Contact Us'].forEach(function(opt) {
    var o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    if (opt === window._wizardData.cta) o.selected = true;
    ctaSel.appendChild(o);
  });
  ctaSel.onchange = function() { _lp_updatePreviews(); };
  ctaGroup.appendChild(ctaSel);

  studioForm.appendChild(_lp_field('Page Name', 'studio_page', window._wizardData.pageName));
  studioForm.appendChild(_lp_field('Headline', 'studio_headline', window._wizardData.headline));
  studioForm.appendChild(_lp_field('Primary Text', 'studio_text', window._wizardData.text, 4));
  studioForm.appendChild(ctaGroup);

  studioLayout.appendChild(studioForm);

  // Right: 3 previews stacked
  var previewsCol = _lp_el('div','display:flex;flex-direction:column;gap:16px;');

  // Helper: FB feed card
  function _lp_mkFbFeed(idSuffix) {
    var card = _lp_el('div');
    card.appendChild(_lp_el('div','font-size:10px;color:rgba(255,255,255,0.35);margin-bottom:6px;letter-spacing:0.05em;text-transform:uppercase;','Facebook Feed'));
    var fb = _lp_el('div','background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.35);max-width:360px;');
    var hdr = _lp_el('div','padding:8px 10px;display:flex;align-items:center;gap:8px;');
    var av = _lp_el('div','width:32px;height:32px;border-radius:50%;background:#1877f2;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:700;flex-shrink:0;','JX');
    hdr.appendChild(av);
    var hi = _lp_el('div');
    var pn = _lp_el('div','font-size:13px;font-weight:700;color:#050505;');
    pn.id = 'studio_prev_page_' + idSuffix;
    pn.textContent = (document.getElementById('studio_page') ? document.getElementById('studio_page').value : window._wizardData.pageName);
    hi.appendChild(pn);
    hi.appendChild(_lp_el('div','font-size:11px;color:#606770;','Sponsored \u00b7 \ud83c\udf10'));
    hdr.appendChild(hi);
    fb.appendChild(hdr);
    var txt = _lp_el('div','padding:0 10px 8px;font-size:12px;color:#050505;line-height:1.5;');
    txt.id = 'studio_prev_text_' + idSuffix;
    txt.textContent = (document.getElementById('studio_text') ? document.getElementById('studio_text').value : window._wizardData.text);
    fb.appendChild(txt);
    var img = _lp_el('div','height:140px;background:linear-gradient(135deg,#1877f2,#42b883);display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;');
    var hl = _lp_el('div','font-size:15px;font-weight:800;color:#fff;text-align:center;line-height:1.3;text-shadow:0 1px 4px rgba(0,0,0,0.3);');
    hl.id = 'studio_prev_hl_' + idSuffix;
    hl.textContent = (document.getElementById('studio_headline') ? document.getElementById('studio_headline').value : window._wizardData.headline);
    img.appendChild(hl);
    fb.appendChild(img);
    var bar = _lp_el('div','padding:8px 10px;background:#f0f2f5;display:flex;align-items:center;justify-content:space-between;');
    bar.appendChild(_lp_el('div','font-size:10px;color:#606770;','financialadvisory.com'));
    var cb = _lp_el('div','background:#1877f2;color:#fff;font-size:11px;font-weight:700;padding:5px 12px;border-radius:5px;');
    cb.id = 'studio_prev_cta_' + idSuffix;
    cb.textContent = (document.getElementById('studio_cta') ? document.getElementById('studio_cta').value : window._wizardData.cta);
    bar.appendChild(cb);
    fb.appendChild(bar);
    card.appendChild(fb);
    return card;
  }

  // Helper: IG Story card
  function _lp_mkIgStory(idSuffix) {
    var card = _lp_el('div');
    card.appendChild(_lp_el('div','font-size:10px;color:rgba(255,255,255,0.35);margin-bottom:6px;letter-spacing:0.05em;text-transform:uppercase;','Instagram Story'));
    var ig = _lp_el('div','width:160px;height:284px;border-radius:12px;background:linear-gradient(160deg,#0f172a,#1e293b);border:1px solid rgba(255,255,255,0.1);position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:16px;box-sizing:border-box;');
    var gradient = _lp_el('div','position:absolute;inset:0;background:linear-gradient(135deg,#1877f2 0%,#9333ea 100%);opacity:0.35;');
    ig.appendChild(gradient);
    var brand = _lp_el('div','position:absolute;top:12px;left:12px;display:flex;align-items:center;gap:6px;');
    brand.appendChild(_lp_el('div','width:24px;height:24px;border-radius:50%;background:#1877f2;display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:700;','JX'));
    var pgn = _lp_el('div','font-size:11px;color:#fff;font-weight:600;');
    pgn.id = 'studio_ig_page_' + idSuffix;
    pgn.textContent = (document.getElementById('studio_page') ? document.getElementById('studio_page').value : window._wizardData.pageName);
    brand.appendChild(pgn);
    ig.appendChild(brand);
    var textArea = _lp_el('div','position:relative;z-index:1;');
    var igHl = _lp_el('div','font-size:13px;font-weight:800;color:#fff;line-height:1.3;margin-bottom:6px;text-shadow:0 1px 4px rgba(0,0,0,0.5);');
    igHl.id = 'studio_ig_hl_' + idSuffix;
    igHl.textContent = (document.getElementById('studio_headline') ? document.getElementById('studio_headline').value : window._wizardData.headline);
    textArea.appendChild(igHl);
    var igCta = _lp_el('div','display:inline-block;background:rgba(255,255,255,0.9);color:#050505;font-size:10px;font-weight:700;padding:4px 12px;border-radius:20px;');
    igCta.id = 'studio_ig_cta_' + idSuffix;
    igCta.textContent = (document.getElementById('studio_cta') ? document.getElementById('studio_cta').value : window._wizardData.cta);
    textArea.appendChild(igCta);
    ig.appendChild(textArea);
    card.appendChild(ig);
    return card;
  }

  // Helper: FB Right Column
  function _lp_mkFbRight(idSuffix) {
    var card = _lp_el('div');
    card.appendChild(_lp_el('div','font-size:10px;color:rgba(255,255,255,0.35);margin-bottom:6px;letter-spacing:0.05em;text-transform:uppercase;','Facebook Right Column'));
    var rc = _lp_el('div','background:#fff;border-radius:8px;padding:8px;max-width:240px;display:flex;gap:8px;align-items:flex-start;');
    var thumb = _lp_el('div','width:72px;height:72px;flex-shrink:0;border-radius:4px;background:linear-gradient(135deg,#1877f2,#42b883);');
    rc.appendChild(thumb);
    var rcText = _lp_el('div','flex:1;');
    var rcHl = _lp_el('div','font-size:12px;font-weight:700;color:#050505;line-height:1.3;margin-bottom:4px;');
    rcHl.id = 'studio_rc_hl_' + idSuffix;
    rcHl.textContent = (document.getElementById('studio_headline') ? document.getElementById('studio_headline').value : window._wizardData.headline);
    rcText.appendChild(rcHl);
    rcText.appendChild(_lp_el('div','font-size:10px;color:#606770;margin-bottom:6px;','financialadvisory.com'));
    var rcCta = _lp_el('div','background:#1877f2;color:#fff;font-size:10px;font-weight:700;padding:4px 10px;border-radius:4px;display:inline-block;');
    rcCta.id = 'studio_rc_cta_' + idSuffix;
    rcCta.textContent = (document.getElementById('studio_cta') ? document.getElementById('studio_cta').value : window._wizardData.cta);
    rcText.appendChild(rcCta);
    rc.appendChild(rcText);
    card.appendChild(rc);
    return card;
  }

  // Platform selector + mobile toggle
  var studioControlBar = _lp_el('div', 'display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;');

  var platformBtns = _lp_el('div', 'display:flex;gap:6px;flex-wrap:wrap;');
  var platforms = ['Facebook Feed', 'Instagram Story', 'Right Column'];
  if (!window._lpStudioPlatform) window._lpStudioPlatform = 'Facebook Feed';
  platforms.forEach(function(p) {
    var active = window._lpStudioPlatform === p;
    var pb = _lp_el('button',
      'padding:5px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid;transition:all .15s;' +
      (active ? 'background:rgba(59,130,246,0.2);border-color:var(--blue-bright,#3b82f6);color:#3b82f6;' : 'background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.12);color:rgba(255,255,255,0.5);'),
      p);
    pb.onclick = function() {
      window._lpStudioPlatform = p;
      var previewArea = document.getElementById('studioPreviewArea');
      if (previewArea) {
        previewArea.innerHTML = '';
        if (p === 'Facebook Feed') previewArea.appendChild(_lp_mkFbFeed('s'));
        else if (p === 'Instagram Story') previewArea.appendChild(_lp_mkIgStory('s'));
        else previewArea.appendChild(_lp_mkFbRight('s'));
        _lp_applyMobilePreview(previewArea);
      }
      // update button states
      platformBtns.querySelectorAll('button').forEach(function(btn) {
        var sel = btn.textContent === p;
        btn.style.background = sel ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)';
        btn.style.borderColor = sel ? 'var(--blue-bright,#3b82f6)' : 'rgba(255,255,255,0.12)';
        btn.style.color = sel ? '#3b82f6' : 'rgba(255,255,255,0.5)';
      });
    };
    platformBtns.appendChild(pb);
  });
  studioControlBar.appendChild(platformBtns);

  // Mobile toggle
  if (window._lpStudioMobile === undefined) window._lpStudioMobile = false;
  var mobileToggleWrap = _lp_el('div', 'display:flex;align-items:center;gap:8px;cursor:pointer;');
  var mobileToggleTrack = _lp_el('div',
    'width:36px;height:20px;border-radius:10px;transition:background .2s;position:relative;' +
    (window._lpStudioMobile ? 'background:var(--blue-bright,#3b82f6);' : 'background:rgba(255,255,255,0.15);'));
  var mobileToggleThumb = _lp_el('div',
    'width:16px;height:16px;border-radius:50%;background:#fff;position:absolute;top:2px;transition:left .2s;' +
    (window._lpStudioMobile ? 'left:18px;' : 'left:2px;'));
  mobileToggleTrack.appendChild(mobileToggleThumb);
  mobileToggleWrap.appendChild(mobileToggleTrack);
  mobileToggleWrap.appendChild(_lp_el('span', 'font-size:12px;color:rgba(255,255,255,0.55);', 'Preview on Mobile'));
  mobileToggleWrap.onclick = function() {
    window._lpStudioMobile = !window._lpStudioMobile;
    mobileToggleTrack.style.background = window._lpStudioMobile ? 'var(--blue-bright,#3b82f6)' : 'rgba(255,255,255,0.15)';
    mobileToggleThumb.style.left = window._lpStudioMobile ? '18px' : '2px';
    var previewArea = document.getElementById('studioPreviewArea');
    if (previewArea) _lp_applyMobilePreview(previewArea);
  };
  studioControlBar.appendChild(mobileToggleWrap);
  previewsCol.appendChild(studioControlBar);

  // Helper to apply mobile scaling
  window._lp_applyMobilePreview = function(area) {
    if (!area) return;
    var inner = area.firstChild;
    if (!inner) return;
    if (window._lpStudioMobile) {
      area.style.cssText = 'display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,0.2);border-radius:12px;border:1px solid rgba(255,255,255,0.07);';
      inner.style.transform = 'scale(0.82)';
      inner.style.transformOrigin = 'top center';
    } else {
      area.style.cssText = '';
      inner.style.transform = '';
      inner.style.transformOrigin = '';
    }
  };

  var studioPreviewArea = _lp_el('div', '');
  studioPreviewArea.id = 'studioPreviewArea';
  // Render the active platform
  if (window._lpStudioPlatform === 'Facebook Feed') studioPreviewArea.appendChild(_lp_mkFbFeed('s'));
  else if (window._lpStudioPlatform === 'Instagram Story') studioPreviewArea.appendChild(_lp_mkIgStory('s'));
  else studioPreviewArea.appendChild(_lp_mkFbRight('s'));
  _lp_applyMobilePreview(studioPreviewArea);
  previewsCol.appendChild(studioPreviewArea);
  studioLayout.appendChild(previewsCol);
  prevPanel.appendChild(studioLayout);
  wrap.appendChild(prevPanel);

  // Append the main wrap to container
  container.appendChild(wrap);

  // Render wizard step
  _renderWizardStep();

  // ---- GLOBAL HELPERS ----
  window.renderWizard = function() { DEMO_RENDERERS.launchpad(container); };
  window.selectTemplate = function(id) { window._wizardData.template = id; renderWizard(); };
  window.wizardNext = function() {
    if (window._wizardStep === 4) {
      alert('Demo Mode \u2014 campaign submitted for review and launched in paused state. No budget charged until you unpause.');
      return;
    }
    window._wizardStep++;
    renderWizard();
  };
  window.wizardBack = function() {
    if (window._wizardStep > 0) { window._wizardStep--; renderWizard(); }
  };
  window.updateAdPreview = function() {
    var hl = document.getElementById('wiz_headline');
    var tx = document.getElementById('wiz_text');
    var ct = document.getElementById('wiz_cta_sel');
    if (hl) window._wizardData.headline = hl.value;
    if (tx) window._wizardData.text = tx.value;
    if (ct) window._wizardData.cta = ct.value;
    if (hl) { var hc = document.getElementById('wiz_headline_count'); if (hc) hc.textContent = hl.value.length + '/90'; }
    if (tx) { var tc = document.getElementById('wiz_text_count'); if (tc) tc.textContent = tx.value.length + '/500'; }
    var prevHl = document.getElementById('previewHeadline');
    var prevTx = document.getElementById('previewText');
    var prevCta = document.getElementById('previewCTA');
    if (prevHl) prevHl.textContent = window._wizardData.headline;
    if (prevTx) prevTx.textContent = window._wizardData.text;
    if (prevCta) prevCta.textContent = window._wizardData.cta;
  };
  window.toggleAudience = function(val, el) {
    var arr = window._wizardData.interests;
    var idx = arr.indexOf(val);
    if (idx === -1) { arr.push(val); el.style.background='rgba(59,130,246,0.2)';el.style.borderColor='var(--blue-bright,#3b82f6)';el.style.color='#fff'; }
    else { arr.splice(idx,1); el.style.background='rgba(255,255,255,0.05)';el.style.borderColor='rgba(255,255,255,0.15)';el.style.color='rgba(255,255,255,0.6)'; }
    var sizeEl = document.getElementById('audienceSizeDisplay');
    if (sizeEl) sizeEl.textContent = (_lp_calcReach()).toLocaleString();
  };
  window.toggleLocation = function(val, el) {
    var arr = window._wizardData.locations;
    var idx = arr.indexOf(val);
    if (idx === -1) { arr.push(val); el.style.background='rgba(59,130,246,0.2)';el.style.borderColor='var(--blue-bright,#3b82f6)';el.style.color='#fff'; }
    else { arr.splice(idx,1); el.style.background='rgba(255,255,255,0.05)';el.style.borderColor='rgba(255,255,255,0.15)';el.style.color='rgba(255,255,255,0.6)'; }
    var sizeEl = document.getElementById('audienceSizeDisplay');
    if (sizeEl) sizeEl.textContent = (_lp_calcReach()).toLocaleString();
  };
  window.updateBudget = function() {
    var slider = document.getElementById('budgetSlider');
    if (!slider) return;
    window._wizardData.budget = parseInt(slider.value);
    var bd = document.getElementById('budgetDisplay'); if (bd) bd.textContent = '$' + window._wizardData.budget;
    var reach = document.getElementById('budgetReach'); if (reach) reach.textContent = (window._wizardData.budget * 180).toLocaleString();
    var clicks = document.getElementById('budgetClicks'); if (clicks) clicks.textContent = (window._wizardData.budget * 6).toLocaleString();
    var cpl = document.getElementById('budgetCPL'); if (cpl) cpl.textContent = '$' + (100 / 6).toFixed(2);
    var total = document.getElementById('budget14day'); if (total) total.textContent = '$' + (window._wizardData.budget * 14).toLocaleString();
  };
};

function _lp_calcReach() {
  var d = window._wizardData;
  var ageBand = (d.ageMax - d.ageMin) / 5;
  var locMult = d.locations.length;
  var intMult = Math.max(1, d.interests.length);
  return Math.round(ageBand * locMult * intMult * 38000);
}

window._lp_updatePreviews = function() {
  var hl = (document.getElementById('studio_headline') || {}).value || window._wizardData.headline;
  var tx = (document.getElementById('studio_text') || {}).value || window._wizardData.text;
  var cta= (document.getElementById('studio_cta') || {}).value || window._wizardData.cta;
  var pg = (document.getElementById('studio_page') || {}).value || window._wizardData.pageName;
  var ids = ['studio_prev_hl_s','studio_ig_hl_s','studio_rc_hl_s'];
  ids.forEach(function(id) { var el=document.getElementById(id); if(el) el.textContent=hl; });
  var ctaIds = ['studio_prev_cta_s','studio_ig_cta_s','studio_rc_cta_s'];
  ctaIds.forEach(function(id) { var el=document.getElementById(id); if(el) el.textContent=cta; });
  var txId = document.getElementById('studio_prev_text_s'); if(txId) txId.textContent=tx;
  var pgIds = ['studio_prev_page_s','studio_ig_page_s'];
  pgIds.forEach(function(id) { var el=document.getElementById(id); if(el) el.textContent=pg; });
};

function _renderWizardStep() {
  var content = document.getElementById('launchpadStepContent');
  if (!content) return;
  content.innerHTML = '';

  var step = window._wizardStep;
  var d = window._wizardData;

  if (step === 0) {
    // ---- Step 0: Template Selection ----
    content.appendChild(_lp_el('h3','margin:0 0 6px;font-size:18px;color:#fff;','Choose a Campaign Template'));
    content.appendChild(_lp_el('p','margin:0 0 24px;color:rgba(255,255,255,0.5);font-size:14px;','Select the goal that best fits your campaign objective.'));

    var templates = [
      { id:'lead_gen',    icon:'\ud83d\udcca', name:'Lead Generation',  desc:'Collect qualified leads using a Facebook instant form. Best for insurance and financial advisory.', badge:'Most Popular', usedBy: 47 },
      { id:'brand',       icon:'\ud83c\udf1f', name:'Brand Awareness',  desc:'Maximise reach and impressions. Best for building trust and visibility before events.', usedBy: 31 },
      { id:'event',       icon:'\ud83d\udcc5', name:'Event Promotion',  desc:'Drive seminar and webinar registrations with urgency-based creative and countdown hooks.', usedBy: 22 },
      { id:'retargeting', icon:'\ud83d\udd01', name:'Retargeting',      desc:'Re-engage website visitors and video viewers with personalised follow-up ads.', usedBy: 18 },
    ];
    var grid = _lp_el('div','display:grid;grid-template-columns:repeat(2,1fr);gap:14px;');
    templates.forEach(function(tpl) {
      var isSelected = d.template === tpl.id;
      var card = _lp_el('div',
        'padding:20px;border-radius:12px;border:2px solid;cursor:pointer;transition:all .2s;position:relative;' +
        (isSelected ? 'background:rgba(59,130,246,0.12);border-color:var(--blue-bright,#3b82f6);' : 'background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.1);'));
      if (isSelected) card.classList.add('selected');
      if (tpl.badge) {
        var bdg = _lp_el('span','position:absolute;top:10px;right:10px;font-size:10px;font-weight:700;background:rgba(245,158,11,0.2);color:#f59e0b;padding:2px 8px;border-radius:4px;',tpl.badge);
        card.appendChild(bdg);
      }
      card.appendChild(_lp_el('div','font-size:28px;margin-bottom:10px;',tpl.icon));
      card.appendChild(_lp_el('div','font-size:14px;font-weight:700;color:#fff;margin-bottom:6px;',tpl.name));
      card.appendChild(_lp_el('div','font-size:12px;color:rgba(255,255,255,0.5);line-height:1.6;margin-bottom:10px;',tpl.desc));
      card.appendChild(_lp_el('div','font-size:11px;color:rgba(255,255,255,0.3);','Used by ' + tpl.usedBy + ' clients'));
      card.onclick = function() { selectTemplate(tpl.id); };
      card.onmouseenter = function() { if (!card.classList.contains('selected')) { card.style.borderColor='rgba(59,130,246,0.5)';card.style.background='rgba(59,130,246,0.07)'; } };
      card.onmouseleave = function() { if (!card.classList.contains('selected')) { card.style.borderColor='rgba(255,255,255,0.1)';card.style.background='rgba(255,255,255,0.04)'; } };
      grid.appendChild(card);
    });
    content.appendChild(grid);

  } else if (step === 1) {
    // ---- Step 1: Ad Copy ----
    content.appendChild(_lp_el('h3','margin:0 0 20px;font-size:18px;color:#fff;','Ad Copy Editor'));

    var cols = _lp_el('div','display:grid;grid-template-columns:1fr 1fr;gap:24px;');
    var leftCol = _lp_el('div','display:flex;flex-direction:column;gap:14px;');

    function mkWizField(label, tag, id, value, maxLen, countId, rows) {
      var g = _lp_el('div');
      var lbl = _lp_el('label','display:flex;justify-content:space-between;font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:6px;');
      lbl.appendChild(_lp_el('span','',label));
      var cnt = _lp_el('span',''); cnt.id = countId; cnt.textContent = value.length + '/' + maxLen;
      lbl.appendChild(cnt);
      var inp;
      if (tag === 'textarea') { inp = document.createElement('textarea'); inp.rows = rows||4; inp.style.cssText='width:100%;padding:10px 12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;font-size:13px;resize:vertical;box-sizing:border-box;font-family:inherit;line-height:1.5;'; }
      else { inp = document.createElement('input'); inp.type='text'; inp.style.cssText='width:100%;padding:10px 12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;font-size:13px;box-sizing:border-box;'; }
      inp.id = id; inp.value = value; inp.maxLength = maxLen;
      inp.oninput = function() { updateAdPreview(); };
      inp.onfocus = function() { this.style.borderColor='var(--blue-bright,#3b82f6)'; };
      inp.onblur  = function() { this.style.borderColor='rgba(255,255,255,0.12)'; };
      g.appendChild(lbl); g.appendChild(inp);
      return g;
    }

    leftCol.appendChild(mkWizField('Headline','input','wiz_headline',d.headline,90,'wiz_headline_count'));
    leftCol.appendChild(mkWizField('Primary Text','textarea','wiz_text',d.text,500,'wiz_text_count',5));

    // CTA dropdown
    var ctaGroup = _lp_el('div');
    ctaGroup.appendChild(_lp_el('label','display:block;font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:6px;','Call-to-Action'));
    var ctaSel = document.createElement('select');
    ctaSel.id = 'wiz_cta_sel';
    ctaSel.style.cssText = 'width:100%;padding:10px 12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;font-size:13px;box-sizing:border-box;cursor:pointer;';
    ['Learn More','Sign Up','Book Now','Get Quote','Contact Us'].forEach(function(opt) {
      var o = document.createElement('option'); o.value=opt; o.textContent=opt;
      if (opt === d.cta) o.selected=true;
      ctaSel.appendChild(o);
    });
    ctaSel.onchange = function() { updateAdPreview(); };
    ctaGroup.appendChild(ctaSel);
    leftCol.appendChild(ctaGroup);

    // Right: live FB feed preview
    var rightCol = _lp_el('div');
    rightCol.appendChild(_lp_el('div','font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:10px;','Live Facebook Feed Preview'));

    var fbCard = _lp_el('div','background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.4);max-width:320px;');
    var fbHdr = _lp_el('div','padding:10px 12px;display:flex;align-items:center;gap:8px;');
    var av2 = _lp_el('div','width:36px;height:36px;border-radius:50%;background:#1877f2;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;flex-shrink:0;','JX');
    fbHdr.appendChild(av2);
    var hi2 = _lp_el('div');
    hi2.appendChild(_lp_el('div','font-size:13px;font-weight:700;color:#050505;','Financial Advisory'));
    hi2.appendChild(_lp_el('div','font-size:11px;color:#606770;','Sponsored \u00b7 \ud83c\udf10'));
    fbHdr.appendChild(hi2);
    var fbTxt = _lp_el('div','padding:0 12px 10px;font-size:13px;color:#050505;line-height:1.5;'); fbTxt.id='previewText'; fbTxt.textContent=d.text;
    var fbImg = _lp_el('div','height:160px;background:linear-gradient(135deg,#1877f2,#42b883);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;');
    var fbHl = _lp_el('div','font-size:16px;font-weight:800;color:#fff;text-align:center;line-height:1.3;text-shadow:0 1px 4px rgba(0,0,0,0.3);'); fbHl.id='previewHeadline'; fbHl.textContent=d.headline;
    fbImg.appendChild(fbHl);
    var fbBar = _lp_el('div','padding:10px 12px;background:#f0f2f5;display:flex;align-items:center;justify-content:space-between;');
    fbBar.appendChild(_lp_el('div','font-size:11px;color:#606770;','financialadvisory.com'));
    var cb2 = _lp_el('div','background:#1877f2;color:#fff;font-size:12px;font-weight:700;padding:6px 14px;border-radius:6px;cursor:pointer;'); cb2.id='previewCTA'; cb2.textContent=d.cta;
    fbBar.appendChild(cb2);
    fbCard.appendChild(fbHdr); fbCard.appendChild(fbTxt); fbCard.appendChild(fbImg); fbCard.appendChild(fbBar);
    rightCol.appendChild(fbCard);

    cols.appendChild(leftCol); cols.appendChild(rightCol);
    content.appendChild(cols);

  } else if (step === 2) {
    // ---- Step 2: Audience Targeting ----
    content.appendChild(_lp_el('h3','margin:0 0 6px;font-size:18px;color:#fff;','Audience Targeting'));
    content.appendChild(_lp_el('p','margin:0 0 20px;color:rgba(255,255,255,0.5);font-size:14px;','Define who sees your ad.'));

    // Age range sliders
    var ageSection = _lp_el('div','margin-bottom:20px;');
    ageSection.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;','Age Range'));
    var ageRow = _lp_el('div','display:flex;gap:16px;align-items:center;');
    ['Min Age','Max Age'].forEach(function(lbl, ii) {
      var g = _lp_el('div','flex:1;');
      g.appendChild(_lp_el('label','display:flex;justify-content:space-between;font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:5px;', lbl));
      var sl = document.createElement('input'); sl.type='range'; sl.min='18'; sl.max='65'; sl.step='1';
      sl.value = ii===0 ? d.ageMin : d.ageMax;
      sl.style.cssText='width:100%;accent-color:var(--blue-bright,#3b82f6);cursor:pointer;';
      var disp = _lp_el('div','font-size:16px;font-weight:700;color:var(--blue-bright,#3b82f6);margin-top:4px;', (ii===0?d.ageMin:d.ageMax)+'');
      sl.oninput = function() {
        disp.textContent = sl.value;
        if (ii===0) window._wizardData.ageMin=parseInt(sl.value); else window._wizardData.ageMax=parseInt(sl.value);
        var sizeEl=document.getElementById('audienceSizeDisplay'); if(sizeEl) sizeEl.textContent=_lp_calcReach().toLocaleString();
      };
      g.appendChild(sl); g.appendChild(disp);
      ageRow.appendChild(g);
    });
    ageSection.appendChild(ageRow);
    content.appendChild(ageSection);

    // Gender toggles
    var genderSection = _lp_el('div','margin-bottom:20px;');
    genderSection.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;','Gender'));
    var gRow = _lp_el('div','display:flex;gap:8px;');
    ['all','male','female'].forEach(function(g) {
      var isActive = d.gender === g;
      var btn = _lp_el('button',
        'padding:6px 16px;border-radius:20px;border:1px solid;cursor:pointer;font-size:13px;transition:all .15s;' +
        (isActive ? 'background:rgba(59,130,246,0.2);border-color:var(--blue-bright,#3b82f6);color:#fff;' : 'background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.15);color:rgba(255,255,255,0.6);'),
        g.charAt(0).toUpperCase() + g.slice(1));
      btn.onclick = function() {
        window._wizardData.gender = g;
        gRow.querySelectorAll('button').forEach(function(b) { b.style.background='rgba(255,255,255,0.05)';b.style.borderColor='rgba(255,255,255,0.15)';b.style.color='rgba(255,255,255,0.6)'; });
        btn.style.background='rgba(59,130,246,0.2)';btn.style.borderColor='var(--blue-bright,#3b82f6)';btn.style.color='#fff';
      };
      gRow.appendChild(btn);
    });
    genderSection.appendChild(gRow);
    content.appendChild(genderSection);

    // Location chips
    var locSection = _lp_el('div','margin-bottom:20px;');
    locSection.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;','Location'));
    var locRow = _lp_el('div','display:flex;flex-wrap:wrap;gap:8px;');
    ['Singapore','Malaysia','Indonesia','Thailand'].forEach(function(loc) {
      var isActive = d.locations.indexOf(loc) !== -1;
      var chip = _lp_el('button',
        'padding:6px 14px;border-radius:20px;border:1px solid;cursor:pointer;font-size:13px;transition:all .15s;' +
        (isActive ? 'background:rgba(59,130,246,0.2);border-color:var(--blue-bright,#3b82f6);color:#fff;' : 'background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.15);color:rgba(255,255,255,0.6);'),
        loc);
      chip.onclick = function() { toggleLocation(loc, chip); };
      locRow.appendChild(chip);
    });
    locSection.appendChild(locRow);
    content.appendChild(locSection);

    // Interest chips
    var intSection = _lp_el('div','margin-bottom:20px;');
    intSection.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;','Interests'));
    var intRow = _lp_el('div','display:flex;flex-wrap:wrap;gap:8px;');
    ['Insurance','Investments','Retirement','Property','Parents','PMETs','Business Owners','Health & Fitness'].forEach(function(interest) {
      var isActive = d.interests.indexOf(interest) !== -1;
      var chip = _lp_el('button',
        'padding:6px 14px;border-radius:20px;border:1px solid;cursor:pointer;font-size:13px;transition:all .15s;' +
        (isActive ? 'background:rgba(59,130,246,0.2);border-color:var(--blue-bright,#3b82f6);color:#fff;' : 'background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.15);color:rgba(255,255,255,0.6);'),
        interest);
      chip.onclick = function() { toggleAudience(interest, chip); };
      intRow.appendChild(chip);
    });
    intSection.appendChild(intRow);
    content.appendChild(intSection);

    // Advantage+ toggle
    var advRow = _lp_el('div','display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.15);border-radius:10px;margin-bottom:16px;');
    var advInfo = _lp_el('div');
    advInfo.appendChild(_lp_el('div','font-size:13px;font-weight:600;color:#fff;margin-bottom:2px;','Advantage+ Audience'));
    advInfo.appendChild(_lp_el('div','font-size:11px;color:rgba(255,255,255,0.45);','Let Meta AI expand targeting to find more relevant people'));
    advRow.appendChild(advInfo);
    var toggle = _lp_el('div',
      'width:44px;height:24px;border-radius:12px;cursor:pointer;transition:all .2s;position:relative;' +
      (d.advantagePlus ? 'background:var(--blue-bright,#3b82f6);' : 'background:rgba(255,255,255,0.15);'));
    var knob = _lp_el('div',
      'position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:all .2s;' +
      (d.advantagePlus ? 'left:23px;' : 'left:3px;'));
    toggle.appendChild(knob);
    toggle.onclick = function() {
      d.advantagePlus = !d.advantagePlus;
      toggle.style.background = d.advantagePlus ? 'var(--blue-bright,#3b82f6)' : 'rgba(255,255,255,0.15)';
      knob.style.left = d.advantagePlus ? '23px' : '3px';
      var sizeEl=document.getElementById('audienceSizeDisplay'); if(sizeEl) sizeEl.textContent=_lp_calcReach().toLocaleString();
    };
    advRow.appendChild(toggle);
    content.appendChild(advRow);

    // Estimated reach
    var sizeBox = _lp_el('div','padding:14px 16px;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:10px;display:flex;align-items:center;justify-content:space-between;');
    sizeBox.appendChild(_lp_el('span','font-size:13px;color:rgba(255,255,255,0.6);','Estimated Reach'));
    var sizeNum = _lp_el('span','font-size:18px;font-weight:700;color:var(--blue-bright,#3b82f6);',_lp_calcReach().toLocaleString());
    sizeNum.id = 'audienceSizeDisplay';
    sizeBox.appendChild(sizeNum);
    content.appendChild(sizeBox);

  } else if (step === 3) {
    // ---- Step 3: Budget & Schedule ----
    content.appendChild(_lp_el('h3','margin:0 0 24px;font-size:18px;color:#fff;','Budget & Schedule'));

    // Daily budget slider
    var sliderSec = _lp_el('div','margin-bottom:24px;');
    var sliderHdr = _lp_el('div','display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;');
    sliderHdr.appendChild(_lp_el('span','font-size:14px;color:rgba(255,255,255,0.6);','Daily Budget'));
    var bdDisp = _lp_el('span','font-size:22px;font-weight:700;color:var(--blue-bright,#3b82f6);','$'+d.budget); bdDisp.id='budgetDisplay';
    sliderHdr.appendChild(bdDisp);
    sliderSec.appendChild(sliderHdr);
    var sl = document.createElement('input'); sl.type='range'; sl.id='budgetSlider'; sl.min='10'; sl.max='200'; sl.step='5'; sl.value=d.budget;
    sl.style.cssText='width:100%;accent-color:var(--blue-bright,#3b82f6);cursor:pointer;';
    sl.oninput = function() { updateBudget(); };
    sliderSec.appendChild(sl);
    var slRange = _lp_el('div','display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,0.3);margin-top:4px;');
    slRange.appendChild(_lp_el('span','','$10/day')); slRange.appendChild(_lp_el('span','','$200/day'));
    sliderSec.appendChild(slRange);
    content.appendChild(sliderSec);

    // Start/end dates
    var dateSec = _lp_el('div','display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;');
    [['Start Date',d.startDate],['End Date',d.endDate]].forEach(function(pair) {
      var g = _lp_el('div');
      g.appendChild(_lp_el('label','display:block;font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:6px;',pair[0]));
      var di = document.createElement('input'); di.type='date'; di.value=pair[1];
      di.style.cssText='width:100%;padding:9px 12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:rgba(255,255,255,0.7);font-size:13px;box-sizing:border-box;';
      g.appendChild(di); dateSec.appendChild(g);
    });
    content.appendChild(dateSec);

    // Bid strategy
    var bidSec = _lp_el('div','margin-bottom:24px;');
    bidSec.appendChild(_lp_el('label','display:block;font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:6px;','Bid Strategy'));
    var bidSel = document.createElement('select');
    bidSel.style.cssText='width:100%;max-width:280px;padding:9px 12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;font-size:13px;box-sizing:border-box;cursor:pointer;';
    ['Lowest Cost','Cost Cap','Bid Cap'].forEach(function(opt) {
      var o = document.createElement('option'); o.value=opt; o.textContent=opt;
      if (opt===d.bidStrategy) o.selected=true;
      bidSel.appendChild(o);
    });
    bidSel.onchange = function() { window._wizardData.bidStrategy=bidSel.value; };
    bidSec.appendChild(bidSel);
    content.appendChild(bidSec);

    // Estimated results
    var cg = _lp_el('div','display:grid;grid-template-columns:repeat(2,1fr);gap:12px;');
    [
      {label:'14-Day Budget', id:'budget14day', val:'$'+(d.budget*14).toLocaleString()},
      {label:'Est. Reach',    id:'budgetReach', val:(d.budget*180).toLocaleString()},
      {label:'Est. Clicks',   id:'budgetClicks',val:(d.budget*6).toLocaleString()},
      {label:'Est. CPL',      id:'budgetCPL',   val:'$'+(100/6).toFixed(2)},
    ].forEach(function(m) {
      var card = _lp_el('div','padding:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;text-align:center;');
      card.appendChild(_lp_el('div','font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;',m.label));
      var v = _lp_el('div','font-size:20px;font-weight:700;color:#fff;',m.val); v.id=m.id;
      card.appendChild(v); cg.appendChild(card);
    });
    content.appendChild(cg);

  } else if (step === 4) {
    // ---- Step 4: Review & Launch ----
    content.appendChild(_lp_el('h3','margin:0 0 20px;font-size:18px;color:#fff;','Review Your Campaign'));

    var cols2 = _lp_el('div','display:grid;grid-template-columns:1fr 1fr;gap:24px;');
    var left2 = _lp_el('div');
    left2.appendChild(_lp_el('div','font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;','Campaign Summary'));

    var tplNames = { lead_gen:'Lead Generation', brand:'Brand Awareness', event:'Event Promotion', retargeting:'Retargeting' };
    var summaryRows = [
      ['Template', d.template ? (tplNames[d.template]||d.template) : 'Not selected'],
      ['Headline', d.headline],
      ['CTA', d.cta],
      ['Age Range', d.ageMin + '\u2013' + d.ageMax],
      ['Gender', d.gender.charAt(0).toUpperCase()+d.gender.slice(1)],
      ['Locations', d.locations.join(', ')||'None'],
      ['Interests', d.interests.join(', ')||'None'],
      ['Daily Budget', '$'+d.budget],
      ['14-Day Total', '$'+(d.budget*14).toLocaleString()],
      ['Bid Strategy', d.bidStrategy],
    ];
    var tbl2 = _lp_el('table','width:100%;border-collapse:collapse;font-size:13px;');
    summaryRows.forEach(function(row) {
      var tr = _lp_el('tr','border-bottom:1px solid rgba(255,255,255,0.06);');
      var td1 = _lp_el('td','padding:7px 0;color:rgba(255,255,255,0.4);width:40%;vertical-align:top;',row[0]);
      var td2 = _lp_el('td','padding:7px 0;color:#fff;font-weight:500;word-break:break-word;',row[1]);
      tr.appendChild(td1); tr.appendChild(td2); tbl2.appendChild(tr);
    });
    left2.appendChild(tbl2);

    var right2 = _lp_el('div');
    right2.appendChild(_lp_el('div','font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;','Ad Preview'));
    var fbCard2 = _lp_el('div','background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.4);');
    var fbHdr2 = _lp_el('div','padding:8px 10px;display:flex;align-items:center;gap:8px;');
    var av3 = _lp_el('div','width:30px;height:30px;border-radius:50%;background:#1877f2;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:700;flex-shrink:0;','JX');
    fbHdr2.appendChild(av3);
    var hi3 = _lp_el('div');
    hi3.appendChild(_lp_el('div','font-size:12px;font-weight:700;color:#050505;','Financial Advisory'));
    hi3.appendChild(_lp_el('div','font-size:10px;color:#606770;','Sponsored'));
    fbHdr2.appendChild(hi3);
    var fbImg2 = _lp_el('div','height:110px;background:linear-gradient(135deg,#1877f2,#42b883);display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;');
    fbImg2.appendChild(_lp_el('div','font-size:13px;font-weight:800;color:#fff;text-align:center;line-height:1.3;text-shadow:0 1px 4px rgba(0,0,0,0.3);',d.headline));
    var fbBar2 = _lp_el('div','padding:8px 10px;background:#f0f2f5;display:flex;align-items:center;justify-content:space-between;');
    fbBar2.appendChild(_lp_el('div','font-size:10px;color:#606770;','financialadvisory.com'));
    fbBar2.appendChild(_lp_el('div','background:#1877f2;color:#fff;font-size:11px;font-weight:700;padding:5px 10px;border-radius:5px;',d.cta));
    fbCard2.appendChild(fbHdr2); fbCard2.appendChild(fbImg2); fbCard2.appendChild(fbBar2);
    right2.appendChild(fbCard2);

    cols2.appendChild(left2); cols2.appendChild(right2);
    content.appendChild(cols2);
  }
}

/* ============================================================
   FINANCE HUB DEMO
   ============================================================ */

DEMO_RENDERERS.financehub = function(container) {
  container.innerHTML = '';
  container.id = 'fhDemo';

  // ---- Tab Bar ----
  var tabDefs = [
    { key: 'profile',    label: 'Client Profile' },
    { key: 'income',     label: 'Income & Expenses' },
    { key: 'goals',      label: 'Goals & Milestones' },
    { key: 'insurance',  label: 'Insurance Coverage' },
    { key: 'cpf',        label: 'CPF & Retirement' },
    { key: 'projection', label: 'Projection Chart' },
  ];

  // ---- Tab Bar ----
  var tabBar = document.createElement('div');
  tabBar.className = 'demo-tabs';

  tabDefs.forEach(function(def, i) {
    var btn = document.createElement('button');
    btn.className = 'demo-tab' + (i === 0 ? ' active' : '');
    btn.dataset.tab = def.key;
    btn.textContent = def.label;
    btn.addEventListener('click', function() { fhTab(def.key); });
    tabBar.appendChild(btn);
  });

  container.appendChild(tabBar);

  // ---- Helper: make a stat card ----
  function fhStatCard(label, value, color, small) {
    var card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px 16px;';
    var lbl = document.createElement('div');
    lbl.textContent = label;
    lbl.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;';
    var val = document.createElement('div');
    val.textContent = value;
    val.style.cssText = 'font-size:' + (small ? '15px' : '20px') + ';font-weight:700;color:' + color + ';';
    card.appendChild(lbl);
    card.appendChild(val);
    return card;
  }

  // ============================================================
  // PANEL 1: CLIENT PROFILE
  // ============================================================
  var profilePanel = document.createElement('div');
  profilePanel.dataset.panel = 'profile';
  profilePanel.style.cssText = 'padding:20px 0;';

  // Top row: avatar card + details card
  var profileTop = document.createElement('div');
  profileTop.style.cssText = 'display:grid;grid-template-columns:200px 1fr;gap:20px;margin-bottom:20px;';

  // Avatar card
  var avatarCard = document.createElement('div');
  avatarCard.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:24px 16px;display:flex;flex-direction:column;align-items:center;gap:12px;';

  var avatarCircle = document.createElement('div');
  avatarCircle.style.cssText = 'width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#6b9bdb,#4a7bc8);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:#fff;letter-spacing:1px;flex-shrink:0;';
  avatarCircle.textContent = 'MT';

  var avatarName = document.createElement('div');
  avatarName.style.cssText = 'font-size:15px;font-weight:700;color:#e2e8f0;text-align:center;line-height:1.3;';
  avatarName.textContent = 'Marcus Tan Wei Ming';

  var avatarAge = document.createElement('div');
  avatarAge.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.45);text-align:center;';
  avatarAge.textContent = 'Age 25 · Software Engineer';

  var riskBadge = document.createElement('div');
  riskBadge.textContent = 'Moderate Risk';
  riskBadge.style.cssText = 'font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;background:#C4A24D22;color:#C4A24D;border:1px solid #C4A24D44;';

  avatarCard.appendChild(avatarCircle);
  avatarCard.appendChild(avatarName);
  avatarCard.appendChild(avatarAge);
  avatarCard.appendChild(riskBadge);

  // Details card
  var detailsCard = document.createElement('div');
  detailsCard.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:20px 24px;';

  var detailsTitle = document.createElement('div');
  detailsTitle.textContent = 'Personal Details';
  detailsTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:16px;';
  detailsCard.appendChild(detailsTitle);

  var detailsGrid = document.createElement('div');
  detailsGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:14px;';

  var details = [
    { label: 'Date of Birth',     value: '1 Mar 2000' },
    { label: 'Gender',            value: 'Male' },
    { label: 'Occupation',        value: 'Software Engineer' },
    { label: 'Employer',          value: 'TechCorp Pte Ltd' },
    { label: 'Gross Salary',      value: '$6,500 / month' },
    { label: 'Residency',         value: 'Singapore Citizen' },
    { label: 'Retirement Age',    value: '62' },
    { label: 'Dependants',        value: 'None currently' },
  ];

  details.forEach(function(d) {
    var item = document.createElement('div');
    item.style.cssText = 'display:flex;flex-direction:column;gap:2px;';
    var lbl = document.createElement('div');
    lbl.textContent = d.label;
    lbl.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);';
    var val = document.createElement('div');
    val.textContent = d.value;
    val.style.cssText = 'font-size:13px;color:#e2e8f0;font-weight:500;';
    item.appendChild(lbl);
    item.appendChild(val);
    detailsGrid.appendChild(item);
  });

  detailsCard.appendChild(detailsGrid);

  // Last Updated timestamp
  var lastUpdated = document.createElement('div');
  lastUpdated.style.cssText = 'margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;color:rgba(255,255,255,0.3);';
  lastUpdated.textContent = 'Last Updated: 2 days ago';
  detailsCard.appendChild(lastUpdated);

  profileTop.appendChild(avatarCard);
  profileTop.appendChild(detailsCard);
  profilePanel.appendChild(profileTop);

  // Risk Assessment section
  var riskSection = document.createElement('div');
  riskSection.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px 20px;margin-bottom:16px;';
  var riskSectionTitle = document.createElement('div');
  riskSectionTitle.textContent = 'Risk Assessment';
  riskSectionTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;';
  riskSection.appendChild(riskSectionTitle);

  var riskMeter = document.createElement('div');
  riskMeter.style.cssText = 'display:flex;gap:6px;';
  var riskLevels = [
    { label: 'Conservative', active: false, color: '#34d399' },
    { label: 'Moderate',     active: true,  color: '#C4A24D' },
    { label: 'Aggressive',   active: false, color: '#ef4444' },
  ];
  riskLevels.forEach(function(lvl) {
    var seg = document.createElement('div');
    seg.style.cssText = 'flex:1;padding:8px 10px;border-radius:8px;text-align:center;font-size:12px;font-weight:' + (lvl.active ? '700' : '500') + ';cursor:default;' +
      (lvl.active
        ? 'background:' + lvl.color + '25;border:2px solid ' + lvl.color + ';color:' + lvl.color + ';'
        : 'background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.3);');
    seg.textContent = lvl.label + (lvl.active ? ' \u2713' : '');
    riskMeter.appendChild(seg);
  });
  riskSection.appendChild(riskMeter);
  profilePanel.appendChild(riskSection);

  // Advisor Notes section
  var notesSection = document.createElement('div');
  notesSection.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px 20px;margin-bottom:16px;';
  var notesSectionTitle = document.createElement('div');
  notesSectionTitle.textContent = 'Advisor Notes';
  notesSectionTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;';
  notesSection.appendChild(notesSectionTitle);

  var advisorNotes = [
    { date: '31 Mar 2026', text: 'Client is open to increasing monthly savings by $500 once car loan is settled in 2028.' },
    { date: '15 Mar 2026', text: 'Discussed CI coverage gap \u2014 client agreed to review upgrade to $400k at next meeting.' },
    { date: '2 Mar 2026',  text: 'Salary increment expected in Q3 2026. Revisit CPF top-up strategy post-increment.' },
  ];
  advisorNotes.forEach(function(note) {
    var noteRow = document.createElement('div');
    noteRow.style.cssText = 'display:flex;gap:12px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.05);';
    var noteDateEl = document.createElement('div');
    noteDateEl.textContent = note.date;
    noteDateEl.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.3);white-space:nowrap;padding-top:1px;min-width:76px;';
    var noteTextEl = document.createElement('div');
    noteTextEl.textContent = note.text;
    noteTextEl.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.65);line-height:1.5;';
    noteRow.appendChild(noteDateEl);
    noteRow.appendChild(noteTextEl);
    notesSection.appendChild(noteRow);
  });
  profilePanel.appendChild(notesSection);

  // Bottom: quick financial snapshot
  var snapshotTitle = document.createElement('div');
  snapshotTitle.textContent = 'Financial Snapshot';
  snapshotTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;';
  profilePanel.appendChild(snapshotTitle);

  var snapshotGrid = document.createElement('div');
  snapshotGrid.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:12px;';
  [
    { label: 'Monthly Income',  value: '$6,500',   color: '#34d399' },
    { label: 'Monthly Expenses',value: '$4,200',   color: '#ef4444' },
    { label: 'Net Worth',       value: '$142,000', color: '#6b9bdb' },
    { label: 'CPF Balance',     value: '$55,000',  color: '#C4A24D' },
  ].forEach(function(s) {
    snapshotGrid.appendChild(fhStatCard(s.label, s.value, s.color, false));
  });
  profilePanel.appendChild(snapshotGrid);

  // ============================================================
  // PANEL 2: INCOME & EXPENSES
  // ============================================================
  var incomePanel = document.createElement('div');
  incomePanel.dataset.panel = 'income';
  incomePanel.style.cssText = 'padding:20px 0;display:none;';

  var incomeCols = document.createElement('div');
  incomeCols.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:24px;';

  // Left: income table
  var incomeLeft = document.createElement('div');
  var incomeSectionTitle = document.createElement('div');
  incomeSectionTitle.textContent = 'Income Sources';
  incomeSectionTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:14px;';
  incomeLeft.appendChild(incomeSectionTitle);

  var incomeSources = [
    { label: 'Gross Salary',   value: '$6,500/mo', badge: 'CPF',      badgeColor: '#6b9bdb' },
    { label: 'Annual Bonus',   value: '$6,500/yr', badge: 'Taxable',  badgeColor: '#C4A24D' },
    { label: 'Freelance',      value: '$1,200/mo', badge: 'Variable', badgeColor: '#a78bfa' },
  ];

  incomeSources.forEach(function(src) {
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;margin-bottom:8px;';
    var rowLeft = document.createElement('div');
    rowLeft.style.cssText = 'display:flex;align-items:center;gap:10px;';
    var badge = document.createElement('span');
    badge.textContent = src.badge;
    badge.style.cssText = 'font-size:10px;font-weight:600;padding:2px 7px;border-radius:4px;background:' + src.badgeColor + '22;color:' + src.badgeColor + ';border:1px solid ' + src.badgeColor + '33;';
    var srcLabel = document.createElement('span');
    srcLabel.textContent = src.label;
    srcLabel.style.cssText = 'font-size:13px;color:#e2e8f0;';
    rowLeft.appendChild(badge);
    rowLeft.appendChild(srcLabel);
    var rowRight = document.createElement('div');
    rowRight.textContent = src.value;
    rowRight.style.cssText = 'font-size:14px;font-weight:700;color:#34d399;';
    row.appendChild(rowLeft);
    row.appendChild(rowRight);
    incomeLeft.appendChild(row);
  });

  var incomeTotalRow = document.createElement('div');
  incomeTotalRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);border-radius:10px;margin-top:4px;';
  var iTotalLabel = document.createElement('span');
  iTotalLabel.textContent = 'Total Effective Monthly';
  iTotalLabel.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.6);font-weight:600;';
  var iTotalVal = document.createElement('span');
  iTotalVal.textContent = '$9,700';
  iTotalVal.style.cssText = 'font-size:18px;font-weight:700;color:#34d399;';
  incomeTotalRow.appendChild(iTotalLabel);
  incomeTotalRow.appendChild(iTotalVal);
  incomeLeft.appendChild(incomeTotalRow);

  // Right: expenses donut + summary
  var incomeRight = document.createElement('div');
  var expSectionTitle = document.createElement('div');
  expSectionTitle.textContent = 'Expense Breakdown';
  expSectionTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:14px;';
  incomeRight.appendChild(expSectionTitle);

  var expDonutWrap = document.createElement('div');
  expDonutWrap.style.cssText = 'display:flex;justify-content:center;margin-bottom:14px;';
  var expDonutCanvas = document.createElement('canvas');
  expDonutCanvas.id = 'fhExpDonut';
  expDonutWrap.appendChild(expDonutCanvas);
  incomeRight.appendChild(expDonutWrap);

  var expCategories = [
    { label: 'Housing',             value: 1800, pct: '32%', color: '#ef4444' },
    { label: 'Transport',           value: 600,  pct: '11%', color: '#f59e0b' },
    { label: 'Food',                value: 800,  pct: '14%', color: '#34d399' },
    { label: 'Insurance Premiums',  value: 450,  pct: '8%',  color: '#6b9bdb' },
    { label: 'Utilities',           value: 200,  pct: '4%',  color: '#64748b' },
    { label: 'Entertainment',       value: 350,  pct: '6%',  color: '#a78bfa' },
  ];

  var expLegendWrap = document.createElement('div');
  expLegendWrap.style.cssText = 'display:flex;flex-direction:column;gap:5px;margin-bottom:14px;';
  expCategories.forEach(function(cat) {
    var r = document.createElement('div');
    r.style.cssText = 'display:flex;align-items:center;justify-content:space-between;font-size:12px;';
    var rLeft = document.createElement('div');
    rLeft.style.cssText = 'display:flex;align-items:center;gap:7px;';
    var dot = document.createElement('div');
    dot.style.cssText = 'width:9px;height:9px;border-radius:50%;background:' + cat.color + ';flex-shrink:0;';
    var lbl = document.createElement('span');
    lbl.textContent = cat.label;
    lbl.style.cssText = 'color:rgba(255,255,255,0.65);';
    rLeft.appendChild(dot);
    rLeft.appendChild(lbl);
    var rRight = document.createElement('div');
    rRight.style.cssText = 'display:flex;gap:10px;';
    var vSpan = document.createElement('span');
    vSpan.textContent = '$' + cat.value.toLocaleString();
    vSpan.style.cssText = 'color:#e2e8f0;font-weight:600;';
    var pSpan = document.createElement('span');
    pSpan.textContent = cat.pct;
    pSpan.style.cssText = 'color:rgba(255,255,255,0.3);width:30px;text-align:right;';
    rRight.appendChild(vSpan);
    rRight.appendChild(pSpan);
    r.appendChild(rLeft);
    r.appendChild(rRight);
    expLegendWrap.appendChild(r);
  });
  incomeRight.appendChild(expLegendWrap);

  var surplusRow = document.createElement('div');
  surplusRow.style.cssText = 'display:flex;gap:10px;';
  var surplusCard = document.createElement('div');
  surplusCard.style.cssText = 'flex:1;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);border-radius:10px;padding:10px 14px;';
  var surplusLbl = document.createElement('div');
  surplusLbl.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:3px;display:flex;align-items:center;gap:6px;';
  var surplusLblText = document.createElement('span');
  surplusLblText.textContent = 'Monthly Surplus';
  var surplusTrendBadge = document.createElement('span');
  surplusTrendBadge.textContent = '\u25b2 3.2% vs last month';
  surplusTrendBadge.style.cssText = 'font-size:10px;font-weight:600;padding:1px 6px;border-radius:4px;background:rgba(52,211,153,0.15);color:#34d399;border:1px solid rgba(52,211,153,0.25);';
  surplusLbl.appendChild(surplusLblText);
  surplusLbl.appendChild(surplusTrendBadge);
  var surplusVal = document.createElement('div');
  surplusVal.textContent = '$5,500';
  surplusVal.style.cssText = 'font-size:18px;font-weight:700;color:#34d399;';
  surplusCard.appendChild(surplusLbl);
  surplusCard.appendChild(surplusVal);
  var savingsCard = document.createElement('div');
  savingsCard.style.cssText = 'flex:1;background:rgba(107,155,219,0.08);border:1px solid rgba(107,155,219,0.2);border-radius:10px;padding:10px 14px;';
  var savingsLbl = document.createElement('div');
  savingsLbl.textContent = 'Savings Rate';
  savingsLbl.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:3px;';
  var savingsVal = document.createElement('div');
  savingsVal.textContent = '57%';
  savingsVal.style.cssText = 'font-size:18px;font-weight:700;color:#6b9bdb;';
  savingsCard.appendChild(savingsLbl);
  savingsCard.appendChild(savingsVal);
  surplusRow.appendChild(surplusCard);
  surplusRow.appendChild(savingsCard);
  incomeRight.appendChild(surplusRow);

  // Top 3 Expense Categories mini-ranking
  var top3Title = document.createElement('div');
  top3Title.textContent = 'Top 3 Expense Categories';
  top3Title.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-top:16px;margin-bottom:8px;';
  incomeRight.appendChild(top3Title);

  var top3Data = [
    { rank: '1', label: 'Housing',   value: '$1,800', pct: 43, color: '#ef4444' },
    { rank: '2', label: 'Food',      value: '$800',   pct: 19, color: '#34d399' },
    { rank: '3', label: 'Transport', value: '$600',   pct: 14, color: '#f59e0b' },
  ];
  top3Data.forEach(function(item) {
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:6px;';
    var rankEl = document.createElement('div');
    rankEl.textContent = item.rank;
    rankEl.style.cssText = 'width:18px;height:18px;border-radius:50%;background:' + item.color + '25;border:1px solid ' + item.color + '50;color:' + item.color + ';font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;';
    var barWrap = document.createElement('div');
    barWrap.style.cssText = 'flex:1;';
    var barLabelRow = document.createElement('div');
    barLabelRow.style.cssText = 'display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px;';
    var barLabel = document.createElement('span');
    barLabel.textContent = item.label;
    barLabel.style.cssText = 'color:rgba(255,255,255,0.6);';
    var barValue = document.createElement('span');
    barValue.textContent = item.value;
    barValue.style.cssText = 'color:' + item.color + ';font-weight:600;';
    barLabelRow.appendChild(barLabel);
    barLabelRow.appendChild(barValue);
    var barTrackT3 = document.createElement('div');
    barTrackT3.style.cssText = 'background:rgba(255,255,255,0.07);border-radius:3px;height:4px;overflow:hidden;';
    var barFillT3 = document.createElement('div');
    barFillT3.style.cssText = 'height:100%;border-radius:3px;background:' + item.color + ';width:' + item.pct + '%;';
    barTrackT3.appendChild(barFillT3);
    barWrap.appendChild(barLabelRow);
    barWrap.appendChild(barTrackT3);
    row.appendChild(rankEl);
    row.appendChild(barWrap);
    incomeRight.appendChild(row);
  });

  // Income growth projection
  var incomeGrowthCard = document.createElement('div');
  incomeGrowthCard.style.cssText = 'margin-top:14px;padding:10px 14px;background:rgba(167,139,250,0.07);border:1px solid rgba(167,139,250,0.2);border-radius:10px;font-size:12px;color:rgba(255,255,255,0.55);line-height:1.5;';
  var incomeGrowthText = document.createElement('span');
  incomeGrowthText.innerHTML = 'Projected annual income at age 35: <strong style="color:#a78bfa;font-size:14px;">$132,000</strong>';
  incomeGrowthCard.appendChild(incomeGrowthText);
  incomeRight.appendChild(incomeGrowthCard);

  incomeCols.appendChild(incomeLeft);
  incomeCols.appendChild(incomeRight);
  incomePanel.appendChild(incomeCols);

  // ============================================================
  // PANEL 3: GOALS & MILESTONES
  // ============================================================
  var goalsPanel = document.createElement('div');
  goalsPanel.dataset.panel = 'goals';
  goalsPanel.style.cssText = 'padding:20px 0;display:none;';

  var goalsHeader = document.createElement('div');
  goalsHeader.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;';
  var goalsSectionTitle = document.createElement('div');
  goalsSectionTitle.textContent = 'Life Goals Timeline';
  goalsSectionTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;';
  var addGoalBtn = document.createElement('button');
  addGoalBtn.textContent = '+ Add Goal';
  addGoalBtn.style.cssText = 'font-size:12px;font-weight:600;padding:6px 14px;border-radius:8px;background:rgba(107,155,219,0.15);color:#6b9bdb;border:1px solid rgba(107,155,219,0.3);cursor:pointer;';
  addGoalBtn.addEventListener('click', function() {
    var toast = document.getElementById('fhToast');
    if (toast) {
      toast.textContent = 'In the full app, create custom goals for any life event.';
      toast.style.opacity = '1';
      setTimeout(function() { toast.style.opacity = '0'; }, 3000);
    }
  });
  goalsHeader.appendChild(goalsSectionTitle);
  goalsHeader.appendChild(addGoalBtn);
  goalsPanel.appendChild(goalsHeader);

  // Toast
  var goalsToast = document.createElement('div');
  goalsToast.id = 'fhToast';
  goalsToast.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:#1e293b;border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:10px 20px;font-size:13px;color:#e2e8f0;opacity:0;transition:opacity 0.3s;z-index:999;pointer-events:none;white-space:nowrap;';
  document.body.appendChild(goalsToast);

  // Total Funding Required summary card
  var totalFundingCard = document.createElement('div');
  totalFundingCard.style.cssText = 'background:rgba(196,162,77,0.08);border:1px solid rgba(196,162,77,0.25);border-radius:12px;padding:12px 18px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;';
  var tfLeft = document.createElement('div');
  var tfLabel = document.createElement('div');
  tfLabel.textContent = 'Total Funding Required';
  tfLabel.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:3px;';
  var tfValue = document.createElement('div');
  tfValue.textContent = '$1,945,000';
  tfValue.style.cssText = 'font-size:22px;font-weight:700;color:#C4A24D;';
  tfLeft.appendChild(tfLabel);
  tfLeft.appendChild(tfValue);
  var tfRight = document.createElement('div');
  tfRight.textContent = 'across 5 goals';
  tfRight.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.35);';
  totalFundingCard.appendChild(tfLeft);
  totalFundingCard.appendChild(tfRight);
  goalsPanel.appendChild(totalFundingCard);

  var goalsData = [
    { icon: '\uD83D\uDE97', name: 'Buy Car',      age: 28, year: 2028, cost: '$80,000',     saved: 15000, total: 80000,   sources: ['Cash'],         color: '#f59e0b', priority: 'Medium' },
    { icon: '\uD83C\uDFE0', name: 'Buy HDB',      age: 30, year: 2030, cost: '$600,000',    saved: 55000, total: 600000,  sources: ['CPF', 'Loan'],  color: '#6b9bdb', priority: 'High'   },
    { icon: '\uD83D\uDC8D', name: 'Wedding',      age: 32, year: 2032, cost: '$50,000',     saved: 5000,  total: 50000,   sources: ['Cash'],         color: '#a78bfa', priority: 'Medium' },
    { icon: '\uD83D\uDC76', name: 'First Child',  age: 33, year: 2033, cost: '$15,000/yr',  saved: 0,     total: 15000,   sources: ['Cash'],         color: '#34d399', priority: 'Low'    },
    { icon: '\uD83C\uDFC6', name: 'Retirement',   age: 62, year: 2062, cost: '$1.2M target',saved: 142000,total: 1200000, sources: ['CPF', 'Cash'],  color: '#C4A24D', priority: 'High'   },
  ];

  var goalsTimeline = document.createElement('div');
  goalsTimeline.style.cssText = 'display:flex;flex-direction:column;gap:12px;';

  goalsData.forEach(function(goal) {
    var card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px 18px;display:flex;align-items:center;gap:16px;';

    // Year badge
    var yearBadge = document.createElement('div');
    yearBadge.style.cssText = 'display:flex;flex-direction:column;align-items:center;min-width:52px;';
    var yearNum = document.createElement('div');
    yearNum.textContent = goal.year;
    yearNum.style.cssText = 'font-size:13px;font-weight:700;color:' + goal.color + ';';
    var ageLbl = document.createElement('div');
    ageLbl.textContent = 'Age ' + goal.age;
    ageLbl.style.cssText = 'font-size:10px;color:rgba(255,255,255,0.35);';
    yearBadge.appendChild(yearNum);
    yearBadge.appendChild(ageLbl);

    // Icon
    var iconEl = document.createElement('div');
    iconEl.textContent = goal.icon;
    iconEl.style.cssText = 'font-size:24px;flex-shrink:0;';

    // Main info
    var info = document.createElement('div');
    info.style.cssText = 'flex:1;';
    var goalNameRow = document.createElement('div');
    goalNameRow.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px;';
    var goalName = document.createElement('div');
    goalName.textContent = goal.name;
    goalName.style.cssText = 'font-size:14px;font-weight:600;color:#e2e8f0;';
    var priorityColors = { High: '#ef4444', Medium: '#f59e0b', Low: '#64748b' };
    var priorityBadge = document.createElement('span');
    priorityBadge.textContent = goal.priority;
    var pColor = priorityColors[goal.priority] || '#64748b';
    priorityBadge.style.cssText = 'font-size:10px;font-weight:700;padding:1px 6px;border-radius:4px;background:' + pColor + '20;color:' + pColor + ';border:1px solid ' + pColor + '40;';
    goalNameRow.appendChild(goalName);
    goalNameRow.appendChild(priorityBadge);
    var barTrack = document.createElement('div');
    barTrack.style.cssText = 'background:rgba(255,255,255,0.07);border-radius:4px;height:6px;margin-bottom:4px;overflow:hidden;';
    var barFill = document.createElement('div');
    var pct = Math.min(goal.saved / goal.total * 100, 100);
    barFill.style.cssText = 'height:100%;border-radius:4px;background:' + goal.color + ';width:' + pct.toFixed(1) + '%;';
    barTrack.appendChild(barFill);
    var pctLbl = document.createElement('div');
    pctLbl.textContent = pct.toFixed(0) + '% funded';
    pctLbl.style.cssText = 'font-size:10px;color:rgba(255,255,255,0.3);margin-bottom:5px;';
    var sourcesRow = document.createElement('div');
    sourcesRow.style.cssText = 'display:flex;gap:6px;';
    goal.sources.forEach(function(src) {
      var badge = document.createElement('span');
      badge.textContent = src;
      badge.style.cssText = 'font-size:10px;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.5);';
      sourcesRow.appendChild(badge);
    });
    info.appendChild(goalNameRow);
    info.appendChild(barTrack);
    info.appendChild(pctLbl);
    info.appendChild(sourcesRow);

    // Cost
    var costEl = document.createElement('div');
    costEl.style.cssText = 'text-align:right;min-width:90px;';
    var costVal = document.createElement('div');
    costVal.textContent = goal.cost;
    costVal.style.cssText = 'font-size:14px;font-weight:700;color:' + goal.color + ';';
    var savedLbl = document.createElement('div');
    savedLbl.textContent = '$' + (goal.saved / 1000).toFixed(0) + 'k saved';
    savedLbl.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);margin-top:3px;';
    costEl.appendChild(costVal);
    costEl.appendChild(savedLbl);

    card.appendChild(yearBadge);
    card.appendChild(iconEl);
    card.appendChild(info);
    card.appendChild(costEl);
    goalsTimeline.appendChild(card);
  });

  goalsPanel.appendChild(goalsTimeline);

  // ============================================================
  // PANEL 4: INSURANCE COVERAGE
  // ============================================================
  var insPanel = document.createElement('div');
  insPanel.dataset.panel = 'insurance';
  insPanel.style.cssText = 'padding:20px 0;display:none;';

  var insCols = document.createElement('div');
  insCols.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:24px;';

  // Left: coverage analysis table
  var insLeft = document.createElement('div');
  var insTableTitle = document.createElement('div');
  insTableTitle.textContent = 'Coverage Gap Analysis';
  insTableTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:16px;';
  insLeft.appendChild(insTableTitle);

  var insCoverageData = [
    { category: 'Death',           recommended: '$800,000', current: '$500,000', gap: '$300,000',    status: 'Partial',   statusColor: '#f59e0b', pct: 500000/800000  },
    { category: 'TPD',             recommended: '$600,000', current: '$600,000', gap: '—',           status: 'Adequate',  statusColor: '#34d399', pct: 1.0             },
    { category: 'Critical Illness',recommended: '$400,000', current: '$150,000', gap: '$250,000',    status: 'Gap',       statusColor: '#ef4444', pct: 150000/400000  },
    { category: 'Hospital',        recommended: 'Class B1', current: 'Class B1', gap: '—',           status: 'Covered',   statusColor: '#34d399', pct: 1.0             },
    { category: 'Disability Income',recommended:'$3,250/mo',current: '$2,000/mo',gap: '$1,250/mo',  status: 'Partial',   statusColor: '#f59e0b', pct: 2000/3250       },
  ];

  insCoverageData.forEach(function(item) {
    var row = document.createElement('div');
    row.style.cssText = 'margin-bottom:14px;';

    var rowHdr = document.createElement('div');
    rowHdr.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;';
    var catLbl = document.createElement('div');
    catLbl.textContent = item.category;
    catLbl.style.cssText = 'font-size:13px;font-weight:600;color:#e2e8f0;';
    var sBadge = document.createElement('div');
    sBadge.textContent = item.status;
    sBadge.style.cssText = 'font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:' + item.statusColor + '22;color:' + item.statusColor + ';border:1px solid ' + item.statusColor + '44;';
    rowHdr.appendChild(catLbl);
    rowHdr.appendChild(sBadge);
    row.appendChild(rowHdr);

    var barTrack = document.createElement('div');
    barTrack.style.cssText = 'background:rgba(255,255,255,0.07);border-radius:4px;height:8px;overflow:hidden;margin-bottom:5px;';
    var barFill = document.createElement('div');
    barFill.style.cssText = 'height:100%;border-radius:4px;background:' + item.statusColor + ';width:' + Math.round(item.pct * 100) + '%;';
    barTrack.appendChild(barFill);
    row.appendChild(barTrack);

    var rowSub = document.createElement('div');
    rowSub.style.cssText = 'display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,0.35);';
    var curSub = document.createElement('span');
    curSub.textContent = 'Current: ' + item.current;
    var recSub = document.createElement('span');
    recSub.textContent = 'Recommended: ' + item.recommended;
    rowSub.appendChild(curSub);
    rowSub.appendChild(recSub);
    row.appendChild(rowSub);

    insLeft.appendChild(row);
  });

  // Right: active policies
  var insRight = document.createElement('div');

  // Monthly Premium Total card
  var premiumTotalCard = document.createElement('div');
  premiumTotalCard.style.cssText = 'background:rgba(107,155,219,0.08);border:1px solid rgba(107,155,219,0.25);border-radius:12px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;';
  var ptLeft = document.createElement('div');
  var ptLabel = document.createElement('div');
  ptLabel.textContent = 'Monthly Premium Total';
  ptLabel.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:3px;';
  var ptValue = document.createElement('div');
  ptValue.textContent = '$283/month';
  ptValue.style.cssText = 'font-size:20px;font-weight:700;color:#6b9bdb;';
  ptLeft.appendChild(ptLabel);
  ptLeft.appendChild(ptValue);
  var ptRight = document.createElement('div');
  ptRight.textContent = 'across 3 policies';
  ptRight.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.35);';
  premiumTotalCard.appendChild(ptLeft);
  premiumTotalCard.appendChild(ptRight);
  insRight.appendChild(premiumTotalCard);

  var policiesTitle = document.createElement('div');
  policiesTitle.textContent = 'Active Policies';
  policiesTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:16px;';
  insRight.appendChild(policiesTitle);

  var policies = [
    { name: 'AIA Term Life',         coverage: '$500k Death',   premium: '$35/month',   color: '#6b9bdb' },
    { name: 'AIA Critical Cover',    coverage: '$150k CI',      premium: '$28/month',   color: '#ef4444' },
    { name: 'AIA HealthShield Gold', coverage: 'Class B1',      premium: '$180/year',   color: '#34d399' },
  ];

  policies.forEach(function(pol) {
    var polCard = document.createElement('div');
    polCard.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-left:3px solid ' + pol.color + ';border-radius:10px;padding:12px 16px;margin-bottom:10px;';
    var polName = document.createElement('div');
    polName.textContent = pol.name;
    polName.style.cssText = 'font-size:13px;font-weight:600;color:#e2e8f0;margin-bottom:6px;';
    var polMeta = document.createElement('div');
    polMeta.style.cssText = 'display:flex;justify-content:space-between;font-size:12px;color:rgba(255,255,255,0.45);';
    var polCoverage = document.createElement('span');
    polCoverage.textContent = pol.coverage;
    var polPremium = document.createElement('span');
    polPremium.textContent = pol.premium;
    polPremium.style.cssText = 'color:' + pol.color + ';font-weight:600;';
    polMeta.appendChild(polCoverage);
    polMeta.appendChild(polPremium);
    polCard.appendChild(polName);
    polCard.appendChild(polMeta);
    insRight.appendChild(polCard);
  });

  // Gap summary cards
  var gapTitle = document.createElement('div');
  gapTitle.textContent = 'Coverage Gaps';
  gapTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-top:16px;margin-bottom:10px;';
  insRight.appendChild(gapTitle);

  var gapGrid = document.createElement('div');
  gapGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;';
  [
    { label: 'Death Gap',     value: '$300k',   color: '#f59e0b' },
    { label: 'CI Gap',        value: '$250k',   color: '#ef4444' },
    { label: 'TPD',           value: 'Adequate',color: '#34d399' },
    { label: 'Hospital',      value: 'Covered', color: '#34d399' },
  ].forEach(function(g) {
    gapGrid.appendChild(fhStatCard(g.label, g.value, g.color, true));
  });
  insRight.appendChild(gapGrid);

  // Recommendations section
  var recTitle = document.createElement('div');
  recTitle.textContent = 'Recommendations';
  recTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-top:16px;margin-bottom:10px;';
  insRight.appendChild(recTitle);

  var recommendations = [
    { text: 'Increase CI coverage by $250k to close protection gap', icon: '\u2191', color: '#ef4444' },
    { text: 'Consider adding disability income rider to Term Life policy', icon: '+', color: '#f59e0b' },
  ];
  recommendations.forEach(function(rec) {
    var recRow = document.createElement('div');
    recRow.style.cssText = 'display:flex;align-items:flex-start;gap:10px;padding:9px 12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-left:3px solid ' + rec.color + ';border-radius:8px;margin-bottom:8px;';
    var recIcon = document.createElement('div');
    recIcon.textContent = rec.icon;
    recIcon.style.cssText = 'font-size:12px;font-weight:700;color:' + rec.color + ';width:16px;text-align:center;flex-shrink:0;padding-top:1px;';
    var recText = document.createElement('div');
    recText.textContent = rec.text;
    recText.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.6);line-height:1.4;';
    recRow.appendChild(recIcon);
    recRow.appendChild(recText);
    insRight.appendChild(recRow);
  });

  insCols.appendChild(insLeft);
  insCols.appendChild(insRight);
  insPanel.appendChild(insCols);

  // ============================================================
  // PANEL 5: CPF & RETIREMENT
  // ============================================================
  var cpfPanel = document.createElement('div');
  cpfPanel.dataset.panel = 'cpf';
  cpfPanel.style.cssText = 'padding:20px 0;display:none;';

  // CPF account balance cards
  var cpfBalTitle = document.createElement('div');
  cpfBalTitle.textContent = 'CPF Account Balances';
  cpfBalTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;';
  cpfPanel.appendChild(cpfBalTitle);

  var cpfAccountsRow = document.createElement('div');
  cpfAccountsRow.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;';

  var cpfAccounts = [
    { label: 'Ordinary Account (OA)', value: '$35,000', color: '#6b9bdb', sub: 'Housing, education, investments' },
    { label: 'Special Account (SA)',  value: '$12,000', color: '#C4A24D', sub: 'Retirement savings' },
    { label: 'MediSave Account (MA)', value: '$8,000',  color: '#34d399', sub: 'Healthcare' },
  ];

  cpfAccounts.forEach(function(acc) {
    var card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-top:3px solid ' + acc.color + ';border-radius:12px;padding:14px 16px;';
    var lbl = document.createElement('div');
    lbl.textContent = acc.label;
    lbl.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:6px;';
    var val = document.createElement('div');
    val.textContent = acc.value;
    val.style.cssText = 'font-size:22px;font-weight:700;color:' + acc.color + ';margin-bottom:4px;';
    var sub = document.createElement('div');
    sub.textContent = acc.sub;
    sub.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.3);';
    card.appendChild(lbl);
    card.appendChild(val);
    card.appendChild(sub);
    cpfAccountsRow.appendChild(card);
  });
  cpfPanel.appendChild(cpfAccountsRow);

  // Monthly Contribution + Readiness row
  var cpfMetaRow = document.createElement('div');
  cpfMetaRow.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;';

  var cpfContribCard = document.createElement('div');
  cpfContribCard.style.cssText = 'background:rgba(196,162,77,0.07);border:1px solid rgba(196,162,77,0.2);border-radius:12px;padding:12px 16px;';
  var cpfContribLabel = document.createElement('div');
  cpfContribLabel.textContent = 'Monthly CPF Contribution';
  cpfContribLabel.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;';
  var cpfContribValue = document.createElement('div');
  cpfContribValue.textContent = '$2,405/mo';
  cpfContribValue.style.cssText = 'font-size:20px;font-weight:700;color:#C4A24D;';
  var cpfContribSub = document.createElement('div');
  cpfContribSub.textContent = 'Employee $1,300 + Employer $1,105';
  cpfContribSub.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.3);margin-top:3px;';
  cpfContribCard.appendChild(cpfContribLabel);
  cpfContribCard.appendChild(cpfContribValue);
  cpfContribCard.appendChild(cpfContribSub);

  var cpfReadyCard = document.createElement('div');
  cpfReadyCard.style.cssText = 'background:rgba(52,211,153,0.07);border:1px solid rgba(52,211,153,0.2);border-radius:12px;padding:12px 16px;';
  var cpfReadyLabel = document.createElement('div');
  cpfReadyLabel.textContent = 'Retirement Readiness';
  cpfReadyLabel.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;';
  var cpfReadyBadge = document.createElement('div');
  cpfReadyBadge.style.cssText = 'display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:20px;background:rgba(52,211,153,0.15);border:1px solid rgba(52,211,153,0.35);';
  var cpfReadyDot = document.createElement('div');
  cpfReadyDot.style.cssText = 'width:7px;height:7px;border-radius:50%;background:#34d399;';
  var cpfReadyText = document.createElement('span');
  cpfReadyText.textContent = 'On Track';
  cpfReadyText.style.cssText = 'font-size:14px;font-weight:700;color:#34d399;';
  cpfReadyBadge.appendChild(cpfReadyDot);
  cpfReadyBadge.appendChild(cpfReadyText);
  var cpfReadySub = document.createElement('div');
  cpfReadySub.textContent = 'Projected to hit FRS by age 55';
  cpfReadySub.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.3);margin-top:6px;';
  cpfReadyCard.appendChild(cpfReadyLabel);
  cpfReadyCard.appendChild(cpfReadyBadge);
  cpfReadyCard.appendChild(cpfReadySub);

  cpfMetaRow.appendChild(cpfContribCard);
  cpfMetaRow.appendChild(cpfReadyCard);
  cpfPanel.appendChild(cpfMetaRow);

  // CPF projection chart
  var cpfProjTitle = document.createElement('div');
  cpfProjTitle.textContent = 'CPF Growth Projection (Age 25–65)';
  cpfProjTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;';
  cpfPanel.appendChild(cpfProjTitle);

  var cpfChartWrap = document.createElement('div');
  var cpfBarCanvas = document.createElement('canvas');
  cpfBarCanvas.id = 'fhCPFBar';
  cpfChartWrap.appendChild(cpfBarCanvas);
  cpfPanel.appendChild(cpfChartWrap);

  // CPF Life section
  var cpfLifeSection = document.createElement('div');
  cpfLifeSection.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px;';

  // Left: thresholds
  var cpfThresholds = document.createElement('div');
  var cpfThresholdTitle = document.createElement('div');
  cpfThresholdTitle.textContent = 'CPF Life Retirement Sums (2026)';
  cpfThresholdTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;';
  cpfThresholds.appendChild(cpfThresholdTitle);

  [
    { label: 'Basic Retirement Sum (BRS)',   value: '$106,500', color: '#34d399', payout: '$750–$900/mo' },
    { label: 'Full Retirement Sum (FRS)',    value: '$213,000', color: '#6b9bdb', payout: '$1,500–$1,800/mo' },
    { label: 'Enhanced Retirement Sum (ERS)',value: '$426,000', color: '#C4A24D', payout: '$2,300–$2,800/mo' },
  ].forEach(function(t) {
    var tRow = document.createElement('div');
    tRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;margin-bottom:6px;';
    var tLeft = document.createElement('div');
    var tLabel = document.createElement('div');
    tLabel.textContent = t.label;
    tLabel.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:2px;';
    var tVal = document.createElement('div');
    tVal.textContent = t.value;
    tVal.style.cssText = 'font-size:14px;font-weight:700;color:' + t.color + ';';
    tLeft.appendChild(tLabel);
    tLeft.appendChild(tVal);
    var tPayout = document.createElement('div');
    tPayout.textContent = t.payout;
    tPayout.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);text-align:right;';
    tRow.appendChild(tLeft);
    tRow.appendChild(tPayout);
    cpfThresholds.appendChild(tRow);
  });

  // Right: scheme comparison
  var cpfScheme = document.createElement('div');
  var cpfSchemeTitle = document.createElement('div');
  cpfSchemeTitle.textContent = 'Estimated Monthly Payout at 65';
  cpfSchemeTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;';
  cpfScheme.appendChild(cpfSchemeTitle);

  var schemes = [
    { name: 'Standard Plan',   payout: '$1,800–$2,000', note: 'Level payouts for life', color: '#6b9bdb' },
    { name: 'Basic Plan',      payout: '$2,100–$2,400', note: 'Higher early, bequest remainder', color: '#C4A24D' },
    { name: 'Escalating Plan', payout: '$1,600–$2,500', note: 'Grows 2% yearly', color: '#34d399' },
  ];

  schemes.forEach(function(s) {
    var sCard = document.createElement('div');
    sCard.style.cssText = 'background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-left:3px solid ' + s.color + ';border-radius:8px;padding:10px 14px;margin-bottom:8px;';
    var sName = document.createElement('div');
    sName.textContent = s.name;
    sName.style.cssText = 'font-size:12px;font-weight:600;color:#e2e8f0;margin-bottom:3px;';
    var sPayout = document.createElement('div');
    sPayout.textContent = s.payout + '/mo';
    sPayout.style.cssText = 'font-size:15px;font-weight:700;color:' + s.color + ';margin-bottom:2px;';
    var sNote = document.createElement('div');
    sNote.textContent = s.note;
    sNote.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);';
    sCard.appendChild(sName);
    sCard.appendChild(sPayout);
    sCard.appendChild(sNote);
    cpfScheme.appendChild(sCard);
  });

  cpfLifeSection.appendChild(cpfThresholds);
  cpfLifeSection.appendChild(cpfScheme);
  cpfPanel.appendChild(cpfLifeSection);

  // What-If scenario section
  var whatIfSection = document.createElement('div');
  whatIfSection.style.cssText = 'margin-top:20px;background:rgba(167,139,250,0.06);border:1px solid rgba(167,139,250,0.18);border-radius:12px;padding:14px 18px;';
  var whatIfTitle = document.createElement('div');
  whatIfTitle.textContent = 'What-If Scenario';
  whatIfTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;';
  whatIfSection.appendChild(whatIfTitle);
  var whatIfRow = document.createElement('div');
  whatIfRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;';
  var whatIfLeft = document.createElement('div');
  whatIfLeft.style.cssText = 'font-size:13px;color:rgba(255,255,255,0.55);line-height:1.5;';
  whatIfLeft.textContent = 'If salary increases 3% annually \u2192 CPF at 65:';
  var whatIfRight = document.createElement('div');
  whatIfRight.style.cssText = 'font-size:22px;font-weight:700;color:#a78bfa;white-space:nowrap;';
  whatIfRight.textContent = '$1,140,000';
  whatIfRow.appendChild(whatIfLeft);
  whatIfRow.appendChild(whatIfRight);
  whatIfSection.appendChild(whatIfRow);
  var whatIfNote = document.createElement('div');
  whatIfNote.textContent = 'vs. $984,000 at flat salary \u2014 +$156k additional retirement savings';
  whatIfNote.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.3);margin-top:6px;';
  whatIfSection.appendChild(whatIfNote);
  cpfPanel.appendChild(whatIfSection);

  // ============================================================
  // PANEL 6: PROJECTION CHART
  // ============================================================
  var projPanel = document.createElement('div');
  projPanel.dataset.panel = 'projection';
  projPanel.style.cssText = 'padding:20px 0;display:none;';

  var projTopTitle = document.createElement('div');
  projTopTitle.textContent = 'Net Worth Projection — Age 25 to 65';
  projTopTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:16px;';
  projPanel.appendChild(projTopTitle);

  var projChartWrap = document.createElement('div');
  projChartWrap.style.cssText = 'margin-bottom:16px;';
  var projCanvas = document.createElement('canvas');
  projCanvas.id = 'fhProjArea';
  projChartWrap.appendChild(projCanvas);
  projPanel.appendChild(projChartWrap);

  // Milestone markers row — clickable chips
  var milestonesRow = document.createElement('div');
  milestonesRow.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;';
  var activeMilestoneChip = null;
  [
    { icon: '\uD83D\uDE97', label: 'Car',        age: 28, color: '#f59e0b' },
    { icon: '\uD83C\uDFE0', label: 'HDB',        age: 30, color: '#6b9bdb' },
    { icon: '\uD83D\uDC8D', label: 'Wedding',    age: 32, color: '#a78bfa' },
    { icon: '\uD83D\uDC76', label: 'Child',      age: 33, color: '#34d399' },
    { icon: '\uD83C\uDFC6', label: 'Retirement', age: 62, color: '#C4A24D' },
  ].forEach(function(m) {
    var chip = document.createElement('div');
    var chipBaseStyle = 'display:flex;align-items:center;gap:5px;font-size:12px;padding:4px 10px;border-radius:20px;background:' + m.color + '15;border:1px solid ' + m.color + '30;color:' + m.color + ';cursor:pointer;transition:all 0.15s;';
    chip.style.cssText = chipBaseStyle;
    chip.textContent = m.icon + ' Age ' + m.age + ' \u00b7 ' + m.label;
    (function(chipEl, milestone) {
      chipEl.addEventListener('click', function() {
        var isActive = activeMilestoneChip === chipEl;
        if (activeMilestoneChip) {
          activeMilestoneChip.style.fontWeight = '';
          activeMilestoneChip.style.boxShadow = '';
        }
        if (isActive) {
          activeMilestoneChip = null;
        } else {
          chipEl.style.fontWeight = '700';
          chipEl.style.boxShadow = '0 0 0 2px ' + milestone.color + '55';
          activeMilestoneChip = chipEl;
          var toast = document.getElementById('fhToast');
          if (toast) {
            toast.textContent = milestone.icon + ' ' + milestone.label + ' milestone at Age ' + milestone.age;
            toast.style.opacity = '1';
            setTimeout(function() { toast.style.opacity = '0'; }, 2500);
          }
        }
      });
    })(chip, m);
    milestonesRow.appendChild(chip);
  });
  projPanel.appendChild(milestonesRow);

  // Key Assumptions collapsible
  var assumptionsWrap = document.createElement('div');
  assumptionsWrap.style.cssText = 'background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;margin-bottom:16px;overflow:hidden;';
  var assumptionsHeader = document.createElement('div');
  assumptionsHeader.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 16px;cursor:pointer;user-select:none;';
  var assumptionsHTitle = document.createElement('span');
  assumptionsHTitle.textContent = 'Key Assumptions';
  assumptionsHTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.06em;';
  var assumptionsChevron = document.createElement('span');
  assumptionsChevron.textContent = '\u25b8';
  assumptionsChevron.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.3);transition:transform 0.2s;display:inline-block;';
  assumptionsHeader.appendChild(assumptionsHTitle);
  assumptionsHeader.appendChild(assumptionsChevron);
  var assumptionsBody = document.createElement('div');
  assumptionsBody.style.cssText = 'display:none;padding:4px 16px 14px;';
  var aGrid = document.createElement('div');
  aGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:10px;';
  [
    { label: 'Inflation',           value: '3% per annum' },
    { label: 'Investment Returns',  value: '6% per annum' },
    { label: 'Salary Growth',       value: '3% per annum' },
    { label: 'CPF OA Rate',         value: '2.5% per annum' },
    { label: 'CPF SA Rate',         value: '4.0% per annum' },
    { label: 'Retirement Age',      value: '62 years old' },
  ].forEach(function(a) {
    var aItem = document.createElement('div');
    aItem.style.cssText = 'display:flex;flex-direction:column;gap:2px;';
    var aLabel = document.createElement('div');
    aLabel.textContent = a.label;
    aLabel.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.3);';
    var aValue = document.createElement('div');
    aValue.textContent = a.value;
    aValue.style.cssText = 'font-size:13px;color:#e2e8f0;font-weight:500;';
    aItem.appendChild(aLabel);
    aItem.appendChild(aValue);
    aGrid.appendChild(aItem);
  });
  assumptionsBody.appendChild(aGrid);
  assumptionsHeader.addEventListener('click', function() {
    var isOpen = assumptionsBody.style.display !== 'none';
    assumptionsBody.style.display = isOpen ? 'none' : 'block';
    assumptionsChevron.style.transform = isOpen ? '' : 'rotate(90deg)';
  });
  assumptionsWrap.appendChild(assumptionsHeader);
  assumptionsWrap.appendChild(assumptionsBody);
  projPanel.appendChild(assumptionsWrap);

  // Key insight cards
  var insightTitle = document.createElement('div');
  insightTitle.textContent = 'Key Insights';
  insightTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;';
  projPanel.appendChild(insightTitle);

  var insightGrid = document.createElement('div');
  insightGrid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;';
  [
    { label: 'Retirement Ready By',  value: 'Age 60',  color: '#34d399' },
    { label: 'Property Paid Off',    value: 'Age 55',  color: '#6b9bdb' },
    { label: 'Target Net Worth',     value: '$2.8M',   color: '#C4A24D' },
  ].forEach(function(ins) {
    insightGrid.appendChild(fhStatCard(ins.label, ins.value, ins.color, false));
  });
  projPanel.appendChild(insightGrid);

  // Export Report button
  var exportBtn = document.createElement('button');
  exportBtn.textContent = '\u21af  Export Report';
  exportBtn.style.cssText = 'font-size:13px;font-weight:600;padding:9px 20px;border-radius:10px;background:rgba(196,162,77,0.15);color:#C4A24D;border:1px solid rgba(196,162,77,0.35);cursor:pointer;';
  exportBtn.addEventListener('mouseenter', function() { exportBtn.style.background = 'rgba(196,162,77,0.25)'; });
  exportBtn.addEventListener('mouseleave', function() { exportBtn.style.background = 'rgba(196,162,77,0.15)'; });
  exportBtn.addEventListener('click', function() {
    var toast = document.getElementById('fhToast');
    if (toast) {
      toast.textContent = '\u2713 Exported \u2014 Marcus_Tan_FinancialPlan_Apr2026.pdf';
      toast.style.opacity = '1';
      setTimeout(function() { toast.style.opacity = '0'; }, 3000);
    }
  });
  projPanel.appendChild(exportBtn);

  // ---- Append all panels ----
  container.appendChild(profilePanel);
  container.appendChild(incomePanel);
  container.appendChild(goalsPanel);
  container.appendChild(insPanel);
  container.appendChild(cpfPanel);
  container.appendChild(projPanel);

  // Render initial tab charts after DOM is ready
  setTimeout(function() {
    _fhRenderExpDonut();
  }, 100);
};

/* ---- Tab switcher ---- */
function fhTab(tab) {
  var tabs   = document.querySelectorAll('#fhDemo .demo-tab');
  var panels = document.querySelectorAll('#fhDemo [data-panel]');

  tabs.forEach(function(t) {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  panels.forEach(function(p) {
    p.style.display = p.dataset.panel === tab ? '' : 'none';
  });

  setTimeout(function() {
    if (tab === 'income')     _fhRenderExpDonut();
    if (tab === 'cpf')        _fhRenderCPF();
    if (tab === 'projection') _fhRenderProjection();
  }, 50);
}

/* ---- Income & Expenses: expense donut ---- */
function _fhRenderExpDonut() {
  var canvas = document.getElementById('fhExpDonut');
  if (!canvas) return;
  Charts.donut(canvas, [
    { value: 1800, color: '#ef4444', label: 'Housing' },
    { value: 600,  color: '#f59e0b', label: 'Transport' },
    { value: 800,  color: '#34d399', label: 'Food' },
    { value: 450,  color: '#6b9bdb', label: 'Insurance' },
    { value: 200,  color: '#64748b', label: 'Utilities' },
    { value: 350,  color: '#a78bfa', label: 'Entertainment' },
  ], { size: 150, centerText: '$4.2k', centerSub: 'monthly' });
}

/* ---- CPF Projection chart ---- */
function _fhRenderCPF() {
  var canvas = document.getElementById('fhCPFBar');
  if (!canvas) return;

  // CPF contributions for Marcus: salary $6,500, age 25
  // Employee OA 23%, SA 6%, MA 8% (simplified under 55 rate)
  var salary = 6500;
  var oaContrib = salary * 0.23;
  var saContrib = salary * 0.06;
  var maContrib = salary * 0.08;
  var oaRate = 0.025, saRate = 0.04, maRate = 0.04;
  var oaBase = 35000, saBase = 12000, maBase = 8000;
  var ages = [25, 30, 35, 40, 45, 50, 55, 60, 65];

  var cpfData = ages.map(function(age) {
    var years = age - 25;
    var oaFV = oaBase * Math.pow(1 + oaRate, years) +
               (years > 0 ? oaContrib * 12 * ((Math.pow(1 + oaRate, years) - 1) / oaRate) : 0);
    var saFV = saBase * Math.pow(1 + saRate, years) +
               (years > 0 ? saContrib * 12 * ((Math.pow(1 + saRate, years) - 1) / saRate) : 0);
    var maFV = maBase * Math.pow(1 + maRate, years) +
               (years > 0 ? maContrib * 12 * ((Math.pow(1 + maRate, years) - 1) / maRate) : 0);
    // After 55 SA moves to RA, simplify by capping SA growth
    if (age >= 55) { saFV = Math.min(saFV, 213000); }
    return {
      label: '' + age,
      segments: [
        { value: Math.round(oaFV), color: '#6b9bdb' },
        { value: Math.round(saFV), color: '#C4A24D' },
        { value: Math.round(maFV), color: '#34d399' },
      ]
    };
  });

  Charts.stackedBar(canvas, cpfData, {
    height: 220,
    legend: [
      { label: 'OA', color: '#6b9bdb' },
      { label: 'SA', color: '#C4A24D' },
      { label: 'MA', color: '#34d399' },
    ],
  });
}

/* ---- Projection Chart: net worth area chart ---- */
function _fhRenderProjection() {
  var canvas = document.getElementById('fhProjArea');
  if (!canvas) return;

  var projData = [
    { label: '25', value: 142000  },
    { label: '30', value: 380000  },
    { label: '35', value: 520000  },
    { label: '40', value: 750000  },
    { label: '45', value: 1050000 },
    { label: '50', value: 1400000 },
    { label: '55', value: 1850000 },
    { label: '60', value: 2300000 },
    { label: '65', value: 2800000 },
  ];

  Charts.area(canvas, projData, {
    color: '#C4A24D',
    height: 260,
    currency: true,
    gridLines: 5,
    yMin: 0,
    yMax: 3000000,
  });
}

/* ============================================================
   MOBILE MENU TOGGLE
   ============================================================ */
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  menu.classList.toggle('open');
}

/* ============================================================
   ROUTER
   ============================================================ */
function route() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const heroEl = document.getElementById('hero');
  const platformsEl = document.getElementById('platforms');
  const footer = document.getElementById('siteFooter');
  const demoContainer = document.getElementById('demoPageContainer');
  const navPlatformsLink = document.getElementById('navPlatformsLink');
  const navDemoTitle = document.getElementById('navDemoTitle');

  if (path === '' || path === '/') {
    // Landing page
    heroEl.style.display = '';
    platformsEl.style.display = '';
    if (footer) footer.style.display = '';
    demoContainer.style.display = 'none';

    // Nav: show Platforms link, hide demo title
    if (navPlatformsLink) navPlatformsLink.style.display = '';
    if (navDemoTitle) navDemoTitle.style.display = 'none';

    renderHero();
    renderPlatformGrid();
    initScrollReveal();
  } else {
    // Demo page
    heroEl.style.display = 'none';
    platformsEl.style.display = 'none';
    if (footer) footer.style.display = 'none';
    demoContainer.style.display = '';

    // Nav: hide Platforms link, show demo title
    const demoId = path.slice(1);
    const platform = PLATFORMS.find(p => p.id === demoId);
    if (navPlatformsLink) navPlatformsLink.style.display = 'none';
    if (navDemoTitle && platform) {
      navDemoTitle.textContent = platform.icon + '  ' + platform.title;
      navDemoTitle.style.display = '';
    }

    if (platform && DEMO_RENDERERS[demoId]) {
      renderDemoPage(demoId, platform);
    } else if (platform) {
      renderDemoPage(demoId, platform);
    }
  }

  // Scroll to top on route change
  window.scrollTo(0, 0);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  // Nav brand navigates home
  const navBrand = document.getElementById('navBrand');
  if (navBrand) {
    navBrand.addEventListener('click', function() {
      history.pushState(null, '', '/');
      route();
    });
  }

  // Handle browser back/forward
  window.addEventListener('popstate', function() {
    route();
  });

  // Initial route
  route();
});
