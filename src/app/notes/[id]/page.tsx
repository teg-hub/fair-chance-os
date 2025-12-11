// src/app/notes/[id]/page.tsx
import { createSbServer } from '@/lib/supabase-server'
import DeleteNoteButton from '@/components/notes/DeleteNoteButton'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card space-y-2">
      <h3 className="text-base font-semibold text-blue-800">{title}</h3>
      {children}
    </div>
  )
}

export default async function NoteView({ params }: { params: { id: string } }) {
  const sb = createSbServer()
  const { data: note, error } = await sb
    .from('progress_notes')
    .select(`
      id,
      employee_id,
      note_date,
      meeting_location,
      areas_of_need,
      employee_report,
      coordinator_observations,
      short_term_goals,
      long_term_goals,
      referrals,
      next_meeting_at,
      next_meeting_location,
      meeting_summary,
      file_url,
      employees!inner ( id, first_name, last_name, name )
    `)
    .eq('id', params.id)
    .single()

  if (error || !note) {
    return <div className="card">Error loading note: {error?.message ?? 'Not found'}</div>
  }

  const emp = (note as any).employees
  const empName =
    (emp?.first_name && emp?.last_name) ? `${emp.first_name} ${emp.last_name}` : emp?.name ?? 'Employee'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-blue-800">Progress Note</h1>
        <div className="flex gap-2">
          <a className="px-3 py-2 rounded-lg border text-blue-700 hover:bg-blue-50" href={`/employees/${emp?.id}`}>
            ← Back to {empName}
          </a>
          <a className="btn" href={`/notes/${note.id}/edit`}>Edit</a>
          <DeleteNoteButton id={note.id} />
        </div>
      </div>

      <div className="card">
        <div className="text-sm text-slate-600">
          Date: {new Date(note.note_date as string).toLocaleDateString()} • Location: {note.meeting_location ?? '—'}
        </div>
        {(note.areas_of_need as string[] | null)?.length ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {(note.areas_of_need as string[]).map((a) => (
              <span key={a} className="badge">{a}</span>
            ))}
          </div>
        ) : null}
      </div>

      <Section title="Employee's Report">
        <p className="text-sm whitespace-pre-wrap">{note.employee_report ?? '—'}</p>
      </Section>

      <Section title="Coordinator Observations & Additional Insights">
        <p className="text-sm whitespace-pre-wrap">{note.coordinator_observations ?? '—'}</p>
      </Section>

      <div className="grid md:grid-cols-2 gap-4">
        <Section title="Short-Term Goals">
          <p className="text-sm whitespace-pre-wrap">{note.short_term_goals ?? '—'}</p>
        </Section>
        <Section title="Long-Term Goals">
          <p className="text-sm whitespace-pre-wrap">{note.long_term_goals ?? '—'}</p>
        </Section>
      </div>

      <Section title="Referrals Made (if applicable)">
        <p className="text-sm whitespace-pre-wrap">{note.referrals ?? '—'}</p>
      </Section>

      <Section title="Next Meeting">
        <div className="text-sm">
          <div>Date & Time: {note.next_meeting_at ? new Date(note.next_meeting_at as string).toLocaleString() : '—'}</div>
          <div>Location: {note.next_meeting_location ?? '—'}</div>
        </div>
      </Section>

      <Section title="Summary of Meeting">
        <p className="text-sm whitespace-pre-wrap">{note.meeting_summary ?? '—'}</p>
      </Section>

      <Section title="Attachment">
        {note.file_url ? (
          <a className="text-blue-700 underline text-sm" href={note.file_url as string} target="_blank">View file</a>
        ) : (
          <span className="text-sm text-slate-600">No file attached.</span>
        )}
      </Section>
    </div>
  )
}
