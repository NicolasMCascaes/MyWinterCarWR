import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard, ChartTooltipBox } from './ChartCard'
import type { CategorySummary } from './dashboardData'

const SERIES = [
  { key: 'approved', label: 'Approved', color: 'var(--color-success)' },
  { key: 'rejected', label: 'Rejected', color: 'var(--color-danger)' },
  { key: 'pending', label: 'Pending', color: 'var(--color-warning)' },
] as const

const AXIS_TICK = { fill: 'var(--color-muted)', fontSize: 12 }

export function ReviewOutcomesChart({ categories }: { categories: CategorySummary[] }) {
  const data = categories.map((category) => ({ ...category, label: category.info.label }))

  return (
    <ChartCard title="Review outcomes" subtitle="All time, per category" className="lg:col-span-2">
      <ul className="flex flex-wrap gap-4 text-sm" aria-label="Legend">
        {SERIES.map((series) => (
          <li key={series.key} className="flex items-center gap-2">
            <span className="size-3 rounded-sm" style={{ backgroundColor: series.color }} aria-hidden />
            {series.label}
          </li>
        ))}
      </ul>
      <div className="h-56">
        <BarChart
          responsive
          style={{ width: '100%', height: '100%' }}
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 8, bottom: 0, left: 8 }}
          barSize={18}
        >
          <CartesianGrid horizontal={false} stroke="var(--color-border)" />
          <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            width={96}
          />
          <Tooltip
            cursor={{ fill: 'var(--color-surface-3)', opacity: 0.4 }}
            content={({ active, payload }) => {
              const row = payload?.[0]?.payload as CategorySummary | undefined
              if (!active || !row) {
                return null
              }
              return (
                <ChartTooltipBox
                  title={row.info.label}
                  rows={SERIES.map((series) => ({
                    label: series.label,
                    value: String(row[series.key]),
                    color: series.color,
                  }))}
                />
              )
            }}
          />
          {SERIES.map((series, index) => (
            <Bar
              key={series.key}
              dataKey={series.key}
              name={series.label}
              stackId="outcome"
              fill={series.color}
              stroke="var(--color-surface)"
              strokeWidth={2}
              radius={index === SERIES.length - 1 ? [0, 4, 4, 0] : 0}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </div>
    </ChartCard>
  )
}
