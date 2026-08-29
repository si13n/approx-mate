import type { ButtonHTMLAttributes, ReactNode } from "react"

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: ReactNode
}

export function IconButton({
  label,
  className = "",
  type = "button",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-control text-content-secondary transition-colors hover:bg-surface-subtle active:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
