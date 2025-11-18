'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase'

type AON = { id: string; name: string }
type SelectOpt = { value: string; label: string }

const DEFAULT_MEETING_LOCS: SelectOpt[] = [
  { value: 'Garage', label: 'Garage' },
  { value: 'Newberry', label: 'Newberry' },
  { value: 'Office', label: 'Office' },
  { value: 'Community', label: 'Community' },
  { value: 'Phone', label: 'Phone' },
  { value: 'Video', label: 'Video' },
  { value: 'Text', label: 'Text' },
  { value: 'Email', label: 'Email' },
]

export default function NewProgressNote({ params }: { params: { id: string } }) {
  const router = useRouter()
  const sb = supabaseBrowser()

  // Form state
  const [noteDate, setNoteDate] = useState<string>(() => new Date().toISOString().slice(0,16)) // datetime-local
  const [meetingLoc, setMeetingLoc] = useState<string>('Office')
  const [aonOptions, setAonOptions] = useState<AON[]>([])
  const [aonSelected, setAonSelected] = useState<string[]>([])
  const [employeeReport, setEmployeeReport] = useState('')
  const [coordinatorObs, setCoordinatorObs] = useState('')
  const [shortTerm, setShortTerm] = useState('')
  const [longTerm, setLongTerm] = useState('')
  const [empFollowUp, setEmpFollowUp] = useState('')
  const [empFollowUpDue, setEmpFollowUpDue] = useState<string>('')
  const [coordFollowUp, setCoordFollowUp] = useState('')
  const [coordFollowUpDue, setCoordFollowUpDue] = useState<string>('')
  const [referralsMade, setReferralsMade] = useState('')
  const [nextMeetingAt, setNextMeetingAt] = useState<string>('')
  const [nextMeetingLoc, setNextMeetingLoc] = useState<string>('Office')
  const [summary, setSummary] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Areas of Need options from DB (fallback to defaults if table empty)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data, error } = await sb.from('areas_of_need').select('id,name').order('name')
      if (mounted) {
        if (!error && data?.length) setAonOptions(data as AON[])
        else setAonOptions([
          { id: 'food', name: 'Food' },
          { id: 'clothing', name: 'Clothing' },
          { id: 'housing', name: 'Housing' },
          { id: 'transportation', name: 'Transportation' },
          { id: 'legal', name: 'Legal' },
          { id: 'mental', name: 'Mental Health/Recovery' },
          { id: 'education', name: 'Education' },
          { id: 'financial', name: 'Financial' },
          { id: 'other', name: 'Other/Prefer Not to Share' },
        ])
      }
    })()
    return () => { mounted = false }
  }, [sb])

  const aonLookup = useMemo(() => {
    const m = new Map<string,string>()
    aonOptions.forEach(o => m.set(o.id, o.name))
    return m
  }, [aonOptions])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      // Optional: upload file first
      let attachment_url: string | null = null
      if (file) {
        const bucket = 'files' // ensure bucket exists with permissive policy for authenticated
        const path = `progress_notes/${params.id}/${Date.now()}_${file.name}`
        const { error: upErr } = await sb.storage.from(bucket).upload(path, file, {
          // 10GB uploads would need chunking; this is a simple pilot implementation
          cacheControl: '3600',
          upsert: false
        })
        if (upErr) throw upErr
        const { data: pub } = sb.storage.from(bucket).getPublicUrl(path)
        attachment_url = pub?.publicUrl ?? null
      }

      // Build insert payload — align with your app.progress_notes table
      const payload: any = {
        employee_id: params.id,
        note_date: new Date(noteDate).toISOString(),
        meeting_location: meetingLoc,
        areas_of_need: aonSelected, // assumes text[] in DB
        employee_report: employeeReport || null,
        coordinator_observations: coordinatorObs || null,
        short_term_goals: shortTerm || null,
        long_term_goals: longTerm || null,
        employee_followup: empFollowUp || null,
        employee_followup_due: empFollowUpDue ? new Date(empFollowUpDue).toISOString() : null,
        coordinator_followup: coordFollowUp || null,
        coordinator_followup_due: coordFollowUpDue ? new Date(coordFollowUpDue).toISOString() : null,
        referrals_made: referralsMade || null,
        next_meeting_at: nextMeetingAt ? new Date(nextMeetingAt).toISOString() : null,
        next_meeting_location: nextMeetingLoc || null,
        summary: summary || null,
        attachment_url,
      }

      const { error: insErr } = await sb.from('progress_notes').insert(payload)
      if (insErr) throw insErr
      router.replace(`/employees/${params.id}`)
    } catch (err: any) {
      setError(err?.message || 'Failed to save progress note.')
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold mb-4">New Progress Note</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Date & Time</label>
          <input type="datetime-local" className="border rounded px-3 py-2 w-full"
                 value={noteDate} onChange={e => setNoteDate(e.target.value)} required />
        </div>

        {/* Meeting Location */}
        <div>
          <label className="block text-sm font-medium mb-1">Meeting Location</label>
          <select className="border rounded px-3 py-2 w-full"
                  value={meetingLoc} onChange={e => setMeetingLoc(e.target.value)}>
            {DEFAULT_MEETING_LOCS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* Areas of Need multi-select (checkboxes for accessibility) */}
        <div>
          <div className="block text-sm font-medium mb-1">Areas of Need</div>
          <div className="grid grid-cols-2 gap-2">
            {aonOptions.map(a => (
              <label key={a.id} className="inline-flex items-center gap-2">
                <input type="checkbox"
                       checked={aonSelected.includes(a.id)}
                       onChange={(e) => {
                         const checked = e.target.checked
                         setAonSelected(prev => checked ? [...prev, a.id] : prev.filter(x => x !== a.id))
                       }} />
                <span>{a.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Narrative fields */}
        <Textarea label="Employee's Report" value={employeeReport} onChange={setEmployeeReport} />
        <Textarea label="Coordinator Observations and Additional Insights" value={coordinatorObs} onChange={setCoordinatorObs} />
        <Textarea label="Short-Term Goals" value={shortTerm} onChange={setShortTerm} />
        <Textarea label="Long-Term Goals" value={longTerm} onChange={setLongTerm} />

        {/* Follow-ups */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee Follow-up Actions</label>
            <input className="border rounded px-3 py-2 w-full" value={empFollowUp} onChange={e=>setEmpFollowUp(e.target.value)} />
            <label className="block text-xs text-slate-600 mt-2">Due date</label>
            <input type="date" className="border rounded px-3 py-2 w-full" value={empFollowUpDue} onChange={e=>setEmpFollowUpDue(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coordinator Follow-up Actions</label>
            <input className="border rounded px-3 py-2 w-full" value={coordFollowUp} onChange={e=>setCoordFollowUp(e.target.value)} />
            <label className="block text-xs text-slate-600 mt-2">Due date</label>
            <input type="date" className="border rounded px-3 py-2 w-full" value={coordFollowUpDue} onChange={e=>setCoordFollowUpDue(e.target.value)} />
          </div>
        </div>

        {/* Referrals */}
        <Textarea label="Referrals Made (if applicable)" value={referralsMade} onChange={setReferralsMade} />

        {/* Next meeting */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Next Meeting Date & Time</label>
            <input type="datetime-local" className="border rounded px-3 py-2 w-full"
                   value={nextMeetingAt} onChange={e=>setNextMeetingAt(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Next Meeting Location</label>
            <select className="border rounded px-3 py-2 w-full"
                    value={nextMeetingLoc} onChange={e=>setNextMeetingLoc(e.target.value)}>
              {DEFAULT_MEETING_LOCS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        {/* Summary */}
        <Textarea label="Summary of Meeting" value={summary} onChange={setSummary} />

        {/* Attachment */}
        <div>
          <label className="block text-sm font-medium mb-1">File Link/Attachment</label>
          <input type="file" className="block w-full" accept=".doc,.docx,.pdf,.jpg,.jpeg,.png"
                 onChange={e=>setFile(e.target.files?.[0] ?? null)} />
          <p className="text-xs text-slate-600 mt-1">Max pilot uploads are limited by Vercel/Supabase defaults; for 10GB, we’ll add chunked uploads later.</p>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex items-center gap-2">
          <button type="submit" disabled={submitting}
                  className="border rounded px-4 py-2 bg-blue-600 text-white disabled:opacity-50">
            {submitting ? 'Saving…' : 'Save Note'}
          </button>
          <button type="button" className="border rounded px-4 py-2"
                  onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function Textarea(props: { label: string; value: string; onChange: (v: string)=>void }) {
  const { label, value, onChange } = props
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea className="border rounded px-3 py-2 w-full min-h-[100px]"
                value={value} onChange={e=>onChange(e.target.value)} />
    </div>
  )
}
