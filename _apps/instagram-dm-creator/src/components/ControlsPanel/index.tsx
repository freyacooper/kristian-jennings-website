import type { UseConversation } from '../../hooks/useConversation'
import { DeliveryStatusControls } from './DeliveryStatusControls'
import { HeaderControls } from './HeaderControls'
import { MessageListEditor } from './MessageListEditor'
import { ProfileControls } from './ProfileControls'
import { ProfileIntroControls } from './ProfileIntroControls'
import { StatusBarControls } from './StatusBarControls'
import { TogglesControls } from './TogglesControls'
import { Section } from './ui'

export function ControlsPanel({ conv }: { conv: UseConversation }) {
  return (
    <div className="flex flex-col">
      <Section title="Preview">
        <TogglesControls
          toggles={conv.state.toggles}
          update={conv.updateToggles}
          intro={conv.state.profileIntro}
          updateIntro={conv.updateProfileIntro}
        />
      </Section>

      <Section title="Status bar" defaultOpen={false}>
        <StatusBarControls config={conv.state.statusBar} update={conv.updateStatusBar} />
      </Section>

      <Section title="Account">
        <div className="flex flex-col gap-3">
          <HeaderControls header={conv.state.header} update={conv.updateHeader} />
          <div className="pt-3" style={{ borderTop: '1px solid var(--hairline)' }}>
            <ProfileControls
              profile={conv.state.profile}
              update={conv.updateProfile}
            />
          </div>
        </div>
      </Section>

      {conv.state.profileIntro.enabled && (
        <Section title="Conversation intro">
          <ProfileIntroControls
            intro={conv.state.profileIntro}
            update={conv.updateProfileIntro}
          />
        </Section>
      )}

      <Section title="Messages">
        <MessageListEditor
          messages={conv.state.messages}
          defaultSenderStyle={conv.state.defaultSenderStyle}
          add={conv.addMessage}
          update={conv.updateMessage}
          remove={conv.deleteMessage}
          move={conv.moveMessage}
          setDefaultSenderStyle={conv.setDefaultSenderStyle}
        />
      </Section>

      <Section title="Delivery status">
        <DeliveryStatusControls
          deliveryStatus={conv.state.deliveryStatus}
          setDeliveryStatus={conv.setDeliveryStatus}
        />
      </Section>
    </div>
  )
}
