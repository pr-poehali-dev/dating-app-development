import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface StoryControlsProps {
  showControls: boolean;
  isTouch: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
  onClose: () => void;
}

const StoryControls = ({
  showControls,
  isTouch,
  isPaused,
  onTogglePause,
  onClose
}: StoryControlsProps) => {
  return (
    <AnimatePresence>
      {(showControls || isTouch) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute z-10 flex gap-2 ${
            isTouch ? 'top-16 right-4' : 'top-4 right-4'
          }`}
        >
          {!isTouch && (
            <Button
              size="sm"
              onClick={onTogglePause}
              className="rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
            >
              <Icon name={isPaused ? "Play" : "Pause"} size={16} />
            </Button>
          )}
          <Button
            size="sm"
            onClick={onClose}
            className="rounded-full bg-black/50 hover:bg-black/70 text-white border-0"
          >
            <Icon name="X" size={16} />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoryControls;