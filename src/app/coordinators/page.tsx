import { createSbServer } from '@/lib/supabase-server'
import { EngagementTrend } from '@/components/charts/EngagementTrend'

export default async function Coordinators(){
  const sb = createSbServer()
  const { data } = await sb
    .from('kpi_engagements_weekly')
    .select('week_start, coordinator_id, employee_id, notes_this_week')
    .order('week_start', { ascending: true })
    .limit(500)
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-800">Coordinator KPIs</h2>
      <div className="card">
        <EngagementTrend rows={data ?? []} />
      </div>
    </div>
  )
}
