import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StoryAvatarProps {
  children: ReactNode;
  hasStory?: boolean;
  viewed?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const StoryAvatar = ({ 
  children, 
  hasStory = false, 
  viewed = false, 
  onClick, 
  className,
  size = 'md' 
}: StoryAvatarProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  const paddingClasses = {
    sm: 'p-0.5',
    md: 'p-1',
    lg: 'p-1.5',
    xl: 'p-2'
  };

  return (
    <div 
      className={cn(
        'relative flex items-center justify-center rounded-full',
        sizeClasses[size],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* Анимированная рамка для активных Stories */}
      {hasStory && !viewed && (
        <div className={cn(
          'absolute inset-0 rounded-full animate-spin-slow',
          paddingClasses[size],
          'bg-gradient-to-r from-pink-500 via-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500'
        )}>
          <div className="w-full h-full bg-white rounded-full" />
        </div>
      )}

      {/* Рамка для просмотренных Stories */}
      {hasStory && viewed && (
        <div className={cn(
          'absolute inset-0 rounded-full',
          paddingClasses[size],
          'bg-gray-300'
        )}>
          <div className="w-full h-full bg-white rounded-full" />
        </div>
      )}

      {/* Контент аватарки */}
      <div className={cn(
        'relative rounded-full overflow-hidden',
        hasStory ? (size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-14 h-14' : size === 'lg' ? 'w-17 h-17' : 'w-20 h-20') : 'w-full h-full'
      )}>
        {children}
      </div>

      {/* Эффект при наведении */}
      {onClick && (
        <div className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/10 transition-colors duration-200" />
      )}
    </div>
  );
};

export default StoryAvatar;