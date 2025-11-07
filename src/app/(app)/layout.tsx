import { ReactNode } from 'react'
import Link from 'next/link'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-6">
          <div className="font-semibold text-blue-700">FairChance</div>
          <nav className="flex gap-4 text-sm">
            <Link href="/" className="hover:underline">Dashboard</Link>
            <Link href="/employees" className="hover:underline">Employees</Link>
            <Link href="/analytics/coordinator" className="hover:underline">Coordinator Analytics</Link>
            <Link href="/reports" className="hover:underline">Reports</Link>
            <Link href="/admin/settings" className="hover:underline">Admin</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl w-full p-4">{children}</main>
    </div>
  )
}
