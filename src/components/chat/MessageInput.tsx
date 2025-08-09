import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
}

export default function MessageInput({ newMessage, setNewMessage, onSendMessage }: MessageInputProps) {
  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex gap-3 max-w-4xl mx-auto">
        <Button variant="outline" size="sm">
          <Icon name="Paperclip" size={18} />
        </Button>
        <div className="flex-1 flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Напишите сообщение..."
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onSendMessage();
              }
            }}
          />
          <Button
            onClick={onSendMessage}
            disabled={!newMessage.trim()}
            className="bg-love-DEFAULT hover:bg-love-dark text-white"
          >
            <Icon name="Send" size={18} />
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <Icon name="Smile" size={18} />
        </Button>
      </div>
    </div>
  );
}