import { ContactSilhouetteIcon } from './icons'

export function ContactAvatar({ imageDataUrl, size = 130 }: { imageDataUrl: string | null; size?: number }) {
  return (
    <div
      className="rounded-full overflow-hidden flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background: '#C7C7CC',
        flexShrink: 0,
      }}
    >
      {imageDataUrl ? (
        <img src={imageDataUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <ContactSilhouetteIcon size={size * 0.62} />
      )}
    </div>
  )
}
