'use client'

import { useState, useMemo } from 'react'
import { createSbBrowser } from '@/lib/supabase-browser'

type Props = {
  employeeId: string
  onSaved?: () => void
}

const AREAS = [
  'Food','Clothing','Housing','Financial','Mental Health',
  'Transportation','Legal','Education','Other','Prefer Not To Share'
] as const

const LOCS = ['Office','Newberry','Garage','Community','Phone','Video','Text','Email'] as const

export default function ProgressNoteForm({ employeeId, onSaved }: Props) {
  const sb = useMemo(() => createSbBrowser(), [])
  const [areas, setAreas] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  async function onSubmit(form: FormData) {
    setBusy(true)
    setErrors([])

    // --- Basic validation
    const note_date = (form.get('note_date') as string) || ''
    const meeting_location = (form.get('meeting_location') as string) || ''
    const meeting_summary = (form.get('meeting_summary') as string) || ''

    const errs: string[] = []
    if (!note_date) errs.push('Date is required.')
    if (!meeting_location) errs.push('Meeting location is required.')
    if (!meeting_summary.trim()) errs.push('Summary of Meeting is required.')
    if (errs.length) {
      setErrors(errs)
      setBusy(false)
      return
    }

    // --- Optional file upload
    let file_url: string | null = null
    const file = form.get('file') as File | null
    if (file && file.size > 0) {
      const path = `${employeeId}/${Date.now()}-${file.name}`
      const { data, error } = await sb.storage.from('documents').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })
      if (error) {
        setErrors([`Upload failed: ${error.message}`])
        setBusy(false)
        return
      }
      file_url = sb.storage.from('documents').getPublicUrl(data.path).data.publicUrl
    }

    // --- Build payload
    const payload = {
      employee_id: employeeId,
      note_date, // DATE (YYYY-MM-DD)
      meeting_location,
      areas_of_need: areas,
      employee_report: (form.get('employee_report') as string) || null,
      coordinator_observations: (form.get('coordinator_observations') as string) || null,
      short_term_goals: (form.get('short_term_goals') as string) || null,
      long_term_goals: (form.get('long_term_goals') as string) || null,
      referrals: (form.get('referrals') as string) || null,
      next_meeting_at: (form.get('next_meeting_at') as string) || null, // TIMESTAMP
      next_meeting_location: (form.get('next_meeting_location') as string) || null,
      meeting_summary,
      file_url,
    }

    const { error } = await sb.from('progress_notes').insert(payload)
    setBusy(false)
    if (error) {
      setErrors([error.message])
      return
    }
    // Success – either callback (for modals) or refresh page list
    if (onSaved) onSaved()
    else window.location.reload()
  }

  function toggleArea(a: string) {
    setAreas((s) => (s.includes(a) ? s.filter((x) => x !== a) : [...s, a]))
  }

  return (
    <form action={async (f) => onSubmit(f)} className="card space-y-4" aria-labelledby="progress-note-title">
      <div className="flex items-center justify-between">
        <h3 id="progress-note-title" className="text-lg font-semibold text-blue-800">
          New Progress Note
        </h3>
        {busy && <span className="text-sm text-slate-600">Saving…</span>}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <ul className="list-disc ml-5">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {/* Row 1: Date / Location / Next Meeting DateTime */}
      <div className="grid md:grid-cols-3 gap-3">
        <label className="text-sm grid gap-1">
          <span>Date <span aria-hidden className="text-red-600">*</span></span>
          <input
            name="note_date"
            type="date"
            required
            className="w-full border rounded p-2"
            aria-required="true"
          />
        </label>

        <label className="text-sm grid gap-1">
          <span>Meeting Location <span aria-hidden className="text-red-600">*</span></span>
          <select
            name="meeting_location"
            required
            className="w-full border rounded p-2"
            aria-required="true"
            defaultValue=""
          >
            <option value="" disabled>Choose…</option>
            {LOCS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>

        <label className="text-sm grid gap-1">
          <span>Next Meeting Date & Time</span>
          <input
            name="next_meeting_at"
            type="datetime-local"
            className="w-full border rounded p-2"
          />
        </label>
      </div>

      {/* Areas of Need */}
      <div className="text-sm font-medium">Areas of Need</div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Areas of Need">
        {AREAS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => toggleArea(a)}
            aria-pressed={areas.includes(a)}
            className={`px-3 py-1 rounded-full border transition
              ${areas.includes(a) ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-800 hover:bg-blue-100'}`}
          >
            {a}
          </button>
        ))}
      </div>

      {/* Narrative sections */}
      <div className="grid md:grid-cols-2 gap-3">
        <label className="text-sm grid gap-1">
          <span>Employee’s Report</span>
          <textarea name="employee_report" rows={4} className="w-full border rounded p-2" placeholder="What did the employee share?" />
        </label>

        <label className="text-sm grid gap-1">
          <span>Coordinator Observations & Additional Insights</span>
          <textarea name="coordinator_observations" rows={4} className="w-full border rounded p-2" placeholder="Observations, context, risks, etc." />
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <label className="text-sm grid gap-1">
          <span>Short-Term Goals</span>
          <input name="short_term_goals" className="w-full border rounded p-2" placeholder="e.g., schedule counseling intake" />
        </label>
        <label className="text-sm grid gap-1">
          <span>Long-Term Goals</span>
          <input name="long_term_goals" className="w-full border rounded p-2" placeholder="e.g., complete GED program" />
        </label>
      </div>

      <label className="text-sm grid gap-1">
        <span>Referrals Made (if applicable)</span>
        <input name="referrals" className="w-full border rounded p-2" placeholder="e.g., Food bank, legal aid, etc." />
      </label>

      {/* Next Meeting Location */}
      <label className="text-sm grid gap-1">
        <span>Next Meeting Location</span>
        <select name="next_meeting_location" className="w-full border rounded p-2" defaultValue="">
          <option value="">—</option>
          {LOCS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </label>

      {/* Summary */}
      <label className="text-sm grid gap-1">
        <span>Summary of Meeting <span aria-hidden className="text-red-600">*</span></span>
        <textarea
          name="meeting_summary"
          required
          rows={4}
          className="w-full border rounded p-2"
          placeholder="Concise summary and next steps"
          aria-required="true"
        />
      </label>

      {/* File upload */}
      <div className="grid md:grid-cols-2 gap-3">
        <label className="text-sm grid gap-1">
          <span>Attach File (optional)</span>
          <input name="file" type="file" className="w-full" />
          <span className="text-xs text-slate-500">Accepted: PDFs, images, docs. Stored in Supabase ‘documents’ bucket.</span>
        </label>
      </div>

      <div className="flex gap-2">
        <button disabled={busy} className="btn" aria-disabled={busy}>
          {busy ? 'Saving…' : 'Save Note'}
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-2xl border"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
      </div>

      {/* Helpful: links to the uploaded field screenshots (from your attachments) */}
      <details className="text-xs text-slate-600">
        <summary>View reference screenshots</summary>
        <ul className="list-disc ml-4 mt-2">
          <li><a className="underline" href="/mnt/data/Untitled10.png" target="_blank" rel="noreferrer">Progress Note – Part 1</a></li>
          <li><a className="underline" href="/mnt/data/Untitled11.png" target="_blank" rel="noreferrer">Progress Note – Part 2</a></li>
        </ul>
      </details>
    </form>
  )
}
