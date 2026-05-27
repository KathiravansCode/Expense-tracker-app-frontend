import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from './AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import { useAuth } from '../../context/AuthContext'

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const [params] = useSearchParams()

  const prefillToken = useMemo(() => params.get('token') || '', [params])

  const [token, setToken] = useState(prefillToken)
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await resetPassword({ token, newPassword })
    } catch (err) {
      toast.error(err?.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Set a new password using your reset token."
      footer={
        <div className="text-sm text-gray-600">
          <Link to="/login" className="font-medium text-gray-900 hover:text-gray-700">
            Back to login
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-3">
        <Input label="Reset token" value={token} onChange={(e) => setToken(e.target.value)} required />
        <Input
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          hint="Minimum 6 characters."
        />
        <Button type="submit" variant="secondary" className="w-full" disabled={loading} icon={loading ? <Spinner /> : null}>
          {loading ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </AuthLayout>
  )
}

