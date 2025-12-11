'use client'

import { useState, useRef, useEffect } from 'react'

export default function NoteCardActions({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        className="text-2xl leading-none px-2"
        title="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        ⋯
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow">
          <a role="menuitem" className="block px-3 py-2 hover:bg-gray-50" href={`/notes/${id}`}>View</a>
          <a role="menuitem" className="block px-3 py-2 hover:bg-gray-50" href={`/notes/${id}/edit`}>Edit</a>
        </div>
      )}
    </div>
  )
}
