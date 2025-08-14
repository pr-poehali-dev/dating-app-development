import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { User } from '@/contexts/AuthContext';
import ProfileCard from './ProfileCard';



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
    ? "w-full h-screen flex flex-col px-4" 
    : "w-full h-screen flex flex-col px-4";

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


  
  return (
    <div className={containerClass}>
      {headerContent}
      
      {variant === 'tablet' ? (
        <>


          {/* Основной контент */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-0">
            <div className="relative max-w-md w-full h-full">
              <AnimatePresence mode="wait">
                <ProfileCard
                  key={currentProfile.id}
                  profile={currentProfile}
                  dragOffset={{ x: 0, y: 0 }}
                  swipeDirection={null}
                  onSwipe={onSwipe}
                  variant="tablet"
                />
              </AnimatePresence>
            </div>
          </div>


        </>
      ) : (
        <>


          {/* Основной контент */}
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="relative w-full max-w-sm h-full">
              <AnimatePresence mode="wait">
                <ProfileCard
                  key={currentProfile.id}
                  profile={currentProfile}
                  dragOffset={dragOffset}
                  swipeDirection={swipeDirection}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onSwipe={onSwipe}
                  variant="mobile"
                />
              </AnimatePresence>
            </div>
          </div>


        </>
      )}
    </div>
  );
};

export default DiscoverMobile;