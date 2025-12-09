'use client'
import { useState } from 'react'
import { createSbBrowser } from '@/lib/supabase-browser'

const DEPTS = ['Office','Garage','Operations','Events'] as const
const TYPES = ['Full Time','Part Time'] as const

export default function AddEmployee() {
  const sb = createSbBrowser()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(f: FormData) {
    setBusy(true); setErr(null)
    const name = (f.get('name') as string)?.trim()
    const phone_number = (f.get('phone_number') as string)?.trim()
    const department = f.get('department') as string
    const employment_type = f.get('employment_type') as string
    if (!name || !department || !employment_type) { setErr('Name, Department, and Employment Type are required.'); setBusy(false); return }
    const { error } = await sb.from('employees').insert({ name, phone_number, department, employment_type })
    setBusy(false)
    if (error) setErr(error.message); else window.location.reload()
  }

  return (
    <form action={onSubmit} className="card space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-blue-800">Add Employee</h3>
        {busy && <span className="text-sm text-slate-600">Saving…</span>}
      </div>
      {err && <div className="text-sm text-red-700">{err}</div>}
      <div className="grid md:grid-cols-4 gap-2">
        <input name="name" placeholder="Full name*" className="border rounded p-2" />
        <input name="phone_number" placeholder="Phone" className="border rounded p-2" />
        <select name="department" defaultValue="" className="border rounded p-2">
          <option value="" disabled>Department*</option>
          {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select name="employment_type" defaultValue="" className="border rounded p-2">
          <option value="" disabled>Employment Type*</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <button className="btn" disabled={busy}>Add</button>
    </form>
  )
}
