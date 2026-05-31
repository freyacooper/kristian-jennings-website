# iMessage Inbox Screenshot Generator — Build Plan

## Source of patterns
Mirror `/Users/kristianjennings/Kristian/Claude Code/Imessage Creator/` (the existing iMessage Conversation Generator). Same stack, same theming, same export pipeline, same controls primitives. Only the middle content of the phone changes.

## Stack (locked from existing project)
- Vite 6 + React 19 + TypeScript 5.7
- Tailwind v4 via `@tailwindcss/vite` plugin (no PostCSS, no config file)
- `html-to-image` for PNG export
- CSS variables in `index.css` for light/dark theming
- No backend, no auth, no storage

## File structure
```
src/
  components/
    ControlsPanel/
      index.tsx                  # orchestrator
      ui.tsx                     # Section, Field, Row, Toggle, Button, Input (copy from creator)
      StatusBarControls.tsx      # copy from creator
      TogglesControls.tsx        # just dark mode + Dynamic Island
      ConversationListEditor.tsx # NEW — per-conversation cards
    PhonePreview/
      index.tsx                  # forwardRef root, Dynamic Island, header card
      StatusBar.tsx              # copy from creator
      icons.tsx                  # copy + add ComposeIcon, SearchIcon, ChevronRight
      InboxHeader.tsx            # NEW — Edit / Messages title / Compose
      SearchBar.tsx              # NEW — rounded grey pill
      ConversationRow.tsx        # NEW — unread dot, avatar, name+preview, timestamp+chevron
      ContactAvatar.tsx          # adapted from creator — per-conversation image
    ExportControls/index.tsx     # copy from creator
  hooks/
    useInbox.ts                  # NEW — state + add/update/delete/move/updateStatusBar/updateToggles
    useExport.ts                 # copy (filename: imessage-inbox.png)
  types/
    index.ts                     # Conversation, InboxState, StatusBarConfig, PreviewToggles, AspectRatio
  App.tsx                        # adapted layout (no message-input/keyboard toggles)
  main.tsx                       # copy
  index.css                      # copy CSS vars (drop input/keyboard ones we don't need)
```

## State shape
```ts
interface Conversation {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  unread: boolean
  profileImageDataUrl: string | null
}
interface InboxState {
  conversations: Conversation[]
  statusBar: StatusBarConfig
  toggles: { darkMode: boolean; showDynamicIsland: boolean }
}
```

## Default conversations (from spec)
1. Sarah — "Sounds good! See you at 7" — 2:34 PM — unread
2. Mom — "Can you pick up milk on the way home?" — 1:15 PM — read
3. Jake — "Did you see the game last night??" — Yesterday — unread
4. Work Group — "Meeting moved to 3pm" — Yesterday — read
5. Alex — "Thanks for sending that over 🙏" — Tuesday — read
6. Delivery Updates — "Your package has been delivered" — Monday — read

## iOS pt → native px scale
1080 wide / 390pt iPhone width ≈ 2.77×. So:
- Messages large title 34pt → 94px font
- Body 17pt → 47px font
- Caption 13pt → 36px
- Avatar 50-55pt → ~140-152px diameter (match nav avatar = 140)
- Row divider inset = avatar size + 16pt margin
- Row vertical padding ~12pt → 33px
- Unread blue dot ~10pt → 28px

## Inbox layout details
- Below status bar + dynamic island headroom, render:
  - Top bar row: "Edit" (blue text, left) | spacer | Compose icon (blue square-pen, right)
  - "Messages" — left-aligned large bold title (94px / 700)
  - Search pill — rounded full, grey background, magnifying glass + "Search" placeholder
  - Conversation rows — vertical list, divider line starts after avatar inset
- Each row: optional blue dot (12pt circle) on far left | avatar (140px) | name+preview stack | timestamp+chevron column
- Row name bolder weight when unread
- No bottom tab bar (iOS 17 inbox is full-screen)
- No message-input bar, no keyboard

## Status bar carrier — discrepancy with spec
Spec lists "Service provider (editable, default T-Mobile)". The existing conversation generator does NOT have this, and iOS 17 inside the Messages app does not show carrier text either (that's the lock screen). I will mirror the creator exactly (no carrier). Will mention this to user when checking in.

## Tasks (also in TodoWrite)
1. [ ] Get user approval on this plan
2. [ ] Scaffold project files (package.json, vite.config, tsconfig, index.html)
3. [ ] Write src/main.tsx, src/index.css
4. [ ] Write types/index.ts
5. [ ] Write hooks/useInbox.ts and hooks/useExport.ts
6. [ ] Write PhonePreview components
7. [ ] Write ControlsPanel components + ExportControls
8. [ ] Write App.tsx
9. [ ] npm install + verify dev server
10. [ ] Add review section to this file

## Review

### What was built
Single-page React app at `http://localhost:5173` that mirrors the Imessage Creator pattern, with the phone preview swapped for an iOS 17 Messages inbox.

### Files created (23 total)
- Root: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `.gitignore`
- `src/main.tsx`, `src/App.tsx`, `src/index.css`
- `src/types/index.ts` — `Conversation`, `StatusBarConfig`, `PreviewToggles`, `InboxState`, `AspectRatio`, `ASPECT_RATIOS`
- `src/hooks/useInbox.ts` — state + add/update/delete/move/updateStatusBar/updateToggles
- `src/hooks/useExport.ts` — html-to-image PNG export (filename `imessage-inbox.png`)
- `src/components/PhonePreview/` — `index.tsx`, `StatusBar.tsx`, `icons.tsx`, `InboxHeader.tsx`, `SearchBar.tsx`, `ConversationRow.tsx`, `ContactAvatar.tsx`
- `src/components/ControlsPanel/` — `index.tsx`, `ui.tsx`, `StatusBarControls.tsx`, `TogglesControls.tsx`, `ConversationListEditor.tsx`
- `src/components/ExportControls/index.tsx`

### Patterns reused verbatim from Imessage Creator
- Split-panel layout in `App.tsx` (controls sticky-left, scaled preview sticky-right)
- `transform: scale()` on a parent wrapper for display, not on the preview itself (keeps PNG crisp at native 1080px)
- ResizeObserver-driven auto-fit scaling for the preview stage
- CSS variable theming via `:root` + `[data-theme="dark"]`
- `forwardRef` on `PhonePreview` so `App.tsx` can both render it and pass the ref to `useExport`
- Status bar with 3-column grid that reserves Dynamic Island space when toggled off
- `ui.tsx` primitives: `Section` (native `<details>`), `Field`, `Row`, `Toggle`, `Button`, `Input`
- Per-section state slice + setter (`updateStatusBar`, `updateToggles`, etc.) to keep re-renders surgical
- Preset-buttons + custom-text-input combo for timestamps

### New components (unique to the inbox)
- `InboxHeader` — Edit (blue, left) / Compose icon (blue, right) row + large bold "Messages" title at 100px
- `SearchBar` — grey rounded pill with magnifying glass and "Search" placeholder
- `ConversationRow` — unread dot column (60px, reserved) | avatar (150px) | name+preview stack | timestamp+chevron right
- `ConversationListEditor` — collapsible per-conversation cards with name/message/timestamp/unread/avatar/reorder/delete

### Native pixel-scale conventions (iOS pt × 2.77 for 1080-wide preview)
- Status bar time: 48px
- Messages title: 100px / 700 weight
- Contact name: 47px (700 when unread, 600 when read)
- Message preview / timestamp: 41px / 36px (grey)
- Avatar: 150px diameter
- Unread blue dot: 30px diameter
- Row dividers: 1px, inset 242px (matches avatar's right edge)

### Spec decisions / departures
- **Status bar carrier (T-Mobile) — skipped.** Spec said "Identical to the conversation generator" and the creator has no carrier field; iOS 17 doesn't show carrier inside the Messages app either. Confirmed with user.
- **Pinned conversations — skipped** per spec ("nice-to-have for v1 but not essential").
- **Filtering tabs / swipe-to-delete / bottom tab bar — skipped** per spec.

### Verification
- `npm install` — 83 packages, 0 vulnerabilities
- `npx tsc --noEmit` — passes with zero errors (`strict`, `noUnusedLocals`, `noUnusedParameters` all on)
- `npm run dev` — Vite boots in ~1.2s, served at `http://localhost:5173/`

### Known limitations / things worth verifying in the browser
- Long conversation lists at 1:1 aspect ratio may overflow off the bottom of the phone (the inbox doesn't scroll — anything past the bottom is simply clipped, which matches what `html-to-image` would capture). User can delete rows or pick a taller aspect ratio.
- Profile-image upload stores as base64 data URLs in component state — survives state changes but is lost on page reload (matches the creator's behavior; no persistence layer by design).

---

## Iteration 2 — based on real iMessage screenshots

User pointed out four reference details from real iOS 17 screenshots:
1. Home indicator at the bottom of the screen
2. Inbox WITH search box
3. Inbox WITHOUT search box (search bar can be hidden)
4. Pinned chats with large circular avatars in their own space

### Changes
- **`types/index.ts`** — added `pinned: boolean` to `Conversation`, added `showSearchBar: boolean` to `PreviewToggles`.
- **`index.css`** — added `--ios-home-indicator` CSS var (#000 light / #fff dark).
- **`hooks/useInbox.ts`** — default state includes `pinned: false` for all conversations except Sarah (`pinned: true` so the pinned area is visible on first load); default `showSearchBar: true`.
- **`PhonePreview/HomeIndicator.tsx`** (NEW) — 380×14px rounded pill at bottom-center.
- **`PhonePreview/PinnedChats.tsx`** (NEW) — wraps pinned conversations as circular avatars + name. **Fixed 280px diameter regardless of count, 3 per row, capped at 9 pins** (matches Apple's iOS 17 limit). Earlier auto-scaling version was wrong — corrected after user feedback.
- **`PhonePreview/index.tsx`** — filters conversations into pinned/unpinned; renders `<PinnedChats>` above `<SearchBar>` (the search bar itself is now gated on `toggles.showSearchBar`); renders `<HomeIndicator />` as the last flex child so it always sits at the bottom regardless of how many rows fit.
- **`ControlsPanel/TogglesControls.tsx`** — added "Show search bar" row.
- **`ControlsPanel/ConversationListEditor.tsx`** — added "Pinned" toggle alongside "Unread" inside each conversation card.

### iOS 17 pin behavior modeled
- Pinned conversations are removed from the regular conversation list and displayed in the pinned area instead.
- A single pin renders as one large centered avatar (matches reference image 1).
- Multiple pins flow horizontally with auto-scaling sizes (matches iOS 17 behavior).

### Verification
- `npx tsc --noEmit` passes with zero errors after the iteration.
- Vite HMR auto-reloaded the dev server; no restart required.

---

## Iteration 3 — visual polish from real screenshots

After user reviewed iteration 2, made these refinements:

1. **Pinned avatar size fixed at 220px** (was auto-scaling) — Apple shows all pinned avatars at the same size regardless of count. Capped at 9 (3 per row).
2. **Layout shifts when pins exist:**
   - "Messages" title shrinks to compact: 47px, semibold, centered in the top bar between Edit and Compose (instead of the 100px large left-aligned title below).
   - Search bar moves ABOVE the pinned area (was below).
3. **Mic icon added to search bar** — right side, matches iOS Siri search affordance.
4. **Message preview wraps to 2 lines** with ellipsis on overflow (was 1 line).
5. **Compose icon stroke reduced** from 2 → 1.6 for a lighter, iOS-accurate weight.

### Files changed in iteration 3
- `PhonePreview/PinnedChats.tsx` — fixed 220px diameter, 9 max
- `PhonePreview/SearchBar.tsx` — added mic on the right
- `PhonePreview/icons.tsx` — added `MicIcon`, reduced ComposeIcon stroke
- `PhonePreview/InboxHeader.tsx` — accepts `compact` prop, renders small-centered or large-below variant
- `PhonePreview/index.tsx` — passes `compact={pinned.length > 0}`, reorders search above pins
- `PhonePreview/ConversationRow.tsx` — 2-line message preview via `-webkit-box` + `WebkitLineClamp: 2`

### Final state
All 4 reference details from the user's iMessage screenshots are now matched:
- ✅ Home indicator at bottom
- ✅ Inbox WITH search box (default)
- ✅ Inbox WITHOUT search box (toggleable)
- ✅ Pinned chats with same-size icons, 3-per-row, 9 max, layout shift when present

Type-check clean, dev server running on `http://localhost:5173/`.
