interface Props {
  /** When > 0, renders the "Requests (N)" link on the right side. */
  requestsCount: number
}

/**
 * Section header between the Notes strip and the conversation list:
 *   "Messages"                         "Requests (N)"
 *
 * Always shows the "Messages" label; the right-hand link is hidden when
 * `requestsCount === 0`.
 */
export function MessagesHeader({ requestsCount }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 36,
        paddingRight: 36,
        paddingTop: 14,
        paddingBottom: 14,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 42,
          fontWeight: 700,
          color: 'var(--ig-text)',
          letterSpacing: -0.3,
        }}
      >
        Messages
      </span>
      {requestsCount > 0 && (
        <span
          style={{
            fontSize: 38,
            fontWeight: 600,
            color: 'var(--ig-link)',
          }}
        >
          Requests ({requestsCount})
        </span>
      )}
    </div>
  )
}
