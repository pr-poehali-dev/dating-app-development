import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth, UserPhoto } from '@/contexts/AuthContext';
import PhotoUpload from './PhotoUpload';

interface PhotoGalleryProps {
  photos: UserPhoto[];
  isOwner?: boolean;
  maxPhotos?: number;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ 
  photos, 
  isOwner = false,
  maxPhotos = 6 
}) => {
  const { setMainPhoto, deletePhoto } = useAuth();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleSetMain = (photoId: string) => {
    setMainPhoto(photoId);
  };

  const handleDelete = (photoId: string) => {
    if (confirm('Удалить эту фотографию?')) {
      deletePhoto(photoId);
    }
  };

  const handlePhotoClick = (photoId: string) => {
    setSelectedPhoto(photoId);
  };

  const sortedPhotos = [...photos].sort((a, b) => {
    if (a.isMain) return -1;
    if (b.isMain) return 1;
    return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
  });

  return (
    <div className="space-y-4">
      {/* Галерея фотографий */}
      <div className="grid grid-cols-3 gap-3">
        {sortedPhotos.map((photo, index) => (
          <Card 
            key={photo.id}
            className="relative overflow-hidden aspect-square cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handlePhotoClick(photo.id)}
          >
            <img 
              src={photo.url} 
              alt={`Фото ${index + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Бейдж основной фотографии */}
            {photo.isMain && (
              <div className="absolute top-2 left-2 bg-love-DEFAULT text-white px-2 py-1 rounded-full text-xs font-medium">
                Основная
              </div>
            )}
            
            {/* Кнопки управления для владельца */}
            {isOwner && (
              <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex gap-2">
                  {!photo.isMain && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetMain(photo.id);
                      }}
                      className="bg-white text-black hover:bg-gray-100"
                    >
                      <Icon name="Star" size={16} />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo.id);
                    }}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
        
        {/* Кнопка добавления новых фото */}
        {isOwner && photos.length < maxPhotos && (
          <PhotoUpload />
        )}
      </div>

      {/* Модальное окно просмотра фото */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={sortedPhotos.find(p => p.id === selectedPhoto)?.url}
              alt="Увеличенное фото"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
              onClick={() => setSelectedPhoto(null)}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>
      )}

      {/* Подсказка */}
      {isOwner && photos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Icon name="Camera" size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">Добавьте свои фотографии</p>
          <p className="text-sm">Загрузите до {maxPhotos} фотографий, чтобы другие пользователи могли лучше узнать вас</p>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;