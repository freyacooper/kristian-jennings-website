import type { AspectRatio } from '../../types'

interface Props {
  aspectRatio: AspectRatio
  setAspectRatio: (r: AspectRatio) => void
  onDownload: () => void
  exporting: boolean
}

const RATIOS: { value: AspectRatio; label: string; hint: string }[] = [
  { value: '9:16', label: '9:16', hint: 'Stories / Reels / TikTok' },
  { value: '4:5', label: '4:5', hint: 'Instagram / Facebook feed' },
  { value: '1:1', label: '1:1', hint: 'Instagram square' },
]

export function ExportControls({ aspectRatio, setAspectRatio, onDownload, exporting }: Props) {
  const activeIdx = RATIOS.findIndex(r => r.value === aspectRatio)
  return (
    <div className="flex flex-col gap-3 items-center w-full">
      <div
        className="kj-segmented"
        style={{ ['--cols' as string]: '3', ['--active' as string]: String(activeIdx) }}
      >
        {RATIOS.map(r => (
          <button
            key={r.value}
            type="button"
            onClick={() => setAspectRatio(r.value)}
            title={r.hint}
            className={aspectRatio === r.value ? 'is-active' : ''}
          >
            {r.label}
          </button>
        ))}
      </div>
      <button type="button" onClick={onDownload} disabled={exporting} className="kj-btn-primary">
        {exporting ? 'Generating…' : 'Download PNG'}
      </button>
    </div>
  )
}
