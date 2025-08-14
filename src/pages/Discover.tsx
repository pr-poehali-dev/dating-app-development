import { useState, useEffect } from 'react';
import { useAuth, User } from '@/contexts/AuthContext';
import DiscoverDesktop from '@/components/discover/DiscoverDesktop';
import DiscoverMobile from '@/components/discover/DiscoverMobile';
import EmptyState from '@/components/discover/EmptyState';
import StoriesFeed from '@/components/stories/StoriesFeed';
import { useDevice } from '@/hooks/useDevice';

const Discover = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);
  const [superLikes, setSuperLikes] = useState(3);
  const [viewedProfiles, setViewedProfiles] = useState<string[]>([]);

  useEffect(() => {
    generateProfiles();
    const savedMatches = JSON.parse(localStorage.getItem('matches') || '[]');
    setMatches(savedMatches);
    const savedViewed = JSON.parse(localStorage.getItem(`viewedProfiles_${user?.id}`) || '[]');
    setViewedProfiles(savedViewed);
  }, [user]);

  const generateProfiles = () => {
    // Загружаем реальных пользователей из localStorage
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Определяем противоположный пол
    const oppositeGender = user?.gender === 'male' ? 'female' : 'male';
    
    // Показываем только пользователей противоположного пола (исключаем текущего пользователя)
    const filteredProfiles = allUsers.filter((profile: User) => 
      profile.id !== user?.id && profile.gender === oppositeGender
    );
    
    setProfiles(filteredProfiles);
    setCurrentIndex(0);
  };

  const currentProfile = profiles[currentIndex];

  const markAsViewed = (profileId: string) => {
    if (!user) return;
    const updated = [...viewedProfiles, profileId];
    setViewedProfiles(updated);
    localStorage.setItem(`viewedProfiles_${user.id}`, JSON.stringify(updated));
  };

  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    if (!currentProfile || !user) return;

    markAsViewed(currentProfile.id);

    // Добавляем просмотр профиля
    const { addProfileView } = await import('@/utils/statsUtils');
    addProfileView(user.id, currentProfile.id);

    if (direction === 'right') {
      handleLike();
    } else if (direction === 'left') {
      handlePass();
    } else if (direction === 'up') {
      handleSuperLike();
    }

    setTimeout(() => {
      if (currentIndex + 1 >= profiles.length) {
        setCurrentIndex(0); // Зацикливаем показ профилей
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 300);
  };

  const handleLike = async () => {
    if (!currentProfile || !user) return;
    
    // Добавляем лайк через систему статистики
    const { addLike } = await import('@/utils/statsUtils');
    addLike(user.id, currentProfile.id, 'like');
    
    // Обновляем локальные матчи для UI
    const existingMatches = JSON.parse(localStorage.getItem('matches') || '[]');
    const userMatches = existingMatches.filter((match: any) =>
      match.user1Id === user.id || match.user2Id === user.id
    );
    setMatches(userMatches.map((match: any) => 
      match.user1Id === user.id ? match.user2Id : match.user1Id
    ));
  };

  const handlePass = async () => {
    if (!currentProfile || !user) return;
    
    // Записываем "pass" для статистики, но не увеличиваем лайки
    const { addLike } = await import('@/utils/statsUtils');
    addLike(user.id, currentProfile.id, 'pass');
  };

  const handleSuperLike = async () => {
    if (superLikes > 0 && currentProfile && user) {
      setSuperLikes(prev => prev - 1);
      
      // Добавляем супер-лайк через систему статистики
      const { addLike } = await import('@/utils/statsUtils');
      addLike(user.id, currentProfile.id, 'superlike');
      
      // Обновляем локальные матчи для UI
      const existingMatches = JSON.parse(localStorage.getItem('matches') || '[]');
      const userMatches = existingMatches.filter((match: any) =>
        match.user1Id === user.id || match.user2Id === user.id
      );
      setMatches(userMatches.map((match: any) => 
        match.user1Id === user.id ? match.user2Id : match.user1Id
      ));
    }
  };

  if (!currentProfile) {
    return <EmptyState onRefresh={generateProfiles} />;
  }

  return (
    <div className="h-screen overflow-hidden relative bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* Анимированный фон с геометрическими фигурами */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Большие круги */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-300/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-300/15 to-pink-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Плавающие элементы */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-pink-400/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-32 left-32 w-5 h-5 bg-indigo-400/30 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-20 right-20 w-6 h-6 bg-pink-300/30 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }}></div>
        
        {/* Сердечки */}
        <div className="absolute top-16 left-1/4 text-pink-300/40 animate-pulse" style={{ animationDelay: '1s' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div className="absolute bottom-16 right-1/4 text-purple-300/40 animate-pulse" style={{ animationDelay: '2s' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        
        {/* Геометрические формы */}
        <div className="absolute top-32 right-16 w-8 h-8 border-2 border-pink-300/30 rotate-45 animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-40 left-16 w-6 h-6 border-2 border-purple-300/30 rounded-full animate-spin" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        
        {/* Мерцающие звездочки */}
        <div className="absolute top-24 left-1/3 text-indigo-300/50 animate-ping" style={{ animationDelay: '0.3s' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0l3.09 6.26L22 7.27l-5 4.87 1.18 6.88L12 15.77l-6.18 3.25L7 12.14 2 7.27l6.91-1.01L12 0z"/>
          </svg>
        </div>
        <div className="absolute bottom-28 right-1/3 text-pink-300/50 animate-ping" style={{ animationDelay: '1.8s' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0l3.09 6.26L22 7.27l-5 4.87 1.18 6.88L12 15.77l-6.18 3.25L7 12.14 2 7.27l6.91-1.01L12 0z"/>
          </svg>
        </div>
      </div>
      
      {/* Оверлей для лучшей читаемости */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[0.5px]"></div>
      {/* Десктоп версия */}
      <div className="hidden lg:flex h-full relative z-10">
        <DiscoverDesktop
          currentProfile={currentProfile}
          superLikes={superLikes}
          matches={matches}
          onSwipe={handleSwipe}
        />
      </div>

      {/* Планшет версия */}
      <div className="hidden md:flex lg:hidden h-full relative z-10">
        <DiscoverMobile
          currentProfile={currentProfile}
          superLikes={superLikes}
          matches={matches}
          onSwipe={handleSwipe}
          variant="tablet"
        />
      </div>

      {/* Мобильная версия */}
      <div className="md:hidden h-full relative z-10">
        <DiscoverMobile
          currentProfile={currentProfile}
          superLikes={superLikes}
          matches={matches}
          onSwipe={handleSwipe}
          variant="mobile"
        />
      </div>
    </div>
  );
};

export default Discover;