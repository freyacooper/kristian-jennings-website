import { forwardRef, useEffect, useRef, useState } from 'react'
import type { AspectRatio, ConversationState } from '../../types'
import { ASPECT_RATIOS } from '../../types'
import { StatusBar } from './StatusBar'
import { NavBar } from './NavBar'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { Keyboard } from './Keyboard'

interface Props {
  state: ConversationState
  aspectRatio: AspectRatio
}

export const PhonePreview = forwardRef<HTMLDivElement, Props>(function PhonePreview(
  { state, aspectRatio },
  ref,
) {
  const dims = ASPECT_RATIOS[aspectRatio]
  // Input bar + keyboard only render at the full 9:16 phone aspect — cropped
  // formats give the conversation that extra space.
  const fullPhone = aspectRatio === '9:16'
  const showIsland = state.toggles.showDynamicIsland

  // Conversation overflow: when content fits, render top-down (no empty gap
  // above the first message). When content overflows the available height,
  // pin to the bottom so the *oldest* messages clip off the top — matches
  // real iMessage behavior.
  const convContainerRef = useRef<HTMLDivElement>(null)
  const convContentRef = useRef<HTMLDivElement>(null)
  const [overflows, setOverflows] = useState(false)

  useEffect(() => {
    const check = () => {
      const container = convContainerRef.current
      const content = convContentRef.current
      if (!container || !content) return
      setOverflows(content.scrollHeight > container.clientHeight + 1)
    }
    check()
    const ro = new ResizeObserver(check)
    if (convContainerRef.current) ro.observe(convContainerRef.current)
    if (convContentRef.current) ro.observe(convContentRef.current)
    return () => ro.disconnect()
  }, [state.messages, state.deliveryStatus, state.toggles, aspectRatio])

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

      <div
        style={{
          background: 'var(--ios-header-bg)',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 4px 10px var(--ios-header-shadow)',
          flexShrink: 0,
        }}
      >
        <StatusBar config={state.statusBar} compact={!showIsland} />
        <NavBar navBar={state.navBar} profile={state.profile} />
      </div>

      <div
        ref={convContainerRef}
        className={`flex-1 flex flex-col ${overflows ? 'justify-end' : 'justify-start'}`}
        style={{ overflow: 'hidden', minHeight: 0 }}
      >
        <div ref={convContentRef}>
          <MessageList
            messages={state.messages}
            deliveryStatus={state.deliveryStatus}
            showTypingIndicator={state.toggles.showTypingIndicator}
          />
        </div>
      </div>

      {fullPhone && state.toggles.showMessageInput && (
        <MessageInput withHomeIndicator={!state.toggles.showKeyboard} />
      )}
      {fullPhone && state.toggles.showKeyboard && <Keyboard />}
    </div>
  )
})
