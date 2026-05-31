import { ContactSilhouetteIcon } from './icons'

interface Props {
  imageDataUrl: string | null
  size?: number
  /** When true, renders the green active-now dot at the bottom-right of the avatar. */
  active?: boolean
}

export function ContactAvatar({ imageDataUrl, size = 150, active = false }: Props) {
  const dotSize = size * 0.28
  // Ring width punches the dot out of the avatar — uses the page bg as the ring colour.
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

      {active && (
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
            border: `${ringWidth}px solid var(--ig-bg)`,
            boxSizing: 'border-box',
          }}
        />
      )}
    </div>
  )
}
