import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import { Bell, LogOut, Moon, Search, Settings, Sun } from 'lucide-react'

function AdminHeader({
  user,
  initials,
  searchQuery,
  notifications,
  unreadCount,
  isDark,
  onSearchChange,
  onSearchSubmit,
  onNotificationsOpen,
  onDarkToggle,
  onLanding,
  onLogout,
  onProfileSettings,
}) {
  return (
    <header className="relative flex min-h-[72px] items-center justify-between border-b border-[#c4c7c7] bg-white px-5 py-4 lg:px-8">
      <form
        className="flex h-10 w-full max-w-[420px] items-center gap-2 rounded-lg bg-[#f3f4f6] px-3 text-[#747878] transition focus-within:ring-1 focus-within:ring-[#8c6a40]"
        onSubmit={onSearchSubmit}
      >
        <Search className="h-4 w-4 shrink-0" strokeWidth={1.8} />
        <input
          className="min-w-0 flex-1 bg-transparent text-[13px] text-[#191c1d] outline-none placeholder:text-[#9ca3af]"
          placeholder="Search queries, FAQs, or status..."
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </form>

      <div className="ml-4 flex items-center gap-4 lg:gap-6">
        <button
          type="button"
          className="hidden min-h-9 items-center gap-2 rounded-lg border border-[#8c6a40] bg-[#8c6a40] px-4 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-[#7a5c35] hover:border-[#7a5c35] sm:inline-flex"
          onClick={onLanding}
        >
          FAQ View
        </button>

        {/* Notifications bell */}
        <div className="relative">
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#444748] transition hover:bg-[#f3f4f6] hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            onClick={() => onNotificationsOpen?.()}
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>
        </div>

        {/* Dark mode */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#444748] transition hover:bg-[#f3f4f6] hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          onClick={() => onDarkToggle?.()}
        >
          {isDark
            ? <Sun className="h-[18px] w-[18px]" strokeWidth={1.8} />
            : <Moon className="h-[18px] w-[18px]" strokeWidth={1.8} />}
        </button>

        <span className="hidden h-8 w-px bg-[#c4c7c7] sm:block" />

        {/* User menu */}
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center gap-3 focus:outline-none">
            <div className="text-right leading-tight">
              <p className="text-[13px] font-medium capitalize text-[#191c1d]">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#747878]">
                {user?.role || 'ADMIN'}
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8c6a40] text-[12px] font-bold text-white">
              {initials}
            </div>
          </MenuButton>

          <MenuItems className="absolute right-0 top-12 z-50 min-w-[160px] overflow-hidden rounded-lg border border-[#c4c7c7] bg-white shadow-lg focus:outline-none">
            <MenuItem>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-[11px] font-medium text-[#444748] transition data-focus:bg-[#f8f9fa]"
                onClick={onProfileSettings}
              >
                <Settings className="h-3.5 w-3.5" strokeWidth={1.8} /> <span className="text-[13px] font-medium capitalize">Profile Settings</span>
              </button>
            </MenuItem>
            <div className="h-px bg-[#c4c7c7]" />
            <MenuItem>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-[11px] font-medium text-red-600 transition data-focus:bg-[#f8f9fa]"
                onClick={onLogout}
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.8} /> <span className="text-[13px] font-medium">Logout</span>
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </header>
  )
}

export default AdminHeader