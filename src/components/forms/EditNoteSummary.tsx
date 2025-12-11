'use client'
import { useState } from 'react'
import { createSbBrowser } from '@/lib/supabase-browser'

const LOCS = ['Office','Newberry','Garage','Community','Phone','Video','Text','Email'] as const

export default function EditNoteSummary({ id, note_date, meeting_location, meeting_summary }:{
  id: string; note_date: string; meeting_location: string; meeting_summary: string | null
}) {
  const sb = createSbBrowser()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(f: FormData) {
    setBusy(true); setErr(null)
    const date = f.get('note_date') as string
    const loc = f.get('meeting_location') as string
    const summary = (f.get('meeting_summary') as string) || null
    if (!date || !loc) { setErr('Date and location are required.'); setBusy(false); return }
    const { error } = await sb.from('progress_notes').update({
      note_date: date, meeting_location: loc, meeting_summary: summary
    }).eq('id', id)
    setBusy(false)
    if (error) setErr(error.message); else window.location.href = `/notes/${id}`
  }

  return (
    <form action={onSubmit} className="card space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-blue-800">Edit Note</h2>
        {busy && <span className="text-sm text-slate-600">Saving…</span>}
      </div>
      {err && <div className="text-sm text-red-700">{err}</div>}

      <div className="grid md:grid-cols-3 gap-3">
        <label className="text-sm grid gap-1">
          <span>Date</span>
          <input name="note_date" type="date" defaultValue={note_date} className="border rounded p-2" />
        </label>
        <label className="text-sm grid gap-1">
          <span>Meeting Location</span>
          <select name="meeting_location" defaultValue={meeting_location} className="border rounded p-2">
            {LOCS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
      </div>

      <label className="text-sm grid gap-1">
        <span>Summary</span>
        <textarea name="meeting_summary" rows={5} defaultValue={meeting_summary ?? ''} className="border rounded p-2" />
      </label>

      <div className="flex gap-2">
        <button className="btn" disabled={busy}>Save</button>
        <a className="px-4 py-2 rounded-2xl border" href={`/notes/${id}`}>Cancel</a>
      </div>
    </form>
  )
}
