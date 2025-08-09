import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ProfileStatsProps {
  stats: {
    likes: number;
    matches: number;
    views: number;
    messages: number;
  };
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  return (
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
  );
}