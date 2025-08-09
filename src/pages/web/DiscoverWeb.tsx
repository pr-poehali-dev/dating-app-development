import { useState, useEffect } from 'react';
import { useAuth, User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function DiscoverWeb() {
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
        bio: 'Люблю путешествия и кофе ☕️ В поисках интересных разговоров и новых приключений. Работаю маркетологом, увлекаюсь йогой и фотографией. Мечтаю посетить Японию и выучить новый язык.',
        photos: ['/img/4cf46a0e-c3f2-45b0-9806-3c40c852f7c0.jpg'],
        location: { lat: 55.7558, lng: 37.6176, city: 'Москва' },
        interests: ['Путешествия', 'Кофе', 'Фотография', 'Йога', 'Маркетинг'],
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
        bio: 'Разработчик и любитель горных лыж 🎿 Ищу кого-то для совместных приключений. Увлекаюсь технологиями, читаю фантастику и обожаю активный отдых на природе.',
        photos: ['/img/08b3fd97-0dd5-453c-90f6-2d389886b8c3.jpg'],
        location: { lat: 55.7558, lng: 37.6176, city: 'Москва' },
        interests: ['Программирование', 'Лыжи', 'Книги', 'Кино', 'Технологии'],
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
        bio: 'Художница и мечтательница 🎨 Обожаю закаты и долгие прогулки по городу. Рисую маслом, изучаю историю искусства и мечтаю открыть собственную галерею.',
        photos: ['/img/24ac872e-a5e0-4cd9-8c6e-bd3052fce428.jpg'],
        location: { lat: 55.7558, lng: 37.6176, city: 'Москва' },
        interests: ['Искусство', 'Природа', 'Музыка', 'Танцы', 'История'],
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
      nextProfile();
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

  const nextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      generateProfiles();
      setCurrentIndex(0);
    }
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
            <Icon name="Heart" size={32} className="text-white" />
          </div>
          <p className="text-gray-600 font-medium">Ищем для вас идеальные совпадения...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Откройте для себя новых людей
          </h1>
          <p className="text-gray-600 text-lg">
            Найдите свою половинку среди тысяч интересных профилей
          </p>
        </div>

        <div className="flex justify-center items-center gap-8">
          {/* Статистика слева */}
          <div className="flex flex-col gap-4">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <Icon name="Star" size={24} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{superLikes}</div>
                  <div className="text-sm text-gray-600">Супер-лайки</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center">
                    <Icon name="Heart" size={24} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{matches.length + 12}</div>
                  <div className="text-sm text-gray-600">Совпадения</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Основная карточка профиля */}
          <div className="relative">
            <Card className="w-96 h-[600px] bg-white/95 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
              {/* Фото профиля */}
              <div 
                className="h-2/3 bg-cover bg-center relative"
                style={{ 
                  backgroundImage: currentProfile.photos && currentProfile.photos.length > 0 
                    ? `url(${currentProfile.photos[0]})` 
                    : undefined,
                  backgroundColor: !currentProfile.photos || currentProfile.photos.length === 0 
                    ? undefined 
                    : 'transparent'
                }}
              >
                {(!currentProfile.photos || currentProfile.photos.length === 0) && (
                  <div className="w-full h-full bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-300 flex items-center justify-center">
                    <Icon name="User" size={80} className="text-gray-600" />
                  </div>
                )}
                
                {/* Индикаторы статуса */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {currentProfile.verified && (
                    <Badge className="bg-blue-500/90 backdrop-blur-sm border-0">
                      <Icon name="ShieldCheck" size={14} className="mr-1" />
                      Проверен
                    </Badge>
                  )}
                  {currentProfile.subscription === 'premium' && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 border-0">
                      <Icon name="Crown" size={14} className="mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>

                {/* Индикатор онлайн */}
                <div className="absolute top-4 right-4">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                </div>

                {/* Локация */}
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-black/50 backdrop-blur-sm border-0 text-white">
                    <Icon name="MapPin" size={12} className="mr-1" />
                    {typeof currentProfile.location === 'string' ? currentProfile.location : currentProfile.location?.city || 'Неизвестно'}
                  </Badge>
                </div>
              </div>

              {/* Информация профиля */}
              <CardContent className="p-6 h-1/3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {currentProfile.name}, {currentProfile.age}
                    </h2>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                    {currentProfile.bio}
                  </p>

                  {/* Интересы */}
                  <div className="flex flex-wrap gap-1">
                    {currentProfile.interests?.slice(0, 3).map((interest, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {currentProfile.interests && currentProfile.interests.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{currentProfile.interests.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Кнопки действий справа */}
          <div className="flex flex-col gap-4">
            <Button
              size="lg"
              onClick={() => handleSwipe('left')}
              className="w-16 h-16 rounded-full bg-white border-2 border-red-300 hover:bg-red-500 hover:border-red-500 text-red-500 hover:text-white transition-all duration-200 shadow-lg"
            >
              <Icon name="X" size={28} />
            </Button>
            
            <Button
              size="lg"
              onClick={() => handleSwipe('up')}
              disabled={superLikes === 0}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 text-white transition-all duration-200 disabled:opacity-50 shadow-lg"
            >
              <Icon name="Star" size={28} />
            </Button>
            
            <Button
              size="lg"
              onClick={() => handleSwipe('right')}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 hover:scale-105 text-white transition-all duration-200 shadow-lg"
            >
              <Icon name="Heart" size={32} />
            </Button>
          </div>
        </div>



        {/* Последние совпадения (если есть) */}
        {matches.length > 0 && (
          <div className="mt-8 max-w-md mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  🎉 Новые совпадения
                </h3>
                <div className="flex -space-x-2 justify-center">
                  {matches.slice(-5).map((matchId, index) => {
                    const matchProfile = profiles.find(p => p.id === matchId);
                    return matchProfile ? (
                      <div 
                        key={index} 
                        className="w-10 h-10 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                        title={matchProfile.name}
                      >
                        {matchProfile.photos && matchProfile.photos.length > 0 ? (
                          <img 
                            src={matchProfile.photos[0]} 
                            alt={matchProfile.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <Icon name="User" size={20} className="text-gray-600" />
                        )}
                      </div>
                    ) : null;
                  })}
                </div>
                <p className="text-sm text-gray-600 text-center mt-3">
                  У вас {matches.length} взаимных симпатий
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}