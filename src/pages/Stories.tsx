import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import StoriesFeed from '@/components/stories/StoriesFeed';
import UserStories from '@/components/stories/UserStories';
import StoryCreator from '@/components/stories/StoryCreator';
import { useDevice } from '@/hooks/useDevice';
import { useAuth } from '@/contexts/AuthContext';

const Stories = () => {
  const [showCreator, setShowCreator] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'my'>('feed');
  const { isTouch } = useDevice();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Camera" size={64} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Войдите в аккаунт</h2>
          <p className="text-gray-500">Чтобы просматривать истории, необходимо войти в аккаунт</p>
        </div>
      </div>
    );
  }

  const variant = isTouch ? 'mobile' : 'desktop';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 ${
      isTouch ? 'pb-20' : ''
    }`}>
      <div className={`${isTouch ? 'max-w-md mx-auto p-4 pt-safe' : 'container mx-auto px-6 py-8'}`}>
        {/* Заголовок */}
        <div className={`flex items-center justify-between mb-6 ${isTouch ? '' : 'mb-8'}`}>
          <div>
            <h1 className={`font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ${
              isTouch ? 'text-2xl' : 'text-4xl'
            }`}>
              Истории
            </h1>
            {!isTouch && (
              <p className="text-gray-600 text-lg">Делитесь моментами с друзьями</p>
            )}
          </div>
          <Button
            onClick={() => setShowCreator(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            size={isTouch ? 'sm' : 'default'}
          >
            <Icon name="Plus" size={isTouch ? 16 : 18} className="mr-2" />
            Создать
          </Button>
        </div>

        {/* Табы */}
        <div className={`flex bg-white/70 backdrop-blur-sm rounded-lg p-1 mb-6 ${
          isTouch ? 'mb-4' : 'mb-6'
        }`}>
          <Button
            variant={activeTab === 'feed' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('feed')}
            className={`flex-1 ${
              activeTab === 'feed'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            size={isTouch ? 'sm' : 'default'}
          >
            <Icon name="Users" size={16} className="mr-2" />
            Друзья
          </Button>
          <Button
            variant={activeTab === 'my' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('my')}
            className={`flex-1 ${
              activeTab === 'my'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            size={isTouch ? 'sm' : 'default'}
          >
            <Icon name="User" size={16} className="mr-2" />
            Мои истории
          </Button>
        </div>

        {/* Контент */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === 'feed' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === 'feed' ? 20 : -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'feed' ? (
            <StoriesFeed variant={variant} />
          ) : (
            <UserStories variant={variant} />
          )}
        </motion.div>

        {/* Плавающая кнопка создания для мобильных */}
        {isTouch && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed bottom-24 right-4 z-40"
          >
            <Button
              onClick={() => setShowCreator(true)}
              size="lg"
              className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
            >
              <Icon name="Plus" size={24} />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Создатель историй */}
      <AnimatePresence>
        {showCreator && (
          <StoryCreator onClose={() => setShowCreator(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Stories;