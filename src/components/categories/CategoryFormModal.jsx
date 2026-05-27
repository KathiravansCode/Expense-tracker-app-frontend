import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'

export default function CategoryFormModal({ open, onClose, onSave, initial }) {
  const isEdit = Boolean(initial?.id)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setName(initial?.name || '')
  }, [open, initial])

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave({ name }, initial)
      toast.success(isEdit ? 'Category updated' : 'Category created')
      onClose()
    } catch (err) {
      toast.error(err?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit category' : 'Add category'}>
      <form onSubmit={submit} className="space-y-3">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" variant="secondary" disabled={loading} icon={loading ? <Spinner /> : null}>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

