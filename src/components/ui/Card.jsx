import { cn } from '../../utils/cn'

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn('rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur', className)}
      {...props}
    >
      {children}
    </div>
  )
}

