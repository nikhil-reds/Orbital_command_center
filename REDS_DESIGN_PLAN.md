# REDS Command Center: brand-alignment plan

Source: `REDS_Brand Book_R2.pdf` (17 pages). Values below were extracted from the PDF's colour and font data. The visual rules (logo clear-space, the DON'T pages, gradient usage) could not be read as text and are marked **verify**.

## 1. Brand tokens (from the book)

**Core:** Green `#0BDA51` ("Green at the core"), Ink `#231F20`, Off-white `#F6F6F3`, Charcoal `#292929`, White `#FFFFFF`.

| Family | Scale (dark → light) |
|---|---|
| Green | 950 `#023112` · 800 `#04531F` · 700 `#06792D` · 600 `#08A03C` · **500 `#0BDA51`** · 400 `#33F575` · 300 `#64F796` · 200 `#94FAB6` · 100 `#C5FCD7` · 50 `#E7FEEF` |
| Red (functional) | `#350D11` `#581319` `#811821` `#A81F2A` **`#D32735`** `#DE4F5B` `#E47C84` `#EBA8AD` `#F3CED1` `#FAEBEC` |
| Amber (functional) | `#3A2909` `#60440B` `#8B610E` `#B67F11` **`#E5A015`** `#ECB341` `#EFC571` `#F3D7A0` `#F7E8CA` `#FBF5E9` |
| Cool neutral | `#212121` `#333538` `#474B52` `#5B616B` `#737A87` `#8F949E` `#ACAFB4` `#C8C9CB` `#E1E1E0` `#F3F2F2` |
| Warm neutral | `#383633` `#534D46` `#6C635A` `#887D72` `#9F968E` `#B5B0AB` `#CBC9C8` `#E0E0E0` `#F2F2F3` |
| Accents (family & combinations) | Teal `#0B8793` · Mint `#1FBF8A` · Magenta `#B9219E` · Purple `#7A2DB9` · logo red `#FF1319` |

**Type:** Sora for headlines (scale 12/14/16/20/24/32/42/48/60/84 px), Source Sans (variable) for body. Flush-left, with attention to tracking, leading, apostrophes, quotes and em dashes.

**Semantic mapping for a command centre:**
- Green = nominal, primary action, brand.
- Amber = warning. Red = critical.
- Teal and Mint = secondary data series.
- Magenta and Purple = sparing categorical accents only.
- Cool neutrals form the dark surface ramp.

## 2. Current state (audit)

The UI is a cyan sci-fi HUD: `#7fe3ff`, `rgba(95,216,255,…)`, `#03060d` and Space Grotesk + IBM Plex Mono. About 400 hard-coded cyan values sit in `app/page.tsx` (504 lines), the admin pages, signin/signup, and `public/solar-system.js` (469 lines). Colours are inline, not tokenised.

## 3. Phases

1. **Tokens (foundation).** Add brand colour scales as CSS variables and Tailwind `@theme` tokens in `app/globals.css`. Add semantic tokens (`--surface-*`, `--text-*`, `--border-*`, `--status-ok/warn/crit`). Load Sora and Source Sans via `next/font` in `layout.tsx`. Add the type scale as utilities and update scrollbar, selection and link colours.
2. **Replace hard-coded colours.** Map cyan to Green 500 for primary and active states, and teal for secondary. Map the dark background to Ink/cool-neutral ramps. Map status colours to red and amber. Do `app/page.tsx`, then `admin/layout.tsx`, then the admin sub-pages, then signin/signup. Remove IBM Plex Mono except for genuine tabular data (verify the brand allows it).
3. **3D scene.** Recolour `public/solar-system.js` (orbits, glow, labels) to the brand palette, and keep planet textures neutral.
4. **Components.** Standardise panel, button, input, badge/status chip, nav item and table styles into shared classes or components. The HUD brackets and scan animations become subtle and green. Keep the "command centre" feel without off-brand glows.
5. **Naming and logo.** Retitle "Orbital Command Center" to "REDS Command Center" in metadata, headers, sign-in and the favicon. Place the REDS logo and wordmark (needs the logo SVG, see below), and apply the tracked `R E D S` treatment on large formats.
6. **Accessibility.** Check every text/background pair against the contrast page (**verify** the book's pass/fail pairs). Green `#0BDA51` on dark passes; on off-white it will not, so use Green 700/600 there. Never use red/green alone to convey state.
7. **QA.** Run the app, screenshot each route (`/`, `/signin`, `/signup`, `/admin/*`) at desktop and mobile, grep for leftover cyan values, and run `npm run lint` and `npm run build`.

## 4. Open items I need from you

- REDS logo files (SVG, light and dark versions). They are not extractable from the PDF.
- Dark-only command centre, or also a light theme? The book is light-led (off-white `#F6F6F3`). I'd recommend dark default with a light option.
- Confirm the rename to **"REDS Command Center"** everywhere, including the solar-system imagery's "Orbital" labels.
- Page-by-page DON'Ts (pp. 3, 8, 9, 12, 15) are visual-only. If you can export those pages as images or list the rules, I'll check against them.
