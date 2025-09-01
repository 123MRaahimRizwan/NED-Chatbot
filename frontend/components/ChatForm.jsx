import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ChatBubble from './ChatBubble';
import ScrollButton from './ScrollButton';
import { Link } from 'react-router-dom';
import Login from './Login';

const ChatForm = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);


  const typeResponse = (text) => {
    let index = 0;
    let temp = '';
    setTyping(true);

    const interval = setInterval(() => {
      temp += text.charAt(index);
      index++;
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: 'bot', text: temp },
      ]);

      if (index >= text.length) {
        clearInterval(interval);
        setTyping(false);
      }
    }, 20);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setHasStarted(true);
    setMessages((prev) => [...prev, { sender: 'user', text: query }, { sender: 'bot', text: '' }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });

      const data = await res.json();
      typeResponse(data.answer);
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: 'bot', text: 'Something went wrong. Please try again.' },
      ]);
      setTyping(false);
    }

    setQuery('');
    setLoading(false);
  };

  const examplePrompts = [
    'Is attendance in labs mandatory at NED?',
    'How many credit hours are required to pass the first semester?',
    'When will the admissions for Fall 2025 start?',
  ];

  return (
  <div className="overflow-hidden min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 pb-12 relative">
    {/* Background blobs */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-72 sm:w-[500px] h-72 sm:h-[500px] bg-blue-500/5 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
      <div className="absolute w-72 sm:w-[500px] h-72 sm:h-[500px] bg-purple-500/5 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
    </div>

    {/* Admin login button */}
    <div className="relative z-50 mt-20 sm:mt-20 self-center sm:self-auto sm:left-[40%]">
      <Link
        to="/login"
        className="group relative bg-gray-800/50 rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden backdrop-blur-sm border border-gray-700/50 flex items-center gap-2 hover:-translate-y-0.5"
      >
        <div className="py-5 absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        <span className="relative text-gray-300 group-hover:text-white transition-colors font-medium text-sm sm:text-base">
          Admin Login
        </span>
      </Link>
    </div>

    {!hasStarted ? (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex flex-col items-center justify-center flex-grow text-center relative px-2 sm:px-0"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tight mb-6">
          What's on your mind today?
        </h1>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md sm:max-w-xl mb-6 relative group">
          <input
            type="text"
            name="input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything..."
            className="w-full p-3 sm:p-4 rounded-2xl bg-gray-800/50 text-white placeholder-gray-400 outline-none border border-gray-700/50 focus:ring-2 focus:ring-blue-500 shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
          />
        </form>

        <div className="text-gray-400 mb-4 text-sm sm:text-base">Try one of the following:</div>

        {/* Example prompts */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {examplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(prompt)}
              className="group relative bg-gray-800/50 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden backdrop-blur-sm border border-gray-700/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative text-gray-300 group-hover:text-white transition-colors text-sm sm:text-base">
                {prompt}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    ) : (
      <>
        {/* Chat container */}
        <div
          ref={chatContainerRef}
          className="w-full max-w-4xl flex flex-col rounded-2xl p-4 sm:p-6 h-[60vh] sm:h-[70vh] overflow-y-auto mb-6 space-y-3 relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} sender={msg.sender} text={msg.text} />
          ))}
          {typing && (
            <div className="flex items-center gap-3 text-gray-400 text-xs sm:text-sm ml-2">
              <div className="bg-gray-800/50 p-2 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-200"></div>
                </div>
              </div>
              <span className="text-gray-300">AI is typing...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <ScrollButton containerRef={chatContainerRef} bottomRef={bottomRef} />

        {/* Chat input */}
        <form onSubmit={handleSubmit} className="w-full max-w-4xl px-2 sm:px-0">
          <div className="relative flex items-center">
            <input
              type="text"
              name="input"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setTyping(false);
              }}
              placeholder="Ask anything..."
              className="w-full p-3 sm:p-4 pr-10 sm:pr-12 rounded-2xl bg-gray-800/50 text-white placeholder-gray-400 outline-none border border-gray-700/50 focus:ring-2 focus:ring-blue-500 shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="absolute right-2 sm:right-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
              </svg>
            </button>
          </div>
        </form>
      </>
    )}
  </div>
);

};

export default ChatForm;
