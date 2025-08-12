import { useState, useEffect } from 'react';
import { useFriends } from '@/contexts/FriendsContext';
import { useAuth, User } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { motion, AnimatePresence } from 'framer-motion';

interface FriendRequestsProps {
  variant?: 'desktop' | 'mobile';
}

const FriendRequests = ({ variant = 'mobile' }: FriendRequestsProps) => {
  const { friendRequests, acceptFriendRequest, rejectFriendRequest } = useFriends();
  const { user } = useAuth();
  const [requestUsers, setRequestUsers] = useState<User[]>([]);

  useEffect(() => {
    // Загружаем данные пользователей, которые отправили заявки
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const reqUsers = friendRequests.map(req => 
      users.find((u: User) => u.id === req.from)
    ).filter(Boolean);
    setRequestUsers(reqUsers);
  }, [friendRequests]);

  const handleAccept = (requestId: string) => {
    acceptFriendRequest(requestId);
  };

  const handleReject = (requestId: string) => {
    rejectFriendRequest(requestId);
  };

  if (friendRequests.length === 0) {
    return (
      <Card className={variant === 'desktop' ? 'bg-white/80 backdrop-blur-sm border-0 shadow-xl' : 'bg-white/95 backdrop-blur-sm border-0 shadow-lg'}>
        <CardContent className={variant === 'desktop' ? 'p-8' : 'p-6'}>
          <div className="text-center py-8">
            <Icon name="Users" size={variant === 'desktop' ? 48 : 40} className="text-gray-400 mx-auto mb-4" />
            <h3 className={`font-bold text-gray-700 mb-2 ${variant === 'desktop' ? 'text-xl' : 'text-lg'}`}>
              Нет новых заявок
            </h3>
            <p className="text-gray-500">
              Когда кто-то захочет добавить вас в друзья, уведомления появятся здесь
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={variant === 'desktop' ? 'bg-white/80 backdrop-blur-sm border-0 shadow-xl' : 'bg-white/95 backdrop-blur-sm border-0 shadow-lg'}>
      <CardHeader className={variant === 'desktop' ? 'pb-4' : 'pb-3'}>
        <CardTitle className={`flex items-center gap-3 ${variant === 'desktop' ? 'text-2xl' : 'text-lg'}`}>
          <Icon name="UserPlus" size={variant === 'desktop' ? 24 : 20} className="text-blue-500" />
          Заявки в друзья
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {friendRequests.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className={variant === 'desktop' ? 'p-6 pt-0' : 'p-4 pt-0'}>
        <div className={`space-y-${variant === 'desktop' ? '4' : '3'}`}>
          <AnimatePresence>
            {friendRequests.map((request, index) => {
              const requestUser = requestUsers[index];
              if (!requestUser) return null;

              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-${variant === 'desktop' ? '4' : '3'} p-${variant === 'desktop' ? '4' : '3'} bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100`}
                >
                  {/* Аватар */}
                  <div className="relative">
                    {requestUser.photos && requestUser.photos.length > 0 ? (
                      <img
                        src={requestUser.photos.find(p => p.isMain)?.url || requestUser.photos[0]?.url}
                        alt={requestUser.name}
                        className={`${variant === 'desktop' ? 'w-16 h-16' : 'w-12 h-12'} rounded-full object-cover shadow-md`}
                      />
                    ) : (
                      <div className={`${variant === 'desktop' ? 'w-16 h-16' : 'w-12 h-12'} bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center shadow-md`}>
                        <Icon name="User" size={variant === 'desktop' ? 24 : 20} className="text-white" />
                      </div>
                    )}
                    {requestUser.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 shadow-lg">
                        <Icon name="ShieldCheck" size={variant === 'desktop' ? 12 : 10} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Информация о пользователе */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-bold text-gray-800 ${variant === 'desktop' ? 'text-lg' : 'text-base'}`}>
                        {requestUser.name}
                      </h4>
                      {requestUser.subscription === 'premium' && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                          <Icon name="Crown" size={12} className="mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className={`text-gray-600 ${variant === 'desktop' ? 'text-base' : 'text-sm'}`}>
                      {requestUser.age} лет • {requestUser.location.city}
                    </p>
                    {variant === 'desktop' && requestUser.bio && (
                      <p className="text-gray-700 text-sm mt-1 line-clamp-2">
                        {requestUser.bio}
                      </p>
                    )}
                  </div>

                  {/* Кнопки действий */}
                  <div className={`flex gap-${variant === 'desktop' ? '2' : '1'}`}>
                    <Button
                      size={variant === 'desktop' ? 'default' : 'sm'}
                      onClick={() => handleAccept(request.id)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      <Icon name="Check" size={variant === 'desktop' ? 18 : 16} />
                      {variant === 'desktop' && <span className="ml-1">Принять</span>}
                    </Button>
                    <Button
                      size={variant === 'desktop' ? 'default' : 'sm'}
                      variant="outline"
                      onClick={() => handleReject(request.id)}
                      className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
                    >
                      <Icon name="X" size={variant === 'desktop' ? 18 : 16} />
                      {variant === 'desktop' && <span className="ml-1">Отклонить</span>}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendRequests;