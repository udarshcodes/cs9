import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import useAuthStore from '../../store/useAuthStore'

function AdminHome() {
  const navigate = useNavigate()
  const { user, clearUser } = useAuthStore()

  function handleLogout() {
    clearUser()
    navigate('/')
  }

  return (
    <div className="min-h-svh bg-[#f8f9fa] text-[#191c1d]">
      <header className="border-b border-[#c4c7c7] bg-[#f8f9fa]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-300 items-center justify-between px-2 py-3 sm:px-2 sm:py-4">
          <span className="font-display text-[18px] font-bold text-black sm:text-[22px]">
            rogāre
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => navigate('/')}>
              Landing
            </Button>
            <Button variant="primary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-300 px-2 py-10 sm:px-2">
        <div className="mb-6 border-b border-[#c4c7c7] pb-4">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#747878]">
            Admin
          </p>
          <h1 className="font-display text-[22px] font-semibold text-black">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: 'Manage Users', description: 'View, edit, and moderate user accounts.' },
            { label: 'Manage FAQs', description: 'Publish, edit, and remove FAQ entries.' },
            { label: 'View Reports', description: 'Review flagged content and activity logs.' },
            { label: 'Leaderboard', description: 'Monitor user engagement and spark scores.' },
            { label: 'Notifications', description: 'Send and manage system-wide notifications.' },
            { label: 'Settings', description: 'Configure platform preferences and roles.' },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-lg border border-[#c4c7c7] bg-white p-5 transition hover:border-black"
            >
              <p className="mb-1 text-[14px] font-semibold text-black">{card.label}</p>
              <p className="text-[13px] leading-6 text-[#444748]">{card.description}</p>
            </div>
          ))}
        </div>

        {user && (
          <div className="mt-8 rounded-lg border border-[#c4c7c7] bg-white p-5">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-[#747878]">
              Session
            </p>
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <span className="text-[#444748]">Name</span>
              <span className="font-medium text-black">{user.name}</span>
              <span className="text-[#444748]">Email</span>
              <span className="font-medium text-black">{user.email}</span>
              <span className="text-[#444748]">Role</span>
              <span className="font-medium text-black">{user.role}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminHome
