import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

const styles = {
  base: 'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-50 disabled:pointer-events-none',
  size: {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  },
  variant: {
    primary: 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400 shadow-sm',
    secondary: 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
  },
}

function Content({ icon, children }) {
  return (
    <>
      {icon ? <span className="grid place-items-center">{icon}</span> : null}
      {children ? <span className="whitespace-nowrap">{children}</span> : null}
    </>
  )
}

export default function Button({
  to,
  type = 'button',
  variant = 'secondary',
  size = 'md',
  className,
  icon,
  children,
  ...props
}) {
  const cls = cn(styles.base, styles.size[size], styles.variant[variant], className)

  const inner = (
    <motion.span whileTap={{ scale: 0.98 }} className="inline-flex items-center justify-center gap-2">
      <Content icon={icon} children={children} />
    </motion.span>
  )

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {inner}
      </Link>
    )
  }

  return (
    <button type={type} className={cls} {...props}>
      {inner}
    </button>
  )
}

