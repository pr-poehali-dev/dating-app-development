import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Story, StoryProgress } from '@/types/story';
import { useStories } from '@/contexts/StoriesContext';
import { useAuth } from '@/contexts/AuthContext';

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex?: number;
  initialMediaIndex?: number;
  onClose: () => void;
}

const StoryViewer = ({ 
  stories, 
  initialStoryIndex = 0, 
  initialMediaIndex = 0, 
  onClose 
}: StoryViewerProps) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(initialMediaIndex);
  const [progress, setProgress] = useState<StoryProgress>({
    currentIndex: initialMediaIndex,
    isPlaying: true,
    progress: 0
  });
  const [showControls, setShowControls] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const pauseTimeoutRef = useRef<NodeJS.Timeout>();
  
  const { viewStory } = useStories();
  const { user } = useAuth();

  const currentStory = stories[currentStoryIndex];
  const currentMedia = currentStory?.media[currentMediaIndex];
  
  // Длительность показа (фото - 5 сек, видео - по длительности)
  const getDuration = () => {
    if (currentMedia?.type === 'video' && currentMedia.duration) {
      return currentMedia.duration * 1000;
    }
    return 5000; // 5 секунд для фото
  };

  // Запуск прогресса
  const startProgress = useCallback(() => {
    if (isPaused) return;
    
    const duration = getDuration();
    const interval = 50; // Обновляем каждые 50мс
    const step = (interval / duration) * 100;
    
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev.progress + step;
        if (newProgress >= 100) {
          clearInterval(progressIntervalRef.current);
          return { ...prev, progress: 100 };
        }
        return { ...prev, progress: newProgress };
      });
    }, interval);
  }, [currentMedia, isPaused]);

  // Остановка прогресса
  const stopProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  // Переход к следующему медиа/истории
  const nextMedia = useCallback(() => {
    if (!currentStory) return;

    if (currentMediaIndex < currentStory.media.length - 1) {
      // Следующее медиа в текущей истории
      setCurrentMediaIndex(prev => prev + 1);
      setProgress({ currentIndex: currentMediaIndex + 1, isPlaying: true, progress: 0 });
    } else if (currentStoryIndex < stories.length - 1) {
      // Следующая история
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentMediaIndex(0);
      setProgress({ currentIndex: 0, isPlaying: true, progress: 0 });
    } else {
      // Закрыть просмотрщик
      onClose();
    }
  }, [currentStoryIndex, currentMediaIndex, stories.length, currentStory, onClose]);

  // Переход к предыдущему медиа/истории
  const previousMedia = useCallback(() => {
    if (currentMediaIndex > 0) {
      // Предыдущее медиа в текущей истории
      setCurrentMediaIndex(prev => prev - 1);
      setProgress({ currentIndex: currentMediaIndex - 1, isPlaying: true, progress: 0 });
    } else if (currentStoryIndex > 0) {
      // Предыдущая история
      const prevStoryIndex = currentStoryIndex - 1;
      const prevStory = stories[prevStoryIndex];
      setCurrentStoryIndex(prevStoryIndex);
      setCurrentMediaIndex(prevStory.media.length - 1);
      setProgress({ currentIndex: prevStory.media.length - 1, isPlaying: true, progress: 0 });
    }
  }, [currentStoryIndex, currentMediaIndex, stories]);

  // Пауза/воспроизведение
  const togglePause = () => {
    setIsPaused(prev => !prev);
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  // Показать контролы на короткое время
  const showControlsTemporarily = () => {
    setShowControls(true);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // Эффект для запуска/остановки прогресса
  useEffect(() => {
    stopProgress();
    setProgress(prev => ({ ...prev, progress: 0 }));
    
    if (currentMedia?.type === 'video') {
      // Для видео ждём загрузку
      if (videoRef.current) {
        videoRef.current.onloadeddata = () => {
          if (!isPaused) {
            startProgress();
          }
        };
      }
    } else {
      // Для фото запускаем сразу
      if (!isPaused) {
        startProgress();
      }
    }

    return stopProgress;
  }, [currentMedia, startProgress, isPaused]);

  // Эффект для автоперехода
  useEffect(() => {
    if (progress.progress >= 100) {
      nextMedia();
    }
  }, [progress.progress, nextMedia]);

  // Эффект для отметки просмотра
  useEffect(() => {
    if (currentStory && user) {
      viewStory(currentStory.id, currentMediaIndex);
    }
  }, [currentStory, currentMediaIndex, viewStory, user]);

  // Обработка клавиш
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          previousMedia();
          break;
        case 'ArrowRight':
          nextMedia();
          break;
        case ' ':
          e.preventDefault();
          togglePause();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [previousMedia, nextMedia, onClose]);

  if (!currentStory || !currentMedia) {
    return null;
  }

  // Получаем данные пользователя автора истории
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const storyAuthor = users.find((u: any) => u.id === currentStory.userId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onMouseMove={showControlsTemporarily}
      onClick={showControlsTemporarily}
    >
      {/* Прогресс-бары */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex gap-1">
          {currentStory.media.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: index < currentMediaIndex 
                    ? '100%' 
                    : index === currentMediaIndex 
                      ? `${progress.progress}%` 
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Информация об авторе */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-12 left-4 right-4 z-10"
          >
            <div className="flex items-center gap-3 text-white">
              {storyAuthor?.photos && storyAuthor.photos.length > 0 ? (
                <img
                  src={storyAuthor.photos.find(p => p.isMain)?.url || storyAuthor.photos[0]?.url}
                  alt={storyAuthor.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-white" />
                </div>
              )}
              <div>
                <p className="font-medium">{storyAuthor?.name || 'Пользователь'}</p>
                <p className="text-xs text-white/70">
                  {new Date(currentStory.createdAt).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Контент истории */}
      <div className="relative w-full h-full max-w-md mx-auto">
        {currentMedia.type === 'photo' ? (
          <img
            src={currentMedia.url}
            alt="Story"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={currentMedia.url}
            autoPlay
            muted
            className="w-full h-full object-cover"
            onEnded={nextMedia}
            onPause={() => setIsPaused(true)}
            onPlay={() => setIsPaused(false)}
          />
        )}

        {/* Области для навигации */}
        <div className="absolute inset-0 flex">
          <div 
            className="flex-1 cursor-pointer"
            onClick={previousMedia}
          />
          <div 
            className="flex-1 cursor-pointer"
            onClick={nextMedia}
          />
        </div>

        {/* Центральная кнопка паузы */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Button
                size="lg"
                onClick={togglePause}
                className="rounded-full bg-black/50 hover:bg-black/70 text-white border-0 w-16 h-16"
              >
                <Icon name="Play" size={24} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Контролы */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-4 z-10 flex gap-2"
          >
            <Button
              size="sm"
              onClick={togglePause}
              className="rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
            >
              <Icon name={isPaused ? "Play" : "Pause"} size={16} />
            </Button>
            <Button
              size="sm"
              onClick={onClose}
              className="rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
            >
              <Icon name="X" size={16} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Навигация между историями */}
      {stories.length > 1 && (
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2"
            >
              <Button
                size="sm"
                onClick={() => {
                  if (currentStoryIndex > 0) {
                    setCurrentStoryIndex(prev => prev - 1);
                    setCurrentMediaIndex(0);
                    setProgress({ currentIndex: 0, isPlaying: true, progress: 0 });
                  }
                }}
                disabled={currentStoryIndex === 0}
                className="rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
              >
                <Icon name="ChevronLeft" size={16} />
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (currentStoryIndex < stories.length - 1) {
                    setCurrentStoryIndex(prev => prev + 1);
                    setCurrentMediaIndex(0);
                    setProgress({ currentIndex: 0, isPlaying: true, progress: 0 });
                  }
                }}
                disabled={currentStoryIndex === stories.length - 1}
                className="rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
              >
                <Icon name="ChevronRight" size={16} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default StoryViewer;