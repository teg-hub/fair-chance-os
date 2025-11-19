import { createSbServer } from '@/lib/supabase-server'
import NewNote from './new-note'
export default async function EmployeeDetail({ params }: { params: { id: string } }){
  const sb = createSbServer()
  const { data: employee } = await sb.from('employees').select('*').eq('id', params.id).single()
  const { data: notes } = await sb.from('progress_notes').select('*').eq('employee_id', params.id).order('note_date',{ascending:false})
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-semibold text-blue-800">{employee?.name}</h2><p className="text-sm text-slate-600">{employee?.department} • {employee?.employment_type}</p></div>
      <NewNote employeeId={params.id} />
      <div className="grid gap-4">
        {notes?.map(n=> (
          <div key={n.id} className="card">
            <div className="text-sm text-slate-600">{new Date(n.note_date).toLocaleDateString()} • {n.meeting_location}</div>
            <div className="flex flex-wrap gap-2 my-2">{n.areas_of_need?.map((a:string)=> <span key={a} className="badge">{a}</span>)}</div>
            <p className="text-sm whitespace-pre-wrap">{n.meeting_summary}</p>
            {n.file_url && <a className="text-blue-700 underline text-sm" href={n.file_url} target="_blank">View file</a>}
          </div>
        ))}
      </div>
    </div>
  )
}
