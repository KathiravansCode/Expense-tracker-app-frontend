import { cn } from '../../utils/cn'

export default function PageHeader({ title, subtitle, right, className }) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-3', className)}>
      <div className="min-w-0">
        <div className="truncate text-lg font-semibold">{title}</div>
        {subtitle ? <div className="mt-0.5 text-sm text-gray-600">{subtitle}</div> : null}
      </div>
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  )
}

