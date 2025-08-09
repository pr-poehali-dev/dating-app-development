import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface EmptyStateProps {
  onRefresh: () => void;
}

const EmptyState = ({ onRefresh }: EmptyStateProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center">
            <Icon name="Heart" size={40} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <Icon name="Sparkles" size={16} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Готовим новые знакомства
        </h2>
        <p className="text-gray-600 text-lg mb-6">
          Совсем скоро здесь появятся интересные люди!
        </p>
        <Button 
          onClick={onRefresh}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Icon name="RotateCcw" size={20} className="mr-2" />
          Обновить профили
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;