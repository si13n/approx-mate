import type { ReactNode } from "react"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 pb-7 pt-1 min-[360px]:px-6 desktop:px-[72px] desktop:pb-6">
      {children}
    </div>
  )
}
