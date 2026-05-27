import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="hidden lg:block">
            <div className="rounded-3xl border border-gray-200 bg-white/60 p-8 shadow-sm backdrop-blur">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-2 text-emerald-800">
                <span className="text-lg font-semibold">₹</span>
                <span className="text-sm font-semibold">Expense Tracker</span>
              </div>
              <div className="mt-6 text-3xl font-semibold leading-tight">
                Track income, expenses, budgets — with a clean, modern dashboard.
              </div>
              <div className="mt-3 text-sm text-gray-600">
                Built to pair with your Spring Boot + PostgreSQL backend (JWT auth, analytics, budgets, export).
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
                  <div className="font-semibold">Fast add</div>
                  <div className="mt-1 text-gray-600">Add transactions in seconds.</div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
                  <div className="font-semibold">Insights</div>
                  <div className="mt-1 text-gray-600">Trends and breakdown charts.</div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
                  <div className="font-semibold">Budgets</div>
                  <div className="mt-1 text-gray-600">Category limits and alerts.</div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white/70 p-4">
                  <div className="font-semibold">Export</div>
                  <div className="mt-1 text-gray-600">Download monthly CSV.</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Tip: set `VITE_API_BASE_URL` in `.env` to point to your backend.
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="mb-4">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold">
                  <span className="grid size-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-700">₹</span>
                  Expense Tracker
                </Link>
              </div>
              <Card className="p-5">
                <div className="text-xl font-semibold">{title}</div>
                {subtitle ? <div className="mt-1 text-sm text-gray-600">{subtitle}</div> : null}
                <div className="mt-5">{children}</div>
                {footer ? <div className="mt-5 border-t border-gray-100 pt-4">{footer}</div> : null}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

