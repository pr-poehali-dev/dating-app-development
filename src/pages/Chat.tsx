import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  isOnline: boolean;
  lastSeen?: Date;
  avatar?: string;
  age?: number;
  verified?: boolean;
}

const Chat = () => {
  const { id: chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      loadChat(chatId);
      loadChatUser(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChat = (chatId: string) => {
    const savedChats = JSON.parse(localStorage.getItem('chats') || '{}');
    const chatMessages = savedChats[chatId] || [];
    setMessages(chatMessages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    })));
  };

  const loadChatUser = (chatId: string) => {
    const users = [
      { id: '1', name: 'Анна', age: 25, isOnline: true, verified: true },
      { id: '2', name: 'Максим', age: 28, isOnline: false, verified: false, lastSeen: new Date(Date.now() - 1000 * 60 * 15) },
      { id: '3', name: 'София', age: 23, isOnline: true, verified: true },
      { id: '4', name: 'Елена', age: 26, isOnline: false, verified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2) },
      { id: '5', name: 'Дмитрий', age: 30, isOnline: true, verified: false }
    ];
    
    const foundUser = users.find(u => u.id === chatId);
    setChatUser(foundUser || { id: chatId, name: `Пользователь ${chatId}`, isOnline: false });
  };

  const saveChat = (chatId: string, messages: Message[]) => {
    const savedChats = JSON.parse(localStorage.getItem('chats') || '{}');
    savedChats[chatId] = messages;
    localStorage.setItem('chats', JSON.stringify(savedChats));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !chatId || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      text: newMessage.trim(),
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    saveChat(chatId, updatedMessages);
    setNewMessage('');

    simulateResponse(chatId, updatedMessages);
  };

  const simulateResponse = (chatId: string, currentMessages: Message[]) => {
    if (!chatUser) return;

    setIsTyping(true);
    
    setTimeout(() => {
      const responses = [
        'Привет! Как дела? 😊',
        'Очень приятно познакомиться!',
        'Какие у тебя планы на выходные?',
        'Мне тоже нравится путешествовать ✈️',
        'Может встретимся на кофе? ☕️',
        'Какая интересная мысль!',
        'Хочешь созвониться? 📞',
        'А что ещё любишь делать в свободное время?',
        'Звучит здорово! Расскажи подробнее 🤔',
        'Я тоже об этом думал(а)!',
        'Отличная идея! 👍',
        'Мне нравится твой подход к жизни'
      ];

      const response: Message = {
        id: Date.now().toString(),
        senderId: chatUser.id,
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'text',
        status: 'delivered'
      };

      const newMessages = [...currentMessages, response];
      setMessages(newMessages);
      saveChat(chatId, newMessages);
      setIsTyping(false);
    }, 800 + Math.random() * 2000);
  };

  const startVideoCall = () => {
    setShowVideoCall(true);
  };

  const endVideoCall = () => {
    setShowVideoCall(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const getLastSeen = () => {
    if (!chatUser) return '';
    if (chatUser.isOnline) return 'в сети';
    if (chatUser.lastSeen) {
      const diff = Date.now() - chatUser.lastSeen.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      if (minutes < 60) return `был(а) ${minutes} мин. назад`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `был(а) ${hours} ч. назад`;
      const days = Math.floor(hours / 24);
      return `был(а) ${days} дн. назад`;
    }
    return 'был(а) недавно';
  };

  if (!chatId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-love-light to-love-dark flex items-center justify-center p-4 pb-24">
        <div className="text-center text-white max-w-sm mx-auto">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="MessageCircle" size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Выберите чат</h2>
          <p className="text-white/80 mb-8 leading-relaxed">
            Выберите пользователя из списка совпадений, чтобы начать общение
          </p>
          <Button 
            onClick={() => navigate('/matches')}
            className="bg-white text-love-DEFAULT hover:bg-white/90 font-medium px-8"
          >
            К совпадениям
          </Button>
        </div>
      </div>
    );
  }

  if (showVideoCall) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Video Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
          
          {/* User Video */}
          <div className="absolute inset-4 bg-gray-800 rounded-2xl flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-40 h-40 bg-gradient-to-br from-love-light to-love-DEFAULT rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Icon name="User" size={80} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{chatUser?.name}</h3>
              <p className="text-gray-400 text-lg mb-6">Видеозвонок...</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-medium">00:42</span>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
            <Button
              size="lg"
              variant="outline"
              className="w-14 h-14 rounded-full border-gray-600 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm"
            >
              <Icon name="Mic" size={24} className="text-white" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-14 h-14 rounded-full border-gray-600 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm"
            >
              <Icon name="Video" size={24} className="text-white" />
            </Button>
            <Button
              size="lg"
              onClick={endVideoCall}
              className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
            >
              <Icon name="PhoneOff" size={24} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-14 h-14 rounded-full border-gray-600 bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm"
            >
              <Icon name="RotateCcw" size={24} className="text-white" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-light to-love-dark flex flex-col">
      {/* Chat Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4 pt-12">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/matches')}
              className="text-white hover:bg-white/10 p-2"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Icon name="User" size={24} className="text-white" />
              </div>
              {chatUser?.isOnline && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-semibold text-white text-lg">{chatUser?.name}</h2>
                {chatUser?.verified && (
                  <Icon name="Shield" size={16} className="text-blue-300" />
                )}
              </div>
              <p className="text-sm text-white/70">{getLastSeen()}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 p-2"
            >
              <Icon name="Phone" size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={startVideoCall}
              className="text-white hover:bg-white/10 p-2"
            >
              <Icon name="Video" size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 p-2"
            >
              <Icon name="MoreVertical" size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col max-w-md mx-auto">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-white/80 mt-20">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="MessageCircle" size={32} className="text-white/60" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Начните общение</h3>
                <p className="text-sm text-white/60">Напишите первое сообщение!</p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isOwn = message.senderId === user?.id;
                const prevMessage = messages[index - 1];
                const showDate = index === 0 || 
                  new Date(message.timestamp).toDateString() !== new Date(prevMessage?.timestamp).toDateString();

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="text-center my-4">
                        <span className="text-xs text-white/60 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                    )}
                    
                    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs px-4 py-3 rounded-3xl shadow-sm ${
                          isOwn
                            ? 'bg-love-DEFAULT text-white'
                            : 'bg-white/95 backdrop-blur-sm text-gray-900'
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
              })
            )}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-3xl">
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
          
          {/* Message Input */}
          <div className="p-4 pb-28 bg-white/5 backdrop-blur-sm">
            <div className="flex items-end gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 p-2 flex-shrink-0"
              >
                <Icon name="Plus" size={20} />
              </Button>
              
              <div className="flex-1 flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Сообщение..."
                  className="flex-1 bg-white/95 backdrop-blur-sm border-0 rounded-full px-4 py-3 text-gray-900 placeholder-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage();
                    }
                  }}
                />
                
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-love-DEFAULT hover:bg-love-dark text-white p-3 rounded-full flex-shrink-0 disabled:opacity-50"
                >
                  <Icon name="Send" size={18} />
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 p-2 flex-shrink-0"
              >
                <Icon name="Smile" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;