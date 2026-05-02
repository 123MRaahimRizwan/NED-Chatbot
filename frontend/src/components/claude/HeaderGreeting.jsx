import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function HeaderGreeting() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('Good Morning');
      } else if (hour >= 12 && hour < 18) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    };

    updateGreeting();
    // Update the greeting every minute just in case the hour rolls over
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mb-8 mt-[10vh]">
      <div className="flex items-center gap-3 text-3xl font-medium text-[#e6e6e6]">
        <Sparkles className="text-[#d97757]" size={32} />
        <span>{greeting}, Raahim</span>
      </div>
    </div>
  );
}
