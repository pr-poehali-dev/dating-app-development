import { motion } from 'framer-motion';
import { User } from '@/contexts/AuthContext';
import { useStories } from '@/contexts/StoriesContext';
import Icon from '@/components/ui/icon';
import StoryAvatar from '@/components/ui/StoryAvatar';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ProfilePhotoProps {
  profile: User;
  variant: 'desktop' | 'tablet' | 'mobile';
  swipeDirection: 'left' | 'right' | 'up' | null;
  dragOffset: { x: number; y: number };
  avatarSizes: { [key: string]: { container: string; icon: number } };
  onSwipe?: (direction: 'left' | 'right' | 'up') => void;
}

const ProfilePhoto = ({
  profile,
  variant,
  swipeDirection,
  dragOffset,
  avatarSizes,
  onSwipe
}: ProfilePhotoProps) => {
  const navigate = useNavigate();
  const { getUserActiveStories, hasUnviewedStories } = useStories();
  
  const hasActiveStories = getUserActiveStories(profile.id).length > 0;
  const hasUnviewed = hasUnviewedStories(profile.id);
  
  const handleStoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasActiveStories) {
      navigate('/stories', { state: { userId: profile.id } });
    }
  };
  return (
    <div className={cn(
      "relative bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600",
      "h-full",
      variant === 'mobile' && "overflow-hidden"
    )}>
      {variant === 'desktop' && (
        <div className="absolute inset-0 bg-black/10" />
      )}
      
      {/* Декоративные элементы для мобильной версии */}
      {variant === 'mobile' && (
        <>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        </>
      )}
      
      {/* Фото профиля */}
      <div className="absolute inset-0">
        {profile.photos && profile.photos.length > 0 ? (
          <StoryAvatar
            hasStory={hasActiveStories}
            viewed={!hasUnviewed}
            onClick={handleStoryClick}
            className="w-full h-full"
            size="xl"
          >
            <img 
              src={profile.photos.find(p => p.isMain)?.url || profile.photos[0]?.url} 
              alt={profile.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </StoryAvatar>
        ) : (
          <div className="flex items-center justify-center h-full">
            <StoryAvatar
              hasStory={hasActiveStories}
              viewed={!hasUnviewed}
              onClick={handleStoryClick}
              size="xl"
            >
              <div className={cn(
                "bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm",
                avatarSizes[variant].container,
                variant === 'mobile' && "shadow-xl"
              )}>
                <Icon name="User" size={avatarSizes[variant].icon} className="text-white" />
              </div>
            </StoryAvatar>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      </div>
      
      {/* Бейджи верификации и премиум */}
      {profile.verified && (
        <div className={cn(
          "absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm rounded-full p-2 shadow-lg",
          variant === 'tablet' && "p-2",
          variant === 'desktop' && "p-3"
        )}>
          <Icon 
            name="ShieldCheck" 
            size={variant === 'desktop' ? 20 : 18} 
            className="text-white" 
          />
        </div>
      )}
      
      {profile.subscription === 'premium' && (
        <div className={cn(
          "absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg",
          variant === 'mobile' ? "px-3 py-1" : "px-4 py-2"
        )}>
          <div className="flex items-center gap-1">
            <Icon 
              name="Crown" 
              size={variant === 'mobile' ? 14 : 16} 
              className="text-white" 
            />
            <span className={cn(
              "text-white font-bold",
              variant === 'mobile' ? "text-xs" : "text-sm"
            )}>
              Premium
            </span>
          </div>
        </div>
      )}
      
      {/* Индикаторы свайпа для мобильной версии */}
      {variant === 'mobile' && (
        <>
          {swipeDirection === 'right' && Math.abs(dragOffset.x) > 50 && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm"
            >
              <div className="bg-green-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-xl">
                ❤️ ЛАЙК
              </div>
            </motion.div>
          )}
          
          {swipeDirection === 'left' && Math.abs(dragOffset.x) > 50 && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm"
            >
              <div className="bg-red-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-xl">
                ❌ ПРОПУСК
              </div>
            </motion.div>
          )}
          
          {swipeDirection === 'up' && Math.abs(dragOffset.y) > 30 && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-xl shadow-xl">
                ⭐ СУПЕР-ЛАЙК
              </div>
            </motion.div>
          )}
        </>
      )}
      
      {/* Кнопки действий встроенные в фото */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSwipe && onSwipe('left');
          }}
          className="w-12 h-12 bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700/80 transition-colors"
        >
          <Icon name="X" size={20} className="text-white" />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSwipe && onSwipe('up');
          }}
          className="w-10 h-10 bg-blue-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600/90 transition-colors"
        >
          <Icon name="Star" size={16} className="text-white" />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSwipe && onSwipe('right');
          }}
          className="w-12 h-12 bg-green-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-green-600/90 transition-colors"
        >
          <Icon name="Heart" size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ProfilePhoto;