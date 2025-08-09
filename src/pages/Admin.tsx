import { useState, useEffect } from 'react';
import { useAuth, User } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalMatches: number;
  premiumUsers: number;
  verifiedUsers: number;
  reportsCount: number;
}

const Admin = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalMatches: 0,
    premiumUsers: 0,
    verifiedUsers: 0,
    reportsCount: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    
    setUsers(allUsers);
    setStats({
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter((u: User) => {
        const lastActive = new Date(u.lastActive);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return lastActive > dayAgo;
      }).length,
      totalMatches: matches.length * 2,
      premiumUsers: allUsers.filter((u: User) => u.subscription === 'premium').length,
      verifiedUsers: allUsers.filter((u: User) => u.verified).length,
      reportsCount: Math.floor(Math.random() * 10) + 2
    });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const verifyUser = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, verified: true } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setStats(prev => ({ ...prev, verifiedUsers: prev.verifiedUsers + 1 }));
  };

  const banUser = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
  };

  const upgradeUser = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, subscription: 'premium' } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setStats(prev => ({ ...prev, premiumUsers: prev.premiumUsers + 1 }));
  };

  if (!user || user.email !== 'admin@loveconnect.ru') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-love-light to-love-dark flex items-center justify-center p-4">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg max-w-md">
          <CardContent className="p-8 text-center">
            <Icon name="ShieldX" size={64} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Доступ запрещен</h2>
            <p className="text-gray-600">У вас нет прав администратора</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-light to-love-dark p-4 pb-24">
      <div className="max-w-4xl mx-auto pt-safe">
        <div className="flex items-center gap-4 mb-6 pt-4">
          <Icon name="Shield" size={32} className="text-white" />
          <h1 className="text-2xl font-bold text-white">Панель администратора</h1>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="bg-white/10">
            <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-white data-[state=active]:text-love-DEFAULT">
              Обзор
            </TabsTrigger>
            <TabsTrigger value="users" className="text-white data-[state=active]:bg-white data-[state=active]:text-love-DEFAULT">
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-white data-[state=active]:bg-white data-[state=active]:text-love-DEFAULT">
              Жалобы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <Icon name="Users" size={32} className="mx-auto mb-2 text-blue-500" />
                  <h3 className="font-semibold text-gray-900">Всего пользователей</h3>
                  <p className="text-2xl font-bold text-blue-500">{stats.totalUsers}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <Icon name="UserCheck" size={32} className="mx-auto mb-2 text-green-500" />
                  <h3 className="font-semibold text-gray-900">Активных за сутки</h3>
                  <p className="text-2xl font-bold text-green-500">{stats.activeUsers}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <Icon name="Heart" size={32} className="mx-auto mb-2 text-red-500" />
                  <h3 className="font-semibold text-gray-900">Совпадений</h3>
                  <p className="text-2xl font-bold text-red-500">{stats.totalMatches}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <Icon name="Crown" size={32} className="mx-auto mb-2 text-yellow-500" />
                  <h3 className="font-semibold text-gray-900">Premium</h3>
                  <p className="text-2xl font-bold text-yellow-500">{stats.premiumUsers}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <Icon name="ShieldCheck" size={32} className="mx-auto mb-2 text-blue-500" />
                  <h3 className="font-semibold text-gray-900">Верифицированы</h3>
                  <p className="text-2xl font-bold text-blue-500">{stats.verifiedUsers}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4 text-center">
                  <Icon name="AlertTriangle" size={32} className="mx-auto mb-2 text-orange-500" />
                  <h3 className="font-semibold text-gray-900">Жалобы</h3>
                  <p className="text-2xl font-bold text-orange-500">{stats.reportsCount}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить пользователя
                </Button>
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  <Icon name="ShieldCheck" size={16} className="mr-2" />
                  Массовая верификация
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Icon name="Mail" size={16} className="mr-2" />
                  Отправить уведомление
                </Button>
                <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                  <Icon name="BarChart" size={16} className="mr-2" />
                  Экспорт данных
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Управление пользователями</CardTitle>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Поиск пользователей..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Button size="sm" className="bg-love-DEFAULT hover:bg-love-dark text-white">
                      <Icon name="Search" size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-love-light to-love-DEFAULT rounded-full flex items-center justify-center">
                          <Icon name="User" size={20} className="text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.name}</span>
                            {user.verified && (
                              <Badge className="bg-blue-500">
                                <Icon name="Shield" size={12} className="mr-1" />
                                Верифицирован
                              </Badge>
                            )}
                            {user.subscription === 'premium' && (
                              <Badge className="bg-yellow-500">
                                <Icon name="Crown" size={12} className="mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            {user.age} лет • {user.location.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!user.verified && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verifyUser(user.id)}
                            className="text-blue-500 border-blue-500 hover:bg-blue-50"
                          >
                            <Icon name="ShieldCheck" size={14} className="mr-1" />
                            Верифицировать
                          </Button>
                        )}
                        
                        {user.subscription === 'free' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => upgradeUser(user.id)}
                            className="text-yellow-500 border-yellow-500 hover:bg-yellow-50"
                          >
                            <Icon name="Crown" size={14} className="mr-1" />
                            Premium
                          </Button>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-500 border-red-500 hover:bg-red-50"
                            >
                              <Icon name="Ban" size={14} className="mr-1" />
                              Заблокировать
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Заблокировать пользователя?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы действительно хотите заблокировать пользователя {user.name}? 
                                Это действие нельзя отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction onClick={() => banUser(user.id)}>
                                Заблокировать
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Жалобы пользователей</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((reportId) => (
                    <div key={reportId} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">Жалоба #{reportId}</h4>
                          <p className="text-sm text-gray-600">
                            От: Пользователь {reportId} • На: Пользователь {reportId + 10}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-orange-500">
                          Ожидает рассмотрения
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">
                        {reportId === 1 && "Неподобающее поведение в чате, оскорбительные сообщения"}
                        {reportId === 2 && "Подозрение в использовании фейковых фотографий"}
                        {reportId === 3 && "Спам и нежелательные сообщения"}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                          <Icon name="Check" size={14} className="mr-1" />
                          Принять
                        </Button>
                        <Button size="sm" variant="outline">
                          <Icon name="X" size={14} className="mr-1" />
                          Отклонить
                        </Button>
                        <Button size="sm" variant="outline">
                          <Icon name="Eye" size={14} className="mr-1" />
                          Подробнее
                        </Button>
                      </div>
                    </div>
                  ))}
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