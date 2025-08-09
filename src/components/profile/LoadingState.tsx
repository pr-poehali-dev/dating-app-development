import Icon from '@/components/ui/icon';

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
          <Icon name="User" size={32} className="text-white" />
        </div>
        <p className="text-gray-600 font-medium">Загружаем профиль...</p>
      </div>
    </div>
  );
};

export default LoadingState;