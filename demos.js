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
    title: 'Growing Age Calculator',
    desc: '70+ financial calculators for every client conversation',
    features: [
      'Retirement planning',
      'Investment illustrators',
      'Insurance needs',
      'CPF projections',
    ],
  },
  {
    id: 'tracker',
    icon: '🌳',
    iconClass: 'tracker',
    title: 'Activity Tracker',
    desc: 'Gamified team performance with trees, badges & streaks',
    features: [
      'Daily pledge',
      'Isometric forest',
      'Team leaderboards',
      'Manager dashboard',
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
   CALCULATOR DEMO — Growing Age Calculator
   6 tabs: Retirement Planner, Investment Illustrator,
           Insurance Needs, CPF Projector, HDB & Property,
           Tool Overview
   ============================================================ */

/* --- Tab switcher --- */
function calcTab(tab) {
  var tabs    = document.querySelectorAll('#calcDemo .demo-tab');
  var panels  = document.querySelectorAll('#calcDemo .calc-tab-panel');
  tabs.forEach(function(t) {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  panels.forEach(function(p) {
    p.style.display = p.dataset.panel === tab ? '' : 'none';
  });
  // Trigger the right update so charts render at correct size
  var fns = {
    retirement: updateRetirement,
    investment: updateInvestment,
    insurance:  updateInsurance,
    cpf:        updateCPF,
    property:   updateProperty,
  };
  if (fns[tab]) setTimeout(fns[tab], 0);
}

/* --- Slider helper --- */
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

/* --- Two-column demo layout helper --- */
function calcLayout(leftChildren, rightChildren) {
  var wrap = document.createElement('div');
  wrap.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:20px;';

  var left = document.createElement('div');
  var right = document.createElement('div');

  leftChildren.forEach(function(c) { left.appendChild(c); });
  rightChildren.forEach(function(c) { right.appendChild(c); });

  wrap.appendChild(left);
  wrap.appendChild(right);

  // Responsive: stack on narrow panels
  var mq = window.matchMedia('(max-width: 560px)');
  function applyMQ(e) {
    wrap.style.gridTemplateColumns = e.matches ? '1fr' : '1fr 1fr';
  }
  mq.addEventListener('change', applyMQ);
  applyMQ(mq);

  return wrap;
}

/* --- Chart container helper --- */
function calcChartContainer(title, canvasId) {
  var container = document.createElement('div');
  container.className = 'chart-container';

  if (title) {
    var t = document.createElement('div');
    t.className = 'chart-title';
    t.textContent = title;
    container.appendChild(t);
  }

  var canvas = document.createElement('canvas');
  canvas.id = canvasId;
  container.appendChild(canvas);
  return { container: container, canvas: canvas };
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
   TAB 1 — RETIREMENT PLANNER
   ============================================================ */
function buildRetirementPanel() {
  var panel = document.createElement('div');
  panel.className = 'calc-tab-panel';
  panel.dataset.panel = 'retirement';

  var fmtAge    = function(v) { return v + ' yrs'; };
  var fmtDollar = function(v) { return '$' + Number(v).toLocaleString(); };
  var fmtPct    = function(v) { return parseFloat(v).toFixed(1) + '%'; };

  var s1 = calcSlider('retCurAge',   'Current Age',         25,  60,   1,    30,    fmtAge);
  var s2 = calcSlider('retRetAge',   'Retirement Age',      50,  70,   1,    62,    fmtAge);
  var s3 = calcSlider('retExpenses', 'Monthly Expenses',    1000,20000,500,  4000,  fmtDollar);
  var s4 = calcSlider('retSavings',  'Current Savings',     0,   500000,5000,50000, fmtDollar);
  var s5 = calcSlider('retReturn',   'Expected Return',     3,   12,   0.5,  6,     fmtPct);

  wireCalcSlider(s1, 'retCurAgeVal',   fmtAge,    updateRetirement);
  wireCalcSlider(s2, 'retRetAgeVal',   fmtAge,    updateRetirement);
  wireCalcSlider(s3, 'retExpensesVal', fmtDollar, updateRetirement);
  wireCalcSlider(s4, 'retSavingsVal',  fmtDollar, updateRetirement);
  wireCalcSlider(s5, 'retReturnVal',   fmtPct,    updateRetirement);

  var cards = document.createElement('div');
  cards.className = 'result-cards';
  cards.appendChild(calcCard('Total Needed',       'retTotalNeeded', ''));
  cards.appendChild(calcCard('Projected Savings',  'retFutureSav',   'green'));
  cards.appendChild(calcCard('Funding Gap',        'retGap',         'red'));
  cards.appendChild(calcCard('Monthly Top-up Needed', 'retMonthly', 'accent'));

  var chart = calcChartContainer('Savings Growth Projection', 'retChart');

  // Info note below chart
  var note = document.createElement('div');
  note.style.cssText = 'font-size:0.75rem;color:var(--text3);margin-top:8px;line-height:1.5;';
  note.textContent = 'Assumes retirement to age 90. Uses your expected return for savings growth. Monthly top-up needed calculated using future value annuity.';
  chart.container.appendChild(note);

  panel.appendChild(calcLayout([s1, s2, s3, s4, s5, cards], [chart.container]));
  return { panel: panel, canvas: chart.canvas };
}

function updateRetirement() {
  var curAgeEl   = document.getElementById('retCurAge');
  if (!curAgeEl) return;
  var curAge   = parseInt(curAgeEl.value);
  var retAge   = parseInt(document.getElementById('retRetAge').value);
  var expenses = parseFloat(document.getElementById('retExpenses').value);
  var savings  = parseFloat(document.getElementById('retSavings').value);
  var annualReturn = parseFloat(document.getElementById('retReturn').value) / 100;

  var yearsToRetire   = Math.max(retAge - curAge, 0);
  var retirementYears = Math.max(90 - retAge, 0);
  var totalNeeded     = expenses * 12 * retirementYears;
  var futureValue     = savings * Math.pow(1 + annualReturn, yearsToRetire);
  var gap             = Math.max(totalNeeded - futureValue, 0);

  var r = annualReturn / 12;
  var n = yearsToRetire * 12;
  var monthlyNeeded = (n > 0 && r > 0) ? (gap * r) / (Math.pow(1 + r, n) - 1) : (n > 0 ? gap / n : gap);

  var set = function(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; };
  set('retTotalNeeded', Charts.formatCurrency(totalNeeded));
  set('retFutureSav',   Charts.formatCurrency(futureValue));
  set('retGap',         Charts.formatCurrency(gap));
  set('retMonthly',     Charts.formatCurrency(Math.max(monthlyNeeded, 0)));

  // Color gap card red only when gap > 0
  var gapEl = document.getElementById('retGap');
  if (gapEl) {
    gapEl.className = 'result-card-value' + (gap > 0 ? ' red' : ' green');
  }

  // Area chart — cumulative projected savings year by year
  var data = [];
  for (var y = 0; y <= yearsToRetire; y++) {
    var fv = savings * Math.pow(1 + annualReturn, y);
    if (monthlyNeeded > 0 && y > 0 && r > 0) {
      fv += monthlyNeeded * ((Math.pow(1 + r, y * 12) - 1) / r);
    }
    data.push({ value: fv, label: String(curAge + y) });
  }

  var canvas = document.getElementById('retChart');
  if (canvas) Charts.area(canvas, data, { color: '#6b9bdb', height: 210 });
}

/* ============================================================
   TAB 2 — INVESTMENT ILLUSTRATOR
   ============================================================ */
function buildInvestmentPanel() {
  var panel = document.createElement('div');
  panel.className = 'calc-tab-panel';
  panel.dataset.panel = 'investment';
  panel.style.display = 'none';

  var fmtDollar = function(v) { return '$' + Number(v).toLocaleString(); };
  var fmtPct    = function(v) { return parseFloat(v).toFixed(1) + '%'; };
  var fmtYrs    = function(v) { return v + ' yrs'; };

  var s1 = calcSlider('invMonthly',  'Monthly Investment', 100,  10000, 100, 500,  fmtDollar);
  var s2 = calcSlider('invReturn',   'Expected Return',    2,    15,    0.5, 8,    fmtPct);
  var s3 = calcSlider('invDuration', 'Duration',           5,    40,    1,   20,   fmtYrs);

  wireCalcSlider(s1, 'invMonthlyVal',  fmtDollar, updateInvestment);
  wireCalcSlider(s2, 'invReturnVal',   fmtPct,    updateInvestment);
  wireCalcSlider(s3, 'invDurationVal', fmtYrs,    updateInvestment);

  var cards = document.createElement('div');
  cards.className = 'result-cards';
  cards.appendChild(calcCard('Conservative (-2%)', 'invConservative', ''));
  cards.appendChild(calcCard('Base Case',           'invBase',         'green'));
  cards.appendChild(calcCard('Optimistic (+2%)',    'invOptimistic',   'accent'));
  cards.appendChild(calcCard('Total Invested',      'invTotalIn',      'blue'));

  // Compound breakdown info
  var breakdownWrap = document.createElement('div');
  breakdownWrap.style.cssText = 'margin-top:12px;padding:10px 12px;background:var(--surface2);border-radius:8px;border:1px solid var(--border);';
  var breakdownTitle = document.createElement('div');
  breakdownTitle.style.cssText = 'font-size:0.75rem;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;';
  breakdownTitle.textContent = 'Compound Interest Breakdown (Base)';
  var breakdownRows = document.createElement('div');
  breakdownRows.id = 'invBreakdown';
  breakdownRows.style.cssText = 'font-size:0.82rem;color:var(--text2);line-height:1.8;';
  breakdownWrap.appendChild(breakdownTitle);
  breakdownWrap.appendChild(breakdownRows);

  var chart = calcChartContainer('3-Scenario Growth Comparison', 'invChart');

  panel.appendChild(calcLayout([s1, s2, s3, cards, breakdownWrap], [chart.container]));
  return { panel: panel, canvas: chart.canvas };
}

function updateInvestment() {
  var monthlyEl = document.getElementById('invMonthly');
  if (!monthlyEl) return;
  var monthly  = parseFloat(monthlyEl.value);
  var rate     = parseFloat(document.getElementById('invReturn').value) / 100;
  var duration = parseInt(document.getElementById('invDuration').value);

  var calcFV = function(annualRate, years) {
    var r = annualRate / 12;
    var n = years * 12;
    return r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : monthly * n;
  };

  var conservative = calcFV(Math.max(rate - 0.02, 0.005), duration);
  var base         = calcFV(rate, duration);
  var optimistic   = calcFV(rate + 0.02, duration);
  var totalIn      = monthly * duration * 12;
  var interest     = base - totalIn;

  var set = function(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; };
  set('invConservative', Charts.formatCurrency(conservative));
  set('invBase',         Charts.formatCurrency(base));
  set('invOptimistic',   Charts.formatCurrency(optimistic));
  set('invTotalIn',      Charts.formatCurrency(totalIn));

  // Compound breakdown
  var bEl = document.getElementById('invBreakdown');
  if (bEl) {
    bEl.textContent = '';
    var rows = [
      ['Capital invested', Charts.formatCurrency(totalIn)],
      ['Interest earned',  Charts.formatCurrency(interest)],
      ['Total return',     (((base / totalIn) - 1) * 100).toFixed(0) + '%'],
    ];
    rows.forEach(function(r) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;justify-content:space-between;';
      var k = document.createElement('span');
      k.style.color = 'var(--text3)';
      k.textContent = r[0];
      var v = document.createElement('span');
      v.style.fontWeight = '600';
      v.textContent = r[1];
      row.appendChild(k);
      row.appendChild(v);
      bEl.appendChild(row);
    });
  }

  var buildSeries = function(annualRate) {
    var r = annualRate / 12;
    var result = [];
    for (var y = 0; y <= duration; y++) {
      var n = y * 12;
      var fv = n === 0 ? 0 : (r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : monthly * n);
      result.push({ value: fv, label: 'Yr ' + y });
    }
    return result;
  };

  var series = [
    { data: buildSeries(Math.max(rate - 0.02, 0.005)), color: '#64748b', label: 'Conservative' },
    { data: buildSeries(rate),                          color: '#6b9bdb', label: 'Base Case' },
    { data: buildSeries(rate + 0.02),                   color: '#34d399', label: 'Optimistic' },
  ];

  var canvas = document.getElementById('invChart');
  if (canvas) Charts.multiLine(canvas, series, { height: 240 });
}

/* ============================================================
   TAB 3 — INSURANCE NEEDS ASSESSMENT
   ============================================================ */
function buildInsurancePanel() {
  var panel = document.createElement('div');
  panel.className = 'calc-tab-panel';
  panel.dataset.panel = 'insurance';
  panel.style.display = 'none';

  var fmtDollar = function(v) { return '$' + Number(v).toLocaleString(); };
  var fmtNum    = function(v) { return v + (v == 1 ? ' person' : ' people'); };

  var s1 = calcSlider('insIncome',    'Annual Income',      30000,  400000, 5000,  80000,  fmtDollar);
  var s2 = calcSlider('insDeps',      'Dependents',         0,      6,      1,     2,      fmtNum);
  var s3 = calcSlider('insCoverage',  'Existing Life Cover',0,      2000000,25000, 200000, fmtDollar);

  wireCalcSlider(s1, 'insIncomeVal',   fmtDollar, updateInsurance);
  wireCalcSlider(s2, 'insDepsVal',     fmtNum,    updateInsurance);
  wireCalcSlider(s3, 'insCoverageVal', fmtDollar, updateInsurance);

  var cards = document.createElement('div');
  cards.className = 'result-cards';
  cards.appendChild(calcCard('Death Cover Needed',    'insDeath',   ''));
  cards.appendChild(calcCard('TPD Cover Needed',      'insTPD',     'blue'));
  cards.appendChild(calcCard('Critical Illness Need', 'insCI',      'amber'));
  cards.appendChild(calcCard('Total Coverage Gap',    'insGap',     'red'));

  // Gap status legend
  var legend = document.createElement('div');
  legend.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap;margin-top:8px;font-size:0.75rem;';
  [['#34d399','Adequate'],['#C4A24D','Partial'],['#ef4444','Gap']].forEach(function(item) {
    var dot = document.createElement('span');
    dot.style.cssText = 'display:inline-block;width:8px;height:8px;border-radius:50%;background:' + item[0] + ';margin-right:4px;vertical-align:middle;';
    var lbl = document.createElement('span');
    lbl.style.color = 'var(--text3)';
    lbl.textContent = item[1];
    var row = document.createElement('span');
    row.appendChild(dot);
    row.appendChild(lbl);
    legend.appendChild(row);
  });

  var chart = calcChartContainer('Coverage Gap Analysis by Category', 'insChart');
  chart.container.appendChild(legend);

  panel.appendChild(calcLayout([s1, s2, s3, cards], [chart.container]));
  return { panel: panel, canvas: chart.canvas };
}

function updateInsurance() {
  var incomeEl = document.getElementById('insIncome');
  if (!incomeEl) return;
  var income   = parseFloat(incomeEl.value);
  var deps     = parseInt(document.getElementById('insDeps').value);
  var coverage = parseFloat(document.getElementById('insCoverage').value);

  var death    = income * (10 + deps * 2);
  var tpd      = income * 8;
  var ci       = income * 5;
  var hospital = income * 1.5;
  var totalGap = Math.max(death - coverage, 0) + Math.max(tpd - coverage * 0.5, 0) + Math.max(ci - coverage * 0.25, 0);

  var set = function(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; };
  set('insDeath', Charts.formatCurrency(death));
  set('insTPD',   Charts.formatCurrency(tpd));
  set('insCI',    Charts.formatCurrency(ci));
  set('insGap',   Charts.formatCurrency(totalGap));

  // Color-coded coverage bars: compare existing vs need
  var getColor = function(need, have) {
    var ratio = have / need;
    if (ratio >= 1) return '#34d399';
    if (ratio >= 0.5) return '#C4A24D';
    return '#ef4444';
  };

  var items = [
    { label: 'Life / Death', value: death,    color: getColor(death, coverage) },
    { label: 'TPD',          value: tpd,      color: getColor(tpd, coverage * 0.5) },
    { label: 'Critical Ill', value: ci,       color: getColor(ci, coverage * 0.25) },
    { label: 'Hospitalisation', value: hospital, color: getColor(hospital, coverage * 0.1) },
    { label: 'Existing Cover', value: coverage, color: '#475569' },
  ];

  var canvas = document.getElementById('insChart');
  if (canvas) Charts.horizontalBar(canvas, items, { height: 220 });
}

/* ============================================================
   TAB 4 — CPF PROJECTOR
   ============================================================ */
function buildCPFPanel() {
  var panel = document.createElement('div');
  panel.className = 'calc-tab-panel';
  panel.dataset.panel = 'cpf';
  panel.style.display = 'none';

  var fmtAge    = function(v) { return v + ' yrs'; };
  var fmtDollar = function(v) { return '$' + Number(v).toLocaleString(); };

  var s1 = calcSlider('cpfAge',    'Current Age',    25,   55,   1,   30,   fmtAge);
  var s2 = calcSlider('cpfSalary', 'Monthly Salary', 1500, 20000, 500, 5000, fmtDollar);

  wireCalcSlider(s1, 'cpfAgeVal',    fmtAge,    updateCPF);
  wireCalcSlider(s2, 'cpfSalaryVal', fmtDollar, updateCPF);

  var cards = document.createElement('div');
  cards.className = 'result-cards';
  cards.appendChild(calcCard('OA at 65',      'cpfOA',    'green'));
  cards.appendChild(calcCard('SA at 65',      'cpfSA',    'accent'));
  cards.appendChild(calcCard('MA at 65',      'cpfMA',    'blue'));
  cards.appendChild(calcCard('Total CPF',     'cpfTotal', ''));

  // CPF Life & thresholds
  var threshWrap = document.createElement('div');
  threshWrap.style.cssText = 'margin-top:12px;padding:10px 12px;background:var(--surface2);border-radius:8px;border:1px solid var(--border);';
  var threshTitle = document.createElement('div');
  threshTitle.style.cssText = 'font-size:0.75rem;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;';
  threshTitle.textContent = 'CPF Life & Retirement Sums';
  var threshRows = document.createElement('div');
  threshRows.id = 'cpfThresh';
  threshRows.style.cssText = 'font-size:0.82rem;color:var(--text2);line-height:1.9;';
  threshWrap.appendChild(threshTitle);
  threshWrap.appendChild(threshRows);

  var chart = calcChartContainer('OA / SA / MA Growth to Age 65', 'cpfChart');

  // Legend
  var legend = document.createElement('div');
  legend.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap;margin-top:6px;font-size:0.75rem;';
  [['#6b9bdb','OA (2.5%)'],['#34d399','SA (4%)'],['#C4A24D','MA (4%)']].forEach(function(item) {
    var dot = document.createElement('span');
    dot.style.cssText = 'display:inline-block;width:8px;height:8px;border-radius:2px;background:' + item[0] + ';margin-right:4px;vertical-align:middle;';
    var lbl = document.createElement('span');
    lbl.style.color = 'var(--text3)';
    lbl.textContent = item[1];
    var row = document.createElement('span');
    row.appendChild(dot);
    row.appendChild(lbl);
    legend.appendChild(row);
  });
  chart.container.appendChild(legend);

  panel.appendChild(calcLayout([s1, s2, cards, threshWrap], [chart.container]));
  return { panel: panel, canvas: chart.canvas };
}

function updateCPF() {
  var ageEl = document.getElementById('cpfAge');
  if (!ageEl) return;
  var age    = parseInt(ageEl.value);
  var salary = parseFloat(document.getElementById('cpfSalary').value);

  // CPF contribution rates by age: [employee OA, employee SA, employee MA]
  var getRates = function(a) {
    if (a <= 35) return [0.23, 0.06, 0.08];
    if (a <= 45) return [0.21, 0.07, 0.09];
    if (a <= 50) return [0.19, 0.08, 0.10];
    return              [0.15, 0.085, 0.105];
  };

  var OA_RATE = 0.025 / 12;
  var SA_RATE = 0.04  / 12;
  var MA_RATE = 0.04  / 12;

  var oaBal = 0, saBal = 0, maBal = 0;
  var chartData = [];

  for (var y = age; y <= 65; y++) {
    var rates   = getRates(y);
    var oaContr = salary * rates[0];
    var saContr = salary * rates[1];
    var maContr = salary * rates[2];

    for (var m = 0; m < 12; m++) {
      oaBal = oaBal * (1 + OA_RATE) + oaContr;
      saBal = saBal * (1 + SA_RATE) + saContr;
      maBal = maBal * (1 + MA_RATE) + maContr;
    }

    if ((y - age) % 5 === 0 || y === 65) {
      chartData.push({
        label: String(y),
        segments: [
          { value: oaBal, color: '#6b9bdb' },
          { value: saBal, color: '#34d399' },
          { value: maBal, color: '#C4A24D' },
        ],
      });
    }
  }

  var finalOA    = oaBal;
  var finalSA    = saBal;
  var finalMA    = maBal;
  var finalTotal = finalOA + finalSA + finalMA;

  // CPF Life monthly payout estimate (simplified: RA / 240)
  var BRS = 102500, FRS = 205000, ERS = 308700;
  var ra  = Math.min(finalSA, FRS);
  var cpfLifePayout = ra / 240;

  var set = function(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; };
  set('cpfOA',    Charts.formatCurrency(finalOA));
  set('cpfSA',    Charts.formatCurrency(finalSA));
  set('cpfMA',    Charts.formatCurrency(finalMA));
  set('cpfTotal', Charts.formatCurrency(finalTotal));

  // Threshold rows
  var tEl = document.getElementById('cpfThresh');
  if (tEl) {
    tEl.textContent = '';
    var rows = [
      ['BRS (Basic)',    Charts.formatCurrency(BRS),           finalSA >= BRS],
      ['FRS (Full)',     Charts.formatCurrency(FRS),           finalSA >= FRS],
      ['ERS (Enhanced)', Charts.formatCurrency(ERS),          finalSA >= ERS],
      ['CPF Life Est.', '~$' + Math.round(cpfLifePayout).toLocaleString() + '/mo', null],
    ];
    rows.forEach(function(r) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;';
      var k = document.createElement('span');
      k.style.color = 'var(--text3)';
      k.textContent = r[0];
      var v = document.createElement('span');
      v.style.fontWeight = '600';
      v.textContent = r[1];
      if (r[2] !== null) {
        v.style.color = r[2] ? '#34d399' : '#ef4444';
        var badge = document.createElement('span');
        badge.style.cssText = 'font-size:0.65rem;margin-left:4px;padding:1px 5px;border-radius:4px;background:' + (r[2] ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.15)') + ';color:' + (r[2] ? '#34d399' : '#ef4444') + ';';
        badge.textContent = r[2] ? 'Met' : 'Not Met';
        v.appendChild(badge);
      }
      row.appendChild(k);
      row.appendChild(v);
      tEl.appendChild(row);
    });
  }

  var canvas = document.getElementById('cpfChart');
  if (canvas) {
    Charts.stackedBar(canvas, chartData, {
      height: 230,
      legend: [
        { label: 'OA', color: '#6b9bdb' },
        { label: 'SA', color: '#34d399' },
        { label: 'MA', color: '#C4A24D' },
      ],
    });
  }
}

/* ============================================================
   TAB 5 — HDB & PROPERTY CALCULATOR
   ============================================================ */
function buildPropertyPanel() {
  var panel = document.createElement('div');
  panel.className = 'calc-tab-panel';
  panel.dataset.panel = 'property';
  panel.style.display = 'none';

  var fmtDollar = function(v) { return '$' + Number(v).toLocaleString(); };
  var fmtPct    = function(v) { return parseFloat(v).toFixed(1) + '%'; };
  var fmtYrs    = function(v) { return v + ' yrs'; };

  var s1 = calcSlider('propPrice',    'Property Price',      300000,  2000000, 50000,  600000,  fmtDollar);
  var s2 = calcSlider('propDownPct',  'Down Payment %',      5,       50,      5,      25,      fmtPct);
  var s3 = calcSlider('propTenure',   'Loan Tenure',         15,      30,      5,      25,      fmtYrs);
  var s4 = calcSlider('propRate',     'Interest Rate',       2.5,     5.0,     0.1,    3.5,     fmtPct);

  wireCalcSlider(s1, 'propPriceVal',   fmtDollar, updateProperty);
  wireCalcSlider(s2, 'propDownPctVal', fmtPct,    updateProperty);
  wireCalcSlider(s3, 'propTenureVal',  fmtYrs,    updateProperty);
  wireCalcSlider(s4, 'propRateVal',    fmtPct,    updateProperty);

  var cards = document.createElement('div');
  cards.className = 'result-cards';
  cards.appendChild(calcCard('Monthly Payment',    'propMonthly',    'green'));
  cards.appendChild(calcCard('Total Interest',     'propInterest',   'red'));
  cards.appendChild(calcCard("Buyer's Stamp Duty", 'propBSD',        'amber'));
  cards.appendChild(calcCard('Total Upfront Cost', 'propUpfront',    'blue'));

  // BSD breakdown
  var bsdWrap = document.createElement('div');
  bsdWrap.style.cssText = 'margin-top:12px;padding:10px 12px;background:var(--surface2);border-radius:8px;border:1px solid var(--border);';
  var bsdTitle = document.createElement('div');
  bsdTitle.style.cssText = 'font-size:0.75rem;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;';
  bsdTitle.textContent = "Buyer's Stamp Duty Breakdown";
  var bsdRows = document.createElement('div');
  bsdRows.id = 'propBSDBreak';
  bsdRows.style.cssText = 'font-size:0.82rem;color:var(--text2);line-height:1.8;';
  bsdWrap.appendChild(bsdTitle);
  bsdWrap.appendChild(bsdRows);

  var chart = calcChartContainer('Loan Amortisation Overview', 'propChart');

  panel.appendChild(calcLayout([s1, s2, s3, s4, cards, bsdWrap], [chart.container]));
  return { panel: panel, canvas: chart.canvas };
}

function updateProperty() {
  var priceEl = document.getElementById('propPrice');
  if (!priceEl) return;
  var price     = parseFloat(priceEl.value);
  var downPct   = parseFloat(document.getElementById('propDownPct').value) / 100;
  var tenure    = parseInt(document.getElementById('propTenure').value);
  var annualRate = parseFloat(document.getElementById('propRate').value) / 100;

  var downAmt  = price * downPct;
  var loanAmt  = price - downAmt;
  var r        = annualRate / 12;
  var n        = tenure * 12;
  var monthly  = r > 0 ? loanAmt * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : loanAmt / n;
  var totalPay = monthly * n;
  var interest = totalPay - loanAmt;

  // Buyer's Stamp Duty (Singapore residential rates)
  var calcBSD = function(p) {
    var bsd = 0;
    var brackets = [
      [180000, 0.01],
      [180000, 0.02],
      [640000, 0.03],
      [500000, 0.04],
      [1500000, 0.05],
      [Infinity, 0.06],
    ];
    var remaining = p;
    var bsdBreakdown = [];
    brackets.forEach(function(b) {
      if (remaining <= 0) return;
      var chunk = Math.min(remaining, b[0]);
      var tax   = chunk * b[1];
      bsd += tax;
      bsdBreakdown.push([Charts.formatCurrency(chunk) + ' @ ' + (b[1] * 100).toFixed(0) + '%', Charts.formatCurrency(tax)]);
      remaining -= chunk;
    });
    return { total: bsd, breakdown: bsdBreakdown };
  };

  var bsdResult  = calcBSD(price);
  var bsd        = bsdResult.total;
  var upfront    = downAmt + bsd;

  var set = function(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; };
  set('propMonthly',  Charts.formatCurrency(monthly));
  set('propInterest', Charts.formatCurrency(interest));
  set('propBSD',      Charts.formatCurrency(bsd));
  set('propUpfront',  Charts.formatCurrency(upfront));

  // BSD breakdown rows
  var bsdEl = document.getElementById('propBSDBreak');
  if (bsdEl) {
    bsdEl.textContent = '';
    bsdResult.breakdown.forEach(function(row) {
      var r = document.createElement('div');
      r.style.cssText = 'display:flex;justify-content:space-between;';
      var k = document.createElement('span');
      k.style.color = 'var(--text3)';
      k.textContent = row[0];
      var v = document.createElement('span');
      v.style.fontWeight = '600';
      v.textContent = row[1];
      r.appendChild(k);
      r.appendChild(v);
      bsdEl.appendChild(r);
    });
  }

  // Amortisation chart — principal vs interest over time (5-year intervals)
  var items = [];
  var intervalYears = [5, 10, 15, 20, 25, 30].filter(function(y) { return y <= tenure; });
  if (intervalYears[intervalYears.length - 1] !== tenure) intervalYears.push(tenure);
  intervalYears.forEach(function(yr) {
    var paidN = yr * 12;
    var paidMonths = Math.min(paidN, n);
    var paidTotal  = monthly * paidMonths;
    var paidInterest = paidMonths > 0 ? paidTotal - (loanAmt - (r > 0 ? loanAmt * Math.pow(1 + r, paidMonths) - monthly * ((Math.pow(1 + r, paidMonths) - 1) / r) : 0)) : 0;
    // Simplified: interest paid up to year yr
    var bal = loanAmt;
    var intPaid = 0;
    for (var mm = 0; mm < paidMonths; mm++) {
      var intCharge = bal * r;
      intPaid += intCharge;
      bal = bal - (monthly - intCharge);
    }
    items.push({ label: 'Yr ' + yr, value: intPaid, color: '#ef4444' });
  });

  // Multi-line: principal remaining vs interest paid
  var principalData = [], interestData = [];
  var balMut = loanAmt;
  var intAcc = 0;
  for (var yr = 0; yr <= tenure; yr++) {
    for (var mm = 0; mm < 12; mm++) {
      if (balMut > 0) {
        var ic = balMut * r;
        intAcc += ic;
        balMut = Math.max(balMut - (monthly - ic), 0);
      }
    }
    principalData.push({ value: Math.max(balMut, 0), label: 'Yr ' + yr });
    interestData.push({ value: intAcc, label: 'Yr ' + yr });
  }

  var canvas = document.getElementById('propChart');
  if (canvas) {
    Charts.multiLine(canvas, [
      { data: principalData, color: '#6b9bdb', label: 'Loan Balance' },
      { data: interestData,  color: '#ef4444', label: 'Cumul. Interest' },
    ], { height: 240 });
  }
}

/* ============================================================
   TAB 6 — TOOL OVERVIEW (50+ calculators showcase)
   ============================================================ */
function buildToolOverviewPanel() {
  var panel = document.createElement('div');
  panel.className = 'calc-tab-panel';
  panel.dataset.panel = 'overview';
  panel.style.display = 'none';

  var heading = document.createElement('div');
  heading.className = 'demo-section-heading';
  heading.textContent = '50+ Financial Calculators — All Categories';
  panel.appendChild(heading);

  var subNote = document.createElement('div');
  subNote.style.cssText = 'font-size:0.82rem;color:var(--text3);margin-bottom:20px;';
  subNote.textContent = 'Every tool is interactive with real-time results, shareable links, and PDF export. Available on desktop and mobile.';
  panel.appendChild(subNote);

  var categories = [
    {
      name: 'Investment Planning',
      color: '#6b9bdb',
      icon: '📈',
      count: 15,
      tools: [
        { name: 'Regular Savings Plan', desc: 'Monthly DCA projections with 3 scenarios' },
        { name: 'Lump Sum Illustrator', desc: 'Single investment compounding over time' },
        { name: 'Education Fund Planner', desc: 'Target a tuition corpus by enrolment year' },
        { name: 'Emergency Fund Calculator', desc: '3-6 month expenses target with timeline' },
        { name: 'Dollar-Cost Averaging', desc: 'Compare DCA vs lump sum strategies' },
        { name: 'Rule of 72', desc: 'Instant doubling time estimator' },
        { name: 'Inflation Impact Calculator', desc: 'Real purchasing power erosion over time' },
        { name: 'Investment Return Tracker', desc: 'XIRR & annualised return calculator' },
        { name: 'Endowment Illustrator', desc: 'Projected maturity values for endowment plans' },
        { name: 'ILP Fund Projector', desc: 'Investment-linked policy growth calculator' },
        { name: 'Wealth Accumulation Planner', desc: 'Goal-based wealth building roadmap' },
        { name: 'Millionaire Roadmap', desc: 'Monthly savings to reach $1M target' },
        { name: 'Savings Goal Calculator', desc: 'Reverse-engineer any savings target' },
        { name: 'Net Worth Tracker', desc: 'Assets minus liabilities snapshot' },
        { name: 'Cash Flow Analyser', desc: 'Monthly income vs expense optimisation' },
      ],
    },
    {
      name: 'Portfolio & Market',
      color: '#34d399',
      icon: '🌐',
      count: 8,
      tools: [
        { name: 'Portfolio Diversification Check', desc: 'Asset allocation balance by risk profile' },
        { name: 'Risk Tolerance Profiler', desc: '10-question questionnaire with band result' },
        { name: 'Expected Portfolio Return', desc: 'Weighted average return across holdings' },
        { name: 'Rebalancing Calculator', desc: 'Buy/sell orders to restore target weights' },
        { name: 'Dividend Yield Calculator', desc: 'Annualised yield and payout projections' },
        { name: 'Bond Yield Calculator', desc: 'YTM, current yield, and duration' },
        { name: 'S&P 500 Historical Simulator', desc: 'What $X invested in S&P 500 in year Y is now' },
        { name: 'Volatility Impact Tool', desc: 'How standard deviation affects long-run returns' },
      ],
    },
    {
      name: 'Retirement Planning',
      color: '#a78bfa',
      icon: '🏖️',
      count: 6,
      tools: [
        { name: 'Retirement Planner', desc: 'Full savings gap and monthly top-up calc' },
        { name: 'CPF Projector', desc: 'OA/SA/MA balances to age 65 with CPF Life' },
        { name: 'CPF LIFE Estimator', desc: 'Monthly payout under BRS / FRS / ERS' },
        { name: 'SRS Tax Savings Calculator', desc: 'Supplementary Retirement Scheme benefits' },
        { name: 'Retirement Income Planner', desc: '4% drawdown rule with longevity buffer' },
        { name: 'Annuity vs Investment Comparison', desc: 'Guaranteed vs market-linked retirement income' },
      ],
    },
    {
      name: 'Insurance & Protection',
      color: '#ef4444',
      icon: '🛡️',
      count: 15,
      tools: [
        { name: 'Life Insurance Needs Calculator', desc: 'DIME method and income replacement' },
        { name: 'TPD Coverage Estimator', desc: 'Total Permanent Disability lump sum need' },
        { name: 'Critical Illness Gap Analyser', desc: 'CI coverage vs 5-year income benchmark' },
        { name: 'Term vs Whole Life Comparer', desc: 'Break-even and opportunity cost analysis' },
        { name: 'Hospital Coverage Planner', desc: 'Ward class needs vs existing MediShield' },
        { name: 'Disability Income Calculator', desc: 'Monthly benefit to replace income at claim' },
        { name: 'Business Continuity Tool', desc: 'Keyman and partnership insurance sizing' },
        { name: 'Mortgage Insurance Calculator', desc: 'MRTA vs MLTA comparison for home loan' },
        { name: 'Personal Accident Needs', desc: 'PA sum assured based on lifestyle risk' },
        { name: 'Travel Insurance Selector', desc: 'Coverage vs premium for trip profiles' },
        { name: 'Maid Insurance Guide', desc: 'FDW insurance legal requirements checker' },
        { name: 'Premium Budget Planner', desc: 'Total insurance spend as % of income' },
        { name: 'Maternity Benefit Estimator', desc: 'Group H&S and maternity payout guide' },
        { name: 'ILP Breakeven Analyser', desc: 'Years to breakeven on investment component' },
        { name: 'Life Stage Insurance Checker', desc: 'Coverage checklist for each life stage' },
      ],
    },
    {
      name: 'Property & Housing',
      color: '#C4A24D',
      icon: '🏠',
      count: 7,
      tools: [
        { name: 'HDB Affordability Calculator', desc: 'Max loan, grant eligibility, monthly repayment' },
        { name: 'Private Property Calc', desc: 'TDSR, BSD, ABSD, and monthly instalment' },
        { name: "Buyer's Stamp Duty Tool", desc: 'Full BSD breakdown by property price' },
        { name: 'ABSD Calculator', desc: 'Additional BSD for second and third properties' },
        { name: 'Rental Yield Calculator', desc: 'Gross and net yield with vacancy buffer' },
        { name: 'Mortgage Refinance Checker', desc: 'Break-even months for refinancing decision' },
        { name: 'CPF Housing Refund Estimator', desc: 'Accrued interest owed to CPF on sale' },
      ],
    },
    {
      name: 'Tax & Business',
      color: '#64748b',
      icon: '💼',
      count: 6,
      tools: [
        { name: 'Income Tax Calculator', desc: 'Singapore personal tax with reliefs' },
        { name: 'SRS Contribution Optimiser', desc: 'Optimal SRS top-up for maximum tax savings' },
        { name: 'Self-Employed CPF Planner', desc: 'Voluntary CPF contributions for freelancers' },
        { name: 'Business Valuation Estimator', desc: 'EBITDA multiple and DCF for SME owners' },
        { name: 'Staff Benefits Cost Modeller', desc: 'True cost of employee benefits packages' },
        { name: 'Estate Planning Estimator', desc: 'Distribution modelling under Intestate Act' },
      ],
    },
  ];

  categories.forEach(function(cat) {
    // Category section header
    var catHeader = document.createElement('div');
    catHeader.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:10px;margin-top:20px;';

    var catDot = document.createElement('span');
    catDot.style.cssText = 'display:inline-block;width:10px;height:10px;border-radius:50%;background:' + cat.color + ';flex-shrink:0;';

    var catLabel = document.createElement('span');
    catLabel.style.cssText = 'font-size:0.85rem;font-weight:700;color:var(--text1);letter-spacing:.03em;text-transform:uppercase;';
    catLabel.textContent = cat.icon + '  ' + cat.name;

    var catCount = document.createElement('span');
    catCount.style.cssText = 'font-size:0.72rem;padding:2px 7px;border-radius:20px;background:var(--surface2);color:var(--text3);border:1px solid var(--border);margin-left:auto;';
    catCount.textContent = cat.count + ' tools';

    catHeader.appendChild(catDot);
    catHeader.appendChild(catLabel);
    catHeader.appendChild(catCount);
    panel.appendChild(catHeader);

    // Grid of tool cards
    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px;margin-bottom:4px;';

    cat.tools.forEach(function(tool) {
      var card = document.createElement('div');
      card.style.cssText = 'padding:10px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;cursor:default;transition:border-color .15s;';
      card.addEventListener('mouseover', function() {
        card.style.borderColor = cat.color;
      });
      card.addEventListener('mouseout', function() {
        card.style.borderColor = 'var(--border)';
      });

      var toolName = document.createElement('div');
      toolName.style.cssText = 'font-size:0.8rem;font-weight:600;color:var(--text1);margin-bottom:3px;line-height:1.3;';
      toolName.textContent = tool.name;

      var toolDesc = document.createElement('div');
      toolDesc.style.cssText = 'font-size:0.72rem;color:var(--text3);line-height:1.4;';
      toolDesc.textContent = tool.desc;

      card.appendChild(toolName);
      card.appendChild(toolDesc);
      grid.appendChild(card);
    });

    panel.appendChild(grid);
  });

  // Total count footer
  var footer = document.createElement('div');
  footer.style.cssText = 'margin-top:20px;padding:12px 16px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;';
  var footerLeft = document.createElement('span');
  footerLeft.style.cssText = 'font-size:0.82rem;color:var(--text2);font-weight:600;';
  footerLeft.textContent = '57 calculators across 6 categories — all included with Growing Age Calculator';
  var footerRight = document.createElement('span');
  footerRight.style.cssText = 'font-size:0.75rem;color:var(--text3);';
  footerRight.textContent = 'New tools added quarterly';
  footer.appendChild(footerLeft);
  footer.appendChild(footerRight);
  panel.appendChild(footer);

  return { panel: panel };
}

/* ============================================================
   CALCULATOR DEMO RENDERER
   ============================================================ */
DEMO_RENDERERS.calculator = function(container) {
  container.id = 'calcDemo';

  // Tab bar
  var tabBar = document.createElement('div');
  tabBar.className = 'demo-tabs';

  var tabDefs = [
    { key: 'retirement', label: 'Retirement Planner' },
    { key: 'investment',  label: 'Investment Illustrator' },
    { key: 'insurance',   label: 'Insurance Needs' },
    { key: 'cpf',         label: 'CPF Projector' },
    { key: 'property',    label: 'HDB & Property' },
    { key: 'overview',    label: 'All 50+ Tools' },
  ];

  tabDefs.forEach(function(def, i) {
    var btn = document.createElement('button');
    btn.className = 'demo-tab' + (i === 0 ? ' active' : '');
    btn.dataset.tab = def.key;
    btn.textContent = def.label;
    btn.addEventListener('click', function() { calcTab(def.key); });
    tabBar.appendChild(btn);
  });

  container.appendChild(tabBar);

  // Build all panels
  var retResult  = buildRetirementPanel();
  var invResult  = buildInvestmentPanel();
  var insResult  = buildInsurancePanel();
  var cpfResult  = buildCPFPanel();
  var propResult = buildPropertyPanel();
  var ovrResult  = buildToolOverviewPanel();

  container.appendChild(retResult.panel);
  container.appendChild(invResult.panel);
  container.appendChild(insResult.panel);
  container.appendChild(cpfResult.panel);
  container.appendChild(propResult.panel);
  container.appendChild(ovrResult.panel);

  // Initial render of first tab
  setTimeout(updateRetirement, 0);
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
  sub.textContent = "See how Junxiong's suite of tools helps financial advisors close more clients, train faster, and run better campaigns — all in one ecosystem.";

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
  const bodyEl  = document.getElementById('modalBody');

  titleEl.textContent = platform.icon + '  ' + platform.title + ' — Interactive Demo';
  bodyEl.textContent  = '';

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
   ACTIVITY TRACKER DEMO
   ============================================================ */
DEMO_RENDERERS.tracker = function(container) {
  container.id = 'trackerDemo';

  // ---- Tab bar ----
  var tabBar = document.createElement('div');
  tabBar.className = 'demo-tabs';

  var atTabDefs = [
    { key: 'feed',        label: 'Activity Feed'   },
    { key: 'leaderboard', label: 'Leaderboard'     },
    { key: 'habits',      label: 'Habit Tracker'   },
    { key: 'pledge',      label: 'Pledge & Goals'  },
    { key: 'gamification',label: 'Gamification'    },
    { key: 'coaching',    label: 'Coaching'        },
    { key: 'dashboard',   label: 'Sales Dashboard' },
  ];

  atTabDefs.forEach(function(def, i) {
    var btn = document.createElement('button');
    btn.className = 'demo-tab' + (i === 0 ? ' active' : '');
    btn.dataset.tab = def.key;
    btn.textContent = def.label;
    btn.addEventListener('click', function() { atSwitchTab(def.key); });
    tabBar.appendChild(btn);
  });

  container.appendChild(tabBar);

  // ---- Build panels ----
  var panels = {};
  panels.feed        = buildAtFeedPanel();
  panels.leaderboard = buildAtLeaderboardPanel();
  panels.habits      = buildAtHabitsPanel();
  panels.pledge      = buildAtPledgePanel();
  panels.gamification= buildAtGamificationPanel();
  panels.coaching    = buildAtCoachingPanel();
  panels.dashboard   = buildAtDashboardPanel();

  atTabDefs.forEach(function(def, i) {
    panels[def.key].style.display = i === 0 ? '' : 'none';
    panels[def.key].dataset.panel = def.key;
    container.appendChild(panels[def.key]);
  });

  // Render charts in first visible panel after DOM insertion
  setTimeout(function() { atRenderFeedCharts(); }, 0);

  // ================================================================
  // TAB SWITCHER
  // ================================================================
  function atSwitchTab(key) {
    var tabs = container.querySelectorAll('.demo-tab');
    tabs.forEach(function(t) {
      t.classList.toggle('active', t.dataset.tab === key);
    });
    atTabDefs.forEach(function(def) {
      panels[def.key].style.display = def.key === key ? '' : 'none';
    });
    setTimeout(function() {
      if (key === 'feed')        atRenderFeedCharts();
      if (key === 'dashboard')   atRenderDashboardCharts();
    }, 0);
  }

  // ================================================================
  // HELPER: avatar initials bubble
  // ================================================================
  function atAvatar(initials, color) {
    var av = document.createElement('div');
    av.style.cssText = [
      'width:32px', 'height:32px', 'border-radius:50%',
      'background:' + (color || 'var(--bg2)'),
      'border:1px solid var(--border)',
      'display:flex', 'align-items:center', 'justify-content:center',
      'font-size:0.68rem', 'font-weight:700', 'color:var(--text)', 'flex-shrink:0',
    ].join(';');
    av.textContent = initials;
    return av;
  }

  // ================================================================
  // TAB 1: ACTIVITY FEED
  // ================================================================
  function buildAtFeedPanel() {
    var panel = document.createElement('div');

    // Today's progress bar
    var progWrap = document.createElement('div');
    progWrap.className = 'chart-container';
    progWrap.style.cssText = 'padding:14px 16px;margin-bottom:16px;';

    var progHeader = document.createElement('div');
    progHeader.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;';
    var progTitle = document.createElement('div');
    progTitle.style.cssText = 'font-size:0.82rem;font-weight:700;color:var(--text);';
    progTitle.textContent = "Today's Progress";
    var progPts = document.createElement('div');
    progPts.style.cssText = 'font-size:0.82rem;font-weight:700;color:var(--primary-light);';
    progPts.textContent = '45 / 60 pts';
    progHeader.appendChild(progTitle);
    progHeader.appendChild(progPts);
    progWrap.appendChild(progHeader);

    var barOuter = document.createElement('div');
    barOuter.style.cssText = 'background:var(--bg1);border-radius:99px;height:10px;overflow:hidden;';
    var barInner = document.createElement('div');
    barInner.style.cssText = 'height:100%;border-radius:99px;width:75%;background:linear-gradient(90deg,#355A99,#6b9bdb);transition:width 0.6s ease;';
    barOuter.appendChild(barInner);
    progWrap.appendChild(barOuter);

    var progSub = document.createElement('div');
    progSub.style.cssText = 'font-size:0.72rem;color:var(--text3);margin-top:6px;';
    progSub.textContent = '75% of daily goal — great momentum!';
    progWrap.appendChild(progSub);
    panel.appendChild(progWrap);

    // Activity feed
    var feedWrap = document.createElement('div');
    feedWrap.className = 'chart-container';
    feedWrap.style.cssText = 'padding:16px;';

    var feedTitle = document.createElement('div');
    feedTitle.className = 'demo-section-heading';
    feedTitle.textContent = 'Recent Activity';
    feedWrap.appendChild(feedTitle);

    var feedData = [
      { initials: 'LT', color: '#355A99', name: 'You',         type: 'Closing',          icon: '\uD83D\uDCDD', pts: '+4pt',  time: '2m ago',   bg: 'rgba(53,90,153,0.15)' },
      { initials: 'SL', color: '#0f7b5a', name: 'Sarah Lim',   type: 'Set',              icon: '\uD83D\uDCDE', pts: '+1pt',  time: '14m ago',  bg: 'rgba(15,123,90,0.15)'  },
      { initials: 'JC', color: '#7c3aed', name: 'James Chen',  type: 'Opening',          icon: '\uD83E\uDD1D', pts: '+3pt',  time: '28m ago',  bg: 'rgba(124,58,237,0.15)' },
      { initials: 'RN', color: '#b45309', name: 'Rachel Ng',   type: 'Referral',         icon: '\uD83D\uDD17', pts: '+1pt',  time: '45m ago',  bg: 'rgba(180,83,9,0.15)'   },
      { initials: 'DT', color: '#0e7490', name: 'David Tan',   type: 'Client Servicing', icon: '\uD83D\uDD27', pts: '+2pt',  time: '1h ago',   bg: 'rgba(14,116,144,0.15)' },
      { initials: 'MW', color: '#be185d', name: 'May Wong',    type: 'Closed',           icon: '\u2705',       pts: '+5pt',  time: '2h ago',   bg: 'rgba(190,24,93,0.15)'  },
    ];

    feedData.forEach(function(row) {
      var item = document.createElement('div');
      item.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);';

      var av = atAvatar(row.initials, row.color);
      item.appendChild(av);

      var info = document.createElement('div');
      info.style.cssText = 'flex:1;min-width:0;';
      var nameLine = document.createElement('div');
      nameLine.style.cssText = 'font-size:0.82rem;font-weight:600;color:var(--text);';
      nameLine.textContent = row.name;
      var typeLine = document.createElement('div');
      typeLine.style.cssText = 'font-size:0.75rem;color:var(--text3);margin-top:2px;display:flex;align-items:center;gap:4px;';
      var typeIcon = document.createElement('span');
      typeIcon.textContent = row.icon;
      var typeTxt = document.createElement('span');
      typeTxt.textContent = row.type;
      typeLine.appendChild(typeIcon);
      typeLine.appendChild(typeTxt);
      info.appendChild(nameLine);
      info.appendChild(typeLine);
      item.appendChild(info);

      var right = document.createElement('div');
      right.style.cssText = 'display:flex;flex-direction:column;align-items:flex-end;gap:4px;';
      var ptsBadge = document.createElement('div');
      ptsBadge.style.cssText = 'font-size:0.75rem;font-weight:700;color:var(--green-bright);background:rgba(52,211,153,0.12);padding:2px 8px;border-radius:99px;';
      ptsBadge.textContent = row.pts;
      var timeEl = document.createElement('div');
      timeEl.style.cssText = 'font-size:0.7rem;color:var(--text3);';
      timeEl.textContent = row.time;
      right.appendChild(ptsBadge);
      right.appendChild(timeEl);
      item.appendChild(right);

      feedWrap.appendChild(item);
    });

    panel.appendChild(feedWrap);
    return panel;
  }

  function atRenderFeedCharts() {
    // No canvas charts needed for feed tab
  }

  // ================================================================
  // TAB 2: LEADERBOARD
  // ================================================================
  function buildAtLeaderboardPanel() {
    var panel = document.createElement('div');

    // Podium
    var podiumWrap = document.createElement('div');
    podiumWrap.className = 'chart-container';
    podiumWrap.style.cssText = 'padding:20px;margin-bottom:16px;';

    var podTitle = document.createElement('div');
    podTitle.className = 'demo-section-heading';
    podTitle.textContent = 'Hall of Fame — This Week';
    podiumWrap.appendChild(podTitle);

    var podRow = document.createElement('div');
    podRow.style.cssText = 'display:flex;justify-content:center;align-items:flex-end;gap:16px;margin-bottom:8px;';

    var podData = [
      { rank: 2, initials: 'JC', name: 'James Chen', pts: 395, height: 64,  color: '#C0C0C0', medal: '\uD83E\uDD48' },
      { rank: 1, initials: 'SL', name: 'Sarah Lim',  pts: 428, height: 88,  color: '#FFD700', medal: '\uD83E\uDD47' },
      { rank: 3, initials: 'LT', name: 'You',        pts: 312, height: 48,  color: '#CD7F32', medal: '\uD83E\uDD49' },
    ];

    podData.forEach(function(p) {
      var col = document.createElement('div');
      col.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:6px;';

      var medal = document.createElement('div');
      medal.style.cssText = 'font-size:1.4rem;';
      medal.textContent = p.medal;

      var av = atAvatar(p.initials, p.color + '33');
      av.style.cssText += ';border:2px solid ' + p.color + ';';

      var pName = document.createElement('div');
      pName.style.cssText = 'font-size:0.72rem;font-weight:700;color:var(--text);text-align:center;max-width:70px;';
      pName.textContent = p.name;

      var pPts = document.createElement('div');
      pPts.style.cssText = 'font-size:0.68rem;color:var(--text3);';
      pPts.textContent = p.pts + ' pts';

      var block = document.createElement('div');
      block.style.cssText = 'width:64px;height:' + p.height + 'px;background:' + p.color + '22;border:1px solid ' + p.color + '55;border-radius:4px 4px 0 0;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:800;color:' + p.color + ';';
      block.textContent = '#' + p.rank;

      col.appendChild(medal);
      col.appendChild(av);
      col.appendChild(pName);
      col.appendChild(pPts);
      col.appendChild(block);
      podRow.appendChild(col);
    });

    podiumWrap.appendChild(podRow);
    panel.appendChild(podiumWrap);

    // Full leaderboard table
    var lbWrap = document.createElement('div');
    lbWrap.className = 'chart-container';
    lbWrap.style.cssText = 'padding:16px;';

    var lbTitle = document.createElement('div');
    lbTitle.className = 'demo-section-heading';
    lbTitle.textContent = 'Full Leaderboard';
    lbWrap.appendChild(lbTitle);

    var lbData = [
      { rank: 1, initials: 'SL', name: 'Sarah Lim',    pts: 428, streak: 21, trend: '+12', you: false },
      { rank: 2, initials: 'JC', name: 'James Chen',   pts: 395, streak: 14, trend: '+5',  you: false },
      { rank: 3, initials: 'LT', name: 'You',          pts: 312, streak: 14, trend: '+3',  you: true  },
      { rank: 4, initials: 'RN', name: 'Rachel Ng',    pts: 287, streak: 8,  trend: '-2',  you: false },
      { rank: 5, initials: 'DT', name: 'David Tan',    pts: 264, streak: 5,  trend: '+1',  you: false },
      { rank: 6, initials: 'MW', name: 'May Wong',     pts: 241, streak: 3,  trend: '-4',  you: false },
      { rank: 7, initials: 'BT', name: 'Bryan Teo',    pts: 198, streak: 7,  trend: '+8',  you: false },
      { rank: 8, initials: 'CK', name: 'Cindy Koh',    pts: 176, streak: 2,  trend: '-1',  you: false },
    ];

    var headerRow = document.createElement('div');
    headerRow.style.cssText = 'display:grid;grid-template-columns:36px 1fr 80px 56px 48px;gap:8px;padding:6px 8px;font-size:0.68rem;color:var(--text3);text-transform:uppercase;letter-spacing:0.06em;border-bottom:1px solid var(--border);margin-bottom:4px;';
    ['#', 'Name', 'Points', 'Streak', 'Trend'].forEach(function(h) {
      var hEl = document.createElement('div');
      hEl.textContent = h;
      headerRow.appendChild(hEl);
    });
    lbWrap.appendChild(headerRow);

    lbData.forEach(function(row) {
      var lbRow = document.createElement('div');
      lbRow.style.cssText = 'display:grid;grid-template-columns:36px 1fr 80px 56px 48px;gap:8px;padding:8px;align-items:center;border-radius:6px;' + (row.you ? 'background:rgba(53,90,153,0.15);border:1px solid rgba(107,155,219,0.3);' : '');

      var rankEl = document.createElement('div');
      rankEl.style.cssText = 'font-size:0.75rem;font-weight:700;color:' + (row.rank === 1 ? '#FFD700' : row.rank === 2 ? '#C0C0C0' : row.rank === 3 ? '#CD7F32' : 'var(--text3)') + ';';
      rankEl.textContent = '#' + row.rank;

      var nameWrap = document.createElement('div');
      nameWrap.style.cssText = 'display:flex;align-items:center;gap:8px;';
      var av = atAvatar(row.initials);
      av.style.width = '26px';
      av.style.height = '26px';
      av.style.fontSize = '0.62rem';
      var nameEl = document.createElement('div');
      nameEl.style.cssText = 'font-size:0.8rem;font-weight:' + (row.you ? '700' : '500') + ';color:var(--text);';
      nameEl.textContent = row.name + (row.you ? ' (you)' : '');
      nameWrap.appendChild(av);
      nameWrap.appendChild(nameEl);

      var ptsEl = document.createElement('div');
      ptsEl.style.cssText = 'font-size:0.8rem;font-weight:600;color:var(--primary-light);';
      ptsEl.textContent = row.pts + ' pts';

      var streakEl = document.createElement('div');
      streakEl.style.cssText = 'font-size:0.78rem;color:var(--text2);';
      streakEl.textContent = row.streak + 'd \uD83D\uDD25';

      var trendEl = document.createElement('div');
      var trendUp = row.trend.charAt(0) === '+';
      trendEl.style.cssText = 'font-size:0.75rem;font-weight:600;color:' + (trendUp ? 'var(--green-bright)' : '#ef4444') + ';';
      trendEl.textContent = (trendUp ? '\u2191' : '\u2193') + ' ' + row.trend.slice(1);

      lbRow.appendChild(rankEl);
      lbRow.appendChild(nameWrap);
      lbRow.appendChild(ptsEl);
      lbRow.appendChild(streakEl);
      lbRow.appendChild(trendEl);
      lbWrap.appendChild(lbRow);
    });

    panel.appendChild(lbWrap);
    return panel;
  }

  // ================================================================
  // TAB 3: HABIT TRACKER
  // ================================================================
  function buildAtHabitsPanel() {
    var panel = document.createElement('div');

    var habitWrap = document.createElement('div');
    habitWrap.className = 'chart-container';
    habitWrap.style.cssText = 'padding:16px;margin-bottom:16px;';

    var habitTitle = document.createElement('div');
    habitTitle.className = 'demo-section-heading';
    habitTitle.textContent = 'Weekly Habit Tracker';
    habitWrap.appendChild(habitTitle);

    var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var habits = [
      { name: 'Cold Calls',      streak: 14, checks: [1,1,1,1,1,0,0] },
      { name: 'Client Meetings', streak: 7,  checks: [1,0,1,1,0,1,0] },
      { name: 'Follow-ups',      streak: 5,  checks: [1,1,1,0,1,0,0] },
      { name: 'Social Media',    streak: 21, checks: [1,1,1,1,1,1,0] },
      { name: 'Product Study',   streak: 3,  checks: [0,1,1,1,0,0,0] },
      { name: 'Exercise',        streak: 9,  checks: [1,1,0,1,1,0,0] },
      { name: 'Reading',         streak: 12, checks: [1,1,1,1,1,0,0] },
    ];

    // Header row
    var headerGrid = document.createElement('div');
    headerGrid.style.cssText = 'display:grid;grid-template-columns:140px repeat(7,1fr) 60px;gap:4px;margin-bottom:8px;padding:0 4px;';
    var emptyH = document.createElement('div');
    headerGrid.appendChild(emptyH);
    days.forEach(function(d) {
      var dEl = document.createElement('div');
      dEl.style.cssText = 'text-align:center;font-size:0.68rem;color:var(--text3);font-weight:600;text-transform:uppercase;';
      dEl.textContent = d;
      headerGrid.appendChild(dEl);
    });
    var streakH = document.createElement('div');
    streakH.style.cssText = 'text-align:center;font-size:0.68rem;color:var(--text3);font-weight:600;text-transform:uppercase;';
    streakH.textContent = 'Streak';
    headerGrid.appendChild(streakH);
    habitWrap.appendChild(headerGrid);

    habits.forEach(function(habit) {
      var row = document.createElement('div');
      row.style.cssText = 'display:grid;grid-template-columns:140px repeat(7,1fr) 60px;gap:4px;padding:4px;border-radius:6px;margin-bottom:2px;';
      row.style.cssText += 'align-items:center;';

      var nameEl = document.createElement('div');
      nameEl.style.cssText = 'font-size:0.78rem;color:var(--text2);font-weight:500;padding-right:8px;';
      nameEl.textContent = habit.name;
      row.appendChild(nameEl);

      habit.checks.forEach(function(checked, di) {
        var cell = document.createElement('div');
        cell.style.cssText = 'display:flex;justify-content:center;align-items:center;';
        var dot = document.createElement('div');
        var isToday = di === 4; // Friday = today
        if (isToday && !checked) {
          dot.style.cssText = 'width:22px;height:22px;border-radius:4px;border:2px dashed var(--border);';
        } else if (checked) {
          dot.style.cssText = 'width:22px;height:22px;border-radius:4px;background:var(--primary-light);display:flex;align-items:center;justify-content:center;';
          var tick = document.createElement('span');
          tick.style.cssText = 'color:#fff;font-size:0.7rem;font-weight:700;';
          tick.textContent = '\u2713';
          dot.appendChild(tick);
        } else {
          dot.style.cssText = 'width:22px;height:22px;border-radius:4px;background:var(--bg1);border:1px solid var(--border);opacity:0.5;';
        }
        cell.appendChild(dot);
        row.appendChild(cell);
      });

      var streakEl = document.createElement('div');
      streakEl.style.cssText = 'text-align:center;font-size:0.75rem;font-weight:700;color:var(--green-bright);';
      streakEl.textContent = habit.streak + 'd';
      row.appendChild(streakEl);

      habitWrap.appendChild(row);
    });

    panel.appendChild(habitWrap);

    // Mini heatmap
    var heatWrap = document.createElement('div');
    heatWrap.className = 'chart-container';
    heatWrap.style.cssText = 'padding:16px;';

    var heatTitle = document.createElement('div');
    heatTitle.className = 'demo-section-heading';
    heatTitle.textContent = '4-Week Activity Heatmap';
    heatWrap.appendChild(heatTitle);

    var heatGrid = document.createElement('div');
    heatGrid.style.cssText = 'display:grid;grid-template-columns:repeat(28,1fr);gap:3px;';

    var heatValues = [
      3,5,4,2,5,1,0, 4,3,5,5,4,2,0, 2,4,3,5,5,1,0, 5,4,5,4,4,0,0
    ];
    var heatColors = ['var(--bg1)', 'rgba(53,90,153,0.25)', 'rgba(53,90,153,0.45)', 'rgba(107,155,219,0.6)', 'rgba(107,155,219,0.8)', 'var(--primary-light)'];

    heatValues.forEach(function(v) {
      var cell = document.createElement('div');
      cell.style.cssText = 'height:14px;border-radius:2px;background:' + heatColors[v] + ';';
      heatGrid.appendChild(cell);
    });

    heatWrap.appendChild(heatGrid);

    var heatLegend = document.createElement('div');
    heatLegend.style.cssText = 'display:flex;align-items:center;gap:6px;margin-top:10px;font-size:0.68rem;color:var(--text3);';
    heatLegend.textContent = 'Less ';
    [0,1,2,3,4,5].forEach(function(v) {
      var sq = document.createElement('div');
      sq.style.cssText = 'width:12px;height:12px;border-radius:2px;background:' + heatColors[v] + ';';
      heatLegend.appendChild(sq);
    });
    var moreEl = document.createElement('span');
    moreEl.textContent = ' More';
    heatLegend.appendChild(moreEl);
    heatWrap.appendChild(heatLegend);

    panel.appendChild(heatWrap);
    return panel;
  }

  // ================================================================
  // TAB 4: PLEDGE SHEET & CALCULATOR
  // ================================================================
  function buildAtPledgePanel() {
    var panel = document.createElement('div');

    var twoCol = document.createElement('div');
    twoCol.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:16px;';

    // LEFT: Forward Goal
    var goalWrap = document.createElement('div');
    goalWrap.className = 'chart-container';
    goalWrap.style.cssText = 'padding:16px;';

    var goalTitle = document.createElement('div');
    goalTitle.className = 'demo-section-heading';
    goalTitle.textContent = 'Forward Goal';
    goalWrap.appendChild(goalTitle);

    var fycRow = document.createElement('div');
    fycRow.style.cssText = 'margin-bottom:16px;';
    var fycLabel = document.createElement('div');
    fycLabel.style.cssText = 'font-size:0.75rem;color:var(--text3);margin-bottom:6px;';
    fycLabel.textContent = 'Annual FYC Target';
    var fycValue = document.createElement('div');
    fycValue.style.cssText = 'font-size:1.6rem;font-weight:800;color:var(--primary-light);';
    fycValue.textContent = '$50,000';
    fycRow.appendChild(fycLabel);
    fycRow.appendChild(fycValue);
    goalWrap.appendChild(fycRow);

    var breakdownTitle = document.createElement('div');
    breakdownTitle.style.cssText = 'font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:10px;border-top:1px solid var(--border);padding-top:12px;';
    breakdownTitle.textContent = 'Weekly Activity Required';
    goalWrap.appendChild(breakdownTitle);

    var breakdown = [
      { label: 'Sets needed',     val: '15',  icon: '\uD83D\uDCDE', color: 'var(--text3)' },
      { label: 'Openings',        val: '8',   icon: '\uD83E\uDD1D', color: 'var(--text3)' },
      { label: 'Closings/week',   val: '3',   icon: '\uD83D\uDCDD', color: 'var(--primary-light)' },
      { label: 'Avg case size',   val: '$3,200', icon: '\uD83D\uDCB0', color: 'var(--green-bright)' },
      { label: 'Hit rate needed', val: '37%', icon: '\uD83C\uDFAF', color: 'var(--accent)' },
    ];

    breakdown.forEach(function(b) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--border);';
      var left = document.createElement('div');
      left.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:0.78rem;color:var(--text2);';
      var icon = document.createElement('span');
      icon.textContent = b.icon;
      var lbl = document.createElement('span');
      lbl.textContent = b.label;
      left.appendChild(icon);
      left.appendChild(lbl);
      var val = document.createElement('div');
      val.style.cssText = 'font-size:0.82rem;font-weight:700;color:' + b.color + ';';
      val.textContent = b.val;
      row.appendChild(left);
      row.appendChild(val);
      goalWrap.appendChild(row);
    });

    twoCol.appendChild(goalWrap);

    // RIGHT: Weekly Pledge
    var pledgeWrap = document.createElement('div');
    pledgeWrap.className = 'chart-container';
    pledgeWrap.style.cssText = 'padding:16px;';

    var pledgeTitle = document.createElement('div');
    pledgeTitle.className = 'demo-section-heading';
    pledgeTitle.textContent = 'This Week\'s Pledge';
    pledgeWrap.appendChild(pledgeTitle);

    var pledgeData = [
      { type: 'Set',              target: 15, actual: 12, icon: '\uD83D\uDCDE' },
      { type: 'Opening',          target: 8,  actual: 8,  icon: '\uD83E\uDD1D' },
      { type: 'Closing',          target: 3,  actual: 2,  icon: '\uD83D\uDCDD' },
      { type: 'Closed',           target: 2,  actual: 2,  icon: '\u2705' },
      { type: 'Referral',         target: 4,  actual: 5,  icon: '\uD83D\uDD17' },
      { type: 'Client Servicing', target: 6,  actual: 4,  icon: '\uD83D\uDD27' },
    ];

    var pHeader = document.createElement('div');
    pHeader.style.cssText = 'display:grid;grid-template-columns:1fr 56px 56px 40px;gap:4px;font-size:0.68rem;color:var(--text3);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--border);';
    ['Activity', 'Target', 'Actual', ''].forEach(function(h) {
      var hEl = document.createElement('div');
      hEl.textContent = h;
      pHeader.appendChild(hEl);
    });
    pledgeWrap.appendChild(pHeader);

    pledgeData.forEach(function(row) {
      var met = row.actual >= row.target;
      var pRow = document.createElement('div');
      pRow.style.cssText = 'display:grid;grid-template-columns:1fr 56px 56px 40px;gap:4px;align-items:center;padding:7px 0;border-bottom:1px solid var(--border);';

      var nameCell = document.createElement('div');
      nameCell.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:0.78rem;color:var(--text);';
      var ic = document.createElement('span');
      ic.textContent = row.icon;
      var nm = document.createElement('span');
      nm.textContent = row.type;
      nameCell.appendChild(ic);
      nameCell.appendChild(nm);

      var targetCell = document.createElement('div');
      targetCell.style.cssText = 'font-size:0.78rem;color:var(--text3);text-align:center;';
      targetCell.textContent = row.target;

      var actualCell = document.createElement('div');
      actualCell.style.cssText = 'font-size:0.82rem;font-weight:700;color:' + (met ? 'var(--green-bright)' : 'var(--primary-light)') + ';text-align:center;';
      actualCell.textContent = row.actual;

      var statusCell = document.createElement('div');
      statusCell.style.cssText = 'text-align:center;font-size:0.9rem;';
      statusCell.textContent = met ? '\u2713' : '\u00B7';
      statusCell.style.color = met ? 'var(--green-bright)' : 'var(--text3)';

      pRow.appendChild(nameCell);
      pRow.appendChild(targetCell);
      pRow.appendChild(actualCell);
      pRow.appendChild(statusCell);
      pledgeWrap.appendChild(pRow);
    });

    twoCol.appendChild(pledgeWrap);
    panel.appendChild(twoCol);
    return panel;
  }

  // ================================================================
  // TAB 5: GAMIFICATION
  // ================================================================
  function buildAtGamificationPanel() {
    var panel = document.createElement('div');

    var twoCol = document.createElement('div');
    twoCol.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;';

    // LEFT: Wheel of Fortune
    var wheelWrap = document.createElement('div');
    wheelWrap.className = 'chart-container';
    wheelWrap.style.cssText = 'padding:16px;text-align:center;';

    var wheelTitle = document.createElement('div');
    wheelTitle.className = 'demo-section-heading';
    wheelTitle.textContent = 'Wheel of Fortune';
    wheelWrap.appendChild(wheelTitle);

    // Wheel SVG
    var wheelSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    wheelSvg.setAttribute('viewBox', '0 0 200 200');
    wheelSvg.style.cssText = 'width:160px;height:160px;display:block;margin:0 auto 12px;';
    wheelSvg.id = 'atWheel';

    var segments = [
      { label: '50 Credits',   color: '#355A99', textColor: '#fff' },
      { label: 'Badge',         color: '#C4A24D', textColor: '#fff' },
      { label: '100 Credits',  color: '#0f7b5a', textColor: '#fff' },
      { label: 'Free Coffee',   color: '#7c3aed', textColor: '#fff' },
      { label: '200 Credits',  color: '#be185d', textColor: '#fff' },
      { label: 'Mystery',       color: '#0e7490', textColor: '#fff' },
    ];
    var n = segments.length;
    var cx = 100, cy = 100, r = 90;

    segments.forEach(function(seg, i) {
      var startAngle = (i / n) * 2 * Math.PI - Math.PI / 2;
      var endAngle   = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;

      var x1 = cx + r * Math.cos(startAngle);
      var y1 = cy + r * Math.sin(startAngle);
      var x2 = cx + r * Math.cos(endAngle);
      var y2 = cy + r * Math.sin(endAngle);

      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      var d = 'M ' + cx + ' ' + cy + ' L ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' A ' + r + ' ' + r + ' 0 0 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' Z';
      path.setAttribute('d', d);
      path.setAttribute('fill', seg.color);
      path.setAttribute('stroke', '#1e293b');
      path.setAttribute('stroke-width', '1.5');
      wheelSvg.appendChild(path);

      var midAngle = (startAngle + endAngle) / 2;
      var tr = r * 0.65;
      var tx = cx + tr * Math.cos(midAngle);
      var ty = cy + tr * Math.sin(midAngle);
      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', tx.toFixed(1));
      text.setAttribute('y', ty.toFixed(1));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('fill', seg.textColor);
      text.setAttribute('font-size', '8');
      text.setAttribute('font-weight', '700');
      text.setAttribute('transform', 'rotate(' + ((midAngle * 180 / Math.PI) + 90) + ' ' + tx.toFixed(1) + ' ' + ty.toFixed(1) + ')');
      text.textContent = seg.label;
      wheelSvg.appendChild(text);
    });

    // Center circle
    var centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerCircle.setAttribute('cx', '100');
    centerCircle.setAttribute('cy', '100');
    centerCircle.setAttribute('r', '14');
    centerCircle.setAttribute('fill', '#1e293b');
    centerCircle.setAttribute('stroke', '#334155');
    centerCircle.setAttribute('stroke-width', '2');
    wheelSvg.appendChild(centerCircle);

    // Pointer
    var pointer = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    pointer.setAttribute('points', '100,2 106,14 94,14');
    pointer.setAttribute('fill', '#FFD700');
    wheelSvg.appendChild(pointer);

    wheelWrap.appendChild(wheelSvg);

    var spinBtn = document.createElement('button');
    spinBtn.style.cssText = 'background:var(--primary-light);color:#fff;border:none;border-radius:8px;padding:10px 28px;font-size:0.85rem;font-weight:700;cursor:pointer;transition:transform 0.1s;';
    spinBtn.textContent = 'Spin!';
    var wheelRotation = 0;
    spinBtn.addEventListener('click', function() {
      var degrees = 720 + Math.floor(Math.random() * 360);
      wheelRotation += degrees;
      var allPaths = wheelSvg.querySelectorAll('path,text,circle,polygon');
      wheelSvg.style.transition = 'transform 2s cubic-bezier(0.17,0.67,0.12,0.99)';
      wheelSvg.style.transform = 'rotate(' + wheelRotation + 'deg)';
      wheelSvg.style.transformOrigin = '80px 80px';
    });
    wheelWrap.appendChild(spinBtn);

    twoCol.appendChild(wheelWrap);

    // RIGHT: Credits & Rewards
    var credWrap = document.createElement('div');
    credWrap.className = 'chart-container';
    credWrap.style.cssText = 'padding:16px;';

    var credTitle = document.createElement('div');
    credTitle.className = 'demo-section-heading';
    credTitle.textContent = 'Credits & Rewards';
    credWrap.appendChild(credTitle);

    var credBalance = document.createElement('div');
    credBalance.style.cssText = 'text-align:center;margin-bottom:16px;padding:14px;background:var(--bg1);border-radius:8px;';
    var credNum = document.createElement('div');
    credNum.style.cssText = 'font-size:2rem;font-weight:800;color:var(--accent);';
    credNum.textContent = '1,250';
    var credLbl = document.createElement('div');
    credLbl.style.cssText = 'font-size:0.72rem;color:var(--text3);text-transform:uppercase;letter-spacing:0.06em;';
    credLbl.textContent = 'Credits Balance';
    credBalance.appendChild(credNum);
    credBalance.appendChild(credLbl);
    credWrap.appendChild(credBalance);

    var recentTitle = document.createElement('div');
    recentTitle.style.cssText = 'font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:10px;';
    recentTitle.textContent = 'Recent Rewards';
    credWrap.appendChild(recentTitle);

    var rewardHistory = [
      { reward: '100 Credits',  date: 'Mar 31', icon: '\uD83C\uDF1F' },
      { reward: 'Free Coffee',  date: 'Mar 28', icon: '\u2615'       },
      { reward: '50 Credits',   date: 'Mar 25', icon: '\uD83C\uDF1F' },
      { reward: 'Mystery Prize',date: 'Mar 20', icon: '\uD83C\uDF81' },
    ];

    rewardHistory.forEach(function(rw) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);';
      var icon = document.createElement('span');
      icon.style.cssText = 'font-size:1.1rem;';
      icon.textContent = rw.icon;
      var info = document.createElement('div');
      info.style.cssText = 'flex:1;';
      var rwName = document.createElement('div');
      rwName.style.cssText = 'font-size:0.78rem;font-weight:600;color:var(--text);';
      rwName.textContent = rw.reward;
      var rwDate = document.createElement('div');
      rwDate.style.cssText = 'font-size:0.7rem;color:var(--text3);';
      rwDate.textContent = rw.date;
      info.appendChild(rwName);
      info.appendChild(rwDate);
      row.appendChild(icon);
      row.appendChild(info);
      credWrap.appendChild(row);
    });

    twoCol.appendChild(credWrap);
    panel.appendChild(twoCol);

    // Tree Forest Preview
    var forestWrap = document.createElement('div');
    forestWrap.className = 'chart-container';
    forestWrap.style.cssText = 'padding:16px;';

    var forestTitle = document.createElement('div');
    forestTitle.className = 'demo-section-heading';
    forestTitle.textContent = 'Your Forest — 12 Trees Planted';
    forestWrap.appendChild(forestTitle);

    var forestScene = document.createElement('div');
    forestScene.style.cssText = [
      'background:linear-gradient(180deg,#0a2e1a 0%,#0f4d2a 60%,#1a6b3c 100%)',
      'min-height:180px', 'position:relative', 'border-radius:8px', 'overflow:hidden',
    ].join(';');

    var treeData = [
      { species: 'cherry_blossom', left: '5%',  bottom: '10%', width: 62 },
      { species: 'mighty_oak',     left: '18%', bottom: '6%',  width: 78 },
      { species: 'coconut_palm',   left: '31%', bottom: '8%',  width: 58 },
      { species: 'apple_tree',     left: '44%', bottom: '5%',  width: 70 },
      { species: 'lucky_bamboo',   left: '57%', bottom: '12%', width: 52 },
      { species: 'blue_spruce',    left: '70%', bottom: '7%',  width: 74 },
    ];

    treeData.forEach(function(t) {
      var treeDiv = document.createElement('div');
      treeDiv.style.cssText = 'position:absolute;left:' + t.left + ';bottom:' + t.bottom + ';width:' + t.width + 'px;';
      var img = document.createElement('img');
      img.src = 'https://tree-showcase-omega.vercel.app/trees/stages/' + t.species + '_full.png';
      img.alt = t.species.replace(/_/g, ' ');
      img.style.cssText = 'width:100%;height:auto;display:block;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.5));';
      img.onerror = function() { treeDiv.textContent = '\uD83C\uDF33'; treeDiv.style.fontSize = '2rem'; };
      treeDiv.appendChild(img);
      forestScene.appendChild(treeDiv);
    });

    forestWrap.appendChild(forestScene);
    panel.appendChild(forestWrap);
    return panel;
  }

  // ================================================================
  // TAB 6: COACHING & REFLECTIONS
  // ================================================================
  function buildAtCoachingPanel() {
    var panel = document.createElement('div');

    var twoCol = document.createElement('div');
    twoCol.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;';

    // LEFT: Coaching Calendar
    var calWrap = document.createElement('div');
    calWrap.className = 'chart-container';
    calWrap.style.cssText = 'padding:16px;';

    var calTitle = document.createElement('div');
    calTitle.className = 'demo-section-heading';
    calTitle.textContent = 'Book Coaching Session';
    calWrap.appendChild(calTitle);

    var calDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    var calHours = ['9am', '10am', '11am', '1pm', '2pm', '3pm', '4pm'];
    var booked   = { '10am-Tue': true, '2pm-Thu': true, '9am-Wed': true };
    var yourSlot = '11am-Mon';

    var calHeaderRow = document.createElement('div');
    calHeaderRow.style.cssText = 'display:grid;grid-template-columns:40px repeat(5,1fr);gap:3px;margin-bottom:4px;';
    var emptyCorner = document.createElement('div');
    calHeaderRow.appendChild(emptyCorner);
    calDays.forEach(function(d) {
      var dEl = document.createElement('div');
      dEl.style.cssText = 'text-align:center;font-size:0.65rem;color:var(--text3);font-weight:600;padding:2px;';
      dEl.textContent = d;
      calHeaderRow.appendChild(dEl);
    });
    calWrap.appendChild(calHeaderRow);

    calHours.forEach(function(h) {
      var row = document.createElement('div');
      row.style.cssText = 'display:grid;grid-template-columns:40px repeat(5,1fr);gap:3px;margin-bottom:3px;';
      var hLabel = document.createElement('div');
      hLabel.style.cssText = 'font-size:0.62rem;color:var(--text3);display:flex;align-items:center;padding-right:4px;justify-content:flex-end;';
      hLabel.textContent = h;
      row.appendChild(hLabel);
      calDays.forEach(function(d) {
        var key = h + '-' + d;
        var cell = document.createElement('div');
        var isBooked = booked[key];
        var isYours  = key === yourSlot;
        cell.style.cssText = 'height:22px;border-radius:4px;cursor:pointer;';
        if (isYours) {
          cell.style.background = 'var(--primary-light)';
          cell.style.border = '1px solid rgba(107,155,219,0.6)';
          cell.title = 'Your session';
        } else if (isBooked) {
          cell.style.background = 'rgba(107,155,219,0.15)';
          cell.style.border = '1px solid rgba(107,155,219,0.2)';
          cell.style.opacity = '0.5';
        } else {
          cell.style.background = 'rgba(52,211,153,0.1)';
          cell.style.border = '1px solid rgba(52,211,153,0.2)';
        }
        row.appendChild(cell);
      });
      calWrap.appendChild(row);
    });

    var calLegend = document.createElement('div');
    calLegend.style.cssText = 'display:flex;gap:12px;margin-top:10px;flex-wrap:wrap;';
    [
      { color: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)', label: 'Available' },
      { color: 'var(--primary-light)', border: 'transparent', label: 'Your booking' },
      { color: 'rgba(107,155,219,0.15)', border: 'rgba(107,155,219,0.2)', label: 'Booked' },
    ].forEach(function(l) {
      var item = document.createElement('div');
      item.style.cssText = 'display:flex;align-items:center;gap:5px;font-size:0.68rem;color:var(--text3);';
      var sq = document.createElement('div');
      sq.style.cssText = 'width:12px;height:12px;border-radius:2px;background:' + l.color + ';border:1px solid ' + l.border + ';';
      var lb = document.createElement('span');
      lb.textContent = l.label;
      item.appendChild(sq);
      item.appendChild(lb);
      calLegend.appendChild(item);
    });
    calWrap.appendChild(calLegend);
    twoCol.appendChild(calWrap);

    // RIGHT: Weekly Reflection
    var reflectWrap = document.createElement('div');
    reflectWrap.className = 'chart-container';
    reflectWrap.style.cssText = 'padding:16px;';

    var reflectTitle = document.createElement('div');
    reflectTitle.className = 'demo-section-heading';
    reflectTitle.textContent = 'Weekly Reflection';
    reflectWrap.appendChild(reflectTitle);

    var reflectData = [
      {
        q: 'What went well this week?',
        a: "Exceeded my daily call targets Mon-Thu. Converted 2 out of 3 openings into full proposals. Client referral from Mrs. Lim generated a warm prospect.",
      },
      {
        q: 'What will you improve next week?',
        a: "Follow up on 4 pending proposals before end of week. Increase social media posting to daily. Block 30 mins each morning for product knowledge review.",
      },
    ];

    reflectData.forEach(function(r) {
      var qEl = document.createElement('div');
      qEl.style.cssText = 'font-size:0.75rem;font-weight:700;color:var(--text2);margin-bottom:6px;margin-top:12px;';
      qEl.textContent = r.q;
      var aEl = document.createElement('div');
      aEl.style.cssText = 'font-size:0.78rem;color:var(--text3);line-height:1.6;background:var(--bg1);border-radius:6px;padding:10px 12px;border-left:3px solid var(--primary-light);';
      aEl.textContent = r.a;
      reflectWrap.appendChild(qEl);
      reflectWrap.appendChild(aEl);
    });

    twoCol.appendChild(reflectWrap);
    panel.appendChild(twoCol);

    // AI Coaching suggestion
    var aiWrap = document.createElement('div');
    aiWrap.className = 'chart-container';
    aiWrap.style.cssText = 'padding:16px;';

    var aiHeader = document.createElement('div');
    aiHeader.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:12px;';
    var aiIcon = document.createElement('div');
    aiIcon.style.cssText = 'width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#355A99,#a78bfa);display:flex;align-items:center;justify-content:center;font-size:0.9rem;flex-shrink:0;';
    aiIcon.textContent = '\uD83E\uDD16';
    var aiTitle = document.createElement('div');
    aiTitle.style.cssText = 'font-size:0.82rem;font-weight:700;color:var(--text);';
    aiTitle.textContent = 'AI Coach Feedback';
    aiHeader.appendChild(aiIcon);
    aiHeader.appendChild(aiTitle);
    aiWrap.appendChild(aiHeader);

    var aiMsg = document.createElement('div');
    aiMsg.style.cssText = 'font-size:0.82rem;color:var(--text2);line-height:1.7;background:var(--bg1);border-radius:8px;padding:14px;border:1px solid var(--border);';
    aiMsg.textContent = "Great week, Leo! Your set-to-opening conversion rate of 53% is above team average (42%). Focus area: your closing ratio dropped to 25% — consider practising the 3 objection-handling scripts before your next proposal presentation. Your consistency streak of 14 days is your strongest asset — keep the momentum!";
    aiWrap.appendChild(aiMsg);

    panel.appendChild(aiWrap);
    return panel;
  }

  // ================================================================
  // TAB 7: SALES DASHBOARD
  // ================================================================
  function buildAtDashboardPanel() {
    var panel = document.createElement('div');

    // 4 metric cards
    var cardsGrid = document.createElement('div');
    cardsGrid.className = 'stat-boxes';
    cardsGrid.style.cssText = 'grid-template-columns:repeat(4,1fr);margin-bottom:16px;';

    var metrics = [
      { val: '$42,800', label: 'FYC YTD',       color: 'var(--primary-light)' },
      { val: '18',      label: 'Cases Closed',   color: 'var(--green-bright)'  },
      { val: '$2,378',  label: 'Avg Case Size',  color: 'var(--accent)'        },
      { val: '34%',     label: 'Hit Rate',       color: 'var(--purple)'        },
    ];

    metrics.forEach(function(m) {
      var card = document.createElement('div');
      card.className = 'stat-box';
      var val = document.createElement('div');
      val.className = 'stat-box-value';
      val.style.color = m.color;
      val.textContent = m.val;
      var lbl = document.createElement('div');
      lbl.className = 'stat-box-label';
      lbl.textContent = m.label;
      card.appendChild(val);
      card.appendChild(lbl);
      cardsGrid.appendChild(card);
    });

    panel.appendChild(cardsGrid);

    // Bar chart — Monthly FYC
    var barWrap = document.createElement('div');
    barWrap.className = 'chart-container';
    barWrap.style.cssText = 'padding:16px;margin-bottom:16px;';

    var barTitle = document.createElement('div');
    barTitle.className = 'demo-section-heading';
    barTitle.textContent = 'Monthly FYC (Last 6 Months)';
    barWrap.appendChild(barTitle);

    var barCanvas = document.createElement('canvas');
    barCanvas.id = 'atDashBarChart';
    barWrap.appendChild(barCanvas);
    panel.appendChild(barWrap);

    // Category breakdown table
    var tableWrap = document.createElement('div');
    tableWrap.className = 'chart-container';
    tableWrap.style.cssText = 'padding:16px;';

    var tableTitle = document.createElement('div');
    tableTitle.className = 'demo-section-heading';
    tableTitle.textContent = 'FYC by Category';
    tableWrap.appendChild(tableTitle);

    var catData = [
      { cat: 'Life Insurance',    fyc: 24800, cases: 8,  color: '#355A99'  },
      { cat: 'Health Insurance',  fyc: 12400, cases: 6,  color: '#0f7b5a'  },
      { cat: 'A&H / PA',          fyc: 5600,  cases: 4,  color: '#C4A24D'  },
    ];
    var totalFyc = catData.reduce(function(s, c) { return s + c.fyc; }, 0);

    var tHeader = document.createElement('div');
    tHeader.style.cssText = 'display:grid;grid-template-columns:1fr 80px 56px 80px;gap:8px;font-size:0.68rem;color:var(--text3);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--border);';
    ['Category', 'FYC', 'Cases', 'Share'].forEach(function(h) {
      var hEl = document.createElement('div');
      hEl.textContent = h;
      tHeader.appendChild(hEl);
    });
    tableWrap.appendChild(tHeader);

    catData.forEach(function(row) {
      var pct = Math.round(row.fyc / totalFyc * 100);
      var tRow = document.createElement('div');
      tRow.style.cssText = 'display:grid;grid-template-columns:1fr 80px 56px 80px;gap:8px;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);';

      var catCell = document.createElement('div');
      catCell.style.cssText = 'display:flex;align-items:center;gap:8px;';
      var dot = document.createElement('div');
      dot.style.cssText = 'width:10px;height:10px;border-radius:50%;background:' + row.color + ';flex-shrink:0;';
      var catName = document.createElement('span');
      catName.style.cssText = 'font-size:0.8rem;color:var(--text);';
      catName.textContent = row.cat;
      catCell.appendChild(dot);
      catCell.appendChild(catName);

      var fycCell = document.createElement('div');
      fycCell.style.cssText = 'font-size:0.82rem;font-weight:700;color:' + row.color + ';';
      fycCell.textContent = '$' + row.fyc.toLocaleString();

      var casesCell = document.createElement('div');
      casesCell.style.cssText = 'font-size:0.8rem;color:var(--text2);';
      casesCell.textContent = row.cases;

      var shareWrap = document.createElement('div');
      var shareBar = document.createElement('div');
      shareBar.style.cssText = 'background:var(--bg1);border-radius:99px;height:6px;margin-bottom:3px;overflow:hidden;';
      var shareFill = document.createElement('div');
      shareFill.style.cssText = 'height:100%;border-radius:99px;width:' + pct + '%;background:' + row.color + ';';
      shareBar.appendChild(shareFill);
      var sharePct = document.createElement('div');
      sharePct.style.cssText = 'font-size:0.68rem;color:var(--text3);';
      sharePct.textContent = pct + '%';
      shareWrap.appendChild(shareBar);
      shareWrap.appendChild(sharePct);

      tRow.appendChild(catCell);
      tRow.appendChild(fycCell);
      tRow.appendChild(casesCell);
      tRow.appendChild(shareWrap);
      tableWrap.appendChild(tRow);
    });

    panel.appendChild(tableWrap);
    return panel;
  }

  function atRenderDashboardCharts() {
    var canvas = document.getElementById('atDashBarChart');
    if (!canvas) return;
    var chartData = [
      { label: 'Oct', value: 5200  },
      { label: 'Nov', value: 7800  },
      { label: 'Dec', value: 9400  },
      { label: 'Jan', value: 6100  },
      { label: 'Feb', value: 8300  },
      { label: 'Mar', value: 6000  },
    ];
    Charts.horizontalBar(canvas, chartData, { height: 200 });
  }
};

/* ============================================================
   PRODUCT COMPASS DEMO
   ============================================================ */

DEMO_RENDERERS.compass = function(container) {
  container.innerHTML = '';

  // Module data
  var modules = [
    {
      id: 'onboarding',
      name: 'Onboarding',
      pct: 100,
      lessons: 8,
      hours: 2,
      items: [
        'Company Overview', 'Compliance Basics', 'CRM Setup',
        'Product Categories', 'Client Onboarding Flow', 'First Meeting Framework',
        'Documentation Standards', 'Week 1 Checklist',
      ],
    },
    {
      id: 'm9',
      name: 'M9 — Life Insurance',
      pct: 72,
      lessons: 12,
      hours: 6,
      items: [
        'Term vs Whole Life', 'Policy Structures', 'Underwriting Basics',
        'Premium Calculations', 'Riders & Add-ons', 'Claims Process',
        'Case Studies', 'Practice Questions', 'Key Ratios',
        'Regulatory Framework', 'Ethics & Disclosure', 'Mock Exam',
      ],
    },
    {
      id: 'm9a',
      name: 'M9A — General Insurance',
      pct: 45,
      lessons: 10,
      hours: 5,
      items: [
        'Introduction to General Insurance', 'Property Insurance', 'Motor Insurance',
        'Travel Insurance', 'Liability Coverage', 'Marine & Cargo',
        'Policy Terms & Conditions', 'Claims Handling', 'Underwriting Principles',
        'Mock Exam',
      ],
    },
    {
      id: 'hi',
      name: 'HI — Health Insurance',
      pct: 18,
      lessons: 8,
      hours: 4,
      items: [
        'Health Insurance Basics', 'Medishield Life', 'Integrated Shield Plans',
        'Critical Illness Coverage', 'Disability Income', 'Hospital Cash Plans',
        'Claims & Pre-Auth', 'Mock Exam',
      ],
    },
    {
      id: 'res5',
      name: 'RES5 — Investments',
      pct: 0,
      lessons: 14,
      hours: 8,
      items: [
        'Investment Basics', 'Unit Trusts', 'ILPs — Investment-Linked Policies',
        'Bonds & Fixed Income', 'Equities Overview', 'Portfolio Construction',
        'Risk Profiling', 'CPF Investment Schemes', 'Suitability Framework',
        'Market Cycles', 'Tax Considerations', 'Regulatory Requirements',
        'Case Studies', 'Mock Exam',
      ],
    },
  ];

  // ===== MODULE BROWSER =====
  var modulesSection = document.createElement('div');
  modulesSection.style.cssText = 'margin-bottom:24px;';

  var modulesHeading = document.createElement('div');
  modulesHeading.className = 'demo-section-heading';
  modulesHeading.textContent = 'Training Modules';
  modulesSection.appendChild(modulesHeading);

  var grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;';

  modules.forEach(function(mod) {
    var card = document.createElement('div');
    card.className = 'chart-container';
    card.style.cssText = 'cursor:pointer;padding:14px;transition:border-color 0.2s;';
    card.id = 'compassCard_' + mod.id;
    card.onclick = function() { toggleModule(mod.id); };

    var cardName = document.createElement('h4');
    cardName.style.cssText = 'font-size:0.85rem;font-weight:700;color:var(--text);margin-bottom:10px;line-height:1.3;';
    cardName.textContent = mod.name;

    // Progress bar wrapper
    var barWrap = document.createElement('div');
    barWrap.style.cssText = 'background:var(--bg3);border-radius:99px;height:6px;margin-bottom:8px;overflow:hidden;';
    var bar = document.createElement('div');
    var barColor = mod.pct === 100 ? 'var(--green-bright)' : mod.pct > 0 ? 'var(--primary-light)' : 'var(--border)';
    bar.style.cssText = 'height:100%;border-radius:99px;width:' + mod.pct + '%;background:' + barColor + ';transition:width 0.4s;';
    barWrap.appendChild(bar);

    var meta = document.createElement('div');
    meta.style.cssText = 'font-size:0.72rem;color:var(--text3);';
    meta.textContent = mod.pct + '% complete \u00B7 ' + mod.lessons + ' lessons \u00B7 ' + mod.hours + 'h';

    // Lesson list (hidden by default)
    var lessonList = document.createElement('div');
    lessonList.id = 'compassLessons_' + mod.id;
    lessonList.style.cssText = 'display:none;margin-top:12px;border-top:1px solid var(--border);padding-top:10px;';

    var doneLessons = Math.round(mod.pct / 100 * mod.lessons);
    mod.items.forEach(function(lesson, i) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:4px 0;font-size:0.75rem;';

      var icon = document.createElement('span');
      if (i < doneLessons) {
        icon.style.cssText = 'color:var(--green-bright);font-size:0.85rem;flex-shrink:0;';
        icon.textContent = '\u2713';
      } else {
        icon.style.cssText = 'width:14px;height:14px;border-radius:50%;border:1.5px solid var(--border);flex-shrink:0;display:inline-block;';
      }

      var lbl = document.createElement('span');
      lbl.style.cssText = i < doneLessons
        ? 'color:var(--text2);'
        : 'color:var(--text3);';
      lbl.textContent = lesson;

      row.appendChild(icon);
      row.appendChild(lbl);
      lessonList.appendChild(row);
    });

    card.appendChild(cardName);
    card.appendChild(barWrap);
    card.appendChild(meta);
    card.appendChild(lessonList);
    grid.appendChild(card);
  });

  modulesSection.appendChild(grid);
  container.appendChild(modulesSection);

  // ===== TWO-COLUMN SECTION (Roleplay + Exam) =====
  var twoCol = document.createElement('div');
  twoCol.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:16px;';

  // --- LEFT: AI Roleplay Chat ---
  var chatSection = document.createElement('div');
  chatSection.className = 'chart-container';
  chatSection.style.cssText = 'padding:16px;';

  var chatHeading = document.createElement('div');
  chatHeading.className = 'demo-section-heading';
  chatHeading.style.cssText = 'margin-top:0;margin-bottom:12px;';
  chatHeading.textContent = 'AI Roleplay Coach';
  chatSection.appendChild(chatHeading);

  // Scenario label
  var scenarioLabel = document.createElement('div');
  scenarioLabel.style.cssText = 'font-size:0.72rem;color:var(--purple);font-weight:600;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:8px;';
  scenarioLabel.textContent = 'Scenario: Retirement Planning';
  chatSection.appendChild(scenarioLabel);

  // Chat bubbles container
  var chatBubbles = document.createElement('div');
  chatBubbles.style.cssText = 'background:var(--bg1);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;margin-bottom:12px;min-height:80px;';
  chatBubbles.id = 'compassChatBubbles';

  // Client message
  var clientBubble = document.createElement('div');
  clientBubble.style.cssText = 'margin-bottom:10px;';

  var clientLabel = document.createElement('div');
  clientLabel.style.cssText = 'font-size:0.68rem;color:var(--text3);margin-bottom:4px;';
  clientLabel.textContent = 'Client';

  var clientMsg = document.createElement('div');
  clientMsg.style.cssText = [
    'background:var(--bg3)',
    'border-radius:0 8px 8px 8px',
    'padding:10px 12px',
    'font-size:0.78rem',
    'color:var(--text)',
    'line-height:1.5',
    'max-width:90%',
  ].join(';');
  clientMsg.textContent = "I\u2019m 35 years old with two young kids. My wife and I are both working but we\u2019re worried about our retirement. We have about $50,000 in savings but no investment plan. What should we be doing?";

  clientBubble.appendChild(clientLabel);
  clientBubble.appendChild(clientMsg);
  chatBubbles.appendChild(clientBubble);
  chatSection.appendChild(chatBubbles);

  // Advisor response options
  var optionsLabel = document.createElement('div');
  optionsLabel.style.cssText = 'font-size:0.75rem;color:var(--text2);font-weight:600;margin-bottom:8px;';
  optionsLabel.id = 'compassOptionsLabel';
  optionsLabel.textContent = 'Choose your response as the advisor:';
  chatSection.appendChild(optionsLabel);

  var optionsList = document.createElement('div');
  optionsList.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
  optionsList.id = 'compassOptionsList';

  var chatOptions = [
    "You should invest in unit trusts \u2014 they give the best returns over the long term.",
    "Let\u2019s first understand your full financial picture \u2014 income, expenses, insurance coverage, and goals. Then we can build a plan that balances protection and growth.",
    "At 35, you still have 30 years before retirement. $50k is a good start. I\u2019d recommend putting it all into an ILP immediately.",
  ];

  chatOptions.forEach(function(text, idx) {
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
    btn.textContent = 'Option ' + (idx + 1) + ': ' + text;
    btn.onmouseover = function() { this.style.borderColor = 'var(--primary-light)'; };
    btn.onmouseout  = function() { this.style.borderColor = 'var(--border)'; };
    btn.onclick = function() { selectChatOption(idx); };
    optionsList.appendChild(btn);
  });

  chatSection.appendChild(optionsList);

  // AI feedback placeholder (hidden)
  var aiFeedback = document.createElement('div');
  aiFeedback.id = 'compassAiFeedback';
  aiFeedback.style.cssText = 'display:none;margin-top:12px;border-radius:var(--radius-sm);padding:12px;font-size:0.78rem;line-height:1.5;';
  chatSection.appendChild(aiFeedback);

  twoCol.appendChild(chatSection);

  // --- RIGHT: Exam Prep ---
  var examSection = document.createElement('div');
  examSection.className = 'chart-container';
  examSection.style.cssText = 'padding:16px;';

  var examHeading = document.createElement('div');
  examHeading.className = 'demo-section-heading';
  examHeading.style.cssText = 'margin-top:0;margin-bottom:12px;';
  examHeading.textContent = 'Exam Prep';
  chatSection.style.cssText += ';';

  var examBadge = document.createElement('div');
  examBadge.style.cssText = 'font-size:0.72rem;color:var(--primary-light);font-weight:600;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:8px;';
  examBadge.textContent = 'M9 Practice';

  var progressRow = document.createElement('div');
  progressRow.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:14px;';
  var progressText = document.createElement('span');
  progressText.style.cssText = 'font-size:0.72rem;color:var(--text3);white-space:nowrap;';
  progressText.textContent = 'Question 3 of 10';
  var progressBar = document.createElement('div');
  progressBar.style.cssText = 'flex:1;height:5px;background:var(--bg3);border-radius:99px;overflow:hidden;';
  var progressFill = document.createElement('div');
  progressFill.style.cssText = 'height:100%;width:30%;background:var(--primary-light);border-radius:99px;';
  progressBar.appendChild(progressFill);
  progressRow.appendChild(progressText);
  progressRow.appendChild(progressBar);

  var question = document.createElement('div');
  question.style.cssText = 'font-size:0.82rem;color:var(--text);font-weight:600;line-height:1.5;margin-bottom:14px;';
  question.textContent = 'Which of the following is NOT a standard exclusion in a typical life insurance policy?';

  var examOptions = [
    { letter: 'A', text: 'Suicide within the first year' },
    { letter: 'B', text: 'Death from pre-existing conditions after 2 years' },
    { letter: 'C', text: 'Death due to war or military service' },
    { letter: 'D', text: 'Death from illegal activities' },
  ];

  var examOptsList = document.createElement('div');
  examOptsList.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
  examOptsList.id = 'compassExamOptions';

  examOptions.forEach(function(opt, idx) {
    var row = document.createElement('div');
    row.id = 'compassExamOpt_' + idx;
    row.style.cssText = [
      'display:flex',
      'align-items:flex-start',
      'gap:10px',
      'background:var(--bg3)',
      'border:1px solid var(--border)',
      'border-radius:var(--radius-sm)',
      'padding:10px 12px',
      'cursor:pointer',
      'transition:border-color 0.2s,background 0.2s',
    ].join(';');

    var letter = document.createElement('div');
    letter.style.cssText = [
      'width:24px',
      'height:24px',
      'border-radius:50%',
      'background:var(--bg1)',
      'border:1.5px solid var(--border)',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'font-size:0.72rem',
      'font-weight:700',
      'color:var(--text2)',
      'flex-shrink:0',
    ].join(';');
    letter.textContent = opt.letter;
    letter.id = 'compassExamLetter_' + idx;

    var optText = document.createElement('span');
    optText.style.cssText = 'font-size:0.78rem;color:var(--text);line-height:1.4;padding-top:2px;';
    optText.textContent = opt.text;

    row.onmouseover = function() {
      if (!row.dataset.answered) row.style.borderColor = 'var(--primary-light)';
    };
    row.onmouseout = function() {
      if (!row.dataset.answered) row.style.borderColor = 'var(--border)';
    };
    row.onclick = function() { selectExam(idx); };

    row.appendChild(letter);
    row.appendChild(optText);
    examOptsList.appendChild(row);
  });

  var examExplanation = document.createElement('div');
  examExplanation.id = 'compassExamExplanation';
  examExplanation.style.cssText = 'display:none;margin-top:12px;background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;font-size:0.78rem;color:var(--text2);line-height:1.5;';
  examExplanation.textContent = "After the 2-year contestability period, pre-existing conditions are generally covered under most life insurance policies. The incontestability clause protects policyholders from claim denial after this period.";

  examSection.appendChild(examHeading);
  examSection.appendChild(examBadge);
  examSection.appendChild(progressRow);
  examSection.appendChild(question);
  examSection.appendChild(examOptsList);
  examSection.appendChild(examExplanation);

  twoCol.appendChild(examSection);
  container.appendChild(twoCol);

  // Responsive: stack on narrow
  var mq = window.matchMedia('(max-width:640px)');
  function applyMQ(e) {
    twoCol.style.gridTemplateColumns = e.matches ? '1fr' : '1fr 1fr';
  }
  mq.addEventListener('change', applyMQ);
  applyMQ(mq);
};

/* ---- Compass helpers (global) ---- */
function toggleModule(id) {
  var card    = document.getElementById('compassCard_' + id);
  var lessons = document.getElementById('compassLessons_' + id);
  if (!lessons) return;
  var open = lessons.style.display !== 'none';
  lessons.style.display = open ? 'none' : 'block';
  if (card) card.style.borderColor = open ? '' : 'var(--primary-light)';
}

function selectChatOption(idx) {
  var optionsList  = document.getElementById('compassOptionsList');
  var optionsLabel = document.getElementById('compassOptionsLabel');
  var chatBubbles  = document.getElementById('compassChatBubbles');
  var aiFeedback   = document.getElementById('compassAiFeedback');
  if (!optionsList || !chatBubbles || !aiFeedback) return;

  var chatOptions = [
    "You should invest in unit trusts \u2014 they give the best returns over the long term.",
    "Let\u2019s first understand your full financial picture \u2014 income, expenses, insurance coverage, and goals. Then we can build a plan that balances protection and growth.",
    "At 35, you still have 30 years before retirement. $50k is a good start. I\u2019d recommend putting it all into an ILP immediately.",
  ];

  // Show advisor bubble
  var advBubble = document.createElement('div');
  advBubble.style.cssText = 'display:flex;flex-direction:column;align-items:flex-end;';

  var advLabel = document.createElement('div');
  advLabel.style.cssText = 'font-size:0.68rem;color:var(--text3);margin-bottom:4px;';
  advLabel.textContent = 'You (Advisor)';

  var advMsg = document.createElement('div');
  advMsg.style.cssText = [
    'background:var(--primary)',
    'border-radius:8px 0 8px 8px',
    'padding:10px 12px',
    'font-size:0.78rem',
    'color:#fff',
    'line-height:1.5',
    'max-width:90%',
  ].join(';');
  advMsg.textContent = chatOptions[idx];

  advBubble.appendChild(advLabel);
  advBubble.appendChild(advMsg);
  chatBubbles.appendChild(advBubble);

  // Hide options
  optionsList.style.display = 'none';
  if (optionsLabel) optionsLabel.style.display = 'none';

  // Show AI feedback
  var feedbacks = [
    {
      type: 'warning',
      text: 'Too product-focused too early. You haven\u2019t assessed the client\u2019s needs yet. Always conduct a needs analysis before making any product recommendations.',
    },
    {
      type: 'success',
      text: 'Excellent response! You\u2019re following the needs-based advisory approach. By gathering a full financial picture first, you demonstrate professionalism and compliance with MAS suitability guidelines.',
    },
    {
      type: 'warning',
      text: 'Jumping straight to product recommendation without needs analysis is a compliance risk. Recommending a specific product (ILP) before assessing the client\u2019s risk profile and full financial situation may breach FAA suitability requirements.',
    },
  ];

  var f = feedbacks[idx];
  var isSuccess = f.type === 'success';
  aiFeedback.style.cssText = [
    'display:block',
    'margin-top:12px',
    'border-radius:var(--radius-sm)',
    'padding:12px',
    'font-size:0.78rem',
    'line-height:1.5',
    'background:' + (isSuccess ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.1)'),
    'border:1px solid ' + (isSuccess ? 'var(--green-bright)' : 'var(--amber)'),
    'color:' + (isSuccess ? 'var(--green-bright)' : 'var(--amber)'),
  ].join(';');

  var icon = isSuccess ? '\u2713 AI Feedback: ' : '\u26A0 AI Feedback: ';
  aiFeedback.textContent = icon + f.text;
}

function selectExam(idx) {
  var optsList = document.getElementById('compassExamOptions');
  var explanation = document.getElementById('compassExamExplanation');
  if (!optsList) return;

  // Prevent re-clicking
  var opts = optsList.querySelectorAll('[id^="compassExamOpt_"]');
  if (opts[0] && opts[0].dataset.answered) return;

  var correctIdx = 1; // Option B

  opts.forEach(function(opt, i) {
    opt.dataset.answered = '1';
    opt.style.cursor = 'default';
    opt.onmouseover = null;
    opt.onmouseout  = null;
    opt.onclick     = null;

    var letter = document.getElementById('compassExamLetter_' + i);

    if (i === correctIdx) {
      opt.style.background    = 'rgba(52,211,153,0.1)';
      opt.style.borderColor   = 'var(--green-bright)';
      if (letter) {
        letter.style.background   = 'var(--green-bright)';
        letter.style.borderColor  = 'var(--green-bright)';
        letter.style.color        = '#0a0f1a';
      }
    } else if (i === idx && idx !== correctIdx) {
      opt.style.background    = 'rgba(239,68,68,0.1)';
      opt.style.borderColor   = 'var(--red)';
      if (letter) {
        letter.style.background   = 'var(--red)';
        letter.style.borderColor  = 'var(--red)';
        letter.style.color        = '#fff';
      }
    }
  });

  if (explanation) explanation.style.display = 'block';
}

/* ============================================================
   AD LAUNCHPAD DEMO — 5-step campaign wizard
   ============================================================ */
DEMO_RENDERERS.launchpad = function(container) {
  container.innerHTML = '';

  // Init global wizard state
  window._wizardStep = window._wizardStep || 0;
  window._wizardData = window._wizardData || {
    template: null,
    headline: "Protect Your Family's Future Today",
    text: "As a parent, your family's financial security matters most. Get a free consultation with a certified financial advisor.",
    cta: "Book Free Consultation",
    audience: ['25-34', 'Singapore', 'Insurance'],
    budget: 30
  };

  var stepLabels = ['Template', 'Copy', 'Audience', 'Budget', 'Review'];

  // Wrapper
  var wrap = document.createElement('div');
  wrap.id = 'launchpadWizard';
  wrap.style.cssText = 'max-width:780px;margin:0 auto;padding:24px 16px;font-family:inherit;';

  // ---- Progress bar ----
  var progressBar = document.createElement('div');
  progressBar.style.cssText = 'display:flex;flex-direction:column;align-items:center;margin-bottom:32px;';

  var dotsRow = document.createElement('div');
  dotsRow.style.cssText = 'display:flex;align-items:center;gap:0;width:100%;max-width:480px;';

  var labelsRow = document.createElement('div');
  labelsRow.style.cssText = 'display:flex;justify-content:space-between;width:100%;max-width:480px;margin-top:8px;';

  stepLabels.forEach(function(label, i) {
    // Dot
    var dot = document.createElement('div');
    dot.className = 'wizard-step-dot' +
      (i < window._wizardStep ? ' done' : '') +
      (i === window._wizardStep ? ' active' : '');
    dot.style.cssText = 'width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;transition:all .2s;' +
      (i < window._wizardStep
        ? 'background:var(--green-bright,#34d399);color:#0a0f1a;border:2px solid var(--green-bright,#34d399);'
        : i === window._wizardStep
          ? 'background:var(--blue-bright,#3b82f6);color:#fff;border:2px solid var(--blue-bright,#3b82f6);box-shadow:0 0 0 4px rgba(59,130,246,0.2);'
          : 'background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);border:2px solid rgba(255,255,255,0.12);');
    dot.textContent = i < window._wizardStep ? '✓' : (i + 1);
    dotsRow.appendChild(dot);

    // Connector line (between dots)
    if (i < stepLabels.length - 1) {
      var line = document.createElement('div');
      line.style.cssText = 'flex:1;height:2px;' +
        (i < window._wizardStep
          ? 'background:var(--green-bright,#34d399);'
          : 'background:rgba(255,255,255,0.1);');
      dotsRow.appendChild(line);
    }

    // Label
    var lbl = document.createElement('div');
    lbl.style.cssText = 'font-size:11px;text-align:center;' +
      (i === window._wizardStep
        ? 'color:var(--blue-bright,#3b82f6);font-weight:600;'
        : i < window._wizardStep
          ? 'color:var(--green-bright,#34d399);'
          : 'color:rgba(255,255,255,0.35);');
    lbl.textContent = label;
    labelsRow.appendChild(lbl);
  });

  progressBar.appendChild(dotsRow);
  progressBar.appendChild(labelsRow);
  wrap.appendChild(progressBar);

  // ---- Step content ----
  var stepContent = document.createElement('div');
  stepContent.id = 'launchpadStepContent';
  stepContent.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;min-height:320px;';
  wrap.appendChild(stepContent);

  // ---- Navigation ----
  var navRow = document.createElement('div');
  navRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-top:20px;';

  var backBtn = document.createElement('button');
  backBtn.id = 'wizardBackBtn';
  backBtn.textContent = '← Back';
  backBtn.onclick = function() { wizardBack(); };
  backBtn.style.cssText = 'padding:10px 24px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.7);cursor:pointer;font-size:14px;display:' + (window._wizardStep === 0 ? 'none' : 'block') + ';';

  var nextBtn = document.createElement('button');
  nextBtn.id = 'wizardNextBtn';
  nextBtn.textContent = window._wizardStep === 4 ? '🚀 Launch Campaign (Paused)' : 'Next →';
  nextBtn.onclick = function() { wizardNext(); };
  nextBtn.style.cssText = 'padding:10px 28px;border-radius:8px;border:none;cursor:pointer;font-size:14px;font-weight:600;transition:all .2s;' +
    (window._wizardStep === 4
      ? 'background:var(--green-bright,#34d399);color:#0a0f1a;'
      : 'background:var(--blue-bright,#3b82f6);color:#fff;');

  navRow.appendChild(backBtn);
  navRow.appendChild(nextBtn);
  wrap.appendChild(navRow);

  container.appendChild(wrap);

  // Render initial step
  _renderWizardStep();

  // ---- GLOBAL HELPER FUNCTIONS ----

  window.renderWizard = function() {
    DEMO_RENDERERS.launchpad(container);
  };

  window.selectTemplate = function(id) {
    window._wizardData.template = id;
    renderWizard();
  };

  window.wizardNext = function() {
    if (window._wizardStep === 4) {
      alert('🎉 Demo Mode — campaign would be submitted for review and launched in paused state. No budget is charged until you unpause.');
      return;
    }
    if (window._wizardStep < 4) {
      window._wizardStep++;
      renderWizard();
    }
  };

  window.wizardBack = function() {
    if (window._wizardStep > 0) {
      window._wizardStep--;
      renderWizard();
    }
  };

  window.updateAdPreview = function() {
    var hl = document.getElementById('wiz_headline');
    var tx = document.getElementById('wiz_text');
    var ct = document.getElementById('wiz_cta');
    if (hl) window._wizardData.headline = hl.value;
    if (tx) window._wizardData.text = tx.value;
    if (ct) window._wizardData.cta = ct.value;

    // Update char counts
    if (hl) { var hc = document.getElementById('wiz_headline_count'); if (hc) hc.textContent = hl.value.length + '/90'; }
    if (tx) { var tc = document.getElementById('wiz_text_count'); if (tc) tc.textContent = tx.value.length + '/500'; }
    if (ct) { var cc = document.getElementById('wiz_cta_count'); if (cc) cc.textContent = ct.value.length + '/25'; }

    // Update preview elements
    var prevHl = document.getElementById('previewHeadline');
    var prevTx = document.getElementById('previewText');
    var prevCta = document.getElementById('previewCTA');
    if (prevHl) prevHl.textContent = window._wizardData.headline;
    if (prevTx) prevTx.textContent = window._wizardData.text;
    if (prevCta) prevCta.textContent = window._wizardData.cta;
  };

  window.toggleAudience = function(val, el) {
    var arr = window._wizardData.audience;
    var idx = arr.indexOf(val);
    if (idx === -1) {
      arr.push(val);
      el.style.background = 'rgba(59,130,246,0.2)';
      el.style.borderColor = 'var(--blue-bright,#3b82f6)';
      el.style.color = '#fff';
    } else {
      arr.splice(idx, 1);
      el.style.background = 'rgba(255,255,255,0.05)';
      el.style.borderColor = 'rgba(255,255,255,0.15)';
      el.style.color = 'rgba(255,255,255,0.6)';
    }
    var sizeEl = document.getElementById('audienceSizeDisplay');
    if (sizeEl) sizeEl.textContent = (window._wizardData.audience.length * 45000).toLocaleString();
  };

  window.updateBudget = function() {
    var slider = document.getElementById('budgetSlider');
    if (slider) {
      window._wizardData.budget = parseInt(slider.value);
      var budgetDisplay = document.getElementById('budgetDisplay');
      if (budgetDisplay) budgetDisplay.textContent = '$' + window._wizardData.budget;
      var reach = document.getElementById('budgetReach');
      var clicks = document.getElementById('budgetClicks');
      var cpl = document.getElementById('budgetCPL');
      var totalBudget = document.getElementById('budget14day');
      if (reach) reach.textContent = (window._wizardData.budget * 180).toLocaleString();
      if (clicks) clicks.textContent = (window._wizardData.budget * 6).toLocaleString();
      if (cpl) cpl.textContent = '$' + (window._wizardData.budget > 0 ? (window._wizardData.budget / (window._wizardData.budget * 6) * 100).toFixed(2) : '0.00');
      if (totalBudget) totalBudget.textContent = '$' + (window._wizardData.budget * 14).toLocaleString();
    }
  };
};

function _renderWizardStep() {
  var content = document.getElementById('launchpadStepContent');
  if (!content) return;
  content.innerHTML = '';

  var step = window._wizardStep;
  var d = window._wizardData;

  if (step === 0) {
    // ---- Step 0: Select Template ----
    var title = document.createElement('h3');
    title.textContent = 'Choose a Campaign Template';
    title.style.cssText = 'margin:0 0 8px;font-size:18px;color:#fff;';
    content.appendChild(title);

    var sub = document.createElement('p');
    sub.textContent = 'Select the goal that best fits your campaign objective.';
    sub.style.cssText = 'margin:0 0 24px;color:rgba(255,255,255,0.5);font-size:14px;';
    content.appendChild(sub);

    var templates = [
      { id: 'lead_gen', icon: '📋', name: 'Lead Generation', desc: 'Collect leads with a contact form' },
      { id: 'brand', icon: '🏢', name: 'Brand Awareness', desc: 'Increase visibility and reach' },
      { id: 'event', icon: '📅', name: 'Event Promotion', desc: 'Drive registrations for seminars' },
    ];

    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;';

    templates.forEach(function(tpl) {
      var card = document.createElement('div');
      var isSelected = d.template === tpl.id;
      card.style.cssText = 'padding:24px 20px;border-radius:12px;border:2px solid;cursor:pointer;transition:all .2s;text-align:center;' +
        (isSelected
          ? 'background:rgba(59,130,246,0.15);border-color:var(--blue-bright,#3b82f6);'
          : 'background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.1);');
      if (isSelected) card.classList.add('selected');

      var iconEl = document.createElement('div');
      iconEl.style.cssText = 'font-size:36px;margin-bottom:12px;';
      iconEl.textContent = tpl.icon;

      var nameEl = document.createElement('div');
      nameEl.style.cssText = 'font-size:15px;font-weight:700;color:#fff;margin-bottom:6px;';
      nameEl.textContent = tpl.name;

      var descEl = document.createElement('div');
      descEl.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.5);line-height:1.5;';
      descEl.textContent = tpl.desc;

      card.appendChild(iconEl);
      card.appendChild(nameEl);
      card.appendChild(descEl);

      card.onclick = function() { selectTemplate(tpl.id); };

      card.onmouseenter = function() {
        if (!card.classList.contains('selected')) {
          card.style.borderColor = 'rgba(59,130,246,0.5)';
          card.style.background = 'rgba(59,130,246,0.08)';
        }
      };
      card.onmouseleave = function() {
        if (!card.classList.contains('selected')) {
          card.style.borderColor = 'rgba(255,255,255,0.1)';
          card.style.background = 'rgba(255,255,255,0.04)';
        }
      };

      grid.appendChild(card);
    });
    content.appendChild(grid);

  } else if (step === 1) {
    // ---- Step 1: Customize Copy ----
    var title = document.createElement('h3');
    title.textContent = 'Customize Your Ad Copy';
    title.style.cssText = 'margin:0 0 20px;font-size:18px;color:#fff;';
    content.appendChild(title);

    var cols = document.createElement('div');
    cols.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:24px;';

    // Left: form
    var leftCol = document.createElement('div');
    leftCol.style.cssText = 'display:flex;flex-direction:column;gap:16px;';

    function makeField(label, tag, id, value, maxLen, countId, rows) {
      var group = document.createElement('div');

      var lbl = document.createElement('label');
      lbl.style.cssText = 'display:flex;justify-content:space-between;font-size:12px;color:rgba(255,255,255,0.5);margin-bottom:6px;';
      var lblText = document.createElement('span');
      lblText.textContent = label;
      var counter = document.createElement('span');
      counter.id = countId;
      counter.textContent = value.length + '/' + maxLen;
      lbl.appendChild(lblText);
      lbl.appendChild(counter);

      var input;
      if (tag === 'textarea') {
        input = document.createElement('textarea');
        input.rows = rows || 4;
        input.style.cssText = 'width:100%;padding:10px 12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;font-size:13px;resize:vertical;box-sizing:border-box;font-family:inherit;line-height:1.5;';
      } else {
        input = document.createElement('input');
        input.type = 'text';
        input.style.cssText = 'width:100%;padding:10px 12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;font-size:13px;box-sizing:border-box;';
      }
      input.id = id;
      input.value = value;
      input.maxLength = maxLen;
      input.oninput = function() { updateAdPreview(); };
      input.onfocus = function() { this.style.borderColor = 'var(--blue-bright,#3b82f6)'; };
      input.onblur = function() { this.style.borderColor = 'rgba(255,255,255,0.12)'; };

      group.appendChild(lbl);
      group.appendChild(input);
      return group;
    }

    leftCol.appendChild(makeField('Headline', 'input', 'wiz_headline', d.headline, 90, 'wiz_headline_count'));
    leftCol.appendChild(makeField('Primary Text', 'textarea', 'wiz_text', d.text, 500, 'wiz_text_count', 5));
    leftCol.appendChild(makeField('Call-to-Action', 'input', 'wiz_cta', d.cta, 25, 'wiz_cta_count'));

    // Right: live preview
    var rightCol = document.createElement('div');

    var previewLabel = document.createElement('div');
    previewLabel.textContent = 'Live Preview';
    previewLabel.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:10px;';
    rightCol.appendChild(previewLabel);

    var fbCard = document.createElement('div');
    fbCard.style.cssText = 'background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.4);max-width:320px;';

    // Header
    var fbHeader = document.createElement('div');
    fbHeader.style.cssText = 'padding:10px 12px;display:flex;align-items:center;gap:8px;';
    var avatar = document.createElement('div');
    avatar.style.cssText = 'width:36px;height:36px;border-radius:50%;background:#1877f2;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;flex-shrink:0;';
    avatar.textContent = 'JX';
    var headerInfo = document.createElement('div');
    var pageName = document.createElement('div');
    pageName.style.cssText = 'font-size:13px;font-weight:700;color:#050505;';
    pageName.textContent = 'Junxiong Financial Advisory';
    var sponsored = document.createElement('div');
    sponsored.style.cssText = 'font-size:11px;color:#606770;';
    sponsored.textContent = 'Sponsored · 🌐';
    headerInfo.appendChild(pageName);
    headerInfo.appendChild(sponsored);
    fbHeader.appendChild(avatar);
    fbHeader.appendChild(headerInfo);

    // Primary text
    var fbText = document.createElement('div');
    fbText.id = 'previewText';
    fbText.style.cssText = 'padding:0 12px 10px;font-size:13px;color:#050505;line-height:1.5;';
    fbText.textContent = d.text;

    // Image area
    var fbImage = document.createElement('div');
    fbImage.style.cssText = 'height:160px;background:linear-gradient(135deg,#1877f2,#42b883);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;';
    var fbHeadline = document.createElement('div');
    fbHeadline.id = 'previewHeadline';
    fbHeadline.style.cssText = 'font-size:16px;font-weight:800;color:#fff;text-align:center;line-height:1.3;text-shadow:0 1px 4px rgba(0,0,0,0.3);';
    fbHeadline.textContent = d.headline;
    fbImage.appendChild(fbHeadline);

    // CTA bar
    var fbCTABar = document.createElement('div');
    fbCTABar.style.cssText = 'padding:10px 12px;background:#f0f2f5;display:flex;align-items:center;justify-content:space-between;';
    var ctaInfo = document.createElement('div');
    ctaInfo.style.cssText = 'font-size:11px;color:#606770;';
    ctaInfo.textContent = 'junxiongfa.com';
    var ctaBtn = document.createElement('div');
    ctaBtn.id = 'previewCTA';
    ctaBtn.style.cssText = 'background:#1877f2;color:#fff;font-size:12px;font-weight:700;padding:6px 14px;border-radius:6px;cursor:pointer;';
    ctaBtn.textContent = d.cta;
    fbCTABar.appendChild(ctaInfo);
    fbCTABar.appendChild(ctaBtn);

    fbCard.appendChild(fbHeader);
    fbCard.appendChild(fbText);
    fbCard.appendChild(fbImage);
    fbCard.appendChild(fbCTABar);
    rightCol.appendChild(fbCard);

    cols.appendChild(leftCol);
    cols.appendChild(rightCol);
    content.appendChild(cols);

  } else if (step === 2) {
    // ---- Step 2: Target Audience ----
    var title = document.createElement('h3');
    title.textContent = 'Target Audience';
    title.style.cssText = 'margin:0 0 6px;font-size:18px;color:#fff;';
    content.appendChild(title);

    var sub = document.createElement('p');
    sub.textContent = 'Select the audience segments you want to reach.';
    sub.style.cssText = 'margin:0 0 24px;color:rgba(255,255,255,0.5);font-size:14px;';
    content.appendChild(sub);

    var groups = [
      { label: 'Age Groups', chips: ['18-24', '25-34', '35-44', '45-54', '55+'] },
      { label: 'Location', chips: ['Singapore', 'Malaysia'] },
      { label: 'Interests', chips: ['Insurance', 'Investments', 'Retirement', 'Property', 'Parents', 'PMETs', 'Business Owners'] },
    ];

    groups.forEach(function(group) {
      var groupEl = document.createElement('div');
      groupEl.style.cssText = 'margin-bottom:20px;';

      var groupLabel = document.createElement('div');
      groupLabel.textContent = group.label;
      groupLabel.style.cssText = 'font-size:12px;font-weight:600;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;';
      groupEl.appendChild(groupLabel);

      var chipsRow = document.createElement('div');
      chipsRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;';

      group.chips.forEach(function(chip) {
        var isActive = d.audience.indexOf(chip) !== -1;
        var chipEl = document.createElement('button');
        chipEl.textContent = chip;
        chipEl.style.cssText = 'padding:6px 14px;border-radius:20px;border:1px solid;cursor:pointer;font-size:13px;transition:all .15s;' +
          (isActive
            ? 'background:rgba(59,130,246,0.2);border-color:var(--blue-bright,#3b82f6);color:#fff;'
            : 'background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.15);color:rgba(255,255,255,0.6);');
        chipEl.onclick = function() { toggleAudience(chip, chipEl); };
        chipsRow.appendChild(chipEl);
      });

      groupEl.appendChild(chipsRow);
      content.appendChild(groupEl);
    });

    // Estimated audience size
    var sizeBox = document.createElement('div');
    sizeBox.style.cssText = 'margin-top:8px;padding:14px 16px;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:10px;display:flex;align-items:center;justify-content:space-between;';
    var sizeLabel = document.createElement('span');
    sizeLabel.textContent = 'Estimated Audience Size';
    sizeLabel.style.cssText = 'font-size:13px;color:rgba(255,255,255,0.6);';
    var sizeNum = document.createElement('span');
    sizeNum.id = 'audienceSizeDisplay';
    sizeNum.textContent = (d.audience.length * 45000).toLocaleString();
    sizeNum.style.cssText = 'font-size:18px;font-weight:700;color:var(--blue-bright,#3b82f6);';
    sizeBox.appendChild(sizeLabel);
    sizeBox.appendChild(sizeNum);
    content.appendChild(sizeBox);

  } else if (step === 3) {
    // ---- Step 3: Budget & Schedule ----
    var title = document.createElement('h3');
    title.textContent = 'Budget & Schedule';
    title.style.cssText = 'margin:0 0 24px;font-size:18px;color:#fff;';
    content.appendChild(title);

    // Slider
    var sliderSection = document.createElement('div');
    sliderSection.style.cssText = 'margin-bottom:28px;';

    var sliderHeader = document.createElement('div');
    sliderHeader.style.cssText = 'display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px;';
    var sliderLbl = document.createElement('span');
    sliderLbl.textContent = 'Daily Budget';
    sliderLbl.style.cssText = 'font-size:14px;color:rgba(255,255,255,0.6);';
    var sliderVal = document.createElement('span');
    sliderVal.id = 'budgetDisplay';
    sliderVal.textContent = '$' + d.budget;
    sliderVal.style.cssText = 'font-size:22px;font-weight:700;color:var(--blue-bright,#3b82f6);';
    sliderHeader.appendChild(sliderLbl);
    sliderHeader.appendChild(sliderVal);
    sliderSection.appendChild(sliderHeader);

    var slider = document.createElement('input');
    slider.type = 'range';
    slider.id = 'budgetSlider';
    slider.min = '10';
    slider.max = '100';
    slider.step = '5';
    slider.value = d.budget;
    slider.style.cssText = 'width:100%;accent-color:var(--blue-bright,#3b82f6);cursor:pointer;';
    slider.oninput = function() { updateBudget(); };
    sliderSection.appendChild(slider);

    var sliderRange = document.createElement('div');
    sliderRange.style.cssText = 'display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,0.3);margin-top:4px;';
    sliderRange.innerHTML = '<span>$10/day</span><span>$100/day</span>';
    sliderSection.appendChild(sliderRange);

    content.appendChild(sliderSection);

    // Dates
    var dateSection = document.createElement('div');
    dateSection.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;';
    [['Start Date', '2026-04-07'], ['End Date', '2026-04-21']].forEach(function(pair) {
      var dateGroup = document.createElement('div');
      var dateLbl = document.createElement('label');
      dateLbl.textContent = pair[0];
      dateLbl.style.cssText = 'display:block;font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:6px;';
      var dateInput = document.createElement('input');
      dateInput.type = 'date';
      dateInput.value = pair[1];
      dateInput.style.cssText = 'width:100%;padding:9px 12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:rgba(255,255,255,0.7);font-size:13px;box-sizing:border-box;';
      dateGroup.appendChild(dateLbl);
      dateGroup.appendChild(dateInput);
      dateSection.appendChild(dateGroup);
    });
    content.appendChild(dateSection);

    // Result cards
    var cardsGrid = document.createElement('div');
    cardsGrid.style.cssText = 'display:grid;grid-template-columns:repeat(2,1fr);gap:12px;';

    var budgetMetrics = [
      { label: '14-Day Budget', id: 'budget14day', value: '$' + (d.budget * 14).toLocaleString() },
      { label: 'Est. Reach', id: 'budgetReach', value: (d.budget * 180).toLocaleString() },
      { label: 'Est. Clicks', id: 'budgetClicks', value: (d.budget * 6).toLocaleString() },
      { label: 'Est. CPL', id: 'budgetCPL', value: '$' + (d.budget > 0 ? (d.budget / (d.budget * 6) * 100).toFixed(2) : '0.00') },
    ];

    budgetMetrics.forEach(function(m) {
      var card = document.createElement('div');
      card.style.cssText = 'padding:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;text-align:center;';
      var lbl = document.createElement('div');
      lbl.textContent = m.label;
      lbl.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;';
      var val = document.createElement('div');
      val.id = m.id;
      val.textContent = m.value;
      val.style.cssText = 'font-size:20px;font-weight:700;color:#fff;';
      card.appendChild(lbl);
      card.appendChild(val);
      cardsGrid.appendChild(card);
    });
    content.appendChild(cardsGrid);

  } else if (step === 4) {
    // ---- Step 4: Review & Launch ----
    var title = document.createElement('h3');
    title.textContent = 'Review Your Campaign';
    title.style.cssText = 'margin:0 0 20px;font-size:18px;color:#fff;';
    content.appendChild(title);

    var cols = document.createElement('div');
    cols.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:24px;';

    // Left: summary table
    var leftCol = document.createElement('div');

    var summaryLabel = document.createElement('div');
    summaryLabel.textContent = 'Campaign Summary';
    summaryLabel.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;';
    leftCol.appendChild(summaryLabel);

    var tplNames = { lead_gen: 'Lead Generation', brand: 'Brand Awareness', event: 'Event Promotion' };
    var rows = [
      ['Template', d.template ? (tplNames[d.template] || d.template) : 'Not selected'],
      ['Headline', d.headline],
      ['CTA', d.cta],
      ['Audience', d.audience.join(', ') || 'None selected'],
      ['Daily Budget', '$' + d.budget],
      ['Total Budget', '$' + (d.budget * 14).toLocaleString()],
      ['Est. Reach', (d.budget * 180).toLocaleString()],
      ['Est. Clicks', (d.budget * 6).toLocaleString()],
    ];

    var table = document.createElement('table');
    table.style.cssText = 'width:100%;border-collapse:collapse;font-size:13px;';
    rows.forEach(function(row) {
      var tr = document.createElement('tr');
      tr.style.cssText = 'border-bottom:1px solid rgba(255,255,255,0.06);';
      var td1 = document.createElement('td');
      td1.textContent = row[0];
      td1.style.cssText = 'padding:8px 0;color:rgba(255,255,255,0.4);width:42%;vertical-align:top;';
      var td2 = document.createElement('td');
      td2.textContent = row[1];
      td2.style.cssText = 'padding:8px 0;color:#fff;font-weight:500;word-break:break-word;';
      tr.appendChild(td1);
      tr.appendChild(td2);
      table.appendChild(tr);
    });
    leftCol.appendChild(table);

    // Right: ad preview (compact)
    var rightCol = document.createElement('div');

    var prevLabel = document.createElement('div');
    prevLabel.textContent = 'Ad Preview';
    prevLabel.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;';
    rightCol.appendChild(prevLabel);

    var fbCard = document.createElement('div');
    fbCard.style.cssText = 'background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.4);';

    var fbHeader = document.createElement('div');
    fbHeader.style.cssText = 'padding:8px 10px;display:flex;align-items:center;gap:8px;';
    var avatar = document.createElement('div');
    avatar.style.cssText = 'width:30px;height:30px;border-radius:50%;background:#1877f2;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:700;flex-shrink:0;';
    avatar.textContent = 'JX';
    var headerInfo = document.createElement('div');
    var pageName = document.createElement('div');
    pageName.style.cssText = 'font-size:12px;font-weight:700;color:#050505;';
    pageName.textContent = 'Junxiong Financial Advisory';
    var sponsored = document.createElement('div');
    sponsored.style.cssText = 'font-size:10px;color:#606770;';
    sponsored.textContent = 'Sponsored';
    headerInfo.appendChild(pageName);
    headerInfo.appendChild(sponsored);
    fbHeader.appendChild(avatar);
    fbHeader.appendChild(headerInfo);

    var fbImage = document.createElement('div');
    fbImage.style.cssText = 'height:110px;background:linear-gradient(135deg,#1877f2,#42b883);display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;';
    var fbHl = document.createElement('div');
    fbHl.style.cssText = 'font-size:13px;font-weight:800;color:#fff;text-align:center;line-height:1.3;text-shadow:0 1px 4px rgba(0,0,0,0.3);';
    fbHl.textContent = d.headline;
    fbImage.appendChild(fbHl);

    var fbCTABar = document.createElement('div');
    fbCTABar.style.cssText = 'padding:8px 10px;background:#f0f2f5;display:flex;align-items:center;justify-content:space-between;';
    var ctaInfo = document.createElement('div');
    ctaInfo.style.cssText = 'font-size:10px;color:#606770;';
    ctaInfo.textContent = 'junxiongfa.com';
    var ctaBtn = document.createElement('div');
    ctaBtn.style.cssText = 'background:#1877f2;color:#fff;font-size:11px;font-weight:700;padding:5px 10px;border-radius:5px;';
    ctaBtn.textContent = d.cta;
    fbCTABar.appendChild(ctaInfo);
    fbCTABar.appendChild(ctaBtn);

    fbCard.appendChild(fbHeader);
    fbCard.appendChild(fbImage);
    fbCard.appendChild(fbCTABar);
    rightCol.appendChild(fbCard);

    cols.appendChild(leftCol);
    cols.appendChild(rightCol);
    content.appendChild(cols);
  }
}

/* ============================================================
   FINANCE HUB DEMO
   ============================================================ */

DEMO_RENDERERS.financehub = function(container) {
  container.innerHTML = '';
  container.id = 'fhDemo';

  // ---- Metric Cards ----
  var metrics = [
    { label: 'Total Assets',      value: '$892,400',  color: 'var(--green-bright, #34d399)' },
    { label: 'Total Liabilities', value: '$423,600',  color: '#ef4444' },
    { label: 'Net Worth',         value: '$468,800',  color: 'var(--primary-light, #6b9bdb)' },
    { label: 'Monthly Surplus',   value: '$1,900',    color: 'var(--accent, #C4A24D)' },
  ];

  var cardsGrid = document.createElement('div');
  cardsGrid.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;';

  metrics.forEach(function(m) {
    var card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px 16px;';
    var lbl = document.createElement('div');
    lbl.textContent = m.label;
    lbl.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;';
    var val = document.createElement('div');
    val.textContent = m.value;
    val.style.cssText = 'font-size:20px;font-weight:700;color:' + m.color + ';';
    card.appendChild(lbl);
    card.appendChild(val);
    cardsGrid.appendChild(card);
  });

  container.appendChild(cardsGrid);

  // ---- Tab Bar ----
  var tabBar = document.createElement('div');
  tabBar.className = 'demo-tabs';

  var tabDefs = [
    { key: 'cashflow',   label: 'Cash Flow' },
    { key: 'networth',   label: 'Net Worth' },
    { key: 'insurance',  label: 'Insurance Coverage' },
    { key: 'cpf',        label: 'CPF Projection' },
  ];

  tabDefs.forEach(function(def, i) {
    var btn = document.createElement('button');
    btn.className = 'demo-tab' + (i === 0 ? ' active' : '');
    btn.dataset.tab = def.key;
    btn.textContent = def.label;
    btn.addEventListener('click', function() { fhTab(def.key); });
    tabBar.appendChild(btn);
  });

  container.appendChild(tabBar);

  // ---- Tab Panels ----

  // -- Cash Flow Panel --
  var cfPanel = document.createElement('div');
  cfPanel.dataset.panel = 'cashflow';
  cfPanel.style.cssText = 'padding:20px 0;';

  var cfCols = document.createElement('div');
  cfCols.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:20px;';

  // Income side
  var incomeCol = document.createElement('div');
  var incomeTitle = document.createElement('div');
  incomeTitle.textContent = 'Monthly Income';
  incomeTitle.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:14px;text-align:center;';
  incomeCol.appendChild(incomeTitle);

  var incomeDonutWrap = document.createElement('div');
  incomeDonutWrap.style.cssText = 'display:flex;justify-content:center;margin-bottom:14px;';
  var incomeCanvas = document.createElement('canvas');
  incomeCanvas.id = 'fhIncomeDonut';
  incomeDonutWrap.appendChild(incomeCanvas);
  incomeCol.appendChild(incomeDonutWrap);

  var incomeItems = [
    { label: 'Salary',       value: 8000, color: '#6b9bdb' },
    { label: 'Investments',  value: 1200, color: '#00b894' },
    { label: 'Side Income',  value: 500,  color: '#C4A24D' },
  ];

  var incomeLegend = document.createElement('div');
  incomeLegend.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
  incomeItems.forEach(function(item) {
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;font-size:12px;';
    var left = document.createElement('div');
    left.style.cssText = 'display:flex;align-items:center;gap:8px;';
    var dot = document.createElement('div');
    dot.style.cssText = 'width:10px;height:10px;border-radius:50%;background:' + item.color + ';flex-shrink:0;';
    var lbl = document.createElement('span');
    lbl.textContent = item.label;
    lbl.style.cssText = 'color:rgba(255,255,255,0.7);';
    left.appendChild(dot);
    left.appendChild(lbl);
    var val = document.createElement('span');
    val.textContent = '$' + item.value.toLocaleString();
    val.style.cssText = 'color:#e2e8f0;font-weight:600;';
    row.appendChild(left);
    row.appendChild(val);
    incomeLegend.appendChild(row);
  });
  incomeCol.appendChild(incomeLegend);

  // Expense side
  var expCol = document.createElement('div');
  var expTitle = document.createElement('div');
  expTitle.textContent = 'Monthly Expenses';
  expTitle.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:14px;text-align:center;';
  expCol.appendChild(expTitle);

  var expDonutWrap = document.createElement('div');
  expDonutWrap.style.cssText = 'display:flex;justify-content:center;margin-bottom:14px;';
  var expCanvas = document.createElement('canvas');
  expCanvas.id = 'fhExpDonut';
  expDonutWrap.appendChild(expCanvas);
  expCol.appendChild(expDonutWrap);

  var expItems = [
    { label: 'Housing',    value: 2500, color: '#ef4444' },
    { label: 'Insurance',  value: 800,  color: '#f59e0b' },
    { label: 'Living',     value: 2000, color: '#a78bfa' },
    { label: 'Transport',  value: 800,  color: '#64748b' },
    { label: 'Others',     value: 700,  color: '#94a3b8' },
  ];

  var expLegend = document.createElement('div');
  expLegend.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
  expItems.forEach(function(item) {
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;font-size:12px;';
    var left = document.createElement('div');
    left.style.cssText = 'display:flex;align-items:center;gap:8px;';
    var dot = document.createElement('div');
    dot.style.cssText = 'width:10px;height:10px;border-radius:50%;background:' + item.color + ';flex-shrink:0;';
    var lbl = document.createElement('span');
    lbl.textContent = item.label;
    lbl.style.cssText = 'color:rgba(255,255,255,0.7);';
    left.appendChild(dot);
    left.appendChild(lbl);
    var val = document.createElement('span');
    val.textContent = '$' + item.value.toLocaleString();
    val.style.cssText = 'color:#e2e8f0;font-weight:600;';
    row.appendChild(left);
    row.appendChild(val);
    expLegend.appendChild(row);
  });
  expCol.appendChild(expLegend);

  cfCols.appendChild(incomeCol);
  cfCols.appendChild(expCol);
  cfPanel.appendChild(cfCols);

  // Result cards row
  var cfResults = [
    { label: 'Total Income',    value: '$9,700',  color: '#34d399' },
    { label: 'Total Expenses',  value: '$7,800',  color: '#ef4444' },
    { label: 'Monthly Surplus', value: '$1,900',  color: '#C4A24D' },
    { label: 'Savings Rate',    value: '19.6%',   color: '#6b9bdb' },
  ];

  var cfResultsGrid = document.createElement('div');
  cfResultsGrid.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:10px;';
  cfResults.forEach(function(r) {
    var card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px 14px;';
    var lbl = document.createElement('div');
    lbl.textContent = r.label;
    lbl.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;';
    var val = document.createElement('div');
    val.textContent = r.value;
    val.style.cssText = 'font-size:18px;font-weight:700;color:' + r.color + ';';
    card.appendChild(lbl);
    card.appendChild(val);
    cfResultsGrid.appendChild(card);
  });
  cfPanel.appendChild(cfResultsGrid);

  // -- Net Worth Panel --
  var nwPanel = document.createElement('div');
  nwPanel.dataset.panel = 'networth';
  nwPanel.style.cssText = 'padding:20px 0;display:none;';

  var nwTitle = document.createElement('div');
  nwTitle.textContent = 'Assets & Liabilities Breakdown';
  nwTitle.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:14px;';
  nwPanel.appendChild(nwTitle);

  var nwCanvasWrap = document.createElement('div');
  var nwCanvas = document.createElement('canvas');
  nwCanvas.id = 'fhNWBar';
  nwCanvasWrap.appendChild(nwCanvas);
  nwPanel.appendChild(nwCanvasWrap);

  // Two-column breakdown tables
  var nwTables = document.createElement('div');
  nwTables.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px;';

  var assetItems = [
    { label: 'Property',       value: '$420,000', pct: '47%', color: '#6b9bdb' },
    { label: 'CPF',            value: '$186,000', pct: '20.8%', color: '#5b8fd4' },
    { label: 'Investments',    value: '$152,400', pct: '17.1%', color: '#00b894' },
    { label: 'Cash',           value: '$84,000',  pct: '9.4%', color: '#34d399' },
    { label: 'Insurance CSV',  value: '$50,000',  pct: '5.6%', color: '#0ea5e9' },
  ];

  var liabItems = [
    { label: 'HDB Loan',      value: '$380,000', pct: '89.7%', color: '#ef4444' },
    { label: 'Car Loan',      value: '$35,600',  pct: '8.4%',  color: '#f59e0b' },
    { label: 'Credit Card',   value: '$8,000',   pct: '1.9%',  color: '#f97316' },
  ];

  function buildNWTable(title, items, titleColor) {
    var col = document.createElement('div');
    var hdr = document.createElement('div');
    hdr.textContent = title;
    hdr.style.cssText = 'font-size:12px;color:' + titleColor + ';text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;font-weight:600;';
    col.appendChild(hdr);
    items.forEach(function(item) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;font-size:12px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.06);';
      var left = document.createElement('div');
      left.style.cssText = 'display:flex;align-items:center;gap:8px;';
      var dot = document.createElement('div');
      dot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:' + item.color + ';flex-shrink:0;';
      var lbl = document.createElement('span');
      lbl.textContent = item.label;
      lbl.style.cssText = 'color:rgba(255,255,255,0.7);';
      left.appendChild(dot);
      left.appendChild(lbl);
      var right = document.createElement('div');
      right.style.cssText = 'display:flex;gap:12px;';
      var val = document.createElement('span');
      val.textContent = item.value;
      val.style.cssText = 'color:#e2e8f0;font-weight:600;';
      var pct = document.createElement('span');
      pct.textContent = item.pct;
      pct.style.cssText = 'color:rgba(255,255,255,0.35);width:38px;text-align:right;';
      right.appendChild(val);
      right.appendChild(pct);
      row.appendChild(left);
      row.appendChild(right);
      col.appendChild(row);
    });
    return col;
  }

  nwTables.appendChild(buildNWTable('Assets', assetItems, '#34d399'));
  nwTables.appendChild(buildNWTable('Liabilities', liabItems, '#ef4444'));
  nwPanel.appendChild(nwTables);

  // -- Insurance Panel --
  var insPanel = document.createElement('div');
  insPanel.dataset.panel = 'insurance';
  insPanel.style.cssText = 'padding:20px 0;display:none;';

  var insTitle = document.createElement('div');
  insTitle.textContent = 'Coverage Gap Analysis';
  insTitle.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:20px;';
  insPanel.appendChild(insTitle);

  var insCoverage = [
    { category: 'Death',           recommended: 800000, actual: 500000, status: 'PARTIAL',   statusColor: '#f59e0b', pct: 500000/800000 },
    { category: 'TPD',             recommended: 600000, actual: 600000, status: 'ADEQUATE',  statusColor: '#34d399', pct: 1.0 },
    { category: 'Critical Illness',recommended: 400000, actual: 150000, status: 'GAP',       statusColor: '#ef4444', pct: 150000/400000 },
    { category: 'Hospital',        recommended: null,   actual: null,   status: 'ADEQUATE',  statusColor: '#34d399', pct: 1.0, label: 'Private Hospital Plan' },
  ];

  var insBars = document.createElement('div');
  insBars.style.cssText = 'display:flex;flex-direction:column;gap:18px;margin-bottom:24px;';

  insCoverage.forEach(function(item) {
    var row = document.createElement('div');

    var rowHeader = document.createElement('div');
    rowHeader.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;';

    var catLabel = document.createElement('div');
    catLabel.textContent = item.category;
    catLabel.style.cssText = 'font-size:13px;color:#e2e8f0;font-weight:600;';

    var statusBadge = document.createElement('div');
    statusBadge.textContent = item.status;
    statusBadge.style.cssText = 'font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;letter-spacing:0.06em;background:' + item.statusColor + '22;color:' + item.statusColor + ';border:1px solid ' + item.statusColor + '44;';

    rowHeader.appendChild(catLabel);
    rowHeader.appendChild(statusBadge);
    row.appendChild(rowHeader);

    var barTrack = document.createElement('div');
    barTrack.style.cssText = 'background:rgba(255,255,255,0.07);border-radius:6px;height:10px;position:relative;overflow:hidden;';

    var barFill = document.createElement('div');
    barFill.style.cssText = 'position:absolute;left:0;top:0;height:100%;border-radius:6px;background:' + item.statusColor + ';width:' + Math.round(item.pct * 100) + '%;transition:width 0.6s ease;';

    barTrack.appendChild(barFill);
    row.appendChild(barTrack);

    var subRow = document.createElement('div');
    subRow.style.cssText = 'display:flex;justify-content:space-between;margin-top:5px;font-size:11px;color:rgba(255,255,255,0.4);';

    var leftSub = document.createElement('span');
    if (item.label) {
      leftSub.textContent = item.label;
    } else {
      leftSub.textContent = 'Coverage: $' + (item.actual / 1000).toFixed(0) + 'k';
    }
    var rightSub = document.createElement('span');
    if (item.recommended) {
      rightSub.textContent = 'Recommended: $' + (item.recommended / 1000).toFixed(0) + 'k';
    }

    subRow.appendChild(leftSub);
    subRow.appendChild(rightSub);
    row.appendChild(subRow);

    insBars.appendChild(row);
  });

  insPanel.appendChild(insBars);

  // Legend
  var insLegend = document.createElement('div');
  insLegend.style.cssText = 'display:flex;gap:16px;flex-wrap:wrap;margin-bottom:20px;';
  [
    { label: 'Recommended', color: '#6b9bdb' },
    { label: 'Adequate',    color: '#34d399' },
    { label: 'Partial',     color: '#f59e0b' },
    { label: 'Gap',         color: '#ef4444' },
  ].forEach(function(l) {
    var item = document.createElement('div');
    item.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:11px;color:rgba(255,255,255,0.5);';
    var dot = document.createElement('div');
    dot.style.cssText = 'width:10px;height:10px;border-radius:2px;background:' + l.color + ';';
    var lbl = document.createElement('span');
    lbl.textContent = l.label;
    item.appendChild(dot);
    item.appendChild(lbl);
    insLegend.appendChild(item);
  });
  insPanel.appendChild(insLegend);

  // Result cards
  var insResults = [
    { label: 'Death Gap',   value: '$300k',  color: '#f59e0b' },
    { label: 'TPD',         value: 'Adequate', color: '#34d399' },
    { label: 'CI Gap',      value: '$250k',  color: '#ef4444' },
    { label: 'Hospital',    value: 'Covered', color: '#34d399' },
  ];

  var insResultsGrid = document.createElement('div');
  insResultsGrid.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:10px;';
  insResults.forEach(function(r) {
    var card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px 14px;';
    var lbl = document.createElement('div');
    lbl.textContent = r.label;
    lbl.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;';
    var val = document.createElement('div');
    val.textContent = r.value;
    val.style.cssText = 'font-size:18px;font-weight:700;color:' + r.color + ';';
    card.appendChild(lbl);
    card.appendChild(val);
    insResultsGrid.appendChild(card);
  });
  insPanel.appendChild(insResultsGrid);

  // -- CPF Panel --
  var cpfPanel = document.createElement('div');
  cpfPanel.dataset.panel = 'cpf';
  cpfPanel.style.cssText = 'padding:20px 0;display:none;';

  var cpfCols = document.createElement('div');
  cpfCols.style.cssText = 'display:grid;grid-template-columns:3fr 2fr;gap:24px;';

  // Left: stacked bar chart
  var cpfChartCol = document.createElement('div');
  var cpfChartTitle = document.createElement('div');
  cpfChartTitle.textContent = 'CPF Growth Projection (Age 30–65)';
  cpfChartTitle.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:14px;';
  cpfChartCol.appendChild(cpfChartTitle);

  var cpfCanvasWrap = document.createElement('div');
  var cpfCanvas = document.createElement('canvas');
  cpfCanvas.id = 'fhCPFBar';
  cpfCanvasWrap.appendChild(cpfCanvas);
  cpfChartCol.appendChild(cpfCanvasWrap);
  cpfCols.appendChild(cpfChartCol);

  // Right: result cards + milestone timeline
  var cpfRightCol = document.createElement('div');

  var cpfResultsData = [
    { label: 'OA at Age 55',     value: '$285k',        color: '#6b9bdb' },
    { label: 'SA at Age 55',     value: '$198k',        color: '#C4A24D' },
    { label: 'MA at Age 65',     value: '$92k',         color: '#00b894' },
    { label: 'Est. CPF Life',    value: '$1,450/mo',    color: '#34d399' },
  ];

  var cpfResultsGrid = document.createElement('div');
  cpfResultsGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;';
  cpfResultsData.forEach(function(r) {
    var card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px 14px;';
    var lbl = document.createElement('div');
    lbl.textContent = r.label;
    lbl.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;';
    var val = document.createElement('div');
    val.textContent = r.value;
    val.style.cssText = 'font-size:16px;font-weight:700;color:' + r.color + ';';
    card.appendChild(lbl);
    card.appendChild(val);
    cpfResultsGrid.appendChild(card);
  });
  cpfRightCol.appendChild(cpfResultsGrid);

  // Milestone timeline
  var milestoneTitle = document.createElement('div');
  milestoneTitle.textContent = 'Key Milestones';
  milestoneTitle.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;';
  cpfRightCol.appendChild(milestoneTitle);

  var milestones = [
    { age: 'Age 55', label: 'Retirement Sum',       color: '#6b9bdb' },
    { age: 'Age 60', label: 'Withdraw excess',       color: '#C4A24D' },
    { age: 'Age 65', label: 'CPF Life begins',       color: '#00b894' },
  ];

  var timeline = document.createElement('div');
  timeline.style.cssText = 'display:flex;flex-direction:column;gap:10px;';
  milestones.forEach(function(m) {
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:10px;';
    var badge = document.createElement('div');
    badge.textContent = m.age;
    badge.style.cssText = 'font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px;background:' + m.color + '22;color:' + m.color + ';border:1px solid ' + m.color + '44;white-space:nowrap;';
    var lbl = document.createElement('div');
    lbl.textContent = m.label;
    lbl.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.7);';
    row.appendChild(badge);
    row.appendChild(lbl);
    timeline.appendChild(row);
  });
  cpfRightCol.appendChild(timeline);

  cpfCols.appendChild(cpfRightCol);
  cpfPanel.appendChild(cpfCols);

  // Append all panels
  container.appendChild(cfPanel);
  container.appendChild(nwPanel);
  container.appendChild(insPanel);
  container.appendChild(cpfPanel);

  // Render initial tab charts after DOM is ready
  setTimeout(function() {
    _fhRenderCashFlow();
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
    if (tab === 'cashflow')  _fhRenderCashFlow();
    if (tab === 'networth')  _fhRenderNetWorth();
    if (tab === 'cpf')       _fhRenderCPF();
  }, 50);
}

/* ---- Cash Flow charts ---- */
function _fhRenderCashFlow() {
  var incomeCanvas = document.getElementById('fhIncomeDonut');
  var expCanvas    = document.getElementById('fhExpDonut');
  if (incomeCanvas) {
    Charts.donut(incomeCanvas, [
      { value: 8000, color: '#6b9bdb', label: 'Salary' },
      { value: 1200, color: '#00b894', label: 'Investments' },
      { value: 500,  color: '#C4A24D', label: 'Side Income' },
    ], { size: 140, centerText: '$9.7k', centerSub: 'monthly' });
  }
  if (expCanvas) {
    Charts.donut(expCanvas, [
      { value: 2500, color: '#ef4444', label: 'Housing' },
      { value: 800,  color: '#f59e0b', label: 'Insurance' },
      { value: 2000, color: '#a78bfa', label: 'Living' },
      { value: 800,  color: '#64748b', label: 'Transport' },
      { value: 700,  color: '#94a3b8', label: 'Others' },
    ], { size: 140, centerText: '$7.8k', centerSub: 'monthly' });
  }
}

/* ---- Net Worth chart ---- */
function _fhRenderNetWorth() {
  var canvas = document.getElementById('fhNWBar');
  if (!canvas) return;

  var items = [
    { label: 'Property',      value: 420000, color: '#6b9bdb' },
    { label: 'CPF',           value: 186000, color: '#5b8fd4' },
    { label: 'Investments',   value: 152400, color: '#00b894' },
    { label: 'Cash',          value: 84000,  color: '#34d399' },
    { label: 'Insurance CSV', value: 50000,  color: '#0ea5e9' },
    { label: 'HDB Loan',      value: 380000, color: '#ef4444' },
    { label: 'Car Loan',      value: 35600,  color: '#f59e0b' },
    { label: 'Credit Card',   value: 8000,   color: '#f97316' },
  ];

  Charts.horizontalBar(canvas, items, { maxValue: 420000 });
}

/* ---- CPF Projection chart ---- */
function _fhRenderCPF() {
  var canvas = document.getElementById('fhCPFBar');
  if (!canvas) return;

  // Simplified CPF compounding: OA 23%, SA 6%, MA 8% of $5k salary
  // OA rate 2.5%pa, SA 4%pa, MA 4%pa (simplified)
  var ages = [30, 35, 40, 45, 50, 55, 60, 65];
  var salary = 5000;
  var oaContrib  = salary * 0.23;
  var saContrib  = salary * 0.06;
  var maContrib  = salary * 0.08;
  var oaRate = 0.025, saRate = 0.04, maRate = 0.04;

  var cpfData = ages.map(function(age) {
    var years = age - 30;
    // Future value of contributions: FV = C * ((1+r)^n - 1) / r * 12
    var oaFV = years === 0 ? 0 : oaContrib * 12 * ((Math.pow(1 + oaRate, years) - 1) / oaRate);
    var saFV = years === 0 ? 0 : saContrib * 12 * ((Math.pow(1 + saRate, years) - 1) / saRate);
    var maFV = years === 0 ? 0 : maContrib * 12 * ((Math.pow(1 + maRate, years) - 1) / maRate);
    return {
      label: '' + age,
      segments: [
        { value: Math.round(oaFV), color: '#6b9bdb' },
        { value: Math.round(saFV), color: '#C4A24D' },
        { value: Math.round(maFV), color: '#00b894' },
      ]
    };
  });

  Charts.stackedBar(canvas, cpfData, {
    height: 220,
    legend: [
      { label: 'OA', color: '#6b9bdb' },
      { label: 'SA', color: '#C4A24D' },
      { label: 'MA', color: '#00b894' },
    ],
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
