import { useNavigate } from 'react-router-dom'
import Button from '../../../../components/Button/Button'

function RaiseQueryPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-1 items-center justify-center p-10">
      <div className="text-center">
        <h2 className="font-display mb-2 text-[18px] font-semibold text-[#191c1d]">Raise a Query</h2>
        <p className="mb-6 text-[13px] text-[#444748]">Query submission form — coming soon.</p>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    </div>
  )
}

export default RaiseQueryPage
