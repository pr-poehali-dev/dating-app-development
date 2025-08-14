import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useStories } from '@/contexts/StoriesContext';
import { useAuth } from '@/contexts/AuthContext';
import StoryViewer from './StoryViewer';

interface StoriesFeedProps {
  variant?: 'desktop' | 'mobile';
}

const StoriesFeed = ({ variant = 'mobile' }: StoriesFeedProps) => {
  const [showViewer, setShowViewer] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  
  const { stories, getUserActiveStories, hasUnviewedStories } = useStories();
  const { user } = useAuth();

  // Группируем истории по пользователям
  const groupedStories = stories.reduce((acc, story) => {
    if (!acc[story.userId]) {
      acc[story.userId] = [];
    }
    acc[story.userId].push(story);
    return acc;
  }, {} as Record<string, typeof stories>);

  // Получаем пользователей
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  const handleViewUserStories = (userId: string) => {
    const userStories = getUserActiveStories(userId);
    if (userStories.length > 0) {
      setSelectedUserId(userId);
      setSelectedStoryIndex(0);
      setShowViewer(true);
    }
  };

  const allUserStories = Object.keys(groupedStories).map(userId => {
    const userStories = groupedStories[userId];
    const storyUser = users.find((u: any) => u.id === userId);
    return {
      userId,
      user: storyUser,
      stories: userStories,
      hasUnviewed: hasUnviewedStories(userId)
    };
  }).filter(item => item.user && item.stories.length > 0);

  // Истории для просмотрщика
  const viewerStories = selectedUserId ? getUserActiveStories(selectedUserId) : [];

  if (allUserStories.length === 0) {
    return (
      <Card className={variant === 'desktop' ? 'bg-white/80 backdrop-blur-sm border-0 shadow-xl' : 'bg-white/95 backdrop-blur-sm border-0 shadow-lg'}>
        <CardContent className={variant === 'desktop' ? 'p-8' : 'p-6'}>
          <div className="text-center py-8">
            <Icon name="Camera" size={variant === 'desktop' ? 48 : 40} className="text-gray-400 mx-auto mb-4" />
            <h3 className={`font-bold text-gray-700 mb-2 ${variant === 'desktop' ? 'text-xl' : 'text-lg'}`}>
              Нет историй
            </h3>
            <p className="text-gray-500">
              Когда ваши друзья добавят истории, они появятся здесь
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={variant === 'desktop' ? 'bg-white/80 backdrop-blur-sm border-0 shadow-xl' : 'bg-white/95 backdrop-blur-sm border-0 shadow-lg'}>
        <CardHeader className={variant === 'desktop' ? 'pb-4' : 'pb-3'}>
          <CardTitle className={`flex items-center gap-3 ${variant === 'desktop' ? 'text-2xl' : 'text-lg'}`}>
            <Icon name="Camera" size={variant === 'desktop' ? 24 : 20} className="text-purple-500" />
            Истории друзей
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {allUserStories.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className={variant === 'desktop' ? 'p-6 pt-0' : 'p-4 pt-0'}>
          <div className={`grid grid-cols-${variant === 'desktop' ? '4' : '3'} gap-${variant === 'desktop' ? '4' : '3'}`}>
            <AnimatePresence>
              {allUserStories.map((item, index) => (
                <motion.div
                  key={item.userId}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group cursor-pointer"
                  onClick={() => handleViewUserStories(item.userId)}
                >
                  {/* Превью истории */}
                  <div className={`relative ${variant === 'desktop' ? 'aspect-[9/16] h-36' : 'aspect-[9/16] h-28'} rounded-xl overflow-hidden`}>
                    {/* Обводка для непросмотренных историй */}
                    <div className={`absolute -inset-1 rounded-xl ${
                      item.hasUnviewed 
                        ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500' 
                        : 'bg-gray-300'
                    } p-1`}>
                      <div className="w-full h-full bg-white rounded-lg p-0.5">
                        {item.stories[0].media[0].type === 'photo' ? (
                          <img
                            src={item.stories[0].media[0].url}
                            alt="Story"
                            className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="relative w-full h-full">
                            <img
                              src={item.stories[0].media[0].thumbnail || item.stories[0].media[0].url}
                              alt="Story"
                              className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
                              <Icon name="Play" size={variant === 'desktop' ? 20 : 16} className="text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Градиент для контрастности */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl" />

                    {/* Количество историй */}
                    {item.stories.length > 1 && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-black/50 text-white text-xs">
                          {item.stories.length}
                        </Badge>
                      </div>
                    )}

                    {/* Аватар пользователя */}
                    <div className="absolute bottom-2 left-2">
                      {item.user.photos && item.user.photos.length > 0 ? (
                        <img
                          src={item.user.photos.find(p => p.isMain)?.url || item.user.photos[0]?.url}
                          alt={item.user.name}
                          className={`${variant === 'desktop' ? 'w-8 h-8' : 'w-6 h-6'} rounded-full object-cover border-2 border-white`}
                        />
                      ) : (
                        <div className={`${variant === 'desktop' ? 'w-8 h-8' : 'w-6 h-6'} bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center border-2 border-white`}>
                          <Icon name="User" size={variant === 'desktop' ? 12 : 10} className="text-white" />
                        </div>
                      )}
                    </div>

                    {/* Overlay при наведении */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-xl">
                      <Button
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full"
                      >
                        <Icon name="Eye" size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Имя пользователя */}
                  <div className="mt-2">
                    <p className={`font-medium text-gray-800 text-center truncate ${variant === 'desktop' ? 'text-sm' : 'text-xs'}`}>
                      {item.user.name}
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      {new Date(item.stories[0].createdAt).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Индикатор непросмотренных */}
                  {item.hasUnviewed && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Просмотрщик историй */}
      <AnimatePresence>
        {showViewer && viewerStories.length > 0 && (
          <StoryViewer
            stories={viewerStories}
            initialStoryIndex={selectedStoryIndex}
            onClose={() => setShowViewer(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default StoriesFeed;