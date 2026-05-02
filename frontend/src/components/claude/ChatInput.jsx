import React, { useState, useRef, useEffect } from 'react';
import { Plus, Mic, ChevronDown, ArrowUp } from 'lucide-react';

export default function ChatInput({ query, setQuery, onSend, loading }) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const quickActions = [
    { label: 'Code', icon: '💻' },
    { label: 'Learn', icon: '🧠' },
    { label: 'Strategize', icon: '🎯' },
    { label: 'Write', icon: '📝' },
    { label: 'Life stuff', icon: '🌱' },
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // Auto-focus logic can be added if needed, but keeping it simple for now.

  return (
    <div className="w-full max-w-[700px] mx-auto px-4">
      {/* Input Box */}
      <div 
        className={`
          relative flex items-center bg-[#1f1f1f] border rounded-2xl p-2 transition-all duration-200
          ${isFocused ? 'border-[#4a4a4a] shadow-[0_0_15px_rgba(217,119,87,0.1)]' : 'border-[#2a2a2a] shadow-sm'}
        `}
      >
        <button className="p-2 text-[#a3a3a3] hover:text-[#e6e6e6] hover:bg-[#2a2a2a] rounded-xl transition-colors shrink-0">
          <Plus size={20} />
        </button>
        
        <input 
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="How can I help you today?"
          disabled={loading}
          className="flex-1 bg-transparent border-none outline-none text-[#e6e6e6] placeholder:text-[#666666] px-3 text-base"
        />

        <div className="flex items-center gap-1 shrink-0">
          {query.trim() ? (
             <button 
                onClick={onSend}
                disabled={loading}
                className="p-1.5 bg-[#d97757] text-[#0f0f0f] hover:bg-[#e08c70] rounded-xl transition-colors disabled:opacity-50"
             >
                <ArrowUp size={20} />
             </button>
          ) : (
            <>
              <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#a3a3a3] hover:text-[#e6e6e6] hover:bg-[#2a2a2a] rounded-xl transition-colors">
                <span>Sonnet 4.6</span>
                <ChevronDown size={14} />
              </button>
              
              <button className="p-2 text-[#a3a3a3] hover:text-[#e6e6e6] hover:bg-[#2a2a2a] rounded-xl transition-colors">
                <Mic size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Actions - Only show if input is empty and we aren't loading, or conditionally based on your preference */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        {quickActions.map((action, index) => (
          <button 
            key={index}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2a2a] text-[#a3a3a3] text-sm hover:bg-[#1f1f1f] hover:text-[#e6e6e6] hover:border-[#3a3a3a] transition-all duration-200"
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
