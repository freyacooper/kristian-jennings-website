import type { DeliveryStatus } from '../../types'

interface Props {
  deliveryStatus: DeliveryStatus
  setDeliveryStatus: (s: DeliveryStatus) => void
}

const OPTIONS: { value: DeliveryStatus; label: string }[] = [
  { value: 'Seen', label: 'Seen' },
  { value: 'Delivered', label: 'Delivered' },
  { value: '', label: 'Hidden' },
]

export function DeliveryStatusControls({ deliveryStatus, setDeliveryStatus }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <span className="kj-field-label">Status under last sent message</span>
      <div className="flex flex-wrap gap-1.5">
        {OPTIONS.map(opt => {
          const isActive = deliveryStatus === opt.value
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => setDeliveryStatus(opt.value)}
              className={`kj-chip ${isActive ? 'is-active' : ''}`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
      <span className="kj-hint">
        "Seen" shows a small avatar of the contact next to it (matches Instagram).
      </span>
    </div>
  )
}
