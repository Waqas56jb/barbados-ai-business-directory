import type { OpeningHoursDay } from '@/types'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function defaultOpeningHours(
  open = '08:00',
  close = '17:00',
  closedDays: string[] = [],
): OpeningHoursDay[] {
  return days.map((day) => {
    if (closedDays.includes(day)) {
      return { day, status: 'closed', intervals: [] }
    }
    return {
      day,
      status: 'open',
      intervals: [{ open, close }],
    }
  })
}
