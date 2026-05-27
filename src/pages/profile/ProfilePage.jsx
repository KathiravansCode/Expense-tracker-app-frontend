import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiSave, FiShield, FiTrash2 } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/layout/PageHeader'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

export default function ProfilePage() {
  const { user, getProfile, updateProfile, changePassword, deleteAccount } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')

  const [cpLoading, setCpLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      try {
        const p = await getProfile()
        if (cancelled) return
        setName(p?.name || '')
        setEmail(p?.email || '')
      } catch (err) {
        if (!cancelled) toast.error(err?.message || 'Failed to load profile')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [getProfile])

  async function saveProfile(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile({ name, email })
    } catch (err) {
      toast.error(err?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function savePassword(e) {
    e.preventDefault()
    setCpLoading(true)
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err?.message || 'Password change failed')
    } finally {
      setCpLoading(false)
    }
  }

  async function onDelete() {
    const ok = window.confirm('This will permanently delete your account and all data. Continue?')
    if (!ok) return
    try {
      await deleteAccount()
    } catch (err) {
      toast.error(err?.message || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Profile" subtitle="Manage your account settings." />

      {loading ? (
        <Card className="flex items-center gap-3">
          <Spinner />
          <div className="text-sm text-gray-600">Loading profile…</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Card>
            <div className="text-sm font-semibold">Profile</div>
            <form onSubmit={saveProfile} className="mt-4 space-y-3">
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <div className="flex justify-end">
                <Button type="submit" variant="secondary" size="sm" icon={saving ? <Spinner /> : <FiSave />} disabled={saving}>
                  Save
                </Button>
              </div>
            </form>
          </Card>

          <Card>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <FiShield />
              Change password
            </div>
            <form onSubmit={savePassword} className="mt-4 space-y-3">
              <Input
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <Input
                label="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  icon={cpLoading ? <Spinner /> : <FiSave />}
                  disabled={cpLoading}
                >
                  Update password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <Card className="border-red-200 bg-red-50/50">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-red-900">Danger zone</div>
            <div className="mt-1 text-sm text-red-800">Delete your account and all associated data.</div>
          </div>
          <Button variant="danger" size="sm" icon={<FiTrash2 />} onClick={onDelete}>
            Delete
          </Button>
        </div>
      </Card>
    </div>
  )
}

