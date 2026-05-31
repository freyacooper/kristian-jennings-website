import { forwardRef } from 'react'
import type { AspectRatio, InboxState } from '../../types'
import { ASPECT_RATIOS } from '../../types'
import { ConversationRow } from './ConversationRow'
import { InboxHeader } from './InboxHeader'
import { MessagesHeader } from './MessagesHeader'
import { SearchBar } from './SearchBar'
import { StatusBar } from './StatusBar'

interface Props {
  state: InboxState
  aspectRatio: AspectRatio
}

export const PhonePreview = forwardRef<HTMLDivElement, Props>(function PhonePreview(
  { state, aspectRatio },
  ref,
) {
  const dims = ASPECT_RATIOS[aspectRatio]
  const showIsland = state.toggles.showDynamicIsland

  return (
    <div
      ref={ref}
      data-theme={state.toggles.darkMode ? 'dark' : 'light'}
      className="relative flex flex-col"
      style={{
        width: dims.width,
        height: dims.height,
        background: 'var(--ig-bg)',
        color: 'var(--ig-text)',
        overflow: 'hidden',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Dynamic Island */}
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
      <InboxHeader user={state.user} />
      <SearchBar />
      <MessagesHeader requestsCount={state.requestsCount} />

      {/* Conversation list — top-down, clips from the bottom when overflowing. */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {state.conversations.map(conv => (
          <ConversationRow key={conv.id} conversation={conv} />
        ))}
      </div>

      {/* iOS home indicator — small pill at the bottom edge. */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: 22,
          paddingTop: 18,
        }}
      >
        <div
          aria-hidden
          style={{
            width: 380,
            height: 14,
            borderRadius: 7,
            background: 'var(--ig-home-indicator)',
          }}
        />
      </div>
    </div>
  )
})
