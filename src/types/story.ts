export interface StoryMedia {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  duration?: number; // для видео в секундах
  uploadedAt: Date;
}

export interface Story {
  id: string;
  userId: string;
  media: StoryMedia[];
  createdAt: Date;
  expiresAt: Date;
  viewedBy: string[]; // массив ID пользователей, которые просмотрели
  isActive: boolean;
}

export interface StoryView {
  userId: string;
  storyId: string;
  viewedAt: Date;
  mediaIndex: number; // какой элемент медиа просматривался последним
}

export interface CreateStoryData {
  media: File[];
  userId: string;
}

export interface StoryProgress {
  currentIndex: number;
  isPlaying: boolean;
  progress: number; // от 0 до 100
}