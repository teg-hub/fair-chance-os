import { createSbServer } from '@/lib/supabase-server'
import EditNoteSummary from '@/components/forms/EditNoteSummary'

export default async function NoteEdit({ params }: { params: { id: string } }) {
  const sb = createSbServer()
  const { data: note, error } = await sb
    .from('progress_notes')
    .select('id, note_date, meeting_location, meeting_summary')
    .eq('id', params.id)
    .single()

  if (error || !note) {
    return <div className="card">Error loading note: {error?.message ?? 'Not found'}</div>
  }

  return (
    <div className="space-y-4">
      <EditNoteSummary
        id={note.id}
        note_date={note.note_date as string}
        meeting_location={note.meeting_location as string}
        meeting_summary={note.meeting_summary as string | null}
      />
    </div>
  )
}
