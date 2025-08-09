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

  useEffect(() => {
    generateProfiles();
    const savedMatches = JSON.parse(localStorage.getItem('matches') || '[]');
    setMatches(savedMatches);
  }, []);

  const generateProfiles = () => {
    const sampleProfiles: User[] = [
      {
        id: '1',
        name: 'Анна',
        email: 'anna@example.com',
        age: 25,
        bio: 'Люблю путешествия и кофе ☕️ В поисках интересных разговоров и новых приключений',
        photos: ['/img/4cf46a0e-c3f2-45b0-9806-3c40c852f7c0.jpg'],
        location: { lat: 55.7558, lng: 37.6176, city: 'Москва' },
        interests: ['Путешествия', 'Кофе', 'Фотография', 'Йога'],
        verified: true,
        subscription: 'premium',
        lastActive: new Date(),
        settings: {
          discoverable: true,
          ageRange: [22, 35],
          maxDistance: 30,
          showOnlineStatus: true
        }
      },
      {
        id: '2',
        name: 'Максим',
        email: 'max@example.com',
        age: 28,
        bio: 'Разработчик и любитель горных лыж 🎿 Ищу кого-то для совместных приключений',
        photos: ['/img/08b3fd97-0dd5-453c-90f6-2d389886b8c3.jpg'],
        location: { lat: 55.7558, lng: 37.6176, city: 'Москва' },
        interests: ['Программирование', 'Лыжи', 'Книги', 'Кино'],
        verified: false,
        subscription: 'free',
        lastActive: new Date(),
        settings: {
          discoverable: true,
          ageRange: [20, 30],
          maxDistance: 25,
          showOnlineStatus: false
        }
      },
      {
        id: '3',
        name: 'София',
        email: 'sofia@example.com',
        age: 24,
        bio: 'Художница и мечтательница 🎨 Обожаю закаты и долгие прогулки по городу',
        photos: ['/img/24ac872e-a5e0-4cd9-8c6e-bd3052fce428.jpg'],
        location: { lat: 55.7558, lng: 37.6176, city: 'Москва' },
        interests: ['Искусство', 'Природа', 'Музыка', 'Танцы'],
        verified: true,
        subscription: 'premium',
        lastActive: new Date(),
        settings: {
          discoverable: true,
          ageRange: [22, 32],
          maxDistance: 20,
          showOnlineStatus: true
        }
      }
    ];
    setProfiles(sampleProfiles);
  };

  const currentProfile = profiles[currentIndex];

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!currentProfile) return;

    if (direction === 'right') {
      handleLike();
    } else if (direction === 'left') {
      handlePass();
    } else if (direction === 'up') {
      handleSuperLike();
    }

    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % profiles.length);
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