import { supabaseServer } from '@/lib/supabase'
import { getTenant } from '@/lib/tenant'
import { Card } from '@/components/ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

export default async function DashboardPage() {
  const tenant = await getTenant()
  if (!tenant) return <div className="text-sm">No tenant resolved. Use tenant subdomain.</div>

  // Loosen types to avoid view-generic inference errors during setup
  const sb: any = supabaseServer()

  const { data: util } = await sb
    .from('v_utilization_overall')
    .select('*')
    .eq('tenant_id', tenant.id)
    .maybeSingle()

  const { data: em } = await sb
    .from('v_engagements_monthly')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('month')

  const { data: byDept } = await sb
    .from('v_engagements_by_department')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('engagements', { ascending: false })

  const { data: byAon } = await sb
    .from('v_engagements_by_aon')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('engagements', { ascending: false })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <div className="text-xs text-slate-500">Utilization</div>
        <div className="text-3xl font-semibold">
          {Math.round(((util?.utilization_ratio || 0) * 100))}%
        </div>
        <div className="text-xs">
          {util?.active_participants ?? 0} / {util?.capacity ?? 0}
        </div>
      </Card>

      <Card className="p-4 col-span-2 lg:col-span-1">
        <div className="text-xs text-slate-500">Engagements Over Time</div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={(em || []).map((x: any) => ({ x: x.month?.slice(0, 10), y: x.engagements }))}>
              <XAxis dataKey="x" hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="y" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-xs text-slate-500">Engagements by Department</div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={(byDept || []).map((x: any) => ({ x: x.department || 'Unassigned', y: x.engagements }))}>
              <XAxis dataKey="x" hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="y" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-xs text-slate-500">Engagements by Area of Need</div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={(byAon || []).map((x: any) => ({ x: x.area_of_need, y: x.engagements }))}>
              <XAxis dataKey="x" hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="y" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
