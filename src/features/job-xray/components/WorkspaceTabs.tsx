import { useRef, type KeyboardEvent } from "react"
import type { Translation } from "../../../i18n/translations"
import { jobXRayIcons } from "../icons"

export interface OfferTab {
  id: string
  label: string
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
    `relative flex h-[42px] min-w-[150px] items-center rounded-t-xl border border-b-0 px-3 text-sm font-semibold focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-primary ${
      active
        ? "bg-surface text-action before:absolute before:inset-x-1 before:top-0 before:h-1 before:rounded-t-full before:bg-primary"
        : "bg-surface-subtle text-content-secondary"
    }`

  return (
    <div
      className="flex w-full overflow-x-auto"
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
          className="flex min-h-11 flex-1 items-center justify-center gap-2"
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
          <div key={offer.id} className={`${tabClasses(active)} ml-1`}>
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
              className="flex min-h-11 min-w-0 flex-1 items-center gap-2 pl-1"
            >
              <img
                src={jobXRayIcons.briefcase}
                alt=""
                aria-hidden="true"
                className="size-4 shrink-0"
              />
              <span className="truncate">{offer.label}</span>
            </button>
            <button
              type="button"
              onClick={() => onClose(offer.id)}
              aria-label={`${t.closeOffer} ${offer.label}`}
              className="ml-1 flex size-11 shrink-0 items-center justify-center rounded-lg text-lg text-content-secondary hover:bg-page focus-visible:outline-2 focus-visible:outline-primary"
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
