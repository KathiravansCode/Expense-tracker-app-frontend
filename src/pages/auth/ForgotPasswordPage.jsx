import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from './AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import { useAuth } from '../../context/AuthContext'

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetToken, setResetToken] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setResetToken(null)
    try {
      const data = await forgotPassword({ email })
      setResetToken(data?.resetToken || null)
      toast.success('Reset token generated')
    } catch (err) {
      toast.error(err?.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  async function copyToken() {
    try {
      await navigator.clipboard.writeText(resetToken)
      toast.success('Copied')
    } catch {
      toast.error('Copy failed')
    }
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="We’ll generate a reset token (your backend currently returns it directly)."
      footer={
        <div className="text-sm text-gray-600">
          <Link to="/login" className="font-medium text-gray-900 hover:text-gray-700">
            Back to login
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-3">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit" variant="secondary" className="w-full" disabled={loading} icon={loading ? <Spinner /> : null}>
          {loading ? 'Requesting…' : 'Generate reset token'}
        </Button>
      </form>

      {resetToken ? (
        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-3">
          <div className="text-xs font-medium text-gray-700">Reset token</div>
          <div className="mt-1 break-all font-mono text-xs text-gray-800">{resetToken}</div>
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={copyToken}>
              Copy
            </Button>
            <Link to={`/reset-password?token=${encodeURIComponent(resetToken)}`} className="text-sm font-medium text-emerald-700 hover:text-emerald-600">
              Reset now
            </Link>
          </div>
        </div>
      ) : null}
    </AuthLayout>
  )
}

