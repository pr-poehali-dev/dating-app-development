import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User } from '@/contexts/AuthContext';

interface ProfilePhotosProps {
  user: User;
}

export default function ProfilePhotos({ user }: ProfilePhotosProps) {
  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Camera" size={20} />
          Фотографии
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {user?.photos && user.photos.length > 0 ? (
            user.photos.map((photo, index) => (
              <div
                key={index}
                className="aspect-square bg-cover bg-center rounded-lg border-2 border-transparent hover:border-love-DEFAULT transition-colors cursor-pointer"
                style={{ backgroundImage: `url(${photo})` }}
              />
            ))
          ) : (
            <>
              <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center">
                <Icon name="User" size={24} className="text-gray-600" />
              </div>
              <div className="aspect-square bg-gradient-to-br from-blue-200 to-cyan-200 rounded-lg flex items-center justify-center">
                <Icon name="Camera" size={20} className="text-gray-600" />
              </div>
              <div className="aspect-square bg-gradient-to-br from-green-200 to-emerald-200 rounded-lg flex items-center justify-center">
                <Icon name="Heart" size={20} className="text-gray-600" />
              </div>
            </>
          )}
          {Array.from({ length: Math.max(0, 6 - (user?.photos?.length || 3)) }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-love-DEFAULT transition-colors cursor-pointer group"
            >
              <Icon 
                name="Plus" 
                size={24} 
                className="text-gray-400 group-hover:text-love-DEFAULT" 
              />
            </div>
          ))}
        </div>
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            Добавьте до 6 фотографий для лучшего результата
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Icon name="Star" size={12} className="mr-1" />
              Главное фото
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Icon name="Eye" size={12} className="mr-1" />
              {Math.floor(Math.random() * 50) + 20} просмотров
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}