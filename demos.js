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
   CALCULATOR DEMO — Investment Plan Simulator (2-tab rebuild)
   Tab 1: Investment Illustrator (conversational form + chart + table)
   Tab 2: Retirement Step-by-Step (narrative 5-step walkthrough)
   ============================================================ */

DEMO_RENDERERS.calculator = function(container) {
  container.id = 'invSimDemo';

  var fmtDollar = function(v) { return '$' + Math.round(Number(v)).toLocaleString(); };
  var fmtDollarK = function(v) {
    var n = Math.round(Number(v));
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000)    return '$' + (n / 1000).toFixed(0) + 'K';
    return '$' + n.toLocaleString();
  };

  /* ======================================================
     SECTION DIVIDER HELPER
     ====================================================== */
  function sectionDivider(badgeText, headline, subtext) {
    var wrap = document.createElement('div');
    wrap.style.cssText = [
      'border-top:1px solid var(--border)',
      'margin:48px 0 32px',
      'padding-top:36px',
    ].join(';');

    var badge = document.createElement('div');
    badge.style.cssText = [
      'display:inline-block',
      'font-size:0.68rem',
      'font-weight:800',
      'letter-spacing:.12em',
      'text-transform:uppercase',
      'color:var(--accent,#6b9bdb)',
      'border:1px solid var(--accent,#6b9bdb)',
      'border-radius:20px',
      'padding:4px 14px',
      'margin-bottom:14px',
    ].join(';');
    badge.textContent = badgeText;
    wrap.appendChild(badge);

    var h2 = document.createElement('h2');
    h2.style.cssText = [
      'font-size:1.4rem',
      'font-weight:800',
      'color:var(--text1,#f9fafb)',
      'margin:0 0 8px',
      'line-height:1.25',
    ].join(';');
    h2.textContent = headline;
    wrap.appendChild(h2);

    if (subtext) {
      var sub = document.createElement('p');
      sub.style.cssText = 'font-size:0.88rem;color:var(--text3);margin:0;line-height:1.55;';
      sub.textContent = subtext;
      wrap.appendChild(sub);
    }

    return wrap;
  }

  /* ======================================================
     SECTION 1 — HERO
     ====================================================== */
  var hero = document.createElement('div');
  hero.style.cssText = [
    'text-align:center',
    'padding:40px 20px 36px',
    'max-width:720px',
    'margin:0 auto',
  ].join(';');

  var heroBadge = document.createElement('div');
  heroBadge.style.cssText = [
    'display:inline-block',
    'font-size:0.72rem',
    'font-weight:800',
    'letter-spacing:.1em',
    'text-transform:uppercase',
    'color:#34d399',
    'border:1px solid #34d39944',
    'background:#34d39910',
    'border-radius:20px',
    'padding:5px 16px',
    'margin-bottom:20px',
  ].join(';');
  heroBadge.textContent = '70+ Financial Calculators';
  hero.appendChild(heroBadge);

  var heroH1 = document.createElement('h1');
  heroH1.style.cssText = [
    'font-size:clamp(1.6rem, 4vw, 2.4rem)',
    'font-weight:900',
    'color:var(--text1,#f9fafb)',
    'margin:0 0 16px',
    'line-height:1.18',
    'letter-spacing:-.02em',
  ].join(';');
  heroH1.textContent = 'Every Number Your Client Needs \u2014 In One Platform';
  hero.appendChild(heroH1);

  var heroSub = document.createElement('p');
  heroSub.style.cssText = [
    'font-size:1rem',
    'color:var(--text3)',
    'line-height:1.65',
    'margin:0 0 28px',
    'max-width:580px',
    'margin-left:auto',
    'margin-right:auto',
  ].join(';');
  heroSub.textContent = 'From retirement projections to investment illustrations, give clients clarity with professional-grade calculators that do the math in real time.';
  hero.appendChild(heroSub);

  var heroStats = document.createElement('div');
  heroStats.style.cssText = [
    'display:flex',
    'flex-wrap:wrap',
    'gap:8px 20px',
    'justify-content:center',
    'font-size:0.78rem',
    'font-weight:700',
    'color:var(--text3)',
    'letter-spacing:.04em',
  ].join(';');
  ['70+ Calculators', 'Real-Time Projections', 'PDF Export', 'Multi-Language'].forEach(function(stat, i) {
    if (i > 0) {
      var dot = document.createElement('span');
      dot.style.cssText = 'color:var(--border);display:inline;';
      dot.textContent = '\u00b7';
      heroStats.appendChild(dot);
    }
    var s = document.createElement('span');
    s.textContent = stat;
    heroStats.appendChild(s);
  });
  hero.appendChild(heroStats);

  container.appendChild(hero);

  /* ======================================================
     SECTION 2 — KEY CAPABILITIES
     ====================================================== */
  var capsDiv = sectionDivider('Key Capabilities', 'Everything You Need to Advise with Confidence', null);
  container.appendChild(capsDiv);

  var CAPS = [
    { icon: '\ud83d\udcca', title: 'Investment Illustrators',  benefit: 'Show clients exactly how their money grows with 5/8/10/15/20-year plans' },
    { icon: '\ud83c\udfd6\ufe0f', title: 'Retirement Planning',        benefit: 'Step-by-step visualization of the retirement gap and how to close it' },
    { icon: '\ud83d\udee1\ufe0f', title: 'Insurance Needs',            benefit: 'Calculate coverage gaps for death, TPD, critical illness & hospital' },
    { icon: '\ud83d\udcb0', title: 'CPF & Tax',                  benefit: 'Project CPF balances to age 65 with CPF LIFE payout estimates' },
    { icon: '\ud83c\udfe0', title: 'Property & Mortgage',        benefit: 'HDB calculator with BSD, ABSD, and CPF OA usage' },
    { icon: '\ud83d\udccb', title: 'Proposal Generator',         benefit: 'Auto-generate professional client proposals from any calculator' },
  ];

  var capsGrid = document.createElement('div');
  capsGrid.style.cssText = [
    'display:grid',
    'grid-template-columns:repeat(3,1fr)',
    'gap:16px',
    'margin-bottom:8px',
  ].join(';');

  /* Responsive: 2-col on narrow screens */
  var capsMq = window.matchMedia('(max-width:640px)');
  function applyCapsGrid(e) {
    capsGrid.style.gridTemplateColumns = e.matches ? 'repeat(2,1fr)' : 'repeat(3,1fr)';
  }
  capsMq.addEventListener('change', applyCapsGrid);
  applyCapsGrid(capsMq);

  CAPS.forEach(function(cap) {
    var card = document.createElement('div');
    card.style.cssText = [
      'background:var(--surface2)',
      'border:1px solid var(--border)',
      'border-radius:12px',
      'padding:20px 18px',
      'transition:border-color .2s',
    ].join(';');
    card.addEventListener('mouseenter', function() { card.style.borderColor = 'var(--accent,#6b9bdb)'; });
    card.addEventListener('mouseleave', function() { card.style.borderColor = 'var(--border)'; });

    var iconEl = document.createElement('div');
    iconEl.style.cssText = 'font-size:1.6rem;margin-bottom:10px;';
    iconEl.textContent = cap.icon;

    var titleEl = document.createElement('div');
    titleEl.style.cssText = 'font-size:0.88rem;font-weight:700;color:var(--text1,#f9fafb);margin-bottom:6px;';
    titleEl.textContent = cap.title;

    var benefitEl = document.createElement('div');
    benefitEl.style.cssText = 'font-size:0.78rem;color:var(--text3);line-height:1.5;';
    benefitEl.textContent = cap.benefit;

    card.appendChild(iconEl);
    card.appendChild(titleEl);
    card.appendChild(benefitEl);
    capsGrid.appendChild(card);
  });

  container.appendChild(capsGrid);

  /* ======================================================
     SECTION 3 — INVESTMENT ILLUSTRATOR DEMO
     ====================================================== */
  var illSectionHeader = sectionDivider(
    'Try It \u2014 Investment Illustrator',
    'See Real-Time Investment Projections',
    'Experience the conversational investment planning tool. Adjust inputs to see real-time projections.'
  );
  container.appendChild(illSectionHeader);

  /* ---- Panel for illustrator (no tabs — always visible) ---- */
  var panelIll = document.createElement('div');

  /* ======================================================
     PANEL 1 — INVESTMENT ILLUSTRATOR
     ====================================================== */
  var panelIll = document.createElement('div');

  /* --- State --- */
  var illCfg = {
    age:      30,
    duration: 10,
    monthly:  500,
    retRate:  7,
    feeRate:  1.5,
  };

  /* ---- Inline select helper ---- */
  function inlineSelect(id, options, defaultVal, onChange) {
    var sel = document.createElement('select');
    sel.id = id;
    sel.style.cssText = [
      'display:inline-block',
      'background:var(--surface3,#1f2937)',
      'color:var(--text1,#f9fafb)',
      'border:1px solid var(--accent)',
      'border-radius:6px',
      'padding:3px 8px',
      'font-size:0.9rem',
      'font-weight:600',
      'cursor:pointer',
      'outline:none',
      'margin:0 2px',
      '-webkit-appearance:auto',
    ].join(';');
    options.forEach(function(opt) {
      var o = document.createElement('option');
      o.value = opt.value !== undefined ? opt.value : opt;
      o.textContent = opt.label !== undefined ? opt.label : opt;
      if (String(o.value) === String(defaultVal)) o.selected = true;
      sel.appendChild(o);
    });
    sel.addEventListener('change', function() { onChange(sel.value); });
    return sel;
  }

  /* ---- Inline number input helper ---- */
  function inlineInput(id, defaultVal, min, max, onChange) {
    var inp = document.createElement('input');
    inp.type = 'number';
    inp.id = id;
    inp.value = defaultVal;
    inp.min = min;
    inp.max = max;
    inp.style.cssText = [
      'display:inline-block',
      'width:80px',
      'background:var(--surface3,#1f2937)',
      'color:var(--text1,#f9fafb)',
      'border:1px solid var(--accent)',
      'border-radius:6px',
      'padding:3px 8px',
      'font-size:0.9rem',
      'font-weight:600',
      'outline:none',
      'margin:0 2px',
      'text-align:center',
    ].join(';');
    inp.addEventListener('input', function() { onChange(inp.value); });
    return inp;
  }

  /* ---- Conversational form ---- */
  var formCard = document.createElement('div');
  formCard.style.cssText = [
    'background:var(--surface2)',
    'border:1px solid var(--border)',
    'border-radius:14px',
    'padding:24px 28px',
    'margin-bottom:20px',
    'max-width:680px',
    'margin-left:auto',
    'margin-right:auto',
  ].join(';');

  var formTitle = document.createElement('div');
  formTitle.style.cssText = 'font-size:0.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);margin-bottom:18px;';
  formTitle.textContent = 'Smart Wealth Builder';
  formCard.appendChild(formTitle);

  /* Build sentence line helper */
  function sentenceLine() {
    var p = document.createElement('p');
    p.style.cssText = [
      'font-size:0.95rem',
      'color:var(--text2)',
      'line-height:2.2',
      'margin:0 0 4px',
    ].join(';');
    return p;
  }

  /* Line 1: age */
  var line1 = sentenceLine();
  var t1a = document.createTextNode('I am ');
  var selAge = inlineSelect('illAge',
    [25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,50,55,60,65].map(function(a){ return {value:a, label:a}; }),
    illCfg.age,
    function(v) { illCfg.age = parseInt(v,10); }
  );
  var t1b = document.createTextNode(' years old.');
  line1.appendChild(t1a);
  line1.appendChild(selAge);
  line1.appendChild(t1b);
  formCard.appendChild(line1);

  /* Line 2: duration */
  var line2 = sentenceLine();
  var t2a = document.createTextNode('I choose to pay for ');
  var selDur = inlineSelect('illDur',
    [{value:1,label:'Single Pay'},{value:5,label:'5 Pay'},{value:10,label:'10 years'},{value:15,label:'15 years'},{value:20,label:'20 years'}],
    illCfg.duration,
    function(v) { illCfg.duration = parseInt(v,10); }
  );
  var t2b = document.createTextNode('.');
  line2.appendChild(t2a);
  line2.appendChild(selDur);
  line2.appendChild(t2b);
  formCard.appendChild(line2);

  /* Line 3: monthly */
  var line3 = sentenceLine();
  var t3a = document.createTextNode('I will invest $');
  var inpMonthly = inlineInput('illMonthly', illCfg.monthly, 100, 10000, function(v) { illCfg.monthly = parseFloat(v) || 100; });
  var t3b = document.createTextNode(' per month');
  line3.appendChild(t3a);
  line3.appendChild(inpMonthly);
  line3.appendChild(t3b);
  formCard.appendChild(line3);

  /* Line 4: return + fee */
  var line4 = sentenceLine();
  var t4a = document.createTextNode('and assume a return rate of ');
  var selRet = inlineSelect('illRet',
    [{value:4.25,label:'4.25%'},{value:5,label:'5%'},{value:6,label:'6%'},{value:7,label:'7%'},{value:8,label:'8%'}],
    illCfg.retRate,
    function(v) { illCfg.retRate = parseFloat(v); }
  );
  var t4b = document.createTextNode(' per year with an annual fee of ');
  var selFee = inlineSelect('illFee',
    [{value:0.5,label:'0.5%'},{value:1,label:'1%'},{value:1.5,label:'1.5%'},{value:2,label:'2%'}],
    illCfg.feeRate,
    function(v) { illCfg.feeRate = parseFloat(v); }
  );
  var t4c = document.createTextNode('.');
  line4.appendChild(t4a);
  line4.appendChild(selRet);
  line4.appendChild(t4b);
  line4.appendChild(selFee);
  line4.appendChild(t4c);
  formCard.appendChild(line4);

  /* Calculate button */
  var calcBtn = document.createElement('button');
  calcBtn.textContent = 'Calculate';
  calcBtn.style.cssText = [
    'margin-top:20px',
    'padding:11px 32px',
    'font-size:0.92rem',
    'font-weight:700',
    'border-radius:8px',
    'border:none',
    'cursor:pointer',
    'background:linear-gradient(135deg,var(--accent),#a78bfa)',
    'color:#fff',
    'letter-spacing:.03em',
    'box-shadow:0 2px 12px rgba(107,155,219,.35)',
    'transition:opacity .15s',
    'display:block',
  ].join(';');
  calcBtn.addEventListener('mouseenter', function() { calcBtn.style.opacity = '0.88'; });
  calcBtn.addEventListener('mouseleave', function() { calcBtn.style.opacity = '1'; });
  calcBtn.addEventListener('click', function() { runIllCalc(); });
  formCard.appendChild(calcBtn);

  panelIll.appendChild(formCard);

  /* ---- Results area ---- */
  var illResults = document.createElement('div');
  illResults.style.cssText = 'max-width:840px;margin:0 auto;';
  panelIll.appendChild(illResults);

  /* Summary cards */
  var illCardsRow = document.createElement('div');
  illCardsRow.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;';
  var illCardsMq = window.matchMedia('(max-width:600px)');
  illCardsMq.addEventListener('change', function(e) {
    illCardsRow.style.gridTemplateColumns = e.matches ? 'repeat(2,1fr)' : 'repeat(4,1fr)';
  });
  if (illCardsMq.matches) illCardsRow.style.gridTemplateColumns = 'repeat(2,1fr)';

  function illCard(label, id, color) {
    var c = document.createElement('div');
    c.style.cssText = [
      'background:var(--surface2)',
      'border:1px solid var(--border)',
      'border-radius:10px',
      'padding:14px 16px',
      'text-align:center',
    ].join(';');
    var lbl = document.createElement('div');
    lbl.style.cssText = 'font-size:0.70rem;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;font-weight:600;';
    lbl.textContent = label;
    var val = document.createElement('div');
    val.id = id;
    val.style.cssText = 'font-size:1.15rem;font-weight:700;color:' + color + ';';
    val.textContent = '—';
    c.appendChild(lbl);
    c.appendChild(val);
    return c;
  }

  illCardsRow.appendChild(illCard('Total Premiums Paid', 'illCardPaid',    '#34d399'));
  illCardsRow.appendChild(illCard('Projected Value',     'illCardProj',    'var(--accent,#6b9bdb)'));
  illCardsRow.appendChild(illCard('Net Return',          'illCardNet',     '#C4A24D'));
  illCardsRow.appendChild(illCard('Effective Yield p.a.','illCardYield',   '#a78bfa'));
  illResults.appendChild(illCardsRow);

  /* Chart */
  var illChartSection = document.createElement('div');
  illChartSection.style.cssText = 'background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:16px 16px 10px;margin-bottom:20px;';

  var illChartLegend = document.createElement('div');
  illChartLegend.style.cssText = 'display:flex;gap:20px;margin-bottom:10px;font-size:0.76rem;';
  [{color:'#6b9bdb',label:'Projected Value',dashed:false},{color:'#94a3b8',label:'Total Premiums',dashed:true}].forEach(function(item) {
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:6px;color:var(--text3);';
    var line = document.createElement('div');
    if (item.dashed) {
      line.style.cssText = 'width:22px;height:2px;background:repeating-linear-gradient(90deg,'+item.color+' 0,'+item.color+' 4px,transparent 4px,transparent 8px);';
    } else {
      line.style.cssText = 'width:22px;height:2px;background:'+item.color+';';
    }
    var lbl = document.createElement('span');
    lbl.textContent = item.label;
    row.appendChild(line);
    row.appendChild(lbl);
    illChartLegend.appendChild(row);
  });
  illChartSection.appendChild(illChartLegend);

  var illCanvas = document.createElement('canvas');
  illCanvas.id = 'illChart';
  illChartSection.appendChild(illCanvas);
  illResults.appendChild(illChartSection);

  /* Table */
  var illTableSection = document.createElement('div');
  illTableSection.style.cssText = 'background:var(--surface2);border:1px solid var(--border);border-radius:12px;overflow:hidden;';

  var illTableHead = document.createElement('div');
  illTableHead.style.cssText = 'padding:12px 16px 8px;font-size:0.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border);';
  illTableHead.textContent = 'Year-by-Year Breakdown';
  illTableSection.appendChild(illTableHead);

  var illTableWrap = document.createElement('div');
  illTableWrap.style.cssText = 'overflow-x:auto;max-height:320px;overflow-y:auto;';

  var illTable = document.createElement('table');
  illTable.style.cssText = 'width:100%;border-collapse:collapse;font-size:0.76rem;min-width:580px;';

  var illThead = document.createElement('thead');
  var illHeadRow = document.createElement('tr');
  illHeadRow.style.cssText = 'background:var(--surface3,#1f2937);position:sticky;top:0;z-index:1;';
  ['Year','Age','Premiums Paid','Growth','Fees','Portfolio Value','Total Yield','Effective Yield p.a.'].forEach(function(h) {
    var th = document.createElement('th');
    th.style.cssText = 'padding:8px 10px;text-align:right;color:var(--text3);font-weight:600;white-space:nowrap;font-size:0.72rem;letter-spacing:.04em;';
    if (h === 'Year' || h === 'Age') th.style.textAlign = 'center';
    th.textContent = h;
    illHeadRow.appendChild(th);
  });
  illThead.appendChild(illHeadRow);
  illTable.appendChild(illThead);

  var illTbody = document.createElement('tbody');
  illTbody.id = 'illTbody';
  illTable.appendChild(illTbody);
  illTableWrap.appendChild(illTable);
  illTableSection.appendChild(illTableWrap);
  illResults.appendChild(illTableSection);

  /* ---- Computation ---- */
  function illCompute(cfg) {
    var rows = [];
    var balance = 0;
    var totalPaid = 0;
    for (var yr = 1; yr <= cfg.duration; yr++) {
      var contrib = cfg.monthly * 12;
      totalPaid += contrib;
      var growth  = balance * (cfg.retRate / 100);
      var fees    = (balance + contrib) * (cfg.feeRate / 100);
      balance     = balance + contrib + growth - fees;
      balance     = Math.max(balance, 0);
      var totalYield = totalPaid > 0 ? ((balance - totalPaid) / totalPaid) * 100 : 0;
      var effYield   = totalPaid > 0 ? (Math.pow(balance / totalPaid, 1 / yr) - 1) * 100 : 0;
      rows.push({
        year:       yr,
        age:        cfg.age + yr,
        contrib:    contrib,
        totalPaid:  totalPaid,
        growth:     growth,
        fees:       fees,
        balance:    balance,
        totalYield: totalYield,
        effYield:   effYield,
      });
    }
    return rows;
  }

  function renderIllChart() {
    var rows = illCompute(illCfg);
    var projSeries = [{value:0,label:'Start'}];
    var paidSeries = [{value:0,label:'Start'}];
    rows.forEach(function(r) {
      projSeries.push({value:r.balance, label:'Yr '+r.year});
      paidSeries.push({value:r.totalPaid, label:'Yr '+r.year});
    });
    var el = document.getElementById('illChart');
    if (el && typeof Charts !== 'undefined') {
      Charts.multiLine(el, [
        {data: projSeries,  color: '#6b9bdb', label: 'Projected Value'},
        {data: paidSeries,  color: '#94a3b8', label: 'Total Premiums'},
      ], {height: 200});
    }
  }

  function runIllCalc() {
    var rows = illCompute(illCfg);
    var last = rows[rows.length - 1];

    function setEl(id, txt) { var e = document.getElementById(id); if(e) e.textContent = txt; }
    setEl('illCardPaid',  fmtDollar(last.totalPaid));
    setEl('illCardProj',  fmtDollar(last.balance));
    var net = last.balance - last.totalPaid;
    setEl('illCardNet',   (net >= 0 ? '+' : '') + fmtDollar(net));
    setEl('illCardYield', last.effYield.toFixed(2) + '%');

    renderIllChart();

    /* Table */
    var tbody = document.getElementById('illTbody');
    if (tbody) {
      while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
      rows.forEach(function(r, i) {
        var tr = document.createElement('tr');
        tr.style.background = i % 2 === 0 ? 'var(--surface1,#111827)' : 'var(--surface2)';
        var cells = [
          {text: r.year,                        align:'center', color:'var(--text3)'},
          {text: r.age,                          align:'center', color:'var(--text3)'},
          {text: fmtDollar(r.totalPaid),         align:'right',  color:'var(--text2)'},
          {text: '+'+fmtDollar(r.growth),        align:'right',  color:'#34d399'},
          {text: '-'+fmtDollar(r.fees),          align:'right',  color:'#ef4444'},
          {text: fmtDollar(r.balance),           align:'right',  color:'#6b9bdb', bold:true},
          {text: r.totalYield.toFixed(1)+'%',    align:'right',  color:'#C4A24D'},
          {text: r.effYield.toFixed(2)+'%',      align:'right',  color:'#a78bfa'},
        ];
        cells.forEach(function(c) {
          var td = document.createElement('td');
          td.style.cssText = 'padding:7px 10px;text-align:'+c.align+';color:'+c.color+';'+(c.bold?'font-weight:600;':'');
          td.textContent = c.text;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }
  }

  container.appendChild(panelIll);

  /* ======================================================
     SECTION 4 — RETIREMENT STEP-BY-STEP DEMO
     ====================================================== */
  var retSectionHeader = sectionDivider(
    'Try It \u2014 Retirement Step-by-Step',
    'Walk Through the Retirement Reality Check',
    'See why starting early matters. Walk through the 5-step retirement reality check.'
  );
  container.appendChild(retSectionHeader);

  var panelRet = document.createElement('div');

  /* Input row */
  var retInputRow = document.createElement('div');
  retInputRow.style.cssText = [
    'display:flex',
    'flex-wrap:wrap',
    'gap:16px',
    'align-items:center',
    'background:var(--surface2)',
    'border:1px solid var(--border)',
    'border-radius:10px',
    'padding:14px 18px',
    'margin-bottom:24px',
    'font-size:0.85rem',
    'color:var(--text2)',
  ].join(';');

  function retInputField(label, id, defaultVal, min, max) {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center;gap:6px;';
    var lbl = document.createElement('span');
    lbl.style.cssText = 'color:var(--text3);font-size:0.80rem;white-space:nowrap;';
    lbl.textContent = label;
    var inp = document.createElement('input');
    inp.type = 'number';
    inp.id = id;
    inp.value = defaultVal;
    inp.min = min;
    inp.max = max;
    inp.style.cssText = [
      'width:72px',
      'background:var(--surface3,#1f2937)',
      'color:var(--text1,#f9fafb)',
      'border:1px solid var(--border)',
      'border-radius:6px',
      'padding:4px 8px',
      'font-size:0.84rem',
      'font-weight:600',
      'outline:none',
      'text-align:center',
    ].join(';');
    wrap.appendChild(lbl);
    wrap.appendChild(inp);
    return wrap;
  }

  var retCfg = { curAge: 30, retAge: 62, monthly: 4000, inflation: 3 };

  retInputRow.appendChild(retInputField('Current Age:', 'retCurAge', retCfg.curAge, 20, 55));
  retInputRow.appendChild(retInputField('Retirement Age:', 'retRetAge', retCfg.retAge, 55, 75));
  retInputRow.appendChild(retInputField('Monthly Lifestyle ($):', 'retMonthly', retCfg.monthly, 500, 20000));
  retInputRow.appendChild(retInputField('Inflation (%):', 'retInflation', retCfg.inflation, 1, 6));

  /* Recalculate on any input change */
  ['retCurAge','retRetAge','retMonthly','retInflation'].forEach(function(id) {
    setTimeout(function() {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function() {
        retCfg.curAge    = parseInt(document.getElementById('retCurAge').value,10)    || 30;
        retCfg.retAge    = parseInt(document.getElementById('retRetAge').value,10)    || 62;
        retCfg.monthly   = parseFloat(document.getElementById('retMonthly').value)    || 4000;
        retCfg.inflation = parseFloat(document.getElementById('retInflation').value)  || 3;
        renderRetStep(retCurrentStep);
      });
    }, 0);
  });

  panelRet.appendChild(retInputRow);

  /* Steps area */
  var retStepsWrap = document.createElement('div');
  panelRet.appendChild(retStepsWrap);

  var retCurrentStep = 0; /* 0-indexed */

  function retCalc() {
    var yearsToRet = Math.max(retCfg.retAge - retCfg.curAge, 1);
    var yearsInRet = Math.max(90 - retCfg.retAge, 1);
    var inflatedMonthly = retCfg.monthly * Math.pow(1 + retCfg.inflation / 100, yearsToRet);
    var totalNeeded = inflatedMonthly * 12 * yearsInRet;
    /* Without investing: straight monthly savings needed */
    var monthsToRet = yearsToRet * 12;
    var saveWithoutInvest = totalNeeded / monthsToRet;
    /* With 7% returns: PMT needed to accumulate totalNeeded */
    var r = 0.07 / 12;
    var n = monthsToRet;
    var pmt = totalNeeded * r / (Math.pow(1 + r, n) - 1);
    return {
      yearsToRet:       yearsToRet,
      yearsInRet:       yearsInRet,
      inflatedMonthly:  inflatedMonthly,
      totalNeeded:      totalNeeded,
      saveWithout:      saveWithoutInvest,
      smartMonthly:     pmt,
      pctOfLifestyle:   (saveWithoutInvest / retCfg.monthly) * 100,
    };
  }

  function renderRetStep(stepIdx) {
    retCurrentStep = stepIdx;
    var d = retCalc();

    while (retStepsWrap.firstChild) retStepsWrap.removeChild(retStepsWrap.firstChild);

    /* Steps definition (dynamic values from d) */
    var STEPS = [
      {
        num: 1,
        color: '#6b9bdb',
        heading: 'Your Current Lifestyle',
        bigNum: fmtDollar(retCfg.monthly) + '/month',
        body: 'This is your target monthly lifestyle in today\'s dollars — the income you want to maintain throughout retirement.',
        visual: function(wrap) {
          var bar = document.createElement('div');
          bar.style.cssText = 'display:flex;align-items:flex-end;gap:10px;margin-top:14px;';
          var b = document.createElement('div');
          b.style.cssText = 'width:60px;height:80px;background:#6b9bdb;border-radius:6px 6px 0 0;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;';
          var bl = document.createElement('span');
          bl.style.cssText = 'font-size:0.68rem;color:#fff;font-weight:700;';
          bl.textContent = 'TODAY';
          b.appendChild(bl);
          var lbl = document.createElement('div');
          lbl.style.cssText = 'font-size:0.78rem;color:var(--text3);';
          lbl.textContent = fmtDollar(retCfg.monthly)+'/mo';
          bar.appendChild(b);
          bar.appendChild(lbl);
          wrap.appendChild(bar);
        },
      },
      {
        num: 2,
        color: '#f59e0b',
        heading: 'Inflation\'s Impact',
        bigNum: fmtDollar(Math.round(d.inflatedMonthly)) + '/month',
        body: 'At retirement (age ' + retCfg.retAge + '), your $' + retCfg.monthly.toLocaleString() + '/month lifestyle will cost ' + fmtDollar(Math.round(d.inflatedMonthly)) + '/month due to ' + retCfg.inflation + '% inflation over ' + d.yearsToRet + ' years.',
        visual: function(wrap) {
          var bar = document.createElement('div');
          bar.style.cssText = 'display:flex;align-items:flex-end;gap:10px;margin-top:14px;';
          var bNow = document.createElement('div');
          bNow.style.cssText = 'width:50px;height:60px;background:#6b9bdb88;border-radius:6px 6px 0 0;display:flex;align-items:flex-end;justify-content:center;padding-bottom:5px;';
          var blNow = document.createElement('span');
          blNow.style.cssText = 'font-size:0.64rem;color:#fff;font-weight:700;';
          blNow.textContent = 'NOW';
          bNow.appendChild(blNow);
          var heightPct = Math.min((d.inflatedMonthly / (retCfg.monthly * 4)) * 100, 160);
          var bRet = document.createElement('div');
          bRet.style.cssText = 'width:50px;height:'+Math.max(heightPct,70)+'px;background:#f59e0b;border-radius:6px 6px 0 0;display:flex;align-items:flex-end;justify-content:center;padding-bottom:5px;';
          var blRet = document.createElement('span');
          blRet.style.cssText = 'font-size:0.64rem;color:#fff;font-weight:700;';
          blRet.textContent = 'RET.';
          bRet.appendChild(blRet);
          var arrow = document.createElement('div');
          arrow.style.cssText = 'font-size:1.4rem;color:#f59e0b;padding-bottom:8px;';
          arrow.textContent = '\u2191';
          bar.appendChild(bNow);
          bar.appendChild(arrow);
          bar.appendChild(bRet);
          var note = document.createElement('div');
          note.style.cssText = 'font-size:0.76rem;color:var(--text3);margin-left:8px;padding-bottom:8px;';
          note.textContent = '+' + Math.round((d.inflatedMonthly / retCfg.monthly - 1) * 100) + '% increase';
          bar.appendChild(note);
          wrap.appendChild(bar);
        },
      },
      {
        num: 3,
        color: '#ef4444',
        heading: 'The Retirement Gap',
        bigNum: fmtDollarK(d.totalNeeded) + ' total',
        body: 'You need ' + fmtDollar(Math.round(d.inflatedMonthly)) + '/month for ' + d.yearsInRet + ' years (to age 90). That\'s ' + fmtDollarK(d.totalNeeded) + ' total. Without a plan, your current savings trajectory won\'t cover this gap.',
        visual: function(wrap) {
          var gap = document.createElement('div');
          gap.style.cssText = 'margin-top:14px;display:flex;flex-direction:column;gap:8px;';
          var needed = document.createElement('div');
          needed.style.cssText = 'display:flex;align-items:center;gap:8px;';
          var nBar = document.createElement('div');
          nBar.style.cssText = 'height:18px;width:150px;background:#ef444488;border-radius:4px;border:1px solid #ef4444;';
          var nLbl = document.createElement('span');
          nLbl.style.cssText = 'font-size:0.76rem;color:#ef4444;font-weight:600;';
          nLbl.textContent = 'Need: ' + fmtDollarK(d.totalNeeded);
          needed.appendChild(nBar);
          needed.appendChild(nLbl);
          var have = document.createElement('div');
          have.style.cssText = 'display:flex;align-items:center;gap:8px;';
          var hBar = document.createElement('div');
          hBar.style.cssText = 'height:18px;width:40px;background:#34d39966;border-radius:4px;border:1px solid #34d399;';
          var hLbl = document.createElement('span');
          hLbl.style.cssText = 'font-size:0.76rem;color:#34d399;font-weight:600;';
          hLbl.textContent = 'Typical savings trajectory';
          have.appendChild(hBar);
          have.appendChild(hLbl);
          gap.appendChild(needed);
          gap.appendChild(have);
          wrap.appendChild(gap);
        },
      },
      {
        num: 4,
        color: '#ef4444',
        heading: 'The Reality Check',
        bigNum: fmtDollar(Math.round(d.saveWithout)) + '/month',
        body: 'Without investing, you\'d need to save ' + fmtDollar(Math.round(d.saveWithout)) + '/month from today — that\'s ' + Math.round(d.pctOfLifestyle) + '% of your current lifestyle target. Hardly practical!',
        visual: function(wrap) {
          var comp = document.createElement('div');
          comp.style.cssText = 'margin-top:14px;display:flex;flex-direction:column;gap:8px;';
          var row1 = document.createElement('div');
          row1.style.cssText = 'display:flex;align-items:center;gap:8px;';
          var r1bar = document.createElement('div');
          var r1w = Math.min((retCfg.monthly / (d.saveWithout * 1.2)) * 140, 140);
          r1bar.style.cssText = 'height:22px;width:'+Math.max(r1w,20)+'px;background:#6b9bdb88;border-radius:4px;border:1px solid #6b9bdb;flex-shrink:0;';
          var r1lbl = document.createElement('span');
          r1lbl.style.cssText = 'font-size:0.76rem;color:var(--text2);';
          r1lbl.textContent = 'Lifestyle: ' + fmtDollar(retCfg.monthly) + '/mo';
          row1.appendChild(r1bar);
          row1.appendChild(r1lbl);
          var row2 = document.createElement('div');
          row2.style.cssText = 'display:flex;align-items:center;gap:8px;';
          var r2bar = document.createElement('div');
          r2bar.style.cssText = 'height:22px;width:140px;background:#ef444488;border-radius:4px;border:1px solid #ef4444;flex-shrink:0;';
          var r2lbl = document.createElement('span');
          r2lbl.style.cssText = 'font-size:0.76rem;color:#ef4444;font-weight:600;';
          r2lbl.textContent = 'Without investing: ' + fmtDollar(Math.round(d.saveWithout)) + '/mo';
          row2.appendChild(r2bar);
          row2.appendChild(r2lbl);
          comp.appendChild(row1);
          comp.appendChild(row2);
          wrap.appendChild(comp);
        },
      },
      {
        num: 5,
        color: '#34d399',
        heading: 'The Smarter Approach',
        bigNum: fmtDollar(Math.round(d.smartMonthly)) + '/month',
        body: 'With 7% average returns, you only need to invest ' + fmtDollar(Math.round(d.smartMonthly)) + '/month. Compound growth does the heavy lifting — that\'s ' + Math.round((1 - d.smartMonthly / d.saveWithout) * 100) + '% less than saving without returns!',
        visual: function(wrap) {
          var comp = document.createElement('div');
          comp.style.cssText = 'margin-top:14px;display:flex;flex-direction:column;gap:8px;';
          var row1 = document.createElement('div');
          row1.style.cssText = 'display:flex;align-items:center;gap:8px;';
          var r1w = Math.min((d.saveWithout / (d.saveWithout * 1.1)) * 140, 140);
          var r1bar = document.createElement('div');
          r1bar.style.cssText = 'height:22px;width:'+r1w+'px;background:#ef444444;border-radius:4px;border:1px solid #ef444488;flex-shrink:0;';
          var r1lbl = document.createElement('span');
          r1lbl.style.cssText = 'font-size:0.76rem;color:var(--text3);';
          r1lbl.textContent = 'Without returns: ' + fmtDollar(Math.round(d.saveWithout)) + '/mo';
          row1.appendChild(r1bar);
          row1.appendChild(r1lbl);
          var row2 = document.createElement('div');
          row2.style.cssText = 'display:flex;align-items:center;gap:8px;';
          var r2w = Math.max((d.smartMonthly / d.saveWithout) * 140, 20);
          var r2bar = document.createElement('div');
          r2bar.style.cssText = 'height:22px;width:'+r2w+'px;background:#34d39966;border-radius:4px;border:1px solid #34d399;flex-shrink:0;';
          var r2lbl = document.createElement('span');
          r2lbl.style.cssText = 'font-size:0.76rem;color:#34d399;font-weight:700;';
          r2lbl.textContent = 'With 7% returns: ' + fmtDollar(Math.round(d.smartMonthly)) + '/mo';
          row2.appendChild(r2bar);
          row2.appendChild(r2lbl);
          comp.appendChild(row1);
          comp.appendChild(row2);
          wrap.appendChild(comp);
        },
      },
    ];

    var step = STEPS[stepIdx];

    /* Step card */
    var card = document.createElement('div');
    card.style.cssText = [
      'background:var(--surface2)',
      'border:1px solid var(--border)',
      'border-radius:14px',
      'padding:28px 32px',
      'max-width:640px',
      'margin:0 auto 20px',
      'position:relative',
    ].join(';');

    /* Step badge */
    var badge = document.createElement('div');
    badge.style.cssText = [
      'display:inline-flex',
      'align-items:center',
      'justify-content:center',
      'width:34px',
      'height:34px',
      'border-radius:50%',
      'background:' + step.color,
      'color:#fff',
      'font-size:0.9rem',
      'font-weight:800',
      'margin-bottom:14px',
      'box-shadow:0 0 0 4px ' + step.color + '28',
    ].join(';');
    badge.textContent = step.num;
    card.appendChild(badge);

    /* Heading */
    var heading = document.createElement('div');
    heading.style.cssText = 'font-size:1.05rem;font-weight:700;color:var(--text1,#f9fafb);margin-bottom:10px;';
    heading.textContent = step.heading;
    card.appendChild(heading);

    /* Big number */
    var bigNum = document.createElement('div');
    bigNum.style.cssText = 'font-size:2rem;font-weight:800;color:' + step.color + ';margin-bottom:10px;letter-spacing:-.02em;';
    bigNum.textContent = step.bigNum;
    card.appendChild(bigNum);

    /* Body text */
    var body = document.createElement('p');
    body.style.cssText = 'font-size:0.88rem;color:var(--text2);line-height:1.6;margin:0 0 4px;';
    body.textContent = step.body;
    card.appendChild(body);

    /* Visual */
    var visualWrap = document.createElement('div');
    step.visual(visualWrap);
    card.appendChild(visualWrap);

    retStepsWrap.appendChild(card);

    /* Step dots + navigation */
    var navWrap = document.createElement('div');
    navWrap.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:16px;max-width:640px;margin:0 auto;';

    var prevBtn = document.createElement('button');
    prevBtn.textContent = '\u2190 Previous';
    prevBtn.style.cssText = [
      'padding:9px 18px',
      'font-size:0.84rem',
      'font-weight:600',
      'border-radius:8px',
      'border:1px solid var(--border)',
      'background:var(--surface2)',
      'color:var(--text2)',
      'cursor:pointer',
      'transition:background .15s',
      'opacity:' + (stepIdx === 0 ? '0.3' : '1'),
    ].join(';');
    prevBtn.disabled = stepIdx === 0;
    prevBtn.addEventListener('click', function() {
      if (retCurrentStep > 0) renderRetStep(retCurrentStep - 1);
    });

    /* Dots */
    var dotsWrap = document.createElement('div');
    dotsWrap.style.cssText = 'display:flex;gap:8px;align-items:center;';
    STEPS.forEach(function(s, i) {
      var dot = document.createElement('div');
      var isActive = i === stepIdx;
      dot.style.cssText = [
        'width:' + (isActive ? '22px' : '8px'),
        'height:8px',
        'border-radius:4px',
        'background:' + (isActive ? step.color : 'var(--border)'),
        'cursor:pointer',
        'transition:all .2s',
      ].join(';');
      dot.addEventListener('click', function() { renderRetStep(i); });
      dotsWrap.appendChild(dot);
    });

    var nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next \u2192';
    nextBtn.style.cssText = [
      'padding:9px 18px',
      'font-size:0.84rem',
      'font-weight:600',
      'border-radius:8px',
      'border:none',
      'background:linear-gradient(135deg,var(--accent),#a78bfa)',
      'color:#fff',
      'cursor:pointer',
      'transition:opacity .15s',
      'opacity:' + (stepIdx === STEPS.length - 1 ? '0.3' : '1'),
    ].join(';');
    nextBtn.disabled = stepIdx === STEPS.length - 1;
    nextBtn.addEventListener('click', function() {
      if (retCurrentStep < STEPS.length - 1) renderRetStep(retCurrentStep + 1);
    });

    navWrap.appendChild(prevBtn);
    navWrap.appendChild(dotsWrap);
    navWrap.appendChild(nextBtn);
    retStepsWrap.appendChild(navWrap);
  }

  container.appendChild(panelRet);

  /* ======================================================
     SECTION 5 — PLATFORM STATS
     ====================================================== */
  var statsSectionHeader = sectionDivider('Platform Credibility', 'Trusted by Advisors Across Singapore', null);
  container.appendChild(statsSectionHeader);

  var STATS = [
    { value: '50+',     label: 'Products Covered',         sub: 'AIA, Allianz, Manulife and more' },
    { value: '100+',    label: 'Advisors Using This',       sub: 'Trusted across Singapore agencies' },
    { value: '< 2 Min', label: 'Per Illustration',          sub: 'From input to professional results' },
  ];

  var statsGrid = document.createElement('div');
  statsGrid.style.cssText = [
    'display:grid',
    'grid-template-columns:repeat(3,1fr)',
    'gap:16px',
    'margin-bottom:48px',
  ].join(';');

  var statsMq = window.matchMedia('(max-width:560px)');
  function applyStatsGrid(e) {
    statsGrid.style.gridTemplateColumns = e.matches ? '1fr' : 'repeat(3,1fr)';
  }
  statsMq.addEventListener('change', applyStatsGrid);
  applyStatsGrid(statsMq);

  STATS.forEach(function(s) {
    var card = document.createElement('div');
    card.style.cssText = [
      'background:var(--surface2)',
      'border:1px solid var(--border)',
      'border-radius:14px',
      'padding:28px 24px',
      'text-align:center',
    ].join(';');

    var val = document.createElement('div');
    val.style.cssText = 'font-size:2.2rem;font-weight:900;color:var(--accent,#6b9bdb);letter-spacing:-.03em;margin-bottom:6px;';
    val.textContent = s.value;

    var lbl = document.createElement('div');
    lbl.style.cssText = 'font-size:0.92rem;font-weight:700;color:var(--text1,#f9fafb);margin-bottom:6px;';
    lbl.textContent = s.label;

    var sub = document.createElement('div');
    sub.style.cssText = 'font-size:0.78rem;color:var(--text3);line-height:1.45;';
    sub.textContent = s.sub;

    card.appendChild(val);
    card.appendChild(lbl);
    card.appendChild(sub);
    statsGrid.appendChild(card);
  });

  container.appendChild(statsGrid);

  /* ======================================================
     INITIAL RENDERS (no tab switching needed)
     ====================================================== */
  setTimeout(function() { runIllCalc(); }, 0);
  renderRetStep(0);
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
   ACTIVITY TRACKER DEMO — 4 Tabbed Iframe Embeds
   ============================================================ */
DEMO_RENDERERS.tracker = function(container) {
  container.id = 'trackerDemo';
  while (container.firstChild) { container.removeChild(container.firstChild); }

  /* ================================================================
     TAB DEFINITIONS — 4 iframe demos
     ================================================================ */
  var tabDefs = [
    { id: 'activity',    label: 'Activity',    src: 'https://activitytracker-demo.vercel.app/demos/activity.html' },
    { id: 'leaderboard', label: 'Leaderboard', src: 'https://activitytracker-demo.vercel.app/demos/leaderboard.html' },
    { id: 'calculator',  label: 'Calculator',  src: 'https://activitytracker-demo.vercel.app/demos/activity-calc.html' },
    { id: 'forest',      label: 'Forest',      src: 'https://tree-showcase-omega.vercel.app/mockup.html#daily' },
  ];

  /* ---- Tab bar ---- */
  var tabBar = document.createElement('div');
  tabBar.style.cssText = 'display:flex;gap:4px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:4px;margin-bottom:24px;position:sticky;top:60px;z-index:50;';

  var panes = [];
  var iframes = [];
  var loaded = [];

  function switchTrackerTab(idx) {
    panes.forEach(function(p, i) { p.style.display = i === idx ? 'block' : 'none'; });
    tabBar.querySelectorAll('.tracker-tab-btn').forEach(function(btn, i) {
      if (i === idx) {
        btn.style.cssText = 'flex:1;padding:10px 16px;border-radius:7px;font-size:0.82rem;font-weight:700;cursor:pointer;border:none;background:var(--primary,#3b82f6);color:#fff;transition:background .15s;white-space:nowrap;';
      } else {
        btn.style.cssText = 'flex:1;padding:10px 16px;border-radius:7px;font-size:0.82rem;font-weight:600;cursor:pointer;border:none;background:transparent;color:var(--text2);transition:background .15s;white-space:nowrap;';
      }
    });
    /* Lazy-load: set iframe src only when tab is first activated */
    if (!loaded[idx]) {
      loaded[idx] = true;
      iframes[idx].src = tabDefs[idx].src;
    }
  }

  tabDefs.forEach(function(td, idx) {
    /* Tab button */
    var btn = document.createElement('button');
    btn.className = 'tracker-tab-btn';
    btn.textContent = td.label;
    btn.style.cssText = 'flex:1;padding:10px 16px;border-radius:7px;font-size:0.82rem;font-weight:600;cursor:pointer;border:none;background:transparent;color:var(--text2);transition:background .15s;white-space:nowrap;';
    btn.addEventListener('click', function() { switchTrackerTab(idx); });
    tabBar.appendChild(btn);

    /* Pane wrapper */
    var pane = document.createElement('div');
    pane.style.display = 'none';

    /* Loading spinner */
    var spinner = document.createElement('div');
    spinner.style.cssText = 'display:flex;align-items:center;justify-content:center;min-height:800px;flex-direction:column;gap:12px;';
    var ring = document.createElement('div');
    ring.style.cssText = 'width:40px;height:40px;border:3px solid var(--border);border-top-color:var(--primary,#3b82f6);border-radius:50%;animation:trackerSpin 0.8s linear infinite;';
    var spinLabel = document.createElement('span');
    spinLabel.style.cssText = 'font-size:0.8rem;color:var(--text3);';
    spinLabel.textContent = 'Loading ' + td.label + '...';
    spinner.appendChild(ring);
    spinner.appendChild(spinLabel);
    pane.appendChild(spinner);

    /* Iframe */
    var iframe = document.createElement('iframe');
    iframe.style.cssText = 'width:100%;min-height:800px;border:none;border-radius:10px;display:none;';
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('allow', 'clipboard-write');
    iframe.title = td.label + ' Demo';
    iframe.addEventListener('load', function() {
      spinner.style.display = 'none';
      iframe.style.display = 'block';
    });
    pane.appendChild(iframe);

    /* Fallback link */
    var fallback = document.createElement('a');
    fallback.href = td.src;
    fallback.target = '_blank';
    fallback.rel = 'noopener';
    fallback.style.cssText = 'display:block;text-align:center;font-size:0.78rem;color:var(--primary-light,#6b9bdb);margin-top:10px;text-decoration:none;';
    fallback.textContent = 'Open ' + td.label + ' in new tab';
    pane.appendChild(fallback);

    iframes.push(iframe);
    loaded.push(false);
    panes.push(pane);
  });

  container.appendChild(tabBar);
  panes.forEach(function(p) { container.appendChild(p); });

  /* Spinner animation */
  if (!document.getElementById('trackerSpinStyle')) {
    var style = document.createElement('style');
    style.id = 'trackerSpinStyle';
    style.textContent = '@keyframes trackerSpin{to{transform:rotate(360deg)}}';
    document.head.appendChild(style);
  }

  /* Activate first tab */
  switchTrackerTab(0);
};

/* ============================================================
   PRODUCT COMPASS DEMO  (rebuilt)
   ============================================================ */

DEMO_RENDERERS.compass = function(container) {
  while (container.firstChild) { container.removeChild(container.firstChild); }
  container.id = 'compassDemo';

  /* ---- helpers ---- */
  function mk(tag, css, text) {
    var el = document.createElement(tag);
    if (css) el.style.cssText = css;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function clr(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function showToast(msg) {
    var t = mk('div',
      'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);' +
      'background:#1a2235;border:1px solid rgba(59,130,246,0.4);color:#fff;' +
      'font-size:0.82rem;font-weight:600;padding:10px 20px;border-radius:8px;' +
      'box-shadow:0 4px 24px rgba(0,0,0,.5);z-index:9999;white-space:nowrap;' +
      'opacity:0;transition:opacity .2s;', msg);
    document.body.appendChild(t);
    requestAnimationFrame(function() { t.style.opacity = '1'; });
    setTimeout(function() {
      t.style.opacity = '0';
      setTimeout(function() { if (t.parentNode) t.parentNode.removeChild(t); }, 300);
    }, 2600);
  }

  /* ================================================================
     SECTION 1: HERO
     ================================================================ */
  (function() {
    var hero = mk('div',
      'text-align:center;padding:32px 16px 28px;margin-bottom:28px;' +
      'background:linear-gradient(160deg,rgba(59,130,246,0.08) 0%,rgba(16,185,129,0.06) 100%);' +
      'border:1px solid rgba(59,130,246,0.15);border-radius:16px;');

    /* Badge */
    var badge = mk('div',
      'display:inline-block;font-size:0.62rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;' +
      'background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.3);' +
      'border-radius:99px;padding:4px 12px;margin-bottom:16px;',
      'All-in-One Training Platform');
    hero.appendChild(badge);

    /* Headline */
    var headline = mk('div',
      'font-size:1.55rem;font-weight:900;color:var(--text);line-height:1.2;margin-bottom:10px;',
      'From Day One to Field-Ready \u2014 Faster');
    hero.appendChild(headline);

    /* Subline */
    var subline = mk('div',
      'font-size:0.82rem;color:var(--text2);line-height:1.6;max-width:520px;margin:0 auto 20px;',
      'Product knowledge, exam prep, AI roleplay, scripts and more \u2014 everything a new advisor needs to get licensed and start closing, in one platform.');
    hero.appendChild(subline);

    /* Stats row */
    var statsRow = mk('div',
      'display:flex;flex-wrap:wrap;justify-content:center;gap:6px 20px;');
    var stats = ['1,000+ Questions', '5 CMFAS Modules', 'AI Roleplay', 'Video Library'];
    stats.forEach(function(s) {
      var chip = mk('div',
        'font-size:0.72rem;font-weight:600;color:var(--text3);' +
        'display:flex;align-items:center;gap:5px;');
      var dot = mk('span',
        'width:5px;height:5px;border-radius:50%;background:#3b82f6;display:inline-block;flex-shrink:0;');
      chip.appendChild(dot);
      chip.appendChild(document.createTextNode(s));
      statsRow.appendChild(chip);
    });
    hero.appendChild(statsRow);

    container.appendChild(hero);
  })();

  /* ================================================================
     SECTION 2: WHAT'S INSIDE — feature cards 2x3
     ================================================================ */
  (function() {
    var sectionLabel = mk('div',
      'font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;' +
      'color:var(--text3);margin-bottom:12px;',
      "What\u2019s Inside");
    container.appendChild(sectionLabel);

    var grid = mk('div',
      'display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:32px;');

    var features = [
      {
        emoji: '\uD83D\uDCDA',
        title: 'Learning Tracks',
        desc: 'Structured 5-phase journey from onboarding to field-ready',
        color: '#3b82f6',
      },
      {
        emoji: '\uD83E\uDDE0',
        title: 'Question Banks',
        desc: '1,000+ exam questions across M9, M9A, HI, RES5 with explanations',
        color: '#8b5cf6',
      },
      {
        emoji: '\uD83C\uDFAD',
        title: 'AI Roleplay',
        desc: 'Practice client conversations with AI avatars that score your performance',
        color: '#10b981',
      },
      {
        emoji: '\uD83D\uDCDD',
        title: 'Script Database',
        desc: 'Cold calling, objections, referrals \u2014 proven scripts categorized and rated',
        color: '#f59e0b',
      },
      {
        emoji: '\uD83C\uDFAC',
        title: 'Video Library',
        desc: '48 video lectures with AI summaries and progress tracking',
        color: '#ec4899',
      },
      {
        emoji: '\uD83D\uDDC2\uFE0F',
        title: 'Product Knowledge',
        desc: 'Concept cards, product details, and coverage comparisons',
        color: '#64748b',
      },
    ];

    features.forEach(function(f) {
      var card = mk('div',
        'background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px;' +
        'transition:border-color .15s,transform .15s;cursor:default;');
      card.addEventListener('mouseenter', function() {
        card.style.borderColor = f.color;
        card.style.transform = 'translateY(-1px)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.borderColor = '';
        card.style.transform = '';
      });

      var iconWrap = mk('div',
        'width:36px;height:36px;border-radius:10px;display:flex;align-items:center;' +
        'justify-content:center;margin-bottom:10px;font-size:1.1rem;' +
        'background:' + f.color + '18;');
      iconWrap.textContent = f.emoji;
      card.appendChild(iconWrap);
      card.appendChild(mk('div',
        'font-size:0.78rem;font-weight:700;color:var(--text);margin-bottom:4px;',
        f.title));
      card.appendChild(mk('div',
        'font-size:0.68rem;color:var(--text3);line-height:1.5;',
        f.desc));
      grid.appendChild(card);
    });

    container.appendChild(grid);
  })();

  /* ================================================================
     SECTION 3: COURSE LIBRARY
     ================================================================ */
  (function() {
    var sectionLabel = mk('div',
      'font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;' +
      'color:var(--text3);margin-bottom:12px;',
      'Course Library');
    container.appendChild(sectionLabel);

    var courses = [
      {
        id: 'ilp-fundamentals',
        title: 'ILP Fundamentals',
        modules: 8,
        duration: '4.5 hours',
        progress: 100,
        color: '#3b82f6',
        lessons: [
          { title: 'What is an Investment-Linked Policy?', duration: '32 min', done: true },
          { title: 'ILP Fund Types & Risk Profiles', duration: '28 min', done: true },
          { title: 'Premium Allocation & Charges', duration: '35 min', done: true },
          { title: 'Surrender Values & Switching', duration: '40 min', done: true },
          { title: 'Client Suitability Assessment', duration: '30 min', done: true },
        ],
        resources: [
          'ILP Product Comparison Chart (PDF)',
          'Fund Performance Fact Sheet (PDF)',
          'Client Presentation Template (PPTX)',
        ],
        comments: [
          { name: 'Rachel Lim', time: '2 days ago', text: 'The fund switching module finally made sense after the walkthrough example. Really clear!' },
          { name: 'David Tan', time: '5 days ago', text: 'Helped me explain ILP charges to a skeptical client. Closed the case the next week.' },
        ],
      },
      {
        id: 'protection-planning',
        title: 'Protection Planning',
        modules: 6,
        duration: '3 hours',
        progress: 65,
        color: '#10b981',
        lessons: [
          { title: 'Needs-Based Analysis Framework', duration: '25 min', done: true },
          { title: 'Income Replacement Method', duration: '30 min', done: true },
          { title: 'Critical Illness vs Early CI', duration: '35 min', done: true },
          { title: 'Group vs Individual Coverage', duration: '28 min', done: false },
          { title: 'Presenting the Protection Gap', duration: '32 min', done: false },
        ],
        resources: [
          'FNA Worksheet Template (PDF)',
          'Protection Gap Calculator (XLSX)',
          'CI Coverage Comparison Guide (PDF)',
        ],
        comments: [
          { name: 'Sarah Chen', time: '1 week ago', text: 'The protection gap presentation template is gold. Used it in 3 client meetings already.' },
          { name: 'James Ng', time: '2 weeks ago', text: 'Module 3 on CI vs Early CI cleared up confusion I had for months.' },
        ],
      },
      {
        id: 'retirement-solutions',
        title: 'Retirement Solutions',
        modules: 7,
        duration: '3.5 hours',
        progress: 40,
        color: '#f59e0b',
        lessons: [
          { title: 'CPF LIFE & Retirement Adequacy', duration: '30 min', done: true },
          { title: 'Retirement Income Layering', duration: '35 min', done: true },
          { title: 'Annuity Products Deep Dive', duration: '40 min', done: false },
          { title: 'SRS & Tax-Efficient Strategies', duration: '28 min', done: false },
          { title: 'Presenting Retirement Plans', duration: '32 min', done: false },
        ],
        resources: [
          'Retirement Needs Calculator (PDF)',
          'CPF LIFE Payout Estimator (XLSX)',
          'Retirement Planning Script (PDF)',
        ],
        comments: [
          { name: 'Michelle Ong', time: '3 days ago', text: 'CPF LIFE module was eye-opening. Now I can confidently discuss retirement adequacy with older clients.' },
          { name: 'Kevin Tan', time: '1 week ago', text: 'The income layering concept is a game-changer for presentations.' },
        ],
      },
      {
        id: 'critical-illness',
        title: 'Critical Illness',
        modules: 5,
        duration: '2.5 hours',
        progress: 20,
        color: '#ec4899',
        lessons: [
          { title: 'CI Definition & Coverage Scope', duration: '25 min', done: true },
          { title: 'Early vs Late Stage CI', duration: '30 min', done: false },
          { title: 'Multi-Pay CI Products', duration: '35 min', done: false },
          { title: 'CI Riders vs Standalone Plans', duration: '28 min', done: false },
        ],
        resources: [
          'CI Product Comparison Matrix (PDF)',
          'Claims Statistics Report (PDF)',
          'Client Objection Handling Guide (PDF)',
        ],
        comments: [
          { name: 'Amanda Wong', time: '4 days ago', text: 'The claims statistics really help when clients ask "do I really need CI coverage?"' },
          { name: 'Patrick Lee', time: '1 week ago', text: 'Multi-pay CI module was exactly what I needed for my upcoming product presentation.' },
        ],
      },
      {
        id: 'ilp-products',
        title: 'Investment-Linked Products',
        modules: 9,
        duration: '5 hours',
        progress: 0,
        color: '#8b5cf6',
        lessons: [
          { title: 'ILP Market Landscape in Singapore', duration: '30 min', done: false },
          { title: 'Regular vs Single Premium ILPs', duration: '35 min', done: false },
          { title: 'Fund Selection & Asset Allocation', duration: '40 min', done: false },
          { title: 'ILP Charges Breakdown', duration: '32 min', done: false },
          { title: 'Suitability & Risk Profiling', duration: '28 min', done: false },
        ],
        resources: [
          'ILP Fund Fact Sheets Collection (PDF)',
          'Risk Profiling Questionnaire (PDF)',
          'ILP vs Unit Trust Comparison (PDF)',
        ],
        comments: [
          { name: 'Vincent Teo', time: '2 weeks ago', text: 'Looking forward to starting this one. The ILP Fundamentals course was great prep.' },
        ],
      },
      {
        id: 'compliance-ethics',
        title: 'Compliance & Ethics',
        modules: 6,
        duration: '3 hours',
        progress: 85,
        color: '#64748b',
        lessons: [
          { title: 'MAS Regulatory Framework', duration: '30 min', done: true },
          { title: 'FAA-N16 & Fair Dealing', duration: '35 min', done: true },
          { title: 'Anti-Money Laundering (AML)', duration: '28 min', done: true },
          { title: 'Data Protection (PDPA)', duration: '32 min', done: true },
          { title: 'Social Media Compliance', duration: '25 min', done: false },
        ],
        resources: [
          'MAS Guidelines Quick Reference (PDF)',
          'Compliance Checklist for Advisors (PDF)',
          'PDPA Consent Form Template (PDF)',
        ],
        comments: [
          { name: 'Grace Loh', time: '6 days ago', text: 'The AML module saved me during a compliance audit. Knew exactly what to look for.' },
          { name: 'Bryan Koh', time: '2 weeks ago', text: 'Social media compliance is surprisingly tricky. Glad this is covered.' },
        ],
      },
    ];

    var expandedCourse = null;

    var gridWrap = mk('div', '');
    container.appendChild(gridWrap);

    function renderCourseGrid() {
      clr(gridWrap);

      var grid = mk('div',
        'display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;margin-bottom:32px;');

      courses.forEach(function(course) {
        var isExpanded = expandedCourse === course.id;

        var card = mk('div',
          'background:var(--bg2);border:1px solid ' + (isExpanded ? course.color : 'var(--border)') + ';' +
          'border-radius:12px;overflow:hidden;transition:border-color .15s;' +
          (isExpanded ? 'grid-column:1/-1;' : 'cursor:pointer;'));

        if (!isExpanded) {
          card.addEventListener('mouseenter', function() { card.style.borderColor = course.color; });
          card.addEventListener('mouseleave', function() { card.style.borderColor = ''; });
          card.addEventListener('click', function() {
            expandedCourse = course.id;
            renderCourseGrid();
          });
        }

        /* Card header - always shown */
        var header = mk('div', 'padding:16px;');

        /* Thumbnail placeholder */
        var thumb = mk('div',
          'height:' + (isExpanded ? '0' : '100') + 'px;background:linear-gradient(135deg,' + course.color + '22,' + course.color + '08);' +
          'border-radius:8px;margin-bottom:' + (isExpanded ? '0' : '12') + 'px;display:flex;align-items:center;justify-content:center;' +
          (isExpanded ? 'overflow:hidden;' : ''));
        if (!isExpanded) {
          var thumbIcon = mk('div',
            'width:40px;height:40px;border-radius:50%;background:' + course.color + '33;' +
            'display:flex;align-items:center;justify-content:center;');
          var playTriangle = mk('div',
            'width:0;height:0;border-style:solid;border-width:8px 0 8px 14px;' +
            'border-color:transparent transparent transparent ' + course.color + ';margin-left:2px;');
          thumbIcon.appendChild(playTriangle);
          thumb.appendChild(thumbIcon);
        }
        header.appendChild(thumb);

        var titleRow = mk('div', 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;');
        titleRow.appendChild(mk('div', 'font-size:0.85rem;font-weight:700;color:var(--text);', course.title));
        var metaBadge = mk('div',
          'font-size:0.62rem;font-weight:600;color:' + course.color + ';background:' + course.color + '18;' +
          'padding:2px 8px;border-radius:99px;white-space:nowrap;',
          course.modules + ' modules');
        titleRow.appendChild(metaBadge);
        header.appendChild(titleRow);

        var metaRow = mk('div', 'display:flex;gap:12px;margin-bottom:10px;');
        metaRow.appendChild(mk('span', 'font-size:0.68rem;color:var(--text3);', course.duration));
        metaRow.appendChild(mk('span', 'font-size:0.68rem;color:var(--text3);',
          course.progress === 0 ? 'Not started' : course.progress === 100 ? 'Completed' : course.progress + '% complete'));
        header.appendChild(metaRow);

        /* Progress bar */
        var barOuter = mk('div',
          'height:4px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;');
        var barInner = mk('div',
          'height:100%;width:' + course.progress + '%;background:' + course.color + ';border-radius:2px;transition:width .3s;');
        barOuter.appendChild(barInner);
        header.appendChild(barOuter);
        card.appendChild(header);

        /* Expanded detail view */
        if (isExpanded) {
          var detail = mk('div', 'padding:0 16px 16px;');

          /* Close button */
          var closeBtn = mk('button',
            'display:block;margin-bottom:16px;padding:6px 14px;border-radius:8px;border:1px solid var(--border);' +
            'background:transparent;color:var(--text2);font-size:0.72rem;cursor:pointer;',
            'Close');
          closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            expandedCourse = null;
            renderCourseGrid();
          });
          detail.appendChild(closeBtn);

          /* Two-column layout: video + module outline */
          var detailGrid = mk('div',
            'display:grid;grid-template-columns:1fr 300px;gap:16px;margin-bottom:20px;');

          /* Video player placeholder */
          var videoWrap = mk('div', '');
          var videoPlaceholder = mk('div',
            'aspect-ratio:16/9;background:#0a0e17;border-radius:10px;display:flex;align-items:center;' +
            'justify-content:center;border:1px solid var(--border);position:relative;overflow:hidden;');
          var playBtn = mk('div',
            'width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.1);' +
            'display:flex;align-items:center;justify-content:center;cursor:pointer;' +
            'border:2px solid rgba(255,255,255,0.2);transition:background .15s;');
          playBtn.addEventListener('mouseenter', function() { playBtn.style.background = 'rgba(255,255,255,0.2)'; });
          playBtn.addEventListener('mouseleave', function() { playBtn.style.background = 'rgba(255,255,255,0.1)'; });
          var playIcon = mk('div',
            'width:0;height:0;border-style:solid;border-width:12px 0 12px 20px;' +
            'border-color:transparent transparent transparent rgba(255,255,255,0.8);margin-left:4px;');
          playBtn.appendChild(playIcon);
          videoPlaceholder.appendChild(playBtn);
          videoWrap.appendChild(videoPlaceholder);

          /* Progress bar for detail */
          var detailProgress = mk('div', 'margin-top:12px;');
          detailProgress.appendChild(mk('div',
            'font-size:0.68rem;color:var(--text3);margin-bottom:6px;display:flex;justify-content:space-between;'));
          detailProgress.lastChild.appendChild(mk('span', '', 'Course Progress'));
          detailProgress.lastChild.appendChild(mk('span', 'color:' + course.color + ';font-weight:700;', course.progress + '%'));
          var dpBar = mk('div', 'height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;');
          var dpFill = mk('div', 'height:100%;width:' + course.progress + '%;background:' + course.color + ';border-radius:3px;');
          dpBar.appendChild(dpFill);
          detailProgress.appendChild(dpBar);
          videoWrap.appendChild(detailProgress);
          detailGrid.appendChild(videoWrap);

          /* Module outline sidebar */
          var sidebar = mk('div',
            'background:var(--bg3,rgba(255,255,255,0.02));border:1px solid var(--border);border-radius:10px;padding:14px;' +
            'max-height:400px;overflow-y:auto;');
          sidebar.appendChild(mk('div',
            'font-size:0.68rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--text3);margin-bottom:12px;',
            'Module Outline'));

          course.lessons.forEach(function(lesson, idx) {
            var lessonRow = mk('div',
              'display:flex;align-items:flex-start;gap:10px;padding:10px 0;' +
              (idx < course.lessons.length - 1 ? 'border-bottom:1px solid var(--border);' : ''));

            var checkmark = mk('div',
              'width:18px;height:18px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;' +
              'font-size:0.6rem;margin-top:1px;' +
              (lesson.done
                ? 'background:' + course.color + ';color:#fff;'
                : 'border:1.5px solid var(--border);color:var(--text3);'));
            checkmark.textContent = lesson.done ? '\u2713' : String(idx + 1);
            lessonRow.appendChild(checkmark);

            var lessonInfo = mk('div', 'flex:1;min-width:0;');
            lessonInfo.appendChild(mk('div',
              'font-size:0.72rem;font-weight:600;color:' + (lesson.done ? 'var(--text2)' : 'var(--text)') + ';line-height:1.3;' +
              (lesson.done ? 'text-decoration:line-through;opacity:0.6;' : ''),
              lesson.title));
            lessonInfo.appendChild(mk('div', 'font-size:0.62rem;color:var(--text3);margin-top:2px;', lesson.duration));
            lessonRow.appendChild(lessonInfo);
            sidebar.appendChild(lessonRow);
          });

          detailGrid.appendChild(sidebar);
          detail.appendChild(detailGrid);

          /* Resources panel */
          var resSection = mk('div', 'margin-bottom:20px;');
          resSection.appendChild(mk('div',
            'font-size:0.68rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--text3);margin-bottom:10px;',
            'Resources'));
          var resList = mk('div', 'display:flex;flex-direction:column;gap:6px;');
          course.resources.forEach(function(res) {
            var resItem = mk('div',
              'display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--bg3,rgba(255,255,255,0.02));' +
              'border:1px solid var(--border);border-radius:8px;cursor:pointer;transition:border-color .15s;');
            resItem.addEventListener('mouseenter', function() { resItem.style.borderColor = course.color; });
            resItem.addEventListener('mouseleave', function() { resItem.style.borderColor = ''; });
            var pdfIcon = mk('div',
              'width:28px;height:28px;border-radius:6px;background:' + course.color + '18;' +
              'display:flex;align-items:center;justify-content:center;flex-shrink:0;' +
              'font-size:0.6rem;font-weight:800;color:' + course.color + ';',
              res.match(/\((\w+)\)/)?.[1] || 'PDF');
            resItem.appendChild(pdfIcon);
            resItem.appendChild(mk('div', 'font-size:0.72rem;color:var(--text);', res.replace(/\s*\(\w+\)$/, '')));
            resList.appendChild(resItem);
          });
          resSection.appendChild(resList);
          detail.appendChild(resSection);

          /* Community comments - Skool-style */
          var commSection = mk('div', '');
          commSection.appendChild(mk('div',
            'font-size:0.68rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--text3);margin-bottom:10px;',
            'Discussion'));

          course.comments.forEach(function(comment) {
            var commentRow = mk('div',
              'display:flex;gap:10px;align-items:flex-start;padding:12px;' +
              'background:var(--bg3,rgba(255,255,255,0.02));border:1px solid var(--border);' +
              'border-radius:10px;margin-bottom:8px;');

            var avatar = mk('div',
              'width:32px;height:32px;border-radius:50%;background:' + course.color + '22;' +
              'display:flex;align-items:center;justify-content:center;flex-shrink:0;' +
              'font-size:0.65rem;font-weight:700;color:' + course.color + ';',
              comment.name.split(' ').map(function(w) { return w[0]; }).join(''));
            commentRow.appendChild(avatar);

            var commentBody = mk('div', 'flex:1;min-width:0;');
            var commentHeader = mk('div', 'display:flex;gap:8px;align-items:baseline;margin-bottom:4px;');
            commentHeader.appendChild(mk('span', 'font-size:0.72rem;font-weight:700;color:var(--text);', comment.name));
            commentHeader.appendChild(mk('span', 'font-size:0.6rem;color:var(--text3);', comment.time));
            commentBody.appendChild(commentHeader);
            commentBody.appendChild(mk('div', 'font-size:0.72rem;color:var(--text2);line-height:1.5;', comment.text));
            commentRow.appendChild(commentBody);
            commSection.appendChild(commentRow);
          });

          detail.appendChild(commSection);
          card.appendChild(detail);
        }

        grid.appendChild(card);
      });

      gridWrap.appendChild(grid);
    }

    /* Responsive: collapse detail grid on mobile */
    if (!document.getElementById('compassDetailStyle')) {
      var style = document.createElement('style');
      style.id = 'compassDetailStyle';
      style.textContent = '@media(max-width:640px){#compassDemo [style*="grid-template-columns:1fr 300px"]{grid-template-columns:1fr !important;}}';
      document.head.appendChild(style);
    }

    renderCourseGrid();
  })();
};


/* OLD_COMPASS_SECTIONS_REMOVED — see git history for roleplay, quiz, and coverage sections */


/* ============================================================
   AD LAUNCHPAD DEMO — rebuilt with 5-step wizard + lead management
   ============================================================ */

/* ---------- shared state ---------- */
window._lpTab2 = window._lpTab2 || 'wizard';
window._wizStep = window._wizStep !== undefined ? window._wizStep : 0;
window._wizData = window._wizData || {
  template: null,
  headline: "Protect Your Family's Future Today",
  text: "As a parent, your family's financial security matters most. Get a free consultation with a certified financial advisor.",
  cta: "Learn More",
  ageMin: 25, ageMax: 45,
  gender: 'all',
  locations: ['Singapore'],
  interests: ['Insurance', 'Financial Planning', 'Retirement'],
  advantagePlus: false,
  budget: 30,
  bidStrategy: 'Lowest Cost'
};
window._lpLeadStatuses = window._lpLeadStatuses || [
  'New','New','Contacted','Qualified','Converted','New','Contacted','Lost'
];
window._lpLeadFilter = window._lpLeadFilter || 'All';
window._lpExpandedLead = window._lpExpandedLead !== undefined ? window._lpExpandedLead : null;

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
  setTimeout(function() { t.style.opacity='0'; setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); },300); },2400);
}

/* ---------- tab switcher ---------- */
window.lpTab2 = function(id) {
  window._lpTab2 = id;
  document.querySelectorAll('.lp2-tab-btn').forEach(function(btn) {
    var active = btn.getAttribute('data-tab') === id;
    btn.style.cssText = 'padding:8px 20px;border-radius:8px;border:1px solid;cursor:pointer;font-size:13px;font-weight:600;transition:all .15s;' +
      (active ? 'background:rgba(59,130,246,0.2);border-color:#3b82f6;color:#fff;' : 'background:transparent;border-color:rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);');
  });
  document.querySelectorAll('.lp2-tab-panel').forEach(function(p) {
    p.style.display = p.getAttribute('data-panel') === id ? 'block' : 'none';
  });
};

/* ---------- wizard step navigation ---------- */
window.wizardNext = function() {
  var step = window._wizStep;
  var d = window._wizData;
  if (step === 0 && !d.template) { _lp_toast('Please select a template to continue'); return; }
  if (step < 4) { window._wizStep = step + 1; DEMO_RENDERERS.launchpad(document.querySelector('#launchpadRoot').parentNode.__lpContainer || document.querySelector('#launchpadRoot').closest('[data-demo]') || document.querySelector('#launchpadRoot').parentNode); }
  else { _lp_toast('Campaign queued for launch (paused for review)'); }
};
window.wizardBack = function() {
  if (window._wizStep > 0) { window._wizStep--; DEMO_RENDERERS.launchpad(document.querySelector('#launchpadRoot').parentNode.__lpContainer || document.querySelector('#launchpadRoot').parentNode); }
};

/* ---------- Facebook ad preview builder ---------- */
function _lp_fbPreview(d) {
  var card = _lp_el('div',
    'background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.18);max-width:320px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;');
  // Header
  var hdr = _lp_el('div','display:flex;align-items:center;gap:10px;padding:10px 12px;');
  var avatar = _lp_el('div','width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#1877f2,#42b883);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0;','FA');
  var meta = _lp_el('div','display:flex;flex-direction:column;gap:1px;');
  meta.appendChild(_lp_el('div','font-size:13px;font-weight:700;color:#1c1e21;line-height:1.2;','Financial Advisory'));
  var spRow = _lp_el('div','display:flex;align-items:center;gap:4px;');
  spRow.appendChild(_lp_el('span','font-size:11px;color:#606770;','Sponsored'));
  spRow.appendChild(_lp_el('span','font-size:11px;color:#606770;','·'));
  spRow.appendChild(_lp_el('span','font-size:11px;color:#1877f2;font-weight:600;','🌐'));
  meta.appendChild(spRow);
  hdr.appendChild(avatar); hdr.appendChild(meta);
  card.appendChild(hdr);
  // Body text
  var body = _lp_el('div','padding:0 12px 10px;font-size:13px;color:#1c1e21;line-height:1.5;', d.text);
  card.appendChild(body);
  // Image area
  var img = _lp_el('div','height:160px;background:linear-gradient(135deg,#1877f2 0%,#4f46e5 50%,#7c3aed 100%);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;');
  img.appendChild(_lp_el('div','font-size:18px;font-weight:800;color:#fff;text-align:center;line-height:1.3;text-shadow:0 2px 6px rgba(0,0,0,0.3);',d.headline));
  card.appendChild(img);
  // CTA bar
  var bar = _lp_el('div','padding:10px 12px;background:#f0f2f5;display:flex;align-items:center;justify-content:space-between;');
  bar.appendChild(_lp_el('div','font-size:11px;color:#606770;max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;','financialadvisory.com'));
  var ctaBtn = _lp_el('button','background:#1877f2;color:#fff;font-size:12px;font-weight:700;padding:6px 14px;border-radius:6px;border:none;cursor:default;white-space:nowrap;',d.cta);
  bar.appendChild(ctaBtn);
  card.appendChild(bar);
  return card;
}

/* ============================================================
   MAIN RENDERER
   ============================================================ */
DEMO_RENDERERS.launchpad = function(container) {
  container.innerHTML = '';

  var root = _lp_el('div','max-width:920px;margin:0 auto;padding:20px 16px;font-family:inherit;');
  root.id = 'launchpadRoot';
  container.__lpContainer = container;

  /* ============================================================
     SECTION 1 — HERO
  ============================================================ */
  var hero = _lp_el('div','text-align:center;padding:48px 24px 40px;');

  var badge = _lp_el('div',
    'display:inline-block;padding:5px 14px;border-radius:20px;border:1px solid rgba(59,130,246,0.45);' +
    'background:rgba(59,130,246,0.12);color:#93c5fd;font-size:12px;font-weight:700;letter-spacing:.06em;' +
    'text-transform:uppercase;margin-bottom:20px;',
    'Self-Service Ad Platform');
  hero.appendChild(badge);

  var heroTitle = _lp_el('h1',
    'font-size:clamp(24px,4vw,38px);font-weight:800;color:#fff;margin:0 0 14px 0;line-height:1.15;',
    'Launch Meta Ads Without Touching Ads Manager');
  hero.appendChild(heroTitle);

  var heroSub = _lp_el('p',
    'font-size:15px;color:rgba(255,255,255,0.55);margin:0 auto 28px;max-width:580px;line-height:1.6;',
    'Your advisors pick a template, customize copy, set a budget, and launch \u2014 all in 5 steps. You keep full control. Every campaign launches paused for review.');
  hero.appendChild(heroSub);

  var statsRow = _lp_el('div','display:flex;flex-wrap:wrap;justify-content:center;gap:8px;');
  ['5-Step Wizard','Live Ad Preview','Lead Tracking','Quality Scoring'].forEach(function(stat) {
    var s = _lp_el('div',
      'padding:6px 16px;border-radius:20px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);' +
      'font-size:12px;font-weight:600;color:rgba(255,255,255,0.65);',
      stat);
    statsRow.appendChild(s);
  });
  hero.appendChild(statsRow);
  root.appendChild(hero);

  /* ============================================================
     SECTION 2 — HOW IT WORKS
  ============================================================ */
  var howSection = _lp_el('div','padding:0 0 48px;');

  var howTitle = _lp_el('div',
    'font-size:11px;font-weight:700;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:.1em;text-align:center;margin-bottom:24px;',
    'How It Works');
  howSection.appendChild(howTitle);

  var howGrid = _lp_el('div','display:grid;grid-template-columns:repeat(3,1fr);gap:16px;');
  var howSteps = [
    {
      num: '1',
      title: 'Pick a Template',
      desc: 'Choose from pre-built campaign templates designed for insurance and financial advisory. Lead gen, seminar registration, brand awareness.'
    },
    {
      num: '2',
      title: 'Customize & Launch',
      desc: 'Edit copy, set budget, define audience \u2014 see a live Facebook ad preview update in real-time. Hit launch.'
    },
    {
      num: '3',
      title: 'Track Results',
      desc: 'Monitor leads, quality scores, campaign metrics. Every lead gets scored automatically (0\u2013100%) based on form completeness.'
    }
  ];
  howSteps.forEach(function(step) {
    var card = _lp_el('div',
      'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:22px 20px;');
    var numBadge = _lp_el('div',
      'width:32px;height:32px;border-radius:50%;background:rgba(59,130,246,0.2);border:1px solid rgba(59,130,246,0.35);' +
      'color:#93c5fd;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;margin-bottom:14px;',
      step.num);
    card.appendChild(numBadge);
    card.appendChild(_lp_el('div','font-size:14px;font-weight:700;color:#fff;margin-bottom:8px;', step.title));
    card.appendChild(_lp_el('div','font-size:13px;color:rgba(255,255,255,0.5);line-height:1.55;', step.desc));
    howGrid.appendChild(card);
  });
  howSection.appendChild(howGrid);
  root.appendChild(howSection);

  /* ============================================================
     SECTION 3 — INTERACTIVE DEMO: CAMPAIGN WIZARD
  ============================================================ */
  var wizSection = _lp_el('div','padding:0 0 48px;');

  var wizHeader = _lp_el('div',
    'margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.08);');
  var wizLabel = _lp_el('div',
    'font-size:11px;font-weight:700;color:#3b82f6;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px;',
    'Try It \u2014 Campaign Wizard');
  var wizSubtext = _lp_el('div',
    'font-size:13px;color:rgba(255,255,255,0.45);',
    'Walk through the 5-step process. Select a template, write copy, target your audience, set budget, and review.');
  wizHeader.appendChild(wizLabel);
  wizHeader.appendChild(wizSubtext);
  wizSection.appendChild(wizHeader);

  var wizPanel = _lp_el('div');

  var stepNames = ['Template', 'Ad Creative', 'Audience', 'Budget', 'Review'];
  var step = window._wizStep;
  var d = window._wizData;

  /* -- Progress indicator -- */
  var progressWrap = _lp_el('div','display:flex;flex-direction:column;align-items:center;margin-bottom:32px;gap:10px;');
  var dotsRow = _lp_el('div','display:flex;align-items:center;width:100%;max-width:560px;');
  var labelsRow = _lp_el('div','display:flex;justify-content:space-between;width:100%;max-width:560px;');
  stepNames.forEach(function(name, i) {
    var done = i < step, active = i === step;
    var dot = _lp_el('div');
    dot.style.cssText = 'width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;transition:all .2s;' +
      (done   ? 'background:#34d399;color:#0a0f1a;border:2px solid #34d399;' :
       active ? 'background:#3b82f6;color:#fff;border:2px solid #3b82f6;box-shadow:0 0 0 4px rgba(59,130,246,0.2);' :
                'background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.35);border:2px solid rgba(255,255,255,0.12);');
    dot.textContent = done ? '\u2713' : String(i + 1);
    dotsRow.appendChild(dot);
    if (i < stepNames.length - 1) {
      dotsRow.appendChild(_lp_el('div','flex:1;height:2px;' + (done ? 'background:#34d399;' : 'background:rgba(255,255,255,0.1);')));
    }
    labelsRow.appendChild(_lp_el('div',
      'font-size:11px;text-align:center;width:68px;' +
      (active ? 'color:#3b82f6;font-weight:700;' : done ? 'color:#34d399;' : 'color:rgba(255,255,255,0.35);'),
      name));
  });
  progressWrap.appendChild(dotsRow);
  progressWrap.appendChild(labelsRow);
  progressWrap.appendChild(_lp_el('div',
    'font-size:12px;color:rgba(255,255,255,0.35);letter-spacing:.04em;',
    'Step ' + (step + 1) + ' of 5 \u2014 ' + stepNames[step]));
  wizPanel.appendChild(progressWrap);

  /* -- Step card -- */
  var card = _lp_el('div',
    'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;min-height:340px;');

  /* ---- STEP 0: Select Template ---- */
  if (step === 0) {
    card.appendChild(_lp_el('h3','font-size:16px;font-weight:700;color:#fff;margin:0 0 6px 0;','Select a Template'));
    card.appendChild(_lp_el('p','font-size:13px;color:rgba(255,255,255,0.5);margin:0 0 20px 0;','Choose the campaign type that best matches your goal.'));

    // Campaign type selector
    var typeRow = _lp_el('div','display:flex;align-items:center;gap:10px;margin-bottom:24px;padding:12px 16px;background:rgba(59,130,246,0.12);border:1px solid rgba(59,130,246,0.3);border-radius:10px;');
    typeRow.appendChild(_lp_el('span','font-size:20px;','📋'));
    var typeInfo = _lp_el('div');
    typeInfo.appendChild(_lp_el('div','font-size:14px;font-weight:700;color:#fff;','Lead Generation'));
    typeInfo.appendChild(_lp_el('div','font-size:12px;color:rgba(255,255,255,0.5);','(Most common for insurance advisors)'));
    typeRow.appendChild(typeInfo);
    card.appendChild(typeRow);

    // Template grid
    var templates = [
      { id: 'ins', name: 'Insurance Lead Gen', clients: 47, badge: 'Most Popular', gradient: 'linear-gradient(135deg,#1877f2,#4f46e5)' },
      { id: 'sem', name: 'Seminar Registration', clients: 23, badge: null, gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
      { id: 'brd', name: 'Brand Story', clients: 15, badge: null, gradient: 'linear-gradient(135deg,#34d399,#059669)' }
    ];
    var grid = _lp_el('div','display:grid;grid-template-columns:repeat(3,1fr);gap:14px;');
    templates.forEach(function(tmpl) {
      var selected = d.template === tmpl.id;
      var tCard = _lp_el('div',
        'border-radius:12px;border:2px solid;cursor:pointer;overflow:hidden;transition:all .15s;' +
        (selected ? 'border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.2);' : 'border-color:rgba(255,255,255,0.1);'));
      // Thumbnail
      var thumb = _lp_el('div','height:80px;position:relative;', '');
      thumb.style.background = tmpl.gradient;
      if (tmpl.badge) {
        var badge = _lp_el('div',
          'position:absolute;top:8px;left:8px;background:#f59e0b;color:#0a0f1a;font-size:10px;font-weight:800;padding:2px 8px;border-radius:20px;',
          tmpl.badge);
        thumb.appendChild(badge);
      }
      if (selected) {
        var ck = _lp_el('div','position:absolute;top:8px;right:8px;width:20px;height:20px;border-radius:50%;background:#3b82f6;display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;font-weight:700;','\u2713');
        thumb.appendChild(ck);
      }
      tCard.appendChild(thumb);
      var tBody = _lp_el('div','padding:10px 12px;background:rgba(255,255,255,0.04);');
      tBody.appendChild(_lp_el('div','font-size:13px;font-weight:600;color:#fff;margin-bottom:4px;',tmpl.name));
      tBody.appendChild(_lp_el('div','font-size:11px;color:rgba(255,255,255,0.4);','Used by '+tmpl.clients+' clients'));
      tCard.appendChild(tBody);
      tCard.onclick = function() { window._wizData.template = tmpl.id; DEMO_RENDERERS.launchpad(container); };
      grid.appendChild(tCard);
    });
    card.appendChild(grid);
  }

  /* ---- STEP 1: Ad Creative ---- */
  else if (step === 1) {
    card.appendChild(_lp_el('h3','font-size:16px;font-weight:700;color:#fff;margin:0 0 6px 0;','Ad Creative'));
    card.appendChild(_lp_el('p','font-size:13px;color:rgba(255,255,255,0.5);margin:0 0 20px 0;','Write your ad copy and preview how it looks on Facebook.'));
    var cols = _lp_el('div','display:grid;grid-template-columns:1fr 1fr;gap:24px;');

    // Left: form
    var left = _lp_el('div');

    // Headline
    var hlLabel = _lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:6px;','Headline');
    left.appendChild(hlLabel);
    var hlWrap = _lp_el('div','position:relative;margin-bottom:16px;');
    var hlInput = _lp_el('input','width:100%;padding:10px 42px 10px 12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;font-size:13px;box-sizing:border-box;outline:none;');
    hlInput.value = d.headline;
    hlInput.maxLength = 40;
    var hlCount = _lp_el('div','position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:11px;color:rgba(255,255,255,0.35);',d.headline.length+'/40');
    hlInput.oninput = function() { window._wizData.headline = this.value; hlCount.textContent = this.value.length+'/40'; _lp_refreshPreview(); };
    hlWrap.appendChild(hlInput); hlWrap.appendChild(hlCount);
    left.appendChild(hlWrap);

    // Primary text
    left.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:6px;','Primary Text'));
    var txWrap = _lp_el('div','position:relative;margin-bottom:16px;');
    var txArea = document.createElement('textarea');
    txArea.style.cssText = 'width:100%;padding:10px 12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;font-size:13px;box-sizing:border-box;resize:vertical;min-height:80px;outline:none;font-family:inherit;';
    txArea.value = d.text;
    txArea.maxLength = 125;
    var txCount = _lp_el('div','font-size:11px;color:rgba(255,255,255,0.35);margin-top:4px;text-align:right;',d.text.length+'/125');
    txArea.oninput = function() { window._wizData.text = this.value; txCount.textContent = this.value.length+'/125'; _lp_refreshPreview(); };
    txWrap.appendChild(txArea);
    left.appendChild(txWrap);
    left.appendChild(txCount);

    // CTA
    left.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:6px;margin-top:4px;','Call to Action'));
    var ctaSel = document.createElement('select');
    ctaSel.style.cssText = 'width:100%;padding:10px 12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;font-size:13px;box-sizing:border-box;outline:none;cursor:pointer;';
    ['Learn More','Sign Up','Book Now','Get Quote','Contact Us'].forEach(function(opt) {
      var o = document.createElement('option');
      o.value = opt; o.textContent = opt;
      if (opt === d.cta) o.selected = true;
      ctaSel.appendChild(o);
    });
    ctaSel.onchange = function() { window._wizData.cta = this.value; _lp_refreshPreview(); };
    left.appendChild(ctaSel);

    cols.appendChild(left);

    // Right: preview
    var right = _lp_el('div');
    right.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:10px;','Live Preview'));
    var previewWrap = _lp_el('div');
    previewWrap.id = 'lpAdPreview';
    previewWrap.appendChild(_lp_fbPreview(d));
    right.appendChild(previewWrap);
    cols.appendChild(right);
    card.appendChild(cols);

    // refresh preview helper
    window._lp_refreshPreview = function() {
      var pw = document.getElementById('lpAdPreview');
      if (pw) { pw.innerHTML = ''; pw.appendChild(_lp_fbPreview(window._wizData)); }
    };
  }

  /* ---- STEP 2: Audience ---- */
  else if (step === 2) {
    card.appendChild(_lp_el('h3','font-size:16px;font-weight:700;color:#fff;margin:0 0 6px 0;','Audience Targeting'));
    card.appendChild(_lp_el('p','font-size:13px;color:rgba(255,255,255,0.5);margin:0 0 20px 0;','Define who should see your ads.'));

    var audienceGrid = _lp_el('div','display:grid;grid-template-columns:1fr 1fr;gap:20px;');
    var leftA = _lp_el('div'), rightA = _lp_el('div');

    // Age range
    leftA.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:8px;','Age Range'));
    var ageRow = _lp_el('div','display:flex;align-items:center;gap:10px;margin-bottom:18px;');
    var ageMin = document.createElement('input');
    ageMin.type='number'; ageMin.value=d.ageMin; ageMin.min=18; ageMin.max=65;
    ageMin.style.cssText='width:64px;padding:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;font-size:13px;text-align:center;outline:none;';
    ageMin.oninput=function(){ window._wizData.ageMin=parseInt(this.value)||25; };
    var ageMax = document.createElement('input');
    ageMax.type='number'; ageMax.value=d.ageMax; ageMax.min=18; ageMax.max=65;
    ageMax.style.cssText='width:64px;padding:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;font-size:13px;text-align:center;outline:none;';
    ageMax.oninput=function(){ window._wizData.ageMax=parseInt(this.value)||45; };
    ageRow.appendChild(ageMin);
    ageRow.appendChild(_lp_el('span','font-size:13px;color:rgba(255,255,255,0.4);','to'));
    ageRow.appendChild(ageMax);
    leftA.appendChild(ageRow);

    // Gender
    leftA.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:8px;','Gender'));
    var genderRow = _lp_el('div','display:flex;gap:8px;margin-bottom:18px;');
    ['All','Male','Female'].forEach(function(g) {
      var active = d.gender === g.toLowerCase() || (g==='All' && d.gender==='all');
      var gb = _lp_el('button',
        'padding:7px 16px;border-radius:20px;border:1px solid;cursor:pointer;font-size:12px;font-weight:600;transition:all .15s;' +
        (active ? 'background:rgba(59,130,246,0.2);border-color:#3b82f6;color:#3b82f6;' : 'background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.12);color:rgba(255,255,255,0.5);'),
        g);
      gb.onclick=function(){ window._wizData.gender=g.toLowerCase()==='all'?'all':g.toLowerCase(); DEMO_RENDERERS.launchpad(container); };
      genderRow.appendChild(gb);
    });
    leftA.appendChild(genderRow);

    // Locations
    leftA.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:8px;','Locations'));
    var locRow = _lp_el('div','display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px;');
    ['Singapore','Malaysia'].forEach(function(loc) {
      var sel = d.locations.indexOf(loc) > -1;
      var lb = _lp_el('div',
        'padding:5px 14px;border-radius:20px;border:1px solid;cursor:pointer;font-size:12px;font-weight:600;transition:all .15s;' +
        (sel ? 'background:rgba(52,211,153,0.15);border-color:#34d399;color:#34d399;' : 'background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.12);color:rgba(255,255,255,0.5);'),
        loc);
      lb.onclick=function(){ var locs=window._wizData.locations; var idx=locs.indexOf(loc); if(idx>-1&&locs.length>1){locs.splice(idx,1);}else if(idx===-1){locs.push(loc);} DEMO_RENDERERS.launchpad(container); };
      locRow.appendChild(lb);
    });
    leftA.appendChild(locRow);
    audienceGrid.appendChild(leftA);

    // Interests
    rightA.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:8px;','Interests'));
    var interestRow = _lp_el('div','display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px;');
    ['Insurance','Financial Planning','Retirement','Investing','Property'].forEach(function(int) {
      var sel = d.interests.indexOf(int) > -1;
      var ib = _lp_el('div',
        'padding:5px 14px;border-radius:20px;border:1px solid;cursor:pointer;font-size:12px;font-weight:600;transition:all .15s;' +
        (sel ? 'background:rgba(59,130,246,0.15);border-color:#3b82f6;color:#3b82f6;' : 'background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.12);color:rgba(255,255,255,0.5);'),
        int);
      ib.onclick=function(){ var ints=window._wizData.interests; var idx=ints.indexOf(int); if(idx>-1&&ints.length>1){ints.splice(idx,1);}else if(idx===-1){ints.push(int);} DEMO_RENDERERS.launchpad(container); };
      interestRow.appendChild(ib);
    });
    rightA.appendChild(interestRow);

    // Advantage+ toggle
    rightA.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:8px;','Advantage+ Audience'));
    var advRow = _lp_el('div','display:flex;align-items:flex-start;gap:12px;padding:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;margin-bottom:18px;');
    var advToggle = _lp_el('div',
      'width:40px;height:22px;border-radius:11px;cursor:pointer;flex-shrink:0;transition:background .2s;position:relative;' +
      (d.advantagePlus ? 'background:#3b82f6;' : 'background:rgba(255,255,255,0.15);'));
    var advKnob = _lp_el('div',
      'position:absolute;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .2s;' +
      (d.advantagePlus ? 'left:21px;' : 'left:3px;'));
    advToggle.appendChild(advKnob);
    advToggle.onclick=function(){ window._wizData.advantagePlus=!window._wizData.advantagePlus; DEMO_RENDERERS.launchpad(container); };
    var advText = _lp_el('div');
    advText.appendChild(_lp_el('div','font-size:13px;font-weight:600;color:#fff;margin-bottom:2px;','Let Meta expand your audience'));
    advText.appendChild(_lp_el('div','font-size:11px;color:rgba(255,255,255,0.4);line-height:1.4;','Meta will broaden targeting beyond your defined audience to find people likely to convert.'));
    advRow.appendChild(advToggle); advRow.appendChild(advText);
    rightA.appendChild(advRow);

    // Estimated reach
    var reach = _lp_el('div','padding:12px 16px;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);border-radius:10px;');
    reach.appendChild(_lp_el('div','font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:4px;','Estimated Reach'));
    reach.appendChild(_lp_el('div','font-size:18px;font-weight:700;color:#34d399;','~85,000 \u2014 245,000 people'));
    rightA.appendChild(reach);

    audienceGrid.appendChild(rightA);
    card.appendChild(audienceGrid);
  }

  /* ---- STEP 3: Budget & Schedule ---- */
  else if (step === 3) {
    card.appendChild(_lp_el('h3','font-size:16px;font-weight:700;color:#fff;margin:0 0 6px 0;','Budget & Schedule'));
    card.appendChild(_lp_el('p','font-size:13px;color:rgba(255,255,255,0.5);margin:0 0 20px 0;','Set your spend limits and campaign duration.'));

    var budgetGrid = _lp_el('div','display:grid;grid-template-columns:1fr 1fr;gap:24px;');
    var leftB = _lp_el('div'), rightB = _lp_el('div');

    // Daily budget
    leftB.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:8px;','Daily Budget (SGD)'));
    var budWrap = _lp_el('div','display:flex;align-items:center;gap:8px;margin-bottom:20px;');
    budWrap.appendChild(_lp_el('span','font-size:18px;font-weight:700;color:#f59e0b;','$'));
    var budInput = document.createElement('input');
    budInput.type='number'; budInput.value=d.budget; budInput.min=5;
    budInput.style.cssText='width:80px;padding:10px 12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#fff;font-size:18px;font-weight:700;text-align:center;outline:none;';
    budInput.oninput=function(){ window._wizData.budget=parseInt(this.value)||30; };
    budWrap.appendChild(budInput);
    leftB.appendChild(budWrap);

    // Duration
    leftB.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:8px;','Duration'));
    var durRow = _lp_el('div','display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;');
    ['7 days','14 days','30 days'].forEach(function(dur) {
      var active = dur === '14 days';
      var db = _lp_el('button',
        'padding:7px 16px;border-radius:20px;border:1px solid;cursor:pointer;font-size:12px;font-weight:600;' +
        (active ? 'background:rgba(59,130,246,0.2);border-color:#3b82f6;color:#3b82f6;' : 'background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.12);color:rgba(255,255,255,0.5);'),
        dur);
      durRow.appendChild(db);
    });
    leftB.appendChild(durRow);

    // Start immediately
    leftB.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:8px;','Start Date'));
    var startRow = _lp_el('div','display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;');
    var startKnob = _lp_el('div','width:36px;height:20px;border-radius:10px;background:#3b82f6;position:relative;cursor:pointer;flex-shrink:0;');
    startKnob.appendChild(_lp_el('div','position:absolute;top:2px;left:18px;width:16px;height:16px;border-radius:50%;background:#fff;'));
    startRow.appendChild(startKnob);
    startRow.appendChild(_lp_el('span','font-size:13px;color:#fff;','Start Immediately'));
    leftB.appendChild(startRow);
    budgetGrid.appendChild(leftB);

    // Bid strategy
    rightB.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:8px;','Bid Strategy'));
    var strategies = ['Lowest Cost','Cost Cap','Bid Cap'];
    var bidWrap = _lp_el('div','display:flex;flex-direction:column;gap:8px;margin-bottom:20px;');
    strategies.forEach(function(s) {
      var active = d.bidStrategy === s;
      var bRow = _lp_el('div',
        'padding:10px 14px;border-radius:8px;border:1px solid;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:10px;' +
        (active ? 'background:rgba(59,130,246,0.12);border-color:#3b82f6;' : 'background:rgba(255,255,255,0.03);border-color:rgba(255,255,255,0.1);'));
      var radio = _lp_el('div',
        'width:16px;height:16px;border-radius:50%;border:2px solid;flex-shrink:0;' +
        (active ? 'border-color:#3b82f6;background:rgba(59,130,246,0.3);' : 'border-color:rgba(255,255,255,0.2);'));
      bRow.appendChild(radio);
      bRow.appendChild(_lp_el('span','font-size:13px;'+(active?'color:#fff;font-weight:600;':'color:rgba(255,255,255,0.6);'),s));
      bRow.onclick=function(){ window._wizData.bidStrategy=s; DEMO_RENDERERS.launchpad(container); };
      bidWrap.appendChild(bRow);
    });
    rightB.appendChild(bidWrap);

    // Estimated results
    rightB.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:8px;','Estimated Results (14 days)'));
    var results = [
      { label: 'Reach', value: '2,500 \u2013 7,200', color: '#3b82f6' },
      { label: 'Link Clicks', value: '84 \u2013 168', color: '#a78bfa' },
      { label: 'Est. CPL', value: '$12 \u2013 $25', color: '#34d399' }
    ];
    var resultsWrap = _lp_el('div','display:flex;flex-direction:column;gap:8px;');
    results.forEach(function(r) {
      var rRow = _lp_el('div','padding:10px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;display:flex;justify-content:space-between;align-items:center;');
      rRow.appendChild(_lp_el('span','font-size:12px;color:rgba(255,255,255,0.5);',r.label));
      rRow.appendChild(_lp_el('span','font-size:14px;font-weight:700;color:'+r.color+';',r.value));
      resultsWrap.appendChild(rRow);
    });
    rightB.appendChild(resultsWrap);
    budgetGrid.appendChild(rightB);
    card.appendChild(budgetGrid);
  }

  /* ---- STEP 4: Review ---- */
  else if (step === 4) {
    card.appendChild(_lp_el('h3','font-size:16px;font-weight:700;color:#fff;margin:0 0 6px 0;','Review & Launch'));
    card.appendChild(_lp_el('p','font-size:13px;color:rgba(255,255,255,0.5);margin:0 0 20px 0;','Confirm your settings before launching.'));

    var reviewGrid = _lp_el('div','display:grid;grid-template-columns:1fr 1fr;gap:24px;');
    var leftR = _lp_el('div'), rightR = _lp_el('div');

    // Summary table
    var summaryItems = [
      { label: 'Template', value: d.template === 'ins' ? 'Insurance Lead Gen' : d.template === 'sem' ? 'Seminar Registration' : 'Brand Story' },
      { label: 'Headline', value: d.headline },
      { label: 'CTA', value: d.cta },
      { label: 'Age', value: d.ageMin + '\u2013' + d.ageMax },
      { label: 'Gender', value: d.gender.charAt(0).toUpperCase() + d.gender.slice(1) },
      { label: 'Locations', value: d.locations.join(', ') },
      { label: 'Interests', value: d.interests.slice(0,3).join(', ') + (d.interests.length > 3 ? ' +' + (d.interests.length-3) : '') },
      { label: 'Daily Budget', value: '$' + d.budget + ' SGD' },
      { label: 'Duration', value: '14 days' },
      { label: 'Bid Strategy', value: d.bidStrategy }
    ];
    var summaryTable = _lp_el('div','display:flex;flex-direction:column;gap:1px;background:rgba(255,255,255,0.06);border-radius:10px;overflow:hidden;margin-bottom:20px;');
    summaryItems.forEach(function(item) {
      var row = _lp_el('div','display:flex;justify-content:space-between;align-items:flex-start;padding:9px 14px;background:rgba(15,23,42,0.8);gap:12px;');
      row.appendChild(_lp_el('span','font-size:12px;color:rgba(255,255,255,0.45);flex-shrink:0;',item.label));
      row.appendChild(_lp_el('span','font-size:12px;color:#fff;font-weight:500;text-align:right;max-width:200px;',item.value));
      summaryTable.appendChild(row);
    });
    leftR.appendChild(summaryTable);
    reviewGrid.appendChild(leftR);

    // Preview
    rightR.appendChild(_lp_el('div','font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:10px;','Ad Preview'));
    rightR.appendChild(_lp_fbPreview(d));
    reviewGrid.appendChild(rightR);
    card.appendChild(reviewGrid);
  }

  wizPanel.appendChild(card);

  /* -- Navigation buttons -- */
  var navRow = _lp_el('div','display:flex;justify-content:space-between;align-items:center;margin-top:20px;');
  var backBtn = _lp_el('button',
    'padding:10px 24px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.7);cursor:pointer;font-size:14px;' +
    (step === 0 ? 'visibility:hidden;' : ''),
    '\u2190 Back');
  backBtn.onclick = function() { if(window._wizStep>0){window._wizStep--;DEMO_RENDERERS.launchpad(container);} };

  var nextLabel = step === 4 ? 'Launch Campaign (Paused)' : 'Next \u2192';
  var nextBtn = _lp_el('button',
    'padding:10px 28px;border-radius:8px;border:none;cursor:pointer;font-size:14px;font-weight:600;transition:all .2s;' +
    (step === 4 ? 'background:#34d399;color:#0a0f1a;' : 'background:#3b82f6;color:#fff;'),
    nextLabel);
  nextBtn.onclick = function() {
    if (step === 0 && !window._wizData.template) { _lp_toast('Please select a template to continue'); return; }
    if (step < 4) { window._wizStep++; DEMO_RENDERERS.launchpad(container); }
    else { _lp_toast('\u2705 Campaign queued for launch (paused for review)'); }
  };
  navRow.appendChild(backBtn);
  navRow.appendChild(nextBtn);
  wizPanel.appendChild(navRow);

  wizSection.appendChild(wizPanel);
  root.appendChild(wizSection);

  /* ============================================================
     SECTION 4 — INTERACTIVE DEMO: LEAD MANAGEMENT
  ============================================================ */
  var leadsSection = _lp_el('div','padding:0 0 48px;');

  var leadsHeader2 = _lp_el('div',
    'margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.08);');
  var leadsLabel = _lp_el('div',
    'font-size:11px;font-weight:700;color:#34d399;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px;',
    'Try It \u2014 Lead Management');
  var leadsSubtext = _lp_el('div',
    'font-size:13px;color:rgba(255,255,255,0.45);',
    'See how leads are tracked with quality scores. Click status badges to update, click names to see details.');
  leadsHeader2.appendChild(leadsLabel);
  leadsHeader2.appendChild(leadsSubtext);
  leadsSection.appendChild(leadsHeader2);

  var leadsPanel = _lp_el('div');

  var leadsData = [
    { name:'Sarah Tan',    email:'sarah.tan@gmail.com',    phone:'+65 9123 4567', campaign:'Insurance Lead Gen', quality:95, status:0, date:'2 Apr' },
    { name:'James Ng',     email:'james.ng@email.com',     phone:'+65 8234 5678', campaign:'Insurance Lead Gen', quality:82, status:1, date:'2 Apr' },
    { name:'Rachel Wong',  email:'rachel.w@email.com',     phone:'+65 9345 6789', campaign:'Seminar Reg',        quality:71, status:2, date:'1 Apr' },
    { name:'David Lim',    email:'david.lim@gmail.com',    phone:'+65 8456 7890', campaign:'Insurance Lead Gen', quality:65, status:3, date:'1 Apr' },
    { name:'Michelle Koh', email:'michelle.k@email.com',   phone:'+65 9567 8901', campaign:'Brand Story',        quality:52, status:1, date:'31 Mar' },
    { name:'Kevin Teo',    email:'kevin.teo@email.com',    phone:'+65 8678 9012', campaign:'Insurance Lead Gen', quality:45, status:0, date:'31 Mar' },
    { name:'Amy Chen',     email:'amy.chen@gmail.com',     phone:'+65 9789 0123', campaign:'Seminar Reg',        quality:35, status:4, date:'30 Mar' },
    { name:'John Doe',     email:'john.doe@email.com',     phone:'+65 8890 1234', campaign:'Brand Story',        quality:20, status:0, date:'30 Mar' }
  ];
  var statusNames = ['New','Contacted','Qualified','Converted','Lost'];
  var statusColors = [
    'background:rgba(59,130,246,0.2);color:#93c5fd;border-color:rgba(59,130,246,0.35);',
    'background:rgba(245,158,11,0.2);color:#fcd34d;border-color:rgba(245,158,11,0.35);',
    'background:rgba(99,102,241,0.2);color:#a5b4fc;border-color:rgba(99,102,241,0.35);',
    'background:rgba(52,211,153,0.2);color:#6ee7b7;border-color:rgba(52,211,153,0.35);',
    'background:rgba(239,68,68,0.2);color:#fca5a5;border-color:rgba(239,68,68,0.35);'
  ];

  // Apply persisted statuses
  leadsData.forEach(function(lead, i) {
    if (window._lpLeadStatuses[i] !== undefined) {
      lead.status = statusNames.indexOf(window._lpLeadStatuses[i]);
      if (lead.status === -1) lead.status = 0;
    }
  });

  // Filter counts
  var filterCounts = { All: leadsData.length };
  statusNames.forEach(function(s) {
    filterCounts[s] = leadsData.filter(function(l){ return statusNames[l.status]===s; }).length;
  });

  // Header
  var leadsHeader = _lp_el('div','display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px;');
  leadsHeader.appendChild(_lp_el('h3','font-size:18px;font-weight:700;color:#fff;margin:0;','142 Leads'));
  var exportBtn = _lp_el('button',
    'padding:8px 18px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.7);cursor:pointer;font-size:13px;font-weight:600;',
    '\u2193 Export CSV');
  exportBtn.onclick=function(){ _lp_toast('Exporting 142 leads as CSV...'); };
  leadsHeader.appendChild(exportBtn);
  leadsPanel.appendChild(leadsHeader);

  // Status filter pills
  var filterPills = _lp_el('div','display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px;');
  var allFilters = ['All'].concat(statusNames);
  allFilters.forEach(function(f) {
    var active = window._lpLeadFilter === f;
    var pill = _lp_el('button',
      'padding:5px 14px;border-radius:20px;border:1px solid;cursor:pointer;font-size:12px;font-weight:600;transition:all .15s;' +
      (active ? 'background:rgba(59,130,246,0.2);border-color:#3b82f6;color:#3b82f6;' : 'background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.12);color:rgba(255,255,255,0.45);'),
      f + ' (' + filterCounts[f] + ')');
    pill.onclick=function(){ window._lpLeadFilter=f; DEMO_RENDERERS.launchpad(container); };
    filterPills.appendChild(pill);
  });
  leadsPanel.appendChild(filterPills);

  // Leads table
  var tableWrap = _lp_el('div','overflow-x:auto;');
  var table = document.createElement('table');
  table.style.cssText = 'width:100%;border-collapse:collapse;font-size:13px;';

  // Table header
  var thead = document.createElement('thead');
  var headerRow = document.createElement('tr');
  ['Name','Email','Phone','Campaign','Quality','Status','Date'].forEach(function(col) {
    var th = document.createElement('th');
    th.style.cssText = 'padding:10px 12px;text-align:left;font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid rgba(255,255,255,0.08);white-space:nowrap;';
    th.textContent = col;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Table body
  var tbody = document.createElement('tbody');
  var filteredLeads = window._lpLeadFilter === 'All' ? leadsData : leadsData.filter(function(l){ return statusNames[l.status] === window._lpLeadFilter; });

  filteredLeads.forEach(function(lead, i) {
    var isExpanded = window._lpExpandedLead === lead.name;
    var tr = document.createElement('tr');
    tr.style.cssText = 'cursor:pointer;transition:background .1s;border-bottom:1px solid rgba(255,255,255,0.06);' +
      (isExpanded ? 'background:rgba(59,130,246,0.08);' : '');
    tr.onmouseenter=function(){ this.style.background='rgba(255,255,255,0.04)'; };
    tr.onmouseleave=function(){ this.style.background = isExpanded ? 'rgba(59,130,246,0.08)' : ''; };

    function td(content, style) {
      var cell = document.createElement('td');
      cell.style.cssText = 'padding:12px 12px;color:#fff;' + (style||'');
      if (typeof content === 'string') cell.textContent = content;
      else cell.appendChild(content);
      return cell;
    }

    // Name cell (clickable)
    var nameTd = td('');
    nameTd.style.cssText += 'font-weight:600;color:#93c5fd;cursor:pointer;';
    nameTd.textContent = lead.name;
    nameTd.onclick=function(e){ e.stopPropagation(); window._lpExpandedLead = isExpanded ? null : lead.name; DEMO_RENDERERS.launchpad(container); };
    tr.appendChild(nameTd);
    tr.appendChild(td(lead.email, 'color:rgba(255,255,255,0.55);font-size:12px;'));
    tr.appendChild(td(lead.phone, 'color:rgba(255,255,255,0.55);font-size:12px;'));
    tr.appendChild(td(lead.campaign, 'color:rgba(255,255,255,0.7);font-size:12px;max-width:130px;'));

    // Quality stars
    var qualTd = document.createElement('td');
    qualTd.style.cssText = 'padding:12px 12px;';
    var starCount = Math.round(lead.quality / 100 * 5);
    var starColor = lead.quality >= 70 ? '#34d399' : lead.quality >= 50 ? '#f59e0b' : 'rgba(255,255,255,0.3)';
    var starsWrap = _lp_el('div','display:flex;align-items:center;gap:3px;');
    for (var s = 0; s < 5; s++) {
      starsWrap.appendChild(_lp_el('span','font-size:13px;color:' + (s < starCount ? starColor : 'rgba(255,255,255,0.15);') + ';', '\u2605'));
    }
    var qPct = _lp_el('span','font-size:11px;color:'+starColor+';margin-left:4px;', lead.quality+'%');
    starsWrap.appendChild(qPct);
    qualTd.appendChild(starsWrap);
    tr.appendChild(qualTd);

    // Status badge (clickable to cycle)
    var statusTd = document.createElement('td');
    statusTd.style.cssText = 'padding:12px 12px;';
    var leadIdx = leadsData.indexOf(lead);
    var badge = _lp_el('button',
      'padding:3px 10px;border-radius:20px;border:1px solid;cursor:pointer;font-size:11px;font-weight:700;transition:all .15s;' + statusColors[lead.status],
      statusNames[lead.status]);
    badge.onclick=function(e){
      e.stopPropagation();
      var next = (lead.status + 1) % statusNames.length;
      window._lpLeadStatuses[leadIdx] = statusNames[next];
      DEMO_RENDERERS.launchpad(container);
    };
    statusTd.appendChild(badge);
    tr.appendChild(statusTd);
    tr.appendChild(td(lead.date, 'color:rgba(255,255,255,0.45);font-size:12px;'));
    tbody.appendChild(tr);

    // Expanded detail row
    if (isExpanded) {
      var detailTr = document.createElement('tr');
      detailTr.style.cssText = 'background:rgba(59,130,246,0.05);border-bottom:1px solid rgba(255,255,255,0.06);';
      var detailTd = document.createElement('td');
      detailTd.colSpan = 7;
      detailTd.style.cssText = 'padding:20px 16px;';

      var detailPanel = _lp_el('div','display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;');

      // Info section
      var info = _lp_el('div');
      info.appendChild(_lp_el('div','font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;','Lead Details'));
      var infoItems = [
        { label: 'Name', value: lead.name },
        { label: 'Email', value: lead.email },
        { label: 'Phone', value: lead.phone },
        { label: 'Quality Score', value: lead.quality + '%' },
        { label: 'Campaign', value: lead.campaign }
      ];
      infoItems.forEach(function(item) {
        var r = _lp_el('div','margin-bottom:8px;');
        r.appendChild(_lp_el('div','font-size:11px;color:rgba(255,255,255,0.4);',item.label));
        r.appendChild(_lp_el('div','font-size:13px;color:#fff;font-weight:500;',item.value));
        info.appendChild(r);
      });
      detailPanel.appendChild(info);

      // Timeline
      var timeline = _lp_el('div');
      timeline.appendChild(_lp_el('div','font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;','Activity Timeline'));
      var events = [
        { time: lead.date + ', 9:14am', label: 'Lead submitted form' },
        { time: lead.date + ', 11:30am', label: 'Auto email sent' },
        { time: 'Pending', label: 'Advisor follow-up call' }
      ];
      events.forEach(function(ev) {
        var eRow = _lp_el('div','display:flex;gap:10px;margin-bottom:10px;align-items:flex-start;');
        var dot = _lp_el('div','width:8px;height:8px;border-radius:50%;background:#3b82f6;flex-shrink:0;margin-top:4px;');
        var evInfo = _lp_el('div');
        evInfo.appendChild(_lp_el('div','font-size:11px;color:rgba(255,255,255,0.35);',ev.time));
        evInfo.appendChild(_lp_el('div','font-size:13px;color:rgba(255,255,255,0.8);',ev.label));
        eRow.appendChild(dot); eRow.appendChild(evInfo);
        timeline.appendChild(eRow);
      });
      detailPanel.appendChild(timeline);

      // Notes
      var notes = _lp_el('div');
      notes.appendChild(_lp_el('div','font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;','Notes'));
      var notesArea = document.createElement('textarea');
      notesArea.style.cssText = 'width:100%;min-height:100px;padding:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#fff;font-size:12px;resize:vertical;outline:none;font-family:inherit;box-sizing:border-box;';
      notesArea.placeholder = 'Add notes about this lead...';
      notes.appendChild(notesArea);
      var saveNoteBtn = _lp_el('button','margin-top:8px;padding:6px 16px;background:#3b82f6;border:none;border-radius:6px;color:#fff;font-size:12px;font-weight:600;cursor:pointer;','Save Note');
      saveNoteBtn.onclick=function(){ _lp_toast('Note saved for '+lead.name); };
      notes.appendChild(saveNoteBtn);
      detailPanel.appendChild(notes);

      detailTd.appendChild(detailPanel);
      detailTr.appendChild(detailTd);
      tbody.appendChild(detailTr);
    }
  });

  table.appendChild(tbody);
  tableWrap.appendChild(table);
  leadsPanel.appendChild(tableWrap);

  // Footer summary
  var footer = _lp_el('div',
    'margin-top:16px;padding:12px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;font-size:12px;color:rgba(255,255,255,0.4);display:flex;gap:20px;flex-wrap:wrap;');
  footer.appendChild(_lp_el('span','','Estimated pipeline value: $42,600'));
  footer.appendChild(_lp_el('span','color:rgba(255,255,255,0.2);','·'));
  footer.appendChild(_lp_el('span','','Avg quality: 58%'));
  footer.appendChild(_lp_el('span','color:rgba(255,255,255,0.2);','·'));
  footer.appendChild(_lp_el('span','','Conversion rate: 13.4%'));
  leadsPanel.appendChild(footer);

  leadsSection.appendChild(leadsPanel);
  root.appendChild(leadsSection);

  /* ============================================================
     SECTION 5 — INTEGRATION HIGHLIGHTS
  ============================================================ */
  var intSection = _lp_el('div','padding:0 0 32px;');

  var intTitle = _lp_el('div',
    'font-size:11px;font-weight:700;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:.1em;text-align:center;margin-bottom:20px;',
    'Platform Highlights');
  intSection.appendChild(intTitle);

  var intGrid = _lp_el('div','display:grid;grid-template-columns:repeat(3,1fr);gap:14px;');
  var intCards = [
    {
      icon: '\uD83D\uDD17',
      title: 'Meta API Connected',
      desc: 'Direct integration with Facebook & Instagram. No third-party middlemen.'
    },
    {
      icon: '\u23F8\uFE0F',
      title: 'All Campaigns Paused',
      desc: 'Every campaign launches paused so you can review before spending.'
    },
    {
      icon: '\u26A1',
      title: 'Auto Lead Sync',
      desc: 'Leads sync automatically from Meta to your dashboard. No manual export.'
    }
  ];
  intCards.forEach(function(item) {
    var c = _lp_el('div',
      'background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:18px 16px;');
    c.appendChild(_lp_el('div','font-size:22px;margin-bottom:10px;', item.icon));
    c.appendChild(_lp_el('div','font-size:13px;font-weight:700;color:#fff;margin-bottom:6px;', item.title));
    c.appendChild(_lp_el('div','font-size:12px;color:rgba(255,255,255,0.45);line-height:1.5;', item.desc));
    intGrid.appendChild(c);
  });
  intSection.appendChild(intGrid);
  root.appendChild(intSection);

  container.appendChild(root);
};


/* ============================================================
   FINANCE HUB DEMO
   ============================================================ */

DEMO_RENDERERS.financehub = function(container) {
  container.innerHTML = '';
  container.id = 'fhDemo';

  // ============================================================
  // SECTION 1: HERO
  // ============================================================
  var hero = document.createElement('div');
  hero.style.cssText = 'text-align:center;padding:48px 24px 40px;';

  var heroBadge = document.createElement('div');
  heroBadge.textContent = 'Comprehensive Financial Planner';
  heroBadge.style.cssText = 'display:inline-block;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:5px 14px;border-radius:20px;background:rgba(196,162,77,0.15);color:#C4A24D;border:1px solid rgba(196,162,77,0.35);margin-bottom:20px;';
  hero.appendChild(heroBadge);

  var heroHeadline = document.createElement('h2');
  heroHeadline.textContent = 'See Your Client\u2019s Entire Financial Future \u2014 On One Screen';
  heroHeadline.style.cssText = 'font-size:clamp(22px,4vw,34px);font-weight:800;color:#e2e8f0;line-height:1.2;margin:0 0 16px;';
  hero.appendChild(heroHeadline);

  var heroSubline = document.createElement('p');
  heroSubline.textContent = 'Income, expenses, CPF, insurance, goals, investments \u2014 all flowing into one projection chart that shows clients exactly where they\u2019ll be at retirement.';
  heroSubline.style.cssText = 'font-size:15px;color:rgba(255,255,255,0.5);line-height:1.6;max-width:600px;margin:0 auto 28px;';
  hero.appendChild(heroSubline);

  var heroStats = document.createElement('div');
  heroStats.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;';
  ['12 Planning Modules', 'CPF Integration', 'Goal Wizards', 'PDF Reports'].forEach(function(stat, i) {
    if (i > 0) {
      var dotSep = document.createElement('span');
      dotSep.textContent = '\u00b7';
      dotSep.style.cssText = 'color:rgba(255,255,255,0.2);font-size:14px;';
      heroStats.appendChild(dotSep);
    }
    var s = document.createElement('span');
    s.textContent = stat;
    s.style.cssText = 'font-size:13px;font-weight:600;color:rgba(255,255,255,0.55);';
    heroStats.appendChild(s);
  });
  hero.appendChild(heroStats);
  container.appendChild(hero);

  // ============================================================
  // SECTION 2: WHAT YOU CAN PLAN (2x3 feature cards)
  // ============================================================
  var featSection = document.createElement('div');
  featSection.style.cssText = 'padding:0 0 40px;';

  var featHeading = document.createElement('div');
  featHeading.textContent = 'What You Can Plan';
  featHeading.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.08em;text-align:center;margin-bottom:20px;';
  featSection.appendChild(featHeading);

  var featGrid = document.createElement('div');
  featGrid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:12px;';

  var featureCards = [
    { icon: '\uD83D\uDCB0', title: 'Income & Cash Flow',       desc: 'Track salary, freelance, passive income vs expenses with visual breakdowns' },
    { icon: '\uD83C\uDFAF', title: 'Life Goals',               desc: 'Property, vehicle, wedding, children, retirement \u2014 each with funding plans' },
    { icon: '\uD83D\uDEE1\uFE0F', title: 'Insurance Coverage', desc: 'Gap analysis across death, TPD, critical illness, hospital & disability' },
    { icon: '\uD83D\uDCCA', title: 'CPF Projections',          desc: 'OA/SA/MA growth to age 65 with CPF LIFE payout estimation' },
    { icon: '\uD83D\uDCC8', title: 'Investment Tracking',      desc: 'RSP, lump sum, ILP, ETF, bonds \u2014 all projected with fee impact' },
    { icon: '\uD83D\uDD2E', title: 'What-If Scenarios',        desc: 'Model death, disability, critical illness, career changes on finances' },
  ];

  featureCards.forEach(function(fc) {
    var fCard = document.createElement('div');
    fCard.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:18px 16px;transition:border-color 0.2s;cursor:default;';
    fCard.addEventListener('mouseenter', function() { fCard.style.borderColor = 'rgba(196,162,77,0.35)'; });
    fCard.addEventListener('mouseleave', function() { fCard.style.borderColor = 'rgba(255,255,255,0.08)'; });
    var fcIcon = document.createElement('div');
    fcIcon.textContent = fc.icon;
    fcIcon.style.cssText = 'font-size:22px;margin-bottom:10px;';
    fCard.appendChild(fcIcon);
    var fcTitle = document.createElement('div');
    fcTitle.textContent = fc.title;
    fcTitle.style.cssText = 'font-size:13px;font-weight:700;color:#e2e8f0;margin-bottom:6px;';
    fCard.appendChild(fcTitle);
    var fcDesc = document.createElement('div');
    fcDesc.textContent = fc.desc;
    fcDesc.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.4);line-height:1.5;';
    fCard.appendChild(fcDesc);
    featGrid.appendChild(fCard);
  });
  featSection.appendChild(featGrid);
  container.appendChild(featSection);

  // ============================================================
  // SECTION 3 HEADER: Interactive Demo — Financial Planner
  // ============================================================
  var demoHdr1 = document.createElement('div');
  demoHdr1.style.cssText = 'border-top:1px solid rgba(255,255,255,0.08);padding:32px 0 20px;';

  var demoLbl1 = document.createElement('div');
  demoLbl1.textContent = 'TRY IT \u2014 CLIENT FINANCIAL PLANNER';
  demoLbl1.style.cssText = 'font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#C4A24D;margin-bottom:8px;';
  demoHdr1.appendChild(demoLbl1);

  var demoTtl1 = document.createElement('div');
  demoTtl1.textContent = 'Client Financial Planner';
  demoTtl1.style.cssText = 'font-size:20px;font-weight:700;color:#e2e8f0;margin-bottom:6px;';
  demoHdr1.appendChild(demoTtl1);

  var demoSub1 = document.createElement('div');
  demoSub1.textContent = 'Explore Marcus Tan\u2019s complete financial picture. See how income, expenses, goals, and insurance all connect.';
  demoSub1.style.cssText = 'font-size:13px;color:rgba(255,255,255,0.4);line-height:1.5;';
  demoHdr1.appendChild(demoSub1);
  container.appendChild(demoHdr1);

  // ---- Toast helper (shared) ----
  var fhToastEl = document.getElementById('fhToast');
  if (!fhToastEl) {
    fhToastEl = document.createElement('div');
    fhToastEl.id = 'fhToast';
    fhToastEl.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:#1e293b;border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:10px 20px;font-size:13px;color:#e2e8f0;opacity:0;transition:opacity 0.3s;z-index:999;pointer-events:none;white-space:nowrap;';
    document.body.appendChild(fhToastEl);
  }

  function fhToast(msg) {
    fhToastEl.textContent = msg;
    fhToastEl.style.opacity = '1';
    setTimeout(function() { fhToastEl.style.opacity = '0'; }, 3000);
  }

  // ---- Shared helper: stat summary card ----
  function fhSummaryCard(label, value, color, iconSvg) {
    var card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;gap:8px;';
    var topRow = document.createElement('div');
    topRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;';
    var lbl = document.createElement('div');
    lbl.textContent = label;
    lbl.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.05em;';
    var iconWrap = document.createElement('div');
    iconWrap.style.cssText = 'width:28px;height:28px;border-radius:8px;background:' + color + '20;display:flex;align-items:center;justify-content:center;';
    iconWrap.innerHTML = iconSvg;
    topRow.appendChild(lbl);
    topRow.appendChild(iconWrap);
    var val = document.createElement('div');
    val.textContent = value;
    val.style.cssText = 'font-size:22px;font-weight:700;color:' + color + ';';
    card.appendChild(topRow);
    card.appendChild(val);
    return card;
  }

  // ---- Helper: donut chart with legend below ----
  function fhDonutSection(title, canvasId, centerText, items) {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px;';
    var ttl = document.createElement('div');
    ttl.textContent = title;
    ttl.style.cssText = 'font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);margin-bottom:10px;text-align:center;';
    wrap.appendChild(ttl);
    var cnvWrap = document.createElement('div');
    cnvWrap.style.cssText = 'display:flex;justify-content:center;margin-bottom:10px;';
    var cnv = document.createElement('canvas');
    cnv.id = canvasId;
    cnvWrap.appendChild(cnv);
    wrap.appendChild(cnvWrap);
    // Legend
    var legendEl = document.createElement('div');
    legendEl.style.cssText = 'display:flex;flex-direction:column;gap:5px;';
    items.forEach(function(item) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;font-size:11px;';
      var left = document.createElement('div');
      left.style.cssText = 'display:flex;align-items:center;gap:6px;';
      var dot = document.createElement('div');
      dot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:' + item.color + ';flex-shrink:0;';
      var nm = document.createElement('span');
      nm.textContent = item.label;
      nm.style.cssText = 'color:rgba(255,255,255,0.55);';
      left.appendChild(dot);
      left.appendChild(nm);
      var amt = document.createElement('span');
      amt.textContent = item.displayValue;
      amt.style.cssText = 'color:#e2e8f0;font-weight:600;';
      row.appendChild(left);
      row.appendChild(amt);
      legendEl.appendChild(row);
    });
    wrap.appendChild(legendEl);
    return { wrap: wrap, canvasId: canvasId, centerText: centerText, items: items };
  }

  // ============================================================
  // PANEL 1: FINANCIAL PLANNER
  // ============================================================
  var plannerPanel = document.createElement('div');
  plannerPanel.dataset.panel = 'planner';
  plannerPanel.style.cssText = 'padding:20px 0;';

  // ---- Client Profile Header ----
  var profileHeader = document.createElement('div');
  profileHeader.style.cssText = 'display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px 18px;margin-bottom:20px;';

  var avatarCircle = document.createElement('div');
  avatarCircle.style.cssText = 'width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#6b9bdb,#4a7bc8);display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:700;color:#fff;flex-shrink:0;';
  avatarCircle.textContent = 'MT';

  var profileInfo = document.createElement('div');
  profileInfo.style.cssText = 'flex:1;';
  var profileName = document.createElement('div');
  profileName.textContent = 'Marcus Tan Wei Ming';
  profileName.style.cssText = 'font-size:15px;font-weight:700;color:#e2e8f0;';
  var profileSub = document.createElement('div');
  profileSub.textContent = 'Age 25 \u00b7 Software Engineer';
  profileSub.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.4);margin-top:2px;';
  profileInfo.appendChild(profileName);
  profileInfo.appendChild(profileSub);

  var riskBadge = document.createElement('div');
  riskBadge.textContent = 'Moderate Risk';
  riskBadge.style.cssText = 'font-size:11px;font-weight:600;padding:4px 12px;border-radius:20px;background:#C4A24D22;color:#C4A24D;border:1px solid #C4A24D44;flex-shrink:0;';

  profileHeader.appendChild(avatarCircle);
  profileHeader.appendChild(profileInfo);
  profileHeader.appendChild(riskBadge);
  plannerPanel.appendChild(profileHeader);

  // ---- Summary Cards (4-column) ----
  var summaryGrid = document.createElement('div');
  summaryGrid.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;';

  var svgPiggy = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="' + '#34d399' + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 11c0-5.5-9-5.5-9 0"/><path d="M3 11v2c0 3.3 2.7 6 6 6h6.5a4.5 4.5 0 0 0 0-9H9"/><path d="M11 21v-2"/><path d="M15 21v-2"/><circle cx="20" cy="11" r="1"/></svg>';
  var svgCard = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>';
  var svgWallet = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b9bdb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/><path d="M16 12h5v4h-5a2 2 0 0 1 0-4z"/></svg>';
  var svgTrend = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>';

  summaryGrid.appendChild(fhSummaryCard('Total Assets',       '$892,400', '#34d399', svgPiggy));
  summaryGrid.appendChild(fhSummaryCard('Total Liabilities',  '$423,600', '#ef4444', svgCard));
  summaryGrid.appendChild(fhSummaryCard('Net Worth',          '$468,800', '#6b9bdb', svgWallet));
  summaryGrid.appendChild(fhSummaryCard('Monthly Cash Flow',  '+$5,500',  '#34d399', svgTrend));
  plannerPanel.appendChild(summaryGrid);

  // ---- Donut Chart Grid (2x2) ----
  var sectionTitle = document.createElement('div');
  sectionTitle.textContent = 'Financial Breakdown';
  sectionTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;';
  plannerPanel.appendChild(sectionTitle);

  var donutGrid = document.createElement('div');
  donutGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px;';

  var donutIncome = fhDonutSection('Income', 'fhDonutIncome', '$9,700/mo', [
    { label: 'Salary',       displayValue: '$8,000',  color: '#3b82f6', value: 8000  },
    { label: 'Freelance',    displayValue: '$1,200',  color: '#10b981', value: 1200  },
    { label: 'Investments',  displayValue: '$500',    color: '#f59e0b', value: 500   },
  ]);
  var donutExpenses = fhDonutSection('Expenses', 'fhDonutExpenses', '$4,200/mo', [
    { label: 'Housing',    displayValue: '$1,800', color: '#ef4444', value: 1800 },
    { label: 'Food',       displayValue: '$800',   color: '#f59e0b', value: 800  },
    { label: 'Transport',  displayValue: '$600',   color: '#8b5cf6', value: 600  },
    { label: 'Insurance',  displayValue: '$450',   color: '#3b82f6', value: 450  },
    { label: 'Others',     displayValue: '$550',   color: '#64748b', value: 550  },
  ]);
  var donutAssets = fhDonutSection('Assets', 'fhDonutAssets', '$892k', [
    { label: 'Property',       displayValue: '$420k', color: '#3b82f6', value: 420000 },
    { label: 'CPF',            displayValue: '$186k', color: '#10b981', value: 186000 },
    { label: 'Investments',    displayValue: '$152k', color: '#f59e0b', value: 152400 },
    { label: 'Cash',           displayValue: '$84k',  color: '#8b5cf6', value: 84000  },
    { label: 'Insurance CSV',  displayValue: '$50k',  color: '#64748b', value: 50000  },
  ]);
  var donutLiab = fhDonutSection('Liabilities', 'fhDonutLiab', '$424k', [
    { label: 'HDB Loan',     displayValue: '$380k', color: '#ef4444', value: 380000 },
    { label: 'Car Loan',     displayValue: '$35.6k',color: '#f59e0b', value: 35600  },
    { label: 'Credit Card',  displayValue: '$8k',   color: '#64748b', value: 8000   },
  ]);

  donutGrid.appendChild(donutIncome.wrap);
  donutGrid.appendChild(donutExpenses.wrap);
  donutGrid.appendChild(donutAssets.wrap);
  donutGrid.appendChild(donutLiab.wrap);
  plannerPanel.appendChild(donutGrid);

  // ---- Life Goals Timeline ----
  var goalsTitle = document.createElement('div');
  goalsTitle.textContent = 'Life Goals Timeline';
  goalsTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;';
  plannerPanel.appendChild(goalsTitle);

  var goalsData = [
    { icon: '\uD83D\uDE97', label: 'Buy Car',     age: 28, cost: '$80k',   funded: 35,  color: '#f59e0b' },
    { icon: '\uD83C\uDFE0', label: 'Buy HDB',     age: 30, cost: '$600k',  funded: 12,  color: '#3b82f6' },
    { icon: '\uD83D\uDC8D', label: 'Wedding',     age: 32, cost: '$50k',   funded: 0,   color: '#8b5cf6' },
    { icon: '\uD83D\uDC76', label: 'First Child', age: 33, cost: '$15k/yr',funded: 0,   color: '#10b981' },
    { icon: '\uD83C\uDFD6\uFE0F', label: 'Retirement', age: 62, cost: '$1.2M', funded: 8, color: '#C4A24D' },
  ];

  var goalsTimeline = document.createElement('div');
  goalsTimeline.style.cssText = 'display:flex;flex-direction:column;gap:8px;';

  goalsData.forEach(function(goal) {
    var card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:14px;';

    var iconEl = document.createElement('div');
    iconEl.textContent = goal.icon;
    iconEl.style.cssText = 'font-size:20px;flex-shrink:0;';

    var infoEl = document.createElement('div');
    infoEl.style.cssText = 'flex:1;min-width:0;';

    var labelRow = document.createElement('div');
    labelRow.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:5px;';
    var labelTxt = document.createElement('span');
    labelTxt.textContent = goal.label;
    labelTxt.style.cssText = 'font-size:13px;font-weight:600;color:#e2e8f0;';
    var ageBadge = document.createElement('span');
    ageBadge.textContent = 'Age ' + goal.age;
    ageBadge.style.cssText = 'font-size:10px;font-weight:600;padding:2px 7px;border-radius:10px;background:' + goal.color + '20;color:' + goal.color + ';border:1px solid ' + goal.color + '40;';
    labelRow.appendChild(labelTxt);
    labelRow.appendChild(ageBadge);

    var barTrack = document.createElement('div');
    barTrack.style.cssText = 'background:rgba(255,255,255,0.07);border-radius:4px;height:5px;overflow:hidden;';
    var barFill = document.createElement('div');
    barFill.style.cssText = 'height:100%;border-radius:4px;background:' + goal.color + ';width:' + goal.funded + '%;';
    barTrack.appendChild(barFill);

    var pctLbl = document.createElement('div');
    pctLbl.textContent = goal.funded + '% funded';
    pctLbl.style.cssText = 'font-size:10px;color:rgba(255,255,255,0.3);margin-top:3px;';

    infoEl.appendChild(labelRow);
    infoEl.appendChild(barTrack);
    infoEl.appendChild(pctLbl);

    var costEl = document.createElement('div');
    costEl.textContent = goal.cost;
    costEl.style.cssText = 'font-size:13px;font-weight:700;color:' + goal.color + ';flex-shrink:0;';

    card.appendChild(iconEl);
    card.appendChild(infoEl);
    card.appendChild(costEl);
    goalsTimeline.appendChild(card);
  });

  plannerPanel.appendChild(goalsTimeline);

  // ============================================================
  // PANEL 2: WEALTH PROJECTION
  // ============================================================
  var projPanel = document.createElement('div');
  projPanel.dataset.panel = 'projection';
  projPanel.style.cssText = 'padding:20px 0;';

  // ---- Assumptions Bar ----
  var assumBar = document.createElement('div');
  assumBar.style.cssText = 'display:flex;gap:16px;flex-wrap:wrap;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px 18px;margin-bottom:20px;align-items:center;';
  var assumLabel = document.createElement('div');
  assumLabel.textContent = 'Assumptions:';
  assumLabel.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.05em;flex-shrink:0;';
  assumBar.appendChild(assumLabel);
  [
    { label: 'Inflation', value: '3%' },
    { label: 'Returns', value: '6%' },
    { label: 'Salary Growth', value: '3%' },
    { label: 'Life Expectancy', value: '90' },
  ].forEach(function(a) {
    var chip = document.createElement('div');
    chip.style.cssText = 'display:flex;align-items:center;gap:5px;font-size:12px;';
    var lbl = document.createElement('span');
    lbl.textContent = a.label + ':';
    lbl.style.cssText = 'color:rgba(255,255,255,0.4);';
    var val = document.createElement('span');
    val.textContent = a.value;
    val.style.cssText = 'font-weight:700;color:#e2e8f0;';
    chip.appendChild(lbl);
    chip.appendChild(val);
    assumBar.appendChild(chip);
  });
  projPanel.appendChild(assumBar);

  // ---- Projection Area Chart ----
  var projChartTitle = document.createElement('div');
  projChartTitle.textContent = 'Net Worth Projection \u2014 Age 25 to 65';
  projChartTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;';
  projPanel.appendChild(projChartTitle);

  var projChartWrap = document.createElement('div');
  projChartWrap.style.cssText = 'margin-bottom:16px;';
  var projCanvas = document.createElement('canvas');
  projCanvas.id = 'fhProjArea';
  projChartWrap.appendChild(projCanvas);
  projPanel.appendChild(projChartWrap);

  // ---- Goal Marker Chips ----
  var markersRow = document.createElement('div');
  markersRow.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;';
  [
    { icon: '\uD83D\uDE97', label: 'Car',      age: 28, color: '#f59e0b' },
    { icon: '\uD83C\uDFE0', label: 'HDB',      age: 30, color: '#3b82f6' },
    { icon: '\uD83D\uDC8D', label: 'Wedding',  age: 32, color: '#8b5cf6' },
    { icon: '\uD83D\uDC76', label: 'Child',    age: 33, color: '#10b981' },
    { icon: '\uD83C\uDFD6\uFE0F', label: 'Retire', age: 62, color: '#C4A24D' },
  ].forEach(function(m) {
    var chip = document.createElement('div');
    chip.style.cssText = 'display:inline-flex;align-items:center;gap:5px;font-size:12px;padding:5px 12px;border-radius:20px;background:' + m.color + '15;border:1px solid ' + m.color + '35;color:' + m.color + ';cursor:pointer;transition:all 0.15s;';
    chip.textContent = m.icon + ' ' + m.label + ' (' + m.age + ')';
    chip.addEventListener('click', function() {
      fhToast(m.icon + ' ' + m.label + ' milestone at Age ' + m.age);
    });
    markersRow.appendChild(chip);
  });
  projPanel.appendChild(markersRow);

  // ---- Key Insight Cards ----
  var insightsTitle = document.createElement('div');
  insightsTitle.textContent = 'Key Insights';
  insightsTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;';
  projPanel.appendChild(insightsTitle);

  var insightsGrid = document.createElement('div');
  insightsGrid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;';

  function fhInsightCard(headline, detail, badge, badgeColor) {
    var card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px;';
    var topRow = document.createElement('div');
    topRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;';
    var bdg = document.createElement('div');
    bdg.textContent = badge;
    bdg.style.cssText = 'font-size:10px;font-weight:700;padding:3px 8px;border-radius:10px;background:' + badgeColor + '25;color:' + badgeColor + ';border:1px solid ' + badgeColor + '45;';
    topRow.appendChild(bdg);
    var h2 = document.createElement('div');
    h2.textContent = headline;
    h2.style.cssText = 'font-size:14px;font-weight:700;color:#e2e8f0;margin-bottom:5px;';
    var det = document.createElement('div');
    det.textContent = detail;
    det.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.45);line-height:1.4;';
    card.appendChild(topRow);
    card.appendChild(h2);
    card.appendChild(det);
    return card;
  }

  insightsGrid.appendChild(fhInsightCard('Retirement Ready by Age 60', 'On track to exceed $2.8M target', 'On Track', '#34d399'));
  insightsGrid.appendChild(fhInsightCard('Property Paid Off by Age 55', 'HDB mortgage fully cleared in 25 years', 'Milestone', '#3b82f6'));
  insightsGrid.appendChild(fhInsightCard('CPF Life at 65', 'Estimated $1,800–$2,500/month payout', 'CPF LIFE', '#C4A24D'));
  projPanel.appendChild(insightsGrid);

  // ---- CPF Breakdown ----
  var cpfTitle = document.createElement('div');
  cpfTitle.textContent = 'CPF Breakdown';
  cpfTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;';
  projPanel.appendChild(cpfTitle);

  var cpfAccountsRow = document.createElement('div');
  cpfAccountsRow.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;';
  [
    { label: 'Ordinary Account (OA)', value: '$35k',  rate: '2.5% p.a.', color: '#3b82f6' },
    { label: 'Special Account (SA)',  value: '$12k',  rate: '4.0% p.a.', color: '#C4A24D' },
    { label: 'MediSave (MA)',         value: '$8k',   rate: '4.0% p.a.', color: '#10b981' },
  ].forEach(function(acc) {
    var card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-top:3px solid ' + acc.color + ';border-radius:12px;padding:14px 16px;';
    var lbl = document.createElement('div');
    lbl.textContent = acc.label;
    lbl.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:6px;';
    var val = document.createElement('div');
    val.textContent = acc.value;
    val.style.cssText = 'font-size:20px;font-weight:700;color:' + acc.color + ';margin-bottom:4px;';
    var rate = document.createElement('div');
    rate.textContent = acc.rate;
    rate.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.3);';
    card.appendChild(lbl);
    card.appendChild(val);
    card.appendChild(rate);
    cpfAccountsRow.appendChild(card);
  });
  projPanel.appendChild(cpfAccountsRow);

  // CPF projection mini-chart
  var cpfChartTitle = document.createElement('div');
  cpfChartTitle.textContent = 'CPF Growth Projection (Age 25\u201365)';
  cpfChartTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;';
  projPanel.appendChild(cpfChartTitle);

  var cpfChartWrap = document.createElement('div');
  var cpfBarCanvas = document.createElement('canvas');
  cpfBarCanvas.id = 'fhCPFBar';
  cpfChartWrap.appendChild(cpfBarCanvas);
  projPanel.appendChild(cpfChartWrap);

  // CPF LIFE thresholds
  var cpfLifeTitle = document.createElement('div');
  cpfLifeTitle.textContent = 'CPF LIFE Retirement Sums (2026)';
  cpfLifeTitle.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-top:16px;margin-bottom:10px;';
  projPanel.appendChild(cpfLifeTitle);

  var cpfLifeRow = document.createElement('div');
  cpfLifeRow.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin-bottom:16px;';
  var cpfSums = [
    { label: 'BRS — Basic Retirement Sum',    value: '$106,500', payout: '$750\u2013$900/mo',     color: '#10b981', projected: false },
    { label: 'FRS — Full Retirement Sum',     value: '$213,000', payout: '$1,500\u2013$1,800/mo', color: '#3b82f6', projected: true  },
    { label: 'ERS — Enhanced Retirement Sum', value: '$426,000', payout: '$2,300\u2013$2,800/mo', color: '#C4A24D', projected: false },
  ];
  cpfSums.forEach(function(s) {
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;' +
      (s.projected ? 'border-color:' + s.color + '40;background:' + s.color + '0d;' : '');
    var left = document.createElement('div');
    var lbl = document.createElement('div');
    lbl.textContent = s.label;
    lbl.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.55);margin-bottom:3px;';
    var val = document.createElement('div');
    val.textContent = s.value;
    val.style.cssText = 'font-size:14px;font-weight:700;color:' + s.color + ';';
    left.appendChild(lbl);
    left.appendChild(val);
    var right = document.createElement('div');
    right.style.cssText = 'text-align:right;';
    var payout = document.createElement('div');
    payout.textContent = s.payout;
    payout.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.5);';
    if (s.projected) {
      var projBadge = document.createElement('div');
      projBadge.textContent = 'Projected';
      projBadge.style.cssText = 'font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;background:' + s.color + '25;color:' + s.color + ';border:1px solid ' + s.color + '45;margin-bottom:4px;display:inline-block;';
      right.appendChild(projBadge);
    }
    right.appendChild(payout);
    row.appendChild(left);
    row.appendChild(right);
    cpfLifeRow.appendChild(row);
  });
  projPanel.appendChild(cpfLifeRow);

  // Export button
  var exportBtn = document.createElement('button');
  exportBtn.textContent = 'Export Full Report';
  exportBtn.style.cssText = 'font-size:13px;font-weight:600;padding:10px 22px;border-radius:10px;background:rgba(196,162,77,0.15);color:#C4A24D;border:1px solid rgba(196,162,77,0.35);cursor:pointer;';
  exportBtn.addEventListener('mouseenter', function() { exportBtn.style.background = 'rgba(196,162,77,0.25)'; });
  exportBtn.addEventListener('mouseleave', function() { exportBtn.style.background = 'rgba(196,162,77,0.15)'; });
  exportBtn.addEventListener('click', function() {
    fhToast('\u2713 Exported \u2014 Marcus_Tan_WealthProjection_Apr2026.pdf');
  });
  projPanel.appendChild(exportBtn);

  // ---- Append panels ----
  container.appendChild(plannerPanel);

  // ============================================================
  // SECTION 4 HEADER: Interactive Demo — Wealth Projection
  // ============================================================
  var demoHdr2 = document.createElement('div');
  demoHdr2.style.cssText = 'border-top:1px solid rgba(255,255,255,0.08);padding:32px 0 20px;';

  var demoLbl2 = document.createElement('div');
  demoLbl2.textContent = 'TRY IT \u2014 WEALTH PROJECTION';
  demoLbl2.style.cssText = 'font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#C4A24D;margin-bottom:8px;';
  demoHdr2.appendChild(demoLbl2);

  var demoTtl2 = document.createElement('div');
  demoTtl2.textContent = 'Wealth Projection';
  demoTtl2.style.cssText = 'font-size:20px;font-weight:700;color:#e2e8f0;margin-bottom:6px;';
  demoHdr2.appendChild(demoTtl2);

  var demoSub2 = document.createElement('div');
  demoSub2.textContent = 'The wow moment. See Marcus\u2019s projected net worth grow from $142k to $2.8M over 40 years.';
  demoSub2.style.cssText = 'font-size:13px;color:rgba(255,255,255,0.4);line-height:1.5;';
  demoHdr2.appendChild(demoSub2);
  container.appendChild(demoHdr2);

  container.appendChild(projPanel);

  // ============================================================
  // SECTION 5: SINGAPORE-SPECIFIC
  // ============================================================
  var sgSection = document.createElement('div');
  sgSection.style.cssText = 'border-top:1px solid rgba(255,255,255,0.08);padding:32px 0 16px;';

  var sgHeading = document.createElement('div');
  sgHeading.textContent = 'Built for Singapore Advisors';
  sgHeading.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.08em;text-align:center;margin-bottom:20px;';
  sgSection.appendChild(sgHeading);

  var sgGrid = document.createElement('div');
  sgGrid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:12px;';

  var sgCards = [
    {
      icon: '\uD83C\uDDF8\uD83C\uDDEC',
      title: 'CPF-Ready',
      desc: 'Full CPF contribution rates, allocation logic, and LIFE payout estimation',
      color: '#C4A24D',
    },
    {
      icon: '\uD83C\uDFE0',
      title: 'HDB & Property',
      desc: 'BSD, ABSD, MSR/TDSR calculations built in',
      color: '#3b82f6',
    },
    {
      icon: '\uD83D\uDCCA',
      title: 'Tax Optimized',
      desc: 'SRS, tax reliefs, and net income projections',
      color: '#10b981',
    },
  ];

  sgCards.forEach(function(sg) {
    var sgCard = document.createElement('div');
    sgCard.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:20px 16px;text-align:center;';
    var sgIcon = document.createElement('div');
    sgIcon.textContent = sg.icon;
    sgIcon.style.cssText = 'font-size:26px;margin-bottom:10px;';
    sgCard.appendChild(sgIcon);
    var sgTitle = document.createElement('div');
    sgTitle.textContent = sg.title;
    sgTitle.style.cssText = 'font-size:14px;font-weight:700;color:' + sg.color + ';margin-bottom:6px;';
    sgCard.appendChild(sgTitle);
    var sgDesc = document.createElement('div');
    sgDesc.textContent = sg.desc;
    sgDesc.style.cssText = 'font-size:12px;color:rgba(255,255,255,0.4);line-height:1.5;';
    sgCard.appendChild(sgDesc);
    sgGrid.appendChild(sgCard);
  });
  sgSection.appendChild(sgGrid);
  container.appendChild(sgSection);

  // Render charts after DOM is ready
  setTimeout(function() {
    _fhRenderDonuts(donutIncome, donutExpenses, donutAssets, donutLiab);
    _fhRenderProjection();
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
    if (tab === 'projection') _fhRenderProjection();
  }, 50);
}

/* ---- Financial Planner: render all 4 donuts ---- */
function _fhRenderDonuts(income, expenses, assets, liab) {
  function renderOne(config) {
    var canvas = document.getElementById(config.canvasId);
    if (!canvas) return;
    Charts.donut(canvas, config.items.map(function(i) {
      return { value: i.value, color: i.color, label: i.label };
    }), { size: 130, centerText: config.centerText, centerSub: '' });
  }
  renderOne(income);
  renderOne(expenses);
  renderOne(assets);
  renderOne(liab);
}

/* ---- CPF Projection chart ---- */
function _fhRenderCPF() {
  var canvas = document.getElementById('fhCPFBar');
  if (!canvas) return;

  var salary = 8000;
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
    if (age >= 55) { saFV = Math.min(saFV, 213000); }
    return {
      label: '' + age,
      segments: [
        { value: Math.round(oaFV), color: '#3b82f6' },
        { value: Math.round(saFV), color: '#C4A24D' },
        { value: Math.round(maFV), color: '#10b981' },
      ]
    };
  });

  Charts.stackedBar(canvas, cpfData, {
    height: 200,
    legend: [
      { label: 'OA', color: '#3b82f6' },
      { label: 'SA', color: '#C4A24D' },
      { label: 'MA', color: '#10b981' },
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
    height: 280,
    currency: true,
    gridLines: 5,
    yMin: 0,
    yMax: 3000000,
  });

  _fhRenderCPF();
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
