import { mockDelay } from '@/services/delay'
import { useAdminStore } from '@/store/adminStore'

export async function getDashboardOverview() {
  await mockDelay()
  const state = useAdminStore.getState()
  return {
    totalListings: state.businesses.length,
    publishedListings: state.businesses.filter((b) => b.status === 'published').length,
    pendingApprovals: state.businesses.filter((b) =>
      ['pending_review', 'in_review', 'changes_requested'].includes(b.status),
    ).length,
    registeredOwners: state.owners.length,
    activeCampaigns: state.promotions.filter((p) => p.status === 'active').length,
    directorySearches: state.analytics.reduce((sum, point) => sum + point.searches, 0),
    aiConversations: state.conversations.length,
    openReports: state.reports.filter((r) => r.status === 'new' || r.status === 'under_review').length,
    analytics: state.analytics,
    auditLogs: state.auditLogs.slice(0, 8),
    health: [
      { name: 'Public directory', status: 'demo_ok' },
      { name: 'Business owner dashboard', status: 'demo_ok' },
      { name: 'AI chatbot', status: state.chatbotSettings.visibleOnPublicSite ? 'demo_ok' : 'demo_paused' },
      { name: 'Knowledge indexing', status: 'simulated' },
      { name: 'Advertising', status: 'demo_ok' },
      { name: 'Backend connectivity', status: 'not_connected' },
    ] as const,
  }
}

export async function getAdministrators() {
  await mockDelay()
  return useAdminStore.getState().administrators
}

export async function getAuditLogs() {
  await mockDelay()
  return useAdminStore.getState().auditLogs
}
