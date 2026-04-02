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
   4 tabs: Retirement Planner, Investment Illustrator,
           Insurance Needs, CPF Projector
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
    insurance: updateInsurance,
    cpf: updateCPF,
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

/* ============================================================
   TAB 1 — RETIREMENT PLANNER
   ============================================================ */
function buildRetirementPanel() {
  var panel = document.createElement('div');
  panel.className = 'calc-tab-panel';
  panel.dataset.panel = 'retirement';

  var fmtAge = function(v) { return v + ' yrs'; };
  var fmtDollar = function(v) { return '$' + Number(v).toLocaleString(); };

  var left = [];
  var s1 = calcSlider('retCurAge',   'Current Age',         25,  60,  1,    30,    fmtAge);
  var s2 = calcSlider('retRetAge',   'Retirement Age',      55,  70,  1,    62,    fmtAge);
  var s3 = calcSlider('retExpenses', 'Monthly Expenses',    2000,15000,500, 4000,  fmtDollar);
  var s4 = calcSlider('retSavings',  'Current Savings',     0,   500000,5000,50000,fmtDollar);

  function wireSlider(slider, valId, fmt, updateFn) {
    var input = slider.querySelector('input');
    input.addEventListener('input', function() {
      document.getElementById(valId).textContent = fmt(this.value);
      updateFn();
    });
  }
  wireSlider(s1, 'retCurAgeVal',   fmtAge,    updateRetirement);
  wireSlider(s2, 'retRetAgeVal',   fmtAge,    updateRetirement);
  wireSlider(s3, 'retExpensesVal', fmtDollar, updateRetirement);
  wireSlider(s4, 'retSavingsVal',  fmtDollar, updateRetirement);

  left.push(s1, s2, s3, s4);

  var cards = document.createElement('div');
  cards.className = 'result-cards';
  cards.appendChild(calcCard('Total Needed',     'retTotalNeeded',  ''));
  cards.appendChild(calcCard('Future Savings',   'retFutureSav',    'green'));
  cards.appendChild(calcCard('Funding Gap',      'retGap',          'red'));
  cards.appendChild(calcCard('Monthly Top-up',   'retMonthly',      'accent'));
  left.push(cards);

  var chart = calcChartContainer('Savings Growth Projection', 'retChart');
  var right = [chart.container];

  panel.appendChild(calcLayout(left, right));
  return { panel: panel, canvas: chart.canvas };
}

function updateRetirement() {
  var curAge   = parseInt(document.getElementById('retCurAge')   ? document.getElementById('retCurAge').value   : 30);
  var retAge   = parseInt(document.getElementById('retRetAge')   ? document.getElementById('retRetAge').value   : 62);
  var expenses = parseFloat(document.getElementById('retExpenses') ? document.getElementById('retExpenses').value : 4000);
  var savings  = parseFloat(document.getElementById('retSavings')  ? document.getElementById('retSavings').value  : 50000);

  if (!document.getElementById('retCurAge')) return;

  var yearsToRetire  = Math.max(retAge - curAge, 0);
  var retirementYears = Math.max(90 - retAge, 0);
  var totalNeeded    = expenses * 12 * retirementYears;
  var futureValue    = savings * Math.pow(1.06, yearsToRetire);
  var gap            = Math.max(totalNeeded - futureValue, 0);

  // Monthly contribution needed using future value annuity formula: FV = PMT * ((1+r)^n - 1) / r
  var r = 0.06 / 12;
  var n = yearsToRetire * 12;
  var monthlyNeeded = n > 0 ? (gap * r) / (Math.pow(1 + r, n) - 1) : gap;

  var set = function(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  set('retTotalNeeded', Charts.formatCurrency(totalNeeded));
  set('retFutureSav',   Charts.formatCurrency(futureValue));
  set('retGap',         Charts.formatCurrency(gap));
  set('retMonthly',     Charts.formatCurrency(Math.max(monthlyNeeded, 0)));

  // Build area chart data — savings growth year by year
  var data = [];
  for (var y = 0; y <= yearsToRetire; y++) {
    var fv = savings * Math.pow(1.06, y);
    // Include monthly contributions in projection
    if (monthlyNeeded > 0 && y > 0) {
      var mn = yearsToRetire * 12;
      var contribFV = monthlyNeeded * ((Math.pow(1 + r, y * 12) - 1) / r);
      fv += contribFV;
    }
    data.push({ value: fv, label: String(curAge + y) });
  }

  var canvas = document.getElementById('retChart');
  if (canvas) Charts.area(canvas, data, { color: '#6b9bdb', height: 200 });
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

  var left = [];
  var s1 = calcSlider('invMonthly',  'Monthly Investment', 100,  5000, 100, 500,  fmtDollar);
  var s2 = calcSlider('invReturn',   'Expected Return',    4,    12,   0.5, 8,    fmtPct);
  var s3 = calcSlider('invDuration', 'Duration',           5,    30,   1,   20,   fmtYrs);

  function wireSlider(slider, valId, fmt) {
    var input = slider.querySelector('input');
    input.addEventListener('input', function() {
      document.getElementById(valId).textContent = fmt(this.value);
      updateInvestment();
    });
  }
  wireSlider(s1, 'invMonthlyVal',  fmtDollar);
  wireSlider(s2, 'invReturnVal',   fmtPct);
  wireSlider(s3, 'invDurationVal', fmtYrs);

  left.push(s1, s2, s3);

  var cards = document.createElement('div');
  cards.className = 'result-cards';
  cards.appendChild(calcCard('Conservative',  'invConservative',  ''));
  cards.appendChild(calcCard('Base Case',      'invBase',          'green'));
  cards.appendChild(calcCard('Optimistic',     'invOptimistic',    'accent'));
  cards.appendChild(calcCard('Total Invested', 'invTotalIn',       'blue'));
  left.push(cards);

  var chart = calcChartContainer('3-Scenario Growth Comparison', 'invChart');
  var right = [chart.container];

  panel.appendChild(calcLayout(left, right));
  return { panel: panel, canvas: chart.canvas };
}

function updateInvestment() {
  var monthly  = parseFloat(document.getElementById('invMonthly')  ? document.getElementById('invMonthly').value  : 500);
  var rate     = parseFloat(document.getElementById('invReturn')    ? document.getElementById('invReturn').value    : 8) / 100;
  var duration = parseInt(document.getElementById('invDuration')    ? document.getElementById('invDuration').value  : 20);

  if (!document.getElementById('invMonthly')) return;

  var calcFV = function(annualRate, years) {
    var r = annualRate / 12;
    var n = years * 12;
    return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  };

  var conservative = calcFV(Math.max(rate - 0.02, 0.01), duration);
  var base         = calcFV(rate, duration);
  var optimistic   = calcFV(rate + 0.02, duration);
  var totalIn      = monthly * duration * 12;

  var set = function(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  set('invConservative', Charts.formatCurrency(conservative));
  set('invBase',         Charts.formatCurrency(base));
  set('invOptimistic',   Charts.formatCurrency(optimistic));
  set('invTotalIn',      Charts.formatCurrency(totalIn));

  // Build multi-line data
  var buildSeries = function(annualRate) {
    var r = annualRate / 12;
    var result = [];
    for (var y = 0; y <= duration; y++) {
      var n = y * 12;
      var fv = n === 0 ? 0 : monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      result.push({ value: fv, label: 'Yr ' + y });
    }
    return result;
  };

  var series = [
    { data: buildSeries(Math.max(rate - 0.02, 0.01)), color: '#64748b', label: 'Conservative' },
    { data: buildSeries(rate),                         color: '#6b9bdb', label: 'Base Case' },
    { data: buildSeries(rate + 0.02),                  color: '#34d399', label: 'Optimistic' },
  ];

  var canvas = document.getElementById('invChart');
  if (canvas) Charts.multiLine(canvas, series, { height: 220 });
}

/* ============================================================
   TAB 3 — INSURANCE NEEDS
   ============================================================ */
function buildInsurancePanel() {
  var panel = document.createElement('div');
  panel.className = 'calc-tab-panel';
  panel.dataset.panel = 'insurance';
  panel.style.display = 'none';

  var fmtDollar = function(v) { return '$' + Number(v).toLocaleString(); };
  var fmtNum    = function(v) { return v + (v == 1 ? ' person' : ' people'); };

  var left = [];
  var s1 = calcSlider('insIncome',    'Annual Income',      30000,  300000, 5000,  80000,  fmtDollar);
  var s2 = calcSlider('insDeps',      'Dependents',         0,      5,      1,     2,      fmtNum);
  var s3 = calcSlider('insCoverage',  'Existing Coverage',  0,      1000000,25000, 200000, fmtDollar);

  function wireSlider(slider, valId, fmt) {
    var input = slider.querySelector('input');
    input.addEventListener('input', function() {
      document.getElementById(valId).textContent = fmt(this.value);
      updateInsurance();
    });
  }
  wireSlider(s1, 'insIncomeVal',   fmtDollar);
  wireSlider(s2, 'insDepsVal',     fmtNum);
  wireSlider(s3, 'insCoverageVal', fmtDollar);

  left.push(s1, s2, s3);

  var cards = document.createElement('div');
  cards.className = 'result-cards';
  cards.appendChild(calcCard('Life / Death',  'insDeath',    ''));
  cards.appendChild(calcCard('TPD',            'insTPD',      'blue'));
  cards.appendChild(calcCard('Critical Illness','insCI',      'amber'));
  cards.appendChild(calcCard('Coverage Gap',   'insGap',      'red'));
  left.push(cards);

  var chart = calcChartContainer('Recommended Coverage vs Existing', 'insChart');
  var right = [chart.container];

  panel.appendChild(calcLayout(left, right));
  return { panel: panel, canvas: chart.canvas };
}

function updateInsurance() {
  var income   = parseFloat(document.getElementById('insIncome')   ? document.getElementById('insIncome').value   : 80000);
  var deps     = parseInt(document.getElementById('insDeps')       ? document.getElementById('insDeps').value     : 2);
  var coverage = parseFloat(document.getElementById('insCoverage') ? document.getElementById('insCoverage').value : 200000);

  if (!document.getElementById('insIncome')) return;

  var death    = income * (10 + deps * 2);
  var tpd      = income * 8;
  var ci       = income * 4;
  var hospital = 200000;
  var gap      = Math.max(death - coverage, 0);

  var set = function(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  set('insDeath', Charts.formatCurrency(death));
  set('insTPD',   Charts.formatCurrency(tpd));
  set('insCI',    Charts.formatCurrency(ci));
  set('insGap',   Charts.formatCurrency(gap));

  var items = [
    { label: 'Life / Death', value: death,    color: '#6b9bdb' },
    { label: 'TPD',          value: tpd,      color: '#a78bfa' },
    { label: 'Critical Ill', value: ci,       color: '#C4A24D' },
    { label: 'Hospital',     value: hospital, color: '#34d399' },
    { label: 'Existing',     value: coverage, color: '#475569' },
  ];

  var canvas = document.getElementById('insChart');
  if (canvas) Charts.horizontalBar(canvas, items, {});
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

  var left = [];
  var s1 = calcSlider('cpfAge',    'Current Age',    25,    55,   1,    30,   fmtAge);
  var s2 = calcSlider('cpfSalary', 'Monthly Salary', 2000,  15000,500,  5000, fmtDollar);

  function wireSlider(slider, valId, fmt) {
    var input = slider.querySelector('input');
    input.addEventListener('input', function() {
      document.getElementById(valId).textContent = fmt(this.value);
      updateCPF();
    });
  }
  wireSlider(s1, 'cpfAgeVal',    fmtAge);
  wireSlider(s2, 'cpfSalaryVal', fmtDollar);

  left.push(s1, s2);

  var cards = document.createElement('div');
  cards.className = 'result-cards';
  cards.appendChild(calcCard('OA at 65',   'cpfOA',    'green'));
  cards.appendChild(calcCard('SA at 65',   'cpfSA',    'accent'));
  cards.appendChild(calcCard('MA at 65',   'cpfMA',    'blue'));
  cards.appendChild(calcCard('Total CPF',  'cpfTotal', ''));
  left.push(cards);

  var chart = calcChartContainer('CPF Balance Projection (5-year steps)', 'cpfChart');
  var right = [chart.container];

  panel.appendChild(calcLayout(left, right));
  return { panel: panel, canvas: chart.canvas };
}

function updateCPF() {
  var age    = parseInt(document.getElementById('cpfAge')    ? document.getElementById('cpfAge').value    : 30);
  var salary = parseFloat(document.getElementById('cpfSalary') ? document.getElementById('cpfSalary').value : 5000);

  if (!document.getElementById('cpfAge')) return;

  // CPF rates by age bracket: [OA, SA, MA]
  var getRates = function(a) {
    if (a <= 35) return [0.23, 0.06, 0.08];
    if (a <= 45) return [0.21, 0.07, 0.09];
    if (a <= 50) return [0.19, 0.08, 0.10];
    return              [0.15, 0.085,0.105];
  };

  // OA earns 2.5%, SA & MA earn 4%
  var OA_RATE = 0.025 / 12;
  var SA_RATE = 0.04  / 12;
  var MA_RATE = 0.04  / 12;

  var oaBal = 0, saBal = 0, maBal = 0;
  var chartData = [];

  for (var y = age; y <= 65; y++) {
    var rates = getRates(y);
    // Monthly contribution for this year
    var oaContr = salary * rates[0];
    var saContr = salary * rates[1];
    var maContr = salary * rates[2];

    // Grow for 12 months
    for (var m = 0; m < 12; m++) {
      oaBal = oaBal * (1 + OA_RATE) + oaContr;
      saBal = saBal * (1 + SA_RATE) + saContr;
      maBal = maBal * (1 + MA_RATE) + maContr;
    }

    // Record at 5-year steps and at 65
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

  var set = function(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  set('cpfOA',    Charts.formatCurrency(finalOA));
  set('cpfSA',    Charts.formatCurrency(finalSA));
  set('cpfMA',    Charts.formatCurrency(finalMA));
  set('cpfTotal', Charts.formatCurrency(finalTotal));

  var canvas = document.getElementById('cpfChart');
  if (canvas) {
    Charts.stackedBar(canvas, chartData, {
      height: 220,
      legend: [
        { label: 'OA',  color: '#6b9bdb' },
        { label: 'SA',  color: '#34d399' },
        { label: 'MA',  color: '#C4A24D' },
      ],
    });
  }
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

  container.appendChild(retResult.panel);
  container.appendChild(invResult.panel);
  container.appendChild(insResult.panel);
  container.appendChild(cpfResult.panel);

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

  var activities = [
    { label: 'Cold calls',        pts: 10, done: true  },
    { label: 'Client meetings',   pts: 12, done: true  },
    { label: 'Follow-up emails',  pts: 8,  done: true  },
    { label: 'Referral outreach', pts: 8,  done: false },
    { label: 'Product training',  pts: 7,  done: false },
    { label: 'Social media post', pts: 5,  done: false },
  ];

  var totalPts = activities.reduce(function(s, a) { return s + a.pts; }, 0);

  function donePts() {
    return activities.reduce(function(s, a) { return a.done ? s + a.pts : s; }, 0);
  }

  // ---- Stat boxes ----
  var statBoxes = document.createElement('div');
  statBoxes.className = 'stat-boxes';
  statBoxes.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;';

  var stats = [
    { val: '14',  label: 'Streak',        color: 'var(--green-bright)' },
    { val: '312', label: 'Weekly Points',  color: 'var(--accent)'       },
    { val: '#3',  label: 'Team Rank',      color: 'var(--primary-light)' },
    { val: '12',  label: 'Trees Planted',  color: 'var(--purple)'       },
  ];

  stats.forEach(function(s) {
    var box = document.createElement('div');
    box.className = 'stat-box';
    var val = document.createElement('div');
    val.className = 'stat-box-value';
    val.style.color = s.color;
    val.textContent = s.val;
    var lbl = document.createElement('div');
    lbl.className = 'stat-box-label';
    lbl.textContent = s.label;
    box.appendChild(val);
    box.appendChild(lbl);
    statBoxes.appendChild(box);
  });

  container.appendChild(statBoxes);

  // ---- Two-column dashboard ----
  var dashboard = document.createElement('div');
  dashboard.className = 'at-dashboard';
  dashboard.style.cssText = 'grid-template-columns:1fr 320px;';

  // ===== LEFT COLUMN =====
  var leftCol = document.createElement('div');
  leftCol.style.cssText = 'display:flex;flex-direction:column;gap:16px;';

  // --- Daily Pledge section ---
  var pledgeSection = document.createElement('div');
  pledgeSection.className = 'chart-container';

  var pledgeHeading = document.createElement('div');
  pledgeHeading.className = 'demo-section-heading';
  pledgeHeading.textContent = "Today's Pledge";
  pledgeSection.appendChild(pledgeHeading);

  // Progress ring wrap
  var ringWrap = document.createElement('div');
  ringWrap.className = 'progress-ring-wrap';
  ringWrap.style.cssText = 'position:relative;margin-bottom:16px;flex-direction:row;justify-content:flex-start;align-items:center;gap:20px;';

  var ringContainer = document.createElement('div');
  ringContainer.style.cssText = 'position:relative;width:160px;height:160px;flex-shrink:0;';

  var canvas = document.createElement('canvas');
  canvas.id = 'trackerRing';
  canvas.width = 160;
  canvas.height = 160;
  canvas.style.cssText = 'display:block;';
  ringContainer.appendChild(canvas);

  var ringCenter = document.createElement('div');
  ringCenter.id = 'trackerRingCenter';
  ringCenter.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;';
  var ptsSpan = document.createElement('div');
  ptsSpan.id = 'trackerPts';
  ptsSpan.style.cssText = 'font-size:1.5rem;font-weight:800;color:var(--text);line-height:1;';
  ptsSpan.textContent = donePts() + ' pts';
  var lblSpan = document.createElement('div');
  lblSpan.style.cssText = 'font-size:0.7rem;color:var(--text3);margin-top:3px;';
  lblSpan.textContent = 'of ' + totalPts;
  ringCenter.appendChild(ptsSpan);
  ringCenter.appendChild(lblSpan);
  ringContainer.appendChild(ringCenter);

  ringWrap.appendChild(ringContainer);

  // Activity list (inside ring wrap, side-by-side)
  var actList = document.createElement('div');
  actList.className = 'activity-list';
  actList.style.cssText = 'flex:1;';
  actList.id = 'trackerActivityList';

  activities.forEach(function(act, idx) {
    actList.appendChild(buildActivityItem(act, idx));
  });

  ringWrap.appendChild(actList);
  pledgeSection.appendChild(ringWrap);
  leftCol.appendChild(pledgeSection);

  // --- Isometric Forest ---
  var forestWrap = document.createElement('div');
  forestWrap.className = 'forest-wrap';

  var forestTitle = document.createElement('div');
  forestTitle.className = 'demo-section-heading';
  forestTitle.textContent = 'Your Forest';
  forestWrap.appendChild(forestTitle);

  var forestScene = document.createElement('div');
  forestScene.className = 'forest-scene';
  forestScene.style.cssText = [
    'background:linear-gradient(180deg,#0a2e1a 0%,#0f4d2a 60%,#1a6b3c 100%)',
    'min-height:320px',
    'position:relative',
    'border-radius:8px',
    'overflow:hidden',
  ].join(';');

  var treeData = [
    { species: 'cherry_blossom', left: '5%',  bottom: '12%', width: 72 },
    { species: 'mighty_oak',     left: '16%', bottom: '8%',  width: 90 },
    { species: 'coconut_palm',   left: '28%', bottom: '10%', width: 68 },
    { species: 'apple_tree',     left: '40%', bottom: '6%',  width: 80 },
    { species: 'lucky_bamboo',   left: '52%', bottom: '14%', width: 60 },
    { species: 'blue_spruce',    left: '63%', bottom: '8%',  width: 85 },
    { species: 'banana_plant',   left: '75%', bottom: '12%', width: 65 },
    { species: 'plumeria',       left: '86%', bottom: '7%',  width: 70 },
  ];

  treeData.forEach(function(t) {
    var treeDiv = document.createElement('div');
    treeDiv.className = 'forest-tree';
    treeDiv.style.cssText = 'position:absolute;left:' + t.left + ';bottom:' + t.bottom + ';width:' + t.width + 'px;';
    var img = document.createElement('img');
    img.src = 'https://tree-showcase-omega.vercel.app/trees/stages/' + t.species + '_full.png';
    img.alt = t.species.replace(/_/g, ' ');
    img.style.cssText = 'width:100%;height:auto;display:block;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.5));';
    img.onerror = function() {
      treeDiv.style.fontSize = '2.4rem';
      treeDiv.style.lineHeight = '1';
      treeDiv.textContent = '\uD83C\uDF33';
    };
    treeDiv.appendChild(img);
    forestScene.appendChild(treeDiv);
  });

  forestWrap.appendChild(forestScene);

  var forestStats = document.createElement('div');
  forestStats.className = 'forest-stats';
  forestStats.style.cssText = 'margin-top:12px;font-size:0.8rem;color:var(--text3);';
  forestStats.textContent = '12 trees planted \u00B7 6 species unlocked \u00B7 3 rare+ species';
  forestWrap.appendChild(forestStats);

  leftCol.appendChild(forestWrap);
  dashboard.appendChild(leftCol);

  // ===== RIGHT COLUMN =====
  var rightCol = document.createElement('div');
  rightCol.style.cssText = 'display:flex;flex-direction:column;gap:16px;';

  var lbSection = document.createElement('div');
  lbSection.className = 'chart-container';

  var lbHeading = document.createElement('div');
  lbHeading.className = 'demo-section-heading';
  lbHeading.textContent = 'Team Leaderboard';
  lbSection.appendChild(lbHeading);

  var lbList = document.createElement('div');
  lbList.className = 'leaderboard';

  var lbData = [
    { rank: 1, initials: 'SL', name: 'Sarah Lim',  pts: 428, streak: 21, cls: 'gold'           },
    { rank: 2, initials: 'JC', name: 'James Chen', pts: 395, streak: 14, cls: 'silver'          },
    { rank: 3, initials: 'LT', name: 'You',        pts: 312, streak: 14, cls: 'bronze highlight'},
    { rank: 4, initials: 'RN', name: 'Rachel Ng',  pts: 287, streak: 8,  cls: ''                },
    { rank: 5, initials: 'DT', name: 'David Tan',  pts: 264, streak: 5,  cls: ''                },
  ];

  lbData.forEach(function(row) {
    var lbRow = document.createElement('div');
    lbRow.className = 'leaderboard-row' + (row.cls ? ' ' + row.cls : '');

    var rankEl = document.createElement('div');
    rankEl.className = 'leaderboard-rank';
    rankEl.textContent = '#' + row.rank;

    var avatarEl = document.createElement('div');
    avatarEl.style.cssText = [
      'width:30px',
      'height:30px',
      'border-radius:50%',
      'background:var(--bg2)',
      'border:1px solid var(--border)',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'font-size:0.7rem',
      'font-weight:700',
      'color:var(--text2)',
      'flex-shrink:0',
    ].join(';');
    avatarEl.textContent = row.initials;

    var nameEl = document.createElement('div');
    nameEl.className = 'leaderboard-name';
    nameEl.textContent = row.name;

    var ptsEl = document.createElement('div');
    ptsEl.className = 'leaderboard-score';
    ptsEl.textContent = row.pts + ' pts';

    var streakEl = document.createElement('div');
    streakEl.className = 'leaderboard-streak';
    streakEl.textContent = row.streak + 'd';

    lbRow.appendChild(rankEl);
    lbRow.appendChild(avatarEl);
    lbRow.appendChild(nameEl);
    lbRow.appendChild(ptsEl);
    lbRow.appendChild(streakEl);
    lbList.appendChild(lbRow);
  });

  lbSection.appendChild(lbList);
  rightCol.appendChild(lbSection);
  dashboard.appendChild(rightCol);
  container.appendChild(dashboard);

  // Initial ring draw
  setTimeout(function() { redrawRing(); }, 0);

  // ---- Helper: build activity item ----
  function buildActivityItem(act, idx) {
    var item = document.createElement('div');
    item.className = 'activity-item' + (act.done ? ' done' : '');
    item.dataset.idx = idx;
    item.onclick = function() { toggleActivity(idx); };

    var check = document.createElement('div');
    check.className = 'activity-check';
    var inner = document.createElement('div');
    inner.className = 'activity-check-inner';
    check.appendChild(inner);

    var name = document.createElement('div');
    name.className = 'activity-name';
    name.textContent = act.label;

    var pts = document.createElement('div');
    pts.className = 'activity-pts';
    pts.textContent = '+' + act.pts;

    item.appendChild(check);
    item.appendChild(name);
    item.appendChild(pts);
    return item;
  }

  // ---- Redraw ring ----
  function redrawRing() {
    var c = document.getElementById('trackerRing');
    if (!c) return;
    var done = donePts();
    var progress = totalPts > 0 ? done / totalPts : 0;
    Charts.progressRing(c, progress, {
      size:          160,
      lineWidth:     12,
      trackColor:    '#1e293b',
      fillColor:     '#355A99',
      fillColorEnd:  '#6b9bdb',
    });
    var ptsEl = document.getElementById('trackerPts');
    if (ptsEl) ptsEl.textContent = done + ' pts';
  }
};

/* ---- Global toggle for activity tracker ---- */
function toggleActivity(idx) {
  var listEl = document.getElementById('trackerActivityList');
  if (!listEl) return;
  var items = listEl.querySelectorAll('.activity-item');
  var item  = items[idx];
  if (!item) return;
  item.classList.toggle('done');

  // Recalculate from DOM state
  var done = 0;
  var total = 0;
  var allItems = listEl.querySelectorAll('.activity-item');
  allItems.forEach(function(el) {
    var ptsEl = el.querySelector('.activity-pts');
    var pts = ptsEl ? parseInt(ptsEl.textContent.replace('+', ''), 10) : 0;
    total += pts;
    if (el.classList.contains('done')) done += pts;
  });

  // Update ring
  var canvas = document.getElementById('trackerRing');
  if (canvas) {
    Charts.progressRing(canvas, total > 0 ? done / total : 0, {
      size:         160,
      lineWidth:    12,
      trackColor:   '#1e293b',
      fillColor:    '#355A99',
      fillColorEnd: '#6b9bdb',
    });
  }
  var ptsEl = document.getElementById('trackerPts');
  if (ptsEl) ptsEl.textContent = done + ' pts';
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
