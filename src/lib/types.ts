export type Json = any
export type Database = {
  public: {
    Tables: {
      tenants: { Row: { id: string; name: string; subdomain: string } }
      employees: { Row: any }
      progress_notes: { Row: any }
    }
    Views: {
      v_utilization_overall: { Row: { tenant_id: string; active_participants: number | null; capacity: number | null; utilization_ratio: number | null } }
      v_engagements_monthly: { Row: { tenant_id: string; month: string; engagements: number } }
      v_engagements_by_department: { Row: { tenant_id: string; department: string | null; engagements: number } }
      v_engagements_by_aon: { Row: { tenant_id: string; area_of_need: string; engagements: number } }
      v_response_rate: { Row: { tenant_id: string; median_hours: number | null; avg_hours: number | null; pct_24h: number | null; pct_48h: number | null; pct_72h: number | null } }
      v_time_to_intake: { Row: { tenant_id: string; avg_days: number | null } }
    }
  }
}
