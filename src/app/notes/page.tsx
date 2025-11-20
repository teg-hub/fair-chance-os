import { createSbServer } from '@/lib/supabase-server'

export default async function NotesPage(){
  const sb = createSbServer()
  const { data } = await sb
    .from('progress_notes')
    .select('id, note_date, meeting_location, areas_of_need, employee_id, meeting_summary')
    .order('note_date', { ascending: false })
    .limit(200)
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-800">All Progress Notes</h2>
      <div className="grid gap-3">
        {(data??[]).map((n:any) => (
          <div key={n.id} className="card">
            <div className="text-sm text-slate-600">{new Date(n.note_date).toLocaleDateString()} • {n.meeting_location}</div>
            <div className="flex flex-wrap gap-2 my-2">{(n.areas_of_need as string[] ?? []).map((a:string) => <span key={a} className="badge">{a}</span>)}</div>
            <p className="text-sm whitespace-pre-wrap">{n.meeting_summary}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
