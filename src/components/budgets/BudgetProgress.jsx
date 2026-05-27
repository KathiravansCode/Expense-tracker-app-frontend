import { cn } from '../../utils/cn'
import { formatMoney } from '../../utils/format'

export default function BudgetProgress({ limit, spent }) {
  const safeLimit = Number(limit ?? 0)
  const safeSpent = Number(spent ?? 0)
  const ratio = safeLimit > 0 ? Math.min(1, safeSpent / safeLimit) : 0

  const tone =
    ratio >= 1 ? 'bg-red-500' : ratio >= 0.8 ? 'bg-amber-500' : ratio >= 0.5 ? 'bg-sky-500' : 'bg-emerald-500'

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>{formatMoney(safeSpent)} spent</span>
        <span>{formatMoney(safeLimit)} limit</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
        <div className={cn('h-2 rounded-full transition-all', tone)} style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  )
}

