import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User } from '@/contexts/AuthContext';

interface ProfileTipsProps {
  user: User;
}

export default function ProfileTips({ user }: ProfileTipsProps) {
  const completionPercentage = Math.round(
    ((user?.bio ? 1 : 0) + 
     (user?.interests?.length >= 3 ? 1 : 0) + 
     (user?.photos?.length >= 2 ? 1 : 0) + 
     (user?.verified ? 1 : 0)) / 4 * 100
  );

  return (
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
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}