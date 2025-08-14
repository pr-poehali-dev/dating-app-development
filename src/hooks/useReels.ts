import { useState, useEffect, useRef } from 'react';
import { ReelVideo, ReelsState, ReelsAction } from '@/types/reels';

const DEMO_REELS: ReelVideo[] = [
  {
    id: '1',
    userId: 'demo1',
    user: {
      id: 'demo1',
      name: 'Анна Кузнецова',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b56d4509?w=400&h=400&fit=crop&crop=face',
      username: '@anna_k',
      isVerified: true
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1494790108755-2616b56d4509?w=400&h=600&fit=crop',
    caption: 'Прекрасное утро в Москве! ☀️ #утро #москва #настроение',
    hashtags: ['#утро', '#москва', '#настроение'],
    mentions: [],
    duration: 596,
    createdAt: new Date('2024-01-15T08:30:00Z'),
    likes: ['user1', 'user2', 'user3'],
    comments: [],
    views: 1234,
    shares: 45,
    musicTitle: 'Sunny Day',
    musicArtist: 'Happy Vibes'
  },
  {
    id: '2',
    userId: 'demo2',
    user: {
      id: 'demo2',
      name: 'Мария Петрова',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      username: '@maria_p',
      isVerified: false
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    caption: 'Танцую под любимую песню 💃 #танцы #музыка #вайб',
    hashtags: ['#танцы', '#музыка', '#вайб'],
    mentions: [],
    duration: 653,
    createdAt: new Date('2024-01-14T19:15:00Z'),
    likes: ['user1', 'user4'],
    comments: [],
    views: 2856,
    shares: 89,
    musicTitle: 'Dance Floor',
    musicArtist: 'DJ Max'
  }
];

export const useReels = () => {
  const [state, setState] = useState<ReelsState>({
    reels: DEMO_REELS,
    currentIndex: 0,
    isPlaying: true,
    isLoading: false,
    error: null,
    hasNextPage: true,
    uploadProgress: 0,
    isUploading: false
  });

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const getCurrentReel = () => state.reels[state.currentIndex];

  const nextReel = () => {
    setState(prev => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.reels.length) {
        return prev;
      }
      return {
        ...prev,
        currentIndex: nextIndex,
        isPlaying: true
      };
    });
  };

  const previousReel = () => {
    setState(prev => {
      const prevIndex = prev.currentIndex - 1;
      if (prevIndex < 0) return prev;
      return {
        ...prev,
        currentIndex: prevIndex,
        isPlaying: true
      };
    });
  };

  const togglePlay = () => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleAction = (action: ReelsAction, reelId: string, data?: any) => {
    setState(prev => {
      const reels = prev.reels.map(reel => {
        if (reel.id === reelId) {
          switch (action) {
            case 'like':
              const isLiked = reel.likes.includes('currentUser');
              return {
                ...reel,
                likes: isLiked 
                  ? reel.likes.filter(id => id !== 'currentUser')
                  : [...reel.likes, 'currentUser'],
                isLiked: !isLiked
              };
            case 'share':
              return { ...reel, shares: reel.shares + 1 };
            default:
              return reel;
          }
        }
        return reel;
      });

      return { ...prev, reels };
    });
  };

  const loadMoreReels = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        hasNextPage: false
      }));
    }, 1000);
  };

  useEffect(() => {
    const currentVideo = videoRefs.current[state.currentIndex];
    if (currentVideo) {
      if (state.isPlaying) {
        currentVideo.play();
      } else {
        currentVideo.pause();
      }
    }
  }, [state.currentIndex, state.isPlaying]);

  return {
    ...state,
    videoRefs,
    getCurrentReel,
    nextReel,
    previousReel,
    togglePlay,
    handleAction,
    loadMoreReels
  };
};