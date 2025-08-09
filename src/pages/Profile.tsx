import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// Импорты компонентов
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileBio from '@/components/profile/ProfileBio';
import ProfileInterests from '@/components/profile/ProfileInterests';
import ProfilePhotos from '@/components/profile/ProfilePhotos';
import EmptyState from '@/components/profile/EmptyState';
import LoadingState from '@/components/profile/LoadingState';

interface FormData {
  name: string;
  bio: string;
  age: number;
  interests: string[];
}

interface Stats {
  likes: number;
  matches: number;
  views: number;
  messages: number;
}

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(user);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    bio: '',
    age: 25,
    interests: [],
  });

  const [stats, setStats] = useState<Stats>({
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
    return <LoadingState />;
  }

  if (!currentUser) {
    return <EmptyState onAuth={handleAuth} />;
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
                  <ProfileHeader
                    user={currentUser}
                    isEditing={isEditing}
                    formData={formData}
                    setFormData={setFormData}
                    onEdit={() => setIsEditing(true)}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    variant="desktop"
                  />
                </CardContent>
              </Card>

              {/* Биография */}
              <ProfileBio
                user={currentUser}
                isEditing={isEditing}
                formData={formData}
                setFormData={setFormData}
                variant="desktop"
              />

              {/* Интересы */}
              <ProfileInterests
                user={currentUser}
                isEditing={isEditing}
                formData={formData}
                popularInterests={popularInterests}
                onToggleInterest={toggleInterest}
                variant="desktop"
              />
            </div>

            {/* Правая колонка - Статистика и дополнительная информация */}
            <div className="space-y-6">
              {/* Статистика */}
              <ProfileStats stats={stats} variant="desktop" />

              {/* Фотографии */}
              <ProfilePhotos user={currentUser} variant="desktop" />

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
                <ProfileHeader
                  user={currentUser}
                  isEditing={isEditing}
                  formData={formData}
                  setFormData={setFormData}
                  onEdit={() => setIsEditing(true)}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  variant="mobile"
                />
              </CardContent>
            </Card>

            {/* Bio Section */}
            <ProfileBio
              user={currentUser}
              isEditing={isEditing}
              formData={formData}
              setFormData={setFormData}
              variant="mobile"
            />

            {/* Interests */}
            <ProfileInterests
              user={currentUser}
              isEditing={isEditing}
              formData={formData}
              popularInterests={popularInterests}
              onToggleInterest={toggleInterest}
              variant="mobile"
            />

            {/* Stats */}
            <ProfileStats stats={stats} variant="mobile" />

            {/* Photos */}
            <ProfilePhotos user={currentUser} variant="mobile" />

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