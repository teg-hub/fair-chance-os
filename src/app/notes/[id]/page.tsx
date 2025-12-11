import { createSbServer } from '@/lib/supabase-server'
import EditProgressNoteForm from '@/components/forms/EditProgressNoteForm'

export default async function NoteEdit({ params }: { params: { id: string } }) {
  const sb = createSbServer()
  const { data: note, error } = await sb
    .from('progress_notes')
    .select('id, employee_id, note_date, meeting_location, areas_of_need, employee_report, coordinator_observations, short_term_goals, long_term_goals, referrals, next_meeting_at, next_meeting_location, meeting_summary, file_url')
    .eq('id', params.id)
    .single()

  if (error || !note) {
    return <div className="card">Error loading note: {error?.message ?? 'Not found'}</div>
  }

  return (
    <div className="space-y-4">
      <EditProgressNoteForm note={note as any} />
    </div>
  )
}
