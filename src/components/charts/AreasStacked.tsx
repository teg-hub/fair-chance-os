'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer,
} from 'recharts'

// rows shape expected:
// { period_month: string (e.g. "2025-12-01T00:00:00Z"), need: string, notes_tagged: number }
export function AreasStacked({ rows }:{ rows: Array<{ period_month: string; need: string; notes_tagged: number }> }) {
  // 1) Unique needs (stable order)
  const needs = Array.from(new Set(rows.map(r => r.need)))

  // 2) Color palette (distinct, accessible)
  const palette = [
    '#2563EB', // Blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#14B8A6', // Teal
    '#F97316', // Orange
    '#84CC16', // Lime
    '#06B6D4', // Cyan
    '#A855F7', // Purple
  ]
  const needColors = new Map(needs.map((n, i) => [n, palette[i % palette.length]]))

  // 3) Pivot rows into [{ month, Food, Housing, ... }]
  const byMonth: Record<string, any> = {}
  for (const r of rows) {
    const month = (r.period_month ?? '').slice(0, 7) // "YYYY-MM"
    if (!byMonth[month]) byMonth[month] = { month }
    byMonth[month][r.need] = (byMonth[month][r.need] || 0) + (Number(r.notes_tagged) || 0)
  }
  const data = Object.values(byMonth).sort((a: any, b: any) => a.month.localeCompare(b.month))

  return (
    <div style={{ width: '100%', height: 360 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {needs.map((need) => (
            <Bar
              key={need}
              dataKey={need}
              stackId="a"
              fill={needColors.get(need)}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
