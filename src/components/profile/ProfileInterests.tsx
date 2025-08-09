import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User } from '@/contexts/AuthContext';

interface ProfileInterestsProps {
  user: User;
  isEditing: boolean;
  formData: {
    interests: string[];
  };
  onToggleInterest: (interest: string) => void;
}

export default function ProfileInterests({ 
  user, 
  isEditing, 
  formData, 
  onToggleInterest 
}: ProfileInterestsProps) {
  const popularInterests = [
    'Путешествия', 'Музыка', 'Спорт', 'Кино', 'Книги', 'Готовка',
    'Танцы', 'Йога', 'Фотография', 'Искусство', 'Природа', 'Животные',
    'Технологии', 'Игры', 'Автомобили', 'Мода', 'Кафе', 'Театр',
    'Винтаж', 'Психология', 'Медитация', 'Бег', 'Велоспорт', 'Плавание'
  ];

  return (
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
                  onClick={() => onToggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}