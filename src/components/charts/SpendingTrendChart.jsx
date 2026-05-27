import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { formatDate, formatMoney } from '../../utils/format'

export default function SpendingTrendChart({ data }) {
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.35)" />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => formatDate(v).slice(0, 6)}
            axisLine={false}
            tickLine={false}
            fontSize={12}
          />
          <YAxis
            tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            axisLine={false}
            tickLine={false}
            fontSize={12}
            width={40}
          />
          <Tooltip
            formatter={(value) => formatMoney(value)}
            labelFormatter={(label) => formatDate(label)}
            contentStyle={{ borderRadius: 12, border: '1px solid rgba(229,231,235,1)' }}
          />
          <Line type="monotone" dataKey="totalExpense" stroke="rgb(16 185 129)" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

