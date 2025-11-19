import './globals.css'
import { ReactNode } from 'react'
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en"><body className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-blue-800">FairChance Program</h1>
          <nav className="mt-2 flex gap-4 text-blue-700">
            <a href="/">Dashboard</a><a href="/employees">Employees</a><a href="/coordinators">Coordinator Analytics</a><a href="/reports">Reports</a>
          </nav>
        </header>
        {children}
      </div>
    </body></html>
  )
}
