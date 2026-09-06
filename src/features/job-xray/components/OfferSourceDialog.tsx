import type { Translation } from "../../../i18n/translations"
import { Button } from "../../../components/ui/Button"
import { Dialog } from "../../../components/ui/Dialog"

interface OfferSourceDialogProps {
  open: boolean
  sourceText: string
  t: Translation
  onClose: () => void
}

export function OfferSourceDialog({
  open,
  sourceText,
  t,
  onClose,
}: OfferSourceDialogProps) {
  return (
    <Dialog open={open} titleId="offer-source-title" onClose={onClose}>
      <div className="flex items-center justify-between border-b border-border p-4 tablet:px-6">
        <h2
          id="offer-source-title"
          className="font-display text-xl font-semibold"
        >
          {t.offerSource}
        </h2>
        <Button variant="ghost" onClick={onClose}>
          {t.close}
        </Button>
      </div>
      <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap break-words p-4 font-body text-sm leading-6 text-content-secondary tablet:p-6">
        {sourceText}
      </pre>
    </Dialog>
  )
}
