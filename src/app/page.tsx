import { createSbServer } from '@/lib/supabase-server'
import { UtilizationBar } from '@/components/charts/UtilizationBar'
import { AreasStacked } from '@/components/charts/AreasStacked'
import { EngagementTrend } from '@/components/charts/EngagementTrend'

export default async function Dashboard(){
  const sb = createSbServer()

  // KPI datasets
  const { data: util } = await sb
    .from('kpi_program_utilization')
    .select('period_month, department, progress_notes_count')
    .order('period_month',{ascending:true})
    .limit(24)

  const { data: needs } = await sb
    .from('kpi_areas_of_need')
    .select('period_month, department, need, notes_tagged')
    .order('period_month',{ascending:true})
    .limit(500)

  const { data: engage } = await sb
    .from('kpi_engagements_weekly')
    .select('week_start, coordinator_id, employee_id, notes_this_week')
    .order('week_start',{ascending:true})
    .limit(500)

  // NEW: recent progress notes (top 5 newest)
  const { data: recentNotes } = await sb
    .from('progress_notes')
    .select('id, note_date, meeting_location, areas_of_need, meeting_summary')
    .order('note_date', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
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

      {/* NEW: Recent Progress Notes */}
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

