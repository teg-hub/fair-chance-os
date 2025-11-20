'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type InputRow = { week_start: string; coordinator_id: string | null; notes_this_week: number }

// Allow dynamic series keys like row['<coordinator-id>']
type ChartRow = { week: string } & Record<string, number>

export function EngagementTrend({ rows }: { rows: InputRow[] }) {
  const wk = (d: string) => new Date(d).toISOString().slice(0, 10)

  // group by coordinator
  const byCoord: Record<string, Array<{ week: string; value: number }>> = {}
  rows.forEach((r) => {
    const id = r.coordinator_id || 'Unassigned'
    byCoord[id] = byCoord[id] || []
    byCoord[id].push({ week: wk(r.week_start), value: r.notes_this_week })
  })

  // merge weeks across series
  const weeks = Array.from(new Set(rows.map((r) => wk(r.week_start)))).sort()
  const combined: ChartRow[] = weeks.map((w) => ({ week: w }))

  Object.entries(byCoord).forEach(([id, arr]) => {
    const map: Record<string, number> = {}
    arr.forEach((p) => {
      map[p.week] = (map[p.week] || 0) + p.value
    })
    combined.forEach((row) => {
      row[id] = map[row.week] || 0
    })
  })

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={combined}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(byCoord).map((key) => (
            <Line key={key} type="monotone" dataKey={key} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
