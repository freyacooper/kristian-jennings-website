interface IconProps { size?: number }

export function ChevronLeft({ size = 44 }: IconProps) {
  // `size` here means the rendered HEIGHT — viewBox is tightened to hug the
  // chevron content (90° angle → width:height ratio = ~1:2). No internal
  // padding around the strokes.
  return (
    <svg
      width={size * (13 / 24)}
      height={size}
      viewBox="0 0 13 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="11.5 22 1.5 12 11.5 2" />
    </svg>
  )
}

export function WifiIcon({ size = 64 }: IconProps) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 24 18.7" fill="currentColor">
      {/* Bottom dot */}
      <path d="M12 13.5a2.4 2.4 0 100 4.8 2.4 2.4 0 000-4.8z" />
      {/* Middle arc — thicker band */}
      <path d="M12 8.4c-2.6 0-5 1.1-6.7 2.9l2 2c1.2-1.2 2.85-2 4.7-2s3.5.8 4.7 2l2-2A9.4 9.4 0 0012 8.4z" />
      {/* Outer arc — thicker band */}
      <path d="M12 3.1C7.8 3.1 4 4.7 1.2 7.5l2 2C5.4 7.3 8.5 6 12 6s6.6 1.3 8.8 3.5l2-2A14 14 0 0012 3.1z" />
    </svg>
  )
}

export function BatteryIcon({ percent, showPercent, size = 84 }: { percent: number; showPercent: boolean; size?: number }) {
  const fillW = Math.max(0, Math.min(100, percent)) / 100 * 38
  const lowBattery = percent <= 20
  return (
    <div className="flex items-center" style={{ gap: 8 }}>
      {showPercent && (
        <span style={{ fontSize: 32, fontWeight: 500, color: 'currentColor' }}>{percent}%</span>
      )}
      <svg width={size * 1.05} height={size * 0.5} viewBox="0 0 50 24" fill="none">
        <rect x="1" y="1" width="44" height="22" rx="6" ry="6" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
        <rect x="46" y="8" width="3" height="8" rx="1.5" fill="currentColor" opacity="0.45" />
        <rect x="3" y="3" width={fillW} height="18" rx="4" fill={lowBattery ? '#FF3B30' : 'currentColor'} />
      </svg>
    </div>
  )
}

export function SignalBars({ filled }: { filled: number }) {
  const heights = [18, 26, 34, 42]
  return (
    <div className="flex items-end" style={{ gap: 4 }}>
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: h,
            borderRadius: 3,
            background: 'currentColor',
            opacity: i < filled ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  )
}

export function FaceTimeIcon({ size = 56 }: IconProps) {
  // Two separate shapes — triangle drawn FIRST so it sits behind, with its
  // apex extending inside the rectangle area. The rectangle is drawn on top
  // with a background fill so it covers (cuts off) the triangle's apex.
  return (
    <svg
      width={size}
      height={size * 0.62}
      viewBox="0 0 47 29"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* Lens triangle — visible width ~11.5; corner radius ~3. */}
      <path d="M 26 14.5 L 40.4 5.6 Q 43 4 43 7 L 43 22 Q 43 25 40.4 23.4 Z" />
      {/* Camera body — filled with header bg to hide the triangle's apex */}
      <rect
        x="1.5"
        y="2"
        width="30"
        height="25"
        rx="6"
        fill="var(--ios-header-bg)"
      />
    </svg>
  )
}

export function InfoIcon({ size = 56 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="22" cy="22" r="18" />
      <circle cx="22" cy="13.5" r="1.5" fill="currentColor" stroke="none" />
      <line x1="22" y1="19" x2="22" y2="32" strokeLinecap="round" strokeWidth="2.3" />
    </svg>
  )
}

export function PlusIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="6" x2="12" y2="18" />
      <line x1="6" y1="12" x2="18" y2="12" />
    </svg>
  )
}

export function CameraIcon({ size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M5 13h6l3-4h12l3 4h6v18H5V13z" />
      <circle cx="20" cy="22" r="6" />
    </svg>
  )
}

export function AppsIcon({ size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="currentColor">
      <circle cx="11" cy="11" r="3" />
      <circle cx="20" cy="11" r="3" />
      <circle cx="29" cy="11" r="3" />
      <circle cx="11" cy="20" r="3" />
      <circle cx="20" cy="20" r="3" />
      <circle cx="29" cy="20" r="3" />
      <circle cx="11" cy="29" r="3" />
      <circle cx="20" cy="29" r="3" />
      <circle cx="29" cy="29" r="3" />
    </svg>
  )
}

export function GlobeIcon({ size = 36 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <ellipse cx="12" cy="12" rx="4" ry="10" />
    </svg>
  )
}

export function MicIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="13" rx="3" />
      <path d="M5 11a7 7 0 0014 0M12 18v4M8 22h8" />
    </svg>
  )
}

export function ContactSilhouetteIcon({ size = 80 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff">
      <circle cx="12" cy="9" r="4.5" />
      <path d="M12 14c-4.4 0-8 3.2-8 7.2v.8h16v-.8c0-4-3.6-7.2-8-7.2z" />
    </svg>
  )
}
