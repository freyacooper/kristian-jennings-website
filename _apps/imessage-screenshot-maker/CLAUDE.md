# iMessage Screenshot Generator

A single-page React tool for building fake iOS 17 iMessage conversations and exporting them as crisp PNGs. Built for ecommerce / dropshipping content creation.

## What this app does

Users build a conversation in a controls panel (left side), see a live iPhone preview (right side), and download the result as a PNG at 1:1, 4:5, or 9:16 aspect ratio.

No backend, no auth, no storage — pure client-side single-page React app.

## Stack

- Vite + React 19 + TypeScript
- Tailwind v4 (via `@tailwindcss/vite` plugin)
- `html-to-image` for PNG export
- No router, no state management library (single custom hook handles everything)

## File structure

```
src/
  components/
    ControlsPanel/
      index.tsx                # Section orchestrator
      ui.tsx                   # Shared: Section, Field, Row, Toggle, Button, Input
      TogglesControls.tsx      # Dark mode, Dynamic Island, input, keyboard, typing
      StatusBarControls.tsx    # Time, signal bars, wifi, battery
      NavBarControls.tsx       # Contact name, unread badge count
      ProfileControls.tsx      # Profile picture toggle + upload
      MessageListEditor.tsx    # Per-message editor (text, sender, color, timestamp) + delivery status presets
    PhonePreview/
      index.tsx                # forwardRef root, header wrapper, overflow detection
      StatusBar.tsx            # 3-column grid (time | island reserve | icons)
      NavBar.tsx               # 2-row: avatar row + chevron/name/icon row
      ContactAvatar.tsx
      MessageBubble.tsx        # Emoji-only detection + tail rendering
      MessageList.tsx          # Grouping logic + typing indicator
      MessageInput.tsx         # + conditional home indicator when keyboard off
      Keyboard.tsx             # CSS-only iOS QWERTY
      icons.tsx                # All inline SVG icons
    ExportControls/index.tsx   # Aspect ratio selector + Download button
  hooks/
    useConversation.ts         # All state (messages, toggles, status bar, nav, profile)
    useExport.ts               # html-to-image wrapper
  types/
    index.ts                   # All shared types + ASPECT_RATIOS const
  App.tsx                      # Two-column layout, scale calc
  main.tsx
  index.css                    # Tailwind import + iOS CSS vars (light + dark)
tasks/
  todo.md                      # Build log / revision history
ONBOARDING.md                  # Reusable patterns for similar projects
```

## Conventions

- **Components use `function ComponentName()` exports.** Exception: `PhonePreview` uses `forwardRef` because the export pipeline needs its ref.
- **All icons are inline SVG** in `PhonePreview/icons.tsx`. Always use `stroke="currentColor"` or `fill="currentColor"` so they pick up parent text color.
- **CSS vars for colors**, never hardcoded hex — except `#007AFF` (iOS blue) and `#34C759` (iOS green) which are bubble color spec values.
- **All shared types in `types/index.ts`.** Per-component prop interfaces declared inline.
- **No color emoji as UI glyphs** — e.g. globe key uses `GlobeIcon` SVG, not 🌐 (which renders blue on most platforms).
- **Tailwind classes for layout**; **inline `style` for absolute pixel values** (since the preview renders at native pixel scale, not responsive scale).
- **Native pixel scale**: preview is 1080px wide. All sizes use a ~2.77× scale factor over iOS-pt values (since 1080 ≈ 390pt × 2.77). So 17pt iOS body text → fontSize 47-48 in CSS.

## Key concepts unique to this app

### Header section
Status bar + nav bar sit in one wrapping div in `PhonePreview/index.tsx`:
- Background: `var(--ios-header-bg)` (#F7F7F7 light, #1C1C1E dark)
- Subtle drop shadow onto the conversation area
- `position: relative; z-index: 1` so the shadow projects forward (otherwise the conversation div would paint over it)

### Dynamic Island
- 320×95 black pill, absolutely positioned at `top: 32` in PhonePreview root
- The `ISLAND_WIDTH` constant in `StatusBar.tsx` must match this — it's used as the middle column width in the status bar grid so time + icons stay positioned correctly when the island toggles on/off
- z-index 20 so it's always on top

### Message grouping (`MessageList.tsx`)
- Computes `sameSenderAsPrev` / `sameSenderAsNext` for each message
- Spacing: `GAP_SAME_SENDER = 8`, `GAP_DIFF_SENDER = 22`
- `isLastInGroup = !sameSenderAsNext` — drives whether the bubble renders a tail
- Delivery status renders only under the LAST sender message (computed `lastSenderIdx`)

### Emoji-only messages
`MessageBubble.tsx` checks `isEmojiOnly(text)` and renders at fontSize 140 with no bubble background. Detection regex catches base emoji, modifiers, ZWJ sequences, and VS-16.

### Conversation overflow behavior
`PhonePreview/index.tsx` uses `ResizeObserver` to detect when message content exceeds the conversation area height. Conditionally switches `justify-start` ↔ `justify-end`:
- Few messages (fits) → `justify-start` (top-anchored, no big empty gap above)
- Many messages (overflows) → `justify-end` (bottom-anchored, oldest clipped off top — real iMessage behavior)

### Bubble tail
Two absolutely-positioned spans inside the message bubble:
- "Ear" (colored): `height: 44, width: 28, right: -8, bottom: 0`
- "Clipper" (bg-colored): `height: 46, width: 22, right: -22, bottom: -1`
The clipper carves a curved cutout into the ear, creating the iOS drip shape. Geometry tuned by hand — change cautiously.

### FaceTime icon
- Two SVG shapes: triangle (drawn first, behind) + rectangle (drawn on top with `fill="var(--ios-header-bg)"`)
- The rectangle "masks" the triangle's apex so it looks like a camera lens barrel cut off by the camera body
- The mask uses the header bg CSS var so it always blends correctly — don't hardcode this fill

### Home indicator
Lives at the bottom of the keyboard when the keyboard is on. When the keyboard is OFF, `MessageInput` renders its own home indicator below the input field (pass `withHomeIndicator={!showKeyboard}`).

## Quirks / things to know

1. **Default test conversation** in `useConversation.ts` is the newsletter pitch — change `defaultState.messages` if you want different demo content.
2. **Default status bar time** is "9:41" (Apple's traditional demo time). The "Read" delivery preset uses "Read 9:39 AM" — adjust if you change the status bar time.
3. **Dynamic Island sizing** must stay in sync: `width: 320` in `PhonePreview/index.tsx` and `ISLAND_WIDTH = 320` in `StatusBar.tsx`.
4. **FaceTime icon mask color** uses `fill="var(--ios-header-bg)"`. If you ever change the header bg, the mask follows automatically. Don't hardcode.
5. **Build script** is `tsc && vite build` (type-check first, then bundle). Dev is `npm run dev`.
6. **Chevron icon** uses a non-standard viewBox (13×24) and the `size` prop sets HEIGHT, not width. Width auto-derives from aspect ratio.
7. **No `tailwind.config.js`** — Tailwind v4 auto-detects content.
8. **No `postcss.config.js`** — `@tailwindcss/vite` plugin handles compilation.

## Common edit targets

| Task | File / area |
|---|---|
| Adjust bubble tail geometry | `MessageBubble.tsx` — the two `<span>` elements after the text |
| Change header color | `--ios-header-bg` in `index.css` (light + dark) |
| Change default messages | `defaultState.messages` in `useConversation.ts` |
| Add a new toggle | `PreviewToggles` type → `defaultState.toggles` → `TogglesControls.tsx` |
| Add a new icon | `icons.tsx`, follow the `<svg fill="none" stroke="currentColor">` pattern |
| Change export aspect ratio dimensions | `ASPECT_RATIOS` in `types/index.ts` |
| Adjust message spacing | `GAP_SAME_SENDER` / `GAP_DIFF_SENDER` in `MessageList.tsx` |
| Tweak status bar layout | `StatusBar.tsx` (grid columns) + `ISLAND_WIDTH` constant |

## Things NOT to break

- The `forwardRef` on `PhonePreview` — the export pipeline depends on it
- The CSS transform on the parent wrapper in `App.tsx` (not on the preview itself) — otherwise the PNG export will be the wrong size
- The order of triangle → rectangle in `FaceTimeIcon` — flipping it breaks the apex masking
- `position: relative; z-index: 1` on the header wrapper — without these the drop shadow gets painted over by the conversation div
- The native pixel scale convention — every size/font in the preview assumes 1080 wide. Don't introduce responsive CSS units (rem, em, %) in preview components.

## See also

`ONBOARDING.md` in the project root — captures the reusable patterns that transfer to other mock generator apps (Twitter, Slack, Instagram, terminal, etc.). Read that if you're forking this project to build something similar.
