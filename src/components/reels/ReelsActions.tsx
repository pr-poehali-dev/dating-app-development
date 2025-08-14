import { useState } from 'react';
import { ReelVideo, ReelsAction } from '@/types/reels';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface ReelsActionsProps {
  reel: ReelVideo;
  onAction: (action: ReelsAction, reelId: string, data?: any) => void;
  onOpenComments: () => void;
  className?: string;
}

const ReelsActions = ({ 
  reel, 
  onAction, 
  onOpenComments,
  className 
}: ReelsActionsProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleLike = () => {
    onAction('like', reel.id);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onAction('follow', reel.id);
  };

  const handleShare = async () => {
    setIsSharing(true);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Reels от ${reel.user.name}`,
          text: reel.caption,
          url: window.location.href
        });
        onAction('share', reel.id);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      onAction('share', reel.id);
    }
    
    setIsSharing(false);
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* User Avatar + Follow */}
      <div className="relative">
        <img
          src={reel.user.avatar}
          alt={reel.user.name}
          className="w-12 h-12 rounded-full border-2 border-white object-cover"
        />
        {!isFollowing && (
          <Button
            size="sm"
            onClick={handleFollow}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 p-0"
          >
            <Icon name="Plus" size={12} className="text-white" />
          </Button>
        )}
      </div>

      {/* Like */}
      <div className="flex flex-col items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className="p-2 hover:bg-white/10"
        >
          <Icon 
            name={reel.isLiked ? "Heart" : "Heart"} 
            size={28} 
            className={cn(
              "transition-colors",
              reel.isLiked ? "text-red-500 fill-red-500" : "text-white"
            )}
          />
        </Button>
        <span className="text-white text-xs font-medium">
          {reel.likes.length > 0 && (
            reel.likes.length > 999 
              ? `${(reel.likes.length / 1000).toFixed(1)}K`
              : reel.likes.length
          )}
        </span>
      </div>

      {/* Comments */}
      <div className="flex flex-col items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenComments}
          className="p-2 hover:bg-white/10"
        >
          <Icon name="MessageCircle" size={28} className="text-white" />
        </Button>
        <span className="text-white text-xs font-medium">
          {reel.comments.length > 0 && (
            reel.comments.length > 999 
              ? `${(reel.comments.length / 1000).toFixed(1)}K`
              : reel.comments.length
          )}
        </span>
      </div>

      {/* Share */}
      <div className="flex flex-col items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          disabled={isSharing}
          className="p-2 hover:bg-white/10"
        >
          <Icon 
            name={isSharing ? "Loader2" : "Send"} 
            size={28} 
            className={cn(
              "text-white",
              isSharing && "animate-spin"
            )}
          />
        </Button>
        <span className="text-white text-xs font-medium">
          {reel.shares > 0 && (
            reel.shares > 999 
              ? `${(reel.shares / 1000).toFixed(1)}K`
              : reel.shares
          )}
        </span>
      </div>

      {/* More Actions */}
      <Button
        variant="ghost"
        size="sm"
        className="p-2 hover:bg-white/10"
      >
        <Icon name="MoreHorizontal" size={28} className="text-white" />
      </Button>

      {/* Music Disc Animation */}
      {reel.musicTitle && (
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-spin-slow flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <Icon name="Music" size={16} className="text-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReelsActions;