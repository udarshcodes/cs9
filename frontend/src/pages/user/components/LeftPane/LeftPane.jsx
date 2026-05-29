import { LayoutGrid, MessageSquare } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard',  Icon: LayoutGrid   },
  { label: 'My Queries', Icon: MessageSquare },
]

function LeftPane({ sidebarNav, currentView, onNavigate }) {
  return (
    <aside className="flex w-70 shrink-0 flex-col border-r border-[#c4c7c7] bg-[#f8f9fa] pt-8">

      {/* Brand */}
      <button
        type="button"
        className="px-6 pb-8 text-left"
        onClick={() => onNavigate('Dashboard')}
      >
        <h2 className="font-display mb-1 text-[13px] font-medium leading-tight text-[#8c6a40]">
          Rogāre
        </h2>
        <p className="text-[11px] font-medium uppercase tracking-widest text-[#747878]">
          Internship Hub
        </p>
      </button>

      {/* Section label — mirrors landing's "FAQ Tags / Internship Guide" */}
      <div className="mb-3 px-6">
        <p className="font-display text-[13px] font-semibold leading-snug text-[#191c1d]">
          Student portal
        </p>
        {/* <p className="mt-0.5 text-[11px] leading-normal text-[#444748]"></p> */}
      </div>

      {/* Nav — mirrors landing's progress-line nav */}
      <nav className="relative flex flex-col gap-0.5 pl-6 pr-3">
        <span className="absolute bottom-2 left-5 top-2 w-px bg-[#d9dadb]" aria-hidden="true" />

        {NAV_ITEMS.map(({ label, Icon }) => {
          const isActive = sidebarNav === label && currentView === 'dashboard'

          return (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate(label)}
              className={`flex min-h-10 w-full items-center gap-3 rounded-r-lg px-3 py-2 text-left text-[14px] leading-normal transition ${
                isActive
                  ? 'border-r-2 border-[#8c6a40] bg-[#8c6a40]/10 font-semibold text-[#8c6a40]'
                  : 'text-[#444748] hover:bg-[#8c6a40]/10 hover:text-[#8c6a40]'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default LeftPane
