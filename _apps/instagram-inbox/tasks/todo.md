# Instagram DM Inbox Screenshot Generator — Plan

## Architectural decisions (from reference projects)

- **Stack** matches the others: Vite + React 19 + TypeScript + Tailwind v4 + html-to-image.
- **Project skeleton** copies the iMessage Inbox layout (App.tsx, hooks, components, types, ExportControls, ControlsPanel). Same split-panel auto-scaling preview.
- **Visual styling** copies the Instagram DM Creator (CSS variables in index.css with `--ig-*` tokens, `data-theme="dark"` switch, SF/system font stack).
- **Reused components verbatim** (copied/adapted, not imported across projects since each project stands alone):
  - StatusBar + icons (signal/wifi/battery/dynamic island)
  - ContactAvatar with optional green active dot (from DM Creator)
  - ControlsPanel ui.tsx primitives (Section/Field/Row/Input/Toggle/Button)
  - useExport hook (only the download filename changes to `instagram-inbox.png`)

## Files to create

```
src/
  main.tsx
  App.tsx
  index.css                    # IG light + dark CSS variables
  vite-env.d.ts
  types/
    index.ts                   # Conversation, InboxState, StatusBarConfig, PreviewToggles, UserConfig, AspectRatio
  hooks/
    useInbox.ts                # state + add/update/delete/move/upload
    useExport.ts               # PNG export, filename "instagram-inbox.png"
  components/
    PhonePreview/
      index.tsx                # composes StatusBar / InboxHeader / SearchBar / list / BottomTabBar
      StatusBar.tsx            # same as DM Creator
      InboxHeader.tsx          # back arrow, username + chevron, compose icon
      SearchBar.tsx            # rounded pill, magnifier, "Search"
      ConversationRow.tsx      # avatar (+active dot) / name+preview / timestamp / unread dot / camera
      BottomTabBar.tsx         # home/search/create/reels/profile + home indicator
      ContactAvatar.tsx        # circle avatar with optional active dot
      icons.tsx                # status icons + IG nav icons (home/search/plus/reels/etc)
    ControlsPanel/
      index.tsx
      ui.tsx                   # Section/Field/Row/Input/Toggle/Button
      StatusBarControls.tsx
      TogglesControls.tsx
      UserControls.tsx         # your-username + your-profile-pic
      ConversationListEditor.tsx
    ExportControls/
      index.tsx
package.json, index.html, vite.config.ts, tsconfig.json
```

## Data model (types/index.ts)

```ts
Conversation {
  id, username, lastMessage, timestamp,
  unread: boolean,
  activeNow: boolean,            // green dot on avatar
  profileImageDataUrl: string | null
}

UserConfig {
  username: string,              // shown in header w/ dropdown chevron
  profileImageDataUrl: string|null  // shown in bottom tab bar
}

StatusBarConfig { time, signalBars, wifiOn, batteryPercent, showBatteryPercent }
PreviewToggles  { darkMode, showDynamicIsland }
InboxState      { conversations, user, statusBar, toggles }
```

## Behavioural decisions (confirmed)

- **List overflow at 9:16**: rows render top-down; rows that don't fit clip from the bottom (matches real Instagram).
- **Bottom tab bar active state**: DMs icon is filled / selected; the other 4 are outlines.

## Phone preview layout (top to bottom)

1. Dynamic Island (absolute, optional) + StatusBar
2. **InboxHeader**: `[chevron-left] [username + ▾]   [compose-icon]` — single row, ~14px vertical pad, bottom border like DM header
3. **SearchBar**: full-width rounded grey pill, magnifying glass + "Search"
4. **Conversation list**: vertical stack, **no dividers**, ~14-16px vertical padding per row
   - Avatar (~56px scaled — at 1080px width that's ~150px), optional green dot bottom-right
   - Middle column: bold (unread) or regular username; below it grey line `preview text · timestamp`
   - Right column: blue unread dot (when unread) + small grey camera outline
5. **BottomTabBar**: 5 icons in this order — **Home / Reels / DMs (FILLED + active) / Search / Profile pic** — thin top border, fixed height, then a thin home indicator bar. DMs icon is a paper-airplane/messenger glyph and renders filled (selected state) since the user is currently in the inbox. Others are outlines.

## Default state (7 conversations from spec)

sarah_designs / jake.runs / emma_creates / shopify_store / mike.photo / alex_dev / brand_official — exactly as listed in the spec, with unread + activeNow flags per row.

## Controls panel sections (top to bottom)

1. **Preview** — Dark mode, Dynamic Island
2. **Status bar** (collapsed) — time/signal/wifi/battery/show-percentage
3. **Your account** — your username + your profile pic (upload/remove)
4. **Conversations** — add / per-row card with username, message preview, timestamp (presets: Now / 2h / 5h / 1d / 3w), unread toggle, active-now toggle, photo upload/remove, reorder, delete

## Export

- Same aspect-ratio buttons (9:16 / 4:5 / 1:1) + Download PNG, filename `instagram-inbox.png`.

## Todo list

- [ ] 1. Scaffold project files: package.json, tsconfig, vite.config, index.html, main.tsx, index.css, vite-env.d.ts
- [ ] 2. Add types/index.ts with the data model above
- [ ] 3. Implement hooks/useInbox.ts with default 7 conversations
- [ ] 4. Implement hooks/useExport.ts (filename `instagram-inbox.png`)
- [ ] 5. Build PhonePreview/icons.tsx (status icons + IG nav icons + camera outline + active dot helper)
- [ ] 6. Build PhonePreview/ContactAvatar.tsx (avatar with optional green active dot)
- [ ] 7. Build PhonePreview/StatusBar.tsx
- [ ] 8. Build PhonePreview/InboxHeader.tsx (chevron + username + ▾ + compose)
- [ ] 9. Build PhonePreview/SearchBar.tsx (grey pill, magnifier + Search)
- [ ] 10. Build PhonePreview/ConversationRow.tsx
- [ ] 11. Build PhonePreview/BottomTabBar.tsx (5 icons + home indicator, profile pic from UserConfig)
- [ ] 12. Build PhonePreview/index.tsx (composes everything, no dividers between rows)
- [ ] 13. Build ControlsPanel/ui.tsx + index.tsx + all sub-controls
- [ ] 14. Build ExportControls/index.tsx
- [ ] 15. Build App.tsx (split-panel layout + auto-scaling preview)
- [ ] 16. npm install + npm run dev to verify it renders
- [ ] 17. Add Review section to this file

## Review

### What was built

A standalone Vite + React 19 + TS + Tailwind v4 single-page app at this directory. `npm install` and `npm run build` both succeed cleanly; dev server runs on `http://localhost:5173/`.

### File map

- [src/main.tsx](src/main.tsx), [src/App.tsx](src/App.tsx), [src/index.css](src/index.css), [src/vite-env.d.ts](src/vite-env.d.ts)
- [src/types/index.ts](src/types/index.ts) — Conversation / UserConfig / InboxState / StatusBarConfig / PreviewToggles / AspectRatio
- [src/hooks/useInbox.ts](src/hooks/useInbox.ts) — single state hook with add/update/delete/move + 7 default conversations from the spec
- [src/hooks/useExport.ts](src/hooks/useExport.ts) — html-to-image PNG export, filename `instagram-inbox.png`
- [src/components/PhonePreview/](src/components/PhonePreview/)
  - [index.tsx](src/components/PhonePreview/index.tsx) — composes StatusBar → InboxHeader → SearchBar → conversation list (top-down, clips bottom) → BottomTabBar
  - [StatusBar.tsx](src/components/PhonePreview/StatusBar.tsx) — time / signal / wifi / battery
  - [InboxHeader.tsx](src/components/PhonePreview/InboxHeader.tsx) — back chevron + username + ▾ + compose icon
  - [SearchBar.tsx](src/components/PhonePreview/SearchBar.tsx) — rounded grey pill with magnifier + "Search"
  - [ConversationRow.tsx](src/components/PhonePreview/ConversationRow.tsx) — avatar (+ optional green active dot) / username (bold if unread) / preview · timestamp / unread blue dot / camera icon
  - [BottomTabBar.tsx](src/components/PhonePreview/BottomTabBar.tsx) — Home / Reels / DMs (filled = active) / Search / user's profile pic, plus home indicator
  - [ContactAvatar.tsx](src/components/PhonePreview/ContactAvatar.tsx) — circle avatar w/ optional active dot
  - [icons.tsx](src/components/PhonePreview/icons.tsx) — all SVG icons
- [src/components/ControlsPanel/](src/components/ControlsPanel/) — Section/Field/Row/Input/Toggle/Button primitives + TogglesControls, StatusBarControls, UserControls, ConversationListEditor
- [src/components/ExportControls/index.tsx](src/components/ExportControls/index.tsx) — 9:16 / 4:5 / 1:1 + Download PNG

### Decisions made & sign-offs

- **List overflow**: top-down, clips from bottom (matches real Instagram).
- **Bottom tab bar layout**: Home / Reels / **DMs (filled, active)** / Search / your profile pic — overriding the original spec's `Home / Search / + / Reels / Profile` per user direction (current IG UI).
- **Per-row state**: each conversation row has its own `activeNow` toggle and its own profile image upload, independent of the logged-in user.
- **Excluded per spec**: no Notes / Message Requests / Stories rings / group indicators / verified badges / swipe actions / Channels.

### How to use

1. `npm run dev` and open `http://localhost:5173/`.
2. Left panel: tweak status bar, your account (header username + tab-bar profile pic), and individual conversations.
3. Pick aspect ratio (9:16 default), click **Download PNG** — file saves as `instagram-inbox.png`.

### Things to flag

- Bottom-tab icon glyphs (Home/Reels/DMs/Search) are clean line-weight outlines drawn from scratch and may need polishing if you want pixel-accurate Instagram glyphs; can swap in custom SVG assets the same way as the DM Creator did via the `icons.tsx` file.
- Username in the header uses `kristian_jennin` from the previous project's default — change in [src/hooks/useInbox.ts](src/hooks/useInbox.ts) defaults if you want a different starting value.
- No avatar PNGs were copied over — every default conversation starts on the grey silhouette. Upload images via the per-row controls.

