import type { UserConfig } from '../../types'
import { ChevronDown, ChevronLeft, ComposeIcon, VerifiedBadgeIcon } from './icons'

interface Props {
  user: UserConfig
}

const PAD_X = 52

/**
 * Instagram DM inbox header — single row:
 *   [chevron-left] [username + ▾]   [compose-icon]
 */
export function InboxHeader({ user }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
        paddingTop: 18,
        paddingBottom: 18,
        background: 'var(--ig-header-bg)',
        color: 'var(--ig-text)',
        flexShrink: 0,
      }}
    >
      <span style={{ flexShrink: 0, display: 'inline-flex' }}>
        <ChevronLeft size={72} />
      </span>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <span
          style={{
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: -0.4,
            color: 'var(--ig-text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.1,
          }}
        >
          {user.username}
        </span>
        {user.verified && (
          <span style={{ flexShrink: 0, display: 'inline-flex' }}>
            <VerifiedBadgeIcon size={42} />
          </span>
        )}
        <span style={{ flexShrink: 0, display: 'inline-flex' }}>
          <ChevronDown size={32} />
        </span>
      </div>

      <span style={{ flexShrink: 0, display: 'inline-flex' }}>
        <ComposeIcon size={84} />
      </span>
    </div>
  )
}
