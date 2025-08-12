import { useState } from 'react';
import { User } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface ProfileEditFormProps {
  user: User;
  onSave: (updatedData: Partial<User>) => void;
  onCancel: () => void;
  variant?: 'desktop' | 'mobile';
}

const ProfileEditForm = ({ user, onSave, onCancel, variant = 'mobile' }: ProfileEditFormProps) => {
  const isDesktop = variant === 'desktop';
  
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    age: user.age || 25,
    height: user.height || 170,
    weight: user.weight || 65,
    bodyType: user.bodyType || '',
    hairColor: user.hairColor || '',
    eyeColor: user.eyeColor || '',
    zodiac: user.zodiac || '',
    smoking: user.smoking || '',
    drinking: user.drinking || '',
    diet: user.diet || '',
    religion: user.religion || '',
    education: user.education || '',
    work: user.work || '',
    income: user.income || '',
    relationship: user.relationship || '',
    children: user.children || '',
    wantChildren: user.wantChildren || '',
    pets: user.pets || '',
    lookingFor: user.lookingFor || '',
    travelStyle: user.travelStyle || '',
    languages: user.languages || [],
    personality: user.personality || []
  });

  const handleSave = () => {
    onSave(formData);
  };

  const handleLanguageChange = (value: string) => {
    const languages = value.split(',').map(l => l.trim()).filter(l => l);
    setFormData(prev => ({ ...prev, languages }));
  };

  const handlePersonalityChange = (value: string) => {
    const personality = value.split(',').map(p => p.trim()).filter(p => p);
    setFormData(prev => ({ ...prev, personality }));
  };

  return (
    <Card className={`bg-white/95 backdrop-blur-sm border-0 ${isDesktop ? 'shadow-xl' : 'shadow-lg'}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isDesktop ? 'text-xl' : 'text-lg'}`}>
          <Icon name="Edit" size={isDesktop ? 20 : 18} className="text-purple-500" />
          Редактировать профиль
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Основная информация */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Основная информация</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ваше имя"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Возраст</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                placeholder="25"
                min="18"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Рост (см)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                placeholder="170"
                min="140"
                max="220"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bodyType">Телосложение</Label>
              <Select value={formData.bodyType} onValueChange={(value) => setFormData(prev => ({ ...prev, bodyType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип телосложения" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slim">Стройное</SelectItem>
                  <SelectItem value="athletic">Спортивное</SelectItem>
                  <SelectItem value="average">Среднее</SelectItem>
                  <SelectItem value="curvy">Пышное</SelectItem>
                  <SelectItem value="large">Крупное</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zodiac">Знак зодиака</Label>
              <Select value={formData.zodiac} onValueChange={(value) => setFormData(prev => ({ ...prev, zodiac: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите знак зодиака" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aries">♈ Овен</SelectItem>
                  <SelectItem value="taurus">♉ Телец</SelectItem>
                  <SelectItem value="gemini">♊ Близнецы</SelectItem>
                  <SelectItem value="cancer">♋ Рак</SelectItem>
                  <SelectItem value="leo">♌ Лев</SelectItem>
                  <SelectItem value="virgo">♍ Дева</SelectItem>
                  <SelectItem value="libra">♎ Весы</SelectItem>
                  <SelectItem value="scorpio">♏ Скорпион</SelectItem>
                  <SelectItem value="sagittarius">♐ Стрелец</SelectItem>
                  <SelectItem value="capricorn">♑ Козерог</SelectItem>
                  <SelectItem value="aquarius">♒ Водолей</SelectItem>
                  <SelectItem value="pisces">♓ Рыбы</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Образование</Label>
              <Select value={formData.education} onValueChange={(value) => setFormData(prev => ({ ...prev, education: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Уровень образования" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school">Среднее</SelectItem>
                  <SelectItem value="college">Среднее специальное</SelectItem>
                  <SelectItem value="bachelor">Бакалавриат</SelectItem>
                  <SelectItem value="master">Магистратура</SelectItem>
                  <SelectItem value="phd">Кандидат наук</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">О себе</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Расскажите о себе..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="work">Работа</Label>
            <Input
              id="work"
              value={formData.work}
              onChange={(e) => setFormData(prev => ({ ...prev, work: e.target.value }))}
              placeholder="Где работаете или чем занимаетесь"
            />
          </div>
        </div>

        {/* Образ жизни */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Образ жизни</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Курение</Label>
              <Select value={formData.smoking} onValueChange={(value) => setFormData(prev => ({ ...prev, smoking: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Отношение к курению" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Не курю</SelectItem>
                  <SelectItem value="sometimes">Иногда</SelectItem>
                  <SelectItem value="often">Часто</SelectItem>
                  <SelectItem value="socially">В компании</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Алкоголь</Label>
              <Select value={formData.drinking} onValueChange={(value) => setFormData(prev => ({ ...prev, drinking: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Отношение к алкоголю" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Не пью</SelectItem>
                  <SelectItem value="rarely">Редко</SelectItem>
                  <SelectItem value="socially">В компании</SelectItem>
                  <SelectItem value="often">Часто</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Животные</Label>
              <Select value={formData.pets} onValueChange={(value) => setFormData(prev => ({ ...prev, pets: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Отношение к животным" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Нет</SelectItem>
                  <SelectItem value="have_dogs">Есть собака</SelectItem>
                  <SelectItem value="have_cats">Есть кот</SelectItem>
                  <SelectItem value="have_other">Есть другие</SelectItem>
                  <SelectItem value="love_all">Люблю всех</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ищу</Label>
              <Select value={formData.lookingFor} onValueChange={(value) => setFormData(prev => ({ ...prev, lookingFor: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Цель знакомства" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Общение</SelectItem>
                  <SelectItem value="serious">Серьёзные отношения</SelectItem>
                  <SelectItem value="friendship">Дружба</SelectItem>
                  <SelectItem value="marriage">Брак</SelectItem>
                  <SelectItem value="activity_partner">Партнёр по интересам</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Семья */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Семья и дети</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Дети</Label>
              <Select value={formData.children} onValueChange={(value) => setFormData(prev => ({ ...prev, children: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Есть ли дети" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Нет детей</SelectItem>
                  <SelectItem value="have">Есть дети</SelectItem>
                  <SelectItem value="want">Хочу детей</SelectItem>
                  <SelectItem value="dont_want">Не хочу детей</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Планирую детей</Label>
              <Select value={formData.wantChildren} onValueChange={(value) => setFormData(prev => ({ ...prev, wantChildren: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Планы на детей" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Да</SelectItem>
                  <SelectItem value="no">Нет</SelectItem>
                  <SelectItem value="maybe">Возможно</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Дополнительно</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="languages">Языки (через запятую)</Label>
              <Input
                id="languages"
                value={formData.languages.join(', ')}
                onChange={(e) => handleLanguageChange(e.target.value)}
                placeholder="Русский, Английский, Французский"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personality">Черты характера (через запятую)</Label>
              <Input
                id="personality"
                value={formData.personality.join(', ')}
                onChange={(e) => handlePersonalityChange(e.target.value)}
                placeholder="Весёлый, Активный, Добрый"
              />
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600">
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить
          </Button>
          <Button onClick={onCancel} variant="outline" className="flex-1">
            <Icon name="X" size={16} className="mr-2" />
            Отмена
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;