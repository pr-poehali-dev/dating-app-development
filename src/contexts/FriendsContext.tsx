import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FriendRequest, User } from './AuthContext';
import { useAuth } from './AuthContext';

interface FriendsContextType {
  friendRequests: FriendRequest[];
  friends: User[];
  sendFriendRequest: (userId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  removeFriend: (userId: string) => void;
  getFriendshipStatus: (userId: string) => 'none' | 'sent' | 'received' | 'friends';
  getUnreadNotificationsCount: () => number;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (context === undefined) {
    throw new Error('useFriends must be used within a FriendsProvider');
  }
  return context;
};

export const FriendsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    if (user) {
      loadFriendRequests();
      loadFriends();
    }
  }, [user]);

  const loadFriendRequests = () => {
    if (!user) return;
    
    const requests = JSON.parse(localStorage.getItem('friendRequests') || '[]');
    const userRequests = requests.filter((req: FriendRequest) => 
      req.to === user.id && req.status === 'pending'
    );
    setFriendRequests(userRequests);
  };

  const loadFriends = () => {
    if (!user) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const friendIds = user.friends || [];
    const friendsData = users.filter((u: User) => friendIds.includes(u.id));
    setFriends(friendsData);
  };

  const sendFriendRequest = (userId: string) => {
    if (!user || userId === user.id) return;

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newRequest: FriendRequest = {
      id: requestId,
      from: user.id,
      to: userId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Сохраняем заявку
    const requests = JSON.parse(localStorage.getItem('friendRequests') || '[]');
    requests.push(newRequest);
    localStorage.setItem('friendRequests', JSON.stringify(requests));

    // Обновляем пользователей
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    const targetIndex = users.findIndex((u: User) => u.id === userId);

    if (userIndex !== -1) {
      if (!users[userIndex].friendRequests) {
        users[userIndex].friendRequests = { sent: [], received: [] };
      }
      users[userIndex].friendRequests.sent.push(requestId);
    }

    if (targetIndex !== -1) {
      if (!users[targetIndex].friendRequests) {
        users[targetIndex].friendRequests = { sent: [], received: [] };
      }
      users[targetIndex].friendRequests.received.push(requestId);
    }

    localStorage.setItem('users', JSON.stringify(users));
    loadFriendRequests();
  };

  const acceptFriendRequest = (requestId: string) => {
    if (!user) return;

    // Находим заявку
    const requests = JSON.parse(localStorage.getItem('friendRequests') || '[]');
    const requestIndex = requests.findIndex((req: FriendRequest) => req.id === requestId);
    
    if (requestIndex === -1) return;
    
    const request = requests[requestIndex];
    requests[requestIndex].status = 'accepted';
    localStorage.setItem('friendRequests', JSON.stringify(requests));

    // Добавляем в друзья
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user1Index = users.findIndex((u: User) => u.id === request.from);
    const user2Index = users.findIndex((u: User) => u.id === request.to);

    if (user1Index !== -1) {
      if (!users[user1Index].friends) users[user1Index].friends = [];
      if (!users[user1Index].friends.includes(request.to)) {
        users[user1Index].friends.push(request.to);
      }
    }

    if (user2Index !== -1) {
      if (!users[user2Index].friends) users[user2Index].friends = [];
      if (!users[user2Index].friends.includes(request.from)) {
        users[user2Index].friends.push(request.from);
      }
    }

    localStorage.setItem('users', JSON.stringify(users));
    loadFriendRequests();
    loadFriends();
  };

  const rejectFriendRequest = (requestId: string) => {
    if (!user) return;

    const requests = JSON.parse(localStorage.getItem('friendRequests') || '[]');
    const requestIndex = requests.findIndex((req: FriendRequest) => req.id === requestId);
    
    if (requestIndex !== -1) {
      requests[requestIndex].status = 'rejected';
      localStorage.setItem('friendRequests', JSON.stringify(requests));
      loadFriendRequests();
    }
  };

  const removeFriend = (userId: string) => {
    if (!user) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    const friendIndex = users.findIndex((u: User) => u.id === userId);

    if (userIndex !== -1 && users[userIndex].friends) {
      users[userIndex].friends = users[userIndex].friends.filter((id: string) => id !== userId);
    }

    if (friendIndex !== -1 && users[friendIndex].friends) {
      users[friendIndex].friends = users[friendIndex].friends.filter((id: string) => id !== user.id);
    }

    localStorage.setItem('users', JSON.stringify(users));
    loadFriends();
  };

  const getFriendshipStatus = (userId: string): 'none' | 'sent' | 'received' | 'friends' => {
    if (!user) return 'none';

    // Проверяем, уже ли друзья
    if (user.friends?.includes(userId)) return 'friends';

    // Проверяем заявки
    const requests = JSON.parse(localStorage.getItem('friendRequests') || '[]');
    
    const sentRequest = requests.find((req: FriendRequest) => 
      req.from === user.id && req.to === userId && req.status === 'pending'
    );
    if (sentRequest) return 'sent';

    const receivedRequest = requests.find((req: FriendRequest) => 
      req.from === userId && req.to === user.id && req.status === 'pending'
    );
    if (receivedRequest) return 'received';

    return 'none';
  };

  const getUnreadNotificationsCount = (): number => {
    return friendRequests.length;
  };

  return (
    <FriendsContext.Provider value={{
      friendRequests,
      friends,
      sendFriendRequest,
      acceptFriendRequest,
      rejectFriendRequest,
      removeFriend,
      getFriendshipStatus,
      getUnreadNotificationsCount
    }}>
      {children}
    </FriendsContext.Provider>
  );
};