import { MicIcon, PlusIcon } from './icons'

interface Props {
  /** When true, render an iOS home indicator below the input bar. Used when
   *  the keyboard is hidden — gives the bar safe-area room and matches what
   *  a real iPhone shows when no keyboard is on screen. */
  withHomeIndicator?: boolean
}

export function MessageInput({ withHomeIndicator = false }: Props) {
  return (
    <div
      className="flex flex-col"
      style={{ background: 'var(--ios-input-bg)', flexShrink: 0 }}
    >
      <div
        className="flex items-center"
        style={{
          gap: 22,
          paddingLeft: 26,
          paddingRight: 26,
          paddingTop: 28,
          paddingBottom: 28,
        }}
      >
        {/* + button — prominent grey circle */}
        <button
          type="button"
          className="flex items-center justify-center rounded-full"
          style={{
            width: 90,
            height: 90,
            background: 'var(--ios-bubble-receiver)',
            color: 'var(--ios-secondary-text)',
            flexShrink: 0,
          }}
        >
          <PlusIcon size={50} />
        </button>

        {/* iMessage text field with mic — takes the entire remaining width */}
        <div
          className="flex-1 flex items-center justify-between"
          style={{
            background: 'var(--ios-input-field)',
            border: '1px solid var(--ios-input-border)',
            borderRadius: 50,
            paddingLeft: 32,
            paddingRight: 24,
            minHeight: 80,
          }}
        >
          <span style={{ color: 'var(--ios-input-placeholder)', fontSize: 44 }}>iMessage</span>
          <span style={{ color: 'var(--ios-secondary-text)', display: 'inline-flex' }}>
            <MicIcon size={55} />
          </span>
        </div>
      </div>

      {withHomeIndicator && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 8,
            paddingBottom: 14,
          }}
        >
          <div
            style={{
              width: 380,
              height: 9,
              background: 'var(--ios-text)',
              borderRadius: 6,
              opacity: 0.9,
            }}
          />
        </div>
      )}
    </div>
  )
}
