import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, User } from '@/contexts/AuthContext';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import EmptyChat from '@/components/chat/EmptyChat';

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const [chatPreviews, setChatPreviews] = useState<ChatPreview[]>([]);

  // Generate chat previews
  useEffect(() => {
    generateChatPreviews();
  }, []);

  useEffect(() => {
    if (chatId) {
      loadChat(chatId);
      loadChatUser(chatId);
    }
  }, [chatId]);

  const generateChatPreviews = () => {
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



  const deleteChat = (chatIdToDelete: string) => {
    // Удаляем сообщения чата
    const savedChats = JSON.parse(localStorage.getItem('chats') || '{}');
    delete savedChats[chatIdToDelete];
    localStorage.setItem('chats', JSON.stringify(savedChats));
    
    // Обновляем список чатов
    const updatedPreviews = chatPreviews.filter(preview => preview.id !== chatIdToDelete);
    setChatPreviews(updatedPreviews);
    
    // Если удаляем активный чат, перенаправляем на список
    if (chatIdToDelete === chatId) {
      navigate('/chat');
    }
  };

  const handleDeleteCurrentChat = () => {
    if (chatId) {
      deleteChat(chatId);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ChatSidebar 
        chatPreviews={chatPreviews} 
        activeChatId={chatId} 
        onDeleteChat={deleteChat}
      />

      <div className="flex-1 flex flex-col">
        {chatId && chatUser ? (
          <>
            <ChatHeader 
              chatUser={chatUser} 
              onDeleteChat={handleDeleteCurrentChat}
            />
            <MessageList 
              messages={messages}
              currentUserId={user?.id}
              chatUserName={chatUser.name}
              isTyping={isTyping}
            />
            <MessageInput 
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSendMessage={sendMessage}
            />
          </>
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
}