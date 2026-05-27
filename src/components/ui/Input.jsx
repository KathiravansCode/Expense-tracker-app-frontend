import { cn } from '../../utils/cn'

export default function Input({ label, hint, error, className, ...props }) {
  return (
    <label className={cn('block', className)}>
      {label ? <div className="mb-1 text-xs font-medium text-gray-700">{label}</div> : null}
      <input
        className={cn(
          'h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none transition',
          'border-gray-200 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20',
          error && 'border-red-300 focus:border-red-400 focus:ring-red-500/15',
        )}
        {...props}
      />
      {error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
      {!error && hint ? <div className="mt-1 text-xs text-gray-500">{hint}</div> : null}
    </label>
  )
}

