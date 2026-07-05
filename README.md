# NOA Scheduler

Dance-studio lesson schedule app, implemented from the Claude Design project
"Noa Dance Schedule Redesign" (`design/Noa Schedule.dc.html` is the imported
design source of truth).

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)

## Features

- **Desktop (≥760px)**: 7-column week calendar with an hour grid (10:00–23:00)
- **Mobile (<760px)**: single-day timeline with day tabs
- Genre-colored lesson blocks with lane layout for overlapping lessons
- Lesson status (予約可 / 残りわずか / 満員 / 休講) — closed lessons render grayed out
- Bottom filter sheet: studio picker (with favorite studios), genre, level,
  favorites-only toggle
- Favorites and filters persist to `localStorage` (`noa-sched-v1`)
- Demo schedule is generated deterministically from a seeded RNG (same as the
  design prototype)

## Development

```sh
npm install
npm run dev    # http://localhost:5173
npm run build
```

## Notes

- `CLOSED_DISPLAY` in `src/lib/data.ts` mirrors the design's tweakable prop
  (グレー表示 / 非表示) controlling whether 満員/休講 lessons are grayed out or hidden.
