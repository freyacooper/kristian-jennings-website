# iMessage Screenshot Generator — Build Plan

## Approach

Keep every step as small and focused as possible. Build in vertical slices: scaffold first, then a minimal end-to-end pipeline (one bubble → preview → PNG download), then layer in features one at a time. Reference iOS 17 specs throughout — bubble radius, status bar heights, spacing.

## Stack

- Vite + React + TypeScript
- Tailwind CSS + CSS variables for the iOS light/dark theme
- `html-to-image` (toPng) for export
- No backend, no router — single page

---

## Todo Items

### Phase 1 — Scaffold
- [x] 1. Initialize Vite React + TS project in working dir
- [x] 2. Install Tailwind CSS + configure (Tailwind v4 via `@tailwindcss/vite`, no separate config needed)
- [x] 3. Install `html-to-image`
- [x] 4. Set up SF Pro / system font stack in `index.css`
- [x] 5. Define CSS variables for iOS light/dark theme (bubble colors, bg, text, nav, etc.)
- [x] 6. Create folder structure per spec (folders created as files added)

### Phase 2 — Types & State
- [ ] 7. Define TypeScript interfaces in `types/index.ts` (Message, ConversationState, StatusBarConfig, NavBarConfig, ProfileConfig, etc.)
- [ ] 8. Build `useConversation` hook — central state for messages + all UI config (status bar, nav, dark mode, toggles)

### Phase 3 — Phone Preview (the iPhone screen)
- [x] 9. `PhonePreview` shell — fixed-pixel-dimension export div, container, base background
- [x] 10. `StatusBar` — time, carrier, signal bars (0–4), wifi toggle, battery + percentage toggle
- [x] 11. `NavBar` — back chevron + Messages badge, contact name, video/info icons
- [x] 12. `ContactAvatar` — circular profile pic (toggle, upload via FileReader → base64)
- [x] 13. `MessageBubble` — blue/grey bubbles, correct iOS 17 radii, tail on tail-of-group, grouped spacing
- [x] 14. Message group renderer — handles sequential same-sender grouping + timestamp dividers ("Today 2:34 PM")
- [x] 15. Delivery status line — "Delivered" / "Read 2:35 PM" / custom / empty
- [x] 16. `MessageInput` — iMessage bar with plus/camera/apps icons (toggle on/off)
- [x] 17. `Keyboard` — SVG/CSS iOS 17 QWERTY keyboard (toggle on/off)
- [x] 18. Dark mode — wire CSS variables to a `data-theme` attr; verify every surface swaps

### Phase 4 — Controls Panel
- [x] 19. `ControlsPanel` shell — scrollable left column, neutral styling, grouped sections (collapsible)
- [x] 20. Status bar controls (time, carrier, signal bars, wifi, battery %, show %)
- [x] 21. Nav bar controls (contact name, unread badge count)
- [x] 22. Profile picture controls (toggle + upload)
- [x] 23. Message list editor — add/delete, sender vs receiver toggle, text input, up/down reorder buttons
- [x] 24. Per-message timestamp input (optional, shown as group divider)
- [x] 25. Delivery status input
- [x] 26. Toggles: dark mode, message input bar, keyboard

### Phase 5 — Export
- [x] 27. `useExport` hook — wraps `html-to-image` `toPng`, triggers download as `imessage-screenshot.png`
- [x] 28. `ExportControls` — aspect ratio selector (1:1 / 4:5 / 9:16, default 9:16) + Download PNG button
- [x] 29. Aspect ratio handling — render export div at 1080×1080 / 1080×1350 / 1080×1920; crop conversation, keep status bar pinned top
- [ ] 30. Verify exported PNG is crisp at native pixel dims (no CSS scaling fuzz) — *needs browser test*

### Phase 6 — Layout & Polish
- [x] 31. Two-column desktop layout (controls left, preview right) in `App.tsx`
- [x] 32. Mobile layout — vertical stack (sticky download button = best-effort, kept controls scrollable)
- [ ] 33. Side-by-side test: real iOS 17 screenshot vs. our preview — *needs your visual verification*
- [ ] 34. Run dev server, manually test all toggles + export at each aspect ratio in browser — *needs your verification*

### Phase 7 — Wrap
- [ ] 35. Add **Review** section at the bottom of `todo.md` summarizing changes

---

## Notes / Open Questions

- Keyboard: SVG recreation is ideal per spec. Starting with a CSS recreation (3 rows of keys + space/return) is simpler and still high-fidelity. Will use CSS unless it looks off — no raster images either way.
- Profile pic default when toggled on with no upload: per spec, research correct iOS 17 default. Plan = grey silhouette circle (standard iOS contact placeholder).
- Drag-to-reorder: not required for v1, sticking with up/down buttons.
- Font: system stack first (`-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display"`). Fallback Inter for non-Apple. No font licensing risk.

---

---

## Revision Pass 1

- [x] R1. Seamless top area — removed `background` and `border-bottom` from NavBar; status bar + nav now share the phone `--ios-bg`
- [x] R2. Bottom-anchored messages — already correct (`flex-1 flex-col justify-end` wrapping `MessageList`); spacing cleaned up
- [x] R3. Bubble radius bumped 26 → 50px (≈18pt at our 2.77× scale); proper iOS tail "ear" + "clipper" pseudo-elements on last-in-group
- [x] R4. Message spacing — 8px gap same-sender, 22px gap different-sender, 40px / 22px top/bottom around timestamp dividers
- [x] R5. Keyboard polish — radius 8→14, height 90→105, softer `0 1px 0` shadow, square globe key, wider 123/return/space sizing
- [x] R6. **NEW** Per-message Blue / Green toggle on sender messages — `BubbleColor` type, default blue; green = `#34C759`
- [x] R7. **NEW** Dynamic Island toggle in Preview controls (default on) — 360×100 black pill, top:32, centered; status bar auto-shifts paddingTop (150/64 with island vs 90/30 without); subtle white ring for visibility in dark mode
- [x] R8. Polish — iPhone frame radius 44 → 55px; contact name semibold @ 38px; status bar time 600 / carrier 500; delivery status 30px secondary-text right-aligned

---

## Revision Pass 2 (Patch 2)

- [x] P1. Font sizing pass — bubble text 46→48 (17pt), contact name 38→48 (17pt semibold), "Messages" 44→48, keyboard letters 46→62 (22-23pt), keyboard bottom row 32→44 (16pt), timestamps 26→34 (12pt), delivery status stays 30
- [x] P2. Globe icon color — replaced 🌐 emoji with `GlobeIcon` SVG that uses `currentColor`, matches other modifier keys (no more blue)
- [x] P3. Keyboard letter key text — bumped to 62px, key height 105→118px so letters fill more of the key face vertically
- [x] P4. Conversation overflow behaviour — JS-based detection in `PhonePreview/index.tsx` using `ResizeObserver`. When content fits the conversation area, messages render top-down (no empty gap above first message). When content overflows, container switches to `justify-end` so oldest messages clip off the top — matching real iMessage. Export captures only the visible portion since `overflow:hidden` on the export root.

---

## Revision Pass 3 (Patch 3)

- [x] 1. Top of screen — Dynamic Island reduced 360×100 → 320×95 (more compact pill matching reference). Status bar already had time-left/icons-right framing; verified seamless background (no bg/border on NavBar). Added small `›` chevron next to contact name (contact-info indicator). Removed Info "ⓘ" icon — reference shows only the FaceTime icon on the right.
- [x] 2. Unread badge — now a small circle (52×52 minWidth, pill when 2+ digits). "Messages" text only renders when badge count > 0; bare chevron otherwise. Matches both reference screenshots.
- [x] 3. Device frame corner radius — reduced 55px → 40px for a subtler curve.
- [x] 4. **NEW** Typing indicator — `showTypingIndicator` toggle in Preview controls (default off). Small receiver-style grey bubble with three pulsing dots, rendered below all messages. CSS `@keyframes typing-pulse` animates opacity in live preview. Base opacities 0.4 / 0.6 / 0.8 with staggered animation delays — export captures a frame mid-animation with varied opacities matching the spec.

---

## Revision Pass 4 (Patch 4) — Nav bar only

- [x] 1. Removed "Messages" text from back button entirely. Now: bare blue chevron, plus small blue circle badge with the count when unread > 0.
- [x] 2. Contact name center alignment — already handled by the `grid-template-columns: 1fr auto 1fr` layout (middle column is geometrically centered between equal 1fr flanks); contact-info `›` chevron preserved.
- [x] 3. Right-side icons — FaceTime now stroked (was filled) with 2.2 strokeWidth for SF Symbol thin-line look. Info icon thinned to 2 strokeWidth, slightly larger and back in the nav next to FaceTime. Both blue, 28px gap between them.

---

## Revision Pass 5 (Patch 5)

- [x] 1. Device frame corner radius — 40px → 36px (subtler curve, almost-but-not-quite square).
- [x] 2. Nav bar restructured to **two rows** — Row 1 is the avatar centered; Row 2 is a `grid items-center` of `[chevron+badge] [name+›] [FaceTime+Info]`. `items-center` on the grid guarantees all four elements sit on the same horizontal axis. Icon sizes bumped: chevron 64→68, FaceTime 62→66, Info 56→66. Badge height 52→56 to match chevron.
- [x] 3. Contact name row spacing — avatar→name gap reduced to 6px (was 12). Horizontal padding bumped 34→52 for comfortable breathing room from screen edges.

---

## Revision Pass 6 (Patch 6)

- [x] Subtle bottom shadow under the header (NavBar) to visually separate it from the conversation. Driven by a new `--ios-header-shadow` CSS variable: `rgba(0,0,0,0.08)` in light mode, `rgba(255,255,255,0.06)` in dark mode (dark variant reads as a faint highlight line rather than a black shadow on black bg). NavBar gets `position: relative; z-index: 1` so its shadow projects over the sibling conversation area rather than being painted over.

---

## Revision Pass 7 (Patch 7) — Input bar

- [x] **+ button** — bumped 58→90 diameter (≈32pt at our 2.77× scale), grey `--ios-bubble-receiver` fill, plus glyph now `--ios-text` color for contrast and size 50.
- [x] **Camera icon** — 42→72, grey (`--ios-secondary-text`).
- [x] **Apps grid icon** — 36→72, grey.
- [x] **Spacing** — gap between elements 14→22 (≈8pt), horizontal padding 22→26.
- [x] **Text field** — explicit `borderRadius: 50` (≈18pt), 1px `--ios-input-border` border, minHeight 58→80.
- [x] **Placeholder text** — 36→44 (≈16pt).
- [x] **Microphone** — 32→55 (≈20pt), grey.
- [x] **Vertical padding** — 16→28 top/bottom (≈10pt) for comfortable row height.
- [x] **Top divider** — `borderTop: 2px solid var(--ios-input-border)` separating input from messages (was 1px, bumped for visibility at our native pixel scale).

---

## Revision Pass 8 — NavBar restructure to match real iOS 17

- [x] Restructured to true iOS 17 layout — `[chevron] [avatar] [video icon]` share Row 1 on one horizontal axis (the avatar is *in* the icon row, not above it). Contact name + `›` sit centered BELOW the avatar in Row 2.
- [x] When `profile.enabled` is false, the name takes the avatar's slot in Row 1 (no Row 2). This keeps the layout sensible whether or not the avatar is shown.
- [x] Removed Info "ⓘ" icon — reference shows only the video icon on the right.
- [x] FaceTime icon changed from stroked outline → filled solid blue (rounded rect + triangular lens, both `fill: currentColor`).
- [x] Avatar size 150 → 140 (slightly smaller now that it sits inline with the chevron/video icon).

## Review

### Final shipped product

A single-page Vite + React 19 + TypeScript + Tailwind v4 app that lets users build pixel-accurate iOS 17 iMessage screenshots and export them as PNGs via `html-to-image`. No backend, no auth, no storage — everything runs client-side.

### What got built

**Phone preview** (`src/components/PhonePreview/`)
- Renders at native pixel dimensions per chosen aspect ratio (1080×1080 / 1080×1350 / 1080×1920), CSS-scaled for display so the export is crisp.
- Header section (status bar + nav bar) lives on a single grey `#F7F7F7` plate with a soft Apple-style drop shadow onto the conversation area.
- Status bar uses a 3-column grid (`1fr {island-width}px 1fr`) so the time stays centered in the left gutter whether the Dynamic Island is on or off.
- Dynamic Island toggle (320×95 black pill).
- NavBar is a true 2-row layout — `[chevron + badge] [avatar] [video icon]` on one axis, `[name + ›]` centered below. Mirrors actual iOS 17.
- FaceTime icon = stroked outline rectangle with a "lens barrel" trapezoid behind it, masked by an `--ios-header-bg`-filled rect so the apex blends into the camera body.
- ChevronLeft is a tight-fitting viewBox (13×24), 90° angle, `size` prop controls height.
- Conversation area uses `ResizeObserver`-based overflow detection to switch between top-anchored (when content fits) and bottom-anchored (when content overflows, clipping the oldest from the top).
- Message bubbles with proper iOS 17 radii (50px), per-message blue/green color, sender/receiver tail "ear + clipper" on `isLastInGroup`.
- Static typing indicator with 3 dots at opacities 0.4 / 0.6 / 0.8.
- Message input bar with `+` button + iMessage field + mic icon. Conditional home indicator when the keyboard is off (so the bar gets safe-area room).
- Keyboard with iOS-style QWERTY, square globe key (SVG, not emoji), proper key shadows.

**Controls panel** (`src/components/ControlsPanel/`)
- Collapsible sections for Preview toggles / Messages / Header / Profile / Status bar.
- Per-message editor: sender toggle, color toggle (sender only), reorder/delete, textarea, **timestamp preset buttons** (None / Today / Today 9:39 AM / Yesterday / Yesterday 9:39 AM / Sunday / Sunday 11:23 AM / March 5 / March 5, 2024) + custom text input.
- Delivery status preset buttons (None / Sent / Delivered / Read 9:39 AM) + custom text.
- Profile picture upload via FileReader → base64.
- Toggles: dark mode, Dynamic Island, message input, keyboard, typing indicator.

**Export** (`src/hooks/useExport.ts`)
- `html-to-image` `toPng` capture at exact pixel dims, downloads as `imessage-screenshot.png`.

**Theming**
- CSS variables for the full iOS palette in `src/index.css`, swapped via `[data-theme="dark"]`. Light & dark mode both wired end-to-end including header bg, header shadow, keyboard, and bubble colors.

### Notes for future work

- Keyboard is CSS, not SVG. Looks good at the working scale but if super-zoomed PNGs reveal issues, an SVG keyboard would be the upgrade.
- Bubble tail is two absolutely-positioned spans (colored "ear" + bg-colored "clipper") rather than a single SVG path — works, but a path would be more flexible if more bubble shapes ever needed.
- The grey header background uses `var(--ios-header-bg)` everywhere it needs to (including the FaceTime icon's apex mask) — if you ever change the header color, both swap together automatically.

