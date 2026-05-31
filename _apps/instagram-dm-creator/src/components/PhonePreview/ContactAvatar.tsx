import { ContactSilhouetteIcon } from './icons'

interface Props {
  imageDataUrl: string | null
  size?: number
  /** When true, render the green online dot at the bottom-right of the avatar. */
  online?: boolean
}

export function ContactAvatar({ imageDataUrl, size = 130, online = false }: Props) {
  const dotSize = size * 0.32
  // Ring around the dot punches it out of the avatar visually. Uses the
  // header background so the ring looks like the underlying surface.
  const ringWidth = Math.max(size * 0.05, 3)

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div
        className="rounded-full overflow-hidden flex items-center justify-center"
        style={{
          width: size,
          height: size,
          background: '#C7C7CC',
        }}
      >
        {imageDataUrl ? (
          <img
            src={imageDataUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <ContactSilhouetteIcon size={size * 0.62} />
        )}
      </div>

      {online && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: 'var(--ig-active-dot)',
            border: `${ringWidth}px solid var(--ig-header-bg)`,
            boxSizing: 'border-box',
          }}
        />
      )}
    </div>
  )
}
