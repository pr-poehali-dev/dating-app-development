import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/discover', icon: 'Flame', label: 'Поиск' },
    { path: '/matches', icon: 'Users', label: 'Совпадения' },
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
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-love-DEFAULT bg-love-DEFAULT/10' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon name={item.icon as any} size={24} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;