import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { User } from '@/contexts/AuthContext';

interface AdminSettingsProps {
  user: User;
  navigate: (path: string) => void;
}

const AdminSettings = ({ user, navigate }: AdminSettingsProps) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default AdminSettings;