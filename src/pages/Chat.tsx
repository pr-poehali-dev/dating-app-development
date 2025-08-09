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
}

interface ChatUser {
  id: string;
  name: string;
  isOnline: boolean;
  lastSeen?: Date;
  avatar?: string;
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
      { id: '1', name: 'Анна', isOnline: true },
      { id: '2', name: 'Максим', isOnline: false, lastSeen: new Date(Date.now() - 1000 * 60 * 15) },
      { id: '3', name: 'София', isOnline: true },
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
      type: 'text'
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
        'Хочешь созвониться? 📞'
      ];

      const response: Message = {
        id: Date.now().toString(),
        senderId: chatUser.id,
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'text'
      };

      const newMessages = [...currentMessages, response];
      setMessages(newMessages);
      saveChat(chatId, newMessages);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
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

  const getLastSeen = () => {
    if (!chatUser) return '';
    if (chatUser.isOnline) return 'в сети';
    if (chatUser.lastSeen) {
      const diff = Date.now() - chatUser.lastSeen.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      if (minutes < 60) return `был ${minutes} мин. назад`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `был ${hours} ч. назад`;
      const days = Math.floor(hours / 24);
      return `был ${days} дн. назад`;
    }
    return 'был недавно';
  };

  if (!chatId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-love-light to-love-dark flex items-center justify-center p-4 pb-24">
        <div className="text-center text-white max-w-md">
          <Icon name="MessageCircle" size={64} className="mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">Выберите чат</h2>
          <p className="opacity-80 mb-6">Выберите пользователя из списка совпадений, чтобы начать общение</p>
          <Button 
            onClick={() => navigate('/matches')}
            className="bg-white text-love-DEFAULT hover:bg-white/90"
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
          <div className="absolute inset-4 bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-love-DEFAULT rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="User" size={64} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{chatUser?.name}</h3>
              <p className="text-gray-400 mb-8">Видеозвонок...</p>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
            <Button
              size="lg"
              variant="outline"
              className="w-14 h-14 rounded-full border-gray-600 bg-gray-800 hover:bg-gray-700"
            >
              <Icon name="Mic" size={24} className="text-white" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-14 h-14 rounded-full border-gray-600 bg-gray-800 hover:bg-gray-700"
            >
              <Icon name="Video" size={24} className="text-white" />
            </Button>
            <Button
              size="lg"
              onClick={endVideoCall}
              className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white"
            >
              <Icon name="PhoneOff" size={24} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-light to-love-dark flex flex-col">
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/matches')}
              className="text-white hover:bg-white/10"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="User" size={20} className="text-white" />
              </div>
              {chatUser?.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            
            <div>
              <h2 className="font-semibold text-white">{chatUser?.name}</h2>
              <p className="text-xs text-white/70">{getLastSeen()}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={startVideoCall}
              className="text-white hover:bg-white/10"
            >
              <Icon name="Video" size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Icon name="Phone" size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col max-w-md mx-auto">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-white/70 mt-16">
                <Icon name="MessageCircle" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Напишите первое сообщение!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.senderId === user?.id
                        ? 'bg-love-DEFAULT text-white'
                        : 'bg-white/90 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === user?.id ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/90 px-4 py-2 rounded-2xl">
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
          
          <div className="p-4 pb-24 bg-white/5 backdrop-blur-sm">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Напишите сообщение..."
                className="flex-1 bg-white/90 border-0"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-love-DEFAULT hover:bg-love-dark text-white"
              >
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;