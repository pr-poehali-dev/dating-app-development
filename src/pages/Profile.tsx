import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        age: user.age || 18,
        interests: user.interests || [],
      });
    }
  }, [user]);

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        age: user.age || 18,
        interests: user.interests || [],
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
          {/* Profile Header */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-love-light to-love-DEFAULT rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon name="User" size={36} className="text-white" />
                  </div>
                  {user.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-2">
                      <Icon name="Shield" size={14} className="text-white" />
                    </div>
                  )}
                </div>
                
                {!isEditing ? (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {user.name}
                    </h2>
                    <p className="text-gray-600 mb-3">{user.age} лет</p>
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
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-love-DEFAULT hover:bg-love-dark"
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
                        className="flex-1 bg-love-DEFAULT hover:bg-love-dark"
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
                <Icon name="User" size={18} />
                О себе
              </h3>
              {!isEditing ? (
                <p className="text-gray-700 leading-relaxed">
                  {user.bio || 'Пользователь пока не рассказал о себе...'}
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
                <Icon name="Heart" size={18} />
                Интересы
              </h3>
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
                <div className="space-y-3">
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
                            ? 'bg-love-DEFAULT hover:bg-love-dark text-white'
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

          {/* Stats */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="TrendingUp" size={18} />
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
                <Icon name="Camera" size={18} />
                Фотографии
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center">
                  <Icon name="User" size={28} className="text-gray-600" />
                </div>
                <div className="aspect-square bg-gradient-to-br from-blue-200 to-cyan-200 rounded-lg flex items-center justify-center">
                  <Icon name="Camera" size={24} className="text-gray-600" />
                </div>
                <div className="aspect-square bg-gradient-to-br from-green-200 to-emerald-200 rounded-lg flex items-center justify-center">
                  <Icon name="Heart" size={24} className="text-gray-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3 text-center">
                Добавьте качественные фотографии для лучшего результата
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;