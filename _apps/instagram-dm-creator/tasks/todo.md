# Instagram DM Screenshot Generator — Build Plan

## Goal
Build a single-page React app that generates fake Instagram DM screenshots as PNG.
Mirror the iMessage Creator architecture exactly — same stack, same patterns, same split-panel layout.

## Architecture (copied 1:1 from Imessage Creator)
- Vite + React 19 + TypeScript + Tailwind v4
- CSS variables for light/dark theming (`[data-theme="dark"]`)
- `useConversation` single state hook
- `useExport` for html-to-image PNG export
- Split-panel `App.tsx`: controls left (sticky scroll), phone preview right (auto-scaled)
- Phone preview renders at full 1080-wide native resolution, scaled to fit the stage via CSS transform
- Aspect ratios: 1:1, 4:5, 9:16 (Stories/Reels). Input bar + keyboard only render on 9:16

## Key differences from iMessage (Instagram-specific)

### Header (`DMHeader.tsx`, replaces `NavBar.tsx`)
- Single row: back chevron → avatar (small) → name + active status (stacked, left-aligned) → phone icon, video icon
- Active status: "Active now" with green dot, "Active 2h ago", or hidden (empty)
- No info chevron, no unread badge
- Subtle bottom divider line

### Message bubbles (`MessageBubble.tsx`)
- NO tail/ear — simple rounded rectangles (~20px radius scaled to ~50px at 1080)
- Sender: blue→purple gradient by default (`linear-gradient(to right, #3A6FF7, #8B5CF6)`); user can pick solid colour
- Receiver: `#EFEFEF` light / `#262626` dark
- Consecutive same-sender bubbles: tighter spacing AND adjacent corners squared off (smaller radius)
- Per-message emoji reaction (small emoji rendered below the bubble, offset slightly)
- Heart message: standalone red ❤️ centred (no bubble)
- "Seen" delivery status shows a tiny circular avatar of the receiver next to the word

### Input bar (`MessageInput.tsx`)
- Left: solid blue circle with camera icon (Instagram blue: `#0095F6`)
- Middle/right: pill text field with "Message..." placeholder
- Inside the pill on the right: mic icon, image/gallery icon, sticker icon

### Status bar
- Same iOS status bar as iMessage (reuse pattern + icons)

### Keyboard
- Reuse iOS keyboard from iMessage 1:1

### Theme variables (`index.css`)
Replace iOS-specific variables with Instagram-specific ones:
- `--ig-bg`, `--ig-text`, `--ig-secondary-text`
- `--ig-bubble-sender-gradient`, `--ig-bubble-sender-solid`, `--ig-bubble-sender-text`
- `--ig-bubble-receiver`, `--ig-bubble-receiver-text`
- `--ig-header-bg`, `--ig-header-border`, `--ig-divider`
- `--ig-input-bg`, `--ig-input-field`, `--ig-input-placeholder`
- `--ig-camera-bg` (the blue circle)
- `--ig-active-dot` (`#4CD964` green)
- Keyboard vars (`--ig-keyboard-bg`, `--ig-key-*`) — same values as iOS keyboard

## Type definitions (`types/index.ts`)

```ts
type MessageSender = 'sender' | 'receiver'

// Sender bubble styling
type SenderBubbleStyle =
  | { kind: 'gradient' }        // default purple-blue gradient
  | { kind: 'solid'; color: string }  // user-picked colour

interface Message {
  id: string
  text: string
  sender: MessageSender
  /** Standalone heart (overrides text/bubble — renders just the ❤️) */
  isHeart?: boolean
  /** Reaction emoji shown beneath the bubble */
  reaction?: string
  /** Optional sender bubble style override */
  senderStyle?: SenderBubbleStyle
  /** Group/timestamp divider above this message */
  timestampLabel?: string
}

interface StatusBarConfig { /* same as iMessage */ }

interface DMHeaderConfig {
  username: string
  displayName?: string     // optional, shown above active status if set
  activeStatus: string     // "Active now", "Active 2h ago", or "" to hide
  showActiveDot: boolean   // green dot next to "Active now"
}

interface ProfileConfig {
  imageDataUrl: string | null   // contact avatar (header + Seen indicator)
}

interface PreviewToggles {
  darkMode: boolean
  showMessageInput: boolean
  showKeyboard: boolean
  showDynamicIsland: boolean
}

interface ConversationState {
  messages: Message[]
  statusBar: StatusBarConfig
  header: DMHeaderConfig
  profile: ProfileConfig
  toggles: PreviewToggles
  deliveryStatus: 'Seen' | 'Delivered' | ''
  defaultSenderStyle: SenderBubbleStyle  // global default for new messages
}
```

## File checklist

- [ ] `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore`
- [ ] `src/main.tsx`, `src/index.css` (Instagram theme variables)
- [ ] `src/types/index.ts`
- [ ] `src/hooks/useConversation.ts` (default state with the 6-message sample convo from the spec)
- [ ] `src/hooks/useExport.ts` (filename `instagram-dm.png`)
- [ ] `src/components/PhonePreview/index.tsx` (orchestrator)
- [ ] `src/components/PhonePreview/StatusBar.tsx` (reuse iMessage pattern; no carrier text)
- [ ] `src/components/PhonePreview/DMHeader.tsx` (NEW — Instagram-specific layout)
- [ ] `src/components/PhonePreview/MessageList.tsx` (groups, timestamps, Seen indicator with avatar)
- [ ] `src/components/PhonePreview/MessageBubble.tsx` (no tails, gradient/solid, reactions, heart)
- [ ] `src/components/PhonePreview/MessageInput.tsx` (camera circle + pill + inside-icons)
- [ ] `src/components/PhonePreview/Keyboard.tsx` (reused from iMessage)
- [ ] `src/components/PhonePreview/ContactAvatar.tsx` (reused)
- [ ] `src/components/PhonePreview/icons.tsx` (status bar icons reused + Instagram-specific: BackArrow, PhoneIcon, VideoIcon, CameraCircleIcon, MicIcon, GalleryIcon, StickerIcon, HeartIcon)
- [ ] `src/components/ControlsPanel/index.tsx`
- [ ] `src/components/ControlsPanel/ui.tsx` (Section / Row / Field / Input / Toggle / Button — reused 1:1)
- [ ] `src/components/ControlsPanel/TogglesControls.tsx`
- [ ] `src/components/ControlsPanel/MessageListEditor.tsx` (sender/receiver toggle, gradient/solid/colour-picker, heart toggle, reaction text input, delete/move, timestamp picker)
- [ ] `src/components/ControlsPanel/HeaderControls.tsx` (username, display name, active status, green dot toggle)
- [ ] `src/components/ControlsPanel/ProfileControls.tsx` (avatar upload)
- [ ] `src/components/ControlsPanel/StatusBarControls.tsx` (reused)
- [ ] `src/components/ControlsPanel/DeliveryStatusControls.tsx` (Seen / Delivered / None — small dedicated section)
- [ ] `src/components/ExportControls/index.tsx` (reused, filename change)
- [ ] `src/App.tsx`

## Default state (per spec)
1. Receiver: "Hey! Just saw your new collection 🔥" — timestamp: "Today 2:34 PM"
2. Sender: "Thank you!! Just launched it today"
3. Receiver: "The black hoodie is insane, is it still in stock?"
4. Sender: "Yep! I'll send you the link"
5. Receiver: "🙏" (with ❤️ reaction)
6. Sender: "Done! Check your DMs 😊"
- Delivery: "Seen"
- Username: `sarah_designs`
- Active status: "Active now", green dot on

## Out of scope (per spec)
- No voice messages, image bubbles, shared posts/reels, group DMs, story rings, typing indicator (v1)

## Approach notes
- Keep changes simple — copy iMessage components verbatim where they apply (StatusBar logic, Keyboard, Section/Row UI primitives, useExport, App.tsx shell)
- Only build NEW components where Instagram diverges (DMHeader, bubble styling, input bar, header controls)
- Native preview width: 1080 (matches iMessage). Font sizes scaled to match: bubble text ~48px native = ~16px on real Instagram.

## Review

### What was built
A complete, working Instagram DM Screenshot Generator. Same architecture as the iMessage Creator (Vite + React 19 + TS + Tailwind v4, CSS-variable theming, single `useConversation` state hook, `useExport` for html-to-image PNG, split-panel layout with sticky left controls and auto-scaled right preview).

### Files created (24 total)
**Config:** `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore`

**Source:**
- `src/main.tsx`, `src/index.css` (Instagram light/dark theme variables — `--ig-*`)
- `src/types/index.ts` (Message, SenderBubbleStyle, DMHeaderConfig, ConversationState, etc.)
- `src/hooks/useConversation.ts` (single state hook with the 6-message sample convo)
- `src/hooks/useExport.ts` (filename `instagram-dm.png`)
- `src/components/PhonePreview/` — `index.tsx`, `StatusBar.tsx`, `DMHeader.tsx`, `MessageList.tsx`, `MessageBubble.tsx`, `MessageInput.tsx`, `Keyboard.tsx`, `ContactAvatar.tsx`, `icons.tsx`
- `src/components/ControlsPanel/` — `index.tsx`, `ui.tsx`, `TogglesControls.tsx`, `MessageListEditor.tsx`, `HeaderControls.tsx`, `ProfileControls.tsx`, `StatusBarControls.tsx`, `DeliveryStatusControls.tsx`
- `src/components/ExportControls/index.tsx`
- `src/App.tsx`

### Instagram-specific details vs iMessage
1. **DMHeader** — single row: chevron → avatar (108px) → name + active status stacked → phone + video icons on the right. Optional separate display name above username. Green active dot toggle.
2. **MessageBubble** — no tail/ear. Gradient sender by default (`linear-gradient(105deg, #3A6FF7, #8B5CF6, #C13584)`), optional solid colour picker (global default + per-message override). Tight 18px radius on adjacent corners of consecutive same-sender bubbles, full 60px elsewhere. Emoji-only messages render large with no bubble.
3. **Heart message** — per-message toggle that renders a standalone 180px ❤️ (no bubble).
4. **Reactions** — small emoji rendered in a pill below the bubble's outer corner, with a subtle shadow. Preset picker (❤️😂😮😢😡👍🔥) + custom input.
5. **MessageInput** — solid blue camera circle (#3797F0) + pill text field with mic / gallery / sticker icons inline on the right.
6. **Delivery status** — "Seen" renders alongside a small (38px) contact avatar of the receiver, matching real IG behaviour. Plus "Delivered" and "Hidden".
7. **Theme vars** — Instagram colour palette (#EFEFEF receiver light, #262626 receiver dark, etc.) replaces iOS variables.

### Verified
- `npm install` — 83 packages, 0 vulnerabilities
- `npm run build` — `tsc` clean (0 errors) + Vite production build succeeds
- `npm run dev` — Vite dev server running at http://localhost:5173/ with no errors

### Reused 1:1 from iMessage Creator
- Project shell (`App.tsx` layout, auto-scale logic, sticky panels, aspect ratio setup)
- `useExport` pattern
- `StatusBar` (iOS time + signal/wifi/battery — same icons, same Dynamic Island toggle)
- `Keyboard` (iOS keyboard rows)
- `ContactAvatar` (image or silhouette fallback)
- Control panel UI primitives (`Section`, `Row`, `Field`, `Input`, `Toggle`, `Button`)
- Conversation overflow-bottom-pinning behaviour

### Out of scope (per spec — not built)
- Voice messages, image bubbles, shared posts/reels, group DMs, story rings around avatars, typing indicator. The architecture supports adding these incrementally.
