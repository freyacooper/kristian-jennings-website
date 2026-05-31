import type { RefObject } from 'react'
import type { DeliveryStatus, Message, ProfileConfig, SenderBubbleStyle } from '../../types'
import { ContactAvatar } from './ContactAvatar'
import { MessageBubble } from './MessageBubble'

interface Props {
  messages: Message[]
  defaultSenderStyle: SenderBubbleStyle
  deliveryStatus: DeliveryStatus
  profile: ProfileConfig
  /** Conversation viewport — sender bubbles anchor their gradient to this. */
  convContainerRef: RefObject<HTMLDivElement | null>
}

const GAP_SAME_SENDER = 6
const GAP_DIFF_SENDER = 28
const REACTION_EXTRA_GAP = 36
const TIMESTAMP_MARGIN_TOP = 40
const TIMESTAMP_MARGIN_BOTTOM = 28

export function MessageList({
  messages,
  defaultSenderStyle,
  deliveryStatus,
  profile,
  convContainerRef,
}: Props) {
  // Delivery status appears under the very last message ONLY when that
  // message is from the sender — matches real Instagram (the indicator
  // disappears as soon as the receiver replies after your last sent msg).
  const lastIdx = messages.length - 1
  const lastSenderIdx =
    lastIdx >= 0 && messages[lastIdx].sender === 'sender' ? lastIdx : -1

  return (
    <div className="flex flex-col w-full" style={{ padding: '18px 28px 24px' }}>
      {messages.map((msg, i) => {
        const prev = messages[i - 1]
        const next = messages[i + 1]
        const startsTimestamp = !!msg.timestampLabel
        const sameSenderAsPrev =
          !!prev && prev.sender === msg.sender && !startsTimestamp && !prev.isHeart && !msg.isHeart
        const sameSenderAsNext =
          !!next && next.sender === msg.sender && !next.timestampLabel && !next.isHeart && !msg.isHeart
        const isFirstInGroup = !sameSenderAsPrev
        const isLastInGroup = !sameSenderAsNext

        // Vertical spacing above this bubble
        let marginTop = 0
        if (i > 0 && !startsTimestamp) {
          marginTop = sameSenderAsPrev ? GAP_SAME_SENDER : GAP_DIFF_SENDER
          // If the previous bubble has a reaction overlapping below it, add headroom.
          if (prev?.reaction && prev.reaction.trim()) {
            marginTop += REACTION_EXTRA_GAP
          }
        }

        const style: SenderBubbleStyle = msg.senderStyle ?? defaultSenderStyle

        return (
          <div key={msg.id}>
            {msg.timestampLabel && (
              <div
                style={{
                  textAlign: 'center',
                  color: 'var(--ig-secondary-text)',
                  fontSize: 30,
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
                isHeart={msg.isHeart}
                reaction={msg.reaction}
                senderStyle={style}
                isFirstInGroup={isFirstInGroup}
                isLastInGroup={isLastInGroup}
                convContainerRef={convContainerRef}
              />
            </div>
            {i === lastSenderIdx && deliveryStatus && (
              <DeliveryIndicator status={deliveryStatus} profile={profile} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function DeliveryIndicator({
  status,
  profile,
}: {
  status: DeliveryStatus
  profile: ProfileConfig
}) {
  return (
    <div
      className="flex items-center justify-end"
      style={{
        gap: 12,
        marginTop: 16,
        marginRight: 8,
        color: 'var(--ig-secondary-text)',
      }}
    >
      <span style={{ fontSize: 26, fontWeight: 400 }}>{status}</span>
      {status === 'Seen' && (
        <ContactAvatar imageDataUrl={profile.imageDataUrl} size={38} />
      )}
    </div>
  )
}
