import { supabaseServer } from '@/lib/supabase'

export default async function CoordinatorAnalytics() {
  const sb: any = supabaseServer()
  const { data: rr }  = await sb.from('v_response_rate').select('*').maybeSingle()
  const { data: tti } = await sb.from('v_time_to_intake').select('*').maybeSingle()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Coordinator Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border rounded-lg p-4 bg-white">
          <div className="text-xs text-slate-500">Median Response Time</div>
          <div className="text-3xl font-semibold">{rr?.median_hours?.toFixed?.(1) ?? '—'} hrs</div>
        </div>
        <div className="border rounded-lg p-4 bg-white">
          <div className="text-xs text-slate-500">Avg Time to Intake</div>
          <div className="text-3xl font-semibold">{tti?.avg_days?.toFixed?.(1) ?? '—'} days</div>
        </div>
      </div>
    </div>
  )
}
