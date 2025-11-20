import { createSbServer } from '@/lib/supabase-server'
import { UtilizationBar } from '@/components/charts/UtilizationBar'
import { AreasStacked } from '@/components/charts/AreasStacked'
import { EngagementTrend } from '@/components/charts/EngagementTrend'
import QueryFilters from '@/components/filters/QueryFilters'

const DEPARTMENTS = ['Office','Garage','Operations','Events']
const AREAS = ['Food','Clothing','Housing','Financial','Mental Health','Transportation','Legal','Education','Other','Prefer Not To Share']

function first(q: string | string[] | undefined) {
  if (!q) return ''
  return Array.isArray(q) ? (q[0] ?? '') : q
}
function isoStart(s: string) { return s ? new Date(s + 'T00:00:00Z').toISOString() : '' }
function isoEnd(s: string) { return s ? new Date(s + 'T23:59:59Z').toISOString() : '' }

// NOTE: searchParams must be optional + loose for Next.js App Router
export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const sb = createSbServer()

  const sp = searchParams ?? {}
  const dept = first(sp.dept)
  const coord = first(sp.coord)
  const need  = first(sp.need)
  const start = isoStart(first(sp.start))
  const end   = isoEnd(first(sp.end))

  // Coordinator options
  const { data: coordOpts } = await sb
    .from('coordinators')
    .select('id, full_name')
    .order('full_name', { ascending: true })

  // Program Utilization (monthly)
  let utilQuery = sb
    .from('kpi_program_utilization')
    .select('period_month, department, coordinator_id, progress_notes_count')
    .order('period_month', { ascending: true })
    .limit(24)
  if (dept) utilQuery = utilQuery.eq('department', dept)
  if (coord) utilQuery = utilQuery.eq('coordinator_id', coord)
  if (start) utilQuery = utilQuery.gte('period_month', start)
  if (end) utilQuery   = utilQuery.lte('period_month', end)
  const { data: util } = await utilQuery

  // Areas of Need (stacked)
  let needsQuery = sb
    .from('kpi_areas_of_need')
    .select('period_month, department, coordinator_id, need, notes_tagged')
    .order('period_month', { ascending: true })
    .limit(1000)
  if (dept) needsQuery = needsQuery.eq('department', dept)
  if (coord) needsQuery = needsQuery.eq('coordinator_id', coord)
  if (need) needsQuery = needsQuery.eq('need', need)
  if (start) needsQuery = needsQuery.gte('period_month', start)
  if (end) needsQuery   = needsQuery.lte('period_month', end)
  const { data: needs } = await needsQuery

  // Weekly Engagement (by coordinator)
  let engageQuery = sb
    .from('kpi_engagements_weekly')
    .select('week_start, coordinator_id, employee_id, notes_this_week')
    .order('week_start', { ascending: true })
    .limit(1000)
  // NOTE: If you add department to this view later, enable dept filter here:
  // if (dept) engageQuery = engageQuery.eq('department', dept)
  if (coord) engageQuery = engageQuery.eq('coordinator_id', coord)
  if (start) engageQuery = engageQuery.gte('week_start', start)
  if (end) engageQuery   = engageQuery.lte('week_start', end)
  const { data: engage } = await engageQuery

  // Recent notes (filtered)
  let recentQuery = sb
    .from('progress_notes')
    .select('id, note_date, meeting_location, areas_of_need, department, coordinator_id, meeting_summary')
    .order('note_date', { ascending: false })
    .limit(5)
  if (dept) recentQuery = recentQuery.eq('department', dept)
  if (coord) recentQuery = recentQuery.eq('coordinator_id', coord)
  if (need) recentQuery  = recentQuery.contains('areas_of_need', [need])
  // note_date is DATE; use raw values, not ISO timestamps
  if (first(sp.start)) recentQuery = recentQuery.gte('note_date', first(sp.start)!)
  if (first(sp.end))   recentQuery = recentQuery.lte('note_date', first(sp.end)!)
  const { data: recentNotes } = await recentQuery

  return (
    <div className="space-y-6">
      {/* Filters */}
      <QueryFilters
        departments={DEPARTMENTS}
        coordinators={(coordOpts ?? []).map(c => ({ id: c.id, full_name: c.full_name }))}
        areas={AREAS}
      />

      {/* KPI tiles */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card bg-blue-50">
          <div className="text-sm text-slate-600">Program Utilization (rows)</div>
          <div className="text-3xl font-semibold">{util?.length ?? 0}</div>
        </div>
        <div className="card bg-blue-50">
          <div className="text-sm text-slate-600">Areas of Need (rows)</div>
          <div className="text-3xl font-semibold">{needs?.length ?? 0}</div>
        </div>
        <div className="card bg-blue-50">
          <div className="text-sm text-slate-600">Engagement (rows)</div>
          <div className="text-3xl font-semibold">{engage?.length ?? 0}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="card">
        <h3 className="font-medium mb-2">Utilization by Month</h3>
        <UtilizationBar rows={util ?? []} />
      </div>
      <div className="card">
        <h3 className="font-medium mb-2">Areas of Need by Month (stacked)</h3>
        <AreasStacked rows={needs ?? []} />
      </div>
      <div className="card">
        <h3 className="font-medium mb-2">Weekly Engagement by Coordinator</h3>
        <EngagementTrend rows={engage ?? []} />
      </div>

      {/* Recent Notes */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Recent Progress Notes</h3>
          <a href="/notes" className="text-blue-700 text-sm underline">View all</a>
        </div>
        <div className="grid gap-3">
          {(recentNotes ?? []).map((n: any) => (
            <div key={n.id} className="rounded-xl border p-3 bg-white">
              <div className="text-sm text-slate-600">
                {new Date(n.note_date).toLocaleDateString()} • {n.meeting_location}
              </div>
              <div className="flex flex-wrap gap-2 my-2">
                {(n.areas_of_need as string[] ?? []).map((a: string) => (
                  <span key={a} className="badge">{a}</span>
                ))}
              </div>
              <p className="text-sm whitespace-pre-wrap">{n.meeting_summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
