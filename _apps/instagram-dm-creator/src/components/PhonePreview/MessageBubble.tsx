import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import type { MessageSender, SenderBubbleStyle } from '../../types'

interface Props {
  text: string
  sender: MessageSender
  isHeart?: boolean
  reaction?: string
  senderStyle: SenderBubbleStyle
  /** Whether this bubble is the first in a same-sender consecutive group. */
  isFirstInGroup: boolean
  /** Whether this bubble is the last in a same-sender consecutive group. */
  isLastInGroup: boolean
  /**
   * Ref to the conversation viewport element. Used to anchor the sender
   * gradient — bubbles render whatever section of the shared gradient sits
   * behind their on-screen position, matching real Instagram.
   */
  convContainerRef: RefObject<HTMLDivElement | null>
}

const RADIUS_FULL = 28
const RADIUS_TIGHT = 8

/**
 * True when `text` contains nothing but emoji + whitespace. Catches base
 * emoji, skin-tone modifiers, ZWJ sequences, and VS-16 selectors.
 */
function isEmojiOnly(text: string): boolean {
  const trimmed = text.trim()
  if (!trimmed) return false
  return /^(\p{Extended_Pictographic}|\p{Emoji_Modifier}|‍|️|\s)+$/u.test(trimmed)
}

/**
 * Walk the offsetParent chain to compute `el`'s position relative to
 * `container`. Used to anchor the gradient — `getBoundingClientRect` is
 * unreliable here because the preview is wrapped in a CSS transform.
 */
function offsetWithinContainer(el: HTMLElement, container: HTMLElement) {
  let x = 0
  let y = 0
  let cur: HTMLElement | null = el
  while (cur && cur !== container) {
    x += cur.offsetLeft
    y += cur.offsetTop
    const parent: Element | null = cur.offsetParent
    cur = parent instanceof HTMLElement ? parent : null
  }
  return { x, y }
}

export function MessageBubble({
  text,
  sender,
  isHeart,
  reaction,
  senderStyle,
  isFirstInGroup,
  isLastInGroup,
  convContainerRef,
}: Props) {
  const isSender = sender === 'sender'
  const usesGradient = isSender && senderStyle.kind === 'gradient' && !isHeart

  // Anchor the gradient to the conversation viewport. Measure the bubble's
  // position within `convContainerRef` after layout, then set background-size
  // = container size and background-position = -offset. Result: every sender
  // bubble shows whatever slice of the same gradient sits behind it.
  //
  // Hooks must be called unconditionally — measurement is skipped inside the
  // effect for non-gradient bubbles, and the ref is only attached to the real
  // bubble path below.
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [gradientStyle, setGradientStyle] = useState<{
    backgroundSize: string
    backgroundPosition: string
  } | null>(null)

  useLayoutEffect(() => {
    // Functional setState + value comparison: this effect runs on every
    // render so it stays in sync with layout, but bails out to the same
    // state reference when nothing changed — without this guard the new
    // object every render triggers an infinite re-render loop.
    if (!usesGradient) {
      setGradientStyle(s => (s === null ? s : null))
      return
    }
    const container = convContainerRef.current
    const bubble = bubbleRef.current
    if (!container || !bubble) return

    const { x, y } = offsetWithinContainer(bubble, container)
    const nextSize = `${container.clientWidth}px ${container.clientHeight}px`
    const nextPos = `-${x}px -${y}px`
    setGradientStyle(s => {
      if (s && s.backgroundSize === nextSize && s.backgroundPosition === nextPos) {
        return s
      }
      return { backgroundSize: nextSize, backgroundPosition: nextPos }
    })
  })

  // Heart message — standalone red ❤️, no bubble.
  if (isHeart) {
    return (
      <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
        <div style={{ fontSize: 180, lineHeight: 1, padding: '8px 16px' }}>
          {'❤️'}
        </div>
      </div>
    )
  }

  // Emoji-only message — render large, no bubble (matches Instagram).
  if (isEmojiOnly(text)) {
    return (
      <BubbleWrapper isSender={isSender} reaction={reaction}>
        <div style={{ fontSize: 140, lineHeight: 1.1, padding: '0 12px' }}>
          {text}
        </div>
      </BubbleWrapper>
    )
  }

  const solidBackground = isSender
    ? senderStyle.kind === 'solid'
      ? senderStyle.color
      : undefined
    : 'var(--ig-bubble-receiver)'

  const color = isSender ? 'var(--ig-bubble-sender-text)' : 'var(--ig-bubble-receiver-text)'

  // Adjacent corners between consecutive same-sender bubbles get tightened.
  const topTight = !isFirstInGroup
  const bottomTight = !isLastInGroup

  const borderRadius = isSender
    ? `${RADIUS_FULL}px ${topTight ? RADIUS_TIGHT : RADIUS_FULL}px ${
        bottomTight ? RADIUS_TIGHT : RADIUS_FULL
      }px ${RADIUS_FULL}px`
    : `${topTight ? RADIUS_TIGHT : RADIUS_FULL}px ${RADIUS_FULL}px ${RADIUS_FULL}px ${
        bottomTight ? RADIUS_TIGHT : RADIUS_FULL
      }px`

  return (
    <BubbleWrapper isSender={isSender} reaction={reaction}>
      <div
        ref={bubbleRef}
        style={{
          background: solidBackground,
          backgroundImage: usesGradient ? 'var(--ig-bubble-sender-gradient)' : undefined,
          backgroundRepeat: 'no-repeat',
          backgroundSize: gradientStyle?.backgroundSize,
          backgroundPosition: gradientStyle?.backgroundPosition,
          color,
          padding: '26px 38px',
          borderRadius,
          fontSize: 46,
          lineHeight: 1.25,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      >
        {text || ' '}
      </div>
    </BubbleWrapper>
  )
}

/**
 * Aligns the bubble left/right and overlays the reaction emoji at the bottom
 * of the bubble's outer-facing corner.
 */
function BubbleWrapper({
  isSender,
  reaction,
  children,
}: {
  isSender: boolean
  reaction?: string
  children: React.ReactNode
}) {
  // Use text-align on a full-width block + inline-block child for reliable
  // right/left alignment. Flex + inline-block + percentage maxWidth created
  // a circular sizing dependency that collapsed the wrapper to bubble width.
  return (
    <div style={{ textAlign: isSender ? 'right' : 'left', position: 'relative' }}>
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          maxWidth: '80%',
          textAlign: 'left',
        }}
      >
        {children}
        {reaction && reaction.trim() && (
          <div
            style={{
              position: 'absolute',
              bottom: -34,
              [isSender ? 'right' : 'left']: 16,
              background: 'var(--ig-bg)',
              borderRadius: 999,
              padding: '6px 12px',
              fontSize: 38,
              lineHeight: 1,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
              zIndex: 2,
            }}
          >
            {reaction.trim()}
          </div>
        )}
      </div>
    </div>
  )
}
