import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

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

  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartPos.x;
    const deltaY = touch.clientY - touchStartPos.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left');
    } else if (deltaY < -50) {
      setSwipeDirection('up');
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold || Math.abs(dragOffset.y) > threshold) {
      if (swipeDirection) {
        handleSwipe(swipeDirection);
      }
    }
    
    setDragOffset({ x: 0, y: 0 });
    setSwipeDirection(null);
    setIsDragging(false);
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

  const getSwipeColor = () => {
    if (!swipeDirection) return 'transparent';
    if (swipeDirection === 'right') return '#10B981';
    if (swipeDirection === 'left') return '#EF4444';
    if (swipeDirection === 'up') return '#3B82F6';
    return 'transparent';
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center">
              <Icon name="Heart" size={40} className="text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <Icon name="Sparkles" size={16} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Готовим новые знакомства
          </h2>
          <p className="text-gray-600 text-lg mb-6">Совсем скоро здесь появятся интересные люди!</p>
          <Button 
            onClick={generateProfiles}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Icon name="RotateCcw" size={20} className="mr-2" />
            Обновить профили
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* Десктоп версия */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Откройте для себя новых людей
            </h1>
            <p className="text-gray-600 text-lg">Найдите свою половинку среди тысяч интересных профилей</p>
          </div>

          <div className="flex justify-center items-center gap-8">
            {/* Статистика */}
            <div className="flex flex-col gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Icon name="Zap" size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{superLikes}</p>
                    <p className="text-sm text-gray-600">Супер-лайков</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center">
                    <Icon name="Heart" size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{matches.length}</p>
                    <p className="text-sm text-gray-600">Совпадений</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Основная карточка */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProfile.id}
                  initial={{ scale: 0.9, opacity: 0, rotateY: -30 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  exit={{ scale: 0.9, opacity: 0, rotateY: 30 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-96 h-[600px]"
                >
                  <Card className="w-full h-full overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
                    <div className="relative h-3/4 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600">
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute inset-0">
                        {currentProfile.photos && currentProfile.photos.length > 0 ? (
                          <img 
                            src={currentProfile.photos[0]} 
                            alt={currentProfile.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="w-40 h-40 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <Icon name="User" size={80} className="text-white" />
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      </div>
                      
                      {currentProfile.verified && (
                        <div className="absolute top-6 right-6 bg-blue-500/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                          <Icon name="ShieldCheck" size={20} className="text-white" />
                        </div>
                      )}
                      
                      {currentProfile.subscription === 'premium' && (
                        <div className="absolute top-6 left-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-4 py-2 shadow-lg">
                          <div className="flex items-center gap-1">
                            <Icon name="Crown" size={16} className="text-white" />
                            <span className="text-white text-sm font-bold">Premium</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="h-1/4 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                              {currentProfile.name}
                              {currentProfile.verified && (
                                <Icon name="BadgeCheck" size={24} className="text-blue-500" />
                              )}
                            </h3>
                            <p className="text-gray-600 text-lg">{currentProfile.age} лет • {currentProfile.location.city}</p>
                          </div>
                          <div className={cn(
                            "flex items-center gap-2 px-3 py-1 rounded-full text-sm",
                            currentProfile.settings.showOnlineStatus 
                              ? "bg-green-100 text-green-700" 
                              : "bg-gray-100 text-gray-600"
                          )}>
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              currentProfile.settings.showOnlineStatus ? "bg-green-500" : "bg-gray-400"
                            )} />
                            <span>{currentProfile.settings.showOnlineStatus ? 'Онлайн' : 'Был недавно'}</span>
                          </div>
                        </div>

                        <p className="text-gray-700 text-base mb-4 line-clamp-2">{currentProfile.bio}</p>

                        <div className="flex flex-wrap gap-2">
                          {currentProfile.interests.slice(0, 4).map((interest, index) => (
                            <Badge key={index} variant="secondary" className="bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border-purple-200">
                              {interest}
                            </Badge>
                          ))}
                          {currentProfile.interests.length > 4 && (
                            <Badge variant="secondary" className="bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border-purple-200">
                              +{currentProfile.interests.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Кнопки действий */}
            <div className="flex flex-col gap-4">
              <Button
                size="lg"
                variant="outline"
                className="w-16 h-16 rounded-full border-2 border-red-400 bg-white/80 backdrop-blur-sm hover:bg-red-50 hover:border-red-500 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => handleSwipe('left')}
              >
                <Icon name="X" size={28} className="text-red-500" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="w-14 h-14 rounded-full border-2 border-blue-400 bg-white/80 backdrop-blur-sm hover:bg-blue-50 hover:border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => handleSwipe('up')}
                disabled={superLikes === 0}
              >
                <Icon name="Star" size={24} className="text-blue-500" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="w-16 h-16 rounded-full border-2 border-green-400 bg-white/80 backdrop-blur-sm hover:bg-green-50 hover:border-green-500 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => handleSwipe('right')}
              >
                <Icon name="Heart" size={28} className="text-green-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Планшет версия */}
      <div className="hidden md:block lg:hidden">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Новые знакомства
            </h1>
          </div>

          <div className="flex justify-center">
            <div className="max-w-md w-full">
              <div className="flex items-center justify-between mb-6 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Icon name="Zap" size={18} className="text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-800">{superLikes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center">
                    <Icon name="Heart" size={18} className="text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-800">{matches.length}</span>
                </div>
              </div>

              <div className="relative h-[500px] mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProfile.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Card className="h-full overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
                      <div className="relative h-3/4 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600">
                        <div className="absolute inset-0">
                          {currentProfile.photos && currentProfile.photos.length > 0 ? (
                            <img 
                              src={currentProfile.photos[0]} 
                              alt={currentProfile.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Icon name="User" size={64} className="text-white" />
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        </div>
                        
                        {currentProfile.verified && (
                          <div className="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm rounded-full p-2">
                            <Icon name="ShieldCheck" size={18} className="text-white" />
                          </div>
                        )}
                      </div>

                      <div className="h-1/4 p-4 flex flex-col justify-between">
                        <div>
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
                            <div className={cn(
                              "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                              currentProfile.settings.showOnlineStatus 
                                ? "bg-green-100 text-green-700" 
                                : "bg-gray-100 text-gray-600"
                            )}>
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                currentProfile.settings.showOnlineStatus ? "bg-green-500" : "bg-gray-400"
                              )} />
                              <span>{currentProfile.settings.showOnlineStatus ? 'Онлайн' : 'Недавно'}</span>
                            </div>
                          </div>

                          <p className="text-gray-700 text-sm mb-2 line-clamp-2">{currentProfile.bio}</p>

                          <div className="flex flex-wrap gap-1">
                            {currentProfile.interests.slice(0, 3).map((interest, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700">
                                {interest}
                              </Badge>
                            ))}
                            {currentProfile.interests.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700">
                                +{currentProfile.interests.length - 3}
                              </Badge>
                            )}
                          </div>
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
                  className="w-14 h-14 rounded-full border-2 border-red-400 bg-white/80 backdrop-blur-sm hover:bg-red-50 shadow-lg transition-all duration-300"
                  onClick={() => handleSwipe('left')}
                >
                  <Icon name="X" size={24} className="text-red-500" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="w-12 h-12 rounded-full border-2 border-blue-400 bg-white/80 backdrop-blur-sm hover:bg-blue-50 shadow-lg transition-all duration-300"
                  onClick={() => handleSwipe('up')}
                  disabled={superLikes === 0}
                >
                  <Icon name="Star" size={20} className="text-blue-500" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="w-14 h-14 rounded-full border-2 border-green-400 bg-white/80 backdrop-blur-sm hover:bg-green-50 shadow-lg transition-all duration-300"
                  onClick={() => handleSwipe('right')}
                >
                  <Icon name="Heart" size={24} className="text-green-500" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Мобильная версия */}
      <div className="md:hidden">
        <div className="max-w-sm mx-auto px-4 py-4 pt-safe">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Icon name="Zap" size={18} className="text-white" />
              </div>
              <span className="text-gray-800 font-bold text-lg">{superLikes}</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Знакомства
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <Icon name="Heart" size={18} className="text-white" />
              </div>
              <span className="text-gray-800 font-bold text-lg">{matches.length}</span>
            </div>
          </div>

          <div className="relative h-[550px] mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProfile.id}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                initial={{ scale: 0.95, opacity: 0, y: 50 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  y: 0,
                  x: dragOffset.x * 0.3,
                  rotate: dragOffset.x * 0.05
                }}
                exit={{ scale: 0.95, opacity: 0, y: -50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
                style={{
                  border: swipeDirection ? `3px solid ${getSwipeColor()}` : 'none',
                  borderRadius: '24px',
                }}
              >
                <Card className="h-full overflow-hidden bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                  <div className="relative h-2/3 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 overflow-hidden">
                    {/* Декоративные элементы */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
                    
                    <div className="absolute inset-0">
                      {currentProfile.photos && currentProfile.photos.length > 0 ? (
                        <img 
                          src={currentProfile.photos[0]} 
                          alt={currentProfile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="w-36 h-36 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl">
                            <Icon name="User" size={72} className="text-white" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>
                    
                    {currentProfile.verified && (
                      <div className="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                        <Icon name="ShieldCheck" size={18} className="text-white" />
                      </div>
                    )}
                    
                    {currentProfile.subscription === 'premium' && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-3 py-1 shadow-lg">
                        <div className="flex items-center gap-1">
                          <Icon name="Crown" size={14} className="text-white" />
                          <span className="text-white text-xs font-bold">Premium</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Индикаторы свайпа */}
                    {swipeDirection === 'right' && Math.abs(dragOffset.x) > 50 && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm"
                      >
                        <div className="bg-green-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-xl">
                          ❤️ ЛАЙК
                        </div>
                      </motion.div>
                    )}
                    
                    {swipeDirection === 'left' && Math.abs(dragOffset.x) > 50 && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm"
                      >
                        <div className="bg-red-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-xl">
                          ❌ ПРОПУСК
                        </div>
                      </motion.div>
                    )}
                    
                    {swipeDirection === 'up' && Math.abs(dragOffset.y) > 30 && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm"
                      >
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-xl shadow-xl">
                          ⭐ СУПЕР-ЛАЙК
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="h-1/3 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                            {currentProfile.name}
                            {currentProfile.verified && (
                              <Icon name="BadgeCheck" size={22} className="text-blue-500" />
                            )}
                          </h3>
                          <p className="text-gray-600 text-lg">{currentProfile.age} лет • {currentProfile.location.city}</p>
                        </div>
                        <div className={cn(
                          "flex items-center gap-2 px-3 py-1 rounded-full text-sm",
                          currentProfile.settings.showOnlineStatus 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-600"
                        )}>
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            currentProfile.settings.showOnlineStatus ? "bg-green-500 animate-pulse" : "bg-gray-400"
                          )} />
                          <span className="font-medium">
                            {currentProfile.settings.showOnlineStatus ? 'Онлайн' : 'Недавно'}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 text-base mb-4 line-clamp-2 leading-relaxed">{currentProfile.bio}</p>

                      <div className="flex flex-wrap gap-2">
                        {currentProfile.interests.slice(0, 3).map((interest, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-sm bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border-purple-200 px-3 py-1"
                          >
                            {interest}
                          </Badge>
                        ))}
                        {currentProfile.interests.length > 3 && (
                          <Badge 
                            variant="secondary" 
                            className="text-sm bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border-purple-200 px-3 py-1"
                          >
                            +{currentProfile.interests.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Подсказка для свайпа */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-4 text-xs text-gray-400 bg-gray-50 rounded-full py-2 px-4">
                        <div className="flex items-center gap-1">
                          <Icon name="ArrowLeft" size={14} />
                          <span>Пропуск</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="ArrowUp" size={14} />
                          <span>Супер</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="ArrowRight" size={14} />
                          <span>Лайк</span>
                        </div>
                      </div>
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
              className="w-16 h-16 rounded-full border-2 border-red-400 bg-white/90 backdrop-blur-sm hover:bg-red-50 hover:border-red-500 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
              onClick={() => handleSwipe('left')}
            >
              <Icon name="X" size={28} className="text-red-500" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="w-14 h-14 rounded-full border-2 border-blue-400 bg-white/90 backdrop-blur-sm hover:bg-blue-50 hover:border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleSwipe('up')}
              disabled={superLikes === 0}
            >
              <Icon name="Star" size={24} className="text-blue-500" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full border-2 border-green-400 bg-white/90 backdrop-blur-sm hover:bg-green-50 hover:border-green-500 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
              onClick={() => handleSwipe('right')}
            >
              <Icon name="Heart" size={28} className="text-green-500" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;