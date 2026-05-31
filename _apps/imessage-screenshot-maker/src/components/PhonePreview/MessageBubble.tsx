import type { BubbleColor, MessageSender } from '../../types'

interface Props {
  text: string
  sender: MessageSender
  color?: BubbleColor
  isLastInGroup: boolean
}

const RADIUS = 50

/**
 * True when `text` contains nothing but emoji + whitespace.
 * Catches base emoji, skin-tone modifiers, ZWJ sequences, and VS-16
 * (text→emoji presentation selector).
 */
function isEmojiOnly(text: string): boolean {
  const trimmed = text.trim()
  if (!trimmed) return false
  return /^(\p{Extended_Pictographic}|\p{Emoji_Modifier}|‍|️|\s)+$/u.test(
    trimmed,
  )
}

export function MessageBubble({ text, sender, color = 'blue', isLastInGroup }: Props) {
  const isSender = sender === 'sender'
  const bubbleColor = isSender
    ? color === 'green'
      ? '#34C759'
      : 'var(--ios-bubble-sender)'
    : 'var(--ios-bubble-receiver)'
  const textColor = isSender ? '#ffffff' : 'var(--ios-bubble-receiver-text)'

  // Emoji-only messages render as large standalone emoji, no bubble or tail.
  if (isEmojiOnly(text)) {
    return (
      <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
        <div
          style={{
            fontSize: 140,
            lineHeight: 1.1,
            paddingLeft: 12,
            paddingRight: 12,
            wordBreak: 'break-word',
          }}
        >
          {text}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
      <div
        className="relative"
        style={{
          background: bubbleColor,
          color: textColor,
          padding: '24px 34px',
          borderRadius: RADIUS,
          maxWidth: '76%',
          fontSize: 48,
          lineHeight: 1.22,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      >
        {text || ' '}
        {isLastInGroup && (
          <>
            {/* Colored "ear" — extended top + shifted slightly into the bubble */}
            <span
              aria-hidden
              style={{
                position: 'absolute',
                bottom: 0,
                [isSender ? 'right' : 'left']: -8,
                width: 28,
                height: 44,
                background: bubbleColor,
                [isSender ? 'borderBottomLeftRadius' : 'borderBottomRightRadius']: '24px 22px',
                zIndex: 0,
              }}
            />
            {/* Background-colored clipper carves the curve into the ear */}
            <span
              aria-hidden
              style={{
                position: 'absolute',
                bottom: -1,
                [isSender ? 'right' : 'left']: -22,
                width: 22,
                height: 46,
                background: 'var(--ios-bg)',
                [isSender ? 'borderBottomLeftRadius' : 'borderBottomRightRadius']: 16,
                zIndex: 1,
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}
