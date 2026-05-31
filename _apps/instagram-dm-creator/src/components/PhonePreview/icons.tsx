interface IconProps { size?: number }

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

/** Flag (report / save) icon — user-provided SVG (Asset 7). */
export function FlagIcon({ size = 64 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 68.09 82.29"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M67.63,50.04c.59,1.19.56,3.18.11,4.13-.4.84-1.95,1.92-3.25,1.92H12.22c-1.56.01-4.43.95-4.47,2.82l-.41,20.49c-.03,1.63-2.78,3.06-4.04,2.87C1.67,82.04,0,80.37,0,78.23L.02,3.53C.02,1.64,1.93-.04,3.56,0c2.73.07,4.13,2.7,4.18,5.09,2.48-1.01,4.12-1.28,6.39-1.28h49.35c1.62,0,3.25.34,4.03,1.45.68.96.79,3.13.2,4.32l-9.28,18.77c-.34.68-.34,2.42,0,3.09l9.2,18.6ZM58.54,48.33l-7.54-15.38c-1.78-1.98-1.09-4.09-.09-6.12l7.76-15.58H12.79c-2.41,0-5.18,2.74-5.18,5.13l-.03,32.9,4.54-.56,40.39.02,6.05-.42Z" />
    </svg>
  )
}

/**
 * Instagram's verified blue badge — scalloped circle with a white check.
 * Rendered next to a username/display name.
 */
export function VerifiedBadgeIcon({ size = 32 }: IconProps) {
  // 24-point scalloped polygon — alternating outer / inner vertices around
  // the centre at (12, 12). Generated from 12 outer points at radius 11 and
  // 12 inner points at radius 9.5, every 15°. Result: perfectly square,
  // 12-fold symmetric badge (matches Instagram's geometry).
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

/** Phone handset icon — user-provided SVG (Asset 6). */
export function PhoneIcon({ size = 64 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 82.3 82.15"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M60.2,46.96c7.6,2.74,17.59,9.58,21.12,15.84,2.15,3.82.5,7.75-2.16,10.68-6.89,7.58-9.65,10.09-21.38,7.91-9.45-1.75-17.79-6.17-25.45-11.98-11.5-8.72-21.08-19.42-27.47-32.35C1.71,30.7.27,24.34.01,17.29S4.05,7.48,8.91,2.79c3.29-3.18,8.39-3.86,12.16-.88,1.8,1.42,3.35,3.24,4.94,5.03,4.49,5.08,8.44,10.81,9.75,17.71.48,2.55-1.63,5.15-2.57,7.43-1.75,4.27,6.34,12.37,11.68,15.76,6.52,4.14,8.01-3.51,15.32-.87ZM69.52,60.91c-3.67-3.49-7.93-5.88-12.88-7.11-3.68,2.62-8.08,3.94-12.19,2.04-8.51-3.92-15.23-10.61-18.63-19.31-.63-1.62-.66-4.31-.03-5.76l2.58-6.03c-1.73-6.21-10.97-18.09-13.26-17.11-.53.23-1.35.88-1.99,1.41-6.83,5.68-6.29,7.14-4.92,14.63,3.01,16.51,18.75,33.29,32.65,42.66,7.22,4.87,14.89,7.78,23.62,8.41,4.04.29,8.14-4.46,10.59-8.58l-5.52-5.25Z" />
    </svg>
  )
}

/** Outlined video-camera, used in the DM header. */
export function VideoIcon({ size = 64 }: IconProps) {
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
      <rect x="2.5" y="6" width="14" height="12" rx="2.5" />
      <path d="M16.5 10 L 21.5 7 L 21.5 17 L 16.5 14 Z" />
    </svg>
  )
}

/**
 * Instagram-style camera icon used inside the purple circle on the left of
 * the message input. White camera body with a small viewfinder bump on top
 * and a bullseye lens — the lens hole is cut out so the purple parent
 * background shows through.
 */
/**
 * Full camera-button SVG (purple circle + white camera baked in).
 * Provided by the user. Circle colour wired to `--ig-camera-bg` so it stays
 * theme-able without editing the SVG.
 */
export function InstagramCameraIcon({ size = 40 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 105.52 105.52"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="52.76" cy="52.76" r="52.76" fill="var(--ig-camera-bg)" />
      <path
        fill="#ffffff"
        d="M71.09,32.03h-2.55c-1.3-4.18-5.19-7.21-9.8-7.21h-10.09c-4.6,0-8.5,3.03-9.8,7.21h-2.32c-6.57,0-11.89,5.32-11.89,11.89v24.17c0,6.57,5.32,11.89,11.89,11.89h34.56c6.57,0,11.89-5.32,11.89-11.89v-24.17c0-6.57-5.32-11.89-11.89-11.89ZM53.81,70.61c-8.14,0-14.73-6.6-14.73-14.73s6.6-14.73,14.73-14.73,14.73,6.6,14.73,14.73-6.6,14.73-14.73,14.73Z"
      />
      <circle cx="53.81" cy="55.88" r="9.03" fill="#ffffff" />
    </svg>
  )
}

/** Microphone icon — user-provided SVG (Asset 5). */
export function MicIcon({ size = 36 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 65.1 84.33"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M51.61,43.77c-2.5,11.56-12.08,18.3-23.4,15.94-8.2-1.71-14.43-8.92-14.86-17.41-.41-8-.31-15.68-.06-23.73C13.56,9.77,19.94,2.34,28.44.46c10.87-2.4,20.83,4.86,23.14,15.75l.03,27.56ZM43.93,42.86l-.03-23.81c0-6.56-6.08-11.92-12.56-11.23-4.94.53-10.04,4.5-10.07,9.69l-.13,26.21c1.81,5.63,6.23,8.92,11.71,8.76,5.3-.16,9.49-3.8,11.08-9.62Z" />
      <path d="M36.43,76.26l10,.26c1.69.04,3.11,2.34,3.19,3.62.08,1.37-1.25,4.06-3.27,4.07l-26.67.12c-2.53.01-4.12-1.65-4.22-3.73-.11-2.43,1.52-4.21,4.19-4.22l8.95-.03-.35-3.61C14.11,70.66,2.8,60.14.4,46.09-.12,43.06.04,39.85,0,36.92c-.03-2.37,1.92-3.64,3.88-3.67,4.58-.06,3.45,5.86,4.24,11.25,1.69,11.61,11.62,20.07,23.05,20.62s21.99-6.59,25.09-17.98c2.01-7.38-.23-12.92,4.15-13.81,1.82-.37,3.98.53,4.45,2.96.68,3.56-.18,10.91-1.58,14.78-4.24,11.69-14.34,19.68-26.64,21.73-.38.95-.46,2.42-.21,3.45Z" />
    </svg>
  )
}

/** Image / gallery icon — user-provided SVG (Asset 4). */
export function GalleryIcon({ size = 36 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 84.1 84.25"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M68.03,84.25l-51.24-.15c-8.5-.03-14.46-6.09-16.79-14.01V14.2C2.25,6.73,7.97.15,16.09.13l53.2-.13c7.64,1.82,12.81,6.6,14.8,14.27v55.75c-2.28,8.06-7.69,12.91-16.06,14.23ZM57.97,39.16c3.01-2.62,6.72-2.63,9.67-.33l8.74,8.5.09-31.65c-1.52-4.97-5.26-8.14-10.47-8.05H18.09c-5.16-.09-8.89,3.14-10.47,8.06l.05,41.92,9.03-8.4c3.25-3.02,7.59-1.59,10.31,1.18l9.2,9.41,1.94-.84,19.81-19.8ZM16.77,76.31l51.74-.11c3.79,0,7.73-4.44,7.78-7.77l.16-9.92-13.66-13.48-21.1,20.93c-2.65,2.63-7.09,2.53-9.72-.02l-10.79-10.43-13.24,13.3c.88,4.04,4.4,7.5,8.85,7.49Z" />
      <path d="M19.3,15.61c2.95-1.05,6.1.71,7.14,3.69.97,2.77-.61,6.17-3.93,7.32-2.55.88-5.81-.76-7.01-3.85-1.05-2.7.55-6.01,3.79-7.16Z" />
    </svg>
  )
}

/** Chat bubble icon — user-provided SVG (Asset 3). Bubble + 3 dots. */
export function ChatBubbleIcon({ size = 36 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 84.52 85.24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M44.9,84.01c-1.45,1.42-3.57,1.74-5.08.28l-8.12-7.83c-4.98-.32-9.74.46-14.48-.45C7.59,74.14.21,66.07.17,56.15l-.17-36C1.05,9.57,8.1,1.94,18.7,0l47.85.02c9.19,2.42,16.84,8.8,17.52,18.7.91,13.24.15,26.51.29,39.75-2.2,9.32-8.53,16.36-18.1,17.68-4.41.61-9,.07-13.62.29l-7.73,7.57ZM51.89,68.9l13.39-.38c6.03-.86,11.28-6.08,11.32-12.33l.22-33.8c.05-7.62-5.48-14.7-13.52-14.7H21.02c-6.47-.01-11.37,4.89-13.05,10.91l.09,38.75c.01,4.63,5.19,10.2,10.9,11.27l13.86.34c3.89.09,7.78,5.99,9.35,6.31,1.04.21,5.47-6.25,9.73-6.37Z" />
      <path d="M65.7,40.9c-1.07,1.33-2.78,2.52-4.05,2.56-1.68.06-3.26-1.05-4.46-2.43-1.73-1.99-.97-4.75.74-6.36,1.85-1.75,4.34-2.04,6.41-.46,1.9,1.45,3.27,4.32,1.37,6.69Z" />
      <path d="M21.06,33.65c2.6-1.35,5.56.08,6.7,2.58s-.03,5.34-2.88,6.75c-2.07,1.02-4.83-.07-6.29-2.5-1.34-2.23-.57-5.25,2.47-6.83Z" />
      <path d="M40,33.72c2.78-1.47,5.45-.03,6.88,2.42,1.33,2.29.04,5.18-2.4,6.59s-4.94.35-6.45-1.83c-1.65-2.37-.9-5.67,1.97-7.18Z" />
    </svg>
  )
}

/** Plus-in-circle icon — user-provided SVG (Asset 2). */
export function PlusCircleIcon({ size = 36 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 87.87 87.78"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M53.38,86.73c-22.97,5.02-45.39-8.42-51.88-30.84C.58,52.72,0,49.94,0,46.75v-5.57s1.14-7.94,1.14-7.94c2.24-8.62,6.53-15.87,13.18-21.88S28.8,1.5,37.72.43l6.44-.43,5.57.37c25.66,3.35,42.83,27.99,37,53.43-3.79,16.55-16.77,29.31-33.35,32.93ZM79.67,49.8c3.03-19.01-9.05-36.66-26.84-41-5.82-1.42-11.96-1.43-17.81-.01C15.71,13.48,3.82,33.13,8.72,52.82c3.43,13.77,14.98,24.39,28.87,26.73,20.42,3.43,38.98-10.32,42.08-29.75Z" />
      <path d="M47.7,63.45c-.01,1.76-2.1,3.2-3.26,3.39-1.26.2-4.18-1.02-4.2-2.75l-.2-16.27-16.1-.23c-1.98-.03-3.16-2.82-3.01-4.17.23-2.05,1.88-3.34,4.27-3.33l14.88.03-.03-14.9c0-1.86,1.06-3.57,2.62-4.19,1.25-.5,4.28.26,4.65,2.34.93,5.25.16,10.91.5,16.66l16.23.23c2.06.03,3.17,3.32,2.72,4.65-.6,1.78-2.48,2.87-4.55,2.87h-14.42s-.11,15.66-.11,15.66Z" />
    </svg>
  )
}

/** Sticker icon — peeling square with smiley. */
export function StickerIcon({ size = 36 }: IconProps) {
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
      <path d="M21 14V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9l7-7z" />
      <path d="M21 14h-5a2 2 0 0 0-2 2v5" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      <path d="M9 14c1.2 1 2 1.5 3 1.5s1.8-.5 3-1.5" />
    </svg>
  )
}

/** Default silhouette avatar (when no profile image uploaded). */
export function ContactSilhouetteIcon({ size = 80 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff">
      <circle cx="12" cy="9" r="4.5" />
      <path d="M12 14c-4.4 0-8 3.2-8 7.2v.8h16v-.8c0-4-3.6-7.2-8-7.2z" />
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
