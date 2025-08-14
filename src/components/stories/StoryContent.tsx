import { RefObject } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { StoryMedia } from '@/types/story';

interface StoryContentProps {
  media: StoryMedia;
  isTouch: boolean;
  isPaused: boolean;
  videoRef: RefObject<HTMLVideoElement>;
  onPreviousMedia: () => void;
  onNextMedia: () => void;
  onTogglePause: () => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
}

const StoryContent = ({
  media,
  isTouch,
  isPaused,
  videoRef,
  onPreviousMedia,
  onNextMedia,
  onTogglePause,
  onDoubleClick
}: StoryContentProps) => {
  return (
    <div className={`relative w-full h-full ${
      isTouch ? 'max-w-none' : 'max-w-md mx-auto'
    }`}>
      {media.type === 'photo' ? (
        <img
          src={media.url}
          alt="Story"
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          src={media.url}
          autoPlay
          muted
          className="w-full h-full object-cover"
          onEnded={onNextMedia}
          onPause={() => {}}
          onPlay={() => {}}
        />
      )}

      {/* Области для навигации */}
      <div className="absolute inset-0 flex">
        <div 
          className="flex-1 cursor-pointer"
          onClick={onPreviousMedia}
        />
        <div 
          className="flex-1 cursor-pointer"
          onClick={isTouch ? onTogglePause : onNextMedia}
          onDoubleClick={onDoubleClick}
        />
      </div>

      {/* Центральная кнопка паузы */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Button
              size="lg"
              onClick={onTogglePause}
              className="rounded-full bg-black/50 hover:bg-black/70 text-white border-0 w-16 h-16"
            >
              <Icon name="Play" size={24} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoryContent;