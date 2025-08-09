import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { User } from '@/contexts/AuthContext';

interface ProfileHeaderProps {
  user: User;
  isEditing: boolean;
  formData: {
    name: string;
    age: number;
    job: string;
    height: number;
  };
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onFormChange: (data: Partial<typeof formData>) => void;
}

export default function ProfileHeader({ 
  user, 
  isEditing, 
  formData, 
  onEdit, 
  onSave, 
  onCancel, 
  onFormChange 
}: ProfileHeaderProps) {
  return (
    <div className="text-center mb-6">
      <div className="relative inline-block">
        <div className="w-24 h-24 bg-gradient-to-br from-love-light to-love-DEFAULT rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="User" size={40} className="text-white" />
        </div>
        {user.verified && (
          <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
            <Icon name="Shield" size={16} className="text-white" />
          </div>
        )}
      </div>
      
      {!isEditing ? (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {user.name}
          </h2>
          <div className="text-gray-600 mb-2 space-y-1">
            <p>{user.age} лет • {typeof user.location === 'string' ? user.location : user.location?.city}</p>
            {user.job && <p className="text-sm">💼 {user.job}</p>}
            {user.education && <p className="text-sm">🎓 {user.education}</p>}
            {user.height && <p className="text-sm">📏 {user.height} см</p>}
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant={user.subscription === 'premium' ? 'default' : 'secondary'}>
              {user.subscription === 'premium' ? 'Premium' : 'Базовый'}
            </Badge>
            {user.verified && (
              <Badge className="bg-blue-500">
                <Icon name="Shield" size={12} className="mr-1" />
                Верифицирован
              </Badge>
            )}
          </div>
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={onEdit}
              className="bg-love-DEFAULT hover:bg-love-dark text-white"
            >
              <Icon name="Edit" size={16} className="mr-2" />
              Редактировать
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const url = window.location.origin + '/profile/' + user.id;
                navigator.clipboard.writeText(url);
              }}
            >
              <Icon name="Share" size={16} className="mr-2" />
              Поделиться
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onFormChange({ name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="age">Возраст: {formData.age}</Label>
            <Slider
              value={[formData.age]}
              onValueChange={([value]) => onFormChange({ age: value })}
              min={18}
              max={60}
              step={1}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="job">Профессия</Label>
            <Input
              id="job"
              value={formData.job}
              onChange={(e) => onFormChange({ job: e.target.value })}
              placeholder="Ваша профессия"
            />
          </div>
          <div>
            <Label htmlFor="height">Рост: {formData.height} см</Label>
            <Slider
              value={[formData.height]}
              onValueChange={([value]) => onFormChange({ height: value })}
              min={140}
              max={220}
              step={1}
              className="mt-2"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={onSave}
              className="bg-love-DEFAULT hover:bg-love-dark text-white"
            >
              Сохранить
            </Button>
            <Button 
              variant="outline"
              onClick={onCancel}
            >
              Отмена
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}