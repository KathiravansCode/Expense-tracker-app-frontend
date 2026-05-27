import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FiPlus } from 'react-icons/fi'
import { apiRequest, unwrapApiResponse } from '../../api/http'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import TransactionFilters from '../../components/transactions/TransactionFilters'
import TransactionsTable from '../../components/transactions/TransactionsTable'
import TransactionFormModal from '../../components/transactions/TransactionFormModal'

export default function TransactionsPage() {
  const { token } = useAuth()
  const { ui, getCategories } = useApp()

  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(0)
  const [txPage, setTxPage] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const query = useMemo(
    () => ({
      month: ui.month,
      year: ui.year,
      type: ui.transactionType || undefined,
      page,
      size: ui.pageSize,
    }),
    [ui.month, ui.year, ui.transactionType, page, ui.pageSize],
  )

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      try {
        const [catsPayload, txPayload] = await Promise.all([
          getCategories(),
          apiRequest('/api/transactions', { token, query }).then(unwrapApiResponse),
        ])
        if (cancelled) return
        setCategories(Array.isArray(catsPayload) ? catsPayload : [])
        setTxPage(txPayload)
      } catch (err) {
        if (!cancelled) toast.error(err?.message || 'Failed to load transactions')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [token, query, getCategories])

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
      await apiRequest(`/api/transactions/${initial.id}`, { method: 'PUT', token, body: payload }).then(unwrapApiResponse)
    } else {
      await apiRequest('/api/transactions', { method: 'POST', token, body: payload }).then(unwrapApiResponse)
    }
    setPage(0)
    const refreshed = await apiRequest('/api/transactions', { token, query: { ...query, page: 0 } }).then(unwrapApiResponse)
    setTxPage(refreshed)
  }

  async function onDelete(item) {
    const ok = window.confirm('Delete this transaction?')
    if (!ok) return
    try {
      await apiRequest(`/api/transactions/${item.id}`, { method: 'DELETE', token }).then(unwrapApiResponse)
      toast.success('Deleted')
      const refreshed = await apiRequest('/api/transactions', { token, query }).then(unwrapApiResponse)
      setTxPage(refreshed)
    } catch (err) {
      toast.error(err?.message || 'Delete failed')
    }
  }

  const items = txPage?.content || []
  const totalPages = txPage?.totalPages ?? 0

  return (
    <div className="space-y-4">
      <PageHeader
        title="Transactions"
        subtitle="Add, edit and filter your income and expenses."
        right={
          <Button variant="secondary" size="sm" icon={<FiPlus />} onClick={openCreate}>
            Add
          </Button>
        }
      />

      <Card>
        <TransactionFilters />
      </Card>

      {loading ? (
        <Card className="flex items-center gap-3">
          <Spinner />
          <div className="text-sm text-gray-600">Loading transactions…</div>
        </Card>
      ) : items.length ? (
        <>
          <TransactionsTable items={items} onEdit={openEdit} onDelete={onDelete} />
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">
              Page {Number(txPage?.number ?? 0) + 1} of {totalPages || 1}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page <= 0}>
                Prev
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
                disabled={page + 1 >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          title="No transactions yet"
          description="Add your first transaction to see analytics and budgets."
          action={
            <Button variant="secondary" size="sm" icon={<FiPlus />} onClick={openCreate}>
              Add transaction
            </Button>
          }
        />
      )}

      <TransactionFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={onSave}
        categories={categories}
        initial={editing}
      />
    </div>
  )
}

