import type { Conversation } from '../../types'
import { ContactAvatar } from './ContactAvatar'
import { ChevronRight } from './icons'

interface Props {
  conversation: Conversation
}

// Layout constants — kept in sync with PhonePreview/index.tsx divider inset.
export const ROW_UNREAD_COL = 60
export const ROW_AVATAR_SIZE = 150
export const ROW_AVATAR_GAP = 32

export function ConversationRow({ conversation }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        paddingTop: 30,
        paddingBottom: 30,
        paddingRight: 52,
      }}
    >
      {/* Unread-dot column — always reserves space so rows align */}
      <div
        style={{
          width: ROW_UNREAD_COL,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          flexShrink: 0,
        }}
      >
        {conversation.unread && (
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              background: 'var(--ios-tint)',
            }}
          />
        )}
      </div>

      <ContactAvatar
        imageDataUrl={conversation.profileImageDataUrl}
        size={ROW_AVATAR_SIZE}
      />

      {/* Name + preview stack — grows to fill remaining space */}
      <div
        style={{
          flex: 1,
          marginLeft: ROW_AVATAR_GAP,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          alignSelf: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <span
            style={{
              fontSize: 47,
              fontWeight: conversation.unread ? 700 : 600,
              color: 'var(--ios-text)',
              letterSpacing: -0.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              lineHeight: 1.15,
            }}
          >
            {conversation.name}
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
              color: 'var(--ios-secondary-text)',
            }}
          >
            <span style={{ fontSize: 36, fontWeight: 400, letterSpacing: -0.1 }}>
              {conversation.timestamp}
            </span>
            <ChevronRight size={32} />
          </div>
        </div>
        <span
          style={{
            fontSize: 41,
            color: 'var(--ios-secondary-text)',
            fontWeight: 400,
            lineHeight: 1.25,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {conversation.lastMessage}
        </span>
      </div>
    </div>
  )
}
