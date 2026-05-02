import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

const buildTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function ClaudeChat({ isAuthenticated }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Initialize from localStorage or with a default chat
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('claude_chats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse chats from localStorage", e);
      }
    }
    return [{ id: crypto.randomUUID(), title: 'New chat', messages: [] }];
  });

  const [activeChatId, setActiveChatId] = useState(() => chats[0]?.id);

  // Save to localStorage whenever chats change
  useEffect(() => {
    localStorage.setItem('claude_chats', JSON.stringify(chats));
  }, [chats]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) ?? chats[0],
    [chats, activeChatId]
  );

  const updateActiveChatMessages = (nextMessages) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== activeChatId) return chat;
        const nextTitle =
          chat.title === 'New chat' && nextMessages[0]?.role === 'user'
            ? nextMessages[0].content.slice(0, 36) + (nextMessages[0].content.length > 36 ? '...' : '')
            : chat.title;
        return { ...chat, title: nextTitle, messages: nextMessages };
      })
    );
  };

  const handleSend = async () => {
    if (!query.trim() || loading || !activeChat) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: query.trim(),
      timestamp: buildTimestamp(),
    };

    const nextMessages = [...activeChat.messages, userMessage];
    updateActiveChatMessages(nextMessages);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage.content }),
      });
      const data = await res.json();
      const assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.answer ?? 'No response received.',
        timestamp: buildTimestamp(),
      };
      updateActiveChatMessages([...nextMessages, assistantMessage]);
    } catch {
      const fallbackMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        timestamp: buildTimestamp(),
      };
      updateActiveChatMessages([...nextMessages, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    const nextChat = { id: crypto.randomUUID(), title: 'New chat', messages: [] };
    setChats((prev) => [nextChat, ...prev]);
    setActiveChatId(nextChat.id);
  };

  const handleDeleteChat = (e, idToDelete) => {
    e.stopPropagation(); // prevent triggering the chat selection
    setChats((prev) => {
      const updatedChats = prev.filter(c => c.id !== idToDelete);
      // If we just deleted the active chat, switch to the next available or create a new one
      if (idToDelete === activeChatId) {
        if (updatedChats.length > 0) {
          setActiveChatId(updatedChats[0].id);
        } else {
          const nextChat = { id: crypto.randomUUID(), title: 'New chat', messages: [] };
          setActiveChatId(nextChat.id);
          return [nextChat];
        }
      }
      return updatedChats;
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0f0f0f] text-[#e6e6e6] font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
      <ChatArea 
        activeChat={activeChat}
        query={query}
        setQuery={setQuery}
        onSend={handleSend}
        loading={loading}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
