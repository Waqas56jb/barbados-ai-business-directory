import { MessageCircle, Send, Sparkles, Trash2, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { siteConfig } from '@/config/site'
import { formatTimestamp } from '@/lib/formatters'
import { sendMessage } from '@/services/chatService'
import { useChatStore } from '@/store/chatStore'

export function ChatWidget() {
  const {
    isOpen,
    isProcessing,
    messages,
    draft,
    context,
    openChat,
    closeChat,
    setDraft,
    addMessage,
    setProcessing,
    clearConversation,
    getSuggestedQuestions,
  } = useChatStore()
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, isProcessing, isOpen])

  const handleSend = async (value?: string) => {
    const content = (value ?? draft).trim()
    if (!content || isProcessing) return

    const createdAt = new Date().toISOString()
    const idSuffix = crypto.randomUUID()

    addMessage({
      id: `user-${idSuffix}`,
      role: 'user',
      content,
      createdAt,
    })
    setDraft('')
    setProcessing(true)

    try {
      const response = await sendMessage({
        message: content,
        context: context ?? undefined,
      })
      addMessage({
        id: `assistant-${crypto.randomUUID()}`,
        role: 'assistant',
        content: response.message,
        createdAt: new Date().toISOString(),
        references: response.references,
      })
    } catch {
      addMessage({
        id: `error-${crypto.randomUUID()}`,
        role: 'assistant',
        content: 'I ran into a problem generating a demo answer. Please try again.',
        createdAt: new Date().toISOString(),
        isError: true,
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => openChat()}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-turquoise px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-turquoise-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise sm:bottom-8 sm:right-8"
        aria-label="Open Barbados AI Guide"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline">Ask AI</span>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end bg-ocean/30 p-0 sm:items-end sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={siteConfig.chatbotName}
        >
          <button type="button" className="absolute inset-0 sm:hidden" aria-label="Close chat overlay" onClick={closeChat} />
          <div className="relative flex h-[100dvh] w-full flex-col bg-ivory shadow-soft sm:h-[min(720px,calc(100vh-3rem))] sm:max-w-md sm:rounded-3xl">
            <div className="flex items-start justify-between gap-3 border-b border-ocean/10 px-5 py-4">
              <div>
                <p className="flex items-center gap-2 font-display text-xl text-ocean">
                  <Sparkles className="h-5 w-5 text-turquoise" />
                  {siteConfig.chatbotName}
                </p>
                <p className="mt-1 text-xs text-muted">Demo assistant grounded in local mock listings</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Clear conversation"
                  className="rounded-full p-2 hover:bg-sand"
                  onClick={clearConversation}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Close chat" className="rounded-full p-2 hover:bg-sand" onClick={closeChat}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      message.role === 'user'
                        ? 'bg-turquoise text-white'
                        : message.isError
                          ? 'border border-coral/40 bg-white text-ink'
                          : 'bg-white text-ink'
                    }`}
                  >
                    <p>{message.content}</p>
                    {message.references && message.references.length > 0 ? (
                      <ul className="mt-3 space-y-1 border-t border-ocean/10 pt-3">
                        {message.references.map((reference) => (
                          <li key={reference.id}>
                            <Link
                              to={`/business/${reference.slug}`}
                              onClick={closeChat}
                              className="font-medium text-turquoise hover:underline"
                            >
                              {reference.name}
                            </Link>
                            <span className="text-muted"> · {reference.parish}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <p className={`mt-2 text-[11px] ${message.role === 'user' ? 'text-white/80' : 'text-muted'}`}>
                      {formatTimestamp(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}

              {isProcessing ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-muted shadow-sm" role="status">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-turquoise" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-turquoise [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-turquoise [animation-delay:240ms]" />
                  </span>
                  Thinking…
                </div>
              ) : null}

              {messages.length <= 2 ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {getSuggestedQuestions().slice(0, 4).map((question) => (
                    <button
                      key={question}
                      type="button"
                      className="rounded-full border border-ocean/10 bg-white px-3 py-1.5 text-left text-xs text-ocean hover:border-turquoise"
                      onClick={() => void handleSend(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <form
              className="border-t border-ocean/10 p-4"
              onSubmit={(event) => {
                event.preventDefault()
                void handleSend()
              }}
            >
              <label htmlFor="chat-input" className="sr-only">
                Message the Barbados AI Guide
              </label>
              <div className="flex items-end gap-2">
                <textarea
                  id="chat-input"
                  rows={2}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      void handleSend()
                    }
                  }}
                  placeholder="Ask about listings, parishes, or services…"
                  className="max-h-32 flex-1 resize-none rounded-2xl border border-ocean/15 bg-white px-4 py-3 text-sm outline-none focus:border-turquoise"
                />
                <Button type="submit" disabled={isProcessing || !draft.trim()} aria-label="Send message">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
