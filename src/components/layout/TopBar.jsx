import { useMemo } from 'react'
import { FiMenu, FiPlus } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { monthYearLabel } from '../../utils/format'
import { useApp } from '../../context/AppContext'
import Button from '../ui/Button'

export default function TopBar({ onMenuClick }) {
  const { user } = useAuth()
  const { ui } = useApp()

  const greeting = useMemo(() => {
    const name = user?.name || 'there'
    return `Hi, ${name}`
  }, [user?.name])

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white/80 px-3 py-3 shadow-sm backdrop-blur">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{greeting}</div>
        <div className="truncate text-xs text-gray-500">{monthYearLabel(ui.month, ui.year)}</div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="lg:hidden"
          aria-label="Menu"
          icon={<FiMenu />}
          onClick={onMenuClick}
        />
        <Button
          to="/transactions"
          variant="primary"
          size="sm"
          icon={<FiPlus />}
          className="hidden sm:inline-flex"
        >
          Add transaction
        </Button>
      </div>
    </div>
  )
}