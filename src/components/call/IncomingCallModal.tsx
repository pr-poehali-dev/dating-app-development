import { useCall } from '@/contexts/CallContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

export default function IncomingCallModal() {
  const { callState, answerCall, rejectCall } = useCall();

  if (!callState.isIncoming) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
        {/* Анимация пульсации */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-2 bg-green-500 rounded-full animate-ping opacity-40 animation-delay-300"></div>
          <Avatar className="w-32 h-32 mx-auto relative">
            <AvatarFallback className="bg-gradient-to-br from-love-light to-love-DEFAULT text-white text-4xl">
              {callState.caller?.name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {callState.caller?.name || 'Неизвестный'}
          </h2>
          <p className="text-gray-600">Входящий видео звонок...</p>
        </div>

        <div className="flex gap-6 justify-center">
          {/* Кнопка отклонить */}
          <Button
            onClick={rejectCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 p-0"
          >
            <Icon name="PhoneOff" size={28} className="text-white" />
          </Button>

          {/* Кнопка ответить */}
          <Button
            onClick={answerCall}
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 p-0"
          >
            <Icon name="Phone" size={28} className="text-white" />
          </Button>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Нажмите для ответа или отклонения звонка
        </div>
      </div>
    </div>
  );
}