import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Icon from '@/components/ui/icon';

const Index = () => {
  const [currentView, setCurrentView] = useState('discover');
  const [currentProfile, setCurrentProfile] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');

  // Демо-данные пользователей
  const profiles = [
    {
      id: 1,
      name: 'Анна',
      age: 25,
      location: 'Москва',
      bio: 'Люблю путешествия, книги и хорошую компанию. Ищу серьезные отношения',
      photos: ['/img/b0c12050-a7e4-46a0-9ea8-b85b2f1ee76e.jpg'],
      interests: ['Путешествия', 'Книги', 'Фотография'],
      verified: true,
      distance: '2 км'
    },
    {
      id: 2,
      name: 'Максим',
      age: 28,
      location: 'Санкт-Петербург',
      bio: 'Программист, спортсмен, любитель кофе. Ищу интересного собеседника',
      photos: ['/img/6f93a8a9-6fa5-4518-9222-3c10f45f175d.jpg'],
      interests: ['Спорт', 'IT', 'Кофе'],
      verified: true,
      distance: '5 км'
    },
    {
      id: 3,
      name: 'Елена',
      age: 23,
      location: 'Москва',
      bio: 'Художница, йога, веганство. Ищу единомышленника',
      photos: ['/img/6a6582eb-19dd-4fb0-82db-d3e42e6df442.jpg'],
      interests: ['Искусство', 'Йога', 'Веганство'],
      verified: false,
      distance: '1 км'
    }
  ];

  const matches = [
    { id: 1, name: 'Анна', photo: '/img/b0c12050-a7e4-46a0-9ea8-b85b2f1ee76e.jpg', lastMessage: 'Привет! Как дела?', time: '2 мин назад' },
    { id: 2, name: 'Максим', photo: '/img/6f93a8a9-6fa5-4518-9222-3c10f45f175d.jpg', lastMessage: 'Увидимся завтра?', time: '1 час назад' }
  ];

  const adminStats = {
    totalUsers: 15420,
    activeUsers: 8965,
    matches: 2341,
    subscriptions: 1205,
    revenue: 95340
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const card = document.getElementById(`profile-${currentProfile}`);
    if (card) {
      card.style.animation = direction === 'right' ? 'swipe-right 0.3s ease-out forwards' : 'swipe-left 0.3s ease-out forwards';
      setTimeout(() => {
        setCurrentProfile(prev => (prev + 1) % profiles.length);
        if (card) {
          card.style.animation = '';
        }
      }, 300);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginForm(false);
  };

  const sendMessage = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">💕 LoveMatch</CardTitle>
            <CardDescription>Найди свою любовь</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showLoginForm ? (
              <>
                <Input placeholder="Email или телефон" type="email" />
                <Input placeholder="Пароль" type="password" />
                <Button onClick={handleLogin} className="w-full">Войти</Button>
                <Button variant="outline" className="w-full" onClick={() => setShowLoginForm(false)}>
                  Назад к регистрации
                </Button>
              </>
            ) : (
              <>
                <Input placeholder="Имя" />
                <Input placeholder="Email" type="email" />
                <Input placeholder="Пароль" type="password" />
                <Button onClick={handleLogin} className="w-full">Зарегистрироваться</Button>
                <Button variant="outline" className="w-full" onClick={() => setShowLoginForm(true)}>
                  Уже есть аккаунт? Войти
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">💕 LoveMatch</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('profile')}>
              <Icon name="User" size={20} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('settings')}>
              <Icon name="Settings" size={20} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsLoggedIn(false)}>
              <Icon name="LogOut" size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <Tabs value={currentView} onValueChange={setCurrentView} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="discover" className="flex items-center gap-2">
                <Icon name="Search" size={16} />
                Поиск
              </TabsTrigger>
              <TabsTrigger value="matches" className="flex items-center gap-2">
                <Icon name="Heart" size={16} />
                Матчи
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <Icon name="MessageCircle" size={16} />
                Чат
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Icon name="User" size={16} />
                Профиль
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Icon name="Shield" size={16} />
                Админ
              </TabsTrigger>
            </TabsList>

            {/* Discover Section */}
            <TabsContent value="discover" className="mt-6">
              <div className="max-w-md mx-auto relative">
                <Card 
                  id={`profile-${currentProfile}`}
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative">
                    <img 
                      src={profiles[currentProfile].photos[0]} 
                      alt={profiles[currentProfile].name}
                      className="w-full h-96 object-cover"
                    />
                    {profiles[currentProfile].verified && (
                      <Badge className="absolute top-4 right-4 bg-blue-500">
                        <Icon name="CheckCircle" size={16} className="mr-1" />
                        Верифицирован
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold">{profiles[currentProfile].name}, {profiles[currentProfile].age}</h3>
                        <p className="text-gray-600 flex items-center">
                          <Icon name="MapPin" size={16} className="mr-1" />
                          {profiles[currentProfile].location} • {profiles[currentProfile].distance}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{profiles[currentProfile].bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {profiles[currentProfile].interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">{interest}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Swipe Buttons */}
                <div className="flex justify-center space-x-8 mt-6">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full w-16 h-16 bg-white hover:bg-red-50 border-red-200"
                    onClick={() => handleSwipe('left')}
                  >
                    <Icon name="X" size={24} className="text-red-500" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full w-16 h-16 bg-white hover:bg-yellow-50 border-yellow-200"
                  >
                    <Icon name="Star" size={24} className="text-yellow-500" />
                  </Button>
                  <Button
                    size="lg"
                    className="rounded-full w-16 h-16"
                    onClick={() => handleSwipe('right')}
                  >
                    <Icon name="Heart" size={24} />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Matches Section */}
            <TabsContent value="matches" className="mt-6">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">Ваши матчи</h2>
                <div className="grid gap-4">
                  {matches.map((match) => (
                    <Card key={match.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={match.photo} alt={match.name} />
                            <AvatarFallback>{match.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{match.name}</h3>
                            <p className="text-gray-600">{match.lastMessage}</p>
                            <p className="text-sm text-gray-400">{match.time}</p>
                          </div>
                          <Button variant="outline" onClick={() => setCurrentView('chat')}>
                            <Icon name="MessageCircle" size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Chat Section */}
            <TabsContent value="chat" className="mt-6">
              <div className="max-w-2xl mx-auto">
                <Card className="h-96">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="/img/b0c12050-a7e4-46a0-9ea8-b85b2f1ee76e.jpg" />
                        <AvatarFallback>А</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>Анна</CardTitle>
                        <CardDescription className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          В сети
                        </CardDescription>
                      </div>
                      <div className="ml-auto flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Icon name="Video" size={16} />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Icon name="Phone" size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      <div className="flex">
                        <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                          <p>Привет! Как дела?</p>
                          <span className="text-xs text-gray-500">14:30</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-primary text-white rounded-lg p-3 max-w-xs">
                          <p>Привет! Всё отлично, а у тебя как?</p>
                          <span className="text-xs opacity-75">14:32</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4">
                    <div className="flex w-full space-x-2">
                      <Input
                        placeholder="Написать сообщение..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <Button onClick={sendMessage}>
                        <Icon name="Send" size={16} />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Profile Section */}
            <TabsContent value="profile" className="mt-6">
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Мой профиль</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src="/img/b0c12050-a7e4-46a0-9ea8-b85b2f1ee76e.jpg" />
                        <AvatarFallback>Я</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">Анна, 25</h3>
                        <p className="text-gray-600">Москва</p>
                        <Badge className="mt-1">
                          <Icon name="CheckCircle" size={14} className="mr-1" />
                          Верифицирован
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">О себе</Label>
                      <Textarea 
                        id="bio"
                        placeholder="Расскажите о себе..."
                        defaultValue="Люблю путешествия, книги и хорошую компанию. Ищу серьезные отношения"
                      />
                    </div>

                    <div>
                      <Label>Интересы</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['Путешествия', 'Книги', 'Фотография', 'Кино', 'Спорт'].map((interest) => (
                          <Badge key={interest} variant="outline" className="cursor-pointer">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full">Сохранить изменения</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Admin Section */}
            <TabsContent value="admin" className="mt-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Панель администратора</h2>
                
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Icon name="Users" size={24} className="mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">{adminStats.totalUsers.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Всего пользователей</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Icon name="UserCheck" size={24} className="mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold">{adminStats.activeUsers.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Активных</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Icon name="Heart" size={24} className="mx-auto mb-2 text-red-500" />
                      <div className="text-2xl font-bold">{adminStats.matches.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Матчей</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Icon name="Crown" size={24} className="mx-auto mb-2 text-yellow-500" />
                      <div className="text-2xl font-bold">{adminStats.subscriptions.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Подписок</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Icon name="DollarSign" size={24} className="mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold">₽{adminStats.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Доход</div>
                    </CardContent>
                  </Card>
                </div>

                {/* User Management */}
                <Card>
                  <CardHeader>
                    <CardTitle>Управление пользователями</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profiles.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={user.photos[0]} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{user.name}, {user.age}</h4>
                              <p className="text-sm text-gray-600">{user.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {user.verified && (
                              <Badge className="bg-blue-500">Верифицирован</Badge>
                            )}
                            <Button variant="outline" size="sm">
                              <Icon name="Edit" size={14} />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Icon name="Ban" size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </nav>
    </div>
  );
};

export default Index;