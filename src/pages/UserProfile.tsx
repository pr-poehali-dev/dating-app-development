import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, User } from '@/contexts/AuthContext';
import { useFriends } from '@/contexts/FriendsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { sendFriendRequest, removeFriend, getFriendshipStatus } = useFriends();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/discover');
      return;
    }

    // Загружаем данные пользователя
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.id === id);
    
    if (foundUser) {
      setUser(foundUser);
    } else {
      navigate('/discover');
    }
    
    setIsLoading(false);
  }, [id, navigate]);

  const handleFriendAction = () => {
    if (!user || !currentUser) return;

    const status = getFriendshipStatus(user.id);
    
    if (status === 'none') {
      sendFriendRequest(user.id);
    } else if (status === 'friends') {
      removeFriend(user.id);
    }
  };

  const getFriendButtonText = () => {
    if (!user) return '';
    
    const status = getFriendshipStatus(user.id);
    
    switch (status) {
      case 'none':
        return '👥 Добавить в друзья';
      case 'sent':
        return '⏳ Заявка отправлена';
      case 'received':
        return '💌 Принять заявку';
      case 'friends':
        return '✅ В друзьях';
      default:
        return '👥 Добавить в друзья';
    }
  };

  const getFriendButtonVariant = () => {
    if (!user) return 'default';
    
    const status = getFriendshipStatus(user.id);
    
    switch (status) {
      case 'none':
        return 'default';
      case 'sent':
        return 'secondary';
      case 'received':
        return 'default';
      case 'friends':
        return 'outline';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin">
          <Icon name="Loader2" size={32} className="text-purple-600" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Icon name="UserX" size={64} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Пользователь не найден</h2>
          <Button onClick={() => navigate('/discover')}>
            Вернуться к поиску
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
      {/* Десктоп версия */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-6 py-8">
          {/* Хедер */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="border-gray-200 hover:bg-gray-50"
              >
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Назад
              </Button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {user.name}
                </h1>
                <p className="text-gray-600 text-lg">Профиль пользователя</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleFriendAction}
                variant={getFriendButtonVariant() as any}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                disabled={getFriendshipStatus(user.id) === 'sent'}
              >
                {getFriendButtonText()}
              </Button>
              <Button
                variant="outline"
                className="border-blue-200 hover:bg-blue-50 text-blue-600"
              >
                <Icon name="MessageCircle" size={20} className="mr-2" />
                Написать
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Левая колонка */}
            <div className="xl:col-span-2 space-y-6">
              {/* Основная информация */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      {user.photos && user.photos.length > 0 ? (
                        <img
                          src={user.photos[0]}
                          alt={user.name}
                          className="w-32 h-32 rounded-full object-cover shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <Icon name="User" size={48} className="text-white" />
                        </div>
                      )}
                      {user.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-2 shadow-lg">
                          <Icon name="ShieldCheck" size={20} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
                        {user.subscription === 'premium' && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                            <Icon name="Crown" size={16} className="mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      <p className="text-xl text-gray-600 mb-4">
                        {user.age} лет • {user.location.city}
                      </p>
                      <p className="text-gray-700 text-lg leading-relaxed">{user.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Интересы */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Icon name="Heart" size={24} className="text-pink-500" />
                    Интересы
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {user.interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border-purple-200 px-4 py-2 text-base"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Правая колонка */}
            <div className="space-y-6">
              {/* Подробная информация */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Icon name="Info" size={20} className="text-blue-500" />
                    О себе
                  </h3>
                  <div className="space-y-4">
                    {user.height && (
                      <div className="flex items-center gap-3">
                        <Icon name="Ruler" size={18} className="text-gray-500" />
                        <span>{user.height} см</span>
                        {user.bodyType && (
                          <span className="text-gray-500">• {
                            user.bodyType === 'slim' ? 'Стройное' :
                            user.bodyType === 'athletic' ? 'Спортивное' :
                            user.bodyType === 'average' ? 'Среднее' :
                            user.bodyType === 'curvy' ? 'Пышное' : 'Крупное'
                          }</span>
                        )}
                      </div>
                    )}
                    
                    {user.work && (
                      <div className="flex items-center gap-3">
                        <Icon name="Briefcase" size={18} className="text-gray-500" />
                        <span>{user.work}</span>
                      </div>
                    )}
                    
                    {user.education && (
                      <div className="flex items-center gap-3">
                        <Icon name="GraduationCap" size={18} className="text-gray-500" />
                        <span>
                          {user.education === 'school' && 'Среднее образование'}
                          {user.education === 'college' && 'Среднее специальное'}
                          {user.education === 'bachelor' && 'Высшее (бакалавр)'}
                          {user.education === 'master' && 'Высшее (магистр)'}
                          {user.education === 'phd' && 'Ученая степень'}
                        </span>
                      </div>
                    )}

                    {user.zodiac && (
                      <div className="flex items-center gap-3">
                        <Icon name="Star" size={18} className="text-gray-500" />
                        <span>
                          {user.zodiac === 'aries' && '♈ Овен'}
                          {user.zodiac === 'taurus' && '♉ Телец'}
                          {user.zodiac === 'gemini' && '♊ Близнецы'}
                          {user.zodiac === 'cancer' && '♋ Рак'}
                          {user.zodiac === 'leo' && '♌ Лев'}
                          {user.zodiac === 'virgo' && '♍ Дева'}
                          {user.zodiac === 'libra' && '♎ Весы'}
                          {user.zodiac === 'scorpio' && '♏ Скорпион'}
                          {user.zodiac === 'sagittarius' && '♐ Стрелец'}
                          {user.zodiac === 'capricorn' && '♑ Козерог'}
                          {user.zodiac === 'aquarius' && '♒ Водолей'}
                          {user.zodiac === 'pisces' && '♓ Рыбы'}
                        </span>
                      </div>
                    )}

                    {user.languages && user.languages.length > 0 && (
                      <div className="flex items-center gap-3">
                        <Icon name="Globe" size={18} className="text-gray-500" />
                        <span>Языки: {user.languages.join(', ')}</span>
                      </div>
                    )}

                    {user.lookingFor && (
                      <div className="flex items-center gap-3">
                        <Icon name="Search" size={18} className="text-gray-500" />
                        <span>
                          Ищет: {user.lookingFor === 'casual' && 'Общение'}
                          {user.lookingFor === 'serious' && 'Серьезные отношения'}
                          {user.lookingFor === 'friendship' && 'Дружбу'}
                          {user.lookingFor === 'marriage' && 'Брак'}
                          {user.lookingFor === 'activity_partner' && 'Партнера по интересам'}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Фотографии */}
              {user.photos && user.photos.length > 1 && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Icon name="Camera" size={20} className="text-purple-500" />
                      Фотографии ({user.photos.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {user.photos.slice(1, 5).map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`${user.name} фото ${index + 2}`}
                          className="w-full h-24 object-cover rounded-lg shadow-md"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Мобильная версия */}
      <div className="lg:hidden min-h-screen p-4 pb-24">
        <div className="max-w-md mx-auto pt-safe">
          <div className="flex items-center justify-between mb-6 pt-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:bg-gray-100"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <h1 className="text-xl font-bold text-gray-800">Профиль</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>

          <div className="space-y-4">
            {/* Основная карточка */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  {user.photos && user.photos.length > 0 ? (
                    <img
                      src={user.photos[0]}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <Icon name="User" size={32} className="text-white" />
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-gray-800 mt-4">{user.name}</h2>
                  <p className="text-lg text-gray-600">{user.age} лет • {user.location.city}</p>
                </div>
                
                <div className="flex gap-3 mb-6">
                  <Button
                    onClick={handleFriendAction}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                    disabled={getFriendshipStatus(user.id) === 'sent'}
                  >
                    {getFriendButtonText()}
                  </Button>
                  <Button variant="outline" className="border-blue-200 hover:bg-blue-50 text-blue-600">
                    <Icon name="MessageCircle" size={20} />
                  </Button>
                </div>

                <p className="text-gray-700 text-center">{user.bio}</p>
              </CardContent>
            </Card>

            {/* Интересы */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon name="Heart" size={20} className="text-pink-500" />
                  Интересы
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border-purple-200"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Подробная информация для мобильной версии */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon name="Info" size={20} className="text-blue-500" />
                  Подробнее
                </h3>
                <div className="space-y-3">
                  {user.height && (
                    <div className="flex items-center gap-3 text-sm">
                      <Icon name="Ruler" size={16} className="text-gray-500" />
                      <span>{user.height} см</span>
                      {user.bodyType && (
                        <span className="text-gray-500">• {
                          user.bodyType === 'slim' ? 'Стройное' :
                          user.bodyType === 'athletic' ? 'Спортивное' :
                          user.bodyType === 'average' ? 'Среднее' :
                          user.bodyType === 'curvy' ? 'Пышное' : 'Крупное'
                        }</span>
                      )}
                    </div>
                  )}
                  
                  {user.work && (
                    <div className="flex items-center gap-3 text-sm">
                      <Icon name="Briefcase" size={16} className="text-gray-500" />
                      <span>{user.work}</span>
                    </div>
                  )}

                  {user.lookingFor && (
                    <div className="flex items-center gap-3 text-sm">
                      <Icon name="Search" size={16} className="text-gray-500" />
                      <span>
                        Ищет: {user.lookingFor === 'casual' && 'Общение'}
                        {user.lookingFor === 'serious' && 'Серьезные отношения'}
                        {user.lookingFor === 'friendship' && 'Дружбу'}
                        {user.lookingFor === 'marriage' && 'Брак'}
                        {user.lookingFor === 'activity_partner' && 'Партнера по интересам'}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;