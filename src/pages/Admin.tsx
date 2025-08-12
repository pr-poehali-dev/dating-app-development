import { useState, useEffect } from 'react';
import { useAuth, User } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminUsersManagement from '@/components/admin/AdminUsersManagement';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminReportsSystem from '@/components/admin/AdminReportsSystem';
import AdminSettings from '@/components/admin/AdminSettings';

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
          <TabsContent value="dashboard">
            <AdminDashboard 
              stats={stats}
              metrics={metrics}
              setActiveTab={setActiveTab}
              clearAllData={clearAllData}
            />
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users">
            <AdminUsersManagement 
              users={users}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              toggleUserVerification={toggleUserVerification}
              toggleUserPremium={toggleUserPremium}
              deleteUser={deleteUser}
            />
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <AdminAnalytics stats={stats} />
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports">
            <AdminReportsSystem 
              reports={reports}
              stats={stats}
              activeTab="reports"
            />
          </TabsContent>

          {/* System */}
          <TabsContent value="system">
            <AdminReportsSystem 
              reports={reports}
              stats={stats}
              activeTab="system"
            />
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <AdminSettings 
              user={user}
              navigate={navigate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;