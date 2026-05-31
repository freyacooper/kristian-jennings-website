import type { DMHeaderConfig, ProfileConfig, ProfileIntroConfig } from '../../types'
import { ContactAvatar } from './ContactAvatar'
import { VerifiedBadgeIcon } from './icons'

interface Props {
  header: DMHeaderConfig
  profile: ProfileConfig
  intro: ProfileIntroConfig
}

/**
 * "New conversation" intro card rendered above the first message — Instagram
 * shows this the first time you open a thread with someone. Large centred
 * avatar + name + stats + relationship + optional business-chat link +
 * "View profile" button.
 */
export function ProfileIntro({ header, profile, intro }: Props) {
  const hasDisplayName = header.displayName.trim().length > 0
  const primaryName = hasDisplayName ? header.displayName : header.username

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: 60,
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 24,
        color: 'var(--ig-text)',
      }}
    >
      <ContactAvatar
        imageDataUrl={profile.imageDataUrl}
        size={200}
        online={header.showActiveDot}
      />

      {/* Primary name (display name OR username) + verified badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginTop: 32,
          maxWidth: '100%',
        }}
      >
        <span
          style={{
            fontSize: 58,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -0.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {primaryName}
        </span>
        {header.verified && <VerifiedBadgeIcon size={50} />}
      </div>

      {/* Secondary username line — only when displayName is set */}
      {hasDisplayName && (
        <div
          style={{
            fontSize: 38,
            fontWeight: 400,
            color: 'var(--ig-secondary-text)',
            lineHeight: 1.15,
            marginTop: 2,
          }}
        >
          {header.username}
        </div>
      )}

      {/* Stats */}
      <div
        style={{
          fontSize: 36,
          fontWeight: 400,
          color: 'var(--ig-secondary-text)',
          lineHeight: 1.15,
          marginTop: 8,
        }}
      >
        {intro.followersCount} followers · {intro.postsCount} posts
      </div>

      {/* Relationship line */}
      {intro.relationshipText.trim() && (
        <div
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: 'var(--ig-secondary-text)',
            lineHeight: 1.15,
            marginTop: 2,
            maxWidth: 880,
          }}
        >
          {intro.relationshipText}
        </div>
      )}

      {/* Mutual follows line */}
      {intro.mutualFollowsText.trim() && (
        <div
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: 'var(--ig-secondary-text)',
            lineHeight: 1.15,
            marginTop: 2,
            maxWidth: 880,
          }}
        >
          {intro.mutualFollowsText}
        </div>
      )}

      {/* Facebook-blue business-chat link */}
      {intro.showBusinessChatLink && (
        <div
          style={{
            fontSize: 38,
            fontWeight: 600,
            color: '#1877F2',
            lineHeight: 1.15,
            marginTop: 14,
          }}
        >
          Learn about business chats
        </div>
      )}

      {/* View profile pill button */}
      <div
        style={{
          marginTop: 18,
          background: 'var(--ig-bubble-receiver)',
          color: 'var(--ig-text)',
          borderRadius: 12,
          paddingLeft: 38,
          paddingRight: 38,
          paddingTop: 8,
          paddingBottom: 8,
          fontSize: 36,
          fontWeight: 600,
        }}
      >
        View profile
      </div>
    </div>
  )
}
