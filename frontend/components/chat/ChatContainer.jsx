import React from 'react'
import MessageBubble from './MessageBubble'

const ChatContainer = ({ messages, loading }) => {
  if (!messages.length) {
    return (
      <div className="chat-empty-state">
        <h1>Ask anything about NED University</h1>
        <p>Try admissions, departments, credits, scholarships, timetables, and policies.</p>
      </div>
    )
  }

  return (
    <div className="chat-message-list" aria-live="polite">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          role={message.role}
          content={message.content}
          timestamp={message.timestamp}
        />
      ))}
      {loading && (
        <div className="typing-indicator" role="status" aria-label="Assistant is typing">
          <span />
          <span />
          <span />
          <span>Thinking...</span>
        </div>
      )}
    </div>
  )
}

export default ChatContainer
