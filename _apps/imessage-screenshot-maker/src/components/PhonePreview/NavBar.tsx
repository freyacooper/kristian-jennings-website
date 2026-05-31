import type { NavBarConfig, ProfileConfig } from '../../types'
import { ChevronLeft, FaceTimeIcon } from './icons'
import { ContactAvatar } from './ContactAvatar'

interface Props {
  navBar: NavBarConfig
  profile: ProfileConfig
}

/**
 * iOS 17 layout — chevron, avatar, and video icon share one horizontal axis.
 * The contact name + info chevron sit centered BELOW the avatar in a second
 * row. When the avatar is hidden, the name moves up into the icon row.
 */
export function NavBar({ navBar, profile }: Props) {
  const showBadge = navBar.unreadBadgeCount > 0
  const NameLabel = (
    <div className="flex items-center" style={{ gap: 6 }}>
      <span
        style={{
          fontSize: 48,
          color: 'var(--ios-text)',
          fontWeight: 600,
          textAlign: 'center',
          maxWidth: 560,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          lineHeight: 1.1,
          letterSpacing: -0.3,
        }}
      >
        {navBar.contactName}
      </span>
      <span
        aria-hidden
        style={{
          fontSize: 36,
          color: 'var(--ios-secondary-text)',
          fontWeight: 400,
          lineHeight: 1,
        }}
      >
        ›
      </span>
    </div>
  )

  return (
    <div
      className="flex flex-col"
      style={{
        paddingLeft: 52,
        paddingRight: 52,
        paddingTop: 12,
        paddingBottom: 24,
        flexShrink: 0,
      }}
    >
      {/* Row 1 — chevron | (avatar OR name fallback) | video icon */}
      <div
        className="grid items-center"
        style={{
          gridTemplateColumns: '1fr auto 1fr',
          columnGap: 16,
        }}
      >
        {/* Left: chevron + badge */}
        <div
          className="flex items-center"
          style={{
            gap: 0,
            color: 'var(--ios-bubble-sender)',
            justifySelf: 'start',
          }}
        >
          <ChevronLeft size={64} />
          {showBadge && (
            <span
              style={{
                background: 'var(--ios-bubble-sender)',
                color: 'white',
                borderRadius: 999,
                minWidth: 58,
                height: 58,
                paddingLeft: 14,
                paddingRight: 14,
                fontSize: 34,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              {navBar.unreadBadgeCount}
            </span>
          )}
        </div>

        {/* Center: avatar — or name if no avatar */}
        {profile.enabled ? (
          <ContactAvatar imageDataUrl={profile.imageDataUrl} size={140} />
        ) : (
          NameLabel
        )}

        {/* Right: filled video icon */}
        <div
          className="flex items-center"
          style={{
            color: 'var(--ios-bubble-sender)',
            justifySelf: 'end',
          }}
        >
          <FaceTimeIcon size={88} />
        </div>
      </div>

      {/* Row 2 — name + chevron under avatar (only when avatar visible) */}
      {profile.enabled && (
        <div className="flex justify-center" style={{ marginTop: 6 }}>
          {NameLabel}
        </div>
      )}
    </div>
  )
}
