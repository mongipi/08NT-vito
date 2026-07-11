'use client'

import { FormEvent, useState } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Ciao, sono l assistente 08. Posso aiutarti su prodotti, ingredienti, spedizioni, pagamenti e resi.',
    },
  ])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const nextMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = await response.json()
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: data?.message || 'Non riesco a rispondere adesso. Riprova tra poco.',
        },
      ])
    } catch {
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: 'Non riesco a collegarmi alla chat adesso. Riprova tra poco.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="v61-chat-widget">
      {open && (
        <section className="v61-chat-panel" aria-label="Live chat 08 Natural Technology">
          <div className="v61-chat-head">
            <div>
              <span>Live chat</span>
              <strong>08 Natural Technology</strong>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Chiudi chat">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="v61-chat-messages">
            {messages.map((message, index) => (
              <p key={index} className={`v61-chat-message ${message.role}`}>
                {message.content}
              </p>
            ))}
            {loading && <p className="v61-chat-message assistant">Sto controllando...</p>}
          </div>
          <form className="v61-chat-form" onSubmit={submit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Scrivi una domanda..."
              aria-label="Scrivi una domanda"
            />
            <button type="submit" disabled={loading || !input.trim()}>
              Invia
            </button>
          </form>
        </section>
      )}
      <button type="button" className="v61-chat-launcher" onClick={() => setOpen((value) => !value)} aria-label="Apri live chat">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.83 8.83 0 0 1-3.8-.86L3 21l1.86-5.54A8.83 8.83 0 0 1 4 11.5a8.5 8.5 0 0 1 17 0Z" />
          <path d="M8 11h8M8 14h5" />
        </svg>
        <span>Chat</span>
      </button>
    </div>
  )
}
