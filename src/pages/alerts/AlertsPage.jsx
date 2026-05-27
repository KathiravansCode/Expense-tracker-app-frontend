import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiCheck, FiInfo } from 'react-icons/fi'
import { apiRequest } from '../../api/http'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { formatDate } from '../../utils/format'

function alertTone(type) {
  if (type === 'BUDGET_EXCEEDED') return 'bg-red-500/10 text-red-700'
  if (type === 'BUDGET_THRESHOLD') return 'bg-amber-500/15 text-amber-800'
  return 'bg-sky-500/10 text-sky-700'
}

export default function AlertsPage() {
  const { token } = useAuth()
  const { refreshAlertsMeta } = useApp()
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(null)

  async function refresh() {
    setLoading(true)
    try {
      const payload = await apiRequest('/api/alerts', {
        token,
        query: { page: 0, size: 20, sort: 'createdAt,desc' },
      })
      setPage(payload)
      refreshAlertsMeta().catch(() => {})
    } catch (err) {
      toast.error(err?.message || 'Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function markRead(item) {
    try {
      await apiRequest(`/api/alerts/${item.id}/read`, { method: 'PUT', token })
      toast.success('Marked as read')
      await refresh()
    } catch (err) {
      toast.error(err?.message || 'Failed to update')
    }
  }

  const items = page?.content || []

  return (
    <div className="space-y-4">
      <PageHeader
        title="Alerts"
        subtitle="Budget thresholds, overspending, and unusual expenses."
        right={
          <Button variant="ghost" size="sm" icon={<FiInfo />} onClick={refresh}>
            Refresh
          </Button>
        }
      />

      {loading ? (
        <Card className="flex items-center gap-3">
          <Spinner />
          <div className="text-sm text-gray-600">Loading alerts…</div>
        </Card>
      ) : items.length ? (
        <div className="space-y-2">
          {items.map((a) => (
            <Card key={a.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${alertTone(a.alertType)}`}>
                      {a.alertType}
                    </span>
                    {a.isRead ? (
                      <span className="text-xs font-medium text-gray-500">Read</span>
                    ) : (
                      <span className="text-xs font-semibold text-gray-900">New</span>
                    )}
                  </div>
                  <div className="mt-2 text-sm font-medium text-gray-900">{a.message}</div>
                  <div className="mt-1 text-xs text-gray-500">{formatDate(a.createdAt)}</div>
                </div>
                {!a.isRead ? (
                  <Button size="sm" variant="ghost" icon={<FiCheck />} onClick={() => markRead(a)}>
                    Mark read
                  </Button>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No alerts" description="You’re all caught up." />
      )}
    </div>
  )
}
