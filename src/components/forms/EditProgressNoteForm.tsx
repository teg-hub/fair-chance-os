'use client'

import { useMemo, useState } from 'react'
import { createSbBrowser } from '@/lib/supabase-browser'

const AREAS = [
  'Food','Clothing','Housing','Financial','Mental Health',
  'Transportation','Legal','Education','Other','Prefer Not To Share'
] as const

const LOCS = ['Office','Newberry','Garage','Community','Phone','Video','Text','Email'] as const

type Note = {
  id: string
  employee_id: string
  note_date: string | null
  meeting_location: string | null
  areas_of_need: string[] | null
  employee_report: string | null
  coordinator_observations: string | null
  short_term_goals: string | null
  long_term_goals: string | null
  referrals: string | null
  next_meeting_at: string | null
  next_meeting_location: string | null
  meeting_summary: string | null
  file_url: string | null
}

function toLocalDatetimeInput(ts: string | null) {
  if (!ts) return ''
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function EditProgressNoteForm({ note }: { note: Note }) {
  const sb = useMemo(() => createSbBrowser(), [])
  const [areas, setAreas] = useState<string[]>(note.areas_of_need ?? [])
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [removeFile, setRemoveFile] = useState(false)

  function toggleArea(a: string) {
    setAreas(s => s.includes(a) ? s.filter(x => x !== a) : [...s, a])
  }

  async function onSubmit(form: FormData) {
    setBusy(true); setErrors([])

    const payload: Partial<Note> = {
      note_date: (form.get('note_date') as string) || null,
      meeting_location: (form.get('meeting_location') as string) || null,
      meeting_summary: ((form.get('meeting_summary') as string) || '').trim() || null,
      employee_report: ((form.get('employee_report') as string) || '').trim() || null,
      coordinator_observations: ((form.get('coordinator_observations') as string) || '').trim() || null,
      short_term_goals: ((form.get('short_term_goals') as string) || '').trim() || null,
      long_term_goals: ((form.get('long_term_goals') as string) || '').trim() || null,
      referrals: ((form.get('referrals') as string) || '').trim() || null,
      next_meeting_at: (form.get('next_meeting_at') as string) || null,
      next_meeting_location: (form.get('next_meeting_location') as string) || null,
      areas_of_need: areas,
    }

    const errs: string[] = []
    if (!payload.note_date) errs.push('Date is required.')
    if (!payload.meeting_location) errs.push('Meeting location is required.')
    if (!payload.meeting_summary) errs.push('Summary of Meeting is required.')
    if (errs.length) { setErrors(errs); setBusy(false); return }

    let file_url = note.file_url
    const file = form.get('file') as File | null
    if (removeFile) file_url = null
    if (file && file.size > 0) {
      const path = `${note.employee_id}/${Date.now()}-${file.name}`
      const { data, error } = await sb.storage.from('documents').upload(path, file, { cacheControl: '3600', upsert: false })
      if (error) { setErrors([`Upload failed: ${error.message}`]); setBusy(false); return }
      file_url = sb.storage.from('documents').getPublicUrl(data.path).data.publicUrl
    }
    payload.file_url = file_url

    const { error } = await sb.from('progress_notes').update(payload).eq('id', note.id)
    setBusy(false)
    if (error) setErrors([error.message]); else window.location.href = `/notes/${note.id}`
  }

  return (
    <form action={async (f) => onSubmit(f)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-blue-800">Edit Progress Note</h1>
        {busy && <span className="text-sm text-slate-600">Saving…</span>}
      </div>

      {errors.length > 0 && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <ul className="list-disc ml-5">{errors.map((e,i)=><li key={i}>{e}</li>)}</ul>
        </div>
      )}

      <div className="card grid md:grid-cols-3 gap-3">
        <label className="text-sm grid gap-1">
          <span>Date <span aria-hidden className="text-red-600">*</span></span>
          <input name="note_date" type="date" required defaultValue={note.note_date ?? ''} className="w-full border rounded p-2" />
        </label>

        <label className="text-sm grid gap-1">
          <span>Meeting Location <span aria-hidden className="text-red-600">*</span></span>
          <select name="meeting_location" required defaultValue={note.meeting_location ?? ''} className="w-full border rounded p-2">
            <option value="" disabled>Choose…</option>
            {LOCS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>

        <label className="text-sm grid gap-1">
          <span>Next Meeting Date & Time</span>
          <input name="next_meeting_at" type="datetime-local" defaultValue={toLocalDatetimeInput(note.next_meeting_at)} className="w-full border rounded p-2" />
        </label>

        <label className="text-sm grid gap-1 md:col-span-3">
          <span>Next Meeting Location</span>
          <select name="next_meeting_location" defaultValue={note.next_meeting_location ?? ''} className="w-full border rounded p-2">
            <option value="">—</option>
            {LOCS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
      </div>

      <div className="card">
        <div className="text-sm font-medium mb-2">Areas of Need</div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Areas of Need">
          {AREAS.map(a => (
            <button
              key={a}
              type="button"
              onClick={()=>toggleArea(a)}
              aria-pressed={areas.includes(a)}
              className={`px-3 py-1 rounded-full border transition ${areas.includes(a)?'bg-blue-600 text-white':'bg-blue-50 text-blue-800 hover:bg-blue-100'}`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <label className="card text-sm grid gap-1">
          <span>Employee’s Report</span>
          <textarea name="employee_report" rows={5} defaultValue={note.employee_report ?? ''} className="w-full border rounded p-2" />
        </label>
        <label className="card text-sm grid gap-1">
          <span>Coordinator Observations & Additional Insights</span>
          <textarea name="coordinator_observations" rows={5} defaultValue={note.coordinator_observations ?? ''} className="w-full border rounded p-2" />
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <label className="card text-sm grid gap-1">
          <span>Short-Term Goals</span>
          <input name="short_term_goals" defaultValue={note.short_term_goals ?? ''} className="w-full border rounded p-2" />
        </label>
        <label className="card text-sm grid gap-1">
          <span>Long-Term Goals</span>
          <input name="long_term_goals" defaultValue={note.long_term_goals ?? ''} className="w-full border rounded p-2" />
        </label>
      </div>

      <label className="card text-sm grid gap-1">
        <span>Referrals Made (if applicable)</span>
        <input name="referrals" defaultValue={note.referrals ?? ''} className="w-full border rounded p-2" />
      </label>

      <label className="card text-sm grid gap-1">
        <span>Summary of Meeting <span aria-hidden className="text-red-600">*</span></span>
        <textarea name="meeting_summary" required rows={5} defaultValue={note.meeting_summary ?? ''} className="w-full border rounded p-2" />
      </label>

      <div className="card grid md:grid-cols-2 gap-3 items-start">
        <div className="text-sm">
          <div className="mb-1">Attachment</div>
          {note.file_url ? (
            <div className="flex items-center gap-3">
              <a className="text-blue-700 underline" href={note.file_url} target="_blank">View current file</a>
              <label className="inline-flex items-center gap-2 text-xs">
                <input type="checkbox" onChange={e=>setRemoveFile(e.target.checked)} />
                Remove existing file
              </label>
            </div>
          ) : (
            <div className="text-xs text-slate-600">No file attached.</div>
          )}
        </div>
        <label className="text-sm grid gap-1">
          <span>Replace with new file (optional)</span>
          <input name="file" type="file" className="w-full" />
          <span className="text-xs text-slate-500">PDFs, images, docs. Stored in Supabase ‘documents’.</span>
        </label>
      </div>

      <div className="flex gap-2">
        <button className="btn" disabled={busy} aria-disabled={busy}>{busy?'Saving…':'Save Changes'}</button>
        <a className="px-4 py-2 rounded-2xl border" href={`/notes/${note.id}`}>Cancel</a>
      </div>
    </form>
  )
}
