import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import FriendRequests from '@/components/friends/FriendRequests';

const Notifications = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* Десктоп версия */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-6 py-8">
          {/* Хедер */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="border-gray-200 hover:bg-gray-50"
              >
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Назад
              </Button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Уведомления
                </h1>
                <p className="text-gray-600 text-lg">Заявки в друзья и другие уведомления</p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl">
            <FriendRequests variant="desktop" />
          </div>
        </div>
      </div>

      {/* Мобильная версия */}
      <div className="lg:hidden min-h-screen p-4 pb-24">
        <div className="max-w-md mx-auto pt-safe">
          <div className="flex items-center justify-between mb-6 pt-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:bg-gray-100"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <h1 className="text-xl font-bold text-gray-800">Уведомления</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>

          <div className="space-y-4">
            <FriendRequests variant="mobile" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;