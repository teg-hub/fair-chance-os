'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSbBrowser } from '@/lib/supabase-browser'

export default function DeleteNoteButton({ id }: { id: string }) {
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  const sb = createSbBrowser()

  async function onDelete() {
    if (!confirm('Delete this note? This cannot be undone.')) return
    setBusy(true)
    const { error } = await sb.from('progress_notes').delete().eq('id', id)
    setBusy(false)
    if (error) {
      alert(`Delete failed: ${error.message}`)
      return
    }
    router.push('/notes')
  }

  return (
    <button
      className="px-3 py-2 rounded-lg border text-red-700 hover:bg-red-50 disabled:opacity-50"
      onClick={onDelete}
      disabled={busy}
      aria-disabled={busy}
    >
      {busy ? 'Deleting…' : 'Delete'}
    </button>
  )
}
