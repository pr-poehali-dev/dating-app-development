import { Story, StoryProgress as StoryProgressType } from '@/types/story';

interface StoryProgressProps {
  story: Story;
  currentMediaIndex: number;
  progress: StoryProgressType;
  isTouch: boolean;
}

const StoryProgressBar = ({ story, currentMediaIndex, progress, isTouch }: StoryProgressProps) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-10">
      <div className={`flex gap-1 ${isTouch ? 'px-2' : ''}`}>
        {story.media.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width: index < currentMediaIndex 
                  ? '100%' 
                  : index === currentMediaIndex 
                    ? `${progress.progress}%` 
                    : '0%'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryProgressBar;