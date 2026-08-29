import { useEffect, useRef, type ReactNode } from "react"

interface DialogProps {
  open: boolean
  titleId: string
  onClose: () => void
  children: ReactNode
}

const focusableSelector =
  "button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"

export function Dialog({ open, titleId, onClose, children }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    previousFocus.current = (document.activeElement as HTMLElement | null)
    const oldOverflow = document.body.style.overflow
    const background = document.querySelector<HTMLElement>(
      "[data-dialog-background]",
    )
    const backgroundWasInert = background?.inert ?? false
    const oldAriaHidden = background?.getAttribute("aria-hidden") ?? null
    document.body.style.overflow = "hidden"
    if (background) {
      background.inert = true
      background.setAttribute("aria-hidden", "true")
    }
    requestAnimationFrame(() =>
      dialogRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus(),
    )

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== "Tab" || !dialogRef.current) return
      const focusable = [
        ...dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ]
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = oldOverflow
      if (background) {
        background.inert = backgroundWasInert
        if (oldAriaHidden === null) background.removeAttribute("aria-hidden")
        else background.setAttribute("aria-hidden", oldAriaHidden)
      }
      previousFocus.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-inverse/45 min-[640px]:p-6"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="h-full w-full overflow-y-auto bg-surface min-[640px]:h-auto min-[640px]:max-h-[calc(100vh-3rem)] min-[640px]:max-w-[720px] min-[640px]:rounded-panel min-[640px]:shadow-2xl"
      >
        {children}
      </div>
    </div>
  )
}
