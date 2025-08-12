import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { User } from '@/contexts/AuthContext';
import ProfileCard from './ProfileCard';
import SwipeActions from './SwipeActions';
import StatsBar from './StatsBar';

interface DiscoverMobileProps {
  currentProfile: User;
  superLikes: number;
  matches: string[];
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  variant?: 'mobile' | 'tablet';
}

const DiscoverMobile = ({
  currentProfile,
  superLikes,
  matches,
  onSwipe,
  variant = 'mobile'
}: DiscoverMobileProps) => {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartPos.x;
    const deltaY = touch.clientY - touchStartPos.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left');
    } else if (deltaY < -50) {
      setSwipeDirection('up');
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold || Math.abs(dragOffset.y) > threshold) {
      if (swipeDirection) {
        onSwipe(swipeDirection);
      }
    }
    
    setDragOffset({ x: 0, y: 0 });
    setSwipeDirection(null);
    setIsDragging(false);
  };

  const containerClass = variant === 'tablet' 
    ? "w-full h-full flex flex-col px-4" 
    : "w-full h-full flex flex-col px-4";

  const headerContent = variant === 'tablet' ? (
    <div className="text-center py-4">
      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Новые знакомства
      </h1>
    </div>
  ) : (
    <div className="text-center py-3">
      <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
        Новые знакомства
      </h1>
    </div>
  );

  const statsLayout = variant === 'tablet' ? 'horizontal' : 'horizontal';
  
  return (
    <div className={containerClass}>
      {headerContent}
      
      {variant === 'tablet' ? (
        <>
          {/* Статистика */}
          <div className="flex-shrink-0 mb-4">
            <StatsBar 
              superLikes={superLikes}
              matches={matches.length}
              variant={variant}
              layout={statsLayout}
            />
          </div>

          {/* Основной контент */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative max-w-md w-full h-full max-h-[calc(100vh-200px)]">
              <AnimatePresence mode="wait">
                <ProfileCard
                  key={currentProfile.id}
                  profile={currentProfile}
                  dragOffset={{ x: 0, y: 0 }}
                  swipeDirection={null}
                  variant="tablet"
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex-shrink-0 py-4">
            <SwipeActions
              onSwipeLeft={() => onSwipe('left')}
              onSwipeUp={() => onSwipe('up')}
              onSwipeRight={() => onSwipe('right')}
              superLikes={superLikes}
              variant="tablet"
            />
          </div>
        </>
      ) : (
        <>
          {/* Статистика */}
          <div className="flex-shrink-0">
            <StatsBar 
              superLikes={superLikes}
              matches={matches.length}
              variant="mobile"
              layout="horizontal"
            />
          </div>

          {/* Основной контент */}
          <div className="flex-1 flex items-center justify-center py-2">
            <div className="relative w-full max-w-sm h-full max-h-[calc(100vh-180px)]">
              <AnimatePresence mode="wait">
                <ProfileCard
                  key={currentProfile.id}
                  profile={currentProfile}
                  dragOffset={dragOffset}
                  swipeDirection={swipeDirection}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  variant="mobile"
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex-shrink-0 pb-20">
            <SwipeActions
              onSwipeLeft={() => onSwipe('left')}
              onSwipeUp={() => onSwipe('up')}
              onSwipeRight={() => onSwipe('right')}
              superLikes={superLikes}
              variant="mobile"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DiscoverMobile;