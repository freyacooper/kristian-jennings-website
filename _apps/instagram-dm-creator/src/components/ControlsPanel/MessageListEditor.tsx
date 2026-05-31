import type { Message, MessageSender, SenderBubbleStyle } from '../../types'
import { Input } from './ui'

interface Props {
  messages: Message[]
  defaultSenderStyle: SenderBubbleStyle
  add: (sender: MessageSender) => void
  update: (id: string, patch: Partial<Message>) => void
  remove: (id: string) => void
  move: (id: string, dir: 'up' | 'down') => void
  setDefaultSenderStyle: (style: SenderBubbleStyle) => void
}

const TIMESTAMP_PRESETS = [
  '',
  'Today',
  'Today 2:34 PM',
  'Today 9:39 AM',
  'Yesterday',
  'Yesterday 8:12 PM',
  'Sunday',
  'Mon 3:15 PM',
  'March 5',
]

const REACTION_PRESETS = ['', '❤️', '😂', '😮', '😢', '😡', '👍', '🔥']

const INSTAGRAM_GRADIENT =
  'linear-gradient(180deg, #A33CD3 0%, #A33CD3 25%, #594DF0 60%, #594DF0 100%)'

/**
 * Resolve the style for a message — explicit override, or the global default.
 * Used to decide which colour swatch in the editor is "active".
 */
function effectiveStyle(msg: Message, def: SenderBubbleStyle): SenderBubbleStyle {
  return msg.senderStyle ?? def
}

export function MessageListEditor({
  messages,
  defaultSenderStyle,
  add,
  update,
  remove,
  move,
  setDefaultSenderStyle,
}: Props) {
  const defaultIdx = defaultSenderStyle.kind === 'gradient' ? 0 : 1
  return (
    <div className="flex flex-col gap-3">
      {/* Global default sender style — gradient vs solid */}
      <div
        className="flex flex-col gap-2.5 p-3.5 rounded-2xl"
        style={{
          background: 'rgba(0, 208, 211, 0.06)',
          border: '1px solid rgba(0, 208, 211, 0.2)',
        }}
      >
        <span className="kj-field-label" style={{ color: 'var(--accent-deep)' }}>
          Default sent-bubble style
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="kj-segmented"
            style={{ ['--cols' as string]: '2', ['--active' as string]: String(defaultIdx) }}
          >
            <button
              type="button"
              onClick={() => setDefaultSenderStyle({ kind: 'gradient' })}
              className={defaultSenderStyle.kind === 'gradient' ? 'is-active' : ''}
            >
              Gradient
            </button>
            <button
              type="button"
              onClick={() =>
                setDefaultSenderStyle({
                  kind: 'solid',
                  color:
                    defaultSenderStyle.kind === 'solid'
                      ? defaultSenderStyle.color
                      : '#3797F0',
                })
              }
              className={defaultSenderStyle.kind === 'solid' ? 'is-active' : ''}
            >
              Solid colour
            </button>
          </div>
          {defaultSenderStyle.kind === 'gradient' && (
            <span
              className="inline-block w-8 h-8 rounded-full"
              style={{ background: INSTAGRAM_GRADIENT, border: '1px solid var(--hairline)' }}
              aria-hidden="true"
            />
          )}
          {defaultSenderStyle.kind === 'solid' && (
            <input
              type="color"
              value={defaultSenderStyle.color}
              onChange={e =>
                setDefaultSenderStyle({ kind: 'solid', color: e.target.value })
              }
              className="w-10 h-8 rounded cursor-pointer"
              style={{ border: '1px solid var(--hairline)' }}
            />
          )}
        </div>
        <span className="kj-hint">
          Applies to all sent messages unless an individual message overrides it below.
        </span>
      </div>

      {messages.map((msg, i) => {
        const isSender = msg.sender === 'sender'
        const style = effectiveStyle(msg, defaultSenderStyle)
        const usesOverride = !!msg.senderStyle
        const senderIdx = isSender ? 0 : 1
        // Override segmented: 0=default, 1=gradient, 2=solid
        let overrideIdx = 0
        if (usesOverride) overrideIdx = style.kind === 'gradient' ? 1 : 2

        return (
          <div
            key={msg.id}
            className="flex flex-col gap-2.5 rounded-2xl p-3.5"
            style={{
              background: 'rgba(255, 255, 255, 0.5)',
              border: '1px solid var(--hairline)',
            }}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Sender / Receiver */}
                <div
                  className="kj-segmented"
                  style={{ ['--cols' as string]: '2', ['--active' as string]: String(senderIdx) }}
                >
                  <button
                    type="button"
                    onClick={() => update(msg.id, { sender: 'sender' })}
                    className={isSender ? 'is-active' : ''}
                  >
                    Sent
                  </button>
                  <button
                    type="button"
                    onClick={() => update(msg.id, { sender: 'receiver' })}
                    className={!isSender ? 'is-active' : ''}
                  >
                    Received
                  </button>
                </div>

                {/* Heart toggle */}
                <button
                  type="button"
                  onClick={() => update(msg.id, { isHeart: !msg.isHeart })}
                  className={`kj-chip ${msg.isHeart ? 'is-active' : ''}`}
                  title="Render as a standalone red heart (no bubble)"
                >
                  ❤️ Heart
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="kj-iconbtn"
                  onClick={() => move(msg.id, 'up')}
                  disabled={i === 0}
                  title="Move up"
                  aria-label="Move up"
                >↑</button>
                <button
                  type="button"
                  className="kj-iconbtn"
                  onClick={() => move(msg.id, 'down')}
                  disabled={i === messages.length - 1}
                  title="Move down"
                  aria-label="Move down"
                >↓</button>
                <button
                  type="button"
                  className="kj-iconbtn kj-iconbtn--danger"
                  onClick={() => remove(msg.id)}
                  title="Delete"
                  aria-label="Delete"
                >✕</button>
              </div>
            </div>

            {/* Text input (hidden for heart messages) */}
            {!msg.isHeart && (
              <textarea
                value={msg.text}
                onChange={e => update(msg.id, { text: e.target.value })}
                placeholder="Message text…"
                rows={2}
                className="kj-input resize-y"
              />
            )}

            {/* Per-message style override (sender bubbles only, not for heart) */}
            {isSender && !msg.isHeart && (
              <div className="flex flex-col gap-1.5">
                <span className="kj-field-label">Bubble style override</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <div
                    className="kj-segmented"
                    style={{
                      ['--cols' as string]: '3',
                      ['--active' as string]: String(overrideIdx),
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => update(msg.id, { senderStyle: undefined })}
                      className={!usesOverride ? 'is-active' : ''}
                    >
                      Default
                    </button>
                    <button
                      type="button"
                      onClick={() => update(msg.id, { senderStyle: { kind: 'gradient' } })}
                      className={usesOverride && style.kind === 'gradient' ? 'is-active' : ''}
                    >
                      Gradient
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        update(msg.id, {
                          senderStyle: {
                            kind: 'solid',
                            color: style.kind === 'solid' ? style.color : '#3797F0',
                          },
                        })
                      }
                      className={usesOverride && style.kind === 'solid' ? 'is-active' : ''}
                    >
                      Solid
                    </button>
                  </div>
                  {usesOverride && style.kind === 'gradient' && (
                    <span
                      className="inline-block w-7 h-7 rounded-full"
                      style={{ background: INSTAGRAM_GRADIENT, border: '1px solid var(--hairline)' }}
                      aria-hidden="true"
                    />
                  )}
                  {usesOverride && style.kind === 'solid' && (
                    <input
                      type="color"
                      value={style.color}
                      onChange={e =>
                        update(msg.id, {
                          senderStyle: { kind: 'solid', color: e.target.value },
                        })
                      }
                      className="w-8 h-7 rounded cursor-pointer"
                      style={{ border: '1px solid var(--hairline)' }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Reaction picker */}
            <div className="flex flex-col gap-1.5">
              <span className="kj-field-label">Reaction</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {REACTION_PRESETS.map(opt => {
                  const isActive = (msg.reaction || '') === opt
                  return (
                    <button
                      key={opt || 'none'}
                      type="button"
                      onClick={() => update(msg.id, { reaction: opt || undefined })}
                      className={`kj-chip ${isActive ? 'is-active' : ''}`}
                    >
                      {opt || 'None'}
                    </button>
                  )
                })}
                <Input
                  placeholder="Custom emoji"
                  value={msg.reaction || ''}
                  onChange={e => update(msg.id, { reaction: e.target.value || undefined })}
                  className="w-24"
                />
              </div>
            </div>

            {/* Timestamp divider */}
            <div className="flex flex-col gap-1.5">
              <span className="kj-field-label">Timestamp above this message</span>
              <div className="flex flex-wrap gap-1.5">
                {TIMESTAMP_PRESETS.map(opt => {
                  const isActive = (msg.timestampLabel || '') === opt
                  return (
                    <button
                      key={opt || 'none'}
                      type="button"
                      onClick={() =>
                        update(msg.id, { timestampLabel: opt || undefined })
                      }
                      className={`kj-chip ${isActive ? 'is-active' : ''}`}
                    >
                      {opt || 'None'}
                    </button>
                  )
                })}
              </div>
              <Input
                placeholder="Or type custom..."
                value={msg.timestampLabel || ''}
                onChange={e =>
                  update(msg.id, { timestampLabel: e.target.value || undefined })
                }
              />
            </div>
          </div>
        )
      })}

      <div className="flex gap-2">
        <button type="button" onClick={() => add('sender')} className="kj-btn flex-1">
          + Sent message
        </button>
        <button type="button" onClick={() => add('receiver')} className="kj-btn flex-1">
          + Received message
        </button>
      </div>

      <span className="kj-hint">
        Tip: toggle "Heart" on any message to render it as a standalone ❤️.
      </span>
    </div>
  )
}
