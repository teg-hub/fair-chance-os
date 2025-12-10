import { createSbServer } from '@/lib/supabase-server'

export default async function NoteView({ params }: { params: { id: string } }) {
  const sb = createSbServer()
  const { data: note, error } = await sb
    .from('progress_notes')
    .select('id, employee_id, note_date, meeting_location, next_meeting_at, next_meeting_location, areas_of_need, meeting_summary, file_url')
    .eq('id', params.id)
    .single()

  if (error || !note) {
    return <div className="card">Error loading note: {error?.message ?? 'Not found'}</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-blue-800">Progress Note</h1>
      <div className="card space-y-3">
        <div className="text-sm text-slate-600">
          Date: {new Date(note.note_date).toLocaleDateString()} • Location: {note.meeting_location}
        </div>
        <div className="flex flex-wrap gap-2">
          {(note.areas_of_need as string[] ?? []).map(a => <span key={a} className="badge">{a}</span>)}
        </div>
        <div className="whitespace-pre-wrap text-sm">{note.meeting_summary}</div>
        {note.next_meeting_at && (
          <div className="text-sm">
            Next Meeting: {new Date(note.next_meeting_at).toLocaleString()} • {note.next_meeting_location ?? '—'}
          </div>
        )}
        {note.file_url && (
          <a className="text-blue-700 underline text-sm" href={note.file_url} target="_blank">View attachment</a>
        )}
        <div>
          <a className="btn" href={`/notes/${note.id}/edit`}>Edit</a>
        </div>
      </div>
    </div>
  )
}
