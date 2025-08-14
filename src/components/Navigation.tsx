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
    { path: '/stories', icon: 'CirclePlay', label: 'Stories' },
    { path: '/matches', icon: 'Users', label: 'Совпадения' },
    { path: '/notifications', icon: 'Bell', label: 'Уведомления', hasNotification: notificationsCount > 0 },
    { path: '/chat', icon: 'MessageCircle', label: 'Чат' },
    { path: '/profile', icon: 'User', label: 'Профиль' },
  ];

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
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
  );
};

export default Navigation;