import { exportCsv } from '@/lib/formatters'
import { mockDelay } from '@/services/delay'
import { useAdminStore } from '@/store/adminStore'

export async function getPlatformAnalytics(range: '7d' | '30d' | '90d' = '30d') {
  await mockDelay()
  const analytics = useAdminStore.getState().analytics
  const days = range === '7d' ? 7 : range === '90d' ? 90 : 30
  const sliced = analytics.slice(-days)
  const state = useAdminStore.getState()
  return {
    range,
    series: sliced,
    kpis: {
      publishedListings: state.businesses.filter((b) => b.status === 'published').length,
      pendingSubmissions: state.businesses.filter((b) =>
        ['pending_review', 'in_review', 'changes_requested'].includes(b.status),
      ).length,
      activeOwners: state.owners.filter((o) => o.status === 'active').length,
      directorySearches: sliced.reduce((sum, point) => sum + point.searches, 0),
      listingViews: sliced.reduce((sum, point) => sum + point.listingViews, 0),
      aiConversations: sliced.reduce((sum, point) => sum + point.aiConversations, 0),
      fallbackRate:
        sliced.reduce((sum, point) => sum + point.aiConversations, 0) === 0
          ? 0
          : Math.round(
              (sliced.reduce((sum, point) => sum + point.fallbacks, 0) /
                sliced.reduce((sum, point) => sum + point.aiConversations, 0)) *
                100,
            ),
      activeCampaigns: state.promotions.filter((p) => p.status === 'active').length,
      openReports: state.reports.filter((r) => r.status === 'new' || r.status === 'under_review').length,
    },
    categoryDistribution: Object.entries(
      state.businesses.reduce<Record<string, number>>((acc, business) => {
        acc[business.category] = (acc[business.category] ?? 0) + 1
        return acc
      }, {}),
    ).map(([name, value]) => ({ name, value })),
    parishDistribution: Object.entries(
      state.businesses.reduce<Record<string, number>>((acc, business) => {
        acc[business.parish] = (acc[business.parish] ?? 0) + 1
        return acc
      }, {}),
    ).map(([name, value]) => ({ name, value })),
    topListings: state.businesses
      .filter((b) => b.status === 'published')
      .slice(0, 5)
      .map((b, index) => ({
        id: b.id,
        name: b.name,
        parish: b.parish,
        demoViews: 1200 - index * 140,
      })),
  }
}

export async function exportAnalytics(range: '7d' | '30d' | '90d' = '30d') {
  const data = await getPlatformAnalytics(range)
  exportCsv(`demo-analytics-${range}.csv`, data.series.map((point) => ({ ...point })))
  return data
}
