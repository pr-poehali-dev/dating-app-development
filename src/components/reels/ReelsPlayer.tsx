import { useState, useRef, useEffect, useCallback } from 'react';
import { SwipeDirection } from '@/types/reels';
import { useReels } from '@/hooks/useReels';
import VideoPlayer from './VideoPlayer';
import ReelsActions from './ReelsActions';
import ReelsInfo from './ReelsInfo';
import ReelsComments from './ReelsComments';
import { cn } from '@/lib/utils';

interface ReelsPlayerProps {
  className?: string;
}

const ReelsPlayer = ({ className }: ReelsPlayerProps) => {
  const {
    reels,
    currentIndex,
    isPlaying,
    videoRefs,
    getCurrentReel,
    nextReel,
    previousReel,
    togglePlay,
    handleAction,
    loadMoreReels
  } = useReels();

  const [showComments, setShowComments] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const currentReel = getCurrentReel();

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x) return;

    const diffX = touchStart.x - touchEnd.x;
    const diffY = touchStart.y - touchEnd.y;
    const minSwipeDistance = 50;

    if (Math.abs(diffY) > Math.abs(diffX)) {
      if (Math.abs(diffY) > minSwipeDistance) {
        if (diffY > 0) {
          nextReel();
        } else {
          previousReel();
        }
      }
    }

    setTouchStart({ x: 0, y: 0 });
    setTouchEnd({ x: 0, y: 0 });
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        previousReel();
        break;
      case 'ArrowDown':
        e.preventDefault();
        nextReel();
        break;
      case ' ':
        e.preventDefault();
        togglePlay();
        break;
    }
  }, [nextReel, previousReel, togglePlay]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (currentIndex >= reels.length - 2) {
      loadMoreReels();
    }
  }, [currentIndex, reels.length, loadMoreReels]);

  const setVideoRef = useCallback((index: number) => {
    return (ref: HTMLVideoElement | null) => {
      if (videoRefs.current) {
        videoRefs.current[index] = ref;
      }
    };
  }, [videoRefs]);

  if (!currentReel) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-white">Загружаем Reels...</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn("relative h-screen bg-black overflow-hidden", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video Stack */}
      <div className="relative w-full h-full">
        {reels.slice(Math.max(0, currentIndex - 1), currentIndex + 3).map((reel, index) => {
          const actualIndex = Math.max(0, currentIndex - 1) + index;
          const isActive = actualIndex === currentIndex;
          const offset = actualIndex - currentIndex;
          
          return (
            <div
              key={reel.id}
              className={cn(
                "absolute inset-0 transition-transform duration-300",
                offset === 0 && "z-10",
                offset > 0 && `translate-y-full z-${Math.max(1, 10 - offset)}`,
                offset < 0 && `-translate-y-full z-${Math.max(1, 10 + offset)}`
              )}
            >
              <VideoPlayer
                reel={reel}
                isActive={isActive}
                isPlaying={isPlaying && isActive}
                onTogglePlay={togglePlay}
                onVideoRef={setVideoRef(actualIndex)}
                className="w-full h-full"
              />
            </div>
          );
        })}

        {/* UI Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="relative w-full h-full flex">
            {/* Left Side - User Info */}
            <div className="flex-1 flex flex-col justify-end p-4 pointer-events-auto">
              <ReelsInfo reel={currentReel} />
            </div>

            {/* Right Side - Actions */}
            <div className="flex flex-col justify-end p-4 pointer-events-auto">
              <ReelsActions
                reel={currentReel}
                onAction={handleAction}
                onOpenComments={() => setShowComments(true)}
              />
            </div>
          </div>
        </div>

        {/* Navigation Hints */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 text-white/50 text-sm">
          ↑↓ для переключения • Space для паузы
        </div>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <ReelsComments
          reel={currentReel}
          isOpen={showComments}
          onClose={() => setShowComments(false)}
          onAddComment={(text) => {
            console.log('Add comment:', text);
            setShowComments(false);
          }}
        />
      )}
    </div>
  );
};

export default ReelsPlayer;