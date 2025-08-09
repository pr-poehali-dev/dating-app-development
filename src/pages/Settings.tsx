import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(user?.settings || {
    discoverable: true,
    ageRange: [18, 35],
    maxDistance: 25,
    showOnlineStatus: true
  });

  const handleSaveSettings = () => {
    updateProfile({ settings });
  };

  const subscriptionFeatures = {
    free: [
      'Базовые свайпы',
      '3 супер-лайка в день',
      'Просмотр совпадений',
      'Базовый чат'
    ],
    premium: [
      'Безлимитные лайки',
      '5 супер-лайков в день',
      'Кто лайкнул вас',
      'Возврат свайпа',
      'Видеочат',
      'Расширенные фильтры',
      'Режим невидимки',
      'Приоритет в показе'
    ]
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-light to-love-dark p-4 pb-24">
      <div className="max-w-md mx-auto pt-safe">
        <div className="flex items-center gap-4 mb-6 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="text-white hover:bg-white/10"
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-white">Настройки</h1>
        </div>

        <div className="space-y-4">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Search" size={20} />
                Настройки поиска
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="discoverable">Показывать в поиске</Label>
                  <Switch
                    id="discoverable"
                    checked={settings.discoverable}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, discoverable: checked }))
                    }
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Другие пользователи смогут видеть ваш профиль
                </p>
              </div>

              <div>
                <Label className="mb-2 block">
                  Возрастной диапазон: {settings.ageRange[0]} - {settings.ageRange[1]} лет
                </Label>
                <Slider
                  value={settings.ageRange}
                  onValueChange={(value) => 
                    setSettings(prev => ({ ...prev, ageRange: value as [number, number] }))
                  }
                  min={18}
                  max={60}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="mb-2 block">
                  Максимальное расстояние: {settings.maxDistance} км
                </Label>
                <Slider
                  value={[settings.maxDistance]}
                  onValueChange={([value]) => 
                    setSettings(prev => ({ ...prev, maxDistance: value }))
                  }
                  min={1}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <Button 
                onClick={handleSaveSettings}
                className="w-full bg-love-DEFAULT hover:bg-love-dark text-white"
              >
                Сохранить настройки
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Shield" size={20} />
                Приватность
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="online-status">Показывать онлайн статус</Label>
                  <p className="text-sm text-gray-600">
                    Другие увидят, когда вы в сети
                  </p>
                </div>
                <Switch
                  id="online-status"
                  checked={settings.showOnlineStatus}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, showOnlineStatus: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Crown" size={20} />
                  Подписка
                </div>
                <Badge variant={user.subscription === 'premium' ? 'default' : 'secondary'}>
                  {user.subscription === 'premium' ? 'Premium' : 'Базовая'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.subscription === 'free' ? (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Откройте все возможности LoveConnect с Premium подпиской!
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Базовая (бесплатно)</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {subscriptionFeatures.free.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Icon name="Check" size={14} className="text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2 text-love-DEFAULT">Premium (₽999/мес)</h4>
                      <ul className="space-y-1 text-sm text-gray-600 mb-4">
                        {subscriptionFeatures.premium.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Icon name="Crown" size={14} className="text-love-DEFAULT" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full bg-gradient-to-r from-love-DEFAULT to-love-dark text-white">
                        <Icon name="Crown" size={16} className="mr-2" />
                        Оформить Premium
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-love-DEFAULT/10 to-love-dark/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Crown" size={20} className="text-love-DEFAULT" />
                      <h4 className="font-semibold text-love-DEFAULT">Premium активна</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Следующее списание: 15 сентября 2024
                    </p>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Управлять подпиской
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Shield" size={20} />
                Безопасность
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Icon name="UserCheck" size={16} className="mr-2" />
                Верификация профиля
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Icon name="AlertTriangle" size={16} className="mr-2" />
                Пожаловаться на пользователя
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Icon name="UserX" size={16} className="mr-2" />
                Заблокированные пользователи
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="HelpCircle" size={20} />
                Поддержка
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <Icon name="MessageCircle" size={16} className="mr-2" />
                Связаться с поддержкой
              </Button>
              
              <Button variant="ghost" className="w-full justify-start">
                <Icon name="FileText" size={16} className="mr-2" />
                Условия использования
              </Button>
              
              <Button variant="ghost" className="w-full justify-start">
                <Icon name="Shield" size={16} className="mr-2" />
                Политика конфиденциальности
              </Button>
              
              <Button variant="ghost" className="w-full justify-start">
                <Icon name="Info" size={16} className="mr-2" />
                О приложении
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => {
                  if (confirm('Вы действительно хотите удалить аккаунт?')) {
                    localStorage.clear();
                    navigate('/auth');
                  }
                }}
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                Удалить аккаунт
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;