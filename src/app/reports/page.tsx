import { createSbServer } from '@/lib/supabase'
export const dynamic = 'force-dynamic'
export default async function Reports(){
  const sb = createSbServer()
  const { data } = await sb.from('kpi_areas_of_need').select('*').limit(1000)
  const rows = data??[]
  const csv = rows.length? [Object.keys(rows[0]).join(','), ...rows.map(r=>Object.values(r).join(','))].join('
') : ''
  return (
    <div className="space-y-4"><h2 className="text-xl font-semibold text-blue-800">Reports & Insights</h2>
      <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`} download="areas_of_need.csv" className="btn">Download Areas of Need (CSV)</a>
    </div>)
}
