import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User } from '@/contexts/AuthContext';

interface ProfileAdditionalInfoProps {
  user: User;
}

export default function ProfileAdditionalInfo({ user }: ProfileAdditionalInfoProps) {
  return (
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
  );
}