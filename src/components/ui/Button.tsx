import type { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonVariant = "primary" | "brand" | "secondary" | "ghost" | "dark"
type ButtonSize = "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  loading?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-content-inverse hover:bg-action disabled:bg-border-strong",
  brand:
    "bg-accent-blue-bright text-content-inverse hover:bg-[#279fff] disabled:bg-border-strong",
  secondary:
    "border border-border-strong bg-surface text-content-secondary hover:bg-surface-subtle",
  ghost: "bg-transparent text-action hover:bg-primary-subtle",
  dark: "bg-inverse text-content-inverse hover:bg-content-secondary",
}

const sizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-4 text-[13px]",
  lg: "min-h-12 px-5 text-sm",
}

export function Button({
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  leadingIcon,
  trailingIcon,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {leadingIcon}
      {loading ? <span aria-live="polite">…</span> : children}
      {trailingIcon}
    </button>
  )
}
