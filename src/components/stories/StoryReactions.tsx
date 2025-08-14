import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Story } from '@/types/story';

interface StoryReactionsProps {
  story: Story;
  showReactions: boolean;
  reactionPosition: { x: number; y: number };
  isTouch: boolean;
  onAddReaction: (emoji: string) => void;
  onCloseReactions: () => void;
}

const StoryReactions = ({
  story,
  showReactions,
  reactionPosition,
  isTouch,
  onAddReaction,
  onCloseReactions
}: StoryReactionsProps) => {
  return (
    <>
      {/* Панель эмоджи реакций */}
      <AnimatePresence>
        {showReactions && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute z-20"
            style={{
              left: isTouch ? '50%' : reactionPosition.x,
              top: isTouch ? '50%' : reactionPosition.y,
              transform: isTouch ? 'translate(-50%, -50%)' : 'translate(-50%, -100%)'
            }}
          >
            <div className="bg-black/80 backdrop-blur-sm rounded-full p-3 flex gap-2">
              {['😍', '😂', '😢', '😎', '🔥', '❤️', '😮', '😡'].map((emoji) => (
                <button
                  key={emoji}
                  className="text-2xl hover:scale-125 transition-transform active:scale-110"
                  onClick={() => onAddReaction(emoji)}
                >
                  {emoji}
                </button>
              ))}
              <Button
                size="sm"
                onClick={onCloseReactions}
                className="rounded-full bg-white/20 hover:bg-white/30 text-white border-0 w-8 h-8 p-0 ml-2"
              >
                <Icon name="X" size={12} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Отображение реакций */}
      <div className="absolute top-32 right-4 z-10">
        <AnimatePresence>
          {story.reactions.slice(-3).map((reaction, index) => (
            <motion.div
              key={reaction.id}
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="mb-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2"
            >
              <span className="text-lg">{reaction.emoji}</span>
              <span className="text-white text-xs">1</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default StoryReactions;