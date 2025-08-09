import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, User } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

export default function MatchesWeb() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = () => {
    // Здесь должна быть загрузка реальных матчей из API
    const realMatches: User[] = [];
    setMatches(realMatches);
    setLoading(false);

  };

  const startChat = (matchId: string) => {
    navigate(`/chat/${matchId}`);
  };

  const openProfile = (match: User) => {
    setSelectedProfile(match);
  };

  const closeProfile = () => {
    setSelectedProfile(null);
  };

  const filteredMatches = matches.filter(match =>
    match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.interests.some(interest => 
      interest.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-love-DEFAULT border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Загружаем совпадения...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Совпадения</h1>
              <p className="text-gray-600 mt-2">У вас {matches.length} взаимных симпатий</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Поиск по имени или интересам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Button 
                onClick={() => navigate('/discover')}
                className="bg-love-DEFAULT hover:bg-love-dark"
              >
                <Icon name="Search" size={16} className="mr-2" />
                Найти ещё
              </Button>
            </div>
          </div>
        </div>

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Users" size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {matches.length === 0 ? 'Пока нет совпадений' : 'Ничего не найдено'}
            </h2>
            <p className="text-gray-600 mb-8">
              {matches.length === 0 
                ? 'Продолжайте искать, ваша половинка где-то рядом!' 
                : 'Попробуйте изменить запрос поиска'
              }
            </p>
            {matches.length === 0 && (
              <Button 
                onClick={() => navigate('/discover')}
                className="bg-love-DEFAULT hover:bg-love-dark"
              >
                Начать поиск
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMatches.map((match) => (
              <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative">
                  {/* Profile Image */}
                  <div className="aspect-[4/5] bg-gradient-to-br from-love-light via-purple-200 to-blue-200 flex items-center justify-center">
                    <Icon name="User" size={80} className="text-gray-600" />
                    
                    {/* Online Status */}
                    {match.settings?.showOnlineStatus && (
                      <div className="absolute top-4 right-4">
                        <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                      </div>
                    )}
                    
                    {/* Verification Badge */}
                    {match.verified && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-blue-500 text-white">
                          <Icon name="Shield" size={12} className="mr-1" />
                          Верифицирован
                        </Badge>
                      </div>
                    )}

                    {/* Location */}
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      📍 {match.location?.city || 'Москва'}
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* User Info */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {match.name}, {match.age}
                      </h3>
                      <Badge variant={match.subscription === 'premium' ? 'default' : 'secondary'}>
                        {match.subscription === 'premium' ? 'Premium' : 'Базовый'}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-4">
                      {match.bio}
                    </p>

                    {/* Interests */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {match.interests.slice(0, 3).map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {match.interests.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{match.interests.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => startChat(match.id)}
                        className="flex-1 bg-love-DEFAULT hover:bg-love-dark text-white"
                      >
                        <Icon name="MessageCircle" size={16} className="mr-2" />
                        Написать
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => openProfile(match)}
                        className="flex-1"
                      >
                        <Icon name="User" size={16} className="mr-2" />
                        Профиль
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Profile Modal */}
        {selectedProfile && (
          <Dialog open={!!selectedProfile} onOpenChange={() => closeProfile()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-gradient-to-br from-love-light to-love-DEFAULT text-white text-lg">
                      {selectedProfile.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{selectedProfile.name}, {selectedProfile.age}</span>
                      {selectedProfile.verified && (
                        <Icon name="Shield" size={16} className="text-blue-500" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500 font-normal">
                      📍 {selectedProfile.location?.city || 'Москва'}
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Profile Photos Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center">
                    <Icon name="User" size={40} className="text-gray-600" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-blue-200 to-cyan-200 rounded-lg flex items-center justify-center">
                    <Icon name="Camera" size={32} className="text-gray-600" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-green-200 to-emerald-200 rounded-lg flex items-center justify-center">
                    <Icon name="Heart" size={32} className="text-gray-600" />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h4 className="font-semibold mb-3 text-lg">О себе:</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedProfile.bio}
                  </p>
                </div>

                {/* Interests */}
                <div>
                  <h4 className="font-semibold mb-3 text-lg">Интересы:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-gray-500 text-sm">Возраст:</span>
                    <div className="font-semibold text-lg">{selectedProfile.age} лет</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Подписка:</span>
                    <div className="font-semibold text-lg">
                      {selectedProfile.subscription === 'premium' ? 'Premium' : 'Базовая'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Статус:</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedProfile.settings?.showOnlineStatus ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <span className="font-medium">
                        {selectedProfile.settings?.showOnlineStatus ? 'Онлайн' : 'Был(а) недавно'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Верификация:</span>
                    <div className="flex items-center gap-2">
                      {selectedProfile.verified ? (
                        <>
                          <Icon name="Shield" size={16} className="text-blue-500" />
                          <span className="font-medium text-blue-600">Верифицирован</span>
                        </>
                      ) : (
                        <span className="font-medium text-gray-600">Не верифицирован</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 bg-love-DEFAULT hover:bg-love-dark"
                    onClick={() => {
                      startChat(selectedProfile.id);
                      closeProfile();
                    }}
                  >
                    <Icon name="MessageCircle" size={18} className="mr-2" />
                    Написать сообщение
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="border-red-200 hover:bg-red-50"
                  >
                    <Icon name="Heart" size={18} className="text-red-500" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="border-blue-200 hover:bg-blue-50"
                  >
                    <Icon name="Star" size={18} className="text-blue-500" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={closeProfile}
                  >
                    <Icon name="X" size={18} />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}