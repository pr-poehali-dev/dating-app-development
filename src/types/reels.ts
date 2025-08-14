import { User } from '@/contexts/AuthContext';

export interface ReelVideo {
  id: string;
  userId: string;
  user: User;
  videoUrl: string;
  thumbnailUrl?: string;
  caption: string;
  hashtags: string[];
  mentions: string[];
  duration: number;
  createdAt: Date;
  likes: string[];
  comments: ReelComment[];
  views: number;
  shares: number;
  isLiked?: boolean;
  musicTitle?: string;
  musicArtist?: string;
  musicUrl?: string;
}

export interface ReelComment {
  id: string;
  userId: string;
  user: User;
  text: string;
  createdAt: Date;
  likes: string[];
  replies: ReelComment[];
  isLiked?: boolean;
}

export interface ReelsState {
  reels: ReelVideo[];
  currentIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  hasNextPage: boolean;
  uploadProgress: number;
  isUploading: boolean;
}

export interface VideoPlayerControls {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isFullscreen: boolean;
}

export interface ReelsUploadData {
  video: File;
  caption: string;
  hashtags: string[];
  mentions: string[];
  musicId?: string;
  isPrivate: boolean;
  allowComments: boolean;
  allowDuet: boolean;
  allowStitch: boolean;
}

export type ReelsAction = 'like' | 'comment' | 'share' | 'follow' | 'report';
export type SwipeDirection = 'up' | 'down' | 'left' | 'right';