import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useStories } from '@/contexts/StoriesContext';
import { useAuth } from '@/contexts/AuthContext';
import StoryCreator from './StoryCreator';
import StoryViewer from './StoryViewer';

interface UserStoriesProps {
  variant?: 'desktop' | 'mobile';
}

const UserStories = ({ variant = 'mobile' }: UserStoriesProps) => {
  const [showCreator, setShowCreator] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [viewerStoryIndex, setViewerStoryIndex] = useState(0);
  const { userStories, deleteStory } = useStories();
  const { user } = useAuth();

  const handleViewStory = (storyIndex: number) => {
    setViewerStoryIndex(storyIndex);
    setShowViewer(true);
  };

  const handleDeleteStory = (storyId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту историю?')) {
      deleteStory(storyId);
    }
  };

  if (!user) return null;

  return (
    <>
      <Card className={variant === 'desktop' ? 'bg-white/80 backdrop-blur-sm border-0 shadow-xl' : 'bg-white/95 backdrop-blur-sm border-0 shadow-lg'}>
        <CardContent className={variant === 'desktop' ? 'p-6' : 'p-4'}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold text-gray-800 ${variant === 'desktop' ? 'text-lg' : 'text-base'}`}>
              Мои истории
            </h3>
            <Button
              size={variant === 'desktop' ? 'default' : 'sm'}
              onClick={() => setShowCreator(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Icon name="Plus" size={variant === 'desktop' ? 18 : 16} className="mr-1" />
              Создать
            </Button>
          </div>

          {userStories.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="Camera" size={variant === 'desktop' ? 48 : 40} className="text-gray-400 mx-auto mb-4" />
              <h4 className={`font-bold text-gray-700 mb-2 ${variant === 'desktop' ? 'text-lg' : 'text-base'}`}>
                Нет историй
              </h4>
              <p className="text-gray-500 text-sm mb-4">
                Поделитесь моментами с друзьями
              </p>
              <Button
                onClick={() => setShowCreator(true)}
                variant="outline"
                size={variant === 'desktop' ? 'default' : 'sm'}
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Создать первую историю
              </Button>
            </div>
          ) : (
            <div className={`grid grid-cols-3 gap-${variant === 'desktop' ? '3' : '2'}`}>
              <AnimatePresence>
                {userStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    {/* Превью истории */}
                    <div
                      className={`relative ${variant === 'desktop' ? 'aspect-[9/16] h-32' : 'aspect-[9/16] h-24'} rounded-lg overflow-hidden cursor-pointer`}
                      onClick={() => handleViewStory(index)}
                    >
                      {story.media[0].type === 'photo' ? (
                        <img
                          src={story.media[0].url}
                          alt="Story"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <img
                            src={story.media[0].thumbnail || story.media[0].url}
                            alt="Story"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Icon name="Play" size={variant === 'desktop' ? 20 : 16} className="text-white" />
                          </div>
                        </div>
                      )}

                      {/* Градиент для контрастности */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      {/* Количество медиа */}
                      {story.media.length > 1 && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-black/50 text-white text-xs">
                            <Icon name="Images" size={10} className="mr-1" />
                            {story.media.length}
                          </Badge>
                        </div>
                      )}

                      {/* Время создания */}
                      <div className="absolute bottom-2 left-2">
                        <span className="text-xs text-white font-medium">
                          {new Date(story.createdAt).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {/* Контролы при наведении */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewStory(index);
                            }}
                            className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full w-8 h-8 p-0"
                          >
                            <Icon name="Eye" size={14} />
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStory(story.id);
                            }}
                            className="bg-red-500/80 hover:bg-red-600/80 text-white border-0 rounded-full w-8 h-8 p-0"
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Индикатор просмотров */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Icon name="Eye" size={12} />
                        <span>{story.viewedBy.length}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {Math.ceil((story.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))}ч
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Создатель историй */}
      <AnimatePresence>
        {showCreator && (
          <StoryCreator onClose={() => setShowCreator(false)} />
        )}
      </AnimatePresence>

      {/* Просмотрщик историй */}
      <AnimatePresence>
        {showViewer && userStories.length > 0 && (
          <StoryViewer
            stories={userStories}
            initialStoryIndex={viewerStoryIndex}
            onClose={() => setShowViewer(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default UserStories;