import * as React from 'react'
export function Card({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-2xl border bg-white shadow-sm ${className ?? ''}`}>{children}</div>
}
