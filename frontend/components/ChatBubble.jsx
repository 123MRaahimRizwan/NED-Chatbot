import React from 'react';
import ReactMarkdown from 'react-markdown';

const ChatBubble = ({ sender, text }) => {
  const isUser = sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full py-2 animate-fadeIn`}>
      <div
        className={`
          group relative px-5 py-3.5 text-md rounded-2xl whitespace-pre-wrap max-w-[80%] shadow-lg hover:shadow-xl transition-all duration-300
          ${isUser ?
            'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-br-sm transform hover:scale-[1.01] transition-transform duration-200' :
            'bg-gray-800/50 text-white rounded-bl-sm border border-gray-700/50 backdrop-blur-sm'
          }
        `}
      >
        {!isUser && (
          <div className="absolute -left-2 top-4 w-4 h-4 bg-gray-800/50 border-l border-t border-gray-700/50 transform rotate-45"></div>
        )}
        {!isUser && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        )}
        {isUser && (
          <div className="absolute -right-2 top-4 w-4 h-4 bg-blue-600 transform rotate-45"></div>
        )}

        <div className="relative">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2">{children}</p>,
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-1">{children}</ol>
              ),
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              pre: ({ children }) => (
                <div className="whitespace-pre-wrap break-words">{children}</div>
              ),
              code: ({ children }) => (
                <span className="bg-black/30 px-2 py-1 rounded-md text-sm font-mono text-white/90 border border-white/10">
                  {children}
                </span>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors duration-200"
                >
                  {children}
                </a>
              ),
            }}
          >
            {text.trimStart()}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
