import ProgressNoteForm from '@/components/forms/ProgressNoteForm'

// /notes/new?employee=<EMPLOYEE_ID>
export default function Page({
  searchParams,
}: {
  searchParams?: { [k: string]: string | string[] | undefined }
}) {
  const id = (searchParams?.employee as string) || ''
  if (!id) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">New Progress Note</h2>
        <p className="mb-2">Provide an employee ID in the URL:</p>
        <code className="text-xs bg-blue-50 rounded px-2 py-1">
          /notes/new?employee=&lt;EMPLOYEE_ID&gt;
        </code>
      </div>
    )
  }
  return <ProgressNoteForm employeeId={id} />
}
