import { ComposeIcon } from './icons'

interface Props {
  /** When true, render the compact title (small "Messages" centered between
   * Edit and Compose). Used when pinned chats are present and iOS collapses
   * the large title to make room. */
  compact: boolean
}

const PAD_X = 52

/**
 * iOS 17 Messages inbox header.
 *
 * Expanded form (no pins): Row 1 = Edit (left) / Compose (right); Row 2 =
 * large bold "Messages" title, left-aligned.
 *
 * Compact form (with pins): single row = Edit | "Messages" centered | Compose.
 */
export function InboxHeader({ compact }: Props) {
  if (compact) {
    return (
      <div
        style={{
          paddingLeft: PAD_X,
          paddingRight: PAD_X,
          paddingTop: 4,
          paddingBottom: 12,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            height: 90,
          }}
        >
          <span
            style={{
              fontSize: 47,
              fontWeight: 400,
              letterSpacing: -0.2,
              color: 'var(--ios-tint)',
              justifySelf: 'start',
            }}
          >
            Edit
          </span>
          <span
            style={{
              fontSize: 47,
              fontWeight: 600,
              letterSpacing: -0.3,
              color: 'var(--ios-text)',
              justifySelf: 'center',
            }}
          >
            Messages
          </span>
          <span
            style={{
              color: 'var(--ios-tint)',
              justifySelf: 'end',
              display: 'inline-flex',
            }}
          >
            <ComposeIcon size={78} />
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        paddingLeft: PAD_X,
        paddingRight: PAD_X,
        paddingTop: 4,
        paddingBottom: 8,
        flexShrink: 0,
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ height: 90, color: 'var(--ios-tint)' }}
      >
        <span
          style={{
            fontSize: 47,
            fontWeight: 400,
            letterSpacing: -0.2,
            color: 'var(--ios-tint)',
          }}
        >
          Edit
        </span>
        <ComposeIcon size={78} />
      </div>
      <h1
        style={{
          fontSize: 100,
          fontWeight: 700,
          letterSpacing: -1.8,
          color: 'var(--ios-text)',
          margin: 0,
          marginTop: 4,
          lineHeight: 1.05,
        }}
      >
        Messages
      </h1>
    </div>
  )
}
