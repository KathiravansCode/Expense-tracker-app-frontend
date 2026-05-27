import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FiArrowDownRight, FiArrowUpRight, FiDownload, FiTrendingUp } from 'react-icons/fi'
import { apiRequest, unwrapApiResponse } from '../../api/http'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import { formatMoney } from '../../utils/format'
import SpendingTrendChart from '../../components/charts/SpendingTrendChart'
import CategoryBreakdownChart from '../../components/charts/CategoryBreakdownChart'
import { config } from '../../config'

function StatCard({ label, value, icon, tone }) {
  const toneCls =
    tone === 'good'
      ? 'bg-emerald-500/10 text-emerald-800'
      : tone === 'bad'
        ? 'bg-red-500/10 text-red-700'
        : 'bg-sky-500/10 text-sky-700'
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-gray-600">{label}</div>
          <div className="mt-1 text-xl font-semibold">{value}</div>
        </div>
        <div className={`grid size-10 place-items-center rounded-2xl ${toneCls}`}>{icon}</div>
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const { token } = useAuth()
  const { ui } = useApp()

  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [breakdown, setBreakdown] = useState([])
  const [trend, setTrend] = useState([])

  const query = useMemo(() => ({ month: ui.month, year: ui.year }), [ui.month, ui.year])

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      try {
        const [s, b, t] = await Promise.all([
          apiRequest('/api/analytics/summary', { token, query }).then(unwrapApiResponse),
          apiRequest('/api/analytics/category-breakdown', { token, query }).then(unwrapApiResponse),
          apiRequest('/api/analytics/spending-trend', { token, query }).then(unwrapApiResponse),
        ])
        if (cancelled) return
        setSummary(s)
        setBreakdown(Array.isArray(b) ? b : [])
        setTrend(Array.isArray(t) ? t : [])
      } catch (err) {
        if (!cancelled) toast.error(err?.message || 'Failed to load dashboard')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [token, query])

  async function exportCsv() {
    try {
      const base = new URL('/api/export/transactions', (config.apiBaseUrl || '').trim() || window.location.origin)
      base.searchParams.set('month', String(ui.month))
      base.searchParams.set('year', String(ui.year))

      // Use fetch to preserve JWT header
      const response = await fetch(base.toString(), { headers: { Authorization: `Bearer ${token}` } })
      if (!response.ok) throw new Error('Export failed')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions_${ui.month}_${ui.year}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      toast.error(err?.message || 'Export failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        subtitle="Your summary and insights for the selected month."
        right={
          <Button variant="ghost" size="sm" icon={<FiDownload />} onClick={exportCsv} title="Export CSV">
            Export
          </Button>
        }
      />

      {loading ? (
        <Card className="flex items-center gap-3">
          <Spinner />
          <div className="text-sm text-gray-600">Loading insights…</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            label="Income"
            value={formatMoney(summary?.totalIncome)}
            icon={<FiArrowUpRight />}
            tone="good"
          />
          <StatCard
            label="Expense"
            value={formatMoney(summary?.totalExpense)}
            icon={<FiArrowDownRight />}
            tone="bad"
          />
          <StatCard
            label="Balance"
            value={formatMoney(summary?.balance)}
            icon={<FiTrendingUp />}
            tone="info"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Spending trend</div>
            <div className="text-xs text-gray-500">Daily expenses</div>
          </div>
          <div className="mt-3">
            <SpendingTrendChart data={trend} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Category breakdown</div>
            <div className="text-xs text-gray-500">Top categories</div>
          </div>
          <div className="mt-3">
            <CategoryBreakdownChart data={breakdown} />
          </div>
        </Card>
      </div>
    </div>
  )
}
