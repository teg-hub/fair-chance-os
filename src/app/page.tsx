import { createSbServer } from '@/lib/supabase'
export default async function Dashboard(){
  const sb = createSbServer()
  const { data: util } = await sb.from('kpi_program_utilization').select('*').order('period_month',{ascending:false}).limit(6)
  const { data: needs } = await sb.from('kpi_areas_of_need').select('*').order('period_month',{ascending:false}).limit(12)
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="card bg-blue-50"><div className="text-sm text-slate-600">Program Utilization rows (last 6)</div><div className="text-3xl font-semibold">{util?.length ?? 0}</div></div>
      <div className="card bg-blue-50"><div className="text-sm text-slate-600">Areas of Need rows</div><div className="text-3xl font-semibold">{needs?.length ?? 0}</div></div>
      <div className="card bg-blue-50"><div className="text-sm text-slate-600">Engagements view ready</div><div className="text-3xl font-semibold">—</div></div>
    </div>
  )
}
