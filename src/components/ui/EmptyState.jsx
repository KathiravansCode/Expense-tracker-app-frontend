import { cn } from '../../utils/cn'

export default function EmptyState({ title = 'Nothing here yet', description, action, className }) {
  return (
    <div className={cn('rounded-2xl border border-dashed border-gray-200 bg-white/60 p-6 text-center', className)}>
      <div className="text-sm font-semibold">{title}</div>
      {description ? <div className="mt-1 text-sm text-gray-600">{description}</div> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  )
}

