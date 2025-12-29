'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CoordinatorSelect({ options }:{
  options: { id: string; full_name: string }[]
}) {
  const router = useRouter()
  const sp = useSearchParams()
  const current = sp.get('coord') ?? ''

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value
    const params = new URLSearchParams(sp.toString())
    if (v) params.set('coord', v); else params.delete('coord')
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-slate-600">Coordinator</label>
      <select className="border rounded p-2" onChange={onChange} value={current}>
        <option value="">All</option>
        {options.map(o => <option key={o.id} value={o.id}>{o.full_name}</option>)}
      </select>
    </div>
  )
}
