import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

interface PhotoUploadProps {
  onUpload?: (photoId: string) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onUpload }) => {
  const { uploadPhoto } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Размер файла не должен превышать 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение');
        return;
      }

      try {
        const photoId = await uploadPhoto(file);
        onUpload?.(photoId);
      } catch (error) {
        console.error('Ошибка загрузки фото:', error);
        alert('Ошибка при загрузке фотографии');
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card 
      className="border-2 border-dashed border-gray-300 hover:border-love-DEFAULT/50 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
      onClick={handleClick}
    >
      <div className="aspect-square flex flex-col items-center justify-center p-6 text-center">
        <Icon name="Plus" size={32} className="text-gray-400 mb-2" />
        <span className="text-sm text-gray-600 font-medium">Добавить фото</span>
        <span className="text-xs text-gray-400 mt-1">До 5MB</span>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </Card>
  );
};

export default PhotoUpload;