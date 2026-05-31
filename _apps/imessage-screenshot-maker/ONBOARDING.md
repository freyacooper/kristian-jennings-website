# Mock Generator App — Reusable Pattern Guide

This guide documents the architecture and patterns for building **single-page mock generator apps** — apps where users tweak controls on the left, see a live preview on the right, and export the result as a PNG.

Originally built as an iOS iMessage screenshot generator, but the architecture transfers to any "configure UI → export image" tool (Twitter/X post mock, Instagram post, Slack message, terminal output, etc.).

---

## Stack

- **Vite + React 19 + TypeScript** — fast dev, type safety, modern React
- **Tailwind v4** (`@tailwindcss/vite` plugin, no PostCSS config, no `tailwind.config.js`) — just `@import "tailwindcss"` in your CSS
- **`html-to-image`** — for capturing the preview as a PNG

Scaffolding tip: skip `npm create vite@latest` if your directory isn't empty (it'll prompt). Just write `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css` manually and run one `npm install`. Faster and avoids the interactive prompt.

---

## Folder structure

```
src/
  components/
    ControlsPanel/      # LEFT: all settings/inputs
      index.tsx         # Section orchestrator (renders all subsections)
      ui.tsx            # Shared primitives: Section, Field, Row, Toggle, Button, Input
      [Subsection]Controls.tsx  # One per logical group (e.g. StatusBarControls, NavBarControls)
    [PreviewName]/      # RIGHT: the thing being mocked (e.g. PhonePreview/, PostPreview/)
      index.tsx         # forwardRef'd root, accepts the state hook's `state` prop
      [SubComponent].tsx
      icons.tsx         # All inline SVG icons in one file
    ExportControls/index.tsx  # Aspect ratio selector + download button
  hooks/
    use[Domain].ts      # State hook (e.g. useConversation, usePost)
    useExport.ts        # html-to-image wrapper
  types/
    index.ts            # All shared TS interfaces
  App.tsx               # Two-column layout, preview scaling logic
  main.tsx              # Vite entry
  index.css             # Tailwind import + CSS variables for theming
```

---

## Pattern 1: Split-panel responsive layout

`App.tsx` is the only place that handles layout:

```tsx
<div className="min-h-screen bg-gray-100">
  <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 p-4 lg:p-6">
    <aside className="lg:w-[440px] lg:flex-shrink-0 lg:max-h-[calc(100vh-48px)] lg:overflow-y-auto lg:sticky lg:top-6">
      <ControlsPanel conv={conv} />
    </aside>
    <main className="flex-1 flex flex-col items-center gap-5 lg:sticky lg:top-6 lg:self-start">
      {/* preview stage */}
      <ExportControls ... />
    </main>
  </div>
</div>
```

Key bits:
- `flex flex-col lg:flex-row` — vertical stack on mobile, side-by-side on desktop
- Controls aside is `sticky top-6` so it stays visible while scrolling
- Preview gets `lg:sticky lg:self-start` for the same reason

**Display scaling**: the preview renders at native pixel size (e.g. 1080×1920) but displays much smaller. Use a parent `transform: scale()` wrapper:

```tsx
<div style={{ width: dims.width * previewScale, height: dims.height * previewScale }}>
  <div style={{
    transform: `scale(${previewScale})`,
    transformOrigin: 'top left',
    width: dims.width,
    height: dims.height,
  }}>
    <PhonePreview ref={previewRef} state={conv.state} aspectRatio={aspectRatio} />
  </div>
</div>
```

The PhonePreview itself stays unscaled, so `html-to-image` captures it at native crisp pixel dims.

**Auto-fit scaling** with ResizeObserver:

```tsx
useEffect(() => {
  const compute = () => {
    const stage = previewStageRef.current
    if (!stage) return
    const availW = stage.clientWidth - 32
    const availH = stage.clientHeight - 32
    const scale = Math.min(availW / dims.width, availH / dims.height, 0.5)
    setPreviewScale(Math.max(0.1, scale))
  }
  compute()
  const ro = new ResizeObserver(compute)
  if (previewStageRef.current) ro.observe(previewStageRef.current)
  window.addEventListener('resize', compute)
  return () => {
    ro.disconnect()
    window.removeEventListener('resize', compute)
  }
}, [dims.width, dims.height])
```

---

## Pattern 2: CSS variable theming

Define all design tokens in `index.css` under `:root` (light mode) and override under `[data-theme="dark"]`:

```css
@import "tailwindcss";

:root {
  --ios-bg: #ffffff;
  --ios-text: #000000;
  --ios-secondary-text: #8E8E93;
  --ios-bubble-receiver: #E9E9EB;
  --ios-bubble-sender: #007AFF;
  --ios-header-bg: #F7F7F7;
  --ios-header-shadow: rgba(0, 0, 0, 0.12);
  /* ... */
}

[data-theme="dark"] {
  --ios-bg: #000000;
  --ios-text: #ffffff;
  --ios-bubble-receiver: #26252A;
  --ios-header-bg: #1C1C1E;
  --ios-header-shadow: rgba(255, 255, 255, 0.1);
  /* ... */
}
```

The preview root gets `data-theme={state.toggles.darkMode ? 'dark' : 'light'}`. Every styled element reads from these vars — automatic theme swap, zero JS, dead simple.

**Critical for export**: any mask or background shape (e.g. an SVG element that needs to blend into the surrounding bg) should use `fill="var(--ios-header-bg)"` (or whichever var matches its surroundings) so it follows theme changes automatically. Never hardcode hex on those.

---

## Pattern 3: Single state hook

One custom hook owns all preview state and exposes both `state` and action setters:

```tsx
// hooks/useConversation.ts
export function useConversation() {
  const [state, setState] = useState<ConversationState>(defaultState)

  const addMessage = useCallback((sender) => {
    setState(s => ({ ...s, messages: [...s.messages, newMsg(sender)] }))
  }, [])

  const updateStatusBar = useCallback((patch) => {
    setState(s => ({ ...s, statusBar: { ...s.statusBar, ...patch } }))
  }, [])

  // ...etc

  return {
    state,
    addMessage,
    updateMessage,
    deleteMessage,
    moveMessage,
    updateStatusBar,
    updateNavBar,
    updateProfile,
    updateToggles,
    setDeliveryStatus,
  }
}

export type UseConversation = ReturnType<typeof useConversation>
```

`App.tsx` instantiates it once and passes it to BOTH:
- `<ControlsPanel conv={conv} />` — uses the setters
- `<PhonePreview state={conv.state} />` — reads the state

Single source of truth, no prop drilling, no context needed.

**Naming convention**: setters are typed-by-section so each subsection can take only its slice plus the relevant setter — keeps subsections testable and re-renderable in isolation.

---

## Pattern 4: Export pipeline

`useExport.ts`:

```tsx
import { toPng } from 'html-to-image'
import { ASPECT_RATIOS } from '../types'

export function useExport() {
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const exportPng = async (node, aspect) => {
    if (!node) return
    setExporting(true)
    try {
      const dims = ASPECT_RATIOS[aspect]
      const dataUrl = await toPng(node, {
        width: dims.width,
        height: dims.height,
        canvasWidth: dims.width,
        canvasHeight: dims.height,
        pixelRatio: 1,
        cacheBust: true,
        style: { transform: 'none' },  // strip any inherited CSS transform
      })
      const link = document.createElement('a')
      link.download = 'screenshot.png'
      link.href = dataUrl
      link.click()
    } catch (err) {
      setError(err.message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  return { exportPng, exporting, error }
}
```

Aspect ratios as a typed const map in `types/index.ts`:

```tsx
export type AspectRatio = '1:1' | '4:5' | '9:16'

export const ASPECT_RATIOS: Record<AspectRatio, { width: number; height: number }> = {
  '1:1':  { width: 1080, height: 1080 },
  '4:5':  { width: 1080, height: 1350 },
  '9:16': { width: 1080, height: 1920 },
}
```

The preview is `forwardRef`'d so `App.tsx` can pass `previewRef` to it AND to `exportPng(previewRef.current, aspectRatio)`.

**Why this is crisp**: the preview component renders at exact final pixel dimensions (1080×1920). The CSS `transform: scale()` for display lives on a PARENT wrapper, not on the preview itself. `html-to-image` walks the preview's own DOM, ignores the parent transform, and captures at native size. Result: pixel-perfect PNGs regardless of how scaled-down the on-screen display is.

---

## Pattern 5: Preview component structure

The "preview surface" (phone, post, terminal, whatever) is one `forwardRef` component:

```tsx
export const PhonePreview = forwardRef<HTMLDivElement, Props>(function PhonePreview(
  { state, aspectRatio }, ref
) {
  const dims = ASPECT_RATIOS[aspectRatio]

  return (
    <div
      ref={ref}
      data-theme={state.toggles.darkMode ? 'dark' : 'light'}
      style={{
        width: dims.width,
        height: dims.height,
        background: 'var(--ios-bg)',
        color: 'var(--ios-text)',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", system-ui, sans-serif',
      }}
    >
      <Header />
      <MainContent />
      <Footer />
    </div>
  )
})
```

Sub-components are dumb: they accept slices of state via props and render. No internal state, no setters.

For overlay/floating elements (a notch, a Dynamic Island, a status pill), absolutely position them INSIDE the preview root so they're captured with everything else and stack correctly with `z-index`.

---

## Pattern 6: Controls panel structure

`ui.tsx` exports shared primitives once, then every section uses them:

```tsx
export function Section({ title, children, defaultOpen = true }) {
  return (
    <details open={defaultOpen} className="bg-white border border-gray-200 rounded-lg overflow-hidden group">
      <summary className="...">{title}</summary>
      <div className="px-4 py-4 flex flex-col gap-3 border-t border-gray-100">{children}</div>
    </details>
  )
}

export function Toggle({ checked, onChange }) { /* ... */ }
export function Field({ label, children, hint }) { /* ... */ }
export function Row({ label, children }) { /* ... */ }
export function Input(props) { /* ... */ }
export function Button({ children, ...props }) { /* ... */ }
```

Each subsection takes ONLY the slice of state it needs plus the matching setter:

```tsx
<StatusBarControls config={state.statusBar} update={conv.updateStatusBar} />
<NavBarControls navBar={state.navBar} update={conv.updateNavBar} />
```

This keeps re-renders surgical — toggling dark mode doesn't re-render the entire message list editor.

`Section` uses `<details>` for native collapsibility — no JS needed.

---

## Pattern 7: Preset buttons + custom input combo

For fields like "delivery status" or "timestamp" where a few common values cover 90% of use cases but you still want full freedom, combine a button row with a custom text input:

```tsx
<Field label="Delivery status">
  <div className="flex flex-wrap gap-1.5">
    {['', 'Sent', 'Delivered', 'Read 9:39 AM'].map(opt => {
      const isActive = deliveryStatus === opt
      return (
        <button
          key={opt || 'none'}
          onClick={() => setDelivery(opt)}
          className={`px-2.5 py-1 text-xs rounded border ${
            isActive ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'
          }`}
        >
          {opt || 'None'}
        </button>
      )
    })}
  </div>
  <Input value={deliveryStatus} placeholder="Or type custom…" onChange={e => setDelivery(e.target.value)} />
</Field>
```

The text input shows what's currently set, so clicking a preset updates it, and typing overrides it. Best of both worlds.

---

## Gotchas (things that took multiple iterations)

### Native pixel scale + iOS pt conversion

The preview renders at native dimensions (e.g. 1080×1920 for 9:16). All sizes/fonts are at NATIVE pixel scale — for iPhone mocks, multiply iOS-pt values by **~2.77** (since 1080 wide ≈ 390pt iPhone × 2.77).

So 17pt iOS body text → fontSize 47–48 in CSS. 18pt corner radius → 50 borderRadius. 20pt tap target → 55px.

Always convert design-system pt → native px before applying.

### Speech bubble tails are hard

Tried multiple approaches:
- Single combined SVG path: looks clean but rigid, can't easily theme via CSS vars
- Sharpening the corner radius on the tail side: visually wrong
- **What worked**: two absolutely-positioned spans inside the bubble — a colored "ear" + a bg-colored "clipper" that carves a curve into the ear. Final geometry: ear `height: 44, right: -8, width: 28` + clipper `height: 46, right: -22, width: 22`.

### Background-colored masking

For shapes like a camera icon with a triangle hidden behind a rectangle: render the triangle FIRST (so it stacks behind), then the rectangle with `fill="var(--ios-header-bg)"` on top. The mask uses the actual CSS var so it always matches its surroundings, even in dark mode.

### Overflow detection requires JS

For "top-anchored when content fits, bottom-anchored with top-clip when content overflows" behavior (iMessage-style), you can't do it with pure CSS. Use `ResizeObserver`:

```tsx
useEffect(() => {
  const check = () => {
    setOverflows(content.scrollHeight > container.clientHeight + 1)
  }
  const ro = new ResizeObserver(check)
  ro.observe(container)
  ro.observe(content)
  return () => ro.disconnect()
}, [/* deps that affect content height */])
```

Then conditionally apply `justify-start` vs `justify-end`.

### Header shadow over sibling content

For a header to cast a `box-shadow` ONTO a sibling div below it (rather than be painted over), the header needs `position: relative; z-index: 1`. Without this, the later DOM sibling stacks on top and hides the shadow.

### Globe emoji renders blue

`🌐` is a color emoji and renders blue on macOS, even when you want monochrome. Use an SVG instead with `stroke="currentColor"` so it matches surrounding text/icon color.

### Status bar grid layout

For a status bar with time + Dynamic Island + icons that stays consistent when the island toggles on/off, use a 3-column grid:

```tsx
<div style={{
  display: 'grid',
  gridTemplateColumns: `1fr ${ISLAND_WIDTH}px 1fr`,
  alignItems: 'center',
}}>
  <div style={{ display: 'flex', justifyContent: 'center' }}>{time}</div>
  <div />  {/* island reserved space */}
  <div style={{ display: 'flex', justifyContent: 'center' }}>{icons}</div>
</div>
```

The middle column reserves space for the island (whether or not it renders), so the time + icons stay in the same horizontal positions when toggled.

### Emoji-only message detection

For "render emoji-only messages large with no bubble" behavior:

```tsx
function isEmojiOnly(text: string): boolean {
  const trimmed = text.trim()
  if (!trimmed) return false
  return /^(\p{Extended_Pictographic}|\p{Emoji_Modifier}|‍|️|\s)+$/u.test(trimmed)
}
```

Catches base emoji, skin-tone modifiers, ZWJ sequences (combined emoji like 👨‍👩‍👧‍👦), and VS-16 (text→emoji presentation selector).

### Font stack

`-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", system-ui, sans-serif` — uses SF Pro on Apple devices automatically, falls back to Inter or system-ui everywhere else. For iOS mocks, no need to ship custom fonts.

---

## Adapting for a new mock target

To convert this template to, say, an Instagram post mock generator:

1. **Rename** `PhonePreview/` → `PostPreview/`, swap iOS components for IG components (header, image, like bar, caption, comments)
2. **Update** `useConversation` → `usePost`, change state shape to match post fields
3. **Update** CSS vars in `index.css` to match the new platform's design tokens (IG uses a different blue, different greys, etc.)
4. **Keep** ControlsPanel pattern as-is — just swap the subsection components
5. **Keep** `useExport` untouched — it doesn't care what's being captured
6. **Update** `ASPECT_RATIOS` if the platform has different export sizes (e.g. Twitter cards = 2:1)
7. **Keep** the App.tsx layout, scaling logic, and ResizeObserver auto-fit

The split-panel + state hook + html-to-image export pipeline transfers directly to any "configure → export image" tool.

---

## Anti-patterns to avoid

- ❌ Don't put state in subsection components — it'll get out of sync with the preview
- ❌ Don't hardcode hex colors in components — use CSS vars so dark mode "just works"
- ❌ Don't use `transform: scale()` on the preview element itself — only on a parent wrapper, or the export will be the wrong size
- ❌ Don't use color emoji as UI glyphs (use SVG) — they render colored on macOS
- ❌ Don't try to do "top-anchored when short, bottom-anchored when overflow" in pure CSS — needs JS measurement
- ❌ Don't skip `forwardRef` on the preview — you need it to pass the export ref through
