import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Story, StoryView, CreateStoryData, StoryMedia } from '@/types/story';
import { useAuth } from './AuthContext';

interface StoriesContextType {
  stories: Story[];
  userStories: Story[];
  createStory: (data: CreateStoryData) => Promise<void>;
  deleteStory: (storyId: string) => void;
  viewStory: (storyId: string, mediaIndex: number) => void;
  getActiveStories: () => Story[];
  getUserActiveStories: (userId: string) => Story[];
  hasUnviewedStories: (userId: string) => boolean;
  loading: boolean;
}

const StoriesContext = createContext<StoriesContextType | undefined>(undefined);

export const useStories = () => {
  const context = useContext(StoriesContext);
  if (context === undefined) {
    throw new Error('useStories must be used within a StoriesProvider');
  }
  return context;
};

interface StoriesProviderProps {
  children: ReactNode;
}

export const StoriesProvider = ({ children }: StoriesProviderProps) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Загрузка stories из localStorage при инициализации
  useEffect(() => {
    const savedStories = localStorage.getItem('stories');
    if (savedStories) {
      const parsedStories = JSON.parse(savedStories).map((story: any) => ({
        ...story,
        createdAt: new Date(story.createdAt),
        expiresAt: new Date(story.expiresAt),
        media: story.media.map((media: any) => ({
          ...media,
          uploadedAt: new Date(media.uploadedAt)
        }))
      }));
      setStories(parsedStories);
    }
  }, []);

  // Сохранение stories в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('stories', JSON.stringify(stories));
  }, [stories]);

  // Автоматическое удаление истёкших stories
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setStories(prevStories => 
        prevStories.filter(story => story.expiresAt > now)
      );
    }, 60000); // Проверяем каждую минуту

    return () => clearInterval(interval);
  }, []);

  const processMedia = async (files: File[]): Promise<StoryMedia[]> => {
    const processedMedia: StoryMedia[] = [];

    for (const file of files) {
      const mediaId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      if (file.type.startsWith('image/')) {
        // Обработка изображений
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        const dataUrl = await new Promise<string>((resolve) => {
          img.onload = () => {
            const maxSize = 1080;
            let { width, height } = img;
            
            if (width > height) {
              if (width > maxSize) {
                height = (height * maxSize) / width;
                width = maxSize;
              }
            } else {
              if (height > maxSize) {
                width = (width * maxSize) / height;
                height = maxSize;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          };
          img.src = URL.createObjectURL(file);
        });

        processedMedia.push({
          id: mediaId,
          type: 'photo',
          url: dataUrl,
          uploadedAt: new Date()
        });
      } else if (file.type.startsWith('video/')) {
        // Обработка видео
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const { dataUrl, thumbnail, duration } = await new Promise<{
          dataUrl: string;
          thumbnail: string;
          duration: number;
        }>((resolve) => {
          video.onloadedmetadata = () => {
            video.currentTime = 1; // Берём кадр на 1 секунде для превью
          };
          
          video.onseeked = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx?.drawImage(video, 0, 0);
            const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
            
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                dataUrl: e.target?.result as string,
                thumbnail,
                duration: video.duration
              });
            };
            reader.readAsDataURL(file);
          };
          
          video.src = URL.createObjectURL(file);
        });

        processedMedia.push({
          id: mediaId,
          type: 'video',
          url: dataUrl,
          thumbnail,
          duration,
          uploadedAt: new Date()
        });
      }
    }

    return processedMedia;
  };

  const createStory = async (data: CreateStoryData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const processedMedia = await processMedia(data.media);
      
      const newStory: Story = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        userId: user.id,
        media: processedMedia,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 часа
        viewedBy: [],
        isActive: true
      };

      setStories(prevStories => [newStory, ...prevStories]);
    } catch (error) {
      console.error('Error creating story:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteStory = (storyId: string) => {
    if (!user) return;
    
    setStories(prevStories => 
      prevStories.filter(story => !(story.id === storyId && story.userId === user.id))
    );
  };

  const viewStory = (storyId: string, mediaIndex: number) => {
    if (!user) return;

    setStories(prevStories =>
      prevStories.map(story => {
        if (story.id === storyId && !story.viewedBy.includes(user.id)) {
          return {
            ...story,
            viewedBy: [...story.viewedBy, user.id]
          };
        }
        return story;
      })
    );

    // Сохраняем информацию о просмотре
    const storyViews = JSON.parse(localStorage.getItem('storyViews') || '[]');
    const existingView = storyViews.find((view: StoryView) => 
      view.storyId === storyId && view.userId === user.id
    );

    if (existingView) {
      existingView.viewedAt = new Date();
      existingView.mediaIndex = mediaIndex;
    } else {
      storyViews.push({
        userId: user.id,
        storyId,
        viewedAt: new Date(),
        mediaIndex
      });
    }

    localStorage.setItem('storyViews', JSON.stringify(storyViews));
  };

  const getActiveStories = () => {
    const now = new Date();
    return stories.filter(story => story.isActive && story.expiresAt > now);
  };

  const getUserActiveStories = (userId: string) => {
    return getActiveStories().filter(story => story.userId === userId);
  };

  const hasUnviewedStories = (userId: string) => {
    if (!user) return false;
    const userStories = getUserActiveStories(userId);
    return userStories.some(story => !story.viewedBy.includes(user.id));
  };

  const userStories = user ? getUserActiveStories(user.id) : [];

  const value = {
    stories: getActiveStories(),
    userStories,
    createStory,
    deleteStory,
    viewStory,
    getActiveStories,
    getUserActiveStories,
    hasUnviewedStories,
    loading
  };

  return (
    <StoriesContext.Provider value={value}>
      {children}
    </StoriesContext.Provider>
  );
};