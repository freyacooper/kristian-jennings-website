import type { StatusBarConfig } from '../../types'
import { Field, Input, Row, Toggle } from './ui'

interface Props {
  config: StatusBarConfig
  update: (patch: Partial<StatusBarConfig>) => void
}

export function StatusBarControls({ config, update }: Props) {
  return (
    <>
      <Field label="Time">
        <Input value={config.time} onChange={e => update({ time: e.target.value })} />
      </Field>
      <Field label={`Signal bars — ${config.signalBars}/4`}>
        <input
          type="range"
          min={0}
          max={4}
          value={config.signalBars}
          onChange={e => update({ signalBars: Number(e.target.value) })}
          className="kj-range"
        />
      </Field>
      <Row label="WiFi">
        <Toggle checked={config.wifiOn} onChange={v => update({ wifiOn: v })} />
      </Row>
      <Field label={`Battery — ${config.batteryPercent}%`}>
        <input
          type="range"
          min={0}
          max={100}
          value={config.batteryPercent}
          onChange={e => update({ batteryPercent: Number(e.target.value) })}
          className="kj-range"
        />
      </Field>
      <Row label="Show battery percentage">
        <Toggle
          checked={config.showBatteryPercent}
          onChange={v => update({ showBatteryPercent: v })}
        />
      </Row>
    </>
  )
}
