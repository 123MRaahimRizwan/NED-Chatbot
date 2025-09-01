import React, { useEffect, useState } from 'react';
import { ArrowDownIcon } from 'lucide-react';

const ScrollButton = ({ containerRef, bottomRef }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const handleScroll = () => {
      const atBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      setShow(!atBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  const scrollToBottom = () => {
    bottomRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToBottom}
      className="fixed bottom-20 right-6 md:right-12 z-50 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition duration-200"
    >
      <ArrowDownIcon size={20} />
    </button>
  );
};

export default ScrollButton;
