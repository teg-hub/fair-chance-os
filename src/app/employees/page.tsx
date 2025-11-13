import { supabaseServer } from '@/lib/supabase'
import { getTenant } from '@/lib/tenant'
import Link from 'next/link'

export default async function EmployeesPage() {
  const tenant = await getTenant()
  if (!tenant) return null

  // Loosen types to avoid inference issues during setup
  const sb: any = supabaseServer()

  const { data } = await sb
    .from('employees')
    .select(
      'id, first_name, last_name, employment_type, stage, is_active, ' +
      'next_meeting_at:progress_notes!employees_id_fkey(next_meeting_at), ' +
      'departments:department_id(name), coordinator:coordinator_id'
    )
    .eq('tenant_id', tenant.id)
    .limit(200)

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Employees</h1>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Employment Type</th>
              <th className="p-2 text-left">Stage</th>
              <th className="p-2 text-left">Coordinator</th>
              <th className="p-2 text-left">Last Engagement</th>
              <th className="p-2 text-left">Next Meeting</th>
              <th className="p-2 text-left">Open Tasks</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((e: any) => (
              <tr key={e.id} className="border-t hover:bg-slate-50">
                <td className="p-2">
                  <Link className="text-blue-700 hover:underline" href={`/employees/${e.id}`}>
                    {e.first_name} {e.last_name}
                  </Link>
                </td>
                <td className="p-2">{e.departments?.name || '—'}</td>
                <td className="p-2">{e.employment_type}</td>
                <td className="p-2">{e.stage}</td>
                <td className="p-2">{e.coordinator || '—'}</td>
                <td className="p-2">—</td>
                <td className="p-2">
                  {e.next_meeting_at ? new Date(e.next_meeting_at).toLocaleString() : '—'}
                </td>
                <td className="p-2">—</td>
                <td className="p-2">{e.is_active ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
