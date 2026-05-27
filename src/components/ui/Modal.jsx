import { AnimatePresence, motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { cn } from '../../utils/cn'
import Button from './Button'

export default function Modal({ open, onClose, title, children, className }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center px-3 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: 10, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className={cn(
              'relative z-10 w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-4 shadow-xl',
              className,
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{title}</div>
              </div>
              <Button variant="ghost" size="sm" aria-label="Close" onClick={onClose} icon={<FiX />} />
            </div>
            <div className="mt-3">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

