export const dynamic = 'force-dynamic'   // no static cache
export const revalidate = 0              // don't cache between requests

import { createSbServer } from '@/lib/supabase-server'

export default async function EmployeesPage() {
  const sb = createSbServer()
  const { data, error } = await sb
    .from('employees')
    .select('id, name, phone_number, department, employment_type')
    .order('name', { ascending: true })

  if (error) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold text-blue-800">Employees</h2>
        <p className="text-red-700 text-sm mt-2">Error loading employees: {error.message}</p>
      </div>
    )
  }

  const rows = data ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-blue-800">Employees</h2>
        <a className="btn" href="/notes/new">New Note</a>
      </div>

      {rows.length === 0 ? (
        <div className="card">
          <p className="text-sm text-slate-700">No employees found. Try the seed below and refresh:</p>
          <pre className="text-xs bg-blue-50 p-3 rounded mt-2 overflow-auto">
{`insert into public.employees (id, name, phone_number, department, employment_type)
values ('00000000-0000-4000-8000-000000000001','Alex Johnson','513-555-0100','Office','Full Time')
on conflict (id) do nothing;`}
          </pre>
        </div>
      ) : (
        <div className="grid gap-3">
          {rows.map((e) => (
            <div key={e.id} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">{e.name}</div>
                <div className="text-sm text-slate-600">
                  {e.department} • {e.employment_type} • {e.phone}
                </div>
              </div>
              <div className="flex gap-2">
                <a className="btn" href={`/employees/${e.id}`}>View</a>
                <a className="btn" href={`/notes/new?employee=${e.id}`}>New Note</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
