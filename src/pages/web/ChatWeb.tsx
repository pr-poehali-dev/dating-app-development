import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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

interface ChatUser extends User {
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

export default function ChatWeb() {
  const { id: chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [chatPreviews, setChatPreviews] = useState<ChatPreview[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Генерируем список чатов
  useEffect(() => {
    generateChatPreviews();
  }, []);

  useEffect(() => {
    if (chatId) {
      loadChat(chatId);
      loadChatUser(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateChatPreviews = () => {
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    const sampleUsers = [
      { id: '1', name: 'Анна', age: 25, bio: 'Люблю путешествия и кофе ☕️', interests: ['Путешествия', 'Кофе'], verified: true, isOnline: true },
      { id: '2', name: 'Максим', age: 28, bio: 'Спортсмен и любитель приключений', interests: ['Спорт', 'Приключения'], verified: false, isOnline: false, lastSeen: new Date(Date.now() - 1000 * 60 * 15) },
      { id: '3', name: 'София', age: 23, bio: 'Художница в душе', interests: ['Искусство'], verified: true, isOnline: true },
      { id: '4', name: 'Елена', age: 26, bio: 'Фотограф и любительница искусства', interests: ['Фотография'], verified: true, isOnline: false, lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2) },
      { id: '5', name: 'Дмитрий', age: 30, bio: 'Программист и музыкант', interests: ['Программирование', 'Музыка'], verified: false, isOnline: true }
    ];

    const previews = sampleUsers.map(userData => {
      const savedChats = JSON.parse(localStorage.getItem('chats') || '{}');
      const chatMessages = savedChats[userData.id] || [];
      const lastMessage = chatMessages.length > 0 ? {
        ...chatMessages[chatMessages.length - 1],
        timestamp: new Date(chatMessages[chatMessages.length - 1].timestamp)
      } : null;

      return {
        id: userData.id,
        user: {
          ...userData,
          email: `${userData.name.toLowerCase()}@example.com`,
          photos: [],
          location: 'Москва',
          subscription: Math.random() > 0.7 ? 'premium' : 'free',
          lastActive: new Date(),
        } as ChatUser,
        lastMessage,
        unreadCount: Math.floor(Math.random() * 4)
      };
    });

    setChatPreviews(previews);
  };

  const loadChat = (chatId: string) => {
    const savedChats = JSON.parse(localStorage.getItem('chats') || '{}');
    const chatMessages = savedChats[chatId] || [];
    setMessages(chatMessages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    })));
  };

  const loadChatUser = (chatId: string) => {
    const preview = chatPreviews.find(p => p.id === chatId);
    if (preview) {
      setChatUser(preview.user);
    }
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
        'Я тоже об этом думал(а)!'
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
    }, 1000 + Math.random() * 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatLastSeen = (date?: Date, isOnline?: boolean) => {
    if (isOnline) return 'в сети';
    if (!date) return 'был(а) недавно';
    
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `был(а) ${minutes} мин. назад`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `был(а) ${hours} ч. назад`;
    const days = Math.floor(hours / 24);
    return `был(а) ${days} дн. назад`;
  };

  const startVideoCall = () => {
    setShowVideoCall(true);
  };

  const endVideoCall = () => {
    setShowVideoCall(false);
  };

  if (showVideoCall) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Video Call UI */}
          <div className="absolute inset-4 bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-48 h-48 bg-gradient-to-br from-love-light to-love-DEFAULT rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="User" size={96} className="text-white" />
              </div>
              <h3 className="text-4xl font-bold mb-4">{chatUser?.name}</h3>
              <p className="text-gray-400 text-xl mb-12">Видеозвонок...</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400">00:45</span>
              </div>
            </div>
          </div>
          
          {/* Call Controls */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-6">
            <Button
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full border-gray-600 bg-gray-800 hover:bg-gray-700"
            >
              <Icon name="Mic" size={28} className="text-white" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full border-gray-600 bg-gray-800 hover:bg-gray-700"
            >
              <Icon name="Video" size={28} className="text-white" />
            </Button>
            <Button
              size="lg"
              onClick={endVideoCall}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white"
            >
              <Icon name="PhoneOff" size={28} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full border-gray-600 bg-gray-800 hover:bg-gray-700"
            >
              <Icon name="Settings" size={28} className="text-white" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Chat List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Сообщения</h1>
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Поиск в чатах..." 
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Chat Previews */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {chatPreviews.map((chat) => (
              <div
                key={chat.id}
                onClick={() => navigate(`/chat/${chat.id}`)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  chatId === chat.id ? 'bg-love-light/20' : 'hover:bg-gray-50'
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

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {chatId && chatUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-love-light to-love-DEFAULT text-white">
                        {chatUser.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    {chatUser.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-semibold text-gray-900">{chatUser.name}</h2>
                      {chatUser.verified && (
                        <Icon name="Shield" size={16} className="text-blue-500" />
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {chatUser.age} лет
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatLastSeen(chatUser.lastSeen, chatUser.isOnline)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Icon name="Phone" size={18} className="mr-2" />
                    Позвонить
                  </Button>
                  <Button variant="outline" size="sm" onClick={startVideoCall}>
                    <Icon name="Video" size={18} className="mr-2" />
                    Видео
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icon name="MoreVertical" size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="MessageCircle" size={32} className="text-gray-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Начните общение</h3>
                    <p className="text-gray-600">Напишите первое сообщение {chatUser.name}</p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isOwn = message.senderId === user?.id;
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
                  })
                )}
                
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

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-3 max-w-4xl mx-auto">
                <Button variant="outline" size="sm">
                  <Icon name="Paperclip" size={18} />
                </Button>
                <div className="flex-1 flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Напишите сообщение..."
                    className="flex-1"
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
                    <Icon name="Send" size={18} />
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <Icon name="Smile" size={18} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="MessageCircle" size={40} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Выберите чат</h2>
              <p className="text-gray-600 mb-6">Выберите пользователя из списка, чтобы начать общение</p>
              <Button 
                onClick={() => navigate('/matches')}
                className="bg-love-DEFAULT hover:bg-love-dark"
              >
                К совпадениям
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}