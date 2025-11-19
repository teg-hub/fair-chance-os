import Link from 'next/link'
import { createSbServer } from '@/lib/supabase-server'
export default async function EmployeesPage(){
  const sb = createSbServer()
  const { data } = await sb.from('employees').select('id,name,department,employment_type').order('name')
  return (
    <div className="grid gap-3">
      {data?.map(e=> (
        <Link key={e.id} href={`/employees/${e.id}`} className="card hover:bg-blue-50">
          <div className="flex items-center justify-between">
            <div><div className="font-medium">{e.name}</div><div className="text-sm text-slate-600">{e.department} • {e.employment_type}</div></div>
            <span className="text-blue-700 text-sm">View</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
