import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  type: 'text' | 'image' | 'video';
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatUser {
  id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  verified: boolean;
  subscription: 'free' | 'premium';
  isOnline: boolean;
  lastSeen?: Date;
  isTyping?: boolean;
}

interface ChatPreview {
  id: string;
  user: ChatUser;
  lastMessage: Message | null;
  unreadCount: number;
}

interface ChatSidebarProps {
  chatPreviews: ChatPreview[];
  activeChatId?: string;
  onDeleteChat?: (chatId: string) => void;
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export default function ChatSidebar({ chatPreviews, activeChatId }: ChatSidebarProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chatPreviews.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage?.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Сообщения</h1>
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Поиск в чатах..." 
            className="pl-10 bg-gray-50 border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat Previews */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                activeChatId === chat.id ? 'bg-love-light/20' : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-to-br from-love-light to-love-DEFAULT text-white">
                    {chat.user.name[0]}
                  </AvatarFallback>
                </Avatar>
                {chat.user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 truncate">{chat.user.name}</h3>
                    {chat.user.verified && (
                      <Icon name="Shield" size={14} className="text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatTime(chat.lastMessage.timestamp)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage?.text || 'Начните общение'}
                  </p>
                  {chat.unreadCount > 0 && (
                    <Badge className="bg-love-DEFAULT text-white text-xs min-w-[20px] h-5">
                      {chat.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}