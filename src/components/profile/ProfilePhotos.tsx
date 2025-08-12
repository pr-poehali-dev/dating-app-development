import { useState, useRef } from 'react';
import { User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface ProfilePhotosProps {
  user: User;
  variant?: 'desktop' | 'mobile';
  onPhotosChange?: (photos: string[]) => void;
}

const ProfilePhotos = ({ user, variant = 'mobile', onPhotosChange }: ProfilePhotosProps) => {
  const [photos, setPhotos] = useState<string[]>(user.photos || []);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDesktop = variant === 'desktop';

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);

    // Конвертируем файлы в base64 URLs для демонстрации
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhotoUrl = e.target?.result as string;
          setPhotos(prev => {
            const updated = [...prev, newPhotoUrl];
            onPhotosChange?.(updated);
            return updated;
          });
        };
        reader.readAsDataURL(file);
      }
    });

    // Симулируем загрузку
    setTimeout(() => {
      setIsUploading(false);
    }, 1500);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => {
      const updated = prev.filter((_, i) => i !== index);
      onPhotosChange?.(updated);
      return updated;
    });
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const maxPhotos = 6;
  const gridCols = isDesktop ? 'grid-cols-3' : 'grid-cols-2';
  const photoSize = isDesktop ? 'h-32' : 'h-24';

  return (
    <Card className={`bg-white/98 backdrop-blur-sm border-0 shadow-lg ${isDesktop ? 'shadow-xl' : ''}`}>
      <CardContent className={`${isDesktop ? 'p-6' : 'p-4'}`}>
        <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isDesktop ? 'text-lg' : 'text-base'} text-gray-800`}>
          <Icon 
            name="Camera" 
            size={isDesktop ? 18 : 16} 
            className="text-purple-500" 
          />
          Фотографии ({photos.length}/{maxPhotos})
        </h3>

        <div className={`grid ${gridCols} gap-2 mb-3`}>
          {/* Отображаем загруженные фотографии */}
          {photos.map((photo, index) => (
            <div key={index} className={`${photoSize} relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
              <img 
                src={photo} 
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              
              {/* Наложение с кнопкой удаления */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-2 right-2 w-6 h-6 p-0 rounded-full shadow-sm hover:scale-110"
                >
                  <Icon name="X" size={12} />
                </Button>
              </div>

              {/* Индикатор главного фото */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-0.5 rounded-md text-xs font-medium shadow-sm">
                  Главное
                </div>
              )}
            </div>
          ))}

          {/* Слоты для добавления новых фотографий */}
          {Array.from({ length: maxPhotos - photos.length }).map((_, index) => (
            <div
              key={`empty-${index}`}
              onClick={handleAddPhotoClick}
              className={`${photoSize} border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer 
                hover:border-purple-400 hover:bg-purple-50/50 transition-all group ${
                isUploading ? 'pointer-events-none' : ''
              }`}
            >
              {isUploading && index === 0 ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-500">Загрузка</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-0.5">
                  <Icon name="Plus" size={18} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                  {index === 0 && photos.length === 0 && (
                    <span className="text-xs text-gray-400 group-hover:text-purple-500 text-center px-1">Фото</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Скрытый input для выбора файлов */}
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          className="hidden"
        />

        {/* Кнопка добавления фотографий - только если нет фото или меньше лимита */}
        {photos.length < maxPhotos && (
          <Button 
            variant="outline" 
            size={isDesktop ? "default" : "sm"}
            className="w-full border-purple-200 hover:bg-purple-50 hover:border-purple-400 text-sm"
            onClick={handleAddPhotoClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                Загрузка...
              </>
            ) : (
              <>
                <Icon name="Upload" size={14} className="mr-2" />
                Добавить фото
              </>
            )}
          </Button>
        )}

        {/* Компактные подсказки */}
        <div className={`${photos.length < maxPhotos ? 'mt-3' : 'mt-2'} text-center`}>
          <p className="text-xs text-gray-500">
            {photos.length === 0 
              ? 'Добавьте фото, чтобы привлечь больше внимания' 
              : `${photos.length}/${maxPhotos} фото • +${photos.length * 15}% просмотров`
            }
          </p>
        </div>


      </CardContent>
    </Card>
  );
};

export default ProfilePhotos;