# Corporate Wellness Hub

## Current State
LandingPage has: Hero, Stats bar, Programs Grid, CTA Banner. No stress awareness section exists.

## Requested Changes (Diff)

### Add
- A new `StressBanner` component inserted between the Stats bar and Programs Grid on the LandingPage
- The banner is a full-width section with an auto-advancing slideshow (manual prev/next + dot nav)
- Slides:
  1. "What Is Stress?" – definition, types (acute/chronic/episodic)
  2. "The Corporate Stress Epidemic" – stats: 83% US workers suffer from work-related stress (Statista 2023), 1M employees absent every day due to stress (AIS)
  3. "How Stress Impacts Employees" – physical, mental, behavioral effects with icons
  4. "The Numbers Don't Lie" – data-heavy slide: 77% experience physical symptoms, 73% psychological symptoms, $300B annual cost to US employers, 120K deaths per year attributable to work stress
  5. "Industries Hit Hardest" – bar/visual showing Finance 79%, Healthcare 74%, Tech 69%, Manufacturing 60% stress rate
  6. "The Burnout Spiral" – shows how unmanaged stress leads to burnout → disengagement → turnover

### Modify
- LandingPage.tsx: import and render `<StressBanner />` between stats and programs sections

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/components/StressBanner.tsx` with fully self-contained slide data, auto-play (5s), prev/next controls, progress bar, dot indicators
2. Update `LandingPage.tsx` to import and render `<StressBanner />`
