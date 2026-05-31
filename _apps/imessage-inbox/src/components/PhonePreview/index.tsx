import { forwardRef } from 'react'
import type { AspectRatio, InboxState } from '../../types'
import { ASPECT_RATIOS } from '../../types'
import { StatusBar } from './StatusBar'
import { InboxHeader } from './InboxHeader'
import { SearchBar } from './SearchBar'
import { PinnedChats } from './PinnedChats'
import { HomeIndicator } from './HomeIndicator'
import {
  ConversationRow,
  ROW_AVATAR_GAP,
  ROW_AVATAR_SIZE,
  ROW_UNREAD_COL,
} from './ConversationRow'

interface Props {
  state: InboxState
  aspectRatio: AspectRatio
}

const DIVIDER_INSET = ROW_UNREAD_COL + ROW_AVATAR_SIZE + ROW_AVATAR_GAP

export const PhonePreview = forwardRef<HTMLDivElement, Props>(function PhonePreview(
  { state, aspectRatio },
  ref,
) {
  const dims = ASPECT_RATIOS[aspectRatio]
  const showIsland = state.toggles.showDynamicIsland
  const showSearch = state.toggles.showSearchBar

  // Pinned conversations live in the pinned area above the search bar
  // and are removed from the regular conversation list below.
  const pinned = state.conversations.filter(c => c.pinned)
  const unpinned = state.conversations.filter(c => !c.pinned)

  return (
    <div
      ref={ref}
      data-theme={state.toggles.darkMode ? 'dark' : 'light'}
      className="relative flex flex-col"
      style={{
        width: dims.width,
        height: dims.height,
        background: 'var(--ios-bg)',
        color: 'var(--ios-text)',
        overflow: 'hidden',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", system-ui, sans-serif',
      }}
    >
      {/* Dynamic Island — compact pill above the status bar */}
      {showIsland && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 320,
            height: 95,
            background: '#000000',
            borderRadius: 999,
            zIndex: 20,
            boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.08)',
          }}
        />
      )}

      <StatusBar config={state.statusBar} compact={!showIsland} />
      <InboxHeader compact={pinned.length > 0} />
      {showSearch && <SearchBar />}
      {pinned.length > 0 && <PinnedChats conversations={pinned} />}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {unpinned.map((conv, i) => (
          <div key={conv.id} style={{ flexShrink: 0 }}>
            <ConversationRow conversation={conv} />
            {i < unpinned.length - 1 && (
              <div
                style={{
                  height: 1,
                  background: 'var(--ios-divider)',
                  marginLeft: DIVIDER_INSET,
                }}
              />
            )}
          </div>
        ))}
      </div>

      <HomeIndicator />
    </div>
  )
})
