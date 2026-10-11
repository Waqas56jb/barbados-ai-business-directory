import { buildKnowledgeSources, previewAnswer } from '@/lib/knowledgePreview'
import { useDemoStore } from '@/store/demoStore'
import type { FAQ } from '@/types'

const delay = <T,>(value: T, ms = 120) =>
  new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), ms)
  })

export async function getKnowledgeProfile(businessId: string) {
  const state = useDemoStore.getState()
  const business = state.businesses.find((item) => item.id === businessId)
  if (!business) return delay(undefined)
  const faqs = state.faqs.filter((item) => item.businessId === businessId && item.visibility !== 'hidden')
  return delay({
    business,
    faqs,
    sources: buildKnowledgeSources(business, faqs),
  })
}

export async function getFAQs(businessId?: string): Promise<FAQ[]> {
  const faqs = useDemoStore.getState().faqs
  return delay(businessId ? faqs.filter((item) => item.businessId === businessId) : faqs)
}

export async function saveFAQ(input: FAQ): Promise<FAQ> {
  useDemoStore.getState().upsertFaq(input)
  return delay(input)
}

export async function deleteFAQ(id: string): Promise<void> {
  useDemoStore.getState().deleteFaq(id)
  return delay(undefined)
}

export async function previewKnowledgeAnswer(businessId: string, question: string) {
  const state = useDemoStore.getState()
  const business = state.businesses.find((item) => item.id === businessId)
  if (!business) {
    return delay({
      answer: 'Select a business to preview grounded answers.',
      sources: [],
      grounded: false,
    })
  }
  const faqs = state.faqs.filter((item) => item.businessId === businessId && item.visibility === 'public')
  return delay(previewAnswer(business, faqs, question))
}
