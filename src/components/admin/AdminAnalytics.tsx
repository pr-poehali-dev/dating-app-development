import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalMatches: number;
  premiumUsers: number;
  verifiedUsers: number;
  reportsCount: number;
  totalMessages: number;
  totalChats: number;
  onlineUsers: number;
  newUsersToday: number;
  newUsersWeek: number;
  premiumRevenue: number;
}

interface AdminAnalyticsProps {
  stats: AdminStats;
}

const AdminAnalytics = ({ stats }: AdminAnalyticsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Регистрации</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{stats.newUsersWeek}</div>
            <p className="text-sm text-gray-600">за последние 7 дней</p>
            <div className="mt-4">
              <Progress value={(stats.newUsersWeek / stats.totalUsers) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Активность</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
            </div>
            <p className="text-sm text-gray-600">пользователей активны</p>
            <div className="mt-4">
              <Progress value={(stats.activeUsers / stats.totalUsers) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Конверсия Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {Math.round((stats.premiumUsers / stats.totalUsers) * 100)}%
            </div>
            <p className="text-sm text-gray-600">имеют Premium</p>
            <div className="mt-4">
              <Progress value={(stats.premiumUsers / stats.totalUsers) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Детальная статистика</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Пользователи</h4>
              <ul className="space-y-1 text-sm">
                <li>Всего зарегистрировано: <strong>{stats.totalUsers}</strong></li>
                <li>Верифицированных: <strong>{stats.verifiedUsers}</strong></li>
                <li>С Premium: <strong>{stats.premiumUsers}</strong></li>
                <li>Активных за день: <strong>{stats.activeUsers}</strong></li>
                <li>Новых за неделю: <strong>{stats.newUsersWeek}</strong></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Взаимодействия</h4>
              <ul className="space-y-1 text-sm">
                <li>Всего совпадений: <strong>{stats.totalMatches}</strong></li>
                <li>Активных чатов: <strong>{stats.totalChats}</strong></li>
                <li>Отправлено сообщений: <strong>{stats.totalMessages}</strong></li>
                <li>Открытых жалоб: <strong>{stats.reportsCount}</strong></li>
                <li>Доход от Premium: <strong>≈{stats.premiumRevenue.toLocaleString()} ₽</strong></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;