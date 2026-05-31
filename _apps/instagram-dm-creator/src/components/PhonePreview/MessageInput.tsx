import { ChatBubbleIcon, GalleryIcon, InstagramCameraIcon, MicIcon, PlusCircleIcon } from './icons'

interface Props {
  /** When true, render an iOS home indicator below the input bar. */
  withHomeIndicator?: boolean
}

/**
 * Instagram DM input bar — the whole thing is a single rounded pill:
 *   [purple camera circle] Message...      [mic] [gallery] [chat] [+]
 * The camera button sits flush with the left edge; placeholder text and
 * inline icons sit directly on the pill background (no nested input field).
 */
export function MessageInput({ withHomeIndicator = false }: Props) {
  return (
    <div
      className="flex flex-col"
      style={{ background: 'var(--ig-input-bg)', flexShrink: 0 }}
    >
      <div
        className="flex items-center"
        style={{
          background: 'var(--ig-input-pill-bg)',
          borderRadius: 999,
          marginLeft: 22,
          marginRight: 22,
          marginTop: 14,
          marginBottom: 14,
          paddingLeft: 14,
          paddingRight: 36,
          paddingTop: 12,
          paddingBottom: 12,
          gap: 22,
        }}
      >
        {/* Camera button — full SVG (includes its own coloured circle, so
            no wrapping div needed). */}
        <div style={{ flexShrink: 0, lineHeight: 0 }}>
          <InstagramCameraIcon size={92} />
        </div>

        {/* Placeholder text sits directly on the pill bg */}
        <span
          style={{
            flex: 1,
            color: 'var(--ig-input-placeholder)',
            fontSize: 42,
            fontWeight: 400,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          Message...
        </span>

        {/* Inline icon trio (mic + gallery + chat + plus) */}
        <div
          className="flex items-center"
          style={{ gap: 28, color: 'var(--ig-text)', flexShrink: 0 }}
        >
          <MicIcon size={40} />
          <GalleryIcon size={42} />
          <ChatBubbleIcon size={40} />
          <PlusCircleIcon size={40} />
        </div>
      </div>

      {withHomeIndicator && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 8,
            paddingBottom: 14,
          }}
        >
          <div
            style={{
              width: 380,
              height: 9,
              background: 'var(--ig-text)',
              borderRadius: 6,
              opacity: 0.9,
            }}
          />
        </div>
      )}
    </div>
  )
}
