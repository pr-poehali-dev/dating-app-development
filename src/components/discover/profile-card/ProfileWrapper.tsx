import { motion } from 'framer-motion';
import { User } from '@/contexts/AuthContext';
import { DemoUser } from '@/data/demoUsers';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ProfilePhoto from './ProfilePhoto';
import ProfileInfo from './ProfileInfo';

interface ProfileWrapperProps {
  profile: User | DemoUser;
  dragOffset: { x: number; y: number };
  swipeDirection: 'left' | 'right' | 'up' | null;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
  onSwipe?: (direction: 'left' | 'right' | 'up') => void;
  variant?: 'desktop' | 'tablet' | 'mobile';
}

const ProfileWrapper = ({
  profile,
  dragOffset,
  swipeDirection,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onSwipe,
  variant = 'mobile'
}: ProfileWrapperProps) => {
  const getSwipeColor = () => {
    if (!swipeDirection) return 'transparent';
    if (swipeDirection === 'right') return '#10B981';
    if (swipeDirection === 'left') return '#EF4444';
    if (swipeDirection === 'up') return '#3B82F6';
    return 'transparent';
  };

  const cardSizes = {
    desktop: 'w-80 xl:w-96 h-[calc(100vh-180px)] max-h-[600px]',
    tablet: 'w-full h-[calc(100vh-200px)]',
    mobile: 'w-full h-[calc(100vh-160px)]'
  };

  const avatarSizes = {
    desktop: { container: 'w-40 h-40', icon: 80 },
    tablet: { container: 'w-32 h-32', icon: 64 },
    mobile: { container: 'w-36 h-36', icon: 72 }
  };

  const textSizes = {
    desktop: { title: 'text-2xl', subtitle: 'text-lg', bio: 'text-base' },
    tablet: { title: 'text-xl', subtitle: 'text-base', bio: 'text-sm' },
    mobile: { title: 'text-2xl', subtitle: 'text-lg', bio: 'text-base' }
  };

  const showSwipeHints = variant === 'mobile';
  const isMobile = variant === 'mobile';

  return (
    <motion.div
      key={profile.id}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      initial={{ 
        scale: variant === 'desktop' ? 0.9 : 0.95, 
        opacity: 0, 
        ...(variant === 'desktop' ? { rotateY: -30 } : { y: 50 })
      }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        ...(variant === 'desktop' ? { rotateY: 0 } : { y: 0 }),
        ...(isMobile ? {
          x: dragOffset.x * 0.3,
          rotate: dragOffset.x * 0.05
        } : {})
      }}
      exit={{ 
        scale: variant === 'desktop' ? 0.9 : 0.95, 
        opacity: 0, 
        ...(variant === 'desktop' ? { rotateY: 30 } : { y: -50 })
      }}
      transition={{ 
        duration: variant === 'desktop' ? 0.5 : 0.3, 
        ease: "easeInOut",
        ...(isMobile ? { type: "spring", damping: 25, stiffness: 300 } : {})
      }}
      className={cn(
        "absolute inset-0",
        variant === 'desktop' ? "cursor-grab active:cursor-grabbing" : "touch-none",
        "w-full h-full"
      )}
      style={isMobile ? {
        border: swipeDirection ? `3px solid ${getSwipeColor()}` : 'none',
        borderRadius: '24px',
      } : undefined}
    >
      <Card className={cn(
        "w-full h-full overflow-hidden border-0 shadow-2xl",
        cardSizes[variant],
        variant === 'desktop' 
          ? "bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-300"
          : "bg-white/95 backdrop-blur-sm"
      )}>
        <ProfilePhoto
          profile={profile}
          variant={variant}
          swipeDirection={swipeDirection}
          dragOffset={dragOffset}
          avatarSizes={avatarSizes}
          onSwipe={onSwipe}
        />
      </Card>
    </motion.div>
  );
};

export default ProfileWrapper;