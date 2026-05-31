import type { UserConfig } from '../../types'
import { Field, Input, Row, Toggle } from './ui'

interface Props {
  user: UserConfig
  update: (patch: Partial<UserConfig>) => void
}

export function UserControls({ user, update }: Props) {
  return (
    <>
      <Field label="Your username (shown in header)">
        <Input
          value={user.username}
          onChange={e => update({ username: e.target.value })}
        />
      </Field>

      <Row label="Verified (blue checkmark next to username)">
        <Toggle checked={user.verified} onChange={v => update({ verified: v })} />
      </Row>
    </>
  )
}
