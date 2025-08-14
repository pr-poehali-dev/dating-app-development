import { useState, useRef, useEffect } from 'react';
import { ReelVideo, VideoPlayerControls } from '@/types/reels';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/icon';

interface VideoPlayerProps {
  reel: ReelVideo;
  isActive: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onVideoRef: (ref: HTMLVideoElement | null) => void;
  className?: string;
}

const VideoPlayer = ({
  reel,
  isActive,
  isPlaying,
  onTogglePlay,
  onVideoRef,
  className
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [controls, setControls] = useState<VideoPlayerControls>({
    isPlaying: false,
    isMuted: true,
    volume: 1,
    currentTime: 0,
    duration: 0,
    isFullscreen: false
  });
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      onVideoRef(videoRef.current);
    }
  }, [onVideoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setControls(prev => ({ ...prev, duration: video.duration }));
    };

    const handleTimeUpdate = () => {
      setControls(prev => ({ ...prev, currentTime: video.currentTime }));
    };

    const handlePlay = () => {
      setControls(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setControls(prev => ({ ...prev, isPlaying: false }));
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive) return;

    if (isPlaying) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, [isPlaying, isActive]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setControls(prev => ({ ...prev, isMuted: video.muted }));
  };

  const handleVideoClick = () => {
    onTogglePlay();
    setShowControls(true);
    setTimeout(() => setShowControls(false), 2000);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-black", className)}>
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.thumbnailUrl}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={controls.isMuted}
        onClick={handleVideoClick}
      />

      {/* Play/Pause Overlay */}
      <div 
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        )}
        onClick={handleVideoClick}
      >
        {!isPlaying && (
          <div className="bg-black/50 rounded-full p-4">
            <Icon name="Play" size={48} className="text-white" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={cn(
        "absolute bottom-4 left-4 right-4 flex items-center justify-between transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0"
      )}>
        <div className="flex items-center gap-2 text-white text-sm">
          <span>{formatTime(controls.currentTime)}</span>
          <span>/</span>
          <span>{formatTime(controls.duration)}</span>
        </div>

        <button
          onClick={toggleMute}
          className="bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
        >
          <Icon 
            name={controls.isMuted ? "VolumeX" : "Volume2"} 
            size={20} 
            className="text-white" 
          />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-100"
          style={{ 
            width: `${(controls.currentTime / controls.duration) * 100}%` 
          }}
        />
      </div>

      {/* Music Info */}
      {reel.musicTitle && (
        <div className="absolute bottom-16 left-4 flex items-center gap-2 text-white">
          <Icon name="Music" size={16} />
          <span className="text-sm truncate max-w-48">
            {reel.musicTitle} • {reel.musicArtist}
          </span>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;