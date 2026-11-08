import { formatRunTime, maskRunTime, parseRunTime, timeAgo, toApiTime, totalHundredths } from './time'

describe('parseRunTime', () => {
  it('parses hours, minutes, seconds and hundredths', () => {
    expect(parseRunTime('00:06:54.14')).toEqual({ hours: 0, minutes: 6, seconds: 54, hundredths: 14 })
  })

  it('treats a single fraction digit as tenths', () => {
    expect(parseRunTime('0:06:54.5')?.hundredths).toBe(50)
  })

  it('accepts times without fraction', () => {
    expect(parseRunTime('01:02:03')).toEqual({ hours: 1, minutes: 2, seconds: 3, hundredths: 0 })
  })

  it.each(['', '6:54', '00:60:00', '00:00:60', 'abc', '00:06:54.145'])('rejects %s', (value) => {
    expect(parseRunTime(value)).toBeNull()
  })
})

describe('toApiTime', () => {
  it('formats with hundredths when present', () => {
    expect(toApiTime({ hours: 0, minutes: 6, seconds: 54, hundredths: 14 })).toBe('00:06:54.14')
  })

  it('omits a zero fraction', () => {
    expect(toApiTime({ hours: 0, minutes: 5, seconds: 0, hundredths: 0 })).toBe('00:05:00')
  })
})

describe('formatRunTime', () => {
  it('normalises backend values to two decimals', () => {
    expect(formatRunTime('00:06:54.14')).toBe('00:06:54.14')
    expect(formatRunTime('00:05:00')).toBe('00:05:00.00')
  })
})

describe('timeAgo', () => {
  const now = new Date('2026-11-08T12:00:00').getTime()

  it('describes hours and days', () => {
    expect(timeAgo('2026-11-08T10:00:00', now)).toBe('2 hours ago')
    expect(timeAgo('2026-11-07T12:00:00', now)).toBe('yesterday')
  })

  it('returns just now for recent dates', () => {
    expect(timeAgo('2026-11-08T11:59:40', now)).toBe('just now')
  })
})

describe('maskRunTime', () => {
  it.each([
    ['', ''],
    ['1', '1'],
    ['012', '01:2'],
    ['01234', '01:23:4'],
    ['0123456', '01:23:45.6'],
    ['012345678999', '01:23:45.67'],
    ['01:23:45.67', '01:23:45.67'],
    ['ab01c2', '01:2'],
  ])('masks %s as %s', (input, expected) => {
    expect(maskRunTime(input)).toBe(expected)
  })
})

describe('totalHundredths', () => {
  it('converts a run time to hundredths', () => {
    expect(totalHundredths({ hours: 1, minutes: 2, seconds: 3, hundredths: 4 })).toBe(372304)
  })
})
