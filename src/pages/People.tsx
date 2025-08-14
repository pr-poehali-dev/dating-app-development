import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface User {
  id: string;
  name: string;
  age: number;
  location: string;
  photo: string;
  bio: string;
  interests: string[];
  isOnline: boolean;
  lastSeen?: string;
  verified?: boolean;
}

const People = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const demoUsers: User[] = [
    {
      id: '1',
      name: 'Ольга',
      age: 36,
      location: 'Екатеринбург',
      photo: 'https://cdn.poehali.dev/files/a8633799-0bfc-4c85-925c-dfbfeff38e24.png',
      bio: 'Люблю природу, путешествия и новые знакомства. Ищу серьёзные отношения.',
      interests: ['Путешествия', 'Спорт', 'Кулинария'],
      isOnline: true,
      verified: true
    },
    {
      id: '2',
      name: 'Анна',
      age: 28,
      location: 'Москва',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      bio: 'Творческая личность, люблю искусство и театр. Ищу единомышленника для совместного развития.',
      interests: ['Искусство', 'Театр', 'Музыка'],
      isOnline: false,
      lastSeen: '2 часа назад',
      verified: true
    },
    {
      id: '3',
      name: 'Мария',
      age: 32,
      location: 'Санкт-Петербург',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b9d9e8da?w=400&h=400&fit=crop&crop=face',
      bio: 'Активная жизненная позиция, занимаюсь спортом и веду здоровый образ жизни.',
      interests: ['Спорт', 'Здоровье', 'Йога'],
      isOnline: true
    },
    {
      id: '4',
      name: 'Елена',
      age: 29,
      location: 'Новосибирск',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      bio: 'Путешественница со стажем, изучаю культуры мира. Ищу спутника для новых приключений.',
      interests: ['Путешествия', 'Культура', 'Языки'],
      isOnline: false,
      lastSeen: '5 минут назад',
      verified: true
    },
    {
      id: '5',
      name: 'Дарья',
      age: 26,
      location: 'Казань',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
      bio: 'IT-специалист, увлекаюсь технологиями и инновациями. В свободное время читаю книги.',
      interests: ['Технологии', 'Книги', 'Наука'],
      isOnline: true
    },
    {
      id: '6',
      name: 'Виктория',
      age: 31,
      location: 'Краснодар',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
      bio: 'Люблю готовить и экспериментировать с кухнями мира. Мечтаю найти человека для семьи.',
      interests: ['Кулинария', 'Семья', 'Дом'],
      isOnline: false,
      lastSeen: '1 день назад'
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setUsers(demoUsers);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.interests.some(interest => 
                           interest.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'online' && user.isOnline) ||
                         (selectedFilter === 'verified' && user.verified);
    
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 pt-20 pb-24 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded-lg w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6">
                  <div className="w-full h-48 bg-gray-300 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 pt-20 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Люди на NoumiDating
          </h1>
          <p className="text-gray-600 text-lg">
            Познакомьтесь с {users.length} активными пользователями
          </p>
        </div>

        {/* Поиск и фильтры */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <input
              type="text"
              placeholder="Поиск по имени, городу или интересам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-love-DEFAULT focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('all')}
              className={selectedFilter === 'all' ? 'bg-love-DEFAULT' : ''}
            >
              Все ({users.length})
            </Button>
            <Button
              variant={selectedFilter === 'online' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('online')}
              className={selectedFilter === 'online' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Онлайн ({users.filter(u => u.isOnline).length})
            </Button>
            <Button
              variant={selectedFilter === 'verified' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('verified')}
              className={selectedFilter === 'verified' ? 'bg-blue-500 hover:bg-blue-600' : ''}
            >
              <Icon name="BadgeCheck" size={16} className="mr-2" />
              Верифицированные ({users.filter(u => u.verified).length})
            </Button>
          </div>
        </div>

        {/* Сетка пользователей */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <Card 
                key={user.id}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
              >
                <CardContent className="p-0">
                  <Link to={`/user/${user.id}`} className="block">
                    {/* Фото */}
                    <div className="relative">
                      <img
                        src={user.photo}
                        alt={user.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Статус онлайн */}
                      <div className="absolute top-3 left-3">
                        {user.isOnline ? (
                          <div className="flex items-center bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                            Онлайн
                          </div>
                        ) : (
                          <div className="bg-gray-500/80 text-white px-2 py-1 rounded-full text-xs">
                            {user.lastSeen || 'Был недавно'}
                          </div>
                        )}
                      </div>

                      {/* Верификация */}
                      {user.verified && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-blue-500 p-1 rounded-full">
                            <Icon name="BadgeCheck" size={16} className="text-white" />
                          </div>
                        </div>
                      )}

                      {/* Градиент снизу */}
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
                      
                      {/* Имя и возраст поверх фото */}
                      <div className="absolute bottom-3 left-3 text-white">
                        <h3 className="text-xl font-bold">{user.name}, {user.age}</h3>
                        <div className="flex items-center text-sm opacity-90">
                          <Icon name="MapPin" size={14} className="mr-1" />
                          {user.location}
                        </div>
                      </div>
                    </div>

                    {/* Информация */}
                    <div className="p-4">
                      {/* Биография */}
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {user.bio}
                      </p>

                      {/* Интересы */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {user.interests.slice(0, 3).map((interest, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-love-light text-love-DEFAULT rounded-full text-xs font-medium"
                          >
                            {interest}
                          </span>
                        ))}
                        {user.interests.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{user.interests.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Кнопки действий */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-love-DEFAULT hover:bg-love-dark"
                          onClick={(e) => {
                            e.preventDefault();
                            // Логика отправки лайка
                          }}
                        >
                          <Icon name="Heart" size={16} className="mr-2" />
                          Лайк
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 border-love-DEFAULT text-love-DEFAULT hover:bg-love-light"
                          onClick={(e) => {
                            e.preventDefault();
                            // Логика отправки сообщения
                          }}
                        >
                          <Icon name="MessageCircle" size={16} className="mr-2" />
                          Написать
                        </Button>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Icon name="Users" size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Никого не найдено
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Попробуйте изменить параметры поиска или фильтры
            </p>
            <Button 
              className="mt-4 bg-love-DEFAULT" 
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default People;