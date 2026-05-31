import type { ChangeEvent, MouseEvent } from 'react'
import type { Conversation } from '../../types'
import { Field, Input, Row, Toggle } from './ui'

interface Props {
  conversations: Conversation[]
  add: () => void
  update: (id: string, patch: Partial<Conversation>) => void
  remove: (id: string) => void
  move: (id: string, dir: 'up' | 'down') => void
}

const TIMESTAMP_PRESETS = [
  '2:34 PM',
  '1:15 PM',
  'Yesterday',
  'Tuesday',
  'Monday',
  '12/5/24',
  'Now',
]

export function ConversationListEditor({ conversations, add, update, remove, move }: Props) {
  const handleUpload = (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update(id, { profileImageDataUrl: reader.result as string })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // Stop summary-toggle when clicking row-level action buttons.
  const stop = (e: MouseEvent) => e.preventDefault()

  return (
    <div className="flex flex-col gap-3">
      {conversations.map((conv, i) => (
        <details
          key={conv.id}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.5)',
            border: '1px solid var(--hairline)',
          }}
        >
          <summary className="px-3.5 py-2.5 cursor-pointer select-none flex items-center justify-between gap-2 list-none">
            <span className="kj-row-label truncate flex-1">
              {conv.name || 'Untitled'}
              {conv.unread && (
                <span
                  className="ml-2 inline-block w-2 h-2 rounded-full align-middle"
                  style={{ background: 'var(--accent)' }}
                />
              )}
            </span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                className="kj-iconbtn"
                onClick={(e) => { stop(e); move(conv.id, 'up') }}
                disabled={i === 0}
                title="Move up"
                aria-label="Move up"
              >↑</button>
              <button
                type="button"
                className="kj-iconbtn"
                onClick={(e) => { stop(e); move(conv.id, 'down') }}
                disabled={i === conversations.length - 1}
                title="Move down"
                aria-label="Move down"
              >↓</button>
              <button
                type="button"
                className="kj-iconbtn kj-iconbtn--danger"
                onClick={(e) => { stop(e); remove(conv.id) }}
                title="Delete"
                aria-label="Delete"
              >✕</button>
            </div>
          </summary>

          <div
            className="px-3.5 py-3.5 flex flex-col gap-3"
            style={{ borderTop: '1px solid var(--hairline)' }}
          >
            <Field label="Contact name">
              <Input
                value={conv.name}
                onChange={e => update(conv.id, { name: e.target.value })}
              />
            </Field>

            <Field label="Last message preview">
              <textarea
                value={conv.lastMessage}
                onChange={e => update(conv.id, { lastMessage: e.target.value })}
                rows={2}
                className="kj-input resize-y"
              />
            </Field>

            <Field label="Timestamp">
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {TIMESTAMP_PRESETS.map(opt => {
                  const isActive = conv.timestamp === opt
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update(conv.id, { timestamp: opt })}
                      className={`kj-chip ${isActive ? 'is-active' : ''}`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
              <Input
                value={conv.timestamp}
                onChange={e => update(conv.id, { timestamp: e.target.value })}
                placeholder="Or type custom…"
              />
            </Field>

            <Row label="Unread">
              <Toggle
                checked={conv.unread}
                onChange={v => update(conv.id, { unread: v })}
              />
            </Row>

            <Row label="Pinned">
              <Toggle
                checked={conv.pinned}
                onChange={v => update(conv.id, { pinned: v })}
              />
            </Row>

            <div className="flex items-center gap-3">
              {conv.profileImageDataUrl ? (
                <img
                  src={conv.profileImageDataUrl}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                  style={{ border: '1px solid var(--hairline)' }}
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
                  style={{
                    background: 'rgba(1, 31, 47, 0.06)',
                    color: 'var(--fg-3)',
                    border: '1px solid var(--hairline)',
                  }}
                >
                  ⌣
                </div>
              )}
              <label className="kj-btn cursor-pointer">
                {conv.profileImageDataUrl ? 'Replace' : 'Upload photo'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload(conv.id)}
                />
              </label>
              {conv.profileImageDataUrl && (
                <button
                  type="button"
                  className="kj-btn"
                  onClick={() => update(conv.id, { profileImageDataUrl: null })}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </details>
      ))}

      <button type="button" onClick={add} className="kj-btn-primary">
        + Add Conversation
      </button>
    </div>
  )
}
