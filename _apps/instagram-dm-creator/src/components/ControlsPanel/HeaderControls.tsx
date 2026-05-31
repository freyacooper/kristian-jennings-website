import type { DMHeaderConfig, DMHeaderSecondLine } from '../../types'
import { Field, Input, Row, Toggle } from './ui'

interface Props {
  header: DMHeaderConfig
  update: (patch: Partial<DMHeaderConfig>) => void
}

const ACTIVE_PRESETS = [
  'Active now',
  'Active 1m ago',
  'Active 2h ago',
  'Active today',
  'Active yesterday',
]

const SECOND_LINE_MODES: { value: DMHeaderSecondLine; label: string }[] = [
  { value: 'active', label: 'Active status' },
  { value: 'username', label: 'Username' },
  { value: 'none', label: 'Hidden' },
]

export function HeaderControls({ header, update }: Props) {
  const modeIdx = SECOND_LINE_MODES.findIndex(m => m.value === header.secondLineMode)
  return (
    <>
      <Field label="Username">
        <Input
          value={header.username}
          onChange={e => update({ username: e.target.value })}
        />
      </Field>
      <Field
        label="Display name"
        hint="Optional. Shown as the bold name when set; username moves to the secondary line option."
      >
        <Input
          value={header.displayName}
          onChange={e => update({ displayName: e.target.value })}
          placeholder="e.g. Sarah Designs"
        />
      </Field>

      <Field label="Under name" hint="What appears below the bold name in the header.">
        <div
          className="kj-segmented w-fit"
          style={{ ['--cols' as string]: '3', ['--active' as string]: String(modeIdx) }}
        >
          {SECOND_LINE_MODES.map(mode => (
            <button
              key={mode.value}
              type="button"
              onClick={() => update({ secondLineMode: mode.value })}
              className={header.secondLineMode === mode.value ? 'is-active' : ''}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </Field>

      {header.secondLineMode === 'active' && (
        <Field label="Active status text">
          <div className="flex flex-wrap gap-1.5 mb-1">
            {ACTIVE_PRESETS.map(opt => {
              const isActive = header.activeStatus === opt
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => update({ activeStatus: opt })}
                  className={`kj-chip ${isActive ? 'is-active' : ''}`}
                >
                  {opt}
                </button>
              )
            })}
          </div>
          <Input
            value={header.activeStatus}
            placeholder="Or type custom..."
            onChange={e => update({ activeStatus: e.target.value })}
          />
        </Field>
      )}

      <Row label="Green online dot on avatar">
        <Toggle
          checked={header.showActiveDot}
          onChange={v => update({ showActiveDot: v })}
        />
      </Row>
      <Row label="Verified badge">
        <Toggle
          checked={header.verified}
          onChange={v => update({ verified: v })}
        />
      </Row>
    </>
  )
}
