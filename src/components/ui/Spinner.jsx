import { cn } from '../../utils/cn'

export default function Spinner({ className }) {
  return (
    <div
      className={cn(
        'size-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900/70',
        className,
      )}
    />
  )
}

