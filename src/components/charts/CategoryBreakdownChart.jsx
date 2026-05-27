import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { formatMoney } from '../../utils/format'

export default function CategoryBreakdownChart({ data }) {
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.35)" />
          <XAxis dataKey="categoryName" axisLine={false} tickLine={false} fontSize={12} />
          <YAxis
            tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            axisLine={false}
            tickLine={false}
            fontSize={12}
            width={40}
          />
          <Tooltip
            formatter={(value) => formatMoney(value)}
            contentStyle={{ borderRadius: 12, border: '1px solid rgba(229,231,235,1)' }}
          />
          <Bar dataKey="totalAmount" fill="rgba(16,185,129,0.65)" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

