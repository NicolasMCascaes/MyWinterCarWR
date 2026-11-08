import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import type { StatsPeriod } from '../moderation/types'
import { ChartCard, ChartTooltipBox } from './ChartCard'
import type { DayPoint } from './dashboardData'

interface SubmissionsChartProps {
  points: DayPoint[]
  period: StatsPeriod
  total: number
}

const AXIS_TICK = { fill: 'var(--color-muted)', fontSize: 12 }

export function SubmissionsChart({ points, period, total }: SubmissionsChartProps) {
  return (
    <ChartCard
      title="Submitted runs"
      subtitle={`Last ${period} days · ${total} ${total === 1 ? 'run' : 'runs'}`}
      className="lg:col-span-2"
    >
      <div className="h-64">
        <AreaChart
          responsive
          style={{ width: '100%', height: '100%' }}
          data={points}
          margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
        >
          <defs>
            <linearGradient id="submissions-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="0" />
          <XAxis
            dataKey="label"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={{ stroke: 'var(--color-border)' }}
            interval="preserveStartEnd"
            minTickGap={16}
          />
          <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} width={40} />
          <Tooltip
            cursor={{ stroke: 'var(--color-muted)', strokeWidth: 1 }}
            content={({ active, payload }) => {
              const point = payload?.[0]?.payload as DayPoint | undefined
              if (!active || !point) {
                return null
              }
              return (
                <ChartTooltipBox
                  title={point.fullLabel}
                  rows={[
                    {
                      label: 'Submissions',
                      value: String(point.submissions),
                      color: 'var(--color-accent)',
                    },
                  ]}
                />
              )
            }}
          />
          <Area
            type="monotone"
            dataKey="submissions"
            name="Submissions"
            stroke="var(--color-accent)"
            strokeWidth={2}
            fill="url(#submissions-fill)"
            activeDot={{
              r: 5,
              stroke: 'var(--color-surface)',
              strokeWidth: 2,
              fill: 'var(--color-accent)',
            }}
            isAnimationActive={false}
          />
        </AreaChart>
      </div>
      <details className="text-sm text-muted">
        <summary className="cursor-pointer select-none hover:text-white">View data</summary>
        <div className="mt-2 max-h-48 overflow-y-auto">
          <table className="w-full text-left">
            <caption className="sr-only">Submitted runs per day</caption>
            <thead>
              <tr>
                <th scope="col" className="py-1 font-normal">
                  Day
                </th>
                <th scope="col" className="py-1 text-right font-normal">
                  Submissions
                </th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => (
                <tr key={point.date} className="border-t border-border text-white">
                  <td className="py-1">{point.fullLabel}</td>
                  <td className="py-1 text-right tabular-nums">{point.submissions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </ChartCard>
  )
}
