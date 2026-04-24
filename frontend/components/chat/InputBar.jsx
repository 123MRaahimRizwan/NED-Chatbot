import React, { useEffect, useRef } from 'react'

const InputBar = ({ value, onChange, onSend, loading }) => {
  const textareaRef = useRef(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = '0px'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`
  }, [value])

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <div className="chat-input-wrap">
      <textarea
        ref={textareaRef}
        className="chat-textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message NEDx Assistant..."
        rows={1}
        disabled={loading}
        aria-label="Chat input"
      />
      <button
        type="button"
        className="send-button"
        onClick={onSend}
        disabled={loading || !value.trim()}
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  )
}

export default InputBar
