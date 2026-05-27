import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'
import { apiRequest, unwrapApiResponse } from '../../api/http'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import BudgetFormModal from '../../components/budgets/BudgetFormModal'
import BudgetProgress from '../../components/budgets/BudgetProgress'

export default function BudgetsPage() {
  const { token } = useAuth()
  const { ui, getCategories } = useApp()

  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [budgets, setBudgets] = useState([])
  const [breakdown, setBreakdown] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const query = useMemo(() => ({ month: ui.month, year: ui.year }), [ui.month, ui.year])

  async function refresh() {
    setLoading(true)
    try {
      const [cats, budgetsPayload, breakdownPayload] = await Promise.all([
        getCategories(),
        apiRequest('/api/budgets', { token }).then(unwrapApiResponse),
        apiRequest('/api/analytics/category-breakdown', { token, query }).then(unwrapApiResponse),
      ])
      setCategories(Array.isArray(cats) ? cats : [])
      setBudgets(Array.isArray(budgetsPayload) ? budgetsPayload : [])
      setBreakdown(Array.isArray(breakdownPayload) ? breakdownPayload : [])
    } catch (err) {
      toast.error(err?.message || 'Failed to load budgets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, ui.month, ui.year])

  function spentFor(categoryName) {
    const row = breakdown.find((b) => b.categoryName === categoryName)
    return row?.totalAmount ?? 0
  }

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(item) {
    setEditing(item)
    setModalOpen(true)
  }

  async function onSave(payload, initial) {
    if (initial?.id) {
      await apiRequest(`/api/budgets/${initial.id}`, { method: 'PUT', token, body: payload }).then(unwrapApiResponse)
    } else {
      await apiRequest('/api/budgets', { method: 'POST', token, body: payload }).then(unwrapApiResponse)
    }
    await refresh()
  }

  async function onDelete(item) {
    const ok = window.confirm('Delete this budget?')
    if (!ok) return
    try {
      await apiRequest(`/api/budgets/${item.id}`, { method: 'DELETE', token }).then(unwrapApiResponse)
      toast.success('Deleted')
      await refresh()
    } catch (err) {
      toast.error(err?.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Budgets"
        subtitle="Set monthly limits per category and track progress."
        right={
          <Button variant="secondary" size="sm" icon={<FiPlus />} onClick={openCreate}>
            Create
          </Button>
        }
      />

      {loading ? (
        <Card className="flex items-center gap-3">
          <Spinner />
          <div className="text-sm text-gray-600">Loading budgets…</div>
        </Card>
      ) : budgets.length ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {budgets.map((b) => (
            <Card key={b.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{b.categoryName}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {b.month}/{b.year}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" icon={<FiEdit2 />} onClick={() => openEdit(b)} />
                  <Button size="sm" variant="ghost" icon={<FiTrash2 />} onClick={() => onDelete(b)} />
                </div>
              </div>
              <div className="mt-4">
                <BudgetProgress limit={b.limitAmount} spent={spentFor(b.categoryName)} />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No budgets yet"
          description="Create budgets to get threshold and overspending alerts."
          action={
            <Button variant="secondary" size="sm" icon={<FiPlus />} onClick={openCreate}>
              Create budget
            </Button>
          }
        />
      )}

      <BudgetFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={onSave}
        categories={categories}
        initial={editing}
        defaultMonth={ui.month}
        defaultYear={ui.year}
      />
    </div>
  )
}

