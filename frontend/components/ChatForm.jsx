import React, { useEffect, useMemo, useRef, useState } from 'react'
import ChatContainer from './chat/ChatContainer'
import InputBar from './chat/InputBar'
import Sidebar from './chat/Sidebar'

const initialChat = { id: crypto.randomUUID(), title: 'New chat', messages: [] }

const buildTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const ChatForm = () => {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [chats, setChats] = useState([initialChat])
  const [activeChatId, setActiveChatId] = useState(initialChat.id)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const scrollRef = useRef(null)

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) ?? chats[0],
    [chats, activeChatId],
  )

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    container.scrollTop = container.scrollHeight
  }, [activeChat?.messages, loading])

  const updateActiveChatMessages = (nextMessages) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== activeChatId) return chat
        const nextTitle =
          chat.title === 'New chat' && nextMessages[0]?.role === 'user'
            ? nextMessages[0].content.slice(0, 36)
            : chat.title
        return { ...chat, title: nextTitle, messages: nextMessages }
      }),
    )
  }

  const handleSend = async () => {
    if (!query.trim() || loading || !activeChat) return

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: query.trim(),
      timestamp: buildTimestamp(),
    }

    const nextMessages = [...activeChat.messages, userMessage]
    updateActiveChatMessages(nextMessages)
    setQuery('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage.content }),
      })
      const data = await res.json()
      const assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.answer ?? 'No response received.',
        timestamp: buildTimestamp(),
      }
      updateActiveChatMessages([...nextMessages, assistantMessage])
    } catch {
      const fallbackMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        timestamp: buildTimestamp(),
      }
      updateActiveChatMessages([...nextMessages, fallbackMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    const nextChat = { id: crypto.randomUUID(), title: 'New chat', messages: [] }
    setChats((prev) => [nextChat, ...prev])
    setActiveChatId(nextChat.id)
    setSidebarOpen(false)
  }

  return (
    <main className="chat-page">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => {
          setActiveChatId(id)
          setSidebarOpen(false)
        }}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />
      <section className="chat-container">
        <div className="chat-scroll-area" ref={scrollRef}>
          <ChatContainer messages={activeChat?.messages ?? []} loading={loading} />
        </div>
        <InputBar value={query} onChange={setQuery} onSend={handleSend} loading={loading} />
      </section>
    </main>
  )
}

export default ChatForm
