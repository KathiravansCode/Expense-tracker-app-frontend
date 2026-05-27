import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'

const paymentModes = ['', 'CASH', 'UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER']

export default function TransactionFormModal({ open, onClose, onSave, categories, initial }) {
  const isEdit = Boolean(initial?.id)
  const [loading, setLoading] = useState(false)

  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [transactionDate, setTransactionDate] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [transactionType, setTransactionType] = useState('EXPENSE')
  const [paymentMode, setPaymentMode] = useState('')

  const categoryOptions = useMemo(() => categories || [], [categories])

  useEffect(() => {
    if (!open) return
    setAmount(initial?.amount ?? '')
    setDescription(initial?.description ?? '')
    setTransactionDate(initial?.transactionDate ?? new Date().toISOString().slice(0, 10))
    setCategoryId(initial?.categoryId ?? '')
    setTransactionType(initial?.transactionType ?? 'EXPENSE')
    setPaymentMode(initial?.paymentMode ?? '')
  }, [open, initial])

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        amount: Number(amount),
        description: description || null,
        transactionDate,
        categoryId: Number(categoryId),
        transactionType,
        paymentMode: paymentMode || null,
      }
      await onSave(payload, initial)
      toast.success(isEdit ? 'Transaction updated' : 'Transaction created')
      onClose()
    } catch (err) {
      toast.error(err?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit transaction' : 'Add transaction'}>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Amount"
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
            step="0.01"
          />
          <Input
            label="Date"
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Select label="Type" value={transactionType} onChange={(e) => setTransactionType(e.target.value)} required>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </Select>
          <Select label="Payment mode" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
            {paymentModes.map((m) => (
              <option key={m} value={m}>
                {m ? m.replaceAll('_', ' ') : '—'}
              </option>
            ))}
          </Select>
        </div>

        <Select label="Category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="" disabled>
            Select…
          </option>
          {categoryOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional note"
        />

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

