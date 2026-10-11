import { create } from 'zustand'
import { suggestedChatQuestions } from '@/data/demoChatQuestions'
import { siteConfig } from '@/config/site'
import type { ChatContext, ChatMessage } from '@/types/chatbot'

interface ChatState {
  isOpen: boolean
  isProcessing: boolean
  messages: ChatMessage[]
  context: ChatContext | null
  draft: string
  openChat: (context?: ChatContext) => void
  closeChat: () => void
  toggleChat: () => void
  setDraft: (value: string) => void
  addMessage: (message: ChatMessage) => void
  setProcessing: (value: boolean) => void
  clearConversation: () => void
  getSuggestedQuestions: () => string[]
}

function welcomeMessage(): ChatMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    content: `Hi, I’m ${siteConfig.chatbotName}. I can answer questions using the fictional Barbados Explorer directory data in this demo. Ask about listings, locations, or services — I’ll only use information present in the dataset.`,
    createdAt: new Date().toISOString(),
  }
}

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  isProcessing: false,
  messages: [welcomeMessage()],
  context: null,
  draft: '',

  openChat: (context) => {
    set({
      isOpen: true,
      context: context ?? null,
      draft: context?.prefillQuestion ?? get().draft,
    })
  },

  closeChat: () => set({ isOpen: false }),

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

  setDraft: (value) => set({ draft: value }),

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

  setProcessing: (value) => set({ isProcessing: value }),

  clearConversation: () =>
    set({
      messages: [welcomeMessage()],
      context: null,
      draft: '',
      isProcessing: false,
    }),

  getSuggestedQuestions: () => [...suggestedChatQuestions],
}))
