import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Story, StoryProgress as StoryProgressType } from '@/types/story';
import { useStories } from '@/contexts/StoriesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDevice } from '@/hooks/useDevice';
import StoryProgressBar from './StoryProgress';
import StoryAuthorInfo from './StoryAuthorInfo';
import StoryContent from './StoryContent';
import StoryControls from './StoryControls';
import StoryMobileInteractions from './StoryMobileInteractions';
import StoryReactions from './StoryReactions';
import StoryNavigation from './StoryNavigation';

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
  const [progress, setProgress] = useState<StoryProgressType>({
    currentIndex: initialMediaIndex,
    isPlaying: true,
    progress: 0
  });
  const [showControls, setShowControls] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [reactionPosition, setReactionPosition] = useState({ x: 0, y: 0 });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const pauseTimeoutRef = useRef<NodeJS.Timeout>();
  
  const { viewStory, addReaction, toggleLike } = useStories();
  const { user } = useAuth();
  const { isTouch } = useDevice();

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

  // Переход к предыдущей/следующей истории
  const goToPreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setCurrentMediaIndex(0);
      setProgress({ currentIndex: 0, isPlaying: true, progress: 0 });
    }
  };

  const goToNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentMediaIndex(0);
      setProgress({ currentIndex: 0, isPlaying: true, progress: 0 });
    }
  };

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
      if (!isTouch) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Обработчики реакций
  const handleAddReaction = (emoji: string) => {
    addReaction(currentStory.id, emoji);
    setShowReactions(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isTouch) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setReactionPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setShowReactions(true);
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

  // Автоскрытие реакций
  useEffect(() => {
    if (showReactions) {
      const timeout = setTimeout(() => {
        setShowReactions(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [showReactions]);

  if (!currentStory || !currentMedia) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onMouseMove={showControlsTemporarily}
      onClick={showControlsTemporarily}
    >
      <StoryProgressBar 
        story={currentStory}
        currentMediaIndex={currentMediaIndex}
        progress={progress}
        isTouch={isTouch}
      />

      <StoryAuthorInfo 
        story={currentStory}
        showControls={showControls}
      />

      <StoryContent
        media={currentMedia}
        isTouch={isTouch}
        isPaused={isPaused}
        videoRef={videoRef}
        onPreviousMedia={previousMedia}
        onNextMedia={nextMedia}
        onTogglePause={togglePause}
        onDoubleClick={handleDoubleClick}
      />

      <StoryControls
        showControls={showControls}
        isTouch={isTouch}
        isPaused={isPaused}
        onTogglePause={togglePause}
        onClose={onClose}
      />

      {isTouch && (
        <StoryMobileInteractions
          story={currentStory}
          userId={user?.id}
          onToggleLike={toggleLike}
          onShowReactions={() => setShowReactions(true)}
        />
      )}

      {!isTouch && (
        <StoryNavigation
          showControls={showControls}
          currentStoryIndex={currentStoryIndex}
          storiesLength={stories.length}
          onPreviousStory={goToPreviousStory}
          onNextStory={goToNextStory}
        />
      )}

      <StoryReactions
        story={currentStory}
        showReactions={showReactions}
        reactionPosition={reactionPosition}
        isTouch={isTouch}
        onAddReaction={handleAddReaction}
        onCloseReactions={() => setShowReactions(false)}
      />
    </motion.div>
  );
};

export default StoryViewer;