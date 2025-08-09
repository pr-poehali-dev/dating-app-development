import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function EmptyChat() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="MessageCircle" size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Выберите чат</h2>
        <p className="text-gray-600 mb-6">Выберите пользователя из списка, чтобы начать общение</p>
        <Button 
          onClick={() => navigate('/matches')}
          className="bg-love-DEFAULT hover:bg-love-dark"
        >
          К совпадениям
        </Button>
      </div>
    </div>
  );
}