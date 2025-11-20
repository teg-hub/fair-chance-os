import { createSbServer } from '@/lib/supabase-server'
import QueryFilters from '@/components/filters/QueryFilters'

const DEPARTMENTS = ['Office','Garage','Operations','Events']
const AREAS = ['Food','Clothing','Housing','Financial','Mental Health','Transportation','Legal','Education','Other','Prefer Not To Share']

type Search = {
  dept?: string | string[]
  coord?: string | string[]
  start?: string | string[]
  end?: string | string[]
  need?: string | string[]
}

function first(q: string | string[] | undefined) {
  if (!q) return ''
  return Array.isArray(q) ? (q[0] ?? '') : q
}

export default async function NotesPage({ searchParams }: { searchParams: Search }) {
  const sb = createSbServer()

  const dept = first(searchParams.dept)
  const coord = first(searchParams.coord)
  const need  = first(searchParams.need)
  const start = first(searchParams.start) // date column is 'date' here, not timestamp
  const end   = first(searchParams.end)

  // options for Coordinator select
  const { data: coordOpts } = await sb
    .from('coordinators')
    .select('id, full_name')
    .order('full_name', { ascending: true })

  let q = sb
    .from('progress_notes')
    .select('id, note_date, meeting_location, areas_of_need, department, coordinator_id, meeting_summary')
    .order('note_date', { ascending: false })
    .limit(200)

  if (dept) q = q.eq('department', dept)
  if (coord) q = q.eq('coordinator_id', coord)
  if (need) q  = q.contains('areas_of_need', [need])
  if (start) q = q.gte('note_date', start)
  if (end) q   = q.lte('note_date', end)

  const { data } = await q

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-800">All Progress Notes</h2>

      <QueryFilters
        departments={DEPARTMENTS}
        coordinators={(coordOpts ?? []).map(c => ({ id: c.id, full_name: c.full_name }))}
        areas={AREAS}
      />

      <div className="grid gap-3">
        {(data??[]).map((n:any) => (
          <div key={n.id} className="card">
            <div className="text-sm text-slate-600">
              {new Date(n.note_date).toLocaleDateString()} • {n.meeting_location}
            </div>
            <div className="flex flex-wrap gap-2 my-2">
              {(n.areas_of_need as string[] ?? []).map((a:string) => <span key={a} className="badge">{a}</span>)}
            </div>
            <p className="text-sm whitespace-pre-wrap">{n.meeting_summary}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
