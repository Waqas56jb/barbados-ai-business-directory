import type { AnalyticsPoint } from '@/types'

function buildSeries(businessId: string, seed: number): AnalyticsPoint[] {
  const points: AnalyticsPoint[] = []
  const start = new Date('2026-07-14T00:00:00.000Z')

  for (let i = 0; i < 90; i += 1) {
    const date = new Date(start)
    date.setUTCDate(start.getUTCDate() + i)
    const wave = Math.sin((i + seed) / 6) * 12
    const weekendBoost = date.getUTCDay() === 0 || date.getUTCDay() === 6 ? 18 : 0
    const views = Math.max(8, Math.round(40 + seed * 8 + wave + weekendBoost + (i % 5)))
    const searchAppearances = Math.max(5, Math.round(views * 0.7))
    const clicks = Math.max(1, Math.round(views * 0.22))
    const websiteClicks = Math.max(0, Math.round(clicks * 0.45))
    const contactClicks = Math.max(0, Math.round(clicks * 0.2))
    const inquiries = Math.max(0, Math.round(clicks * 0.08))
    const favorites = Math.max(0, Math.round(clicks * 0.12))

    points.push({
      businessId,
      date: date.toISOString().slice(0, 10),
      views,
      searchAppearances,
      clicks,
      websiteClicks,
      contactClicks,
      inquiries,
      favorites,
      promoImpressions: businessId === 'biz-001' && i > 70 ? Math.round(views * 1.4) : 0,
      promoClicks: businessId === 'biz-001' && i > 70 ? Math.round(clicks * 0.6) : 0,
    })
  }

  return points
}

export const mockAnalytics: AnalyticsPoint[] = [
  ...buildSeries('biz-001', 3),
  ...buildSeries('biz-002', 2),
  ...buildSeries('biz-003', 1),
]
