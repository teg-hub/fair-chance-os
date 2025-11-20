'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'


type Row = { period_month: string; need: string; notes_tagged: number }
export function AreasStacked({ rows }: { rows: Row[] }){
const monthKey = (d: string) => new Date(d).toISOString().slice(0,7)
const needs = Array.from(new Set(rows.map(r => r.need)))
const grouped: Record<string, any> = {}
rows.forEach(r => {
const m = monthKey(r.period_month)
grouped[m] = grouped[m] || { month: m }
grouped[m][r.need] = (grouped[m][r.need] || 0) + r.notes_tagged
})
const data = Object.values(grouped)
return (
<div style={{width:'100%', height:340}}>
<ResponsiveContainer>
<BarChart data={data}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="month" />
<YAxis />
<Tooltip />
<Legend />
{needs.map((n) => (<Bar key={n} dataKey={n} stackId="a" />))}
</BarChart>
</ResponsiveContainer>
</div>
)
}
