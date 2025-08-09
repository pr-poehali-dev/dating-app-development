import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

const Profile = () => {
  const { user, updateProfile, login } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(user);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    age: 25,
    interests: [] as string[],
  });

  const [stats, setStats] = useState({
    likes: 0,
    matches: 0,
    views: 0,
    messages: 0
  });

  const popularInterests = [
    'Путешествия', 'Музыка', 'Спорт', 'Кино', 'Книги', 'Готовка',
    'Танцы', 'Йога', 'Фотография', 'Искусство', 'Природа', 'Животные',
    'Технологии', 'Игры', 'Автомобили', 'Мода', 'Кафе', 'Театр'
  ];

  // Создаем демо-пользователя если нет авторизованного
  useEffect(() => {
    const initializeUser = async () => {
      setIsLoading(true);
      
      if (user) {
        setCurrentUser(user);
        setFormData({
          name: user.name || '',
          bio: user.bio || '',
          age: user.age || 25,
          interests: user.interests || [],
        });
      } else {
        // Создаем демо-пользователя для показа
        const demoUser: User = {
          id: 'demo-user',
          name: 'Иван Петров',
          email: 'ivan@example.com',
          age: 28,
          bio: 'Разработчик из Москвы 💻 Люблю путешествия, кофе и интересные разговоры. В поисках серьёзных отношений и новых впечатлений ✨',
          photos: ['/img/4cf46a0e-c3f2-45b0-9806-3c40c852f7c0.jpg'],
          location: { lat: 55.7558, lng: 37.6176, city: 'Москва' },
          interests: ['Путешествия', 'Технологии', 'Кофе', 'Фотография', 'Спорт', 'Кино'],
          verified: true,
          subscription: 'premium',
          lastActive: new Date(),
          settings: {
            discoverable: true,
            ageRange: [22, 35],
            maxDistance: 30,
            showOnlineStatus: true
          }
        };
        setCurrentUser(demoUser);
        setFormData({
          name: demoUser.name,
          bio: demoUser.bio || '',
          age: demoUser.age,
          interests: demoUser.interests,
        });
      }
      
      // Загружаем статистику
      const matches = JSON.parse(localStorage.getItem('matches') || '[]');
      const profileViews = localStorage.getItem('profileViews') || '0';
      setStats({
        likes: Math.floor(Math.random() * 150) + 50,
        matches: matches.length + 12,
        views: parseInt(profileViews) + Math.floor(Math.random() * 200) + 80,
        messages: Math.floor(Math.random() * 40) + 15
      });
      
      setTimeout(() => setIsLoading(false), 800);
    };

    initializeUser();
  }, [user]);

  const handleSave = () => {
    if (user && updateProfile) {
      updateProfile(formData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        bio: currentUser.bio || '',
        age: currentUser.age || 25,
        interests: currentUser.interests || [],
      });
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleAuth = () => {
    navigate('/auth');
  };

  const handleLogout = () => {
    if (user) {
      navigate('/auth');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
            <Icon name="User" size={32} className="text-white" />
          </div>
          <p className="text-gray-600 font-medium">Загружаем профиль...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center">
            <Icon name="User" size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Войдите в свой профиль</h2>
          <p className="text-gray-600 mb-6">Создайте аккаунт или войдите, чтобы увидеть свой профиль</p>
          <Button onClick={handleAuth} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
            <Icon name="LogIn" size={20} className="mr-2" />
            Войти
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
          {/* Хедер */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Мой профиль
              </h1>
              <p className="text-gray-600 text-lg">Управляйте своим профилем знакомств</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/settings')}
                className="border-pink-200 hover:bg-pink-50"
              >
                <Icon name="Settings" size={20} className="mr-2" />
                Настройки
              </Button>
              {user ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="border-red-200 hover:bg-red-50 text-red-600">
                      <Icon name="LogOut" size={20} className="mr-2" />
                      Выйти
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Выйти из аккаунта?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Вы действительно хотите выйти из своего аккаунта?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>Выйти</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button onClick={handleAuth} className="bg-gradient-to-r from-pink-500 to-purple-600">
                  <Icon name="LogIn" size={20} className="mr-2" />
                  Войти
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Левая колонка - Основная информация */}
            <div className="xl:col-span-2 space-y-6">
              {/* Профиль */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-start gap-8">
                    <div className="relative">
                      <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center">
                        {currentUser.photos && currentUser.photos.length > 0 ? (
                          <img 
                            src={currentUser.photos[0]} 
                            alt={currentUser.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <Icon name="User" size={64} className="text-white" />
                        )}
                      </div>
                      {currentUser.verified && (
                        <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                          <Icon name="ShieldCheck" size={20} className="text-white" />
                        </div>
                      )}
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-pulse" />
                    </div>

                    <div className="flex-1">
                      {!isEditing ? (
                        <>
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold text-gray-900">{currentUser.name}</h2>
                            {currentUser.verified && (
                              <Icon name="BadgeCheck" size={28} className="text-blue-500" />
                            )}
                          </div>
                          <p className="text-xl text-gray-600 mb-4">{currentUser.age} лет • {currentUser.location.city}</p>
                          
                          <div className="flex items-center gap-3 mb-6">
                            <Badge 
                              variant={currentUser.subscription === 'premium' ? 'default' : 'secondary'}
                              className={cn(
                                "px-4 py-2 text-sm font-medium",
                                currentUser.subscription === 'premium' 
                                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" 
                                  : ""
                              )}
                            >
                              {currentUser.subscription === 'premium' ? (
                                <>
                                  <Icon name="Crown" size={16} className="mr-1" />
                                  Premium
                                </>
                              ) : (
                                'Базовый план'
                              )}
                            </Badge>
                            {currentUser.verified && (
                              <Badge className="bg-blue-500 text-white px-4 py-2">
                                <Icon name="ShieldCheck" size={16} className="mr-1" />
                                Верифицирован
                              </Badge>
                            )}
                            <Badge className="bg-green-500 text-white px-4 py-2">
                              <Icon name="Wifi" size={16} className="mr-1" />
                              Онлайн
                            </Badge>
                          </div>

                          <Button 
                            onClick={() => setIsEditing(true)}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                          >
                            <Icon name="Edit" size={18} className="mr-2" />
                            Редактировать профиль
                          </Button>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name" className="text-base font-medium">Имя</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              className="mt-2 h-12"
                            />
                          </div>
                          <div>
                            <Label htmlFor="age" className="text-base font-medium">Возраст: {formData.age} лет</Label>
                            <Slider
                              value={[formData.age]}
                              onValueChange={([value]) => setFormData(prev => ({ ...prev, age: value }))}
                              min={18}
                              max={60}
                              step={1}
                              className="mt-3"
                            />
                          </div>
                          <div className="flex gap-3 pt-4">
                            <Button 
                              onClick={handleSave}
                              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                            >
                              <Icon name="Save" size={18} className="mr-2" />
                              Сохранить
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={handleCancel}
                              className="flex-1 border-gray-300"
                            >
                              <Icon name="X" size={18} className="mr-2" />
                              Отмена
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Биография */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Icon name="FileText" size={24} className="text-pink-500" />
                    О себе
                  </h3>
                  {!isEditing ? (
                    <div className="text-gray-700 text-lg leading-relaxed">
                      {currentUser.bio || 'Пользователь пока не рассказал о себе...'}
                    </div>
                  ) : (
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Расскажите о себе..."
                      className="min-h-[120px] text-base"
                    />
                  )}
                </CardContent>
              </Card>

              {/* Интересы */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <Icon name="Heart" size={24} className="text-pink-500" />
                    Интересы
                  </h3>
                  {!isEditing ? (
                    <div className="flex flex-wrap gap-3">
                      {currentUser.interests.map((interest, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="px-4 py-2 text-sm bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border-purple-200"
                        >
                          {interest}
                        </Badge>
                      ))}
                      {currentUser.interests.length === 0 && (
                        <p className="text-gray-500 text-lg">Интересы не указаны</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-600">
                        Выберите интересы, которые вас описывают:
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {popularInterests.map((interest) => (
                          <Badge
                            key={interest}
                            variant={formData.interests.includes(interest) ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer transition-all duration-200 px-4 py-2 text-sm",
                              formData.interests.includes(interest)
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
                                : 'hover:bg-gray-100'
                            )}
                            onClick={() => toggleInterest(interest)}
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Правая колонка - Статистика и дополнительная информация */}
            <div className="space-y-6">
              {/* Статистика */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Icon name="TrendingUp" size={20} className="text-green-500" />
                    Статистика
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Icon name="Heart" size={20} className="text-pink-500" />
                        <span className="font-medium">Лайки</span>
                      </div>
                      <div className="text-2xl font-bold text-pink-600">{stats.likes}</div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Icon name="Users" size={20} className="text-blue-500" />
                        <span className="font-medium">Совпадения</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{stats.matches}</div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Icon name="Eye" size={20} className="text-green-500" />
                        <span className="font-medium">Просмотры</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{stats.views}</div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Icon name="MessageCircle" size={20} className="text-purple-500" />
                        <span className="font-medium">Сообщения</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{stats.messages}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Фотографии */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Icon name="Camera" size={20} className="text-purple-500" />
                    Фотографии
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-xl flex items-center justify-center">
                      {currentUser.photos?.[0] ? (
                        <img 
                          src={currentUser.photos[0]} 
                          alt="Profile"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Icon name="User" size={32} className="text-gray-600" />
                      )}
                    </div>
                    <div className="aspect-square bg-gradient-to-br from-blue-200 to-cyan-200 rounded-xl flex items-center justify-center">
                      <Icon name="Plus" size={24} className="text-gray-600" />
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Icon name="Upload" size={16} className="mr-2" />
                    Добавить фото
                  </Button>
                </CardContent>
              </Card>

              {/* Premium блок */}
              {currentUser.subscription !== 'premium' && (
                <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 border-0 shadow-xl text-white">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Icon name="Crown" size={32} className="mx-auto mb-3" />
                      <h3 className="text-xl font-bold mb-2">Получите Premium</h3>
                      <p className="text-sm opacity-90 mb-4">
                        Больше лайков, супер-лайки и дополнительные возможности
                      </p>
                      <Button className="w-full bg-white text-orange-600 hover:bg-gray-100">
                        Подключить Premium
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Мобильная версия */}
      <div className="lg:hidden min-h-screen p-4 pb-24">
        <div className="max-w-md mx-auto pt-safe">
          <div className="flex items-center justify-between mb-6 pt-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Профиль
            </h1>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/settings')}
                className="text-gray-600 hover:bg-gray-100"
              >
                <Icon name="Settings" size={20} />
              </Button>
              {user ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:bg-gray-100"
                    >
                      <Icon name="LogOut" size={20} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Выйти из аккаунта?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Вы действительно хотите выйти из своего аккаунта?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>
                        Выйти
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAuth}
                  className="text-pink-600 hover:bg-pink-50"
                >
                  <Icon name="LogIn" size={20} />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Profile Header */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      {currentUser.photos && currentUser.photos.length > 0 ? (
                        <img 
                          src={currentUser.photos[0]} 
                          alt={currentUser.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <Icon name="User" size={36} className="text-white" />
                      )}
                    </div>
                    {currentUser.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-2">
                        <Icon name="ShieldCheck" size={14} className="text-white" />
                      </div>
                    )}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                  </div>
                  
                  {!isEditing ? (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {currentUser.name}
                      </h2>
                      <p className="text-gray-600 mb-3">{currentUser.age} лет • {currentUser.location.city}</p>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Badge 
                          variant={currentUser.subscription === 'premium' ? 'default' : 'secondary'}
                          className={cn(
                            currentUser.subscription === 'premium' 
                              ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" 
                              : ""
                          )}
                        >
                          {currentUser.subscription === 'premium' ? (
                            <>
                              <Icon name="Crown" size={12} className="mr-1" />
                              Premium
                            </>
                          ) : (
                            'Базовый'
                          )}
                        </Badge>
                        {currentUser.verified && (
                          <Badge className="bg-blue-500">
                            <Icon name="ShieldCheck" size={12} className="mr-1" />
                            Верифицирован
                          </Badge>
                        )}
                      </div>
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      >
                        <Icon name="Edit" size={16} className="mr-2" />
                        Редактировать
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Имя</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="age">Возраст: {formData.age}</Label>
                        <Slider
                          value={[formData.age]}
                          onValueChange={([value]) => setFormData(prev => ({ ...prev, age: value }))}
                          min={18}
                          max={60}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSave}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          <Icon name="Save" size={16} className="mr-2" />
                          Сохранить
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={handleCancel}
                          className="flex-1"
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bio Section */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon name="FileText" size={18} className="text-pink-500" />
                  О себе
                </h3>
                {!isEditing ? (
                  <p className="text-gray-700 leading-relaxed">
                    {currentUser.bio || 'Пользователь пока не рассказал о себе...'}
                  </p>
                ) : (
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Расскажите о себе..."
                    className="min-h-[100px]"
                  />
                )}
              </CardContent>
            </Card>

            {/* Interests */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon name="Heart" size={18} className="text-pink-500" />
                  Интересы
                </h3>
                {!isEditing ? (
                  <div className="flex flex-wrap gap-2">
                    {currentUser.interests.map((interest, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border-purple-200"
                      >
                        {interest}
                      </Badge>
                    ))}
                    {currentUser.interests.length === 0 && (
                      <p className="text-gray-500">Интересы не указаны</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Выберите интересы, которые вас описывают:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {popularInterests.map((interest) => (
                        <Badge
                          key={interest}
                          variant={formData.interests.includes(interest) ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer transition-colors",
                            formData.interests.includes(interest)
                              ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
                              : 'hover:bg-gray-100'
                          )}
                          onClick={() => toggleInterest(interest)}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon name="TrendingUp" size={18} className="text-green-500" />
                  Статистика
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-pink-50 rounded-lg">
                    <Icon name="Heart" size={20} className="text-pink-500 mx-auto mb-1" />
                    <div className="font-bold text-lg text-pink-600">{stats.likes}</div>
                    <div className="text-xs text-gray-600">Лайков</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Icon name="Users" size={20} className="text-blue-500 mx-auto mb-1" />
                    <div className="font-bold text-lg text-blue-600">{stats.matches}</div>
                    <div className="text-xs text-gray-600">Совпадений</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Icon name="Eye" size={20} className="text-green-500 mx-auto mb-1" />
                    <div className="font-bold text-lg text-green-600">{stats.views}</div>
                    <div className="text-xs text-gray-600">Просмотров</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Icon name="MessageCircle" size={20} className="text-purple-500 mx-auto mb-1" />
                    <div className="font-bold text-lg text-purple-600">{stats.messages}</div>
                    <div className="text-xs text-gray-600">Сообщений</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photos */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon name="Camera" size={18} className="text-purple-500" />
                  Фотографии
                </h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center">
                    {currentUser.photos?.[0] ? (
                      <img 
                        src={currentUser.photos[0]} 
                        alt="Profile"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Icon name="User" size={28} className="text-gray-600" />
                    )}
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-blue-200 to-cyan-200 rounded-lg flex items-center justify-center">
                    <Icon name="Plus" size={24} className="text-gray-600" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-green-200 to-emerald-200 rounded-lg flex items-center justify-center">
                    <Icon name="Heart" size={24} className="text-gray-600" />
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Icon name="Upload" size={16} className="mr-2" />
                  Добавить фотографии
                </Button>
              </CardContent>
            </Card>

            {/* Premium для мобильной версии */}
            {currentUser.subscription !== 'premium' && (
              <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 border-0 shadow-lg text-white">
                <CardContent className="p-6 text-center">
                  <Icon name="Crown" size={24} className="mx-auto mb-3" />
                  <h3 className="text-lg font-bold mb-2">Получите Premium</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Больше возможностей для знакомств
                  </p>
                  <Button className="w-full bg-white text-orange-600 hover:bg-gray-100">
                    Подключить Premium
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;