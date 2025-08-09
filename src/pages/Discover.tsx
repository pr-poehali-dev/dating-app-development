import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useSwipe } from '@/hooks/useSwipe';

const Discover = () => {
  const { user, updateProfile } = useAuth();
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
        photos: [],
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
        photos: [],
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
        photos: [],
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

  const { bind, dragOffset, swipeDirection, swipeIntensity, isAnimating } = useSwipe({
    onSwipeLeft: () => handleSwipe('left'),
    onSwipeRight: () => handleSwipe('right'),
    onSwipeUp: () => handleSwipe('up'),
    threshold: 80,
    velocity: 0.3
  });

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

  const getSwipeColor = () => {
    if (!swipeDirection) return 'transparent';
    if (swipeDirection === 'right') return '#10B981';
    if (swipeDirection === 'left') return '#EF4444';
    return 'transparent';
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-love-light to-love-dark flex items-center justify-center">
        <div className="text-center text-white">
          <Icon name="Heart" size={64} className="mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">Пока что никого нет</h2>
          <p className="opacity-80">Скоро появятся новые профили!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-light to-love-dark p-4">
      <div className="max-w-sm mx-auto pt-safe">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Icon name="Zap" size={20} className="text-yellow-400" />
            <span className="text-white font-medium">{superLikes}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Users" size={20} className="text-white" />
            <span className="text-white font-medium">{matches.length}</span>
          </div>
        </div>

        <div className="relative h-[600px] mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProfile.id}
              {...bind()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                x: dragOffset.x,
                y: dragOffset.y,
                rotate: dragOffset.x * 0.1
              }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`absolute inset-0 cursor-grab active:cursor-grabbing ${isAnimating ? 'pointer-events-none' : ''}`}
              style={{
                border: `3px solid ${getSwipeColor()}`,
                borderRadius: '24px',
                background: swipeIntensity > 0.3 ? `${getSwipeColor()}20` : 'transparent'
              }}
            >
              <Card className="h-full overflow-hidden bg-white border-0 shadow-2xl">
                <div className="relative h-2/3 bg-gradient-to-br from-love-light to-love-DEFAULT">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                      <Icon name="User" size={64} className="text-white" />
                    </div>
                  </div>
                  
                  {currentProfile.verified && (
                    <div className="absolute top-4 right-4 bg-blue-500 rounded-full p-2">
                      <Icon name="Shield" size={16} className="text-white" />
                    </div>
                  )}
                  
                  {swipeDirection === 'right' && swipeIntensity > 0.3 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-xl">
                        ЛАЙК
                      </div>
                    </div>
                  )}
                  
                  {swipeDirection === 'left' && swipeIntensity > 0.3 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl">
                        НЕТ
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-1/3 p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        {currentProfile.name}
                        {currentProfile.verified && (
                          <Icon name="BadgeCheck" size={20} className="text-blue-500" />
                        )}
                      </h3>
                      <p className="text-gray-600">{currentProfile.age} лет • {currentProfile.location.city}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          currentProfile.settings.showOnlineStatus ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-xs text-gray-500">
                          {currentProfile.settings.showOnlineStatus ? 'Онлайн' : 'Был недавно'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">{currentProfile.bio}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {currentProfile.interests.slice(0, 3).map((interest, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {currentProfile.interests.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{currentProfile.interests.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Button
            size="lg"
            variant="outline"
            className="w-14 h-14 rounded-full border-2 border-red-500 bg-white hover:bg-red-50"
            onClick={() => handleSwipe('left')}
          >
            <Icon name="X" size={24} className="text-red-500" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="w-12 h-12 rounded-full border-2 border-blue-500 bg-white hover:bg-blue-50"
            onClick={() => handleSwipe('up')}
            disabled={superLikes === 0}
          >
            <Icon name="Star" size={20} className="text-blue-500" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="w-14 h-14 rounded-full border-2 border-green-500 bg-white hover:bg-green-50"
            onClick={() => handleSwipe('right')}
          >
            <Icon name="Heart" size={24} className="text-green-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Discover;