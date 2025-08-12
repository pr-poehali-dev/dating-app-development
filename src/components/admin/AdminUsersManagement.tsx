import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { User } from '@/contexts/AuthContext';

interface AdminUsersManagementProps {
  users: User[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  toggleUserVerification: (userId: string) => void;
  toggleUserPremium: (userId: string) => void;
  deleteUser: (userId: string) => void;
}

const AdminUsersManagement = ({ 
  users, 
  searchTerm, 
  setSearchTerm, 
  toggleUserVerification, 
  toggleUserPremium, 
  deleteUser 
}: AdminUsersManagementProps) => {
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default AdminUsersManagement;