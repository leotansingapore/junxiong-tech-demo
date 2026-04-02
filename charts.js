/* ============================================================
   CHARTS.JS — Canvas chart utility library
   Design system colours: grids #334155, labels #64748b, text #e2e8f0
   ============================================================ */

const Charts = {

  /* ----------------------------------------------------------
     SETUP — DPR-aware canvas initialisation
     Returns { ctx, w, h }
  ---------------------------------------------------------- */
  setup(canvas, width, height) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = width  * dpr;
    canvas.height = height * dpr;
    canvas.style.width  = width  + 'px';
    canvas.style.height = height + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, w: width, h: height };
  },

  /* ----------------------------------------------------------
     FORMAT CURRENCY
     $1.2M / $50k / $500
  ---------------------------------------------------------- */
  formatCurrency(val) {
    if (val >= 1_000_000) return '$' + (val / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (val >= 1_000)     return '$' + (val / 1_000).toFixed(0) + 'k';
    return '$' + val.toFixed(0);
  },

  /* ----------------------------------------------------------
     AREA CHART
     options: { color, lineWidth, padTop, padBottom, padLeft, padRight,
                yMin, yMax, currency, label, gridLines }
  ---------------------------------------------------------- */
  area(canvas, data, options = {}) {
    const W = canvas.parentElement ? canvas.parentElement.clientWidth || 460 : 460;
    const H = options.height || 160;
    const { ctx, w, h } = this.setup(canvas, W, H);

    const color  = options.color || '#6b9bdb';
    const padT   = options.padTop    ?? 20;
    const padB   = options.padBottom ?? 32;
    const padL   = options.padLeft   ?? 52;
    const padR   = options.padRight  ?? 16;
    const gridLines = options.gridLines ?? 4;
    const useCurrency = options.currency !== false;

    const chartW = w - padL - padR;
    const chartH = h - padT - padB;

    const minVal = options.yMin ?? Math.min(...data.map(d => d.value));
    const maxVal = options.yMax ?? Math.max(...data.map(d => d.value));
    const range  = maxVal - minVal || 1;

    const xStep  = chartW / (data.length - 1);

    const xOf = i => padL + i * xStep;
    const yOf = v => padT + chartH - ((v - minVal) / range) * chartH;

    // Grid lines
    ctx.strokeStyle = '#334155';
    ctx.lineWidth   = 1;
    for (let i = 0; i <= gridLines; i++) {
      const y = padT + (chartH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();

      // Y label
      const val = maxVal - (range / gridLines) * i;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(useCurrency ? this.formatCurrency(val) : val.toFixed(0), padL - 6, y + 3);
    }

    // X labels
    ctx.fillStyle   = '#64748b';
    ctx.font        = '10px system-ui, sans-serif';
    ctx.textAlign   = 'center';
    const labelStep = Math.ceil(data.length / 6);
    data.forEach((d, i) => {
      if (i % labelStep === 0 || i === data.length - 1) {
        ctx.fillText(d.label || '', xOf(i), h - padB + 14);
      }
    });

    // Gradient fill
    const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
    grad.addColorStop(0, color + '44');
    grad.addColorStop(1, color + '00');

    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(data[0].value));
    data.forEach((d, i) => {
      if (i === 0) return;
      const cpX = (xOf(i - 1) + xOf(i)) / 2;
      ctx.bezierCurveTo(cpX, yOf(data[i - 1].value), cpX, yOf(d.value), xOf(i), yOf(d.value));
    });
    ctx.lineTo(xOf(data.length - 1), padT + chartH);
    ctx.lineTo(xOf(0), padT + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(data[0].value));
    data.forEach((d, i) => {
      if (i === 0) return;
      const cpX = (xOf(i - 1) + xOf(i)) / 2;
      ctx.bezierCurveTo(cpX, yOf(data[i - 1].value), cpX, yOf(d.value), xOf(i), yOf(d.value));
    });
    ctx.strokeStyle = color;
    ctx.lineWidth   = options.lineWidth ?? 2;
    ctx.stroke();

    // Dot at last point
    ctx.beginPath();
    ctx.arc(xOf(data.length - 1), yOf(data[data.length - 1].value), 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  },

  /* ----------------------------------------------------------
     MULTI-LINE CHART
     series: [{ label, color, data: [{ label, value }] }]
     options: { height, padTop, padBottom, padLeft, padRight, currency }
  ---------------------------------------------------------- */
  multiLine(canvas, series, options = {}) {
    const W = canvas.parentElement ? canvas.parentElement.clientWidth || 460 : 460;
    const H = options.height || 180;
    const { ctx, w, h } = this.setup(canvas, W, H);

    const padT = options.padTop    ?? 20;
    const padB = options.padBottom ?? 48; // room for legend
    const padL = options.padLeft   ?? 52;
    const padR = options.padRight  ?? 16;

    const chartW = w - padL - padR;
    const chartH = h - padT - padB;

    const allValues = series.flatMap(s => s.data.map(d => d.value));
    const minVal = options.yMin ?? Math.min(...allValues);
    const maxVal = options.yMax ?? Math.max(...allValues);
    const range  = maxVal - minVal || 1;

    const numPoints = series[0].data.length;
    const xStep     = chartW / (numPoints - 1);

    const xOf = i => padL + i * xStep;
    const yOf = v => padT + chartH - ((v - minVal) / range) * chartH;

    // Grid
    const gridLines = options.gridLines ?? 4;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth   = 1;
    for (let i = 0; i <= gridLines; i++) {
      const y = padT + (chartH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();
      const val = maxVal - (range / gridLines) * i;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(options.currency !== false ? this.formatCurrency(val) : val.toFixed(0), padL - 6, y + 3);
    }

    // X labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px system-ui, sans-serif';
    ctx.textAlign = 'center';
    const labelStep = Math.ceil(numPoints / 6);
    series[0].data.forEach((d, i) => {
      if (i % labelStep === 0 || i === numPoints - 1) {
        ctx.fillText(d.label || '', xOf(i), padT + chartH + 14);
      }
    });

    // Lines
    series.forEach(s => {
      ctx.beginPath();
      ctx.moveTo(xOf(0), yOf(s.data[0].value));
      s.data.forEach((d, i) => {
        if (i === 0) return;
        const cpX = (xOf(i - 1) + xOf(i)) / 2;
        ctx.bezierCurveTo(cpX, yOf(s.data[i - 1].value), cpX, yOf(d.value), xOf(i), yOf(d.value));
      });
      ctx.strokeStyle = s.color || '#6b9bdb';
      ctx.lineWidth   = 2;
      ctx.stroke();

      // End dot
      ctx.beginPath();
      ctx.arc(xOf(s.data.length - 1), yOf(s.data[s.data.length - 1].value), 3, 0, Math.PI * 2);
      ctx.fillStyle = s.color || '#6b9bdb';
      ctx.fill();
    });

    // Legend
    const legendY  = h - 18;
    const legendTotalW = series.reduce((acc, s) => acc + ctx.measureText(s.label).width + 28, 0);
    let legendX = w / 2 - legendTotalW / 2;
    ctx.font = '10px system-ui, sans-serif';
    series.forEach(s => {
      ctx.fillStyle = s.color || '#6b9bdb';
      ctx.fillRect(legendX, legendY - 6, 12, 4);
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'left';
      ctx.fillText(s.label, legendX + 16, legendY);
      legendX += ctx.measureText(s.label).width + 28;
    });
  },

  /* ----------------------------------------------------------
     HORIZONTAL BAR CHART
     items: [{ label, value, color }]
     options: { height, maxValue, currency, unit }
  ---------------------------------------------------------- */
  horizontalBar(canvas, items, options = {}) {
    const W = canvas.parentElement ? canvas.parentElement.clientWidth || 460 : 460;
    const barH = options.barHeight ?? 22;
    const barGap = options.barGap ?? 10;
    const padT = options.padTop ?? 12;
    const padB = options.padBottom ?? 12;
    const padL = options.padLeft ?? 120;
    const padR = options.padRight ?? 60;
    const H  = padT + padB + items.length * (barH + barGap);

    const { ctx, w, h } = this.setup(canvas, W, H);
    const chartW = w - padL - padR;
    const maxVal = options.maxValue ?? Math.max(...items.map(i => i.value));

    items.forEach((item, i) => {
      const y = padT + i * (barH + barGap);
      const bW = (item.value / maxVal) * chartW;

      // Label
      ctx.fillStyle   = '#94a3b8';
      ctx.font        = '11px system-ui, sans-serif';
      ctx.textAlign   = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label, padL - 8, y + barH / 2);

      // Track
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(padL, y, chartW, barH, 4);
      ctx.fill();

      // Bar
      const color = item.color || '#6b9bdb';
      const grad  = ctx.createLinearGradient(padL, 0, padL + bW, 0);
      grad.addColorStop(0, color + 'cc');
      grad.addColorStop(1, color);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(padL, y, Math.max(bW, 4), barH, 4);
      ctx.fill();

      // Value label
      ctx.fillStyle    = '#e2e8f0';
      ctx.textAlign    = 'left';
      ctx.font         = '11px system-ui, sans-serif';
      ctx.textBaseline = 'middle';
      const formatted = options.currency !== false ? this.formatCurrency(item.value) : item.value + (options.unit || '');
      ctx.fillText(formatted, padL + bW + 8, y + barH / 2);
    });
  },

  /* ----------------------------------------------------------
     STACKED BAR CHART
     data: [{ label, segments: [{ value, color }] }]
     options: { height, legend: [{ label, color }] }
  ---------------------------------------------------------- */
  stackedBar(canvas, data, options = {}) {
    const W = canvas.parentElement ? canvas.parentElement.clientWidth || 460 : 460;
    const H = options.height || 200;
    const { ctx, w, h } = this.setup(canvas, W, H);

    const padT = options.padTop    ?? 20;
    const padB = options.padBottom ?? 44;
    const padL = options.padLeft   ?? 32;
    const padR = options.padRight  ?? 16;

    const chartW = w - padL - padR;
    const chartH = h - padT - padB;

    const totals = data.map(d => d.segments.reduce((sum, s) => sum + s.value, 0));
    const maxVal = options.maxValue ?? Math.max(...totals);

    const gridLines = options.gridLines ?? 4;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth   = 1;
    for (let i = 0; i <= gridLines; i++) {
      const y = padT + (chartH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();
      const val = maxVal - (maxVal / gridLines) * i;
      ctx.fillStyle  = '#64748b';
      ctx.font       = '9px system-ui, sans-serif';
      ctx.textAlign  = 'right';
      ctx.fillText(options.currency !== false ? this.formatCurrency(val) : val.toFixed(0), padL - 4, y + 3);
    }

    const barW   = (chartW / data.length) * 0.55;
    const barGap = (chartW / data.length) * 0.45;

    data.forEach((d, di) => {
      const x   = padL + di * (barW + barGap) + barGap / 2;
      let   yOff = 0;

      d.segments.forEach(seg => {
        const segH = (seg.value / maxVal) * chartH;
        const y    = padT + chartH - yOff - segH;
        ctx.fillStyle = seg.color || '#6b9bdb';
        ctx.beginPath();
        if (yOff === 0) {
          ctx.roundRect(x, y, barW, segH, [0, 0, 4, 4]);
        } else {
          ctx.rect(x, y, barW, segH);
        }
        ctx.fill();
        yOff += segH;
      });

      // X label
      ctx.fillStyle  = '#64748b';
      ctx.font       = '10px system-ui, sans-serif';
      ctx.textAlign  = 'center';
      ctx.fillText(d.label, x + barW / 2, padT + chartH + 14);
    });

    // Legend
    if (options.legend) {
      const lgY = h - 16;
      const totalLgW = options.legend.reduce((acc, l) => acc + ctx.measureText(l.label).width + 28, 0);
      let lgX = w / 2 - totalLgW / 2;
      ctx.font = '10px system-ui, sans-serif';
      options.legend.forEach(l => {
        ctx.fillStyle = l.color;
        ctx.fillRect(lgX, lgY - 6, 12, 6);
        ctx.fillStyle  = '#94a3b8';
        ctx.textAlign  = 'left';
        ctx.fillText(l.label, lgX + 16, lgY);
        lgX += ctx.measureText(l.label).width + 28;
      });
    }
  },

  /* ----------------------------------------------------------
     DONUT CHART
     segments: [{ value, color, label }]
     options: { size, innerRadius, centerText, centerSub }
  ---------------------------------------------------------- */
  donut(canvas, segments, options = {}) {
    const size = options.size ?? 180;
    const { ctx, w, h } = this.setup(canvas, size, size);

    const cx = w / 2;
    const cy = h / 2;
    const outerR = size / 2 - 8;
    const innerR = options.innerRadius ?? outerR * 0.62;
    const total  = segments.reduce((sum, s) => sum + s.value, 0);
    const gap    = options.gap ?? 0.03;

    let angle = -Math.PI / 2;

    segments.forEach(seg => {
      const sweep = (seg.value / total) * (Math.PI * 2) - gap;

      ctx.beginPath();
      ctx.arc(cx, cy, outerR, angle, angle + sweep);
      ctx.arc(cx, cy, innerR, angle + sweep, angle, true);
      ctx.closePath();
      ctx.fillStyle = seg.color || '#6b9bdb';
      ctx.fill();

      angle += sweep + gap;
    });

    // Center text
    if (options.centerText) {
      ctx.fillStyle  = '#e2e8f0';
      ctx.font       = `bold ${options.centerFontSize ?? 18}px system-ui, sans-serif`;
      ctx.textAlign  = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(options.centerText, cx, cy - (options.centerSub ? 8 : 0));

      if (options.centerSub) {
        ctx.fillStyle = '#64748b';
        ctx.font      = `11px system-ui, sans-serif`;
        ctx.fillText(options.centerSub, cx, cy + 12);
      }
    }
  },

  /* ----------------------------------------------------------
     PROGRESS RING
     progress: 0–1
     options: { size, trackColor, fillColor, lineWidth, centerText, centerSub }
  ---------------------------------------------------------- */
  progressRing(canvas, progress, options = {}) {
    const size = options.size ?? 100;
    const { ctx, w, h } = this.setup(canvas, size, size);

    const cx     = w / 2;
    const cy     = h / 2;
    const radius = size / 2 - (options.lineWidth ?? 8) - 2;
    const lw     = options.lineWidth ?? 8;

    // Track
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = options.trackColor ?? '#1e293b';
    ctx.lineWidth   = lw;
    ctx.stroke();

    // Fill arc
    const startAngle = -Math.PI / 2;
    const endAngle   = startAngle + progress * Math.PI * 2;

    const grad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
    grad.addColorStop(0, options.fillColor ?? '#355A99');
    grad.addColorStop(1, options.fillColorEnd ?? options.fillColor ?? '#6b9bdb');

    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.strokeStyle = grad;
    ctx.lineWidth   = lw;
    ctx.lineCap     = 'round';
    ctx.stroke();

    // Center text
    if (options.centerText) {
      ctx.fillStyle    = '#e2e8f0';
      ctx.font         = `bold ${options.fontSize ?? 14}px system-ui, sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(options.centerText, cx, cy - (options.centerSub ? 7 : 0));

      if (options.centerSub) {
        ctx.fillStyle = '#64748b';
        ctx.font      = `9px system-ui, sans-serif`;
        ctx.fillText(options.centerSub, cx, cy + 9);
      }
    }
  },

};
