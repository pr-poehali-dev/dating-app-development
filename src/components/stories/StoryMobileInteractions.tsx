import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Story } from '@/types/story';

interface StoryMobileInteractionsProps {
  story: Story;
  userId?: string;
  onToggleLike: (storyId: string, type: 'like' | 'dislike') => void;
  onShowReactions: () => void;
}

const StoryMobileInteractions = ({
  story,
  userId,
  onToggleLike,
  onShowReactions
}: StoryMobileInteractionsProps) => {
  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
      <div className="flex items-center gap-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
        {/* Лайки */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => onToggleLike(story.id, 'like')}
            className={`rounded-full border-0 w-10 h-10 p-0 ${
              story.likes.find(like => like.userId === userId && like.type === 'like')
                ? 'bg-green-500 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Icon name="ThumbsUp" size={16} />
          </Button>
          <span className="text-white text-sm font-medium">
            {story.likes.filter(like => like.type === 'like').length}
          </span>
        </div>

        {/* Дизлайки */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => onToggleLike(story.id, 'dislike')}
            className={`rounded-full border-0 w-10 h-10 p-0 ${
              story.likes.find(like => like.userId === userId && like.type === 'dislike')
                ? 'bg-red-500 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Icon name="ThumbsDown" size={16} />
          </Button>
          <span className="text-white text-sm font-medium">
            {story.likes.filter(like => like.type === 'dislike').length}
          </span>
        </div>

        {/* Реакции */}
        <Button
          size="sm"
          onClick={onShowReactions}
          className="rounded-full bg-white/20 hover:bg-white/30 text-white border-0 w-10 h-10 p-0"
        >
          <span className="text-lg">😍</span>
        </Button>
      </div>
    </div>
  );
};

export default StoryMobileInteractions;