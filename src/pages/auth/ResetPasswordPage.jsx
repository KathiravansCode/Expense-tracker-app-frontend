import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from './AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import { useAuth } from '../../context/AuthContext'
 
// ── ResetPasswordPage ─────────────────────────────────────────────────────────
//
// The user arrives here after clicking "Enter reset token" on the
// ForgotPasswordPage success panel, or directly via a link in their email
// (e.g. /reset-password?token=<uuid>).
//
// Changes vs the original file:
//  • useNavigate added — on success we redirect to /login automatically
//    so the user can immediately sign in with their new password.
//  • Added hint text to the token field so it's obvious the value
//    comes from the email.
//  • No other visual / structural changes — layout, styling, and
//    component usage are identical to the rest of the auth pages.
// ─────────────────────────────────────────────────────────────────────────────
 
export default function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
 
  // Pre-fill token from URL query param if the user clicked an email link
  const prefillToken = useMemo(() => params.get('token') || '', [params])
 
  const [token, setToken] = useState(prefillToken)
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
 
  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await resetPassword({ token, newPassword })
      // resetPassword in AuthContext fires toast.success before this line,
      // so the user briefly sees "Password updated. Please login." before
      // being redirected.
      navigate('/login', { replace: true })
    } catch (err) {
      toast.error(err?.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }
 
  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter the token from your email and choose a new password."
      footer={
        <div className="text-sm text-gray-600">
          <Link to="/login" className="font-medium text-gray-900 hover:text-gray-700">
            Back to login
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-3">
        <Input
          label="Reset token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          hint="Paste the token you received in your email."
        />
        <Input
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          hint="Minimum 6 characters."
        />
        <Button
          type="submit"
          variant="secondary"
          className="w-full"
          disabled={loading}
          icon={loading ? <Spinner /> : null}
        >
          {loading ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </AuthLayout>
  )
}