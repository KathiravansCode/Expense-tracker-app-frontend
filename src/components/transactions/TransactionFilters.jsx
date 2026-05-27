import { useMemo } from 'react'
import { FiFilter } from 'react-icons/fi'
import { useApp } from '../../context/AppContext'
import Select from '../ui/Select'

function monthOptions() {
  return [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Feb' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' },
    { value: 5, label: 'May' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Aug' },
    { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dec' },
  ]
}

export default function TransactionFilters() {
  const { ui, setMonthYear, setTransactionType, setPageSize } = useApp()

  const years = useMemo(() => {
    const now = new Date().getFullYear()
    return Array.from({ length: 6 }, (_, i) => now - i)
  }, [])

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
      <div className="sm:col-span-4 flex items-center gap-2 text-xs font-medium text-gray-600">
        <FiFilter />
        Filters
      </div>
      <Select
        label="Month"
        value={ui.month}
        onChange={(e) => setMonthYear({ month: Number(e.target.value), year: ui.year })}
      >
        {monthOptions().map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </Select>
      <Select
        label="Year"
        value={ui.year}
        onChange={(e) => setMonthYear({ month: ui.month, year: Number(e.target.value) })}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </Select>
      <Select label="Type" value={ui.transactionType} onChange={(e) => setTransactionType(e.target.value)}>
        <option value="">All</option>
        <option value="INCOME">Income</option>
        <option value="EXPENSE">Expense</option>
      </Select>
      <Select label="Page size" value={ui.pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
        {[10, 20, 50].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Select>
    </div>
  )
}

