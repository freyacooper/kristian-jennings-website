import type { PreviewToggles } from '../../types'
import { Row, Toggle } from './ui'

interface Props {
  toggles: PreviewToggles
  update: (patch: Partial<PreviewToggles>) => void
}

export function TogglesControls({ toggles, update }: Props) {
  return (
    <>
      <Row label="Dark mode">
        <Toggle checked={toggles.darkMode} onChange={v => update({ darkMode: v })} />
      </Row>
      <Row label="Dynamic Island">
        <Toggle
          checked={toggles.showDynamicIsland}
          onChange={v => update({ showDynamicIsland: v })}
        />
      </Row>
      <Row label="Show message input bar">
        <Toggle checked={toggles.showMessageInput} onChange={v => update({ showMessageInput: v })} />
      </Row>
      <Row label="Show keyboard">
        <Toggle checked={toggles.showKeyboard} onChange={v => update({ showKeyboard: v })} />
      </Row>
      <Row label="Typing indicator">
        <Toggle
          checked={toggles.showTypingIndicator}
          onChange={v => update({ showTypingIndicator: v })}
        />
      </Row>
    </>
  )
}
