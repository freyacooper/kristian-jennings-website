import type { ProfileIntroConfig } from '../../types'
import { Field, Input, Row, Toggle } from './ui'

interface Props {
  intro: ProfileIntroConfig
  update: (patch: Partial<ProfileIntroConfig>) => void
}

const RELATIONSHIP_PRESETS = [
  "You've followed this Instagram account since 2026",
  "You've been following each other since 2024",
  'You don\'t follow each other on Instagram',
  '',
]

/**
 * Sub-options for the conversation-start intro. The master enable toggle
 * lives in TogglesControls (Preview section); this component renders only
 * the editable fields and is itself conditionally rendered.
 */
export function ProfileIntroControls({ intro, update }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Followers">
          <Input
            value={intro.followersCount}
            onChange={e => update({ followersCount: e.target.value })}
            placeholder="121K"
          />
        </Field>
        <Field label="Posts">
          <Input
            value={intro.postsCount}
            onChange={e => update({ postsCount: e.target.value })}
            placeholder="315"
          />
        </Field>
      </div>

      <Field label="Relationship line" hint="Empty to hide.">
        <div className="flex flex-wrap gap-1.5 mb-1">
          {RELATIONSHIP_PRESETS.map(opt => {
            const isActive = intro.relationshipText === opt
            return (
              <button
                key={opt || 'none'}
                type="button"
                onClick={() => update({ relationshipText: opt })}
                className={`kj-chip ${isActive ? 'is-active' : ''}`}
              >
                {opt ? opt.slice(0, 18) + (opt.length > 18 ? '…' : '') : 'Hidden'}
              </button>
            )
          })}
        </div>
        <Input
          value={intro.relationshipText}
          onChange={e => update({ relationshipText: e.target.value })}
          placeholder="Or type custom..."
        />
      </Field>

      <Field
        label="Mutual follows line"
        hint='e.g. "You both follow username". Empty to hide.'
      >
        <Input
          value={intro.mutualFollowsText}
          onChange={e => update({ mutualFollowsText: e.target.value })}
          placeholder="You both follow ..."
        />
      </Field>

      <Row label="Show 'Learn about business chats' link">
        <Toggle
          checked={intro.showBusinessChatLink}
          onChange={v => update({ showBusinessChatLink: v })}
        />
      </Row>

      <p className="kj-hint">
        Verified badge + avatar + name + username come from the DM Header and
        Profile picture sections.
      </p>
    </div>
  )
}
