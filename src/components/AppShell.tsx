import type { ReactNode } from "react"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-app flex-col gap-3 px-4 pb-7 pt-5 tablet:gap-4 tablet:px-8 desktop:px-12 desktop:pb-6 desktop:pt-7">
      {children}
    </div>
  )
}
