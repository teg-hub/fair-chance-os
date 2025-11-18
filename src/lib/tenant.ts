// Single-tenant stub; swap back to DB lookup when re-enabling multi-tenancy.
export type Tenant = { id: string; name: string; subdomain: string }

export async function getTenant(): Promise<Tenant> {
  // Use a stable constant; you can change the name freely.
  return { id: 'single', name: 'Single Tenant', subdomain: 'single' }
}
