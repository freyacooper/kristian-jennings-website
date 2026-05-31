import type { UseConversation } from '../../hooks/useConversation'
import { NavBarControls } from './NavBarControls'
import { MessageListEditor } from './MessageListEditor'
import { ProfileControls } from './ProfileControls'
import { StatusBarControls } from './StatusBarControls'
import { TogglesControls } from './TogglesControls'
import { Section } from './ui'

export function ControlsPanel({ conv }: { conv: UseConversation }) {
  return (
    <div className="flex flex-col">
      <Section title="Preview">
        <TogglesControls toggles={conv.state.toggles} update={conv.updateToggles} />
      </Section>

      <Section title="Messages">
        <MessageListEditor
          messages={conv.state.messages}
          deliveryStatus={conv.state.deliveryStatus}
          add={conv.addMessage}
          update={conv.updateMessage}
          remove={conv.deleteMessage}
          move={conv.moveMessage}
          setDelivery={conv.setDeliveryStatus}
        />
      </Section>

      <Section title="Conversation header">
        <NavBarControls navBar={conv.state.navBar} update={conv.updateNavBar} />
      </Section>

      <Section title="Profile picture">
        <ProfileControls profile={conv.state.profile} update={conv.updateProfile} />
      </Section>

      <Section title="Status bar" defaultOpen={false}>
        <StatusBarControls config={conv.state.statusBar} update={conv.updateStatusBar} />
      </Section>
    </div>
  )
}
