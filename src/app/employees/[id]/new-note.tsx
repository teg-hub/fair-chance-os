'use client'
import ProgressNoteForm from '@/components/forms/ProgressNoteForm'

export default function NewNote({ employeeId }: { employeeId: string }) {
  return <ProgressNoteForm employeeId={employeeId} />
}
