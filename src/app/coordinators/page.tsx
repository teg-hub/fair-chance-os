import { createSbServer } from '@/lib/supabase'
export default async function Coordinators(){
  const sb = createSbServer()
  const { data } = await sb.from('kpi_program_utilization').select('*').order('period_month',{ascending:false}).limit(24)
  return (<div className="space-y-3"><h2 className="text-xl font-semibold text-blue-800">Coordinator KPIs</h2><pre className="card overflow-auto text-sm">{JSON.stringify(data??[],null,2)}</pre></div>)
}
