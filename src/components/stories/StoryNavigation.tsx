import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { StoryProgress } from '@/types/story';

interface StoryNavigationProps {
  showControls: boolean;
  currentStoryIndex: number;
  storiesLength: number;
  onPreviousStory: () => void;
  onNextStory: () => void;
}

const StoryNavigation = ({
  showControls,
  currentStoryIndex,
  storiesLength,
  onPreviousStory,
  onNextStory
}: StoryNavigationProps) => {
  if (storiesLength <= 1) return null;

  return (
    <AnimatePresence>
      {showControls && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2"
        >
          <Button
            size="sm"
            onClick={onPreviousStory}
            disabled={currentStoryIndex === 0}
            className="rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <Button
            size="sm"
            onClick={onNextStory}
            disabled={currentStoryIndex === storiesLength - 1}
            className="rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoryNavigation;