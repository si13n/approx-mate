interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="inline-flex size-11 items-center justify-center rounded-control active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span
        className={`relative h-6 w-[42px] rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-border-strong"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-surface transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  )
}
