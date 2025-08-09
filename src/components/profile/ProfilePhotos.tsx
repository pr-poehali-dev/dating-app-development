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
  const gridCols = isDesktop ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <Card className={`bg-white/95 backdrop-blur-sm border-0 ${isDesktop ? 'shadow-xl' : 'shadow-lg'}`}>
      <CardContent className="p-6">
        <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDesktop ? 'text-xl' : 'font-semibold'}`}>
          <Icon 
            name="Camera" 
            size={isDesktop ? 20 : 18} 
            className="text-purple-500" 
          />
          Фотографии ({photos.length}/{maxPhotos})
        </h3>

        <div className={`grid ${gridCols} gap-3 mb-4`}>
          {/* Отображаем загруженные фотографии */}
          {photos.map((photo, index) => (
            <div key={index} className="aspect-square relative group rounded-xl overflow-hidden">
              <img 
                src={photo} 
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Наложение с кнопкой удаления */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemovePhoto(index)}
                  className="w-8 h-8 p-0 rounded-full"
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>

              {/* Индикатор главного фото */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
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
              className={`aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer 
                hover:border-purple-400 hover:bg-purple-50 transition-all group ${
                isUploading ? 'pointer-events-none' : ''
              }`}
            >
              {isUploading && index === 0 ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-500">Загрузка...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Icon name="Plus" size={24} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                  {index === 0 && (
                    <span className="text-xs text-gray-400 group-hover:text-purple-500">Добавить</span>
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

        {/* Кнопка добавления фотографий */}
        <Button 
          variant="outline" 
          className="w-full border-purple-200 hover:bg-purple-50 hover:border-purple-400"
          onClick={handleAddPhotoClick}
          disabled={isUploading || photos.length >= maxPhotos}
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              Загрузка...
            </>
          ) : (
            <>
              <Icon name="Upload" size={16} className="mr-2" />
              {photos.length >= maxPhotos 
                ? 'Достигнут лимит фотографий' 
                : (isDesktop ? 'Добавить фото' : 'Добавить фотографии')
              }
            </>
          )}
        </Button>

        {/* Подсказки */}
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-500 text-center">
            {isDesktop 
              ? 'Добавьте до 6 качественных фотографий для лучшего результата'
              : 'Качественные фото привлекают больше внимания'
            }
          </p>
          
          {/* Дополнительные советы для десктопа */}
          {isDesktop && (
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex items-center gap-2">
                <Icon name="Check" size={12} className="text-green-500" />
                <span>Первое фото станет главным в профиле</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={12} className="text-green-500" />
                <span>Поддерживаются форматы: JPG, PNG, WEBP</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={12} className="text-green-500" />
                <span>Максимальный размер файла: 5MB</span>
              </div>
            </div>
          )}
        </div>

        {/* Статистика */}
        {photos.length > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-pink-600">
                <Icon name="Eye" size={14} />
                <span>+{photos.length * 15}% просмотров</span>
              </div>
              <div className="flex items-center gap-1 text-purple-600">
                <Icon name="Heart" size={14} />
                <span>+{photos.length * 20}% лайков</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfilePhotos;