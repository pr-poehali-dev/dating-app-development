import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface WebLayoutProps {
  children: ReactNode;
}

export default function WebLayout({ children }: WebLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <Icon name="Heart" className="text-red-500" size={32} />
              <span className="ml-2 text-2xl font-bold text-gray-900">Noumi Dating</span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-8">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/discover')}
                className="text-gray-600 hover:text-gray-900"
              >
                <Icon name="Compass" size={18} className="mr-2" />
                Знакомства
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate('/matches')}
                className="text-gray-600 hover:text-gray-900"
              >
                <Icon name="Users" size={18} className="mr-2" />
                Совпадения
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate('/chat')}
                className="text-gray-600 hover:text-gray-900"
              >
                <Icon name="MessageCircle" size={18} className="mr-2" />
                Чаты
              </Button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex items-center space-x-2"
                    onClick={() => navigate('/profile')}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                    {user.subscription === 'premium' && (
                      <Badge className="bg-yellow-500 text-xs">Premium</Badge>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                  >
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Выйти
                  </Button>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/auth')}
                  >
                    Войти
                  </Button>
                  <Button
                    onClick={() => navigate('/auth')}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    Регистрация
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Heart" className="text-red-500" size={24} />
                <span className="text-xl font-bold">Noumi Dating</span>
              </div>
              <p className="text-gray-600 text-sm">
                Самый надежный сайт знакомств для серьезных отношений
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Компания</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>О нас</div>
                <div>Карьера</div>
                <div>Пресса</div>
                <div>Блог</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Помощь</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>FAQ</div>
                <div>Поддержка</div>
                <div>Безопасность</div>
                <div>Правила</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Контакты</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>help@noumidating.ru</div>
                <div>+7 (800) 123-45-67</div>
                <div className="flex space-x-3 pt-2">
                  <Icon name="Facebook" size={20} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                  <Icon name="Twitter" size={20} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                  <Icon name="Instagram" size={20} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 mt-8 text-center text-sm text-gray-500">
            © 2024 Noumi Dating. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}