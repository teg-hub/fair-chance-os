import { supabaseServer } from '@/lib/supabase'
import { getTenant } from '@/lib/tenant'

export default async function EmployeeDetail({ params }: { params: { id: string } }) {
  const tenant = await getTenant(); if (!tenant) return null
  const sb = supabaseServer()
  const [{ data: emp }, { data: notes }] = await Promise.all([
    sb.from('employees').select('*').eq('tenant_id', tenant.id).eq('id', params.id).maybeSingle(),
    sb.from('progress_notes').select('*').eq('tenant_id', tenant.id).eq('employee_id', params.id).order('note_date', { ascending: false })
  ])
  if (!emp) return <div>Not found</div>
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{emp.first_name} {emp.last_name}</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          <div className="border rounded-lg p-3 bg-white">
            <div className="font-medium mb-2">Progress Notes</div>
            <ul className="space-y-2">
              {(notes||[]).map((n:any)=> (
                <li key={n.id} className="border rounded p-2">
                  <div className="text-xs text-slate-500">{n.note_date}</div>
                  <div className="text-sm">{n.summary || 'No summary provided.'}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <aside className="space-y-3">
          <div className="border rounded-lg p-3 bg-white">
            <div className="font-medium mb-2">Profile</div>
            <div className="text-sm space-y-1">
              <div>Department: {emp.department_id || '—'}</div>
              <div>Employment: {emp.employment_type}</div>
              <div>Stage: {emp.stage}</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
