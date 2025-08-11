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
  }, [chatId, chatPreviews]);

  const generateChatPreviews = () => {
    // Здесь должна быть загрузка реальных чатов из API
    const previews: ChatPreview[] = [];
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
    } else {
      // Если чат не найден в previews, проверим не удален ли он
      const deletedChats = JSON.parse(localStorage.getItem('deletedChats') || '[]');
      if (deletedChats.includes(chatId)) {
        // Чат удален, перенаправляем на главную страницу чатов
        navigate('/chat');
        return;
      }
      
      // Иначе загружаем данные пользователя из образца
      const sampleUsers = [
        { id: '1', name: 'Анна', age: 25, bio: 'Люблю путешествия и кофе ☕️', interests: ['Путешествия', 'Кофе'], verified: true, isOnline: true },
        { id: '2', name: 'Максим', age: 28, bio: 'Спортсмен и любитель приключений', interests: ['Спорт', 'Приключения'], verified: false, isOnline: false, lastSeen: new Date(Date.now() - 1000 * 60 * 15) },
        { id: '3', name: 'София', age: 23, bio: 'Художница в душе', interests: ['Искусство'], verified: true, isOnline: true },
        { id: '4', name: 'Елена', age: 26, bio: 'Фотограф и любительница искусства', interests: ['Фотография'], verified: true, isOnline: false, lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2) },
        { id: '5', name: 'Дмитрий', age: 30, bio: 'Программист и музыкант', interests: ['Программирование', 'Музыка'], verified: false, isOnline: true }
      ];
      
      const userData = sampleUsers.find(u => u.id === chatId);
      if (userData) {
        setChatUser({
          ...userData,
          email: `${userData.name.toLowerCase()}@example.com`,
          photos: [],
          location: 'Москва',
          subscription: Math.random() > 0.7 ? 'premium' : 'free',
          lastActive: new Date(),
        } as ChatUser);
      }
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
    // Убрана симуляция ответов - только реальные сообщения от пользователей
    return;
  };



  const deleteChat = (chatIdToDelete: string) => {
    // Удаляем сообщения чата
    const savedChats = JSON.parse(localStorage.getItem('chats') || '{}');
    delete savedChats[chatIdToDelete];
    localStorage.setItem('chats', JSON.stringify(savedChats));
    
    // Добавляем чат в список удаленных
    const deletedChats = JSON.parse(localStorage.getItem('deletedChats') || '[]');
    if (!deletedChats.includes(chatIdToDelete)) {
      deletedChats.push(chatIdToDelete);
      localStorage.setItem('deletedChats', JSON.stringify(deletedChats));
    }
    
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

  // Дополнительная функция для очистки списка удаленных чатов (если понадобится)
  const clearDeletedChats = () => {
    localStorage.removeItem('deletedChats');
    generateChatPreviews();
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