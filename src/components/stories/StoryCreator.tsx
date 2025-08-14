import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useStories } from '@/contexts/StoriesContext';
import { useAuth } from '@/contexts/AuthContext';

interface StoryCreatorProps {
  onClose: () => void;
}

const StoryCreator = ({ onClose }: StoryCreatorProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createStory, loading } = useStories();
  const { user } = useAuth();

  const handleFileSelect = (files: FileList) => {
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (validFiles.length === 0) return;

    const newFiles = [...selectedFiles, ...validFiles].slice(0, 10); // Максимум 10 файлов
    setSelectedFiles(newFiles);

    // Создаём превью
    const newPreviews = [...previews];
    validFiles.forEach((file, index) => {
      if (newPreviews.length + index < 10) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPreviews(prev => [...prev.slice(0, newPreviews.length + index), result, ...prev.slice(newPreviews.length + index + 1)]);
        };
        reader.readAsDataURL(file);
        newPreviews.push(''); // Placeholder
      }
    });
    setPreviews(newPreviews);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateStory = async () => {
    if (selectedFiles.length === 0 || !user) return;

    try {
      await createStory({
        media: selectedFiles,
        userId: user.id
      });
      onClose();
    } catch (error) {
      console.error('Error creating story:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Создать историю</h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            {/* Область загрузки */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="Upload" size={32} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">
                Перетащите файлы сюда или нажмите для выбора
              </p>
              <p className="text-sm text-gray-500">
                Поддерживаются фото и видео (до 10 файлов)
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>

            {/* Превью выбранных файлов */}
            {selectedFiles.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Выбранные файлы:
                  </span>
                  <Badge variant="secondary">
                    {selectedFiles.length}/10
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  <AnimatePresence>
                    {selectedFiles.map((file, index) => (
                      <motion.div
                        key={`${file.name}-${index}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="relative group aspect-square"
                      >
                        {file.type.startsWith('image/') ? (
                          <img
                            src={previews[index] || ''}
                            alt={file.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center relative">
                            {previews[index] && (
                              <img
                                src={previews[index]}
                                alt={file.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            )}
                            <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                              <Icon name="Play" size={20} className="text-white" />
                            </div>
                          </div>
                        )}
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Icon name="X" size={12} />
                        </Button>
                        
                        <div className="absolute bottom-1 left-1 bg-black/50 rounded px-1">
                          <span className="text-xs text-white">
                            {file.type.startsWith('video/') ? 'Видео' : 'Фото'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Кнопки действий */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Отмена
              </Button>
              <Button
                onClick={handleCreateStory}
                disabled={selectedFiles.length === 0 || loading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Создание...
                  </>
                ) : (
                  <>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Создать историю
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default StoryCreator;