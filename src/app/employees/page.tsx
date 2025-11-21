import { createSbServer } from '@/lib/supabase-server'

export default async function EmployeesPage() {
  const sb = createSbServer()
  const { data } = await sb.from('employees').select('id, name, department, employment_type').order('name', { ascending: true })

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-800">Employees</h2>
      <div className="grid gap-3">
        {(data ?? []).map((e) => (
          <div key={e.id} className="card flex items-center justify-between">
            <div>
              <div className="font-medium">{e.name}</div>
              <div className="text-sm text-slate-600">{e.department} • {e.employment_type}</div>
            </div>
            <div className="flex gap-2">
              <a className="btn" href={`/employees/${e.id}`}>View</a>
              <a className="btn" href={`/notes/new?employee=${e.id}`}>{/* NEW */}New Note</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
