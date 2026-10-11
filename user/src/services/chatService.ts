import { suggestedChatQuestions } from '@/data/demoChatQuestions'
import { generateChatResponse } from '@/lib/chatbot-retrieval'
import { useBusinessStore } from '@/store/businessStore'
import type { ChatRequest, ChatResponse } from '@/types/chatbot'

/**
 * Frontend demo chat adapter.
 * Future integration: replace the body of sendMessage with a POST to
 * `${VITE_API_BASE_URL}/chat` on the server. Do not call OpenAI from the browser.
 */
export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
  const businesses = useBusinessStore.getState().getBusinesses()

  await new Promise((resolve) => {
    window.setTimeout(resolve, 550 + Math.random() * 350)
  })

  return generateChatResponse(request.message, businesses, request.context)
}

export async function getSuggestedQuestions(): Promise<string[]> {
  return [...suggestedChatQuestions]
}
