import { useNavigate, useParams } from 'react-router-dom'
import { X } from 'lucide-react'

function QueryDetailPage() {
  const { queryId } = useParams()
  const navigate = useNavigate()

  return (
    <div className="flex flex-1 flex-col p-8">
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="mb-6 flex items-center gap-2 text-[13px] font-medium text-[#444748] transition hover:text-black"
      >
        <X className="h-4 w-4" strokeWidth={1.8} /> Back
      </button>
      <h1 className="font-display mb-4 text-[18px] font-semibold text-[#191c1d]">Query {queryId}</h1>
      <p className="text-[13px] leading-6 text-[#444748]">Query detail view — coming soon.</p>
    </div>
  )
}

export default QueryDetailPage
