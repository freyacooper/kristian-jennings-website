import type { UseInbox } from '../../hooks/useInbox'
import { ConversationListEditor } from './ConversationListEditor'
import { StatusBarControls } from './StatusBarControls'
import { TogglesControls } from './TogglesControls'
import { Section } from './ui'

export function ControlsPanel({ inbox }: { inbox: UseInbox }) {
  return (
    <div className="flex flex-col">
      <Section title="Preview">
        <TogglesControls toggles={inbox.state.toggles} update={inbox.updateToggles} />
      </Section>

      <Section title="Status bar" defaultOpen={false}>
        <StatusBarControls config={inbox.state.statusBar} update={inbox.updateStatusBar} />
      </Section>

      <Section title="Conversations">
        <ConversationListEditor
          conversations={inbox.state.conversations}
          add={inbox.addConversation}
          update={inbox.updateConversation}
          remove={inbox.deleteConversation}
          move={inbox.moveConversation}
        />
      </Section>
    </div>
  )
}
