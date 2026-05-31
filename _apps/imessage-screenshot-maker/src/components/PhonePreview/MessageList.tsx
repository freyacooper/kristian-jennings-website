import type { Message } from '../../types'
import { MessageBubble } from './MessageBubble'

interface Props {
  messages: Message[]
  deliveryStatus: string
  showTypingIndicator?: boolean
}

const GAP_SAME_SENDER = 8
const GAP_DIFF_SENDER = 22
const TIMESTAMP_MARGIN_TOP = 40
const TIMESTAMP_MARGIN_BOTTOM = 22

export function MessageList({ messages, deliveryStatus, showTypingIndicator }: Props) {
  // Index of last sender (user) message — delivery status appears under it
  let lastSenderIdx = -1
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].sender === 'sender') {
      lastSenderIdx = i
      break
    }
  }

  return (
    <div className="flex flex-col w-full" style={{ padding: '16px 28px 24px' }}>
      {messages.map((msg, i) => {
        const prev = messages[i - 1]
        const next = messages[i + 1]
        const startsTimestamp = !!msg.timestampLabel
        const sameSenderAsPrev =
          !!prev && prev.sender === msg.sender && !startsTimestamp
        const sameSenderAsNext =
          !!next && next.sender === msg.sender && !next.timestampLabel
        const isLastInGroup = !sameSenderAsNext

        const marginTop = i === 0 || startsTimestamp
          ? 0
          : sameSenderAsPrev
            ? GAP_SAME_SENDER
            : GAP_DIFF_SENDER

        return (
          <div key={msg.id}>
            {msg.timestampLabel && (
              <div
                style={{
                  textAlign: 'center',
                  color: 'var(--ios-secondary-text)',
                  fontSize: 34,
                  fontWeight: 600,
                  marginTop: i === 0 ? 8 : TIMESTAMP_MARGIN_TOP,
                  marginBottom: TIMESTAMP_MARGIN_BOTTOM,
                }}
              >
                {msg.timestampLabel}
              </div>
            )}
            <div style={{ marginTop }}>
              <MessageBubble
                text={msg.text}
                sender={msg.sender}
                color={msg.color}
                isLastInGroup={isLastInGroup}
              />
            </div>
            {i === lastSenderIdx && deliveryStatus && (
              <div
                style={{
                  textAlign: 'right',
                  fontSize: 30,
                  fontWeight: 400,
                  color: 'var(--ios-secondary-text)',
                  marginTop: 10,
                  marginRight: 8,
                  letterSpacing: 0.2,
                }}
              >
                {deliveryStatus}
              </div>
            )}
          </div>
        )
      })}

      {showTypingIndicator && <TypingIndicator topMargin={messages.length > 0} />}
    </div>
  )
}

function TypingIndicator({ topMargin }: { topMargin: boolean }) {
  return (
    <div
      className="flex justify-start"
      style={{ marginTop: topMargin ? GAP_DIFF_SENDER : 0 }}
    >
      <div
        className="relative"
        style={{
          background: 'var(--ios-bubble-receiver)',
          borderRadius: 50,
          padding: '34px 32px',
          display: 'flex',
          gap: 14,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'var(--ios-secondary-text)',
              opacity: 0.4 + i * 0.2,
            }}
          />
        ))}
        {/* Tail "ear" on left (receiver-side) */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 0,
            left: -10,
            width: 28,
            height: 36,
            background: 'var(--ios-bubble-receiver)',
            borderBottomRightRadius: '24px 22px',
            zIndex: 0,
          }}
        />
        <span
          aria-hidden
          style={{
            position: 'absolute',
            bottom: -1,
            left: -24,
            width: 22,
            height: 38,
            background: 'var(--ios-bg)',
            borderBottomRightRadius: 16,
            zIndex: 1,
          }}
        />
      </div>
    </div>
  )
}
