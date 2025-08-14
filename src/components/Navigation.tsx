import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import { useFriends } from '@/contexts/FriendsContext';

const Navigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { getUnreadNotificationsCount } = useFriends();

  const notificationsCount = getUnreadNotificationsCount();

  const navItems = [
    { path: '/discover', icon: 'Flame', label: 'Поиск' },
    { path: '/stories', icon: 'PlusCircle', label: 'Stories' },
    { path: '/matches', icon: 'Users', label: 'Совпадения' },
    { path: '/notifications', icon: 'Bell', label: 'Уведомления', hasNotification: notificationsCount > 0 },
    { path: '/chat', icon: 'MessageCircle', label: 'Чат' },
    { path: '/profile', icon: 'User', label: 'Профиль' },
  ];

  if (!user) return null;

  return (
    <>
      {/* Мобильная навигация */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-center py-3 px-3 rounded-lg transition-colors relative ${
                  isActive 
                    ? 'text-love-DEFAULT bg-love-DEFAULT/10' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="relative">
                  <Icon name={item.icon as any} size={24} />
                  {item.hasNotification && (
                    <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 animate-pulse border border-white"></div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Десктопная навигация */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 z-50">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Логотип */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Icon name="Heart" size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              NoumiDating
            </span>
          </div>

          {/* Навигационные элементы */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 relative group ${
                    isActive 
                      ? 'text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-pink-500/25' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="relative">
                    <Icon name={item.icon as any} size={20} />
                    {item.hasNotification && (
                      <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-2 h-2 animate-pulse"></div>
                    )}
                  </div>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl opacity-20 animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Профиль пользователя */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <Icon name="User" size={20} className="text-white" />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-gray-900">{user?.name}</div>
              <div className="text-gray-500">Онлайн</div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;