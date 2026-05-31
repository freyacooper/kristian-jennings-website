interface IconProps {
  size?: number
}

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

export function ContactSilhouetteIcon({ size = 80 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff">
      <circle cx="12" cy="9" r="4.5" />
      <path d="M12 14c-4.4 0-8 3.2-8 7.2v.8h16v-.8c0-4-3.6-7.2-8-7.2z" />
    </svg>
  )
}

export function SearchIcon({ size = 42 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="20" y1="20" x2="16.6" y2="16.6" />
    </svg>
  )
}

export function ComposeIcon({ size = 72 }: IconProps) {
  // iOS 17 new-message glyph: square outline with a pencil overlapping the top-right corner.
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

export function MicIcon({ size = 48 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="2" width="6" height="13" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8" />
    </svg>
  )
}

export function ChevronRight({ size = 28 }: IconProps) {
  // Render small; height controls overall size, viewBox kept tight.
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
      <polyline points="1.5 2 11.5 12 1.5 22" />
    </svg>
  )
}
