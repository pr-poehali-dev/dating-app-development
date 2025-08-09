import { useState } from 'react';
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
    interests: user?.interests || []
  });

  const popularInterests = [
    'Путешествия', 'Музыка', 'Спорт', 'Кино', 'Книги', 'Готовка',
    'Танцы', 'Йога', 'Фотография', 'Искусство', 'Природа', 'Животные',
    'Технологии', 'Игры', 'Автомобили', 'Мода', 'Кафе', 'Театр'
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
                    <p className="text-gray-600 mb-2">
                      {user.age} лет • {user.location.city}
                    </p>
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
                      className="bg-love-DEFAULT hover:bg-love-dark text-white"
                    >
                      <Icon name="Edit" size={16} className="mr-2" />
                      Редактировать
                    </Button>
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
                <Icon name="BarChart" size={20} />
                Статистика
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Лайков получено:</span>
                <Badge variant="secondary">
                  <Icon name="Heart" size={12} className="mr-1" />
                  {Math.floor(Math.random() * 50) + 10}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Совпадений:</span>
                <Badge variant="secondary">
                  <Icon name="Users" size={12} className="mr-1" />
                  {JSON.parse(localStorage.getItem('matches') || '[]').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Просмотров профиля:</span>
                <Badge variant="secondary">
                  <Icon name="Eye" size={12} className="mr-1" />
                  {Math.floor(Math.random() * 100) + 25}
                </Badge>
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
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div
                    key={index}
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
              <p className="text-xs text-gray-500 mt-2 text-center">
                Добавьте до 6 фотографий
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;