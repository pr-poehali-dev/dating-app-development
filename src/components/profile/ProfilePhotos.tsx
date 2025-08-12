import { User } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import PhotoGallery from './PhotoGallery';

interface ProfilePhotosProps {
  user: User;
  variant?: 'desktop' | 'mobile';
  onPhotosChange?: (photos: string[]) => void;
}

const ProfilePhotos = ({ user, variant = 'mobile' }: ProfilePhotosProps) => {
  const isDesktop = variant === 'desktop';
  const maxPhotos = 6;

  return (
    <Card className={`bg-white/98 backdrop-blur-sm border-0 shadow-lg ${isDesktop ? 'shadow-xl' : ''}`}>
      <CardContent className={`${isDesktop ? 'p-6' : 'p-4'}`}>
        <h3 className={`font-semibold mb-4 flex items-center gap-2 ${isDesktop ? 'text-lg' : 'text-base'} text-gray-800`}>
          <Icon 
            name="Camera" 
            size={isDesktop ? 18 : 16} 
            className="text-purple-500" 
          />
          Мои фотографии ({user.photos.length}/{maxPhotos})
        </h3>

        <PhotoGallery 
          photos={user.photos} 
          isOwner={true}
          maxPhotos={maxPhotos}
        />

        {/* Статистика фотографий */}
        {user.photos.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              +{user.photos.length * 15}% больше просмотров профиля
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfilePhotos;