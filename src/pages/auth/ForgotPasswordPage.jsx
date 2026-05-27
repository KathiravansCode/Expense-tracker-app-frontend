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

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await forgotPassword({ email })
      toast.success('If the account exists, reset instructions were sent.')
    } catch (err) {
      toast.error(err?.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Forgot password"
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
          {loading ? 'Requesting…' : 'Request password reset'}
        </Button>
      </form>
    </AuthLayout>
  )
}
