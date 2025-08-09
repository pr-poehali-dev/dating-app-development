import { User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ProfilePhotosProps {
  user: User;
  variant?: 'desktop' | 'mobile';
}

const ProfilePhotos = ({ user, variant = 'mobile' }: ProfilePhotosProps) => {
  const isDesktop = variant === 'desktop';

  return (
    <Card className={`bg-white/95 backdrop-blur-sm border-0 ${isDesktop ? 'shadow-xl' : 'shadow-lg'}`}>
      <CardContent className="p-6">
        <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDesktop ? 'text-xl' : 'font-semibold'}`}>
          <Icon 
            name="Camera" 
            size={isDesktop ? 20 : 18} 
            className="text-purple-500" 
          />
          Фотографии
        </h3>
        <div className={`grid mb-4 ${isDesktop ? 'grid-cols-2 gap-3' : 'grid-cols-3 gap-3'}`}>
          <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-xl flex items-center justify-center">
            {user.photos?.[0] ? (
              <img 
                src={user.photos[0]} 
                alt="Profile"
                className={`w-full h-full object-cover ${isDesktop ? 'rounded-xl' : 'rounded-lg'}`}
              />
            ) : (
              <Icon name="User" size={isDesktop ? 32 : 28} className="text-gray-600" />
            )}
          </div>
          <div className="aspect-square bg-gradient-to-br from-blue-200 to-cyan-200 rounded-xl flex items-center justify-center">
            <Icon name="Plus" size={24} className="text-gray-600" />
          </div>
          {!isDesktop && (
            <div className="aspect-square bg-gradient-to-br from-green-200 to-emerald-200 rounded-lg flex items-center justify-center">
              <Icon name="Heart" size={24} className="text-gray-600" />
            </div>
          )}
        </div>
        <Button variant="outline" className="w-full">
          <Icon name="Upload" size={16} className="mr-2" />
          {isDesktop ? 'Добавить фото' : 'Добавить фотографии'}
        </Button>
        {!isDesktop && (
          <p className="text-sm text-gray-500 mt-3 text-center">
            Добавьте качественные фотографии для лучшего результата
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfilePhotos;