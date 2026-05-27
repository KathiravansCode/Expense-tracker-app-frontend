import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { cn } from '../../utils/cn'
import { formatDate, formatMoney } from '../../utils/format'
import Button from '../ui/Button'

export default function TransactionsTable({ items, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/80 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Note</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className="border-t border-gray-100">
                <td className="px-4 py-3 text-gray-700">{formatDate(t.transactionDate)}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{t.categoryName || '—'}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
                      t.transactionType === 'INCOME'
                        ? 'bg-emerald-500/10 text-emerald-800'
                        : 'bg-red-500/10 text-red-700',
                    )}
                  >
                    {t.transactionType}
                  </span>
                  {t.isUnusual ? (
                    <span className="ml-2 inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-800">
                      Unusual
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 font-semibold">{formatMoney(t.amount)}</td>
                <td className="max-w-[28ch] truncate px-4 py-3 text-gray-600">{t.description || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" icon={<FiEdit2 />} onClick={() => onEdit(t)} />
                    <Button size="sm" variant="ghost" icon={<FiTrash2 />} onClick={() => onDelete(t)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

