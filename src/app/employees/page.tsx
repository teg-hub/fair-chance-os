export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createSbServer } from '@/lib/supabase-server'
import AddEmployee from '@/components/forms/AddEmployee'

export default async function EmployeesPage() {
  const sb = createSbServer()
  const { data, error } = await sb
    .from('employees')
    .select('id, first_name, last_name, name, phone_number, department, employment_type')
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
      <h2 className="text-xl font-semibold text-blue-800">Employees</h2>
      <AddEmployee />
      <div className="grid gap-3">
        {rows.map((e) => (
          <div key={e.id} className="card flex items-center justify-between">
            <div>
              <div className="font-medium">
                {e.first_name && e.last_name ? `${e.first_name} ${e.last_name}` : e.name}
              </div>
              <div className="text-sm text-slate-600">
                {e.department} • {e.employment_type} • {e.phone_number ?? '—'}
              </div>
            </div>
            <div className="flex gap-2">
              <a className="btn" href={`/employees/${e.id}`}>View</a>
              <a className="btn" href={`/notes/new?employee=${e.id}`}>New Note</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
