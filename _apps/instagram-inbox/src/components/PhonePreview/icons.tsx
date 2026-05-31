interface IconProps {
  size?: number
}

/* ============ Status bar ============ */

export function WifiIcon({ size = 64 }: IconProps) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 24 18.7" fill="currentColor">
      <path d="M12 13.5a2.4 2.4 0 100 4.8 2.4 2.4 0 000-4.8z" />
      <path d="M12 8.4c-2.6 0-5 1.1-6.7 2.9l2 2c1.2-1.2 2.85-2 4.7-2s3.5.8 4.7 2l2-2A9.4 9.4 0 0012 8.4z" />
      <path d="M12 3.1C7.8 3.1 4 4.7 1.2 7.5l2 2C5.4 7.3 8.5 6 12 6s6.6 1.3 8.8 3.5l2-2A14 14 0 0012 3.1z" />
    </svg>
  )
}

export function BatteryIcon({
  percent,
  showPercent,
  size = 84,
}: {
  percent: number
  showPercent: boolean
  size?: number
}) {
  const fillW = (Math.max(0, Math.min(100, percent)) / 100) * 38
  const lowBattery = percent <= 20
  return (
    <div className="flex items-center" style={{ gap: 8 }}>
      {showPercent && (
        <span style={{ fontSize: 32, fontWeight: 500, color: 'currentColor' }}>
          {percent}%
        </span>
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

/* ============ Header ============ */

export function ChevronLeft({ size = 44 }: IconProps) {
  return (
    <svg
      width={size * (13 / 24)}
      height={size}
      viewBox="0 0 13 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="11.5 22 1.5 12 11.5 2" />
    </svg>
  )
}

/** Small downward chevron next to the username — indicates account switcher. */
export function ChevronDown({ size = 32 }: IconProps) {
  return (
    <svg
      width={size}
      height={size * (13 / 24)}
      viewBox="0 0 24 13"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="2 1.5 12 11.5 22 1.5" />
    </svg>
  )
}

/** New-message square-with-pen glyph. Used in the inbox header (top right). */
export function ComposeIcon({ size = 72 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 13.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5.5" />
      <path d="m17.4 3.6 3 3-9 9H8.4v-3z" />
    </svg>
  )
}

/* ============ Row icons ============ */

/** Small outline camera — appears on the far right of every conversation row. */
export function CameraIcon({ size = 56 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.8l1.4-2h6.6l1.4 2h1.8A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-9z" />
      <circle cx="12" cy="13" r="3.6" />
    </svg>
  )
}

/* ============ Bottom tab bar ============ */

export function HomeIcon({ size = 80 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11 12 3l9 8v9.5a1 1 0 0 1-1 1h-5.5V15h-5v6.5H4a1 1 0 0 1-1-1V11z" />
    </svg>
  )
}

export function SearchIcon({ size = 80 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="20" y1="20" x2="16.6" y2="16.6" />
    </svg>
  )
}

/** Instagram Reels clapperboard glyph (rotated rectangle with diagonal lines + triangle). */
export function ReelsIcon({ size = 80 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M3 8h6L5.5 3" />
      <path d="M9 8 15 3" />
      <path d="M15 8 21 3" />
      <path d="M10.5 10.5 16 13l-5.5 2.5z" fill="currentColor" />
    </svg>
  )
}

/** Paper-airplane / Direct Messages glyph. Filled when active. */
export function DMsIcon({ size = 80, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.5 3 2.5 10.2l7.4 2.6 2.6 7.7 9-17.5z" />
      {!filled && <path d="M9.9 12.8 21.5 3" />}
    </svg>
  )
}

/* ============ Verified badge ============ */

/**
 * Instagram's verified blue badge — scalloped circle with a white checkmark.
 * 12-fold symmetric scallop generated from 12 outer + 12 inner vertices.
 */
export function VerifiedBadgeIcon({ size = 32 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 1 L14.46 2.82 L17.5 2.47 L18.72 5.28 L21.53 6.5 L21.18 9.54 L23 12 L21.18 14.46 L21.53 17.5 L18.72 18.72 L17.5 21.53 L14.46 21.18 L12 23 L9.54 21.18 L6.5 21.53 L5.28 18.72 L2.47 17.5 L2.82 14.46 L1 12 L2.82 9.54 L2.47 6.5 L5.28 5.28 L6.5 2.47 L9.54 2.82 Z"
        fill="#3897F0"
      />
      <path
        d="M7.5 12 L10.5 15 L16.5 9"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

/* ============ Default silhouette avatar ============ */

export function ContactSilhouetteIcon({ size = 80 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff">
      <circle cx="12" cy="9" r="4.5" />
      <path d="M12 14c-4.4 0-8 3.2-8 7.2v.8h16v-.8c0-4-3.6-7.2-8-7.2z" />
    </svg>
  )
}
