import { format as formatDateFns } from 'date-fns'

export function formatMoney(value) {
  const amount = Number(value ?? 0)
  if (Number.isNaN(amount)) return '—'
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(value) {
  if (!value) return '—'
  try {
    return formatDateFns(new Date(value), 'dd MMM yyyy')
  } catch {
    return String(value)
  }
}

export function monthYearLabel(month, year) {
  if (!month || !year) return 'All time'
  try {
    const date = new Date(Number(year), Number(month) - 1, 1)
    return formatDateFns(date, 'MMM yyyy')
  } catch {
    return `${month}/${year}`
  }
}

