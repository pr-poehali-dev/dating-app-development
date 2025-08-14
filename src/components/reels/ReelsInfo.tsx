import { ReelVideo } from '@/types/reels';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ReelsInfoProps {
  reel: ReelVideo;
  className?: string;
}

const ReelsInfo = ({ reel, className }: ReelsInfoProps) => {
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const parseCaption = (caption: string) => {
    const parts = caption.split(/(\s#\w+|\s@\w+)/);
    return parts.map((part, index) => {
      if (part.startsWith(' #')) {
        return (
          <span key={index} className="text-blue-300 hover:text-blue-200 cursor-pointer">
            {part}
          </span>
        );
      } else if (part.startsWith(' @')) {
        return (
          <span key={index} className="text-blue-300 hover:text-blue-200 cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className={`space-y-3 max-w-72 ${className}`}>
      {/* User Info */}
      <div className="flex items-center gap-3">
        <img
          src={reel.user.avatar}
          alt={reel.user.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-white"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold truncate">
              {reel.user.name}
            </h3>
            {reel.user.isVerified && (
              <Icon name="BadgeCheck" size={16} className="text-blue-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-white/70 text-sm truncate">
            {reel.user.username}
          </p>
        </div>
      </div>

      {/* Caption */}
      {reel.caption && (
        <div className="text-white text-sm leading-relaxed">
          {parseCaption(reel.caption)}
        </div>
      )}

      {/* Hashtags */}
      {reel.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {reel.hashtags.slice(0, 3).map((hashtag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="bg-white/10 text-white hover:bg-white/20 cursor-pointer text-xs"
            >
              {hashtag}
            </Badge>
          ))}
          {reel.hashtags.length > 3 && (
            <Badge variant="secondary" className="bg-white/10 text-white/70 text-xs">
              +{reel.hashtags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-white/70 text-xs">
        <div className="flex items-center gap-1">
          <Icon name="Eye" size={12} />
          <span>{formatViews(reel.views)} просмотров</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon name="Clock" size={12} />
          <span>
            {formatDistanceToNow(reel.createdAt, { 
              addSuffix: true, 
              locale: ru 
            })}
          </span>
        </div>
      </div>

      {/* Music Info */}
      {reel.musicTitle && (
        <div className="bg-black/30 rounded-full px-3 py-2 flex items-center gap-2 max-w-fit">
          <Icon name="Music" size={14} className="text-white" />
          <span className="text-white text-sm truncate max-w-48">
            {reel.musicTitle} • {reel.musicArtist}
          </span>
        </div>
      )}
    </div>
  );
};

export default ReelsInfo;