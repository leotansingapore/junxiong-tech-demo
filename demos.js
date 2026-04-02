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
  pageName: "Junxiong Financial Advisory",
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
    bar.appendChild(_lp_el('div','font-size:10px;color:#606770;','junxiongfa.com'));
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
    rcText.appendChild(_lp_el('div','font-size:10px;color:#606770;margin-bottom:6px;','junxiongfa.com'));
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
    hi2.appendChild(_lp_el('div','font-size:13px;font-weight:700;color:#050505;','Junxiong Financial Advisory'));
    hi2.appendChild(_lp_el('div','font-size:11px;color:#606770;','Sponsored \u00b7 \ud83c\udf10'));
    fbHdr.appendChild(hi2);
    var fbTxt = _lp_el('div','padding:0 12px 10px;font-size:13px;color:#050505;line-height:1.5;'); fbTxt.id='previewText'; fbTxt.textContent=d.text;
    var fbImg = _lp_el('div','height:160px;background:linear-gradient(135deg,#1877f2,#42b883);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;');
    var fbHl = _lp_el('div','font-size:16px;font-weight:800;color:#fff;text-align:center;line-height:1.3;text-shadow:0 1px 4px rgba(0,0,0,0.3);'); fbHl.id='previewHeadline'; fbHl.textContent=d.headline;
    fbImg.appendChild(fbHl);
    var fbBar = _lp_el('div','padding:10px 12px;background:#f0f2f5;display:flex;align-items:center;justify-content:space-between;');
    fbBar.appendChild(_lp_el('div','font-size:11px;color:#606770;','junxiongfa.com'));
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
    hi3.appendChild(_lp_el('div','font-size:12px;font-weight:700;color:#050505;','Junxiong Financial Advisory'));
    hi3.appendChild(_lp_el('div','font-size:10px;color:#606770;','Sponsored'));
    fbHdr2.appendChild(hi3);
    var fbImg2 = _lp_el('div','height:110px;background:linear-gradient(135deg,#1877f2,#42b883);display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;');
    fbImg2.appendChild(_lp_el('div','font-size:13px;font-weight:800;color:#fff;text-align:center;line-height:1.3;text-shadow:0 1px 4px rgba(0,0,0,0.3);',d.headline));
    var fbBar2 = _lp_el('div','padding:8px 10px;background:#f0f2f5;display:flex;align-items:center;justify-content:space-between;');
    fbBar2.appendChild(_lp_el('div','font-size:10px;color:#606770;','junxiongfa.com'));
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
