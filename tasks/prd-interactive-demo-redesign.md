# PRD: Interactive Demo Redesign

## Introduction

Redesign the 5 platform demo pages on junxiong-tech-demo to replace product-tour marketing pages with faithful interactive recreations of the real production apps. Each demo should feel like using the actual platform — not reading about it. The hero and feature highlights stay, but the demo sections below them become the star of the show.

**Live site:** https://junxiong-tech-demo.vercel.app

## Goals

- Replace static product-tour content with interactive demos that mirror the real platforms
- Use iframes for publicly accessible demos (Activity Tracker, Tree Showcase)
- Faithfully recreate login-gated platforms (Calculator, Compass) with sample data
- Keep existing hero + feature grid sections (5C approach)
- Maintain zero-dependency vanilla JS architecture (no build step)
- Each demo page should make a prospect think "I want this for my team"

## Source Platforms

| Demo Page | Source Platform | Approach |
|-----------|---------------|----------|
| Calculator | https://present.financeillustrator.com/long-term-investment-illustrator (premium tab) | Recreate — login-gated |
| Activity Tracker | https://activitytracker-demo.vercel.app/ | Iframe embed — publicly accessible |
| Product Compass | https://academy.finternship.com/ | Recreate — login-gated |
| Ad Launchpad | (existing demo) | Keep as-is — already interactive |
| Finance Hub | (existing demo) | Keep hero + features, focus on chart |

## User Stories

### US-001: Calculator — Investment Illustrator Demo

**Description:** As a prospect, I want to interact with a realistic investment illustrator so I can see how the platform helps advisors present investment plans to clients.

**Source:** https://present.financeillustrator.com/long-term-investment-illustrator — Premium tab

**Acceptance Criteria:**
- [ ] Keep existing hero section and key capabilities grid
- [ ] Replace current calculator demo with a faithful recreation of the Finance Illustrator premium tab
- [ ] Include input fields: investment amount, premium frequency, policy term, expected return rate
- [ ] Show projection chart (line/area chart) with year-by-year growth
- [ ] Display fee breakdown and net returns vs gross returns comparison
- [ ] Show summary cards: Total Premiums Paid, Projected Maturity Value, Net Return, Annualized Yield
- [ ] Remove or simplify the retirement step-by-step section (secondary priority)
- [ ] Verify in browser using dev-browser skill

### US-002: Activity Tracker — Tabbed Iframe Demos

**Description:** As a prospect, I want to interact with live Activity Tracker demos so I can experience the actual platform features.

**Source URLs:**
- Activity logging: https://activitytracker-demo.vercel.app/demos/activity.html
- Leaderboard: https://activitytracker-demo.vercel.app/demos/leaderboard.html
- Activity Calculator: https://activitytracker-demo.vercel.app/demos/activity-calc.html
- Tree Forest: https://tree-showcase-omega.vercel.app/mockup.html#daily

**Acceptance Criteria:**
- [ ] Keep existing hero section
- [ ] Replace current "Platform & Pricing" and "Live Dashboard Preview" tabs with 4 new tabs:
  - **Activity** — iframe of activity.html (gamified logging with ripple effects, points, streaks, feed)
  - **Leaderboard** — iframe of leaderboard.html (podium, rankings, analytics, breakdown)
  - **Calculator** — iframe of activity-calc.html (pledge sheet, commission calc, income projection)
  - **Forest** — iframe of mockup.html#daily (isometric forest, collection, growth stages)
- [ ] Each iframe is full-width, responsive, with appropriate height (min 800px, adjust per demo)
- [ ] Tab bar is sticky below the nav when scrolling into the demo section
- [ ] Loading state shown while iframes load
- [ ] Fallback message if iframe fails to load ("Open in new tab" link)
- [ ] Verify in browser using dev-browser skill

### US-003: Product Compass — Course Library + Scripts Demo

**Description:** As a prospect, I want to see the training platform's course experience and scripts library so I can evaluate the learning tools available.

**Source:**
- Course experience: https://academy.finternship.com/product/pro-achiever/pro-achiever-overview
- Scripts: https://academy.finternship.com/scripts?category=follow-up&audience=young-adult

**Acceptance Criteria:**
- [ ] Keep existing hero section and "What's Inside" feature grid
- [ ] Remove AI Roleplay demo section entirely
- [ ] Remove Exam Prep Quiz section entirely
- [ ] Replace with two new demo sections:

**Section 1 — Course Library & Learning Experience:**
- [ ] Course catalog grid showing Pro Achiever modules (e.g., ILP Fundamentals, Protection Planning, Retirement Solutions)
- [ ] Clicking a course card opens a course detail view with:
  - Video player placeholder (thumbnail + play button, simulated lecture embed)
  - Module outline sidebar (collapsible sections with lesson titles, duration, completion checkmarks)
  - Progress bar showing completion percentage
  - Knowledge base / resources panel (downloadable PDFs, cheat sheets, quick reference cards)
- [ ] "Skool-style" community discussion section below the video (2-3 sample comments/questions)

**Section 2 — Scripts Library:**
- [ ] Filter bar with dropdowns: Category (Prospecting, Follow-Up, Closing, Objection Handling) and Audience (Young Adult, Working Professional, Retiree, Business Owner)
- [ ] Script cards grid showing 6-8 sample scripts with:
  - Title, category badge, audience tag
  - Preview snippet (first 2-3 lines)
  - "View Full Script" expand interaction
- [ ] Expanded script view shows full script text with highlighted key phrases
- [ ] Copy-to-clipboard button on each script
- [ ] Verify in browser using dev-browser skill

### US-004: Ad Launchpad — No Changes

**Description:** Keep the existing 5-step campaign wizard as-is. It's already sufficiently interactive.

**Acceptance Criteria:**
- [ ] No changes to the Ad Launchpad renderer
- [ ] Verify it still works after other changes

### US-005: Finance Hub — Chart Focus

**Description:** As a prospect, I want to see the wealth projection chart as the centerpiece of the Finance Hub demo.

**Acceptance Criteria:**
- [ ] Keep existing hero section and "What You Can Plan" feature grid
- [ ] Keep the client profile header and summary cards
- [ ] Keep or enhance the wealth projection chart as the main interactive element
- [ ] Simplify or remove the financial breakdown donut charts (secondary to the main chart)
- [ ] Keep Life Goals Timeline
- [ ] Keep goal breakdown table
- [ ] No major rework needed — this is the lowest-priority platform
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

- FR-1: All demo content stays in `demos.js` — no separate JS files per platform
- FR-2: Styles stay in `styles.css` using existing CSS custom properties
- FR-3: Iframes must be responsive (width: 100%, height set per demo)
- FR-4: Iframe tabs for Activity Tracker must lazy-load (only load iframe when tab is activated)
- FR-5: Recreated demos (Calculator, Compass) must use realistic sample data matching the production apps
- FR-6: All demos must work on mobile (390px viewport) without horizontal overflow
- FR-7: Dark theme throughout — match existing design language
- FR-8: No API calls, no external dependencies beyond charts.js
- FR-9: Navigation between all 5 platforms must continue working (test routing)

## Non-Goals

- No backend connections or live data
- No user authentication or session management
- No AI Roleplay or Quiz features for Product Compass
- No changes to Ad Launchpad
- No changes to index.html structure
- No pricing builder for Activity Tracker (removed in favor of live demos)

## Technical Considerations

- **Iframe CORS:** The activitytracker-demo.vercel.app and tree-showcase-omega.vercel.app must allow iframe embedding. If X-Frame-Options blocks embedding, fall back to recreating those demos in vanilla JS.
- **Iframe height:** Each demo has different content height. Use `postMessage` or fixed heights per tab.
- **File size:** demos.js is already ~220KB. Removing product-tour content and using iframes for tracker should reduce it. Adding Compass course/scripts content may increase it — keep recreations lean.
- **Charts.js:** Continue using for Calculator projections and Finance Hub chart.

## Success Metrics

- Each demo page feels like using the real platform, not reading a brochure
- A prospect can interact with Activity Tracker features without needing a login
- Calculator demo produces realistic investment projection numbers
- Compass demo showcases the breadth of training content available
- All 5 demo pages load in under 3 seconds on a standard connection

## Open Questions

1. Should iframe demos have a "Open in full screen" button for better experience on mobile?
2. For Product Compass course video, should we use a real YouTube/Vimeo embed of a sample lecture, or just a thumbnail placeholder?
3. Should the Activity Tracker pricing builder be preserved as a 5th tab, or is it fully replaced?
