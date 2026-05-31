import type { Conversation } from '../../types'
import { ContactAvatar } from './ContactAvatar'

interface Props {
  conversations: Conversation[]
}

// iOS 17 caps pinned chats at 9 (3 per row). All pinned avatars render at
// the same fixed size regardless of count.
const MAX_PINS = 9
const PIN_SIZE = 220
const PIN_NAME_FONT = 30

export function PinnedChats({ conversations }: Props) {
  if (conversations.length === 0) return null
  const pins = conversations.slice(0, MAX_PINS)

  return (
    <div
      style={{
        paddingLeft: 52,
        paddingRight: 52,
        paddingTop: 8,
        paddingBottom: 28,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start',
          columnGap: 40,
          rowGap: 28,
        }}
      >
        {pins.map(conv => (
          <div
            key={conv.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              width: PIN_SIZE,
            }}
          >
            <ContactAvatar
              imageDataUrl={conv.profileImageDataUrl}
              size={PIN_SIZE}
            />
            <span
              style={{
                fontSize: PIN_NAME_FONT,
                fontWeight: 400,
                letterSpacing: -0.2,
                color: 'var(--ios-text)',
                maxWidth: PIN_SIZE + 30,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {conv.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
