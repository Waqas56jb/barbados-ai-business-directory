import { useDemoStore } from '@/store/demoStore'
import type { AnalyticsPoint } from '@/types'

const delay = <T,>(value: T, ms = 120) =>
  new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), ms)
  })

export type AnalyticsRange = '7d' | '30d' | '90d' | 'custom'

export interface AnalyticsSummary {
  views: number
  searchAppearances: number
  clicks: number
  websiteClicks: number
  contactClicks: number
  inquiries: number
  favorites: number
  promoImpressions: number
  promoClicks: number
  points: AnalyticsPoint[]
  previous: {
    views: number
    clicks: number
    inquiries: number
  }
}

function inRange(date: string, start: string, end: string) {
  return date >= start && date <= end
}

export async function getBusinessAnalytics(
  businessId: string,
  range: AnalyticsRange,
  customStart?: string,
  customEnd?: string,
): Promise<AnalyticsSummary> {
  const all = useDemoStore
    .getState()
    .analytics.filter((point) => point.businessId === businessId)
    .sort((a, b) => a.date.localeCompare(b.date))

  const end = customEnd ?? all.at(-1)?.date ?? new Date().toISOString().slice(0, 10)
  const endDate = new Date(`${end}T00:00:00.000Z`)
  const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 30
  const startDate = customStart
    ? new Date(`${customStart}T00:00:00.000Z`)
    : new Date(endDate.getTime() - (days - 1) * 86400000)
  const start = startDate.toISOString().slice(0, 10)

  const points = all.filter((point) => inRange(point.date, start, end))
  const previousEnd = new Date(startDate.getTime() - 86400000)
  const previousStart = new Date(previousEnd.getTime() - (points.length - 1) * 86400000)
  const previousPoints = all.filter((point) =>
    inRange(
      point.date,
      previousStart.toISOString().slice(0, 10),
      previousEnd.toISOString().slice(0, 10),
    ),
  )

  const sum = (items: AnalyticsPoint[], key: keyof AnalyticsPoint) =>
    items.reduce((total, item) => total + (Number(item[key]) || 0), 0)

  return delay({
    views: sum(points, 'views'),
    searchAppearances: sum(points, 'searchAppearances'),
    clicks: sum(points, 'clicks'),
    websiteClicks: sum(points, 'websiteClicks'),
    contactClicks: sum(points, 'contactClicks'),
    inquiries: sum(points, 'inquiries'),
    favorites: sum(points, 'favorites'),
    promoImpressions: sum(points, 'promoImpressions'),
    promoClicks: sum(points, 'promoClicks'),
    points,
    previous: {
      views: sum(previousPoints, 'views'),
      clicks: sum(previousPoints, 'clicks'),
      inquiries: sum(previousPoints, 'inquiries'),
    },
  })
}
