import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import { ChartCard, ChartTooltipBox } from './ChartCard'
import { formatPercent, type CategorySummary } from './dashboardData'

interface CategoryBreakdownProps {
  categories: CategorySummary[]
  totalRuns: number
}

export function CategoryBreakdown({ categories, totalRuns }: CategoryBreakdownProps) {
  const slices = categories.filter((category) => category.total > 0)

  return (
    <ChartCard title="Total runs per category" subtitle="All time" className="lg:row-span-2">
      <div className="relative mx-auto aspect-square w-full max-w-64">
        {totalRuns > 0 ? (
          <PieChart responsive style={{ width: '100%', height: '100%' }}>
            <Pie
              data={slices}
              dataKey="total"
              nameKey="info.label"
              innerRadius="62%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              stroke="var(--color-surface)"
              strokeWidth={2}
              isAnimationActive={false}
            >
              {slices.map((slice) => (
                <Cell key={slice.info.id} fill={slice.info.colorVar} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                const slice = payload?.[0]?.payload as CategorySummary | undefined
                if (!active || !slice) {
                  return null
                }
                return (
                  <ChartTooltipBox
                    title={slice.info.label}
                    rows={[
                      { label: 'Runs', value: String(slice.total), color: slice.info.colorVar },
                      { label: 'Share', value: formatPercent(slice.share) },
                    ]}
                  />
                )
              }}
            />
          </PieChart>
        ) : (
          <div className="absolute inset-0 rounded-full border-[1.25rem] border-surface-3" aria-hidden />
        )}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl tabular-nums">{totalRuns}</span>
          <span className="text-sm text-muted">runs</span>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-3" aria-label="Runs per category">
        {categories.map((category) => (
          <li key={category.info.id} className="flex flex-col gap-1 rounded-xl border border-border p-3">
            <span className="flex items-center gap-2 text-sm text-muted">
              <span
                className="h-4 w-1.5 rounded-full"
                style={{ backgroundColor: category.info.colorVar }}
                aria-hidden
              />
              {category.info.label}
            </span>
            <span className="font-display text-lg">
              <span className="tabular-nums">{category.total}</span>
              <span className="text-sm text-muted"> of {totalRuns}</span>
            </span>
            <span className="text-xs text-muted">{formatPercent(category.share)} of all runs</span>
          </li>
        ))}
      </ul>
    </ChartCard>
  )
}
