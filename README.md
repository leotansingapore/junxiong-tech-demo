# Financial Advisory Tech Demo

Interactive demo site showcasing 5 financial advisory platforms. Each page is a hands-on recreation of a real production app — prospects can click through features without needing a login.

**Live:** https://junxiong-tech-demo.vercel.app

## Platforms

| Demo | What It Shows | Based On |
|------|--------------|----------|
| [Investment Plan Simulator](https://junxiong-tech-demo.vercel.app/calculator) | Investment illustrator with projections, fee analysis, charts | [Finance Illustrator](https://present.financeillustrator.com/long-term-investment-illustrator) (premium tab) |
| [Activity Tracker](https://junxiong-tech-demo.vercel.app/tracker) | Gamified activity logging, leaderboard, commission calculator, tree forest | [ActivityTracker Demo](https://activitytracker-demo.vercel.app/) + [Tree Showcase](https://tree-showcase-omega.vercel.app/mockup.html) |
| [Product Compass](https://junxiong-tech-demo.vercel.app/compass) | Training courses, lecture videos, knowledge base, scripts library | [FINternship Academy](https://academy.finternship.com/) |
| [Ad Launchpad](https://junxiong-tech-demo.vercel.app/launchpad) | 5-step campaign wizard with live ad preview | [Catalyst Opus](https://github.com/leotansingapore/catalyst-opus) |
| [Finance Hub](https://junxiong-tech-demo.vercel.app/financehub) | Client financial planner with wealth projection chart | [Catalyst Refresh Glow](https://github.com/leotansingapore/catalyst-refresh-glow) |

## Source Repos

Each demo is a simplified recreation of a real app:

- **Investment Plan Simulator** — [leotansingapore/growing-age-calculator](https://github.com/leotansingapore/growing-age-calculator)
- **Activity Tracker** — [leotansingapore/engage-point-play](https://github.com/leotansingapore/engage-point-play) + [leotansingapore/activitytracker-trees](https://github.com/leotansingapore/activitytracker-trees)
- **Product Compass** — [leotansingapore/aia-product-compass-hub](https://github.com/leotansingapore/aia-product-compass-hub)
- **Ad Launchpad** — [leotansingapore/catalyst-opus](https://github.com/leotansingapore/catalyst-opus)
- **Finance Hub** — [leotansingapore/catalyst-refresh-glow](https://github.com/leotansingapore/catalyst-refresh-glow)

> The Activity Tracker demo also pulls tree assets from [tree-showcase](https://github.com/leotansingapore/tree-showcase) (`tree-showcase-omega.vercel.app`).

## Tech Stack

- **Vanilla HTML/CSS/JS** — zero dependencies, zero build step
- **Vercel** — hosting with client-side routing via `vercel.json` rewrites
- **Chart.js-style canvas** — custom charting in `charts.js`

## Project Structure

```
index.html      # Shell — nav, hero placeholder, platform grid, demo container
demos.js        # ALL demo content lives here (~220KB) — the main file
charts.js       # Canvas-based charts for financial projections
styles.css      # Full design system — dark theme, CSS custom properties
vercel.json     # Client-side routing for /calculator, /tracker, etc.
tasks/          # PRDs and implementation plans
```

### How demos.js Works

```
demos.js
├── PLATFORMS[]                  — 5 platform card definitions (id, title, features)
├── DEMO_RENDERERS.calculator    — Investment illustrator demo
├── DEMO_RENDERERS.tracker       — Activity tracker with tabbed demos
├── DEMO_RENDERERS.compass       — Training platform with courses + scripts
├── DEMO_RENDERERS.launchpad     — Ad campaign wizard
├── DEMO_RENDERERS.financehub    — Financial planner dashboard
└── Helper functions             — Hero render, platform grid, routing, scroll reveal
```

## Local Development

```bash
# No build step needed — just serve the files
npx serve .
# or
python3 -m http.server 8000
```

Direct URLs like `/calculator` only work on Vercel (due to rewrites). Locally, use the platform grid to navigate.

## Deployment

Auto-deploys on push to `main` via Vercel.

```bash
# Manual deploy
vercel --prod --yes
```

---

## Collaborating with Claude Code

### Setup

1. Install [Claude Code](https://claude.ai/code) if you haven't
2. Clone the repo and start Claude Code:

```bash
git clone https://github.com/leotansingapore/junxiong-tech-demo.git
cd junxiong-tech-demo
claude
```

3. Start a local server in a separate terminal:

```bash
npx serve .
```

### Kickstart Prompt

Paste this into your Claude Code session to get oriented:

```
Read the CLAUDE.md file in this repo, then read the PRD at tasks/prd-interactive-demo-redesign.md.

This is a static demo site (vanilla HTML/CSS/JS, no build step) showcasing 5 financial advisory
platforms. All demo content lives in demos.js (~220KB).

Key context:
- Activity Tracker demos use iframes from activitytracker-demo.vercel.app and tree-showcase-omega.vercel.app
- Calculator and Compass demos are vanilla JS recreations (the real apps are login-gated)
- Ad Launchpad is done — don't touch it
- Finance Hub just needs the chart as the focus — minimal changes
- Dark theme with CSS custom properties (--text1, --text2, --accent, --bg1, --surface1, etc.)
- Charts use charts.js (canvas-based)

Check the PRD for specific user stories and acceptance criteria per platform.
```

### Working on a Platform

Each platform's code is a self-contained function in `demos.js`. To work on one:

```
# Example Claude Code prompts:
"Read DEMO_RENDERERS.tracker in demos.js and show me its structure"
"Rebuild the tracker demo to use 4 tabbed iframes per the PRD"
"Test all 5 platform pages still work after my changes"
```

### Priority Order

1. **Activity Tracker** (US-002) — highest impact, iframe approach is fastest
2. **Product Compass** (US-003) — needs creative work for course library + scripts
3. **Calculator** (US-001) — recreate the Finance Illustrator premium tab
4. **Finance Hub** (US-005) — minimal changes, chart focus
5. **Ad Launchpad** (US-004) — no changes needed

### Tips

- **Work one platform at a time** — each renderer is independent
- **Test navigation** — after changes, click through all 5 platforms to check routing
- **Check mobile** — resize to 390px, no horizontal overflow
- **demos.js is large** — tell Claude to read specific sections (e.g., "read lines 1387-2255 for tracker")
- **Branch workflow** — branch off `main`, push, open PR (Vercel creates preview deploy), merge = production

### Git Conventions

```bash
git checkout -b feat/your-feature-name

# Commit prefixes: feat:, fix:, improve:, docs:, refactor:
git commit -m "feat: rebuild tracker demo with tabbed iframes"

git push -u origin feat/your-feature-name
# Then open a PR on GitHub
```
