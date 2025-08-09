import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, User } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Matches = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = () => {
    const savedMatches = JSON.parse(localStorage.getItem('matches') || '[]');
    
    const matchedUsers: User[] = savedMatches.map((matchId: string, index: number) => ({
      id: matchId,
      name: ['Анна', 'Максим', 'София', 'Елена', 'Дмитрий'][index] || `Пользователь ${index + 1}`,
      email: `user${index + 1}@example.com`,
      age: 22 + Math.floor(Math.random() * 15),
      bio: [
        'Люблю путешествия и новые знакомства ✈️',
        'Увлекаюсь спортом и активным отдыхом 🏃‍♂️',
        'Художница в душе, ищу вдохновение 🎨',
        'Книголюб и любитель кофе ☕️',
        'Программист днём, музыкант ночью 🎵'
      ][index] || 'Привет! Давай знакомиться!',
      photos: [],
      location: {
        lat: 55.7558,
        lng: 37.6176,
        city: 'Москва'
      },
      interests: [
        ['Путешествия', 'Фотография', 'Кофе'],
        ['Спорт', 'Фитнес', 'Кино'],
        ['Искусство', 'Музыка', 'Танцы'],
        ['Книги', 'Театр', 'Готовка'],
        ['Программирование', 'Музыка', 'Игры']
      ][index] || ['Музыка', 'Спорт'],
      verified: Math.random() > 0.5,
      subscription: Math.random() > 0.7 ? 'premium' : 'free',
      lastActive: new Date(),
      settings: {
        discoverable: true,
        ageRange: [20, 35],
        maxDistance: 30,
        showOnlineStatus: true
      }
    }));

    setMatches(matchedUsers);
    setLoading(false);
  };

  const startChat = (matchId: string) => {
    navigate(`/chat/${matchId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-love-light to-love-dark flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-light to-love-dark p-4 pb-24">
      <div className="max-w-md mx-auto pt-safe">
        <div className="flex items-center justify-between mb-6 pt-4">
          <h1 className="text-2xl font-bold text-white">Совпадения</h1>
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
            <Icon name="Heart" size={16} className="text-white" />
            <span className="text-white font-medium">{matches.length}</span>
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="text-center text-white mt-16">
            <Icon name="Users" size={64} className="mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold mb-2">Пока нет совпадений</h2>
            <p className="opacity-80 mb-6">Продолжайте искать, ваша половинка где-то рядом!</p>
            <Button 
              onClick={() => navigate('/discover')}
              className="bg-white text-love-DEFAULT hover:bg-white/90"
            >
              Начать поиск
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <Card key={match.id} className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-love-light to-love-DEFAULT rounded-full flex items-center justify-center">
                        <Icon name="User" size={24} className="text-white" />
                      </div>
                      {match.verified && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                          <Icon name="Shield" size={12} className="text-white" />
                        </div>
                      )}
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                        match.settings.showOnlineStatus ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {match.name}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {match.age}
                        </span>
                        {match.subscription === 'premium' && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs">
                            Premium
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {match.bio}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {match.interests.slice(0, 2).map((interest, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {match.interests.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{match.interests.length - 2}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm"
                          onClick={() => startChat(match.id)}
                          className="bg-love-DEFAULT hover:bg-love-dark text-white"
                        >
                          <Icon name="MessageCircle" size={16} className="mr-1" />
                          Написать
                        </Button>
                        
                        <Button size="sm" variant="outline">
                          <Icon name="User" size={16} className="mr-1" />
                          Профиль
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="text-center mt-8">
              <Button 
                variant="outline"
                onClick={() => navigate('/discover')}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Icon name="Search" size={16} className="mr-2" />
                Найти ещё
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;