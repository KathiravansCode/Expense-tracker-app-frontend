import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiBarChart2, FiBell, FiCreditCard, FiGrid, FiLogOut, FiTag, FiUser, FiX } from 'react-icons/fi'
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

function SidebarContent({ onClose }) {
  const { logout } = useAuth()
  const { alertsMeta } = useApp()

  return (
    <div className="flex h-full flex-col p-3">
      <div className="flex items-center justify-between gap-2 px-2 py-2">
        <div className="flex items-center gap-2">
          <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/15 text-emerald-700">
            <span className="text-lg font-semibold">₹</span>
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">Expense Tracker</div>
            <div className="truncate text-xs text-gray-500">Personal finance</div>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            aria-label="Close menu"
          >
            <FiX className="size-4" />
          </button>
        )}
      </div>

      <nav className="mt-3 space-y-1">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
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
    </div>
  )
}

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { alertsMeta, refreshAlertsMeta } = useApp()

  useEffect(() => {
    refreshAlertsMeta().catch(() => {})
    const id = window.setInterval(() => refreshAlertsMeta().catch(() => {}), 30000)
    return () => window.clearInterval(id)
  }, [refreshAlertsMeta])

  // Close on Escape key
  useEffect(() => {
    if (!mobileOpen) return
    function handleKey(e) {
      if (e.key === 'Escape') onMobileClose?.()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [mobileOpen, onMobileClose])

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 rounded-2xl border border-gray-200 bg-white/80 shadow-sm backdrop-blur lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
            />

            {/* Drawer panel */}
            <motion.aside
              key="drawer"
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-gray-200 bg-white shadow-xl lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <SidebarContent onClose={onMobileClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}