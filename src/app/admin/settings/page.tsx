'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'

export default function AdminSettings(){
  const sb = supabaseBrowser()
  const [dept, setDept] = useState<string>('')
  const [depts, setDepts] = useState<any[]>([])

  useEffect(()=>{ (async()=>{
    const { data } = await sb.from('departments').select('*').order('sort_order')
    setDepts(data||[])
  })() },[])

  async function addDept(){
    if(!dept) return
    await sb.from('departments').insert({ name: dept })
    setDept('')
    const { data } = await sb.from('departments').select('*').order('sort_order')
    setDepts(data||[])
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Admin Settings</h1>
      <div className="border rounded p-4 bg-white">
        <div className="font-medium mb-2">Departments</div>
        <div className="flex gap-2">
          <input className="border rounded px-2 py-1" value={dept} onChange={e=>setDept(e.target.value)} placeholder="Add department"/>
          <button className="border rounded px-3 py-1" onClick={addDept}>Add</button>
        </div>
        <ul className="mt-3 text-sm list-disc pl-5">
          {depts.map(d=> <li key={d.id}>{d.name}</li>)}
        </ul>
      </div>
    </div>
  )
