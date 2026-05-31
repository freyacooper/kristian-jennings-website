import type { ChangeEvent } from 'react'
import type { ProfileConfig } from '../../types'
import { Row, Toggle } from './ui'

interface Props {
  profile: ProfileConfig
  update: (patch: Partial<ProfileConfig>) => void
}

export function ProfileControls({ profile, update }: Props) {
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update({ imageDataUrl: reader.result as string })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <>
      <Row label="Show profile picture">
        <Toggle checked={profile.enabled} onChange={v => update({ enabled: v })} />
      </Row>
      {profile.enabled && (
        <div className="flex items-center gap-3">
          {profile.imageDataUrl ? (
            <img
              src={profile.imageDataUrl}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
              style={{ border: '1px solid var(--hairline)' }}
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
              style={{
                background: 'rgba(1, 31, 47, 0.06)',
                color: 'var(--fg-3)',
                border: '1px solid var(--hairline)',
              }}
            >
              ⌣
            </div>
          )}
          <label className="kj-btn cursor-pointer">
            {profile.imageDataUrl ? 'Replace' : 'Upload image'}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
          {profile.imageDataUrl && (
            <button
              type="button"
              className="kj-btn"
              onClick={() => update({ imageDataUrl: null })}
            >
              Remove
            </button>
          )}
        </div>
      )}
    </>
  )
}
