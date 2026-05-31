import type { ReactNode } from 'react'
import { GlobeIcon } from './icons'

const ROW1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
const ROW2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
const ROW3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm']

const KEY_GAP = 10
const KEY_HEIGHT = 118
const KEY_RADIUS = 14
const ROW_GAP = 18
const KEY_SHADOW = '0 1px 0 var(--ig-key-shadow)'
const LETTER_FONT = 62
const FN_FONT = 44

export function Keyboard() {
  return (
    <div
      className="flex flex-col"
      style={{
        background: 'var(--ig-keyboard-bg)',
        paddingTop: 18,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
        gap: ROW_GAP,
        flexShrink: 0,
      }}
    >
      <div className="flex" style={{ gap: KEY_GAP }}>
        {ROW1.map(k => <Key key={k} label={k} />)}
      </div>
      <div className="flex" style={{ gap: KEY_GAP, paddingLeft: 56, paddingRight: 56 }}>
        {ROW2.map(k => <Key key={k} label={k} />)}
      </div>
      <div className="flex" style={{ gap: KEY_GAP }}>
        <FnKey label="⇧" widthFactor={1.55} />
        <div className="flex flex-1" style={{ gap: KEY_GAP }}>
          {ROW3.map(k => <Key key={k} label={k} />)}
        </div>
        <FnKey label="⌫" widthFactor={1.55} />
      </div>
      <div className="flex" style={{ gap: KEY_GAP }}>
        <FnKey label="123" widthFactor={1.55} />
        <FnKey icon={<GlobeIcon size={46} />} widthFactor={0.95} />
        <SpaceKey />
        <FnKey label="return" widthFactor={2.2} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 16, paddingBottom: 6 }}>
        <div
          style={{
            width: 380,
            height: 9,
            background: 'var(--ig-text)',
            borderRadius: 6,
            opacity: 0.9,
          }}
        />
      </div>
    </div>
  )
}

function Key({ label }: { label: string }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        background: 'var(--ig-key-bg)',
        color: 'var(--ig-key-text)',
        borderRadius: KEY_RADIUS,
        height: KEY_HEIGHT,
        flex: 1,
        fontSize: LETTER_FONT,
        fontWeight: 400,
        boxShadow: KEY_SHADOW,
        textTransform: 'uppercase',
        lineHeight: 1,
      }}
    >
      {label}
    </div>
  )
}

function SpaceKey() {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        background: 'var(--ig-key-bg)',
        color: 'var(--ig-key-text)',
        borderRadius: KEY_RADIUS,
        height: KEY_HEIGHT,
        flex: 5,
        fontSize: FN_FONT,
        fontWeight: 400,
        boxShadow: KEY_SHADOW,
      }}
    >
      space
    </div>
  )
}

function FnKey({
  label,
  icon,
  widthFactor = 1,
}: {
  label?: string
  icon?: ReactNode
  widthFactor?: number
}) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        background: 'var(--ig-key-fn-bg)',
        color: 'var(--ig-key-text)',
        borderRadius: KEY_RADIUS,
        height: KEY_HEIGHT,
        minWidth: 84 * widthFactor,
        paddingLeft: 14,
        paddingRight: 14,
        fontSize: FN_FONT,
        fontWeight: 400,
        boxShadow: KEY_SHADOW,
        lineHeight: 1,
      }}
    >
      {icon ?? label}
    </div>
  )
}
