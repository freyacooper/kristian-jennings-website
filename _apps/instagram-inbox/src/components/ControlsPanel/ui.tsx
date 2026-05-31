import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

/* All visual styling lives as .kj-* utility classes in src/index.css,
   mirroring the parent site's design system. */

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="kj-row-label">{label}</span>
      {children}
    </div>
  )
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="kj-field-label">{label}</span>
      {children}
      {hint && <span className="kj-hint">{hint}</span>}
    </label>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props
  return <input {...rest} className={`kj-input ${className}`.trim()} />
}

export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="kj-switch"
    />
  )
}

export function Button({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`kj-btn ${className}`.trim()}>
      {children}
    </button>
  )
}

export function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  return (
    /* Accordion item — sits inside the outer aside card. A thin top
       border separates sections (first one has no border). */
    <details
      open={defaultOpen}
      className="group border-t border-[color:var(--hairline)] first:border-t-0"
    >
      <summary
        className="py-3.5 cursor-pointer select-none flex items-center justify-between list-none"
      >
        <span className="kj-section-title">{title}</span>
        <span
          className="text-[color:var(--fg-3)] text-base group-open:rotate-90 transition-transform"
          aria-hidden="true"
        >
          ›
        </span>
      </summary>
      <div className="pt-1 pb-4 flex flex-col gap-3">{children}</div>
    </details>
  )
}
