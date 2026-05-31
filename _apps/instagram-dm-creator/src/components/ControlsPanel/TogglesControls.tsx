import type { PreviewToggles, ProfileIntroConfig } from '../../types'
import { Row, Toggle } from './ui'

interface Props {
  toggles: PreviewToggles
  update: (patch: Partial<PreviewToggles>) => void
  /** Profile-intro toggle is shown here for convenience even though it lives in a separate config. */
  intro: ProfileIntroConfig
  updateIntro: (patch: Partial<ProfileIntroConfig>) => void
}

export function TogglesControls({ toggles, update, intro, updateIntro }: Props) {
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
        <Toggle
          checked={toggles.showMessageInput}
          onChange={v => update({ showMessageInput: v })}
        />
      </Row>
      <Row label="Show keyboard">
        <Toggle
          checked={toggles.showKeyboard}
          onChange={v => update({ showKeyboard: v })}
        />
      </Row>
      <Row label="Show conversation start intro">
        <Toggle
          checked={intro.enabled}
          onChange={v => updateIntro({ enabled: v })}
        />
      </Row>
      <Row label="Lock messages to top">
        <Toggle
          checked={toggles.lockMessagesToTop}
          onChange={v => update({ lockMessagesToTop: v })}
        />
      </Row>
    </>
  )
}
