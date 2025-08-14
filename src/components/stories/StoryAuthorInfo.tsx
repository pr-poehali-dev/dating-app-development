import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { Story } from '@/types/story';

interface StoryAuthorInfoProps {
  story: Story;
  showControls: boolean;
}

const StoryAuthorInfo = ({ story, showControls }: StoryAuthorInfoProps) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const storyAuthor = users.find((u: any) => u.id === story.userId);

  return (
    <AnimatePresence>
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-12 left-4 right-4 z-10"
        >
          <div className="flex items-center gap-3 text-white">
            {storyAuthor?.photos && storyAuthor.photos.length > 0 ? (
              <img
                src={storyAuthor.photos.find(p => p.isMain)?.url || storyAuthor.photos[0]?.url}
                alt={storyAuthor.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-white" />
              </div>
            )}
            <div>
              <p className="font-medium">{storyAuthor?.name || 'Пользователь'}</p>
              <p className="text-xs text-white/70">
                {new Date(story.createdAt).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoryAuthorInfo;