'use client'
import { useState } from 'react'
import { createSbServer } from '@/lib/supabase-server'
const AREAS = ['Food','Clothing','Housing','Financial','Mental Health','Transportation','Legal','Education','Other','Prefer Not To Share']
const LOCS = ['Office','Newberry','Garage','Community','Phone','Video','Text','Email']
export default function NewNote({ employeeId }:{ employeeId:string }){
  const sb = createSbBrowser(); const [areas,setAreas]=useState<string[]>([]); const [busy,setBusy]=useState(false)
  async function onSubmit(form: FormData){
    setBusy(true)
    let file_url: string | null = null
    const file = form.get('file') as File | null
    if(file && file.size>0){
      const path = `${employeeId}/${Date.now()}-${file.name}`
      const { data, error } = await sb.storage.from('documents').upload(path, file)
      if(error){ alert(error.message); setBusy(false); return }
      file_url = sb.storage.from('documents').getPublicUrl(data.path).data.publicUrl
    }
    const payload = {
      employee_id: employeeId,
      note_date: (form.get('note_date') as string) || new Date().toISOString().slice(0,10),
      meeting_location: form.get('meeting_location') as string,
      areas_of_need: areas,
      employee_report: form.get('employee_report') as string,
      coordinator_observations: form.get('coordinator_observations') as string,
      short_term_goals: form.get('short_term_goals') as string,
      long_term_goals: form.get('long_term_goals') as string,
      referrals: form.get('referrals') as string,
      next_meeting_at: form.get('next_meeting_at') as string,
      next_meeting_location: form.get('next_meeting_location') as string,
      meeting_summary: form.get('meeting_summary') as string,
      file_url
    }
    const { error } = await sb.from('progress_notes').insert(payload)
    if(error) alert(error.message); else window.location.reload(); setBusy(false)
  }
  return (
    <form action={async f=>onSubmit(f)} className="card space-y-3">
      <div className="grid md:grid-cols-3 gap-3">
        <label className="text-sm">Date<input name="note_date" type="date" className="w-full border rounded p-2"/></label>
        <label className="text-sm">Meeting Location<select name="meeting_location" className="w-full border rounded p-2">{LOCS.map(l=> <option key={l}>{l}</option>)}</select></label>
        <label className="text-sm">Next Meeting Date & Time<input name="next_meeting_at" type="datetime-local" className="w-full border rounded p-2"/></label>
      </div>
      <div className="text-sm font-medium">Areas of Need</div>
      <div className="flex flex-wrap gap-2">{AREAS.map(a=> (
        <button type="button" key={a} onClick={()=>setAreas(s=> s.includes(a)? s.filter(x=>x!==a):[...s,a])}
        className={`px-3 py-1 rounded-full border ${areas.includes(a)?'bg-blue-600 text-white':'bg-blue-50 text-blue-800'}`}>{a}</button>))}
      </div>
      <textarea name="employee_report" placeholder="Employee's Report" className="w-full border rounded p-2"/>
      <textarea name="coordinator_observations" placeholder="Coordinator Observations and Additional Insights" className="w-full border rounded p-2"/>
      <input name="short_term_goals" placeholder="Short-Term Goals" className="w-full border rounded p-2"/>
      <input name="long_term_goals" placeholder="Long-Term Goals" className="w-full border rounded p-2"/>
      <input name="referrals" placeholder="Referrals Made (if applicable)" className="w-full border rounded p-2"/>
      <label className="text-sm">Next Meeting Location<select name="next_meeting_location" className="w-full border rounded p-2"><option value="">—</option>{LOCS.map(l=> <option key={l}>{l}</option>)}</select></label>
      <textarea name="meeting_summary" placeholder="Summary of Meeting" className="w-full border rounded p-2"/>
      <input name="file" type="file" className="block"/>
      <button disabled={busy} className="btn">{busy?'Saving…':'Save Note'}</button>
    </form>
  )
}
