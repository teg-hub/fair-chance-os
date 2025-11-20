'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

type Coordinator = { id: string; full_name: string }

type Props = {
  departments: string[]
  coordinators: Coordinator[]
  areas: string[]
}

/**
 * QueryFilters - a small client component that writes selections into the URL query.
 * Works on any page. It reads current query, lets you change values, and updates the URL.
 *
 * Query keys:
 * - dept: string (Department)
 * - coord: string (Coordinator ID)
 * - start: YYYY-MM-DD
 * - end: YYYY-MM-DD
 * - need: string (single area for now; choose one)
 */
export default function QueryFilters({ departments, coordinators, areas }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const get = useCallback(
    (k: string) => searchParams.get(k) ?? '',
    [searchParams]
  )

  const params = useMemo(() => {
    const obj = new URLSearchParams(searchParams.toString())
    return obj
  }, [searchParams])

  function setAndPush(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (!value) next.delete(key)
    else next.set(key, value)
    // Reset pagination (if you add it later)
    next.delete('page')
    router.push(`?${next.toString()}`)
  }

  return (
    <div className="card flex flex-col md:flex-row gap-3 items-start md:items-end">
      {/* Department */}
      <label className="text-sm">
        <div className="mb-1">Department</div>
        <select
          className="border rounded p-2 min-w-[12rem]"
          value={get('dept')}
          onChange={(e) => setAndPush('dept', e.target.value)}
        >
          <option value="">All</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </label>

      {/* Coordinator */}
      <label className="text-sm">
        <div className="mb-1">Coordinator</div>
        <select
          className="border rounded p-2 min-w-[12rem]"
          value={get('coord')}
          onChange={(e) => setAndPush('coord', e.target.value)}
        >
          <option value="">All</option>
          {coordinators.map((c) => (
            <option key={c.id} value={c.id}>{c.full_name}</option>
          ))}
        </select>
      </label>

      {/* Area of Need */}
      <label className="text-sm">
        <div className="mb-1">Area of Need</div>
        <select
          className="border rounded p-2 min-w-[12rem]"
          value={get('need')}
          onChange={(e) => setAndPush('need', e.target.value)}
        >
          <option value="">All</option>
          {areas.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </label>

      {/* Start / End */}
      <label className="text-sm">
        <div className="mb-1">Start</div>
        <input
          type="date"
          className="border rounded p-2"
          value={get('start')}
          onChange={(e) => setAndPush('start', e.target.value)}
        />
      </label>

      <label className="text-sm">
        <div className="mb-1">End</div>
        <input
          type="date"
          className="border rounded p-2"
          value={get('end')}
          onChange={(e) => setAndPush('end', e.target.value)}
        />
      </label>

      {/* Clear */}
      <button
        type="button"
        className="btn"
        onClick={() => router.push('?')}
      >
        Clear
      </button>
    </div>
  )
}
