import type { UseInbox } from '../../hooks/useInbox'
import { ConversationListEditor } from './ConversationListEditor'
import { StatusBarControls } from './StatusBarControls'
import { TogglesControls } from './TogglesControls'
import { UserControls } from './UserControls'
import { Field, Input, Section } from './ui'

export function ControlsPanel({ inbox }: { inbox: UseInbox }) {
  return (
    <div className="flex flex-col">
      <Section title="Preview">
        <TogglesControls toggles={inbox.state.toggles} update={inbox.updateToggles} />
      </Section>

      <Section title="Status bar" defaultOpen={false}>
        <StatusBarControls config={inbox.state.statusBar} update={inbox.updateStatusBar} />
      </Section>

      <Section title="Your account">
        <UserControls user={inbox.state.user} update={inbox.updateUser} />
      </Section>

      <Section title="Messages header" defaultOpen={false}>
        <Field
          label={`Requests count — ${inbox.state.requestsCount} (0 hides the link)`}
        >
          <Input
            type="number"
            min={0}
            max={99}
            value={inbox.state.requestsCount}
            onChange={e => inbox.setRequestsCount(Number(e.target.value))}
            style={{ width: '6rem' }}
          />
        </Field>
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
