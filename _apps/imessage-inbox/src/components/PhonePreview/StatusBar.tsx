import type { StatusBarConfig } from '../../types'
import { BatteryIcon, SignalBars, WifiIcon } from './icons'

interface Props {
  config: StatusBarConfig
  /** When true, render a compact status bar (no Dynamic Island headroom). */
  compact?: boolean
}

// Must match the island width in PhonePreview/index.tsx
const ISLAND_WIDTH = 320

export function StatusBar({ config, compact = false }: Props) {
  // Same 3-column grid regardless of island visibility — keeps the time
  // and icons in identical horizontal positions when the island is toggled.
  return (
    <div
      className="grid items-center"
      style={{
        height: compact ? 90 : 160,
        gridTemplateColumns: `1fr ${ISLAND_WIDTH}px 1fr`,
        color: 'var(--ios-status-text)',
        fontVariantNumeric: 'tabular-nums',
        flexShrink: 0,
      }}
    >
      <div className="flex justify-center">
        <span style={{ fontSize: 48, fontWeight: 600, letterSpacing: -0.5 }}>{config.time}</span>
      </div>
      <div />
      <div className="flex items-center justify-center" style={{ gap: 18 }}>
        <SignalBars filled={config.signalBars} />
        {config.wifiOn && <WifiIcon />}
        <BatteryIcon percent={config.batteryPercent} showPercent={config.showBatteryPercent} />
      </div>
    </div>
  )
}
