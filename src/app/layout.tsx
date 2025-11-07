import './globals.css'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Fair Chance Employment', description: 'Program operations and analytics' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-slate-50 text-slate-900')}>{children}</body>
    </html>
  )
}
