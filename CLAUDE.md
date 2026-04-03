# junxiong-tech-demo

## What This Is

A static demo site showcasing 5 financial advisory platforms as interactive product tours. Each demo is a simplified recreation of a real production app — not connected to any backend or API.

**Live:** https://junxiong-tech-demo.vercel.app

## Architecture

Zero-dependency vanilla HTML/CSS/JS. No build step.

```
index.html      # Shell (nav, hero, grid, footer) — rarely needs editing
demos.js        # ALL demo content lives here (~220KB) — this is the main file
charts.js       # Canvas charting for financial projections
styles.css      # Design system with CSS custom properties
vercel.json     # Client-side routing rewrites
```

## How demos.js Works

1. `PLATFORMS` array at the top defines the 5 platform cards (id, title, description, features)
2. `DEMO_RENDERERS.{id}` functions return the full HTML for each product tour page
3. Each renderer creates: hero section, feature highlights, and interactive inline demos
4. Search for `DEMO_RENDERERS.calculator`, `DEMO_RENDERERS.tracker`, etc. to find each platform's code

## Source Repos

Each demo recreates a real app — refer to these for accurate data and behavior:

| Demo | Source Repo |
|------|-------------|
| Investment Plan Simulator | github.com/leotansingapore/growing-age-calculator |
| Activity Tracker | github.com/leotansingapore/engage-point-play |
| Product Compass | github.com/leotansingapore/aia-product-compass-hub |
| Ad Launchpad | github.com/leotansingapore/catalyst-opus |
| Finance Hub | github.com/leotansingapore/catalyst-refresh-glow |

## Commands

```bash
npx serve .              # Local dev server
vercel --prod --yes      # Deploy to production
```

## Rules

- All demo content goes in `demos.js` — don't create separate JS files per platform
- Keep styles in `styles.css` using the existing CSS custom properties
- Demos must be self-contained — no API calls, no external dependencies
- Data shown in demos should match the real source apps (check the source repos above)
- Test all 5 platform pages before pushing — navigation between them can break easily
- Dark theme only — match the existing design language

## Git Workflow

- Branch off `main` for changes
- Commit messages: `feat:`, `fix:`, `improve:`, `docs:` prefix
- Push to branch, open PR — Vercel auto-creates preview deploy
- Merge to `main` = auto-deploy to production
