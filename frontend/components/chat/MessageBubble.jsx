import React from 'react'
import ReactMarkdown from 'react-markdown'

const MessageBubble = ({ role, content, timestamp }) => {
  const isUser = role === 'user'

  return (
    <article className={`message-row ${isUser ? 'message-row-user' : 'message-row-assistant'}`}>
      <div className={`message-bubble ${isUser ? 'message-user' : 'message-assistant'}`}>
        <ReactMarkdown
          components={{
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
        <time className="message-time">{timestamp}</time>
      </div>
    </article>
  )
}

export default MessageBubble
