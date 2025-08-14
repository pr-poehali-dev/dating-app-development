import { AnimatePresence } from 'framer-motion';
import { User } from '@/contexts/AuthContext';
import ProfileCard from './ProfileCard';
import SwipeActions from './SwipeActions';


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
    <div className="w-full h-screen flex flex-col">
      {/* Заголовок */}
      <div className="text-center py-6 px-6">
        <h1 className="text-3xl xl:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Откройте для себя новых людей
        </h1>
        <p className="text-gray-600 text-base xl:text-lg">
          Найдите свою половинку среди тысяч интересных профилей
        </p>
      </div>

      {/* Основной контент */}
      <div className="flex-1 flex justify-center items-center gap-4 lg:gap-6 xl:gap-8 px-6 pb-6 min-h-0">


        {/* Основная карточка */}
        <div className="relative flex-shrink-0">
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
        <div className="flex-shrink-0">
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
    </div>
  );
};

export default DiscoverDesktop;