import { forwardRef, useEffect, useRef, useState } from 'react'
import type { AspectRatio, ConversationState } from '../../types'
import { ASPECT_RATIOS } from '../../types'
import { StatusBar } from './StatusBar'
import { DMHeader } from './DMHeader'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { Keyboard } from './Keyboard'
import { ProfileIntro } from './ProfileIntro'

interface Props {
  state: ConversationState
  aspectRatio: AspectRatio
}

export const PhonePreview = forwardRef<HTMLDivElement, Props>(function PhonePreview(
  { state, aspectRatio },
  ref,
) {
  const dims = ASPECT_RATIOS[aspectRatio]
  // Input bar + keyboard only render at the full 9:16 phone aspect.
  const fullPhone = aspectRatio === '9:16'
  const showIsland = state.toggles.showDynamicIsland

  // When messages overflow, pin to the bottom so the OLDEST clip off the top.
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
        background: 'var(--ig-bg)',
        color: 'var(--ig-text)',
        overflow: 'hidden',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
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

      <div style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'var(--ig-header-bg)' }}>
          <StatusBar config={state.statusBar} compact={!showIsland} />
        </div>
        <DMHeader header={state.header} profile={state.profile} />
      </div>

      <div
        ref={convContainerRef}
        className={`flex-1 flex flex-col ${
          overflows && !state.toggles.lockMessagesToTop ? 'justify-end' : 'justify-start'
        }`}
        style={{ overflow: 'hidden', minHeight: 0, position: 'relative' }}
      >
        <div ref={convContentRef}>
          {state.profileIntro.enabled && (
            <ProfileIntro
              header={state.header}
              profile={state.profile}
              intro={state.profileIntro}
            />
          )}
          <MessageList
            messages={state.messages}
            defaultSenderStyle={state.defaultSenderStyle}
            deliveryStatus={state.deliveryStatus}
            profile={state.profile}
            convContainerRef={convContainerRef}
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
