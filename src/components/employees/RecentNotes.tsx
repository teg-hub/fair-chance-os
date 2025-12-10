'use client'

import { useMemo, useState } from 'react'
import { createSbBrowser } from '@/lib/supabase-browser'

type Note = { id: string; note_date: string; meeting_summary: string | null }

export default function RecentNotes({ notes }: { notes: Note[] }) {
  const sb = createSbBrowser()
  const [q, setQ] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const filtered = useMemo(() => {
    if (!q.trim()) return notes
    const s = q.toLowerCase()
    return notes.filter(n =>
      (n.meeting_summary || '').toLowerCase().includes(s) ||
      new Date(n.note_date).toLocaleDateString().toLowerCase().includes(s)
    )
  }, [q, notes])

  async function onDelete(id: string) {
    if (!confirm('Delete this note? This cannot be undone.')) return
    setBusyId(id)
    const { error } = await sb.from('progress_notes').delete().eq('id', id)
    setBusyId(null)
    if (error) {
      alert(`Delete failed: ${error.message}`)
    } else {
      // refresh page list
      window.location.reload()
    }
  }

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
          <div key={n.id} className="flex items-start justify-between py-4 relative">
            <div>
              <div className="font-semibold">
                {new Date(n.note_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              {n.meeting_summary && (
                <div className="text-sm text-gray-600 line-clamp-2">{n.meeting_summary}</div>
              )}
            </div>

            {/* Kebab menu */}
            <div className="relative">
              <button
                className="text-2xl leading-none px-2"
                title="More actions"
                onClick={() => setOpenId(openId === n.id ? null : n.id)}
                aria-haspopup="menu"
                aria-expanded={openId === n.id}
              >
                ⋯
              </button>
              {openId === n.id && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow"
                  onMouseLeave={() => setOpenId(null)}
                >
                  <a role="menuitem" className="block px-3 py-2 hover:bg-gray-50" href={`/notes/${n.id}`}>View</a>
                  <a role="menuitem" className="block px-3 py-2 hover:bg-gray-50" href={`/notes/${n.id}/edit`}>Edit</a>
                  <button
                    role="menuitem"
                    className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-700 disabled:opacity-50"
                    onClick={() => onDelete(n.id)}
                    disabled={busyId === n.id}
                  >
                    {busyId === n.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-6 text-sm text-gray-600">No notes found for your search.</div>
        )}
      </div>
    </div>
  )
}
