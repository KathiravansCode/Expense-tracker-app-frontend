import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../context/AuthContext'
import { AppProvider } from '../context/AppContext'
import ProtectedRoute from './ProtectedRoute'
import AppShell from './AppShell'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import TransactionsPage from '../pages/transactions/TransactionsPage'
import CategoriesPage from '../pages/categories/CategoriesPage'
import BudgetsPage from '../pages/budgets/BudgetsPage'
import AlertsPage from '../pages/alerts/AlertsPage'
import ProfilePage from '../pages/profile/ProfilePage'
import NotFoundPage from '../pages/notfound/NotFoundPage'
import { useAuth } from '../context/AuthContext'

function Providers({ children }) {
  const { token } = useAuth()
  return <AppProvider token={token}>{children}</AppProvider>
}

export default function AppRoot() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Providers>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(229,231,235,1)' },
            }}
          />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route index element={<DashboardPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/budgets" element={<BudgetsPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Providers>
      </AuthProvider>
    </BrowserRouter>
  )
}

