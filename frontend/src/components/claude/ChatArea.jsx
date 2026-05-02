import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Sparkles, User } from 'lucide-react';
import HeaderGreeting from './HeaderGreeting';
import ChatInput from './ChatInput';

export default function ChatArea({ activeChat, query, setQuery, onSend, loading, isAuthenticated }) {
  const scrollRef = useRef(null);
  
  const hasMessages = activeChat && activeChat.messages && activeChat.messages.length > 0;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat?.messages, loading]);

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0f0f0f] relative overflow-hidden">
      
      {/* Top Right Action Button */}
      <div className="absolute top-4 right-4 z-10">
        <Link 
          to={isAuthenticated ? "/admin" : "/login"}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#2a2a2a] text-[#a3a3a3] hover:text-[#e6e6e6] hover:bg-[#1f1f1f] hover:border-[#3a3a3a] transition-all duration-200"
        >
          {isAuthenticated ? "Admin" : "Login"}
        </Link>
      </div>

      {/* Scrollable messages area or centered greeting */}
      <div 
        className={`flex-1 flex flex-col w-full overflow-y-auto pt-8 ${!hasMessages ? 'items-center justify-center' : ''}`}
        ref={scrollRef}
      >
        {!hasMessages ? (
          <div className="w-full pb-[15vh]">
            <HeaderGreeting />
            <ChatInput query={query} setQuery={setQuery} onSend={onSend} loading={loading} />
          </div>
        ) : (
          <div className="w-full max-w-[800px] mx-auto px-4 pb-[150px] flex flex-col gap-6">
            {activeChat.messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Assistant Avatar */}
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-[#d97757]/20 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="text-[#d97757]" size={18} />
                  </div>
                )}
                
                {/* Message Content */}
                <div 
                  className={`
                    max-w-[85%] rounded-2xl px-5 py-3 
                    ${msg.role === 'user' 
                      ? 'bg-[#1f1f1f] text-[#e6e6e6]' 
                      : 'bg-transparent text-[#e6e6e6] max-w-none [&>p]:mb-4 [&>p:last-child]:mb-0 [&>pre]:bg-[#1f1f1f] [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:ml-4 [&>ol]:mb-4 [&_code]:bg-[#2a2a2a] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded'
                    }
                  `}
                >
                  {msg.role === 'user' ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  )}
                </div>

                {/* User Avatar (Optional, hidden to match Claude's minimal look, but can be added if desired) */}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-lg bg-[#d97757]/20 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="text-[#d97757]" size={18} />
                </div>
                <div className="bg-transparent text-[#a3a3a3] px-5 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#a3a3a3] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#a3a3a3] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#a3a3a3] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Fixed bottom input when messages exist */}
      {hasMessages && (
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f] to-transparent pt-10 pb-6">
          <ChatInput query={query} setQuery={setQuery} onSend={onSend} loading={loading} />
        </div>
      )}

      {/* Footer Text */}
      <div className={`
        w-full text-center text-xs text-[#666666] transition-all duration-300
        ${hasMessages ? 'absolute bottom-2 left-0' : 'absolute bottom-4 left-0'}
      `}>
        NEDx Assistant can make mistakes. Please verify important information.
      </div>
    </div>
  );
}
