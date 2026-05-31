import type { DMHeaderConfig, ProfileConfig } from '../../types'
import { ChevronLeft, FlagIcon, PhoneIcon, VerifiedBadgeIcon } from './icons'
import { ContactAvatar } from './ContactAvatar'

interface Props {
  header: DMHeaderConfig
  profile: ProfileConfig
}

/**
 * Instagram DM header — single horizontal row:
 * [chevron] [avatar+online dot] [name + verified ▾ + active status]   [notes] [phone] [flag]
 */
export function DMHeader({ header, profile }: Props) {
  const hasDisplayName = header.displayName.trim().length > 0

  // Resolve which secondary text (if any) to render below the primary name.
  // 'username' mode only makes sense when a separate displayName is set —
  // otherwise the username is already the primary line, so collapse to none.
  let secondaryText = ''
  if (header.secondLineMode === 'active') {
    secondaryText = header.activeStatus.trim()
  } else if (header.secondLineMode === 'username' && hasDisplayName) {
    secondaryText = header.username.trim()
  }
  const hasSecondary = secondaryText.length > 0

  return (
    <div
      className="flex items-center"
      style={{
        background: 'var(--ig-header-bg)',
        borderBottom: '1px solid var(--ig-header-border)',
        paddingLeft: 32,
        paddingRight: 40,
        paddingTop: 14,
        paddingBottom: 14,
        gap: 24,
        flexShrink: 0,
      }}
    >
      {/* Back chevron */}
      <div
        className="flex items-center"
        style={{ color: 'var(--ig-text)', flexShrink: 0 }}
      >
        <ChevronLeft size={72} />
      </div>

      {/* Avatar (with optional green online dot) */}
      <ContactAvatar
        imageDataUrl={profile.imageDataUrl}
        size={108}
        online={header.showActiveDot}
      />

      {/* Primary name + optional secondary line */}
      <div
        className="flex flex-col justify-center"
        style={{ flex: 1, minWidth: 0, gap: hasSecondary ? 4 : 0 }}
      >
        <NameLine
          text={hasDisplayName ? header.displayName : header.username}
          size={42}
          weight={700}
          color="var(--ig-text)"
          verified={header.verified}
          chevron
        />
        {hasSecondary && (
          <span
            style={{
              fontSize: 30,
              fontWeight: 400,
              color: 'var(--ig-secondary-text)',
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {secondaryText}
          </span>
        )}
      </div>

      {/* Phone + Flag — Instagram's DM header icons */}
      <div
        className="flex items-center"
        style={{ gap: 40, color: 'var(--ig-text)', flexShrink: 0 }}
      >
        <PhoneIcon size={56} />
        <FlagIcon size={56} />
      </div>
    </div>
  )
}

/**
 * One bold name row + optional verified badge + a small `›` chevron tail
 * (matches Instagram — tapping the name opens the profile).
 */
function NameLine({
  text,
  size,
  weight,
  color,
  verified,
  chevron,
}: {
  text: string
  size: number
  weight: number
  color: string
  verified: boolean
  chevron: boolean
}) {
  return (
    <div className="flex items-center" style={{ gap: 10, minWidth: 0 }}>
      <span
        style={{
          fontSize: size,
          fontWeight: weight,
          color,
          lineHeight: 1.1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          letterSpacing: -0.2,
        }}
      >
        {text}
      </span>
      {verified && <VerifiedBadgeIcon size={size * 0.82} />}
      {chevron && (
        <span
          aria-hidden
          style={{
            fontSize: size * 0.85,
            color: 'var(--ig-secondary-text)',
            fontWeight: 500,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ›
        </span>
      )}
    </div>
  )
}
