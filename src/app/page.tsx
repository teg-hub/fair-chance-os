import { supabaseServer } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import BarTile from '@/components/dashboard/BarTile'

export default async function DashboardPage() {
  const sb: any = supabaseServer()

  // No tenant filter in single-tenant mode
  let util: any = null, em: any[] = [], byDept: any[] = [], byAon: any[] = []
  try { ({ data: util } = await sb.from('v_utilization_overall').select('*').maybeSingle()) } catch {}
  try { ({ data: em }   = await sb.from('v_engagements_monthly').select('*').order('month')) } catch {}
  try { ({ data: byDept } = await sb.from('v_engagements_by_department').select('*').order('engagements', { ascending: false })) } catch {}
  try { ({ data: byAon }  = await sb.from('v_engagements_by_aon').select('*').order('engagements', { ascending: false })) } catch {}

  const emData     = (em || []).map((x: any) => ({ x: x.month?.slice(0,10), y: x.engagements }))
  const byDeptData = (byDept || []).map((x: any) => ({ x: x.department || 'Unassigned', y: x.engagements }))
  const byAonData  = (byAon || []).map((x: any) => ({ x: x.area_of_need, y: x.engagements }))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <div className="text-xs text-slate-500">Utilization</div>
        <div className="text-3xl font-semibold">{Math.round(((util?.utilization_ratio || 0) * 100))}%</div>
        <div className="text-xs">{util?.active_participants ?? 0} / {util?.capacity ?? 0}</div>
      </Card>
      <Card className="p-4 col-span-2 lg:col-span-1">
        <div className="text-xs text-slate-500">Engagements Over Time</div>
        <BarTile data={emData} />
      </Card>
      <Card className="p-4">
        <div className="text-xs text-slate-500">Engagements by Department</div>
        <BarTile data={byDeptData} />
      </Card>
      <Card className="p-4">
        <div className="text-xs text-slate-500">Engagements by Area of Need</div>
        <BarTile data={byAonData} />
      </Card>
    </div>
  )
}
