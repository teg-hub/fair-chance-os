'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'


type Row = { period_month: string; department: string; progress_notes_count: number }
export function UtilizationBar({ rows }: { rows: Row[] }){
const grouped = Object.values(rows.reduce((acc: any, r) => {
const key = new Date(r.period_month).toISOString().slice(0,7)
acc[key] = acc[key] || { month: key, count: 0 }
acc[key].count += r.progress_notes_count
return acc
}, {}))
return (
<div style={{width:'100%', height:300}}>
<ResponsiveContainer>
<BarChart data={grouped}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="month" />
<YAxis />
<Tooltip />
<Bar dataKey="count" />
</BarChart>
</ResponsiveContainer>
</div>
)
}
