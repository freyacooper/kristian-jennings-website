import type { NavBarConfig } from '../../types'
import { Field, Input } from './ui'

interface Props {
  navBar: NavBarConfig
  update: (patch: Partial<NavBarConfig>) => void
}

export function NavBarControls({ navBar, update }: Props) {
  return (
    <>
      <Field label="Contact name">
        <Input
          value={navBar.contactName}
          onChange={e => update({ contactName: e.target.value })}
        />
      </Field>
      <Field label="Unread badge count" hint="Shown after ‹ Messages. 0 hides it.">
        <Input
          type="number"
          min={0}
          value={navBar.unreadBadgeCount}
          onChange={e =>
            update({ unreadBadgeCount: Math.max(0, Number(e.target.value) || 0) })
          }
        />
      </Field>
    </>
  )
}
