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
        location: 'Москва',
        interests: ['Путешествия', 'Кофе', 'Книги'],
        verified: true,
        subscription: 'premium',
        lastActive: new Date().toISOString(),
      },
      {
        id: '2', 
        name: 'Елена',
        email: 'elena@example.com',
        age: 28,
        bio: 'Фотограф и любительница искусства. Ищу того, с кем можно делиться прекрасными моментами',
        photos: [],
        location: 'Санкт-Петербург',
        interests: ['Фотография', 'Искусство', 'Музеи'],
        verified: true,
        subscription: 'free',
        lastActive: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Мария',
        email: 'maria@example.com', 
        age: 23,
        bio: 'Студентка медицинского института. Люблю активный отдых и здоровый образ жизни',
        photos: [],
        location: 'Екатеринбург',
        interests: ['Спорт', 'Медицина', 'Йога'],
        verified: false,
        subscription: 'free',
        lastActive: new Date().toISOString(),
      }
    ];
    setProfiles(sampleProfiles);
  };

  const currentProfile = profiles[currentIndex];

  const handleLike = () => {
    if (currentProfile) {
      const newMatches = [...matches, currentProfile.id];
      setMatches(newMatches);
      localStorage.setItem('matches', JSON.stringify(newMatches));
    }
    nextProfile();
  };

  const handlePass = () => {
    nextProfile();
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Heart" size={64} className="text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Загружаем профили...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Знакомства</h1>
          <p className="text-gray-600">Находите интересных людей рядом с вами</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar with filters */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Фильтры</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Возраст
                    </label>
                    <div className="text-sm text-gray-600">18 - 35 лет</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Расстояние
                    </label>
                    <div className="text-sm text-gray-600">До 50 км</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Интересы
                    </label>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">Путешествия</Badge>
                      <Badge variant="outline" className="text-xs">Спорт</Badge>
                      <Badge variant="outline" className="text-xs">Искусство</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main profile card */}
          <div className="lg:col-span-3">
            <Card className="bg-white shadow-lg overflow-hidden">
              {/* Profile Image */}
              <div className="relative h-96 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center">
                <Icon name="User" size={120} className="text-gray-600" />
                <div className="absolute top-4 right-4">
                  {currentProfile.verified && (
                    <Badge className="bg-blue-500">
                      <Icon name="Shield" size={12} className="mr-1" />
                      Верифицирован
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  📍 {currentProfile.location}
                </div>
              </div>

              <CardContent className="p-8">
                {/* Profile Info */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-bold text-gray-900">
                      {currentProfile.name}, {currentProfile.age}
                    </h2>
                    <Badge variant={currentProfile.subscription === 'premium' ? 'default' : 'secondary'}>
                      {currentProfile.subscription === 'premium' ? 'Premium' : 'Базовый'}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    {currentProfile.bio}
                  </p>

                  {/* Interests */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Интересы:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-6">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handlePass}
                      className="w-16 h-16 rounded-full border-gray-300 hover:border-gray-400"
                    >
                      <Icon name="X" size={24} className="text-gray-600" />
                    </Button>
                    
                    <Button
                      size="lg"
                      onClick={handleLike}
                      className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Icon name="Heart" size={32} />
                    </Button>
                    
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-16 h-16 rounded-full border-blue-300 hover:border-blue-400"
                    >
                      <Icon name="Star" size={24} className="text-blue-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Tips */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Icon name="X" size={16} />
                  <span>Пропустить</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Heart" size={16} className="text-red-500" />
                  <span>Нравится</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Star" size={16} className="text-blue-500" />
                  <span>Супер лайк</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar with recent matches */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Новые совпадения</h3>
                <div className="space-y-3">
                  {matches.slice(-3).map((matchId, index) => {
                    const matchProfile = profiles.find(p => p.id === matchId);
                    return matchProfile ? (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center">
                          <Icon name="User" size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{matchProfile.name}</div>
                          <div className="text-xs text-gray-500">Новое совпадение</div>
                        </div>
                      </div>
                    ) : null;
                  })}
                  {matches.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Пока нет совпадений
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}