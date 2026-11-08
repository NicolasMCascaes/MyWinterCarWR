const TIME_PATTERN = /^(\d{1,2}):([0-5]\d):([0-5]\d)(?:\.(\d{1,2}))?$/

export interface RunTime {
  hours: number
  minutes: number
  seconds: number
  hundredths: number
}

export function parseRunTime(value: string): RunTime | null {
  const match = TIME_PATTERN.exec(value.trim())
  if (!match) {
    return null
  }
  const [, hours, minutes, seconds, fraction = '0'] = match
  return {
    hours: Number(hours),
    minutes: Number(minutes),
    seconds: Number(seconds),
    hundredths: Number(fraction.padEnd(2, '0')),
  }
}

const pad = (value: number) => String(value).padStart(2, '0')

export function toApiTime(time: RunTime): string {
  const base = `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`
  return time.hundredths > 0 ? `${base}.${pad(time.hundredths)}` : base
}

export function formatRunTime(apiTime: string): string {
  const parsed = parseRunTime(apiTime.slice(0, 11))
  if (!parsed) {
    return apiTime
  }
  return `${pad(parsed.hours)}:${pad(parsed.minutes)}:${pad(parsed.seconds)}.${pad(parsed.hundredths)}`
}

const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
]

export function timeAgo(isoDate: string, now: number = Date.now()): string {
  const elapsed = new Date(isoDate).getTime() - now
  for (const [unit, size] of UNITS) {
    if (Math.abs(elapsed) >= size) {
      return relativeFormatter.format(Math.round(elapsed / size), unit)
    }
  }
  return 'just now'
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate))
}
