import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCall } from '@/contexts/CallContext';
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

interface ChatHeaderProps {
  chatUser: ChatUser;
  onDeleteChat: () => void;
}

const formatLastSeen = (date?: Date, isOnline?: boolean) => {
  if (isOnline) return 'в сети';
  if (!date) return 'был(а) недавно';
  
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 60) return `был(а) ${minutes} мин. назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `был(а) ${hours} ч. назад`;
  const days = Math.floor(hours / 24);
  return `был(а) ${days} дн. назад`;
};

export default function ChatHeader({ chatUser, onDeleteChat }: ChatHeaderProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { startCall } = useCall();

  const handleDeleteChat = () => {
    onDeleteChat();
    setShowDeleteDialog(false);
  };

  const handleVideoCall = () => {
    startCall(chatUser.id, chatUser.name);
  };
  return (
    <>
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-to-br from-love-light to-love-DEFAULT text-white">
                {chatUser.name[0]}
              </AvatarFallback>
            </Avatar>
            {chatUser.isOnline && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold text-gray-900">{chatUser.name}</h2>
              {chatUser.verified && (
                <Icon name="Shield" size={16} className="text-blue-500" />
              )}
              <Badge variant="secondary" className="text-xs">
                {chatUser.age} лет
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {formatLastSeen(chatUser.lastSeen, chatUser.isOnline)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Icon name="Phone" size={18} className="mr-2" />
            Позвонить
          </Button>
          <Button variant="outline" size="sm" onClick={handleVideoCall}>
            <Icon name="Video" size={18} className="mr-2" />
            Видео
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Icon name="MoreVertical" size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                Удалить переписку
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>

    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить переписку?</AlertDialogTitle>
          <AlertDialogDescription>
            Все сообщения с пользователем {chatUser.name} будут удалены безвозвратно. 
            Это действие нельзя отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteChat}
            className="bg-red-600 hover:bg-red-700"
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}