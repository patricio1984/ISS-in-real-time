#
# ISS React App (real-time)

## Description
This is a React application that displays the International Space Station (ISS) position in real time using the wheretheiss.at API. Position and trajectory are visualized on a Leaflet map, including past and future segments.

## Recent refactor & improvements
The project was reorganized for better scalability and maintainability. Key changes:

- Folder-by-domain structure:
  - `src/components/common/` — reusable UI components (`SkipToContentLink`).
  - `src/components/header/` — `Header`, `MenuBurger`.
  - `src/components/footer/` — `FooterData`, `ISSFooterData`.
  - `src/components/map/` — `Map`, `CenterMap`.
  - `src/lib/iss/` — `ISSDataProvider` (data fetching & domain logic).
  - `src/hooks/`, `src/utils/`, `src/styles/` — prepared directories for growth.

- Updated imports in `src/App.jsx` and improved CSS for accessibility.
- Added runtime protections (MutationObserver) in the footer to ensure accessible contrast when third-party scripts inject inline styles.

## New features
- Full ISS trajectory rendering: past and future segments.
- Visual differentiation of past vs. future trajectory segments (solid vs dashed, violet vs orange). Future color: `#ff8c00`.
- Larger, clearer tooltips on trajectory markers with timestamps.
- In-map controls to change prediction window (minutes) and rendering precision (segments).
- Accessibility improvements:
  - `Skip to content` link.
  - Accessible overlay and corrected menu button to avoid layout shifts.
  - Robust footer contrast fix (CSS + MutationObserver) to satisfy accessibility tools like WAVE.
- Dark / Light mode toggle integrated (via `body` class).
- Code modularization (`lib/iss`, `components/*`) to simplify testing and future growth.

## Requirements & local run
1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start dev server:

```bash
npm run dev
```

4. Format / lint:

```bash
npm run format
npm run lint
```

## Suggested LinkedIn post
Short version ready to copy/paste:

""Refactored and improved a React app that visualizes the ISS in real time: reorganized code by domain, added trajectory visualization (past/future) with clearer tooltips, interactive map controls, and accessibility fixes — including a robust approach to resolve WAVE contrast alerts. #React #Leaflet #Accessibility"

I can also prepare alternate tones (technical / formal / casual) if you'd like.

---
Keep me posted if you want tests, CI, or deployment instructions added to this README.
