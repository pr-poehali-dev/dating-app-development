import { AnimatePresence } from 'framer-motion';
import { User } from '@/contexts/AuthContext';
import ProfileCard from './ProfileCard';
import SwipeActions from './SwipeActions';
import StatsBar from './StatsBar';

interface DiscoverDesktopProps {
  currentProfile: User;
  superLikes: number;
  matches: string[];
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
}

const DiscoverDesktop = ({
  currentProfile,
  superLikes,
  matches,
  onSwipe
}: DiscoverDesktopProps) => {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Откройте для себя новых людей
        </h1>
        <p className="text-gray-600 text-lg">
          Найдите свою половинку среди тысяч интересных профилей
        </p>
      </div>

      <div className="flex justify-center items-center gap-8">
        {/* Статистика */}
        <StatsBar 
          superLikes={superLikes}
          matches={matches.length}
          variant="desktop"
          layout="sidebar"
        />

        {/* Основная карточка */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <ProfileCard
              key={currentProfile.id}
              profile={currentProfile}
              dragOffset={{ x: 0, y: 0 }}
              swipeDirection={null}
              variant="desktop"
            />
          </AnimatePresence>
        </div>

        {/* Кнопки действий */}
        <SwipeActions
          onSwipeLeft={() => onSwipe('left')}
          onSwipeUp={() => onSwipe('up')}
          onSwipeRight={() => onSwipe('right')}
          superLikes={superLikes}
          variant="desktop"
          orientation="vertical"
        />
      </div>
    </div>
  );
};

export default DiscoverDesktop;