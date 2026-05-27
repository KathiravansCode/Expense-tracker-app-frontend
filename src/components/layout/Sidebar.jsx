import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { FiBarChart2, FiBell, FiCreditCard, FiGrid, FiLogOut, FiTag, FiUser } from 'react-icons/fi'
import { cn } from '../../utils/cn'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'

const nav = [
  { to: '/', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/transactions', label: 'Transactions', icon: FiCreditCard },
  { to: '/categories', label: 'Categories', icon: FiTag },
  { to: '/budgets', label: 'Budgets', icon: FiBarChart2 },
  { to: '/alerts', label: 'Alerts', icon: FiBell },
  { to: '/profile', label: 'Profile', icon: FiUser },
]

export default function Sidebar() {
  const { logout } = useAuth()
  const { alertsMeta, refreshAlertsMeta } = useApp()

  useEffect(() => {
    refreshAlertsMeta().catch(() => {})
    const id = window.setInterval(() => refreshAlertsMeta().catch(() => {}), 30000)
    return () => window.clearInterval(id)
  }, [refreshAlertsMeta])

  return (
    <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 rounded-2xl border border-gray-200 bg-white/80 p-3 shadow-sm backdrop-blur lg:block">
      <div className="flex items-center gap-2 px-2 py-2">
        <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/15 text-emerald-700">
          <span className="text-lg font-semibold">₹</span>
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">Expense Tracker</div>
          <div className="truncate text-xs text-gray-500">Personal finance</div>
        </div>
      </div>

      <nav className="mt-3 space-y-1">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition',
                'hover:bg-gray-50 hover:text-gray-900',
                isActive && 'bg-emerald-500/10 text-emerald-800',
              )
            }
          >
            <span className="relative inline-flex">
              <item.icon className="size-4" />
              {item.to === '/alerts' && alertsMeta?.hasUnread ? (
                <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-red-500 ring-2 ring-white" />
              ) : null}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
        >
          <FiLogOut className="size-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
