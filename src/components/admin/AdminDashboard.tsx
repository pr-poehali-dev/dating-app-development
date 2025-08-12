import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';

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

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface AdminDashboardProps {
  stats: AdminStats;
  metrics: SystemMetric[];
  setActiveTab: (tab: string) => void;
  clearAllData: () => void;
}

const AdminDashboard = ({ stats, metrics, setActiveTab, clearAllData }: AdminDashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
            <Icon name="Users" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newUsersWeek} за неделю
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные сегодня</CardTitle>
            <Icon name="UserCheck" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.onlineUsers} онлайн сейчас
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium подписки</CardTitle>
            <Icon name="Crown" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.premiumUsers}</div>
            <p className="text-xs text-muted-foreground">
              ≈{stats.premiumRevenue.toLocaleString()} ₽/мес
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Совпадения</CardTitle>
            <Icon name="Heart" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">{stats.totalMatches}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalMessages} сообщений
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Системные метрики</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{metric.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {metric.value}{metric.unit}
                    </span>
                    <Badge 
                      variant={metric.trend === 'up' ? 'default' : metric.trend === 'down' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {metric.change > 0 ? '+' : ''}{metric.change}{metric.unit}
                    </Badge>
                  </div>
                </div>
                <Icon 
                  name={metric.trend === 'up' ? 'TrendingUp' : metric.trend === 'down' ? 'TrendingDown' : 'Minus'} 
                  className={`w-5 h-5 ${
                    metric.trend === 'up' ? 'text-green-500' : 
                    metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                  }`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" onClick={() => setActiveTab('users')}>
              <Icon name="Users" className="w-4 h-4 mr-2" />
              Управление пользователями
            </Button>
            <Button className="w-full" variant="outline" onClick={() => setActiveTab('reports')}>
              <Icon name="Flag" className="w-4 h-4 mr-2" />
              Проверить жалобы ({stats.reportsCount})
            </Button>
            <Button className="w-full" variant="outline" onClick={() => setActiveTab('analytics')}>
              <Icon name="BarChart" className="w-4 h-4 mr-2" />
              Просмотреть аналитику
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Icon name="Trash2" className="w-4 h-4 mr-2" />
                  Очистить все данные
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>⚠️ Опасная операция</AlertDialogTitle>
                  <AlertDialogDescription>
                    Вы действительно хотите удалить ВСЕ данные пользователей? 
                    Это действие нельзя отменить!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAllData} className="bg-red-500">
                    Удалить все данные
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;