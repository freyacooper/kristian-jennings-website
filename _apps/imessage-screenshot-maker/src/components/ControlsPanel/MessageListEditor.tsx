import type { Message, MessageSender } from '../../types'
import { Field, Input } from './ui'

interface Props {
  messages: Message[]
  deliveryStatus: string
  add: (sender: MessageSender) => void
  update: (id: string, patch: Partial<Message>) => void
  remove: (id: string) => void
  move: (id: string, dir: 'up' | 'down') => void
  setDelivery: (s: string) => void
}

const TIMESTAMP_PRESETS = [
  '',
  'Today',
  'Today 9:39 AM',
  'Yesterday',
  'Yesterday 9:39 AM',
  'Sunday',
  'Sunday 11:23 AM',
  'March 5',
  'March 5, 2024',
]
const DELIVERY_PRESETS = ['', 'Sent', 'Delivered', 'Read 9:39 AM']

export function MessageListEditor({
  messages,
  deliveryStatus,
  add,
  update,
  remove,
  move,
  setDelivery,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg, i) => {
        const isGreen = msg.color === 'green'
        const senderIdx = msg.sender === 'sender' ? 0 : 1
        const colorIdx = !isGreen ? 0 : 1
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
                {/* Sender / receiver segmented toggle */}
                <div
                  className="kj-segmented"
                  style={{ ['--cols' as string]: '2', ['--active' as string]: String(senderIdx) }}
                >
                  <button
                    type="button"
                    onClick={() => update(msg.id, { sender: 'sender' })}
                    className={msg.sender === 'sender' ? 'is-active' : ''}
                  >
                    Sent
                  </button>
                  <button
                    type="button"
                    onClick={() => update(msg.id, { sender: 'receiver' })}
                    className={msg.sender === 'receiver' ? 'is-active' : ''}
                  >
                    Received
                  </button>
                </div>

                {/* Color toggle — only applies to sender messages */}
                {msg.sender === 'sender' && (
                  <div
                    className="kj-segmented"
                    style={{ ['--cols' as string]: '2', ['--active' as string]: String(colorIdx) }}
                  >
                    <button
                      type="button"
                      onClick={() => update(msg.id, { color: 'blue' })}
                      title="iMessage (blue)"
                      className={!isGreen ? 'is-active' : ''}
                    >
                      Blue
                    </button>
                    <button
                      type="button"
                      onClick={() => update(msg.id, { color: 'green' })}
                      title="SMS (green)"
                      className={isGreen ? 'is-active' : ''}
                    >
                      Green
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="kj-iconbtn"
                  onClick={() => move(msg.id, 'up')}
                  disabled={i === 0}
                  title="Move up"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="kj-iconbtn"
                  onClick={() => move(msg.id, 'down')}
                  disabled={i === messages.length - 1}
                  title="Move down"
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="kj-iconbtn kj-iconbtn--danger"
                  onClick={() => remove(msg.id)}
                  title="Delete"
                  aria-label="Delete"
                >
                  ✕
                </button>
              </div>
            </div>

            <textarea
              value={msg.text}
              onChange={e => update(msg.id, { text: e.target.value })}
              placeholder="Message text…"
              rows={2}
              className="kj-input resize-y"
            />
            <div className="flex flex-col gap-1.5">
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
                placeholder="Or type custom timestamp…"
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

      <Field
        label="Delivery status"
        hint="Shown under your last sent message. Pick a preset or type custom."
      >
        <div className="flex flex-wrap gap-1.5">
          {DELIVERY_PRESETS.map(opt => {
            const isActive = deliveryStatus === opt
            return (
              <button
                key={opt || 'none'}
                type="button"
                onClick={() => setDelivery(opt)}
                className={`kj-chip ${isActive ? 'is-active' : ''}`}
              >
                {opt || 'None'}
              </button>
            )
          })}
        </div>
        <Input
          value={deliveryStatus}
          placeholder="Or type custom…"
          onChange={e => setDelivery(e.target.value)}
        />
      </Field>
    </div>
  )
}
