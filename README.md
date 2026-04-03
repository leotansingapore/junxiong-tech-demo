# Financial Advisory Tech Demo

Interactive demo site showcasing a suite of tools built for financial advisors. Each platform is presented as a product tour with hero sections, feature highlights, and live inline demos.

**Live site:** https://junxiong-tech-demo.vercel.app

## Platforms

Each demo is a simplified product tour based on a real production app:

| # | Platform | Source Repo | What it demos |
|---|----------|-------------|---------------|
| 1 | **Investment Plan Simulator** | [growing-age-calculator](https://github.com/leotansingapore/growing-age-calculator) | 10-year projections, fee impact, premium holidays, dividend modes |
| 2 | **Activity Tracker** | [engage-point-play](https://github.com/leotansingapore/engage-point-play) | Gamified 11-module performance platform — activity feed, leaderboard, pricing builder, AI coaching |
| 3 | **Product Compass** | [aia-product-compass-hub](https://github.com/leotansingapore/aia-product-compass-hub) | AI training platform — CMFAS exam prep, roleplay scoring, product knowledge base |
| 4 | **Ad Launchpad** | [catalyst-opus](https://github.com/leotansingapore/catalyst-opus) | Self-service Meta ad campaigns in 5 steps — templates, copy editor, audience targeting, lead tracking |
| 5 | **Finance Hub** | [catalyst-refresh-glow](https://github.com/leotansingapore/catalyst-refresh-glow) | Client financial planning — cash flow, net worth, insurance gaps, CPF projections |

> The Activity Tracker demo also pulls tree assets from [tree-showcase](https://github.com/leotansingapore/tree-showcase) (`tree-showcase-omega.vercel.app`).

## Tech Stack

- **Vanilla HTML/CSS/JS** — zero dependencies, zero build step
- **Vercel** — hosting with client-side routing via `vercel.json` rewrites
- **Chart.js-style canvas** — custom charting in `charts.js`

## Project Structure

```
index.html      # Shell — nav, hero placeholder, platform grid, demo container
demos.js        # Platform data, demo renderers, scroll animations (~220KB)
charts.js       # Canvas-based charts for financial projections
styles.css      # Full design system — dark theme, responsive
vercel.json     # Client-side routing for /calculator, /tracker, etc.
```

## Local Development

```bash
# No build step needed — just serve the files
npx serve .
# or
python3 -m http.server 8000
```

Then open http://localhost:8000. Note: direct URLs like `/calculator` only work on Vercel (due to rewrites). Locally, use the platform grid to navigate.

## Deployment

Deployed automatically on push to `main` via Vercel.

```bash
# Manual deploy
vercel --prod --yes
```

## How to Collaborate

### 1. Clone the repo

```bash
git clone https://github.com/leotansingapore/junxiong-tech-demo.git
cd junxiong-tech-demo
```

### 2. Create a branch for your changes

```bash
git checkout -b feat/your-feature-name
```

### 3. Make changes

All demo content lives in `demos.js`. Each platform has a renderer function (e.g., `DEMO_RENDERERS.calculator`, `DEMO_RENDERERS.tracker`). Styling is in `styles.css`.

Key patterns:
- **Adding a new platform:** Add an entry to the `PLATFORMS` array and create a matching `DEMO_RENDERERS.yourId` function
- **Editing a demo:** Find the relevant `DEMO_RENDERERS.xxx` function in `demos.js` and modify the HTML it returns
- **Styling:** All CSS uses a design token system with CSS custom properties at the top of `styles.css`

### 4. Test locally

```bash
npx serve .
```

Check all 5 platforms render correctly and charts load.

### 5. Push and create a PR

```bash
git add -A
git commit -m "feat: describe what you changed"
git push -u origin feat/your-feature-name
```

Then open a Pull Request on GitHub. Vercel will create a preview deployment automatically for the PR.

### 6. Merge

Once reviewed, merge to `main` — Vercel deploys to production automatically.
