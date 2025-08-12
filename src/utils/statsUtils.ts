interface UserStats {
  likes: number;
  matches: number;
  views: number;
  messages: number;
}

interface LikeAction {
  userId: string;
  likedUserId: string;
  timestamp: Date;
  type: 'like' | 'superlike' | 'pass';
}

interface ViewAction {
  userId: string;
  viewedUserId: string;
  timestamp: Date;
}

// Получить статистику пользователя
export const getUserStats = (userId: string): UserStats => {
  const statsKey = `user_stats_${userId}`;
  const savedStats = localStorage.getItem(statsKey);
  
  if (savedStats) {
    return JSON.parse(savedStats);
  }
  
  // Возвращаем нулевую статистику для новых пользователей
  const defaultStats: UserStats = {
    likes: 0,
    matches: 0,
    views: 0,
    messages: 0
  };
  
  localStorage.setItem(statsKey, JSON.stringify(defaultStats));
  return defaultStats;
};

// Обновить статистику пользователя
export const updateUserStats = (userId: string, updates: Partial<UserStats>): UserStats => {
  const currentStats = getUserStats(userId);
  const newStats = { ...currentStats, ...updates };
  
  const statsKey = `user_stats_${userId}`;
  localStorage.setItem(statsKey, JSON.stringify(newStats));
  
  return newStats;
};

// Добавить лайк (увеличить счетчик лайков у получателя)
export const addLike = (fromUserId: string, toUserId: string, type: 'like' | 'superlike' | 'pass' = 'like'): void => {
  // Записываем действие лайка
  const likesKey = 'user_likes';
  const existingLikes: LikeAction[] = JSON.parse(localStorage.getItem(likesKey) || '[]');
  
  // Проверяем, не лайкал ли уже этот пользователь
  const alreadyLiked = existingLikes.find(
    like => like.userId === fromUserId && like.likedUserId === toUserId
  );
  
  if (!alreadyLiked && (type === 'like' || type === 'superlike')) {
    // Добавляем лайк в общий список
    const newLike: LikeAction = {
      userId: fromUserId,
      likedUserId: toUserId,
      timestamp: new Date(),
      type
    };
    existingLikes.push(newLike);
    localStorage.setItem(likesKey, JSON.stringify(existingLikes));
    
    // Увеличиваем счетчик лайков у получателя
    const currentStats = getUserStats(toUserId);
    updateUserStats(toUserId, {
      likes: currentStats.likes + 1
    });
    
    // Проверяем на взаимный лайк (матч)
    const mutualLike = existingLikes.find(
      like => like.userId === toUserId && like.likedUserId === fromUserId && 
      (like.type === 'like' || like.type === 'superlike')
    );
    
    if (mutualLike) {
      // Создаем матч
      createMatch(fromUserId, toUserId);
    }
  }
};

// Создать матч между пользователями
export const createMatch = (userId1: string, userId2: string): void => {
  const matchesKey = 'matches';
  const existingMatches = JSON.parse(localStorage.getItem(matchesKey) || '[]');
  
  // Проверяем, не существует ли уже матч
  const matchExists = existingMatches.find((match: any) =>
    (match.user1Id === userId1 && match.user2Id === userId2) ||
    (match.user1Id === userId2 && match.user2Id === userId1)
  );
  
  if (!matchExists) {
    const newMatch = {
      id: `match_${Date.now()}`,
      user1Id: userId1,
      user2Id: userId2,
      timestamp: new Date(),
      chatId: `${userId1}_${userId2}`
    };
    
    existingMatches.push(newMatch);
    localStorage.setItem(matchesKey, JSON.stringify(existingMatches));
    
    // Увеличиваем счетчик матчей у обоих пользователей
    const stats1 = getUserStats(userId1);
    const stats2 = getUserStats(userId2);
    
    updateUserStats(userId1, { matches: stats1.matches + 1 });
    updateUserStats(userId2, { matches: stats2.matches + 1 });
  }
};

// Добавить просмотр профиля
export const addProfileView = (fromUserId: string, toUserId: string): void => {
  // Не считаем просмотры собственного профиля
  if (fromUserId === toUserId) return;
  
  const viewsKey = 'profile_views';
  const existingViews: ViewAction[] = JSON.parse(localStorage.getItem(viewsKey) || '[]');
  
  // Проверяем, не смотрел ли уже этот пользователь профиль сегодня
  const today = new Date().toDateString();
  const alreadyViewedToday = existingViews.find(
    view => view.userId === fromUserId && 
            view.viewedUserId === toUserId && 
            new Date(view.timestamp).toDateString() === today
  );
  
  if (!alreadyViewedToday) {
    // Добавляем просмотр
    const newView: ViewAction = {
      userId: fromUserId,
      viewedUserId: toUserId,
      timestamp: new Date()
    };
    existingViews.push(newView);
    localStorage.setItem(viewsKey, JSON.stringify(existingViews));
    
    // Увеличиваем счетчик просмотров у получателя
    const currentStats = getUserStats(toUserId);
    updateUserStats(toUserId, {
      views: currentStats.views + 1
    });
  }
};

// Подсчитать сообщения пользователя
export const countUserMessages = (userId: string): number => {
  const chats = JSON.parse(localStorage.getItem('chats') || '{}');
  let messageCount = 0;
  
  Object.entries(chats).forEach(([chatId, messages]: [string, any]) => {
    if (chatId.includes(userId) && Array.isArray(messages)) {
      // Считаем только сообщения от других пользователей к этому пользователю
      const receivedMessages = messages.filter((msg: any) => msg.senderId !== userId);
      messageCount += receivedMessages.length;
    }
  });
  
  return messageCount;
};

// Обновить счетчик сообщений пользователя
export const updateMessageCount = (userId: string): void => {
  const messageCount = countUserMessages(userId);
  const currentStats = getUserStats(userId);
  updateUserStats(userId, {
    messages: messageCount
  });
};

// Получить все лайки, полученные пользователем
export const getUserLikes = (userId: string): LikeAction[] => {
  const likesKey = 'user_likes';
  const allLikes: LikeAction[] = JSON.parse(localStorage.getItem(likesKey) || '[]');
  
  return allLikes.filter(like => 
    like.likedUserId === userId && 
    (like.type === 'like' || like.type === 'superlike')
  );
};

// Получить все просмотры профиля пользователя
export const getUserViews = (userId: string): ViewAction[] => {
  const viewsKey = 'profile_views';
  const allViews: ViewAction[] = JSON.parse(localStorage.getItem(viewsKey) || '[]');
  
  return allViews.filter(view => view.viewedUserId === userId);
};