import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  description: string;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'resolved';
}

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

interface AdminReportsSystemProps {
  reports: Report[];
  stats: AdminStats;
  activeTab: string;
}

const AdminReportsSystem = ({ reports, stats, activeTab }: AdminReportsSystemProps) => {
  if (activeTab === 'reports') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Жалобы и репорты</CardTitle>
            <p className="text-sm text-gray-600">
              {reports.length > 0 
                ? `Всего жалоб: ${reports.length}, ожидают рассмотрения: ${stats.reportsCount}`
                : 'Жалоб нет - отличная работа модерации!'
              }
            </p>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="CheckCircle" className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Нет активных жалоб</h3>
                <p className="text-gray-600">Все пользователи ведут себя хорошо!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">Жалоба #{report.id}</h4>
                      <Badge variant={report.status === 'pending' ? 'destructive' : 'default'}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Причина:</strong> {report.reason}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Описание:</strong> {report.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(report.timestamp).toLocaleString('ru-RU')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'system') {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Состояние системы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Статус сервиса</span>
                <Badge className="bg-green-500">🟢 Онлайн</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>База данных</span>
                <Badge className="bg-green-500">🟢 Подключена</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Время работы</span>
                <Badge variant="outline">24/7</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Последний бэкап</span>
                <Badge variant="outline">Сегодня</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Информация о системе</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Версия:</span>
                <strong>v2.1.0</strong>
              </div>
              <div className="flex justify-between">
                <span>Платформа:</span>
                <strong>React + TypeScript</strong>
              </div>
              <div className="flex justify-between">
                <span>Среда:</span>
                <strong>Production</strong>
              </div>
              <div className="flex justify-between">
                <span>Домен:</span>
                <strong>noumidating.ru</strong>
              </div>
              <div className="flex justify-between">
                <span>SSL:</span>
                <Badge className="bg-green-500">🔒 Активен</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default AdminReportsSystem;