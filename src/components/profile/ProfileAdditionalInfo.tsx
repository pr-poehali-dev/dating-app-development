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
          {/* Основная информация */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center">
              <Icon name="Mail" size={16} className="mr-2" />Email:
            </span>
            <Badge variant="outline">{user.email}</Badge>
          </div>
          
          {user.height && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center">
                <Icon name="Ruler" size={16} className="mr-2" />Рост:
              </span>
              <Badge variant="outline">{user.height} см</Badge>
            </div>
          )}
          
          {user.education && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center">
                <Icon name="GraduationCap" size={16} className="mr-2" />Образование:
              </span>
              <Badge variant="outline">{user.education}</Badge>
            </div>
          )}
          
          {user.work && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center">
                <Icon name="Briefcase" size={16} className="mr-2" />Работа:
              </span>
              <Badge variant="outline">{user.work}</Badge>
            </div>
          )}
          
          {user.zodiac && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center">
                <span className="mr-2">♈</span>Знак зодиака:
              </span>
              <Badge variant="outline">{user.zodiac}</Badge>
            </div>
          )}
          
          {user.children && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center">
                <Icon name="Baby" size={16} className="mr-2" />Дети:
              </span>
              <Badge variant="outline">
                {user.children === 'none' ? 'Нет детей' : 
                 user.children === 'have' ? 'Есть дети' : 'Хочу детей'}
              </Badge>
            </div>
          )}
          
          {user.pets && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center">
                <Icon name="Heart" size={16} className="mr-2" />Животные:
              </span>
              <Badge variant="outline">
                {user.pets === 'none' ? 'Без животных' : 
                 user.pets === 'have' ? 'Есть питомцы' : 'Люблю животных'}
              </Badge>
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
          
          {/* Активность и геолокация */}
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