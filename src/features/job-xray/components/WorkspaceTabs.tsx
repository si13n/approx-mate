import { useRef, type KeyboardEvent } from "react"
import type { Translation } from "../../../i18n/translations"
import { jobXRayIcons } from "../icons"

export interface OfferTab {
  id: string
  label: string
  title?: string
}

interface WorkspaceTabsProps {
  offers: OfferTab[]
  activeTab: string
  t: Translation
  onSelect: (id: string) => void
  onClose: (id: string) => void
}

export function WorkspaceTabs({
  offers,
  activeTab,
  t,
  onSelect,
  onClose,
}: WorkspaceTabsProps) {
  const refs = useRef(new Map<string, HTMLButtonElement>())
  const tabs = ["calculator", ...offers.map((offer) => offer.id)]

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    id: string,
  ) => {
    const index = tabs.indexOf(id)
    let nextIndex: number | null = null
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length
    if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + tabs.length) % tabs.length
    if (event.key === "Home") nextIndex = 0
    if (event.key === "End") nextIndex = tabs.length - 1
    if (nextIndex === null) return
    event.preventDefault()
    const nextId = tabs[nextIndex]
    onSelect(nextId)
    refs.current.get(nextId)?.focus()
  }

  const tabClasses = (active: boolean) =>
    `relative flex h-[41px] w-[150px] shrink-0 items-center overflow-hidden rounded-t-[12px] border border-border text-sm font-semibold ${
      active
        ? "z-10 border-b-0 bg-surface text-action before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:rounded-t-[11px] before:bg-primary"
        : "bg-surface-subtle text-content-secondary hover:bg-surface"
    }`

  return (
    <div
      className="relative z-10 -mb-px flex w-full items-end gap-1 overflow-x-auto"
      role="tablist"
      aria-label={t.workspaceTabs}
    >
      <div className={tabClasses(activeTab === "calculator")}>
        <button
          ref={(node) => {
            if (node) refs.current.set("calculator", node)
          }}
          type="button"
          role="tab"
          id="workspace-tab-calculator"
          aria-selected={activeTab === "calculator"}
          aria-controls="workspace-panel-calculator"
          tabIndex={activeTab === "calculator" ? 0 : -1}
          onClick={() => onSelect("calculator")}
          onKeyDown={(event) => handleKeyDown(event, "calculator")}
          className="flex h-full min-w-0 flex-1 items-center justify-center gap-2 px-3 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary"
        >
          <img
            src={jobXRayIcons.calculator}
            alt=""
            aria-hidden="true"
            className="size-4"
          />
          {t.calculatorTab}
        </button>
      </div>
      {offers.map((offer) => {
        const active = activeTab === offer.id
        return (
          <div key={offer.id} className={tabClasses(active)}>
            <button
              ref={(node) => {
                if (node) refs.current.set(offer.id, node)
              }}
              type="button"
              role="tab"
              id={`workspace-tab-${offer.id}`}
              aria-selected={active}
              aria-controls={`workspace-panel-${offer.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onSelect(offer.id)}
              onKeyDown={(event) => handleKeyDown(event, offer.id)}
              title={offer.title}
              className="flex h-full min-w-0 flex-1 items-center gap-2 overflow-hidden pl-3 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary"
            >
              <img
                src={jobXRayIcons.briefcase}
                alt=""
                aria-hidden="true"
                className="size-4 shrink-0"
              />
              <span className="block min-w-0 truncate text-left">
                {offer.label}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onClose(offer.id)}
              aria-label={`${t.closeOffer} ${offer.title ?? offer.label}`}
              title={`${t.closeOffer} ${offer.label}`}
              className="mr-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-base leading-none text-content-secondary hover:bg-page hover:text-content focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
