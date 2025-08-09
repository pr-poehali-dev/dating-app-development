import { User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface FormData {
  name: string;
  bio: string;
  age: number;
  interests: string[];
}

interface ProfileHeaderProps {
  user: User;
  isEditing: boolean;
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  variant?: 'desktop' | 'mobile';
}

const ProfileHeader = ({
  user,
  isEditing,
  formData,
  setFormData,
  onEdit,
  onSave,
  onCancel,
  variant = 'mobile'
}: ProfileHeaderProps) => {
  const isDesktop = variant === 'desktop';

  const AvatarComponent = () => (
    <div className="relative">
      <div className={cn(
        "bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center",
        isDesktop ? "w-32 h-32" : "w-24 h-24"
      )}>
        {user.photos && user.photos.length > 0 ? (
          <img 
            src={user.photos[0]} 
            alt={user.name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <Icon 
            name="User" 
            size={isDesktop ? 64 : 36} 
            className="text-white" 
          />
        )}
      </div>
      {user.verified && (
        <div className={cn(
          "absolute bg-blue-500 rounded-full p-2",
          isDesktop ? "-bottom-2 -right-2" : "-bottom-1 -right-1"
        )}>
          <Icon 
            name="ShieldCheck" 
            size={isDesktop ? 20 : 14} 
            className="text-white" 
          />
        </div>
      )}
      <div className={cn(
        "absolute bg-green-500 rounded-full border-white animate-pulse",
        isDesktop 
          ? "-top-1 -right-1 w-6 h-6 border-4" 
          : "-top-1 -right-1 w-4 h-4 border-2"
      )} />
    </div>
  );

  const BadgesComponent = () => (
    <div className={cn(
      "flex items-center gap-3",
      isDesktop ? "mb-6" : "mb-4",
      !isDesktop && "justify-center"
    )}>
      <Badge 
        variant={user.subscription === 'premium' ? 'default' : 'secondary'}
        className={cn(
          "font-medium",
          isDesktop ? "px-4 py-2 text-sm" : "",
          user.subscription === 'premium' 
            ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" 
            : ""
        )}
      >
        {user.subscription === 'premium' ? (
          <>
            <Icon name="Crown" size={isDesktop ? 16 : 12} className="mr-1" />
            Premium
          </>
        ) : (
          isDesktop ? 'Базовый план' : 'Базовый'
        )}
      </Badge>
      {user.verified && (
        <Badge className="bg-blue-500 text-white px-4 py-2">
          <Icon name="ShieldCheck" size={isDesktop ? 16 : 12} className="mr-1" />
          Верифицирован
        </Badge>
      )}
      {isDesktop && (
        <Badge className="bg-green-500 text-white px-4 py-2">
          <Icon name="Wifi" size={16} className="mr-1" />
          Онлайн
        </Badge>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="flex items-start gap-8">
        <AvatarComponent />
        
        <div className="flex-1">
          {!isEditing ? (
            <>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                {user.verified && (
                  <Icon name="BadgeCheck" size={28} className="text-blue-500" />
                )}
              </div>
              <p className="text-xl text-gray-600 mb-4">
                {user.age} лет • {user.location.city}
              </p>
              
              <BadgesComponent />

              <Button 
                onClick={onEdit}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Icon name="Edit" size={18} className="mr-2" />
                Редактировать профиль
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-base font-medium">Имя</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-2 h-12"
                />
              </div>
              <div>
                <Label htmlFor="age" className="text-base font-medium">
                  Возраст: {formData.age} лет
                </Label>
                <Slider
                  value={[formData.age]}
                  onValueChange={([value]) => setFormData(prev => ({ ...prev, age: value }))}
                  min={18}
                  max={60}
                  step={1}
                  className="mt-3"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={onSave}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Icon name="Save" size={18} className="mr-2" />
                  Сохранить
                </Button>
                <Button 
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 border-gray-300"
                >
                  <Icon name="X" size={18} className="mr-2" />
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mobile version
  return (
    <div className="text-center mb-4">
      <div className="relative inline-block mb-3">
        <AvatarComponent />
      </div>
      
      {!isEditing ? (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {user.name}
          </h2>
          <p className="text-gray-600 mb-3">
            {user.age} лет • {user.location.city}
          </p>
          
          <BadgesComponent />

          <Button 
            onClick={onEdit}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Icon name="Edit" size={16} className="mr-2" />
            Редактировать
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="age">Возраст: {formData.age}</Label>
            <Slider
              value={[formData.age]}
              onValueChange={([value]) => setFormData(prev => ({ ...prev, age: value }))}
              min={18}
              max={60}
              step={1}
              className="mt-2"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={onSave}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить
            </Button>
            <Button 
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;