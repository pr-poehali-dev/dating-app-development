import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    age: user?.age || 18,
    interests: user?.interests || [],
    height: user?.height || 170,
    education: user?.education || '',
    job: user?.job || '',
    zodiac: user?.zodiac || '',
    smoking: user?.smoking || 'never',
    drinking: user?.drinking || 'socially'
  });

  const [stats, setStats] = useState({
    likes: 0,
    matches: 0,
    views: 0,
    messages: 0
  });

  useEffect(() => {
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    const profileViews = localStorage.getItem('profileViews') || '0';
    setStats({
      likes: Math.floor(Math.random() * 50) + 15,
      matches: matches.length,
      views: parseInt(profileViews) + Math.floor(Math.random() * 25) + 10,
      messages: Math.floor(Math.random() * 20) + 5
    });
  }, []);

  const popularInterests = [
    'Путешествия', 'Музыка', 'Спорт', 'Кино', 'Книги', 'Готовка',
    'Танцы', 'Йога', 'Фотография', 'Искусство', 'Природа', 'Животные',
    'Технологии', 'Игры', 'Автомобили', 'Мода', 'Кафе', 'Театр',
    'Винтаж', 'Психология', 'Медитация', 'Бег', 'Велоспорт', 'Плавание'
  ];

  const zodiacSigns = [
    'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
    'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
  ];

  const educationLevels = [
    'Среднее', 'Среднее специальное', 'Неоконченное высшее', 
    'Высшее', 'Два высших', 'Кандидат наук', 'Доктор наук'
  ];

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-light to-love-dark p-4 pb-24">
      <div className="max-w-md mx-auto pt-safe">
        <div className="flex items-center justify-between mb-6 pt-4">
          <h1 className="text-2xl font-bold text-white">Профиль</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              className="text-white hover:bg-white/10"
            >
              <Icon name="Settings" size={20} />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
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
          </div>
        </div>

        <div className="space-y-4">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-love-light to-love-DEFAULT rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="User" size={40} className="text-white" />
                  </div>
                  {user.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                      <Icon name="Shield" size={16} className="text-white" />
                    </div>
                  )}
                </div>
                
                {!isEditing ? (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {user.name}
                    </h2>
                    <div className="text-gray-600 mb-2 space-y-1">
                      <p>{user.age} лет • {typeof user.location === 'string' ? user.location : user.location?.city}</p>
                      {user.job && <p className="text-sm">💼 {user.job}</p>}
                      {user.education && <p className="text-sm">🎓 {user.education}</p>}
                      {user.height && <p className="text-sm">📏 {user.height} см</p>}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Badge variant={user.subscription === 'premium' ? 'default' : 'secondary'}>
                        {user.subscription === 'premium' ? 'Premium' : 'Базовый'}
                      </Badge>
                      {user.verified && (
                        <Badge className="bg-blue-500">
                          <Icon name="Shield" size={12} className="mr-1" />
                          Верифицирован
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="bg-love-DEFAULT hover:bg-love-dark text-white"
                      >
                        <Icon name="Edit" size={16} className="mr-2" />
                        Редактировать
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          const url = window.location.origin + '/profile/' + user.id;
                          navigator.clipboard.writeText(url);
                        }}
                      >
                        <Icon name="Share" size={16} className="mr-2" />
                        Поделиться
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Имя</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                    <div>
                      <Label htmlFor="job">Профессия</Label>
                      <Input
                        id="job"
                        value={formData.job}
                        onChange={(e) => setFormData(prev => ({ ...prev, job: e.target.value }))}
                        placeholder="Ваша профессия"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Рост: {formData.height} см</Label>
                      <Slider
                        value={[formData.height]}
                        onValueChange={([value]) => setFormData(prev => ({ ...prev, height: value }))}
                        min={140}
                        max={220}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSave}
                        className="bg-love-DEFAULT hover:bg-love-dark text-white"
                      >
                        Сохранить
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user.name,
                            bio: user.bio,
                            age: user.age,
                            interests: user.interests
                          });
                        }}
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="User" size={20} />
                О себе
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <p className="text-gray-700">
                  {user.bio || 'Расскажите о себе...'}
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

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Heart" size={20} />
                Интересы
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                  {user.interests.length === 0 && (
                    <p className="text-gray-500">Интересы не указаны</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Выберите интересы, которые вас описывают:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {popularInterests.map((interest) => (
                      <Badge
                        key={interest}
                        variant={formData.interests.includes(interest) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          formData.interests.includes(interest)
                            ? 'bg-love-DEFAULT hover:bg-love-dark'
                            : 'hover:bg-gray-100'
                        }`}
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

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Info" size={20} />
                Дополнительно
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {user.zodiac && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <span className="mr-2">♈</span>Знак зодиака:
                    </span>
                    <Badge variant="outline">{user.zodiac}</Badge>
                  </div>
                )}
                {user.smoking && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Icon name="Cigarette" size={16} className="mr-2" />Курение:
                    </span>
                    <Badge variant="outline">
                      {user.smoking === 'never' ? 'Не курю' : 
                       user.smoking === 'sometimes' ? 'Иногда' : 'Часто'}
                    </Badge>
                  </div>
                )}
                {user.drinking && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Icon name="Wine" size={16} className="mr-2" />Алкоголь:
                    </span>
                    <Badge variant="outline">
                      {user.drinking === 'never' ? 'Не пью' : 
                       user.drinking === 'socially' ? 'В компании' : 'Часто'}
                    </Badge>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Icon name="Calendar" size={16} className="mr-2" />Последняя активность:
                  </span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Сейчас онлайн
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Icon name="MapPin" size={16} className="mr-2" />Расстояние:
                  </span>
                  <Badge variant="outline">
                    {Math.floor(Math.random() * 10) + 1} км от вас
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="BarChart" size={20} />
                Статистика
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-pink-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Icon name="Heart" size={16} className="text-pink-500 mr-1" />
                    <span className="font-bold text-lg text-pink-600">{stats.likes}</span>
                  </div>
                  <span className="text-xs text-gray-600">Лайков</span>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Icon name="Users" size={16} className="text-blue-500 mr-1" />
                    <span className="font-bold text-lg text-blue-600">{stats.matches}</span>
                  </div>
                  <span className="text-xs text-gray-600">Совпадений</span>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Icon name="Eye" size={16} className="text-green-500 mr-1" />
                    <span className="font-bold text-lg text-green-600">{stats.views}</span>
                  </div>
                  <span className="text-xs text-gray-600">Просмотров</span>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Icon name="MessageCircle" size={16} className="text-purple-500 mr-1" />
                    <span className="font-bold text-lg text-purple-600">{stats.messages}</span>
                  </div>
                  <span className="text-xs text-gray-600">Сообщений</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Camera" size={20} />
                Фотографии
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {user?.photos && user.photos.length > 0 ? (
                  user.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-cover bg-center rounded-lg border-2 border-transparent hover:border-love-DEFAULT transition-colors cursor-pointer"
                      style={{ backgroundImage: `url(${photo})` }}
                    />
                  ))
                ) : (
                  <>
                    <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center">
                      <Icon name="User" size={24} className="text-gray-600" />
                    </div>
                    <div className="aspect-square bg-gradient-to-br from-blue-200 to-cyan-200 rounded-lg flex items-center justify-center">
                      <Icon name="Camera" size={20} className="text-gray-600" />
                    </div>
                    <div className="aspect-square bg-gradient-to-br from-green-200 to-emerald-200 rounded-lg flex items-center justify-center">
                      <Icon name="Heart" size={20} className="text-gray-600" />
                    </div>
                  </>
                )}
                {Array.from({ length: Math.max(0, 6 - (user?.photos?.length || 3)) }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-love-DEFAULT transition-colors cursor-pointer group"
                  >
                    <Icon 
                      name="Plus" 
                      size={24} 
                      className="text-gray-400 group-hover:text-love-DEFAULT" 
                    />
                  </div>
                ))}
              </div>
              <div className="text-center space-y-2">
                <p className="text-xs text-gray-500">
                  Добавьте до 6 фотографий для лучшего результата
                </p>
                <div className="flex justify-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Icon name="Star" size={12} className="mr-1" />
                    Главное фото
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <Icon name="Eye" size={12} className="mr-1" />
                    {Math.floor(Math.random() * 50) + 20} просмотров
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Icon name="Lightbulb" size={20} />
                Советы для профиля
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${user?.bio ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm text-gray-700">Добавьте интересное описание</span>
                {user?.bio && <Badge variant="secondary" className="text-xs">✓</Badge>}
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${user?.interests?.length >= 3 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm text-gray-700">Укажите минимум 3 интереса</span>
                {user?.interests?.length >= 3 && <Badge variant="secondary" className="text-xs">✓</Badge>}
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${user?.photos?.length >= 2 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm text-gray-700">Загрузите несколько фотографий</span>
                {user?.photos?.length >= 2 && <Badge variant="secondary" className="text-xs">✓</Badge>}
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${user?.verified ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm text-gray-700">Подтвердите профиль</span>
                {user?.verified && <Badge variant="secondary" className="text-xs">✓</Badge>}
              </div>
              
              <div className="mt-4 p-3 bg-white/70 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-700">Полнота профиля</span>
                  <span className="text-sm font-bold text-purple-700">
                    {Math.round(
                      ((user?.bio ? 1 : 0) + 
                       (user?.interests?.length >= 3 ? 1 : 0) + 
                       (user?.photos?.length >= 2 ? 1 : 0) + 
                       (user?.verified ? 1 : 0)) / 4 * 100
                    )}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.round(
                        ((user?.bio ? 1 : 0) + 
                         (user?.interests?.length >= 3 ? 1 : 0) + 
                         (user?.photos?.length >= 2 ? 1 : 0) + 
                         (user?.verified ? 1 : 0)) / 4 * 100
                      )}%` 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;