/**
 * iOS home indicator — small horizontal pill at the bottom edge of the
 * screen. Black in light mode, white in dark mode. Sits inside the
 * preview's bottom safe-area.
 */
export function HomeIndicator() {
  return (
    <div
      aria-hidden
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: 22,
        paddingTop: 8,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 380,
          height: 14,
          borderRadius: 7,
          background: 'var(--ios-home-indicator)',
        }}
      />
    </div>
  )
}
