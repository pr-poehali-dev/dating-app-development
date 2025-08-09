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
    // Пустой массив - теперь только реальные пользователи
    const realProfiles: User[] = [];
    
    // Фильтруем уже просмотренные анкеты
    const filteredProfiles = realProfiles.filter(profile => 
      !viewedProfiles.includes(profile.id)
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

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!currentProfile) return;

    markAsViewed(currentProfile.id);

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

  const handleLike = () => {
    if (!currentProfile) return;
    
    const isMatch = Math.random() > 0.7;
    if (isMatch) {
      const newMatches = [...matches, currentProfile.id];
      setMatches(newMatches);
      localStorage.setItem('matches', JSON.stringify(newMatches));
    }
  };

  const handlePass = () => {
    console.log('Passed on', currentProfile?.name);
  };

  const handleSuperLike = () => {
    if (superLikes > 0 && currentProfile) {
      setSuperLikes(prev => prev - 1);
      const isMatch = Math.random() > 0.5;
      if (isMatch) {
        const newMatches = [...matches, currentProfile.id];
        setMatches(newMatches);
        localStorage.setItem('matches', JSON.stringify(newMatches));
      }
    }
  };

  if (!currentProfile) {
    return <EmptyState onRefresh={generateProfiles} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* Десктоп версия */}
      <div className="hidden lg:block">
        <DiscoverDesktop
          currentProfile={currentProfile}
          superLikes={superLikes}
          matches={matches}
          onSwipe={handleSwipe}
        />
      </div>

      {/* Планшет версия */}
      <div className="hidden md:block lg:hidden">
        <DiscoverMobile
          currentProfile={currentProfile}
          superLikes={superLikes}
          matches={matches}
          onSwipe={handleSwipe}
          variant="tablet"
        />
      </div>

      {/* Мобильная версия */}
      <div className="md:hidden">
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