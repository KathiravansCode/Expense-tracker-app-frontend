import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiCheckCircle, FiMail } from 'react-icons/fi'
import AuthLayout from './AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import { useAuth } from '../../context/AuthContext'

// ── ForgotPasswordPage ────────────────────────────────────────────────────────
//
// Two render states:
//
//  1. FORM  — default. User enters their email and submits.
//
//  2. SUCCESS — shown after the API responds with success: true.
//     • Displays the exact message string returned by the backend
//       (e.g. "If the email address matches an active profile, a secure
//       validation token has been successfully sent.")
//     • Shows a helper note reminding the user to check their inbox.
//     • Provides a "Enter reset token" button that navigates to /reset-password.
//
// Security note: because the backend always returns success: true for any email
// (real or not), we never reveal whether an account exists — the UI mirrors
// that by only showing the generic server message.
// ─────────────────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  // null  → form is visible
  // string → success panel is visible (the string IS the server message)
  const [successMessage, setSuccessMessage] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await forgotPassword({ email })
      setSuccessMessage(
        result?.message ||
          'If the email address matches an active profile, a secure validation token has been successfully sent.',
      )
    } catch (err) {
      toast.error(err?.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  // ── Success state ─────────────────────────────────────────────
  if (successMessage) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="A reset token has been dispatched if the account exists."
        footer={
          <div className="text-sm text-gray-600">
            <Link to="/login" className="font-medium text-gray-900 hover:text-gray-700">
              Back to login
            </Link>
          </div>
        }
      >
        <div className="space-y-3">
          {/* Server message banner */}
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-500/10 p-4">
            <FiCheckCircle className="mt-0.5 size-4 shrink-0 text-emerald-700" />
            <p className="text-sm leading-relaxed text-emerald-800">{successMessage}</p>
          </div>

          {/* Instructional helper */}
          <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <FiMail className="mt-0.5 size-4 shrink-0 text-gray-400" />
            <p className="text-sm leading-relaxed text-gray-600">
              Open the email sent to{' '}
              <span className="font-medium text-gray-900">{email}</span>, copy the
              reset token, and paste it on the next page.
            </p>
          </div>

          <Button to="/reset-password" variant="secondary" className="w-full">
            Enter reset token
          </Button>
        </div>
      </AuthLayout>
    )
  }

  // ── Default form state ────────────────────────────────────────
  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your registered email to receive a reset token."
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
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="secondary"
          className="w-full"
          disabled={loading}
          icon={loading ? <Spinner /> : null}
        >
          {loading ? 'Requesting…' : 'Request password reset'}
        </Button>
      </form>
    </AuthLayout>
  )
}