import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

export default function ProfileWeb() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    age: user?.age || 18,
    interests: user?.interests || [],
    height: user?.height || 170,
    job: user?.job || '',
  });

  const [stats, setStats] = useState({
    likes: 0,
    matches: 0,
    views: 0,
    messages: 0
  });

  useEffect(() => {
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    setStats({
      likes: Math.floor(Math.random() * 50) + 15,
      matches: matches.length,
      views: Math.floor(Math.random() * 100) + 25,
      messages: Math.floor(Math.random() * 20) + 5
    });
  }, []);

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                {/* Avatar & Basic Info */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gradient-to-br from-love-light to-love-DEFAULT rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="User" size={60} className="text-white" />
                    </div>
                    {user.verified && (
                      <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-3">
                        <Icon name="Shield" size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {user.name}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {user.age} лет • {user.location || 'Москва'}
                  </p>
                  {user.job && <p className="text-sm text-gray-500 mb-4">💼 {user.job}</p>}
                  
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
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full bg-love-DEFAULT hover:bg-love-dark"
                  >
                    <Icon name="Edit" size={16} className="mr-2" />
                    {isEditing ? 'Отменить' : 'Редактировать профиль'}
                  </Button>
                </div>

                {/* Statistics */}
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
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="User" size={20} />
                  О себе
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isEditing ? (
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {user.bio || 'Пользователь пока не рассказал о себе...'}
                  </p>
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

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Heart" size={20} />
                  Интересы
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isEditing ? (
                  <div className="flex flex-wrap gap-3">
                    {user.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="px-4 py-2 text-sm">
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
                    <div className="flex flex-wrap gap-3">
                      {popularInterests.map((interest) => (
                        <Badge
                          key={interest}
                          variant={formData.interests.includes(interest) ? "default" : "outline"}
                          className={`cursor-pointer transition-colors px-4 py-2 ${
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

            {/* Edit Form */}
            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Settings" size={20} />
                    Редактирование профиля
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
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
                      <Label htmlFor="job">Профессия</Label>
                      <Input
                        id="job"
                        value={formData.job}
                        onChange={(e) => setFormData(prev => ({ ...prev, job: e.target.value }))}
                        placeholder="Ваша профессия"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="age">Возраст: {formData.age}</Label>
                      <Slider
                        value={[formData.age]}
                        onValueChange={([value]) => setFormData(prev => ({ ...prev, age: value }))}
                        min={18}
                        max={60}
                        step={1}
                        className="mt-3"
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
                        className="mt-3"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleSave}
                      className="bg-love-DEFAULT hover:bg-love-dark"
                    >
                      <Icon name="Save" size={16} className="mr-2" />
                      Сохранить изменения
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Отмена
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Camera" size={20} />
                  Фотографии
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {/* Sample photos */}
                  <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center">
                    <Icon name="User" size={32} className="text-gray-600" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-blue-200 to-cyan-200 rounded-lg flex items-center justify-center">
                    <Icon name="Camera" size={24} className="text-gray-600" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-green-200 to-emerald-200 rounded-lg flex items-center justify-center">
                    <Icon name="Heart" size={24} className="text-gray-600" />
                  </div>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-love-DEFAULT transition-colors cursor-pointer group"
                    >
                      <Icon 
                        name="Plus" 
                        size={32} 
                        className="text-gray-400 group-hover:text-love-DEFAULT" 
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Добавьте до 6 качественных фотографий для лучшего результата
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}