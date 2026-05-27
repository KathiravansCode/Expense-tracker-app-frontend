import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'

function months() {
  return [
    [1, 'January'],
    [2, 'February'],
    [3, 'March'],
    [4, 'April'],
    [5, 'May'],
    [6, 'June'],
    [7, 'July'],
    [8, 'August'],
    [9, 'September'],
    [10, 'October'],
    [11, 'November'],
    [12, 'December'],
  ]
}

export default function BudgetFormModal({ open, onClose, onSave, categories, initial, defaultMonth, defaultYear }) {
  const isEdit = Boolean(initial?.id)
  const [loading, setLoading] = useState(false)

  const [limitAmount, setLimitAmount] = useState('')
  const [month, setMonth] = useState(defaultMonth || 1)
  const [year, setYear] = useState(defaultYear || new Date().getFullYear())
  const [categoryId, setCategoryId] = useState('')

  const years = useMemo(() => {
    const now = new Date().getFullYear()
    return Array.from({ length: 6 }, (_, i) => now - i)
  }, [])

  useEffect(() => {
    if (!open) return
    setLimitAmount(initial?.limitAmount ?? '')
    setMonth(initial?.month ?? defaultMonth ?? new Date().getMonth() + 1)
    setYear(initial?.year ?? defaultYear ?? new Date().getFullYear())
    setCategoryId(initial?.categoryId ?? '')
  }, [open, initial, defaultMonth, defaultYear])

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        limitAmount: Number(limitAmount),
        month: Number(month),
        year: Number(year),
        categoryId: Number(categoryId),
      }
      await onSave(payload, initial)
      toast.success(isEdit ? 'Budget updated' : 'Budget created')
      onClose()
    } catch (err) {
      toast.error(err?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit budget' : 'Create budget'}>
      <form onSubmit={submit} className="space-y-3">
        <Input
          label="Limit amount"
          type="number"
          inputMode="decimal"
          value={limitAmount}
          onChange={(e) => setLimitAmount(e.target.value)}
          required
          min="0"
          step="0.01"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Select label="Month" value={month} onChange={(e) => setMonth(e.target.value)} required>
            {months().map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </Select>
          <Select label="Year" value={year} onChange={(e) => setYear(e.target.value)} required>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
        </div>

        <Select label="Category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="" disabled>
            Select…
          </option>
          {(categories || []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" variant="secondary" disabled={loading} icon={loading ? <Spinner /> : null}>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

