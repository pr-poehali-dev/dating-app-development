import { useState, useEffect } from 'react';
import { useAuth, User } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

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

interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  description: string;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'resolved';
}

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalMatches: 0,
    premiumUsers: 0,
    verifiedUsers: 0,
    reportsCount: 0,
    totalMessages: 0,
    totalChats: 0,
    onlineUsers: 0,
    newUsersToday: 0,
    newUsersWeek: 0,
    premiumRevenue: 0
  });
  
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Проверка админских прав
  useEffect(() => {
    if (!user || user.email !== 'swi79@bk.ru') {
      navigate('/');
      return;
    }
    loadAdminData();
  }, [user, navigate]);

  const loadAdminData = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    const chats = JSON.parse(localStorage.getItem('chats') || '{}');
    const reports = JSON.parse(localStorage.getItem('reports') || '[]');
    
    // Подсчет сообщений
    let totalMessages = 0;
    Object.values(chats).forEach((chatMessages: any) => {
      if (Array.isArray(chatMessages)) {
        totalMessages += chatMessages.length;
      }
    });

    // Подсчет активных пользователей
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const activeUsers = allUsers.filter((u: User) => {
      const lastActive = new Date(u.lastActive);
      return lastActive > dayAgo;
    }).length;

    const newUsersToday = allUsers.filter((u: User) => {
      const created = new Date(u.lastActive);
      return created > dayAgo;
    }).length;

    const newUsersWeek = allUsers.filter((u: User) => {
      const created = new Date(u.lastActive);
      return created > weekAgo;
    }).length;

    const premiumUsers = allUsers.filter((u: User) => u.subscription === 'premium').length;
    const verifiedUsers = allUsers.filter((u: User) => u.verified).length;
    const premiumRevenue = premiumUsers * 299; // 299 руб за премиум

    setUsers(allUsers);
    setReports(reports);
    setStats({
      totalUsers: allUsers.length,
      activeUsers,
      totalMatches: matches.length,
      premiumUsers,
      verifiedUsers,
      reportsCount: reports.filter((r: Report) => r.status === 'pending').length,
      totalMessages,
      totalChats: Object.keys(chats).length,
      onlineUsers: Math.floor(activeUsers * 0.7), // Примерно 70% активных онлайн
      newUsersToday,
      newUsersWeek,
      premiumRevenue
    });

    // Системные метрики
    setMetrics([
      { name: 'Время отклика', value: 45, unit: 'мс', trend: 'down', change: -5 },
      { name: 'Использование ЦП', value: 23, unit: '%', trend: 'stable', change: 0 },
      { name: 'Использование ОЗУ', value: 67, unit: '%', trend: 'up', change: 3 },
      { name: 'Успешные входы', value: 98.5, unit: '%', trend: 'up', change: 0.5 }
    ]);
  };

  const toggleUserVerification = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, verified: !u.verified } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadAdminData();
  };

  const toggleUserPremium = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId 
        ? { ...u, subscription: u.subscription === 'premium' ? 'free' : 'premium' }
        : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadAdminData();
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Удаляем связанные данные
    const chats = JSON.parse(localStorage.getItem('chats') || '{}');
    Object.keys(chats).forEach(chatId => {
      if (chatId.includes(userId)) {
        delete chats[chatId];
      }
    });
    localStorage.setItem('chats', JSON.stringify(chats));
    
    loadAdminData();
  };

  const clearAllData = () => {
    localStorage.removeItem('users');
    localStorage.removeItem('matches');
    localStorage.removeItem('chats');
    localStorage.removeItem('reports');
    localStorage.removeItem('currentUser');
    window.location.reload();
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.email !== 'swi79@bk.ru') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Icon name="Shield" className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <CardTitle className="text-red-600">Доступ запрещен</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">У вас нет прав для доступа к админской панели</p>
            <Button onClick={() => navigate('/')} variant="outline">
              Вернуться на главную
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Панель администратора
            </h1>
            <p className="text-gray-600">
              Добро пожаловать, {user.name} • {new Date().toLocaleDateString('ru-RU')}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/')}>
              <Icon name="Home" className="w-4 h-4 mr-2" />
              На главную
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <Icon name="RefreshCw" className="w-4 h-4 mr-2" />
              Обновить
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            <TabsTrigger value="reports">Жалобы</TabsTrigger>
            <TabsTrigger value="system">Система</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
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
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Управление пользователями ({users.length})</CardTitle>
                <div className="flex gap-4">
                  <Input
                    placeholder="Поиск по имени или email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Badge variant="outline">Найдено: {filteredUsers.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Подписка</TableHead>
                      <TableHead>Последняя активность</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.slice(0, 20).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.age} лет</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {user.verified && (
                              <Badge variant="default" className="bg-blue-500">
                                <Icon name="CheckCircle" className="w-3 h-3 mr-1" />
                                Верифицирован
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.subscription === 'premium' ? 'default' : 'secondary'}>
                            {user.subscription === 'premium' ? '👑 Premium' : '🆓 Free'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.lastActive).toLocaleDateString('ru-RU')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={user.verified ? "secondary" : "default"}
                              onClick={() => toggleUserVerification(user.id)}
                            >
                              {user.verified ? 'Убрать ✓' : 'Верифицировать'}
                            </Button>
                            <Button
                              size="sm"
                              variant={user.subscription === 'premium' ? "secondary" : "default"}
                              onClick={() => toggleUserPremium(user.id)}
                            >
                              {user.subscription === 'premium' ? 'Убрать Premium' : 'Дать Premium'}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  Удалить
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Удаление пользователя</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Вы действительно хотите удалить пользователя {user.name}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteUser(user.id)}>
                                    Удалить
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
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
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports" className="space-y-6">
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
          </TabsContent>

          {/* System */}
          <TabsContent value="system" className="space-y-6">
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
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Настройки администратора</CardTitle>
                <p className="text-sm text-gray-600">
                  Вы вошли как: <strong>{user.email}</strong>
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Уведомления</h4>
                    <p className="text-sm text-gray-600">Получать уведомления о новых жалобах</p>
                  </div>
                  <Button variant="outline" size="sm">Включено</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Автомодерация</h4>
                    <p className="text-sm text-gray-600">Автоматическая проверка контента</p>
                  </div>
                  <Button variant="outline" size="sm">Включено</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Бэкапы</h4>
                    <p className="text-sm text-gray-600">Ежедневное резервное копирование</p>
                  </div>
                  <Button variant="outline" size="sm">Активно</Button>
                </div>

                <hr className="my-4" />

                <div className="flex gap-3">
                  <Button onClick={() => window.location.reload()}>
                    <Icon name="RefreshCw" className="w-4 h-4 mr-2" />
                    Перезагрузить данные
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/')}>
                    <Icon name="LogOut" className="w-4 h-4 mr-2" />
                    Выйти из админки
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;