interface Segment<T extends string> {
  value: T
  label: string
  description?: string
}

interface SegmentedControlProps<T extends string> {
  value: T
  options: readonly Segment<T>[]
  onChange: (value: T) => void
  tone?: "primary" | "accent"
  ariaLabel: string
  compact?: boolean
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  tone = "primary",
  ariaLabel,
  compact = false,
}: SegmentedControlProps<T>) {
  const active =
    tone === "accent"
      ? "bg-accent text-content-inverse"
      : "bg-primary text-content-inverse"
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="grid grid-flow-col auto-cols-fr gap-1 rounded-xl bg-page p-1"
    >
      {options.map((option, index) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              let nextIndex = index
              if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                nextIndex = (index - 1 + options.length) % options.length
              } else if (
                event.key === "ArrowRight" ||
                event.key === "ArrowDown"
              ) {
                nextIndex = (index + 1) % options.length
              } else if (event.key === "Home") {
                nextIndex = 0
              } else if (event.key === "End") {
                nextIndex = options.length - 1
              } else {
                return
              }

              event.preventDefault()
              const nextOption = options[nextIndex]
              if (!nextOption) return
              onChange(nextOption.value)
              event.currentTarget.parentElement
                ?.querySelectorAll<HTMLButtonElement>("[role='radio']")
                [nextIndex]?.focus()
            }}
            className={`min-h-11 rounded-[9px] px-2 font-semibold transition-colors active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary ${
              selected ? active : "text-content-secondary hover:bg-surface"
            } ${compact ? "text-xs" : "text-sm"}`}
          >
            <span className="block">{option.label}</span>
            {option.description && (
              <span
                className={`mt-0.5 hidden text-[11px] font-normal tablet:block ${
                  selected ? "text-primary-border" : "text-content-secondary"
                }`}
              >
                {option.description}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
