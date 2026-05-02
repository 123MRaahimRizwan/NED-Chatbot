import React, { useState } from 'react';
import { 
  PanelLeftClose, 
  PanelLeftOpen, 
  MessageSquarePlus, 
  Search, 
  MessageSquare, 
  Folder, 
  Layers, 
  Code2, 
  Settings, 
  Sparkles,
  MessageCircle,
  Trash2
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar, chats, activeChatId, onSelectChat, onNewChat, onDeleteChat }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fallback to empty array if chats is somehow undefined
  const safeChats = chats || [];
  
  const filteredChats = safeChats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className={`
        flex flex-col h-screen bg-[#171717] border-r border-[#2a2a2a] text-[#a3a3a3]
        transition-all duration-300 ease-in-out shrink-0
        ${isOpen ? 'w-[260px]' : 'w-[70px]'}
      `}
    >
      {/* Top Header / Toggle */}
      <div className="flex items-center justify-between p-4 h-14">
        {isOpen && (
          <span className="font-semibold text-[#e6e6e6] truncate select-none">
            NEDx Assistant
          </span>
        )}
        <button 
          onClick={toggleSidebar}
          className={`
            p-1.5 rounded-lg hover:bg-[#2a2a2a] transition-colors text-[#a3a3a3] hover:text-[#e6e6e6]
            ${!isOpen && 'mx-auto'}
          `}
          title={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-1 px-3 pb-4">
        
        {/* Search Modal/Inline */}
        {isSearchOpen && isOpen && (
          <div className="mb-2 px-2">
            <input 
              autoFocus
              type="text" 
              placeholder="Search chats..."
              className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-md px-3 py-1.5 text-sm text-[#e6e6e6] focus:outline-none focus:border-[#d97757] transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            />
          </div>
        )}

        {/* Primary Actions */}
        <div className="space-y-0.5">
          <SidebarItem 
            icon={MessageSquarePlus} 
            label="New Chat" 
            isOpen={isOpen} 
            onClick={onNewChat}
          />
          
          <button 
            onClick={() => isOpen && setIsSearchOpen(!isSearchOpen)}
            className={`
              w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-all duration-200
              hover:bg-[#2a2a2a] text-[#a3a3a3] hover:text-[#e6e6e6] group
              ${!isOpen && 'justify-center'}
            `}
            title={!isOpen ? "Search" : ""}
          >
            <Search size={18} className="shrink-0" />
            {isOpen && (
              <div className="flex items-center justify-between flex-1 truncate">
                <span>Search</span>
                <span className="text-xs border border-[#3a3a3a] bg-[#1f1f1f] rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ctrl+K
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Categories */}
        <div className="mt-4 space-y-0.5">
          <SidebarItem icon={MessageSquare} label="Chats" isOpen={isOpen} />
          <SidebarItem icon={Folder} label="Projects" isOpen={isOpen} />
          <SidebarItem icon={Layers} label="Artifacts" isOpen={isOpen} />
          <SidebarItem icon={Code2} label="Code" isOpen={isOpen} />
        </div>

        {/* Recent Chats */}
        <div className="mt-6 flex-1">
          {isOpen && (
            <div className="px-2 text-xs font-semibold text-[#666666] mb-2 uppercase tracking-wider">
              Recents
            </div>
          )}
          <div className="space-y-0.5">
            {filteredChats.map(chat => (
              <button 
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`
                  w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-all duration-200 group/chat
                  ${chat.id === activeChatId ? 'bg-[#2a2a2a] text-[#e6e6e6]' : 'hover:bg-[#2a2a2a] text-[#a3a3a3] hover:text-[#e6e6e6]'}
                  ${!isOpen && 'justify-center'}
                `}
                title={!isOpen ? chat.title : ""}
              >
                {!isOpen ? (
                  <MessageCircle size={18} className="shrink-0" />
                ) : (
                  <>
                    <span className="truncate text-left flex-1">{chat.title}</span>
                    <button 
                      onClick={(e) => onDeleteChat(e, chat.id)}
                      className="opacity-0 group-hover/chat:opacity-100 hover:text-red-400 p-1 rounded transition-all shrink-0"
                      title="Delete chat"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </button>
            ))}
            {filteredChats.length === 0 && isOpen && (
              <div className="px-2 py-2 text-sm text-[#666666]">No chats found</div>
            )}
          </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-[#2a2a2a] space-y-1">
        <SidebarItem icon={Sparkles} label="Upgrade" isOpen={isOpen} isUpgrade />
        <SidebarItem icon={Settings} label="Customize" isOpen={isOpen} />
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, isOpen, isUpgrade, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-all duration-200
        hover:bg-[#2a2a2a] text-[#a3a3a3] hover:text-[#e6e6e6] group
        ${!isOpen && 'justify-center'}
        ${isUpgrade && isOpen ? 'border border-[#2a2a2a] hover:border-[#d97757]/50' : ''}
      `}
      title={!isOpen ? label : ""}
    >
      <Icon size={18} className={`shrink-0 ${isUpgrade ? 'text-[#d97757]' : ''}`} />
      {isOpen && (
        <span className="truncate">{label}</span>
      )}
    </button>
  );
}
