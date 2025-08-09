import { useRef, useEffect } from 'react';
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

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  chatUserName: string;
  isTyping: boolean;
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export default function MessageList({ messages, currentUserId, chatUserName, isTyping }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return (
      <ScrollArea className="flex-1 p-6">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="MessageCircle" size={32} className="text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">Начните общение</h3>
          <p className="text-gray-600">Напишите первое сообщение {chatUserName}</p>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1 p-6">
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((message, index) => {
          const isOwn = message.senderId === currentUserId;
          const showTime = index === 0 || 
            messages[index - 1].timestamp.getTime() - message.timestamp.getTime() > 5 * 60 * 1000;

          return (
            <div key={message.id}>
              {showTime && (
                <div className="text-center my-4">
                  <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                    {message.timestamp.toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
              
              <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
                <div
                  className={`max-w-lg px-4 py-3 rounded-2xl ${
                    isOwn
                      ? 'bg-love-DEFAULT text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${
                      isOwn ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </span>
                    {isOwn && message.status && (
                      <Icon 
                        name={message.status === 'read' ? 'CheckCheck' : 'Check'} 
                        size={14} 
                        className={message.status === 'read' ? 'text-blue-300' : 'text-white/70'} 
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 px-4 py-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200" />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}