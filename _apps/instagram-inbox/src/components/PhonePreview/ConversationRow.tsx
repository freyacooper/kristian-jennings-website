import type { Conversation } from '../../types'
import { ContactAvatar } from './ContactAvatar'
import { CameraIcon, VerifiedBadgeIcon } from './icons'

interface Props {
  conversation: Conversation
}

export const ROW_AVATAR_SIZE = 150
export const ROW_AVATAR_GAP = 36
export const ROW_PAD_X = 36

export function ConversationRow({ conversation }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: ROW_PAD_X,
        paddingRight: ROW_PAD_X,
        paddingTop: 22,
        paddingBottom: 22,
        gap: ROW_AVATAR_GAP,
      }}
    >
      <ContactAvatar
        imageDataUrl={conversation.profileImageDataUrl}
        size={ROW_AVATAR_SIZE}
        active={conversation.activeNow}
      />

      {/* Username + last-message · timestamp */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span
            style={{
              fontSize: 42,
              fontWeight: conversation.unread ? 700 : 400,
              color: 'var(--ig-text)',
              letterSpacing: -0.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.15,
            }}
          >
            {conversation.username}
          </span>
          {conversation.verified && (
            <span style={{ flexShrink: 0, display: 'inline-flex' }}>
              <VerifiedBadgeIcon size={34} />
            </span>
          )}
        </div>
        <span
          style={{
            fontSize: 36,
            color: 'var(--ig-secondary-text)',
            fontWeight: 400,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.2,
          }}
        >
          {conversation.lastMessage}
          {conversation.timestamp && (
            <>
              <span style={{ margin: '0 8px' }}>·</span>
              {conversation.timestamp}
            </>
          )}
        </span>
      </div>

      {/* Right side: unread dot (when unread) + camera */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          color: 'var(--ig-secondary-text)',
        }}
      >
        {conversation.unread && (
          <div
            aria-hidden
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              background: 'var(--ig-unread-dot)',
            }}
          />
        )}
        <CameraIcon size={68} />
      </div>
    </div>
  )
}
