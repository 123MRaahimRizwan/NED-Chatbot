import React from 'react'

const Sidebar = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  isOpen,
  onToggle,
}) => {
  return (
    <>
      <button
        type="button"
        className="sidebar-toggle"
        onClick={onToggle}
        aria-label="Toggle chat history"
      >
        History
      </button>
      <aside className={`chat-sidebar ${isOpen ? 'chat-sidebar-open' : ''}`}>
        <div className="chat-sidebar-header">
          <h2>Conversations</h2>
          <button type="button" className="new-chat-btn" onClick={onNewChat}>
            New Chat
          </button>
        </div>
        <div className="chat-sidebar-list">
          {chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              className={`chat-history-item ${chat.id === activeChatId ? 'active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <span>{chat.title}</span>
            </button>
          ))}
        </div>
      </aside>
      {isOpen && <button type="button" className="sidebar-overlay" onClick={onToggle} aria-label="Close sidebar" />}
    </>
  )
}

export default Sidebar
