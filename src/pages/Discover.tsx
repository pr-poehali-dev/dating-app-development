import { useState, useEffect } from 'react';
import { useAuth, User } from '@/contexts/AuthContext';
import DiscoverDesktop from '@/components/discover/DiscoverDesktop';
import DiscoverMobile from '@/components/discover/DiscoverMobile';
import EmptyState from '@/components/discover/EmptyState';

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
    
    // Фильтруем: убираем текущего пользователя и уже просмотренные анкеты
    const filteredProfiles = allUsers.filter((profile: User) => 
      profile.id !== user?.id && !viewedProfiles.includes(profile.id)
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
        generateProfiles();
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
    <div className="h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* Десктоп версия */}
      <div className="hidden lg:flex h-full">
        <DiscoverDesktop
          currentProfile={currentProfile}
          superLikes={superLikes}
          matches={matches}
          onSwipe={handleSwipe}
        />
      </div>

      {/* Планшет версия */}
      <div className="hidden md:flex lg:hidden h-full">
        <DiscoverMobile
          currentProfile={currentProfile}
          superLikes={superLikes}
          matches={matches}
          onSwipe={handleSwipe}
          variant="tablet"
        />
      </div>

      {/* Мобильная версия */}
      <div className="md:hidden h-full">
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