'use client'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

export default function BarTile({ data }: { data: Array<{ x: string; y: number }> }) {
  return (
    <div className="h-36">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="x" hide />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey="y" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
