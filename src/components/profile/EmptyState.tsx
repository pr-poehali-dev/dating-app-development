import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface EmptyStateProps {
  onAuth: () => void;
}

const EmptyState = ({ onAuth }: EmptyStateProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center">
          <Icon name="User" size={40} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Войдите в свой профиль
        </h2>
        <p className="text-gray-600 mb-6">
          Создайте аккаунт или войдите, чтобы увидеть свой профиль
        </p>
        <Button 
          onClick={onAuth} 
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          <Icon name="LogIn" size={20} className="mr-2" />
          Войти
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;