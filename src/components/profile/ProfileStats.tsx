import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Stats {
  likes: number;
  matches: number;
  views: number;
  messages: number;
}

interface ProfileStatsProps {
  stats: Stats;
  variant?: 'desktop' | 'mobile';
}

const ProfileStats = ({ stats, variant = 'mobile' }: ProfileStatsProps) => {
  const isDesktop = variant === 'desktop';

  const StatCard = ({ 
    icon, 
    value, 
    label, 
    color, 
    bgColor 
  }: { 
    icon: string; 
    value: number; 
    label: string; 
    color: string; 
    bgColor: string; 
  }) => {
    // Не показываем статистику с нулевыми значениями
    if (value === 0) {
      return null;
    }

    if (isDesktop) {
      return (
        <div className={`flex items-center justify-between p-4 ${bgColor} rounded-xl`}>
          <div className="flex items-center gap-3">
            <Icon name={icon as any} size={20} className={color} />
            <span className="font-medium">{label}</span>
          </div>
          <div className={`text-2xl font-bold ${color}`}>{value}</div>
        </div>
      );
    }

    return (
      <div className={`text-center p-3 ${bgColor} rounded-lg`}>
        <Icon name={icon as any} size={20} className={`${color} mx-auto mb-1`} />
        <div className={`font-bold text-lg ${color}`}>{value}</div>
        <div className="text-xs text-gray-600">{label}</div>
      </div>
    );
  };

  // Подсчитываем количество непустых статистик
  const nonZeroStats = [
    { key: 'likes', value: stats.likes },
    { key: 'matches', value: stats.matches },
    { key: 'views', value: stats.views },
    { key: 'messages', value: stats.messages }
  ].filter(stat => stat.value > 0);

  // Если нет статистики для показа, возвращаем null
  if (nonZeroStats.length === 0) {
    return (
      <Card className={`bg-white/${isDesktop ? '80' : '95'} backdrop-blur-sm border-0 ${isDesktop ? 'shadow-xl' : 'shadow-lg'}`}>
        <CardContent className="p-6">
          <h3 className={`${isDesktop ? 'text-xl' : 'text-base'} font-${isDesktop ? 'bold' : 'semibold'} mb-3 flex items-center gap-2`}>
            <Icon name="TrendingUp" size={isDesktop ? 20 : 18} className="text-green-500" />
            Статистика
          </h3>
          <div className="text-center py-4 text-gray-500">
            <Icon name="BarChart3" size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Статистика появится после активности</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isDesktop) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Icon name="TrendingUp" size={20} className="text-green-500" />
            Статистика
          </h3>
          <div className="space-y-4">
            <StatCard 
              icon="Heart"
              value={stats.likes}
              label="Лайки"
              color="text-pink-600"
              bgColor="bg-pink-50"
            />
            <StatCard 
              icon="Users"
              value={stats.matches}
              label="Совпадения"
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <StatCard 
              icon="Eye"
              value={stats.views}
              label="Просмотры"
              color="text-green-600"
              bgColor="bg-green-50"
            />
            <StatCard 
              icon="MessageCircle"
              value={stats.messages}
              label="Сообщения"
              color="text-purple-600"
              bgColor="bg-purple-50"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Icon name="TrendingUp" size={18} className="text-green-500" />
          Статистика
        </h3>
        <div className={`grid gap-4 ${nonZeroStats.length === 1 ? 'grid-cols-1' : nonZeroStats.length === 2 ? 'grid-cols-2' : nonZeroStats.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <StatCard 
            icon="Heart"
            value={stats.likes}
            label="Лайков"
            color="text-pink-600"
            bgColor="bg-pink-50"
          />
          <StatCard 
            icon="Users"
            value={stats.matches}
            label="Совпадений"
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard 
            icon="Eye"
            value={stats.views}
            label="Просмотров"
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard 
            icon="MessageCircle"
            value={stats.messages}
            label="Сообщений"
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStats;