// Minimal DB types with the "app" schema so we can point the Supabase client at it.
// Replace later with `supabase gen types` output.
export type Database = {
  app: {
    Tables: {
      tenants: { Row: { id: string; name: string; subdomain: string } }
      employees: { Row: any }
      progress_notes: { Row: any }
    }
    Views: {
      v_utilization_overall: { Row: { tenant_id: string; active_participants: number | null; capacity: number | null; utilization_ratio: number | null } }
      v_engagements_monthly: { Row: { tenant_id: string; month: string; engagements: number } }
      v_engagements_by_department: { Row: { tenant_id: string | null; department: string | null; engagements: number } }
      v_engagements_by_aon: { Row: { tenant_id: string; area_of_need: string; engagements: number } }
      v_response_rate: { Row: any }
      v_time_to_intake: { Row: any }
    }
  }
  public: any
}
