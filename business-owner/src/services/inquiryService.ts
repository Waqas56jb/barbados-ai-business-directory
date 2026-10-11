import { useDemoStore } from '@/store/demoStore'
import type { InquiryStatus } from '@/types'

const delay = <T,>(value: T, ms = 100) =>
  new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), ms)
  })

export async function getInquiries(businessId?: string, status?: InquiryStatus | 'all') {
  let items = useDemoStore.getState().inquiries
  if (businessId) items = items.filter((item) => item.businessId === businessId)
  if (status && status !== 'all') items = items.filter((item) => item.status === status)
  return delay(items)
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  useDemoStore.getState().setInquiryStatus(id, status)
  return delay(undefined)
}

export async function updateInquiryNotes(id: string, internalNotes: string) {
  useDemoStore.getState().updateInquiry(id, { internalNotes })
  return delay(undefined)
}
