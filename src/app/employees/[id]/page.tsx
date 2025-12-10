import { createSbServer } from '@/lib/supabase-server'
import RecentNotes from '@/components/employees/RecentNotes'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EmployeeDetail({ params }: { params: { id: string } }) {
  const sb = createSbServer()

  const { data: employee, error: empErr } = await sb
    .from('employees')
    .select('id, first_name, last_name, name, phone_number, department, employment_type, created_at')
    .eq('id', params.id)
    .single()

  if (empErr || !employee) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold text-blue-800">Employee</h2>
        <p className="text-red-700 text-sm mt-2">Error: {empErr?.message ?? 'Not found'}</p>
      </div>
    )
  }

  const { count: notesCount } = await sb
    .from('progress_notes')
    .select('id', { count: 'exact', head: true })
    .eq('employee_id', employee.id)

  const { data: recentNotes } = await sb
    .from('progress_notes')
    .select('id, note_date, meeting_summary')
    .eq('employee_id', employee.id)
    .order('note_date', { ascending: false })
    .limit(10)

  const fullName =
    (employee.first_name && employee.last_name)
      ? `${employee.first_name} ${employee.last_name}`
      : employee.name

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h1 className="text-3xl font-bold text-blue-900">{fullName}</h1>
        <a href={`/employees/${employee.id}/edit`} className="px-4 py-2 rounded-xl border bg-amber-500 text-white hover:bg-amber-600">
          ✏️ Edit
        </a>
      </div>

      {/* Top stats grid */}
      <div className="grid md:grid-cols-5 gap-8 text-sm">
        <div>
          <div className="text-gray-500">Phone Number</div>
          <div className="mt-1">{employee.phone_number ?? '—'}</div>
        </div>
        <div>
          <div className="text-gray-500">Department</div>
          <div className="mt-1">{employee.department}</div>
        </div>
        <div>
          <div className="text-gray-500">Employment Type</div>
          <div className="mt-1">{employee.employment_type}</div>
        </div>
        <div>
          <div className="text-gray-500">Date Added</div>
          <div className="mt-1">
            {employee.created_at ? new Date(employee.created_at).toLocaleDateString() : '—'}
          </div>
        </div>
        <div>
          <div className="text-gray-500">Total Notes Logged</div>
          <div className="mt-1">{notesCount ?? 0}</div>
        </div>
      </div>

      {/* Recent notes header with compact New Note link */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Recent Progress Notes</h2>
        <a
          href={`/notes/new?employee=${employee.id}`}
          className="px-3 py-1.5 rounded-lg border text-blue-700 hover:bg-blue-50"
        >
          + New Note
        </a>
      </div>

      {/* Recent notes list */}
      <RecentNotes notes={(recentNotes ?? []).map(n => ({
        id: n.id,
        note_date: n.note_date as string,
        meeting_summary: (n as any).meeting_summary ?? null
      }))} />
    </div>
  )
}
