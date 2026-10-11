import { mockDelay } from '@/services/delay'
import { useAdminStore } from '@/store/adminStore'

export async function getPendingListings(filters: { tab?: string; search?: string } = {}) {
  await mockDelay()
  const state = useAdminStore.getState()
  let reviews = [...state.listingReviews]
  const tab = filters.tab ?? 'pending'
  if (tab === 'new') reviews = reviews.filter((r) => r.reviewStatus === 'pending_review')
  else if (tab === 'updated') reviews = reviews.filter((r) => r.version > 1)
  else if (tab === 'changes') reviews = reviews.filter((r) => r.reviewStatus === 'changes_requested')
  else if (tab === 'rejected') reviews = reviews.filter((r) => r.reviewStatus === 'rejected')
  else if (tab === 'approved') reviews = reviews.filter((r) => r.reviewStatus === 'published')
  else if (tab === 'pending') {
    reviews = reviews.filter((r) =>
      ['pending_review', 'in_review', 'changes_requested'].includes(r.reviewStatus),
    )
  }
  const search = filters.search?.toLowerCase().trim()
  return reviews
    .map((review) => ({
      review,
      business: state.businesses.find((b) => b.id === review.businessId),
      owner: state.owners.find(
        (o) => o.id === state.businesses.find((b) => b.id === review.businessId)?.ownerId,
      ),
    }))
    .filter((row) => row.business)
    .filter((row) => {
      if (!search) return true
      return (
        row.business!.name.toLowerCase().includes(search) ||
        row.owner?.name.toLowerCase().includes(search) ||
        row.review.id.toLowerCase().includes(search)
      )
    })
}

export async function approveListing(id: string) {
  await mockDelay()
  useAdminStore.getState().setBusinessStatus(id, 'published', 'Approved in demo moderation')
}

export async function requestListingChanges(id: string, reason: string) {
  await mockDelay()
  if (!reason.trim()) throw new Error('Change request reason is required')
  useAdminStore.getState().setBusinessStatus(id, 'changes_requested', reason.trim())
}

export async function rejectListing(id: string, reason: string) {
  await mockDelay()
  if (!reason.trim()) throw new Error('Rejection reason is required')
  useAdminStore.getState().setBusinessStatus(id, 'rejected', reason.trim())
}
