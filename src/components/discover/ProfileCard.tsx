import { User } from '@/contexts/AuthContext';
import ProfileWrapper from './profile-card/ProfileWrapper';

interface ProfileCardProps {
  profile: User;
  dragOffset: { x: number; y: number };
  swipeDirection: 'left' | 'right' | 'up' | null;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
  onSwipe?: (direction: 'left' | 'right' | 'up') => void;
  variant?: 'desktop' | 'tablet' | 'mobile';
}

const ProfileCard = ({
  profile,
  dragOffset,
  swipeDirection,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onSwipe,
  variant = 'mobile'
}: ProfileCardProps) => {
  return (
    <ProfileWrapper
      profile={profile}
      dragOffset={dragOffset}
      swipeDirection={swipeDirection}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onSwipe={onSwipe}
      variant={variant}
    />
  );
};

export default ProfileCard;