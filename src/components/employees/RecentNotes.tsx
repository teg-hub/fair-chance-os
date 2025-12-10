'use client'

import { useMemo, useState } from 'react'

type Note = {
  id: string
  note_date: string
  meeting_summary: string | null
}

export default function RecentNotes({ notes }: { notes: Note[] }) {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    if (!q.trim()) return notes
    const s = q.toLowerCase()
    return notes.filter(n =>
      (n.meeting_summary || '').toLowerCase().includes(s) ||
      new Date(n.note_date).toLocaleDateString().toLowerCase().includes(s)
    )
  }, [q, notes])

  return (
    <div className="space-y-4">
      {/* Header + search */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Recent Progress Notes</h3>
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="border rounded-full px-10 py-2 w-64 bg-gray-100"
            aria-label="Search notes"
          />
          <span className="absolute left-3 top-2.5 text-gray-500" aria-hidden>🔎</span>
        </div>
      </div>

      {/* Results */}
      <div className="divide-y">
        {filtered.map((n) => (
          <div key={n.id} className="flex items-start justify-between py-4">
            <div>
              <div className="font-semibold">
                {new Date(n.note_date).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              {n.meeting_summary && (
                <div className="text-sm text-gray-600 line-clamp-2">
                  {n.meeting_summary}
                </div>
              )}
            </div>
            <button className="text-2xl leading-none px-2" title="More actions">⋯</button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-6 text-sm text-gray-600">No notes found for your search.</div>
        )}
      </div>
    </div>
  )
}
