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
    desc: 'Gamified team performance platform with 11 modules',
    features: [
      'Real-time activity feed & GPS logging',
      'Hall of Fame leaderboard',
      'Habit tracking with heatmaps',
      'Digital pledge sheet & FYC calculator',
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
    btn.addEventListener('click', () => openDemo(p.id));

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
   MODAL SYSTEM
   ============================================================ */
function openDemo(id) {
  const platform = PLATFORMS.find(p => p.id === id);
  if (!platform) return;

  const overlay = document.getElementById('modalOverlay');
  const titleEl = document.getElementById('modalTitle');
  // Use querySelector since demo renderers may overwrite the container ID
  const bodyEl  = document.querySelector('.modal-body');

  titleEl.textContent = platform.icon + '  ' + platform.title + ' — Interactive Demo';
  // Reset: clear all children and restore ID
  while (bodyEl.firstChild) bodyEl.removeChild(bodyEl.firstChild);
  bodyEl.id = 'modalBody';

  if (DEMO_RENDERERS[id]) {
    DEMO_RENDERERS[id](bodyEl);
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
    bodyEl.appendChild(placeholder);
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ESC key closes modal
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

// Click outside modal closes it
document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });
  }
});

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
   ACTIVITY TRACKER DEMO — Module Showcase with Subtabs
   ============================================================ */
DEMO_RENDERERS.tracker = function(container) {
  container.id = 'trackerDemo';

  /* ---- Helper: avatar initials bubble ---- */
  function atAvatar(initials, color) {
    var av = document.createElement('div');
    av.style.cssText = [
      'width:28px', 'height:28px', 'border-radius:50%',
      'background:' + (color || 'var(--bg2)'),
      'border:1px solid var(--border)',
      'display:flex', 'align-items:center', 'justify-content:center',
      'font-size:0.62rem', 'font-weight:700', 'color:#fff', 'flex-shrink:0',
    ].join(';');
    av.textContent = initials;
    return av;
  }

  /* ---- Helper: feature pill ---- */
  function atPill(label) {
    var p = document.createElement('span');
    p.style.cssText = 'display:inline-block;padding:2px 9px;border-radius:99px;font-size:0.66rem;font-weight:600;background:rgba(107,155,219,0.15);color:var(--primary-light);border:1px solid rgba(107,155,219,0.25);white-space:nowrap;';
    p.textContent = label;
    return p;
  }

  /* ---- Helper: badge ---- */
  function atBadge(label, color) {
    var b = document.createElement('span');
    b.style.cssText = 'display:inline-block;padding:2px 8px;border-radius:4px;font-size:0.62rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;background:' + (color || 'rgba(52,211,153,0.15)') + ';color:' + (color ? '#fff' : 'var(--green-bright)') + ';';
    b.textContent = label;
    return b;
  }

  /* ---- Helper: build a core module card ---- */
  function buildModuleCard(opts) {
    var card = document.createElement('div');
    card.style.cssText = 'background:var(--bg2);border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:12px;';

    var header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:11px 14px 9px;border-bottom:1px solid var(--border);';
    var htitle = document.createElement('div');
    htitle.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:0.84rem;font-weight:700;color:var(--text);';
    var emoji = document.createElement('span');
    emoji.textContent = opts.emoji;
    emoji.style.fontSize = '1rem';
    var nm = document.createElement('span');
    nm.textContent = opts.name;
    htitle.appendChild(emoji);
    htitle.appendChild(nm);
    header.appendChild(htitle);
    if (opts.badge) { header.appendChild(atBadge(opts.badge, opts.badgeColor || null)); }
    card.appendChild(header);

    var body = document.createElement('div');
    body.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:0;';

    var left = document.createElement('div');
    left.style.cssText = 'padding:14px 14px 14px;display:flex;flex-direction:column;gap:10px;border-right:1px solid var(--border);';
    var desc = document.createElement('div');
    desc.style.cssText = 'font-size:0.78rem;color:var(--text2);line-height:1.6;';
    desc.textContent = opts.desc;
    left.appendChild(desc);
    if (opts.pills && opts.pills.length) {
      var pillRow = document.createElement('div');
      pillRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:5px;margin-top:auto;';
      opts.pills.forEach(function(pl) { pillRow.appendChild(atPill(pl)); });
      left.appendChild(pillRow);
    }
    body.appendChild(left);

    var right = document.createElement('div');
    right.style.cssText = 'padding:12px;background:var(--bg1);';
    if (opts.previewFn) opts.previewFn(right);
    body.appendChild(right);

    card.appendChild(body);
    return card;
  }

  /* ================================================================
     SUBTAB BAR
     ================================================================ */
  var atSubtabs = [
    { id: 'overview',     label: 'Overview'      },
    { id: 'feed',         label: 'Activity Feed' },
    { id: 'leaderboard',  label: 'Leaderboard'   },
    { id: 'pledge',       label: 'Pledge Sheet'  },
    { id: 'gamification', label: 'Gamification'  },
  ];

  var atTabBar = document.createElement('div');
  atTabBar.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:4px;';

  var atPanes = {};

  atSubtabs.forEach(function(st) {
    var btn = document.createElement('button');
    btn.id = 'atTab_' + st.id;
    btn.style.cssText = [
      'background:transparent', 'border:none', 'border-bottom:2px solid transparent',
      'color:var(--text3)', 'font-size:0.75rem', 'font-weight:600',
      'padding:6px 10px', 'cursor:pointer', 'transition:color 0.2s,border-color 0.2s', 'white-space:nowrap',
    ].join(';');
    btn.textContent = st.label;
    btn.onclick = (function(id) { return function() { atSwitchTab(id); }; })(st.id);
    atTabBar.appendChild(btn);

    var pane = document.createElement('div');
    pane.id = 'atPane_' + st.id;
    pane.style.display = 'none';
    atPanes[st.id] = pane;
    container.appendChild(pane);
  });

  container.insertBefore(atTabBar, atPanes[atSubtabs[0].id]);

  function atSwitchTab(id) {
    atSubtabs.forEach(function(st) {
      var pane = document.getElementById('atPane_' + st.id);
      var btn  = document.getElementById('atTab_' + st.id);
      if (!pane || !btn) return;
      var active = st.id === id;
      pane.style.display    = active ? 'block' : 'none';
      btn.style.color       = active ? 'var(--primary-light)' : 'var(--text3)';
      btn.style.borderColor = active ? 'var(--primary-light)' : 'transparent';
    });
  }

  /* ================================================================
     PANE 1: OVERVIEW — existing module showcase
     ================================================================ */
  (function() {
    var pane = atPanes.overview;

    var statsRow = document.createElement('div');
    statsRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;';
    ['11 Modules', '4 Core', '7 Add-ons', 'Used by 50+ advisors'].forEach(function(s) {
      var b = document.createElement('div');
      b.style.cssText = 'display:flex;align-items:center;gap:5px;padding:5px 12px;border-radius:99px;background:var(--bg2);border:1px solid var(--border);font-size:0.75rem;font-weight:600;color:var(--text2);';
      b.textContent = s;
      statsRow.appendChild(b);
    });
    pane.appendChild(statsRow);

    var coreHeader = document.createElement('div');
    coreHeader.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:12px;';
    var coreLabel = document.createElement('div');
    coreLabel.style.cssText = 'font-size:0.72rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--text3);';
    coreLabel.textContent = 'CORE MODULES';
    coreHeader.appendChild(coreLabel);
    coreHeader.appendChild(atBadge('Included'));
    pane.appendChild(coreHeader);

    pane.appendChild(buildModuleCard({
      emoji: '\uD83D\uDCF1', name: 'Activity Tracking & Feed', badge: 'CORE', badgeColor: 'rgba(52,211,153,0.8)',
      desc: 'Real-time activity logging with team feed, reactions, GPS verification, and daily progress tracking.',
      pills: ['GPS Verified', 'Team Feed', 'Daily Goals'],
      previewFn: function(wrap) {
        [
          { initials: 'LT', color: '#355A99', name: 'You',        type: 'Closing', icon: '\uD83D\uDCDD', pts: '+4pt', time: '2m ago'  },
          { initials: 'SL', color: '#0f7b5a', name: 'Sarah Lim',  type: 'Set',     icon: '\uD83D\uDCDE', pts: '+1pt', time: '14m ago' },
          { initials: 'JC', color: '#7c3aed', name: 'James Chen', type: 'Opening', icon: '\uD83E\uDD1D', pts: '+3pt', time: '28m ago' },
        ].forEach(function(row) {
          var item = document.createElement('div');
          item.style.cssText = 'display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border);';
          item.appendChild(atAvatar(row.initials, row.color));
          var info = document.createElement('div'); info.style.cssText = 'flex:1;min-width:0;';
          var nm2 = document.createElement('div'); nm2.style.cssText = 'font-size:0.74rem;font-weight:600;color:var(--text);'; nm2.textContent = row.name;
          var tl = document.createElement('div'); tl.style.cssText = 'font-size:0.68rem;color:var(--text3);margin-top:1px;'; tl.textContent = row.icon + ' ' + row.type;
          info.appendChild(nm2); info.appendChild(tl); item.appendChild(info);
          var rght = document.createElement('div'); rght.style.cssText = 'display:flex;flex-direction:column;align-items:flex-end;gap:2px;';
          var pts = document.createElement('div'); pts.style.cssText = 'font-size:0.68rem;font-weight:700;color:var(--green-bright);background:rgba(52,211,153,0.12);padding:1px 6px;border-radius:99px;'; pts.textContent = row.pts;
          var tm = document.createElement('div'); tm.style.cssText = 'font-size:0.64rem;color:var(--text3);'; tm.textContent = row.time;
          rght.appendChild(pts); rght.appendChild(tm); item.appendChild(rght); wrap.appendChild(item);
        });
      },
    }));

    pane.appendChild(buildModuleCard({
      emoji: '\uD83C\uDFC6', name: 'Leaderboard & Analytics', badge: 'CORE', badgeColor: 'rgba(52,211,153,0.8)',
      desc: 'Hall of Fame podium, full activity leaderboard, sales funnel analytics, team trends & inactivity alerts.',
      pills: ['Hall of Fame', 'Trend Arrows', 'Inactivity Alerts'],
      previewFn: function(wrap) {
        var podRow2 = document.createElement('div'); podRow2.style.cssText = 'display:flex;justify-content:center;align-items:flex-end;gap:12px;';
        [
          { rank: 2, initials: 'JC', name: 'James Chen', pts: 395, color: '#C0C0C0', medal: '\uD83E\uDD48' },
          { rank: 1, initials: 'SL', name: 'Sarah Lim',  pts: 428, color: '#FFD700', medal: '\uD83E\uDD47' },
          { rank: 3, initials: 'LT', name: 'You',        pts: 312, color: '#CD7F32', medal: '\uD83E\uDD49' },
        ].forEach(function(p) {
          var col = document.createElement('div'); col.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;';
          var medal = document.createElement('div'); medal.style.cssText = 'font-size:1rem;'; medal.textContent = p.medal;
          var av = atAvatar(p.initials, p.color + '55'); av.style.cssText += ';border:2px solid ' + p.color + ';width:30px;height:30px;';
          var pn = document.createElement('div'); pn.style.cssText = 'font-size:0.62rem;font-weight:700;color:var(--text);text-align:center;max-width:52px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'; pn.textContent = p.name.split(' ')[0];
          var pp = document.createElement('div'); pp.style.cssText = 'font-size:0.62rem;color:var(--text3);'; pp.textContent = p.pts + ' pts';
          var h = p.rank === 1 ? '36px' : p.rank === 2 ? '26px' : '18px';
          var blk = document.createElement('div'); blk.style.cssText = 'width:44px;height:' + h + ';background:' + p.color + '22;border:1px solid ' + p.color + '55;border-radius:3px 3px 0 0;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:800;color:' + p.color + ';'; blk.textContent = '#' + p.rank;
          col.appendChild(medal); col.appendChild(av); col.appendChild(pn); col.appendChild(pp); col.appendChild(blk); podRow2.appendChild(col);
        });
        wrap.appendChild(podRow2);
      },
    }));

    pane.appendChild(buildModuleCard({
      emoji: '\uD83D\uDD25', name: 'Habit Tracker', badge: 'CORE', badgeColor: 'rgba(52,211,153,0.8)',
      desc: 'Daily habits with streak tracking, contribution heatmaps, work & personal habit separation.',
      pills: ['Streak Tracking', 'Heatmaps', 'Work/Personal Split'],
      previewFn: function(wrap) {
        var hv = [3,5,4,2,5,1,0, 4,3,5,5,4,2,0, 2,4,3,5,5,1,0, 5,4,5,4,4,0,0];
        var hc = ['var(--bg2)','rgba(53,90,153,0.25)','rgba(53,90,153,0.45)','rgba(107,155,219,0.6)','rgba(107,155,219,0.8)','var(--primary-light)'];
        var lbl2 = document.createElement('div'); lbl2.style.cssText = 'font-size:0.68rem;color:var(--text3);font-weight:600;margin-bottom:7px;'; lbl2.textContent = '4-Week Heatmap'; wrap.appendChild(lbl2);
        var grid2 = document.createElement('div'); grid2.style.cssText = 'display:grid;grid-template-columns:repeat(28,1fr);gap:2px;';
        hv.forEach(function(v) { var c2 = document.createElement('div'); c2.style.cssText = 'height:11px;border-radius:2px;background:' + hc[v] + ';'; grid2.appendChild(c2); });
        wrap.appendChild(grid2);
        var leg = document.createElement('div'); leg.style.cssText = 'display:flex;align-items:center;gap:4px;margin-top:7px;font-size:0.62rem;color:var(--text3);'; leg.textContent = 'Less ';
        [0,1,2,3,4,5].forEach(function(v) { var sq = document.createElement('div'); sq.style.cssText = 'width:10px;height:10px;border-radius:2px;background:' + hc[v] + ';border:1px solid var(--border);'; leg.appendChild(sq); });
        var more = document.createElement('span'); more.textContent = ' More'; leg.appendChild(more); wrap.appendChild(leg);
      },
    }));

    pane.appendChild(buildModuleCard({
      emoji: '\uD83D\uDCCB', name: 'Digital Pledge Sheet & Calculator', badge: 'CORE', badgeColor: 'rgba(52,211,153,0.8)',
      desc: 'Reverse-engineer activity targets from FYC goals. Save/load pledge sheets, presets, PDF export.',
      pills: ['Reverse Calculator', 'PDF Export', 'Presets'],
      previewFn: function(wrap) {
        var fr = document.createElement('div'); fr.style.cssText = 'margin-bottom:10px;padding:9px;background:rgba(53,90,153,0.12);border:1px solid rgba(107,155,219,0.2);border-radius:7px;';
        var fl = document.createElement('div'); fl.style.cssText = 'font-size:0.64rem;color:var(--text3);margin-bottom:3px;'; fl.textContent = 'FYC Target';
        var fv = document.createElement('div'); fv.style.cssText = 'font-size:1.1rem;font-weight:800;color:var(--primary-light);'; fv.textContent = '$50,000';
        fr.appendChild(fl); fr.appendChild(fv); wrap.appendChild(fr);
        [{ icon: '\uD83D\uDCDE', label: 'Sets / week', val: '12' }, { icon: '\uD83E\uDD1D', label: 'Openings', val: '4' }, { icon: '\uD83D\uDCDD', label: 'Closings', val: '2' }].forEach(function(r) {
          var row2 = document.createElement('div'); row2.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);';
          var lft2 = document.createElement('div'); lft2.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:0.72rem;color:var(--text2);'; lft2.textContent = r.icon + ' ' + r.label;
          var val2 = document.createElement('div'); val2.style.cssText = 'font-size:0.78rem;font-weight:700;color:var(--green-bright);'; val2.textContent = r.val;
          row2.appendChild(lft2); row2.appendChild(val2); wrap.appendChild(row2);
        });
      },
    }));

    var addonHeader = document.createElement('div');
    addonHeader.style.cssText = 'display:flex;align-items:center;gap:10px;margin-top:8px;margin-bottom:12px;';
    var addonLabel = document.createElement('div');
    addonLabel.style.cssText = 'font-size:0.72rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--text3);';
    addonLabel.textContent = 'ADD-ON MODULES';
    addonHeader.appendChild(addonLabel);
    addonHeader.appendChild(atBadge('Growth & Coaching', 'rgba(107,155,219,0.8)'));
    pane.appendChild(addonHeader);

    var addonGrid = document.createElement('div');
    addonGrid.style.cssText = 'display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:20px;';
    [
      { icon: '\uD83D\uDCB0', title: 'Commission Calculator',   desc: '30+ AIA product commission rates',              isNew: false },
      { icon: '\uD83D\uDCC8', title: 'Income Projection',       desc: 'Multi-year income layering with 9 streams',      isNew: false },
      { icon: '\uD83D\uDCCA', title: 'Sales Dashboard',         desc: 'FYC leaderboard with Life, HSG, A&H breakdowns', isNew: true  },
      { icon: '\uD83C\uDFA0', title: 'Gamification & Rewards',  desc: 'Wheel of Fortune, credits, real-life rewards',   isNew: true  },
      { icon: '\uD83D\uDCC5', title: 'Coaching & Booking',      desc: 'Public booking pages, Google Calendar sync',     isNew: false },
      { icon: '\uD83D\uDCAD', title: 'Team Reflections',        desc: 'Weekly reflections with AI coaching feedback',   isNew: false },
      { icon: '\u2705',       title: 'Accountability Board',    desc: 'Scheduled to-do lists with team visibility',     isNew: true  },
    ].forEach(function(a) {
      var card2 = document.createElement('div'); card2.style.cssText = 'background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:11px 13px;display:flex;gap:10px;align-items:flex-start;';
      var ie = document.createElement('div'); ie.style.cssText = 'font-size:1.1rem;flex-shrink:0;margin-top:1px;'; ie.textContent = a.icon; card2.appendChild(ie);
      var inf2 = document.createElement('div'); inf2.style.cssText = 'flex:1;min-width:0;';
      var tr2 = document.createElement('div'); tr2.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:3px;';
      var te2 = document.createElement('div'); te2.style.cssText = 'font-size:0.78rem;font-weight:700;color:var(--text);'; te2.textContent = a.title; tr2.appendChild(te2);
      if (a.isNew) { var nb2 = document.createElement('span'); nb2.style.cssText = 'display:inline-block;padding:1px 6px;border-radius:4px;font-size:0.58rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;background:#355A99;color:#fff;'; nb2.textContent = 'NEW'; tr2.appendChild(nb2); }
      inf2.appendChild(tr2);
      var ds2 = document.createElement('div'); ds2.style.cssText = 'font-size:0.71rem;color:var(--text3);line-height:1.5;'; ds2.textContent = a.desc; inf2.appendChild(ds2);
      card2.appendChild(inf2); addonGrid.appendChild(card2);
    });
    pane.appendChild(addonGrid);

    var forestWrap = document.createElement('div');
    forestWrap.className = 'chart-container';
    forestWrap.style.cssText = 'padding:14px 16px;';
    var forestTitle2 = document.createElement('div');
    forestTitle2.className = 'demo-section-heading';
    forestTitle2.textContent = 'Your Personal Forest';
    forestWrap.appendChild(forestTitle2);
    var forestScene2 = document.createElement('div');
    forestScene2.style.cssText = 'background:linear-gradient(180deg,#0a2e1a 0%,#0f4d2a 60%,#1a6b3c 100%);min-height:160px;position:relative;border-radius:8px;overflow:hidden;';
    [
      { species: 'cherry_blossom', left: '4%',  bottom: '8%',  width: 58 },
      { species: 'mighty_oak',     left: '17%', bottom: '5%',  width: 72 },
      { species: 'coconut_palm',   left: '30%', bottom: '7%',  width: 54 },
      { species: 'apple_tree',     left: '45%', bottom: '4%',  width: 66 },
      { species: 'lucky_bamboo',   left: '59%', bottom: '10%', width: 48 },
      { species: 'blue_spruce',    left: '72%', bottom: '6%',  width: 68 },
    ].forEach(function(t) {
      var td = document.createElement('div'); td.style.cssText = 'position:absolute;left:' + t.left + ';bottom:' + t.bottom + ';width:' + t.width + 'px;';
      var im = document.createElement('img'); im.src = 'https://tree-showcase-omega.vercel.app/trees/stages/' + t.species + '_full.png'; im.alt = t.species.replace(/_/g, ' ');
      im.style.cssText = 'width:100%;height:auto;display:block;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.5));';
      im.onerror = function() { td.textContent = '\uD83C\uDF33'; td.style.fontSize = '2rem'; };
      td.appendChild(im); forestScene2.appendChild(td);
    });
    forestWrap.appendChild(forestScene2);
    var forestCaption2 = document.createElement('div');
    forestCaption2.style.cssText = 'font-size:0.74rem;color:var(--text3);margin-top:10px;text-align:center;';
    forestCaption2.textContent = 'Advisors grow their personal forest by hitting daily activity targets';
    forestWrap.appendChild(forestCaption2);
    pane.appendChild(forestWrap);
  })();

  /* ================================================================
     PANE 2: ACTIVITY FEED
     ================================================================ */
  (function() {
    var pane = atPanes.feed;

    /* Today's progress bar */
    var progressCard = document.createElement('div');
    progressCard.style.cssText = 'background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:14px 16px;margin-bottom:16px;';
    var progressTop = document.createElement('div');
    progressTop.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;';
    var progressLabel = document.createElement('div');
    progressLabel.style.cssText = 'font-size:0.78rem;font-weight:700;color:var(--text);';
    progressLabel.textContent = "Today's Progress";
    var progressPts = document.createElement('div');
    progressPts.style.cssText = 'font-size:0.9rem;font-weight:800;color:var(--primary-light);';
    progressPts.textContent = '45 / 60 pts';
    progressTop.appendChild(progressLabel);
    progressTop.appendChild(progressPts);
    progressCard.appendChild(progressTop);
    var barBg = document.createElement('div');
    barBg.style.cssText = 'height:10px;border-radius:99px;background:var(--bg3);overflow:hidden;margin-bottom:8px;';
    var barFill = document.createElement('div');
    barFill.style.cssText = 'height:100%;width:75%;border-radius:99px;background:linear-gradient(90deg,#34d399,#6bdb99);';
    barBg.appendChild(barFill);
    progressCard.appendChild(barBg);
    var statusText = document.createElement('div');
    statusText.style.cssText = 'font-size:0.74rem;color:var(--green-bright);font-weight:600;';
    statusText.textContent = '75% of daily goal \u2014 great momentum!';
    progressCard.appendChild(statusText);
    pane.appendChild(progressCard);

    /* Team activity header */
    var feedHdr = document.createElement('div');
    feedHdr.style.cssText = 'font-size:0.72rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--text3);margin-bottom:10px;';
    feedHdr.textContent = 'TEAM ACTIVITY';
    pane.appendChild(feedHdr);

    /* Feed list */
    var feedItems = [
      { initials: 'LT', color: '#355A99', name: 'You',        type: 'Closing',   icon: '\uD83D\uDCDD', pts: '+4pt', time: '2m ago',  isYou: true  },
      { initials: 'SL', color: '#0f7b5a', name: 'Sarah Lim',  type: 'Set',       icon: '\uD83D\uDCDE', pts: '+1pt', time: '14m ago', isYou: false },
      { initials: 'JC', color: '#7c3aed', name: 'James Chen', type: 'Opening',   icon: '\uD83E\uDD1D', pts: '+3pt', time: '28m ago', isYou: false },
      { initials: 'RN', color: '#b45309', name: 'Rachel Ng',  type: 'Referral',  icon: '\uD83D\uDD17', pts: '+1pt', time: '45m ago', isYou: false },
      { initials: 'DT', color: '#0369a1', name: 'David Tan',  type: 'Servicing', icon: '\uD83D\uDD27', pts: '+2pt', time: '1h ago',  isYou: false },
      { initials: 'MW', color: '#7f1d1d', name: 'May Wong',   type: 'Closed',    icon: '\u2705',       pts: '+5pt', time: '2h ago',  isYou: false },
      { initials: 'LT', color: '#355A99', name: 'You',        type: 'Set',       icon: '\uD83D\uDCDE', pts: '+1pt', time: '3h ago',  isYou: true  },
      { initials: 'JL', color: '#065f46', name: 'John Lee',   type: 'Opening',   icon: '\uD83E\uDD1D', pts: '+3pt', time: '4h ago',  isYou: false },
    ];

    var feedList = document.createElement('div');
    feedList.style.cssText = 'background:var(--bg2);border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-bottom:16px;';
    feedItems.forEach(function(row, i) {
      var item = document.createElement('div');
      item.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 14px;' +
        (i < feedItems.length - 1 ? 'border-bottom:1px solid var(--border);' : '') +
        (row.isYou ? 'background:rgba(53,90,153,0.08);' : '');
      item.appendChild(atAvatar(row.initials, row.color));
      var info = document.createElement('div'); info.style.cssText = 'flex:1;min-width:0;';
      var nm3 = document.createElement('div');
      nm3.style.cssText = 'font-size:0.78rem;font-weight:' + (row.isYou ? '700' : '600') + ';color:var(--text);display:flex;align-items:center;gap:5px;';
      nm3.textContent = row.name;
      if (row.isYou) {
        var yb = document.createElement('span'); yb.style.cssText = 'font-size:0.58rem;padding:1px 5px;border-radius:3px;background:rgba(53,90,153,0.3);color:var(--primary-light);font-weight:700;'; yb.textContent = 'YOU'; nm3.appendChild(yb);
      }
      var tl2 = document.createElement('div'); tl2.style.cssText = 'font-size:0.7rem;color:var(--text3);margin-top:2px;'; tl2.textContent = row.icon + ' ' + row.type;
      info.appendChild(nm3); info.appendChild(tl2); item.appendChild(info);
      var rght2 = document.createElement('div'); rght2.style.cssText = 'display:flex;flex-direction:column;align-items:flex-end;gap:3px;';
      var pts2 = document.createElement('div'); pts2.style.cssText = 'font-size:0.72rem;font-weight:700;color:var(--green-bright);background:rgba(52,211,153,0.12);padding:2px 8px;border-radius:99px;border:1px solid rgba(52,211,153,0.2);'; pts2.textContent = row.pts;
      var tm2 = document.createElement('div'); tm2.style.cssText = 'font-size:0.66rem;color:var(--text3);'; tm2.textContent = row.time;
      rght2.appendChild(pts2); rght2.appendChild(tm2); item.appendChild(rght2);
      feedList.appendChild(item);
    });
    pane.appendChild(feedList);

    /* Log Activity button */
    var logBtn = document.createElement('button');
    logBtn.style.cssText = 'width:100%;padding:12px;border-radius:8px;border:none;background:var(--primary);color:#fff;font-size:0.82rem;font-weight:700;cursor:pointer;letter-spacing:0.03em;transition:opacity 0.2s;';
    logBtn.textContent = '+ Log Activity';
    logBtn.onmouseenter = function() { logBtn.style.opacity = '0.85'; };
    logBtn.onmouseleave = function() { logBtn.style.opacity = '1'; };
    logBtn.onclick = function() {
      var toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--bg2);border:1px solid var(--green-bright);color:var(--green-bright);padding:10px 20px;border-radius:8px;font-size:0.8rem;font-weight:600;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.4);';
      toast.textContent = '\u2705 Activity logged! +2 pts added';
      document.body.appendChild(toast);
      setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 2500);
    };
    pane.appendChild(logBtn);
  })();

  /* ================================================================
     PANE 3: LEADERBOARD
     ================================================================ */
  (function() {
    var pane = atPanes.leaderboard;

    var hofHdr = document.createElement('div');
    hofHdr.style.cssText = 'text-align:center;margin-bottom:16px;';
    var hofTitle = document.createElement('div');
    hofTitle.style.cssText = 'font-size:0.72rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--text3);margin-bottom:4px;';
    hofTitle.textContent = 'HALL OF FAME \u2014 THIS WEEK';
    var hofSubt = document.createElement('div');
    hofSubt.style.cssText = 'font-size:0.7rem;color:var(--text3);';
    hofSubt.textContent = 'Week of Apr 1\u20137, 2026';
    hofHdr.appendChild(hofTitle); hofHdr.appendChild(hofSubt);
    pane.appendChild(hofHdr);

    /* Podium */
    var podWrap = document.createElement('div');
    podWrap.style.cssText = 'display:flex;justify-content:center;align-items:flex-end;gap:16px;margin-bottom:20px;padding:0 8px;';
    [
      { rank: 2, initials: 'JC', name: 'James Chen', pts: 395, color: '#C0C0C0', medal: '\uD83E\uDD48', height: '70px' },
      { rank: 1, initials: 'SL', name: 'Sarah Lim',  pts: 428, color: '#FFD700', medal: '\uD83E\uDD47', height: '90px' },
      { rank: 3, initials: 'LT', name: 'You',        pts: 312, color: '#CD7F32', medal: '\uD83E\uDD49', height: '55px' },
    ].forEach(function(p) {
      var col3 = document.createElement('div'); col3.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;max-width:90px;';
      var med3 = document.createElement('div'); med3.style.cssText = 'font-size:1.3rem;'; med3.textContent = p.medal;
      var av3 = atAvatar(p.initials, p.color + '66'); av3.style.width = '38px'; av3.style.height = '38px'; av3.style.border = '2px solid ' + p.color; av3.style.fontSize = '0.75rem';
      var pname = document.createElement('div'); pname.style.cssText = 'font-size:0.72rem;font-weight:700;color:var(--text);text-align:center;'; pname.textContent = p.name.split(' ')[0];
      var ppts = document.createElement('div'); ppts.style.cssText = 'font-size:0.68rem;color:var(--text3);'; ppts.textContent = p.pts + ' pts';
      var blk3 = document.createElement('div'); blk3.style.cssText = 'width:100%;height:' + p.height + ';background:' + p.color + '1a;border:2px solid ' + p.color + '44;border-radius:6px 6px 0 0;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:800;color:' + p.color + ';'; blk3.textContent = '#' + p.rank;
      col3.appendChild(med3); col3.appendChild(av3); col3.appendChild(pname); col3.appendChild(ppts); col3.appendChild(blk3);
      podWrap.appendChild(col3);
    });
    pane.appendChild(podWrap);

    /* Full table */
    var tableCard = document.createElement('div');
    tableCard.style.cssText = 'background:var(--bg2);border:1px solid var(--border);border-radius:10px;overflow:hidden;';
    var rankColors3 = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };
    var tHead = document.createElement('div');
    tHead.style.cssText = 'display:grid;grid-template-columns:28px 32px 1fr 60px 56px 28px;gap:6px;padding:8px 12px;border-bottom:1px solid var(--border);background:var(--bg3);';
    ['#', '', 'Name', 'Points', 'Streak', ''].forEach(function(h) {
      var th = document.createElement('div'); th.style.cssText = 'font-size:0.64rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--text3);'; th.textContent = h; tHead.appendChild(th);
    });
    tableCard.appendChild(tHead);
    [
      { rank: 1, initials: 'SL', color: '#FFD700', name: 'Sarah Lim',   pts: 428, streak: 14, trend: '\u2191', trendUp: true  },
      { rank: 2, initials: 'JC', color: '#C0C0C0', name: 'James Chen',  pts: 395, streak: 9,  trend: '\u2192', trendUp: null  },
      { rank: 3, initials: 'LT', color: '#355A99', name: 'You',         pts: 312, streak: 7,  trend: '\u2191', trendUp: true,  isYou: true },
      { rank: 4, initials: 'RN', color: '#b45309', name: 'Rachel Ng',   pts: 290, streak: 5,  trend: '\u2193', trendUp: false },
      { rank: 5, initials: 'DT', color: '#0369a1', name: 'David Tan',   pts: 265, streak: 11, trend: '\u2191', trendUp: true  },
      { rank: 6, initials: 'MW', color: '#7f1d1d', name: 'May Wong',    pts: 244, streak: 3,  trend: '\u2193', trendUp: false },
      { rank: 7, initials: 'JL', color: '#065f46', name: 'John Lee',    pts: 218, streak: 6,  trend: '\u2191', trendUp: true  },
      { rank: 8, initials: 'BK', color: '#4c1d95', name: 'Ben Koh',     pts: 187, streak: 2,  trend: '\u2193', trendUp: false },
    ].forEach(function(r, i) {
      var row3 = document.createElement('div');
      row3.style.cssText = 'display:grid;grid-template-columns:28px 32px 1fr 60px 56px 28px;gap:6px;padding:9px 12px;align-items:center;' +
        (i < 7 ? 'border-bottom:1px solid var(--border);' : '') +
        (r.isYou ? 'background:rgba(53,90,153,0.1);' : (rankColors3[r.rank] ? 'background:' + rankColors3[r.rank] + '08;' : ''));
      var rnk = document.createElement('div'); rnk.style.cssText = 'font-size:0.72rem;font-weight:800;color:' + (rankColors3[r.rank] || 'var(--text3)') + ';'; rnk.textContent = r.rank;
      var av4 = atAvatar(r.initials, r.color); av4.style.width = '24px'; av4.style.height = '24px'; av4.style.fontSize = '0.58rem';
      var nm4 = document.createElement('div'); nm4.style.cssText = 'font-size:0.76rem;font-weight:' + (r.isYou ? '700' : '500') + ';color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'; nm4.textContent = r.name + (r.isYou ? ' (you)' : '');
      var pts3 = document.createElement('div'); pts3.style.cssText = 'font-size:0.76rem;font-weight:700;color:' + (rankColors3[r.rank] || 'var(--text)') + ';'; pts3.textContent = r.pts + ' pts';
      var strk = document.createElement('div'); strk.style.cssText = 'font-size:0.72rem;color:var(--text2);'; strk.textContent = '\uD83D\uDD25 ' + r.streak + 'd';
      var trnd = document.createElement('div'); trnd.style.cssText = 'font-size:0.9rem;font-weight:700;color:' + (r.trendUp === true ? 'var(--green-bright)' : r.trendUp === false ? '#f87171' : 'var(--text3)') + ';text-align:center;'; trnd.textContent = r.trend;
      row3.appendChild(rnk); row3.appendChild(av4); row3.appendChild(nm4); row3.appendChild(pts3); row3.appendChild(strk); row3.appendChild(trnd);
      tableCard.appendChild(row3);
    });
    pane.appendChild(tableCard);
  })();

  /* ================================================================
     PANE 4: PLEDGE SHEET
     ================================================================ */
  (function() {
    var pane = atPanes.pledge;
    var cols4 = document.createElement('div');
    cols4.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:12px;';

    /* Left: Calculator */
    var lc4 = document.createElement('div');
    var ct4 = document.createElement('div'); ct4.style.cssText = 'font-size:0.7rem;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:var(--text3);margin-bottom:10px;'; ct4.textContent = 'FORWARD GOAL CALCULATOR'; lc4.appendChild(ct4);
    var fycCard4 = document.createElement('div'); fycCard4.style.cssText = 'background:rgba(53,90,153,0.12);border:1px solid rgba(107,155,219,0.25);border-radius:8px;padding:12px;margin-bottom:12px;';
    var fl4 = document.createElement('div'); fl4.style.cssText = 'font-size:0.64rem;color:var(--text3);margin-bottom:4px;'; fl4.textContent = 'FYC Target';
    var fv4 = document.createElement('div'); fv4.style.cssText = 'font-size:1.5rem;font-weight:800;color:var(--primary-light);line-height:1;'; fv4.textContent = '$50,000';
    var fs4 = document.createElement('div'); fs4.style.cssText = 'font-size:0.68rem;color:var(--text3);margin-top:4px;'; fs4.textContent = '1 Closed = $2,500 avg FYC';
    fycCard4.appendChild(fl4); fycCard4.appendChild(fv4); fycCard4.appendChild(fs4); lc4.appendChild(fycCard4);
    var calcList4 = document.createElement('div'); calcList4.style.cssText = 'background:var(--bg2);border:1px solid var(--border);border-radius:8px;overflow:hidden;';
    [
      { label: 'Cases needed',    val: '20',          icon: '\uD83C\uDFAF' },
      { label: 'Closings / week', val: '2',           icon: '\uD83D\uDCDD' },
      { label: 'Openings / week', val: '6',           icon: '\uD83E\uDD1D' },
      { label: 'Sets / week',     val: '18',          icon: '\uD83D\uDCDE' },
      { label: 'Daily activity',  val: '~4 sets/day', icon: '\uD83D\uDCC5' },
    ].forEach(function(item, i) {
      var r4 = document.createElement('div'); r4.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px 12px;' + (i < 4 ? 'border-bottom:1px solid var(--border);' : '');
      var l4 = document.createElement('div'); l4.style.cssText = 'font-size:0.73rem;color:var(--text2);display:flex;align-items:center;gap:6px;'; l4.textContent = item.icon + ' ' + item.label;
      var v4 = document.createElement('div'); v4.style.cssText = 'font-size:0.78rem;font-weight:700;color:var(--green-bright);'; v4.textContent = item.val;
      r4.appendChild(l4); r4.appendChild(v4); calcList4.appendChild(r4);
    });
    lc4.appendChild(calcList4); cols4.appendChild(lc4);

    /* Right: Pledge table */
    var rc4 = document.createElement('div');
    var pt4 = document.createElement('div'); pt4.style.cssText = 'font-size:0.7rem;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:var(--text3);margin-bottom:10px;'; pt4.textContent = "THIS WEEK'S PLEDGE"; rc4.appendChild(pt4);
    var pledgeCard4 = document.createElement('div'); pledgeCard4.style.cssText = 'background:var(--bg2);border:1px solid var(--border);border-radius:8px;overflow:hidden;';
    var pth = document.createElement('div'); pth.style.cssText = 'display:grid;grid-template-columns:1fr 38px 38px 24px;gap:4px;padding:7px 10px;border-bottom:1px solid var(--border);background:var(--bg3);';
    ['Activity','Target','Actual',''].forEach(function(h) { var th4 = document.createElement('div'); th4.style.cssText = 'font-size:0.62rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--text3);'; th4.textContent = h; pth.appendChild(th4); });
    pledgeCard4.appendChild(pth);
    [
      { act: 'Sets',       target: 18, actual: 15, status: '\u26A0\uFE0F' },
      { act: 'Openings',   target: 6,  actual: 5,  status: '\u26A0\uFE0F' },
      { act: 'Closings',   target: 2,  actual: 2,  status: '\u2705'       },
      { act: 'Follow-ups', target: 10, actual: 12, status: '\u2705'       },
      { act: 'Referrals',  target: 3,  actual: 1,  status: '\u274C'       },
    ].forEach(function(r, i) {
      var pr = document.createElement('div'); pr.style.cssText = 'display:grid;grid-template-columns:1fr 38px 38px 24px;gap:4px;padding:8px 10px;align-items:center;' + (i < 4 ? 'border-bottom:1px solid var(--border);' : '');
      var ae = document.createElement('div'); ae.style.cssText = 'font-size:0.74rem;color:var(--text2);'; ae.textContent = r.act;
      var te4 = document.createElement('div'); te4.style.cssText = 'font-size:0.74rem;font-weight:600;color:var(--text3);text-align:center;'; te4.textContent = r.target;
      var ac4 = document.createElement('div'); var met4 = r.actual >= r.target; ac4.style.cssText = 'font-size:0.74rem;font-weight:700;color:' + (met4 ? 'var(--green-bright)' : '#f87171') + ';text-align:center;'; ac4.textContent = r.actual;
      var se4 = document.createElement('div'); se4.style.cssText = 'font-size:0.78rem;text-align:center;'; se4.textContent = r.status;
      pr.appendChild(ae); pr.appendChild(te4); pr.appendChild(ac4); pr.appendChild(se4); pledgeCard4.appendChild(pr);
    });
    rc4.appendChild(pledgeCard4);
    var psum = document.createElement('div'); psum.style.cssText = 'margin-top:10px;padding:8px 10px;background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.15);border-radius:7px;';
    var ps1 = document.createElement('div'); ps1.style.cssText = 'font-size:0.7rem;color:var(--text3);margin-bottom:2px;'; ps1.textContent = 'Weekly completion';
    var ps2 = document.createElement('div'); ps2.style.cssText = 'font-size:0.84rem;font-weight:700;color:var(--green-bright);'; ps2.textContent = '3 / 5 targets met \u2014 60%';
    psum.appendChild(ps1); psum.appendChild(ps2); rc4.appendChild(psum);
    cols4.appendChild(rc4);
    pane.appendChild(cols4);
  })();

  /* ================================================================
     PANE 5: GAMIFICATION
     ================================================================ */
  (function() {
    var pane = atPanes.gamification;
    var cols5 = document.createElement('div');
    cols5.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;';

    /* Left: Wheel of Fortune */
    var lc5 = document.createElement('div');
    var wt5 = document.createElement('div'); wt5.style.cssText = 'font-size:0.7rem;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:var(--text3);margin-bottom:10px;'; wt5.textContent = 'WHEEL OF FORTUNE'; lc5.appendChild(wt5);

    var wheelWrap = document.createElement('div');
    wheelWrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;margin-bottom:10px;';

    var ns5 = 'http://www.w3.org/2000/svg';
    var svg5 = document.createElementNS(ns5, 'svg');
    svg5.setAttribute('width', '130'); svg5.setAttribute('height', '130'); svg5.setAttribute('viewBox', '-65 -65 130 130');
    svg5.style.cssText = 'display:block;';

    var wheelSegs = [
      { color: '#355A99', label: '+5 pts',    startDeg: 0   },
      { color: '#34d399', label: 'Bonus Day', startDeg: 60  },
      { color: '#fbbf24', label: '+10 pts',   startDeg: 120 },
      { color: '#f87171', label: 'Try Again', startDeg: 180 },
      { color: '#a78bfa', label: '+2 pts',    startDeg: 240 },
      { color: '#38bdf8', label: 'Free Spin', startDeg: 300 },
    ];

    function p2c(angle, r) {
      var rad = (angle - 90) * Math.PI / 180;
      return { x: r * Math.cos(rad), y: r * Math.sin(rad) };
    }

    var wg5 = document.createElementNS(ns5, 'g');
    wg5.id = 'atWheelGroup5';
    var wAngle5 = 0;

    wheelSegs.forEach(function(seg) {
      var s5 = p2c(seg.startDeg, 60), e5 = p2c(seg.startDeg + 60, 60);
      var path5 = document.createElementNS(ns5, 'path');
      path5.setAttribute('d', 'M 0 0 L ' + s5.x + ' ' + s5.y + ' A 60 60 0 0 1 ' + e5.x + ' ' + e5.y + ' Z');
      path5.setAttribute('fill', seg.color); path5.setAttribute('stroke', '#0d1b2a'); path5.setAttribute('stroke-width', '1.5');
      wg5.appendChild(path5);
      var mid5 = p2c(seg.startDeg + 30, 38);
      var txt5 = document.createElementNS(ns5, 'text');
      txt5.setAttribute('x', mid5.x); txt5.setAttribute('y', mid5.y);
      txt5.setAttribute('text-anchor', 'middle'); txt5.setAttribute('dominant-baseline', 'middle');
      txt5.setAttribute('font-size', '7'); txt5.setAttribute('font-weight', '700'); txt5.setAttribute('fill', '#fff');
      txt5.setAttribute('transform', 'rotate(' + (seg.startDeg + 30) + ',' + mid5.x + ',' + mid5.y + ')');
      txt5.textContent = seg.label; wg5.appendChild(txt5);
    });

    var hub5 = document.createElementNS(ns5, 'circle');
    hub5.setAttribute('cx', '0'); hub5.setAttribute('cy', '0'); hub5.setAttribute('r', '10');
    hub5.setAttribute('fill', '#0d1b2a'); hub5.setAttribute('stroke', '#4b5563'); hub5.setAttribute('stroke-width', '2');
    wg5.appendChild(hub5);
    svg5.appendChild(wg5);
    var ptr5 = document.createElementNS(ns5, 'polygon');
    ptr5.setAttribute('points', '0,-58 -6,-48 6,-48'); ptr5.setAttribute('fill', '#fbbf24');
    svg5.appendChild(ptr5);
    wheelWrap.appendChild(svg5);

    var spinBtn5 = document.createElement('button');
    spinBtn5.style.cssText = 'padding:8px 24px;border-radius:99px;border:none;background:var(--primary);color:#fff;font-size:0.78rem;font-weight:700;cursor:pointer;margin-top:6px;transition:opacity 0.2s;';
    spinBtn5.textContent = 'Spin!';
    var spinning5 = false;
    spinBtn5.onclick = function() {
      if (spinning5) return;
      spinning5 = true; spinBtn5.disabled = true;
      wAngle5 += 720 + Math.floor(Math.random() * 360);
      wg5.style.transition = 'transform 2s cubic-bezier(0.17,0.67,0.35,1)';
      wg5.style.transform = 'rotate(' + wAngle5 + 'deg)';
      wg5.style.transformOrigin = '0 0';
      setTimeout(function() {
        spinning5 = false; spinBtn5.disabled = false;
        var norm = ((wAngle5 % 360) + 360) % 360;
        var seg5idx = Math.floor(((360 - norm + 270) % 360) / 60) % 6;
        var toast5 = document.createElement('div');
        toast5.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--bg2);border:1px solid var(--primary-light);color:var(--primary-light);padding:10px 20px;border-radius:8px;font-size:0.8rem;font-weight:600;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.4);';
        toast5.textContent = '\uD83C\uDF89 You landed: ' + wheelSegs[seg5idx].label + '!';
        document.body.appendChild(toast5);
        setTimeout(function() { if (toast5.parentNode) toast5.parentNode.removeChild(toast5); }, 2800);
      }, 2100);
    };
    wheelWrap.appendChild(spinBtn5);
    lc5.appendChild(wheelWrap);

    var rwt = document.createElement('div'); rwt.style.cssText = 'font-size:0.66rem;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;'; rwt.textContent = 'Recent Rewards'; lc5.appendChild(rwt);
    var rwl = document.createElement('div'); rwl.style.cssText = 'background:var(--bg2);border:1px solid var(--border);border-radius:7px;overflow:hidden;';
    [
      { label: '+10 pts',   time: 'Yesterday',  color: '#fbbf24' },
      { label: 'Bonus Day', time: '3 days ago', color: '#34d399' },
      { label: '+5 pts',    time: '5 days ago', color: '#355A99' },
    ].forEach(function(rw, i) {
      var rwr = document.createElement('div'); rwr.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:7px 10px;' + (i < 2 ? 'border-bottom:1px solid var(--border);' : '');
      var rl = document.createElement('div'); rl.style.cssText = 'font-size:0.72rem;font-weight:700;color:' + rw.color + ';'; rl.textContent = rw.label;
      var rt = document.createElement('div'); rt.style.cssText = 'font-size:0.66rem;color:var(--text3);'; rt.textContent = rw.time;
      rwr.appendChild(rl); rwr.appendChild(rt); rwl.appendChild(rwr);
    });
    lc5.appendChild(rwl);
    cols5.appendChild(lc5);

    /* Right: Forest */
    var rc5 = document.createElement('div');
    var rft = document.createElement('div'); rft.style.cssText = 'font-size:0.7rem;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:var(--text3);margin-bottom:10px;'; rft.textContent = 'YOUR FOREST \u2014 12 Trees Planted'; rc5.appendChild(rft);
    var fs5 = document.createElement('div'); fs5.style.cssText = 'background:linear-gradient(180deg,#0a2e1a 0%,#0f4d2a 60%,#1a6b3c 100%);min-height:130px;position:relative;border-radius:8px;overflow:hidden;margin-bottom:8px;';
    [
      { species: 'cherry_blossom', left: '4%',  bottom: '8%',  width: 44, name: 'Cherry Blossom' },
      { species: 'mighty_oak',     left: '18%', bottom: '5%',  width: 54, name: 'Mighty Oak'     },
      { species: 'coconut_palm',   left: '33%', bottom: '7%',  width: 40, name: 'Coconut Palm'   },
      { species: 'apple_tree',     left: '49%', bottom: '4%',  width: 50, name: 'Apple Tree'     },
      { species: 'lucky_bamboo',   left: '63%', bottom: '10%', width: 36, name: 'Lucky Bamboo'   },
      { species: 'blue_spruce',    left: '76%', bottom: '6%',  width: 50, name: 'Blue Spruce'    },
    ].forEach(function(t) {
      var td5 = document.createElement('div'); td5.style.cssText = 'position:absolute;left:' + t.left + ';bottom:' + t.bottom + ';width:' + t.width + 'px;cursor:pointer;'; td5.title = t.name;
      var im5 = document.createElement('img'); im5.src = 'https://tree-showcase-omega.vercel.app/trees/stages/' + t.species + '_full.png'; im5.alt = t.name;
      im5.style.cssText = 'width:100%;height:auto;display:block;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.5));transition:filter 0.2s;';
      im5.onmouseenter = function() { im5.style.filter = 'drop-shadow(0 3px 12px rgba(255,255,255,0.3))'; };
      im5.onmouseleave = function() { im5.style.filter = 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))'; };
      im5.onerror = function() { td5.textContent = '\uD83C\uDF33'; td5.style.fontSize = '1.6rem'; };
      td5.appendChild(im5); fs5.appendChild(td5);
    });
    rc5.appendChild(fs5);
    var fst5 = document.createElement('div'); fst5.style.cssText = 'font-size:0.7rem;color:var(--text3);text-align:center;margin-bottom:10px;'; fst5.textContent = '6 species \u00B7 3 rare+'; rc5.appendChild(fst5);
    cols5.appendChild(rc5);
    pane.appendChild(cols5);

    /* Badges grid */
    var bgt = document.createElement('div'); bgt.style.cssText = 'font-size:0.7rem;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:var(--text3);margin-bottom:10px;'; bgt.textContent = 'ACHIEVEMENT BADGES'; pane.appendChild(bgt);
    var bgd = document.createElement('div'); bgd.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:8px;';
    [
      { icon: '\uD83C\uDF1F', name: 'First Close',   desc: 'Closed your first case',     unlocked: true  },
      { icon: '\u2694\uFE0F', name: 'Week Warrior',  desc: '7-day activity streak',       unlocked: true  },
      { icon: '\uD83D\uDD25', name: '10-Day Streak', desc: 'Ten consecutive active days', unlocked: true  },
      { icon: '\uD83C\uDFC6', name: 'Top 3 Weekly',  desc: 'Reached weekly podium',       unlocked: true  },
      { icon: '\uD83D\uDCCA', name: '50 Activities', desc: 'Log 50 total activities',     unlocked: false },
      { icon: '\uD83D\uDC51', name: 'Legend Status', desc: 'Reach 1,000 total points',    unlocked: false },
    ].forEach(function(b) {
      var bc = document.createElement('div'); bc.style.cssText = 'background:var(--bg2);border:1px solid ' + (b.unlocked ? 'rgba(52,211,153,0.25)' : 'var(--border)') + ';border-radius:8px;padding:10px 8px;text-align:center;' + (b.unlocked ? '' : 'opacity:0.5;');
      var bi = document.createElement('div'); bi.style.cssText = 'font-size:1.4rem;margin-bottom:4px;' + (b.unlocked ? '' : 'filter:grayscale(1);'); bi.textContent = b.icon;
      var bn = document.createElement('div'); bn.style.cssText = 'font-size:0.7rem;font-weight:700;color:var(--text);margin-bottom:2px;'; bn.textContent = b.name;
      var bd = document.createElement('div'); bd.style.cssText = 'font-size:0.62rem;color:var(--text3);line-height:1.4;'; bd.textContent = b.desc;
      var bs = document.createElement('div'); bs.style.cssText = 'margin-top:5px;font-size:0.65rem;font-weight:700;color:' + (b.unlocked ? 'var(--green-bright)' : 'var(--text3)') + ';'; bs.textContent = b.unlocked ? '\u2705 Unlocked' : '\uD83D\uDD12 Locked';
      bc.appendChild(bi); bc.appendChild(bn); bc.appendChild(bd); bc.appendChild(bs); bgd.appendChild(bc);
    });
    pane.appendChild(bgd);
  })();

  /* Activate overview tab by default */
  atSwitchTab('overview');
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

    /* Progress summary */
    var summary = document.createElement('div');
    summary.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;';
    var summaryLeft = document.createElement('div');
    var summaryTitle = document.createElement('div');
    summaryTitle.style.cssText = 'font-size:0.85rem;font-weight:700;color:var(--text);';
    summaryTitle.textContent = 'Phase 2 of 5 \u2014 47% complete';
    var summarySubt = document.createElement('div');
    summarySubt.style.cssText = 'font-size:0.72rem;color:var(--text3);margin-top:2px;';
    summarySubt.textContent = 'Current focus: Product Knowledge';
    summaryLeft.appendChild(summaryTitle);
    summaryLeft.appendChild(summarySubt);
    var summaryPct = document.createElement('div');
    summaryPct.style.cssText = 'font-size:1.6rem;font-weight:800;color:var(--primary-light);line-height:1;';
    summaryPct.textContent = '47%';
    summary.appendChild(summaryLeft);
    summary.appendChild(summaryPct);
    pane.appendChild(summary);

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
    heading.style.cssText = 'margin-top:0;margin-bottom:14px;';
    heading.textContent = 'Product Categories';
    pane.appendChild(heading);

    var categories = [
      { id: 'life',    icon: '\uD83D\uDEE1\uFE0F', name: 'Life Insurance',     sub: 'Term, Whole Life, ILP',            items: ['Term Life \u2014 affordable pure protection', 'Whole Life \u2014 lifetime cover with cash value', 'ILP \u2014 investment + life cover combined', 'Key rider: Critical Illness, TPD, WOP'] },
      { id: 'health',  icon: '\uD83C\uDFE5',       name: 'Health Insurance',   sub: 'Shield Plans, CI, Hospital',       items: ['MediShield Life \u2014 mandatory base layer', 'Integrated Shield Plans \u2014 private ward top-up', 'Critical Illness \u2014 lump sum on diagnosis', 'Hospital Cash \u2014 daily income benefit'] },
      { id: 'invest',  icon: '\uD83D\uDCC8',       name: 'Investment Products',sub: 'Unit Trusts, ETFs, ILPs',          items: ['Unit Trusts \u2014 pooled managed funds', 'ETFs \u2014 index-tracking, exchange-listed', 'ILPs \u2014 insurance wrapper over funds', 'RSP \u2014 regular savings plan'] },
      { id: 'retire',  icon: '\uD83C\uDFD6\uFE0F', name: 'Retirement',         sub: 'CPF, Annuities, RSP',              items: ['CPF Life \u2014 national annuity scheme', 'Supplementary Retirement Scheme (SRS)', 'Private annuities \u2014 guaranteed payout', 'Retirement Sum Scheme options'] },
      { id: 'general', icon: '\uD83C\uDFE0',       name: 'General Insurance',  sub: 'Motor, Travel, Property',          items: ['Motor \u2014 TPFT and comprehensive', 'Travel \u2014 medical, cancellation, baggage', 'Home Contents & Fire insurance', 'Personal Accident \u2014 daily payout'] },
      { id: 'biz',     icon: '\uD83D\uDCBC',       name: 'Business Solutions', sub: 'Group Insurance, Key Man',         items: ['Group Term Life \u2014 employee benefit', 'Key Man Insurance \u2014 protect key personnel', 'Business Continuity planning', 'Group health & hospitalisation'] },
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

      var subEl = document.createElement('div');
      subEl.style.cssText = 'font-size:0.68rem;color:var(--text3);margin-bottom:0;';
      subEl.textContent = cat.sub;

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
      card.appendChild(subEl);
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
    var hint = document.createElement('div');
    hint.style.cssText = 'font-size:0.72rem;color:var(--text3);margin-bottom:16px;';
    hint.textContent = 'Click a card to reveal the answer';
    pane.appendChild(heading);
    pane.appendChild(hint);

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
      },
      {
        q: 'What is Dollar Cost Averaging?',
        a: 'Investing a fixed amount regularly regardless of market conditions. Buys more units when prices are low, fewer when high \u2014 reduces timing risk.',
        diagram: 'Jan $100 \u2192 10 units \u00B7 Feb $100 \u2192 12 units \u00B7 Avg cost < market price',
      },
      {
        q: 'Explain the Total Wealth Concept',
        a: 'Three pillars: Human Capital (earning power), Financial Capital (accumulated assets), and Passive Income (dividends, annuities). Goal: grow financial capital as human capital peaks then declines.',
        diagram: 'Human Capital \u2193 over time + Financial Capital \u2191 = Retirement readiness',
      },
    ];

    var cardsGrid = document.createElement('div');
    cardsGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;';

    conceptCards.forEach(function(cc, i) {
      var scene = document.createElement('div');
      scene.className = 'cp-flip-scene';

      var flipCard = document.createElement('div');
      flipCard.className = 'cp-flip-card';
      flipCard.id = 'cpFlip_' + i;

      /* Front */
      var front = document.createElement('div');
      front.className = 'cp-flip-front';

      var qLabel = document.createElement('div');
      qLabel.style.cssText = 'font-size:0.62rem;color:var(--text3);font-weight:700;letter-spacing:0.06em;text-transform:uppercase;';
      qLabel.textContent = 'Question';

      var qText = document.createElement('div');
      qText.style.cssText = 'font-size:0.8rem;font-weight:600;color:var(--text);line-height:1.4;flex:1;display:flex;align-items:center;';
      qText.textContent = cc.q;

      var tapHint = document.createElement('div');
      tapHint.style.cssText = 'font-size:0.62rem;color:var(--primary-light);text-align:right;';
      tapHint.textContent = 'Click to flip \u2192';

      front.appendChild(qLabel);
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
          { title: 'New Grad Approach', uses: 284, lines: ['"Hi, is this [Name]? I\'m Leo from AIA. Congrats on graduating \u2014 I work with a lot of fresh graduates on getting their financial basics right..."', '"I know it might not be top of mind yet, but the best time to start is when you have zero commitments. Do you have 15 minutes this week?"'] },
          { title: 'Working Professional Approach', uses: 512, lines: ['"Hi [Name], I noticed we\'re both connected through [mutual contact]. I help working professionals in their 30s make sure their income is protected and their savings are actually growing..."', '"A lot of my clients started with just a quick review \u2014 no commitment at all. Would that be useful for you?"'] },
          { title: 'Parent Approach', uses: 196, lines: ['"Hi [Name], I specialise in working with young parents to make sure the family is covered if anything unexpected happens..."', '"Most parents I speak to don\'t realise there are gaps in their coverage until something happens. I can do a free coverage review \u2014 takes 20 minutes."'] },
        ],
      },
      {
        label: 'SMS/WhatsApp',
        scripts: [
          { title: 'Cold Introduction', uses: 341, lines: ['"Hi [Name], I\'m Leo, a financial consultant with AIA. I help young professionals with financial planning. Would you be open to a quick 20-min chat?"', '"No pressure at all \u2014 even if we decide it\'s not the right fit, you\'ll walk away with clarity on where you stand financially."'] },
          { title: 'Post-Meeting Follow-up', uses: 228, lines: ['"Hi [Name]! Great meeting you today. As promised, I\'ve sent the proposal to your email. Let me know if you have questions \u2014 happy to walk through it."', '"I\'ll follow up in 3 days. In the meantime, feel free to WhatsApp me anytime \uD83D\uDE0A"'] },
        ],
      },
      {
        label: 'Objection Handling',
        scripts: [
          { title: '"I need to think about it"', uses: 673, lines: ['"Of course, this is an important decision. Can I ask what specifically you\'d like to think through? That way I can make sure you have all the info you need."', '"Usually when clients say that, there\'s either a concern about affordability, timing, or they\'re not 100% sure it\'s suitable. Which of those resonates most with you?"'] },
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
          { title: 'Annual Policy Review', uses: 208, lines: ['"Hi [Name]! It\'s been about a year since we set up your policy. I\'d love to do a quick annual review \u2014 life changes and we want to make sure you\'re still fully covered."', '"Takes 30 minutes, and we can do it over Zoom. When works best for you this month?"'] },
          { title: 'Birthday/Life Event', uses: 176, lines: ['"Happy birthday [Name]! \uD83C\uDF89 Hope you have an amazing year ahead. Just a quick check-in \u2014 any big life changes this year? New job, house, baby? Those can affect your coverage needs."', '"No rush to review now, but whenever you\'re ready, I\'m here. Take care!"'] },
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
        cardTop.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;';

        var cardTitle = document.createElement('div');
        cardTitle.style.cssText = 'font-size:0.8rem;font-weight:700;color:var(--text);';
        cardTitle.textContent = sc.title;

        var usageBadge = document.createElement('div');
        usageBadge.style.cssText = 'font-size:0.65rem;color:var(--text3);background:var(--bg1);border:1px solid var(--border);border-radius:var(--radius-pill);padding:2px 8px;';
        usageBadge.textContent = sc.uses + ' uses';

        cardTop.appendChild(cardTitle);
        cardTop.appendChild(usageBadge);
        card.appendChild(cardTop);

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
    scenarioBox.style.cssText = 'background:rgba(107,155,219,0.1);border:1px solid var(--primary-light);border-radius:var(--radius-sm);padding:10px 14px;margin-bottom:14px;font-size:0.75rem;color:var(--primary-light);font-weight:600;';
    scenarioBox.textContent = 'Scenario: Mr. Tan, 38, married with 2 kids. Employed, asking about retirement planning. No existing coverage review done.';
    pane.appendChild(scenarioBox);

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
    heading.style.cssText = 'margin-top:0;margin-bottom:14px;';
    heading.textContent = 'Video Lectures';
    pane.appendChild(heading);

    var lectures = [
      { title: 'Understanding Whole Life Insurance', duration: '12:30', watched: 100, notes: 3 },
      { title: 'CPF & Retirement Planning',          duration: '18:45', watched: 65,  notes: 5 },
      { title: 'Objection Handling Masterclass',      duration: '24:12', watched: 30,  notes: 1 },
      { title: 'First Client Meeting Framework',      duration: '09:58', watched: 0,   notes: 0 },
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
      vtitle.style.cssText = 'font-size:0.78rem;font-weight:600;color:var(--text);line-height:1.3;margin-bottom:8px;';
      vtitle.textContent = lec.title;

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

  var dashMetrics = [
    { label: 'Total Spend',       value: '$4,280',  color: '#3b82f6' },
    { label: 'Total Leads',       value: '142',     color: '#34d399' },
    { label: 'Avg CPL',           value: '$30.14',  color: '#f59e0b' },
    { label: 'CTR',               value: '2.8%',    color: '#a78bfa' },
    { label: 'Active Campaigns',  value: '5',       color: '#34d399' },
    { label: 'ROAS',              value: '3.2x',    color: '#f59e0b' },
  ];
  var dashGrid = _lp_el('div', 'display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px;');
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
    { name:'Retirement Planning',  status:'active',  budget:'$50/d', spend:'$1,820', leads:54,  cpl:33.70, target:35 },
    { name:'Health Shield Promo',  status:'active',  budget:'$40/d', spend:'$1,120', leads:38,  cpl:29.47, target:35 },
    { name:'Seminar Registration', status:'active',  budget:'$30/d', spend:'$690',   leads:23,  cpl:30.00, target:35 },
    { name:'Brand Story Q2',       status:'paused',  budget:'$25/d', spend:'$450',   leads:15,  cpl:30.00, target:35 },
    { name:'Insurance Retarget',   status:'active',  budget:'$20/d', spend:'$200',   leads:12,  cpl:16.67, target:25 },
  ];
  campaigns.forEach(function(c, i) {
    var cplColor = c.cpl < c.target * 0.9 ? '#34d399' : c.cpl > c.target ? '#ef4444' : '#f59e0b';
    var row = _lp_el('div',
      'display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1fr 1fr;padding:12px 16px;gap:8px;align-items:center;font-size:13px;' +
      (i % 2 === 1 ? 'background:rgba(255,255,255,0.02);' : '') +
      'border-top:1px solid rgba(255,255,255,0.05);');
    row.appendChild(_lp_el('div', 'color:#fff;font-weight:500;', c.name));
    var badge = _lp_el('div',
      'display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;' +
      (c.status === 'active' ? 'background:rgba(52,211,153,0.15);color:#34d399;' : 'background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.4);'),
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
  bpPanel.appendChild(_lp_el('div', 'font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:24px;', 'Pre-built campaign templates. Assign to any client in one click.'));

  var blueprints = [
    { icon: '\ud83d\udcca', name: 'Insurance Lead Gen',   cat: 'Lead Gen',   catColor: '#3b82f6', budget: '$30/day', clients: 12 },
    { icon: '\ud83c\udf93', name: 'Seminar Registration', cat: 'Event',      catColor: '#f59e0b', budget: '$25/day', clients: 8  },
    { icon: '\ud83c\udf1f', name: 'Brand Story',          cat: 'Awareness',  catColor: '#a78bfa', budget: '$20/day', clients: 15 },
    { icon: '\ud83c\udfe6', name: 'Retirement Planning',  cat: 'Lead Gen',   catColor: '#3b82f6', budget: '$40/day', clients: 11 },
    { icon: '\ud83d\udee1\ufe0f', name: 'Health Shield Promo',  cat: 'Lead Gen',   catColor: '#3b82f6', budget: '$35/day', clients: 7  },
    { icon: '\ud83d\udcc5', name: 'Year-End Campaign',    cat: 'Awareness',  catColor: '#a78bfa', budget: '$50/day', clients: 5  },
  ];
  var bpGrid = _lp_el('div', 'display:grid;grid-template-columns:repeat(3,1fr);gap:16px;');
  blueprints.forEach(function(bp) {
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

  // Summary bar
  var summaryBar = _lp_el('div',
    'display:flex;gap:24px;padding:12px 20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;margin-bottom:20px;font-size:13px;color:rgba(255,255,255,0.6);flex-wrap:wrap;');
  ['142 leads','38 qualified','12 converted','$30.14 avg CPL'].forEach(function(s, i) {
    if (i > 0) summaryBar.appendChild(_lp_el('span', 'color:rgba(255,255,255,0.15);', '|'));
    summaryBar.appendChild(_lp_el('span', 'color:#fff;font-weight:600;', s));
  });
  leadPanel.appendChild(summaryBar);

  // Table header
  var ltWrap = _lp_el('div', 'background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden;');
  var ltHead = _lp_el('div',
    'display:grid;grid-template-columns:1.5fr 2fr 1.4fr 1.6fr 1fr 1.2fr 1fr;' +
    'padding:10px 16px;background:rgba(255,255,255,0.05);font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;gap:8px;');
  ['Name','Email','Phone','Campaign','Quality','Status','Date'].forEach(function(h) { ltHead.appendChild(_lp_el('div','',h)); });
  ltWrap.appendChild(ltHead);

  var leadsData = [
    { name:'Ahmad Razif',     email:'ahmad.r@gmail.com',   phone:'+65 9123 4567', campaign:'Insurance Lead Gen',  quality:92, date:'Mar 30' },
    { name:'Sarah Lim',       email:'sarah.lim@yahoo.com', phone:'+65 8234 5678', campaign:'Seminar Registration',quality:78, date:'Mar 30' },
    { name:'David Chen',      email:'dchen@hotmail.com',   phone:'+65 9345 6789', campaign:'Retirement Planning', quality:65, date:'Mar 29' },
    { name:'Priya Nair',      email:'priya.n@gmail.com',   phone:'+65 8456 7890', campaign:'Health Shield Promo', quality:88, date:'Mar 29' },
    { name:'Kevin Tan',       email:'ktan@outlook.com',    phone:'+65 9567 8901', campaign:'Insurance Lead Gen',  quality:45, date:'Mar 28' },
    { name:'Michelle Wong',   email:'mwong@gmail.com',     phone:'+65 8678 9012', campaign:'Brand Story',         quality:72, date:'Mar 27' },
    { name:'Raj Sharma',      email:'raj.s@gmail.com',     phone:'+65 9789 0123', campaign:'Insurance Lead Gen',  quality:28, date:'Mar 27' },
    { name:'Hui Ling Chua',   email:'hlchua@yahoo.com',    phone:'+65 8890 1234', campaign:'Retirement Planning', quality:81, date:'Mar 26' },
  ];

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
      'display:grid;grid-template-columns:1.5fr 2fr 1.4fr 1.6fr 1fr 1.2fr 1fr;padding:11px 16px;gap:8px;align-items:center;font-size:12px;' +
      (idx % 2 === 1 ? 'background:rgba(255,255,255,0.02);' : '') +
      'border-top:1px solid rgba(255,255,255,0.05);');
    row.appendChild(_lp_el('div','color:#fff;font-weight:500;', lead.name));
    row.appendChild(_lp_el('div','color:rgba(255,255,255,0.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;', lead.email));
    row.appendChild(_lp_el('div','color:rgba(255,255,255,0.5);', lead.phone));
    row.appendChild(_lp_el('div','color:rgba(255,255,255,0.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;', lead.campaign));
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

  var rowTop = _lp_el('div','display:flex;gap:20px;flex-wrap:wrap;align-items:flex-start;');
  rowTop.appendChild(_lp_mkFbFeed('s'));
  rowTop.appendChild(_lp_mkIgStory('s'));
  rowTop.appendChild(_lp_mkFbRight('s'));
  previewsCol.appendChild(rowTop);
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
      { id:'lead_gen',    icon:'\ud83d\udcca', name:'Lead Generation',  desc:'Collect qualified leads using a Facebook instant form. Best for insurance and financial advisory.', badge:'Most Popular' },
      { id:'brand',       icon:'\ud83c\udf1f', name:'Brand Awareness',  desc:'Maximise reach and impressions. Best for building trust and visibility before events.' },
      { id:'event',       icon:'\ud83d\udcc5', name:'Event Promotion',  desc:'Drive seminar and webinar registrations with urgency-based creative and countdown hooks.' },
      { id:'retargeting', icon:'\ud83d\udd01', name:'Retargeting',      desc:'Re-engage website visitors and video viewers with personalised follow-up ads.' },
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
      card.appendChild(_lp_el('div','font-size:12px;color:rgba(255,255,255,0.5);line-height:1.6;',tpl.desc));
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

  profileTop.appendChild(avatarCard);
  profileTop.appendChild(detailsCard);
  profilePanel.appendChild(profileTop);

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
  surplusLbl.textContent = 'Monthly Surplus';
  surplusLbl.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:3px;';
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

  var goalsData = [
    { icon: '\uD83D\uDE97', name: 'Buy Car',      age: 28, year: 2028, cost: '$80,000',     saved: 15000, total: 80000,   sources: ['Cash'],         color: '#f59e0b' },
    { icon: '\uD83C\uDFE0', name: 'Buy HDB',      age: 30, year: 2030, cost: '$600,000',    saved: 55000, total: 600000,  sources: ['CPF', 'Loan'],  color: '#6b9bdb' },
    { icon: '\uD83D\uDC8D', name: 'Wedding',      age: 32, year: 2032, cost: '$50,000',     saved: 5000,  total: 50000,   sources: ['Cash'],         color: '#a78bfa' },
    { icon: '\uD83D\uDC76', name: 'First Child',  age: 33, year: 2033, cost: '$15,000/yr',  saved: 0,     total: 15000,   sources: ['Cash'],         color: '#34d399' },
    { icon: '\uD83C\uDFC6', name: 'Retirement',   age: 62, year: 2062, cost: '$1.2M target',saved: 142000,total: 1200000, sources: ['CPF', 'Cash'],  color: '#C4A24D' },
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
    var goalName = document.createElement('div');
    goalName.textContent = goal.name;
    goalName.style.cssText = 'font-size:14px;font-weight:600;color:#e2e8f0;margin-bottom:6px;';
    var barTrack = document.createElement('div');
    barTrack.style.cssText = 'background:rgba(255,255,255,0.07);border-radius:4px;height:6px;margin-bottom:6px;overflow:hidden;';
    var barFill = document.createElement('div');
    var pct = Math.min(goal.saved / goal.total * 100, 100);
    barFill.style.cssText = 'height:100%;border-radius:4px;background:' + goal.color + ';width:' + pct.toFixed(1) + '%;';
    barTrack.appendChild(barFill);
    var sourcesRow = document.createElement('div');
    sourcesRow.style.cssText = 'display:flex;gap:6px;';
    goal.sources.forEach(function(src) {
      var badge = document.createElement('span');
      badge.textContent = src;
      badge.style.cssText = 'font-size:10px;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.5);';
      sourcesRow.appendChild(badge);
    });
    info.appendChild(goalName);
    info.appendChild(barTrack);
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

  // Milestone markers row
  var milestonesRow = document.createElement('div');
  milestonesRow.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;';
  [
    { icon: '\uD83D\uDE97', label: 'Car', age: 28, color: '#f59e0b' },
    { icon: '\uD83C\uDFE0', label: 'HDB', age: 30, color: '#6b9bdb' },
    { icon: '\uD83D\uDC8D', label: 'Wedding', age: 32, color: '#a78bfa' },
    { icon: '\uD83D\uDC76', label: 'Child', age: 33, color: '#34d399' },
    { icon: '\uD83C\uDFC6', label: 'Retirement', age: 62, color: '#C4A24D' },
  ].forEach(function(m) {
    var chip = document.createElement('div');
    chip.style.cssText = 'display:flex;align-items:center;gap:5px;font-size:12px;padding:4px 10px;border-radius:20px;background:' + m.color + '15;border:1px solid ' + m.color + '30;color:' + m.color + ';';
    chip.textContent = m.icon + ' Age ' + m.age + ' · ' + m.label;
    milestonesRow.appendChild(chip);
  });
  projPanel.appendChild(milestonesRow);

  // Key insight cards
  var insightTitle = document.createElement('div');
  insightTitle.textContent = 'Key Insights';
  insightTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;';
  projPanel.appendChild(insightTitle);

  var insightGrid = document.createElement('div');
  insightGrid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:12px;';
  [
    { label: 'Retirement Ready By',  value: 'Age 60',  color: '#34d399' },
    { label: 'Property Paid Off',    value: 'Age 55',  color: '#6b9bdb' },
    { label: 'Target Net Worth',     value: '$2.8M',   color: '#C4A24D' },
  ].forEach(function(ins) {
    insightGrid.appendChild(fhStatCard(ins.label, ins.value, ins.color, false));
  });
  projPanel.appendChild(insightGrid);

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
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  renderHero();
  renderPlatformGrid();
  initScrollReveal();
});
