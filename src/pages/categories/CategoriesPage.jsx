import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'
import { apiRequest, unwrapApiResponse } from '../../api/http'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import CategoryFormModal from '../../components/categories/CategoryFormModal'

export default function CategoriesPage() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  async function refresh() {
    setLoading(true)
    try {
      const payload = await apiRequest('/api/categories', { token })
      setItems(unwrapApiResponse(payload) || [])
    } catch (err) {
      toast.error(err?.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

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
      await apiRequest(`/api/categories/${initial.id}`, { method: 'PUT', token, body: payload }).then(unwrapApiResponse)
    } else {
      await apiRequest('/api/categories', { method: 'POST', token, body: payload }).then(unwrapApiResponse)
    }
    await refresh()
  }

  async function onDelete(item) {
    const ok = window.confirm('Delete this category?')
    if (!ok) return
    try {
      await apiRequest(`/api/categories/${item.id}`, { method: 'DELETE', token }).then(unwrapApiResponse)
      toast.success('Deleted')
      await refresh()
    } catch (err) {
      toast.error(err?.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Categories"
        subtitle="Organize your transactions."
        right={
          <Button variant="secondary" size="sm" icon={<FiPlus />} onClick={openCreate}>
            Add
          </Button>
        }
      />

      {loading ? (
        <Card className="flex items-center gap-3">
          <Spinner />
          <div className="text-sm text-gray-600">Loading categories…</div>
        </Card>
      ) : items.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{c.name}</div>
                  <div className="mt-1 text-xs text-gray-500">Category</div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" icon={<FiEdit2 />} onClick={() => openEdit(c)} />
                  <Button size="sm" variant="ghost" icon={<FiTrash2 />} onClick={() => onDelete(c)} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No categories yet"
          description="Create at least one category before adding transactions."
          action={
            <Button variant="secondary" size="sm" icon={<FiPlus />} onClick={openCreate}>
              Add category
            </Button>
          }
        />
      )}

      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={onSave}
        initial={editing}
      />
    </div>
  )
}

