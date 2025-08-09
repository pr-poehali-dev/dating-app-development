import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ChatUser {
  id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  verified: boolean;
  subscription: 'free' | 'premium';
  isOnline: boolean;
  lastSeen?: Date;
  isTyping?: boolean;
}

interface VideoCallProps {
  chatUser: ChatUser;
  onEndCall: () => void;
}

export default function VideoCall({ chatUser, onEndCall }: VideoCallProps) {
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full h-full">
        {/* Video Call UI */}
        <div className="absolute inset-4 bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-48 h-48 bg-gradient-to-br from-love-light to-love-DEFAULT rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="User" size={96} className="text-white" />
            </div>
            <h3 className="text-4xl font-bold mb-4">{chatUser.name}</h3>
            <p className="text-gray-400 text-xl mb-12">Видеозвонок...</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400">00:45</span>
            </div>
          </div>
        </div>
        
        {/* Call Controls */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-6">
          <Button
            size="lg"
            variant="outline"
            className="w-16 h-16 rounded-full border-gray-600 bg-gray-800 hover:bg-gray-700"
          >
            <Icon name="Mic" size={28} className="text-white" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-16 h-16 rounded-full border-gray-600 bg-gray-800 hover:bg-gray-700"
          >
            <Icon name="Video" size={28} className="text-white" />
          </Button>
          <Button
            size="lg"
            onClick={onEndCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white"
          >
            <Icon name="PhoneOff" size={28} />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-16 h-16 rounded-full border-gray-600 bg-gray-800 hover:bg-gray-700"
          >
            <Icon name="Settings" size={28} className="text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}