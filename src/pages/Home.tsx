import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function Home() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      await register(email, password, name);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-red-100">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ 
            backgroundImage: `url('/img/c23d3f96-cfdf-4b77-81c7-9bbfbb8d8a25.jpg')`,
            backgroundAttachment: 'fixed'
          }}
        />
        
        {/* Animated Floating Hearts */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute floating-hearts"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <Icon 
                name="Heart" 
                className="text-pink-300 opacity-40 hover:opacity-60 transition-opacity" 
                size={16 + Math.random() * 16} 
              />
            </div>
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/30" />
        
        {/* Moving Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-pink-200 rounded-full opacity-40 particle-move"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Icon name="Heart" className="text-red-500" size={32} />
            <span className="text-2xl font-bold text-gray-800">LoveConnect</span>
          </div>
          <div className="flex space-x-4">
            <Button variant="ghost" className="text-gray-600">
              Как это работает
            </Button>
            <Button variant="ghost" className="text-gray-600">
              Безопасность
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 drop-shadow-lg">
            Найди свою <span className="gradient-text love-pulse">любовь</span>
          </h1>
          <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto drop-shadow-sm">
            Более 2 миллионов пользователей уже нашли свою вторую половинку. 
            Присоединяйся и ты!
          </p>

          {/* Registration Form */}
          <Card className="max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-2xl border-0 transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="flex rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      !isLogin ? 'bg-white text-red-500 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Регистрация
                  </button>
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      isLogin ? 'bg-white text-red-500 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Вход
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <Input
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                    required
                  />
                )}
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
                <Input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold"
                >
                  {isLogin ? 'Войти' : 'Начать знакомства'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            Почему выбирают нас?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Shield" className="text-red-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Безопасность</h3>
              <p className="text-gray-600">
                Все профили проверяются вручную. Мы заботимся о вашей безопасности
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Users" className="text-pink-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">2M+ пользователей</h3>
              <p className="text-gray-600">
                Большая база активных пользователей для серьезных отношений
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Zap" className="text-purple-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Умный подбор</h3>
              <p className="text-gray-600">
                Алгоритм подбирает совместимых партнеров на основе ваших интересов
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-pink-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">2M+</div>
              <div className="text-lg">Пользователей</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500K</div>
              <div className="text-lg">Пар нашлось</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-lg">Довольных</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg">Поддержка</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            Истории любви
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mr-4">
                    <Icon name="Heart" className="text-pink-500" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold">Анна и Михаил</div>
                    <div className="text-sm text-gray-500">Вместе 2 года</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Познакомились здесь и сразу поняли - это судьба! Теперь планируем свадьбу."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mr-4">
                    <Icon name="Heart" className="text-blue-500" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold">Елена и Дмитрий</div>
                    <div className="text-sm text-gray-500">Вместе 1 год</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Долго искали друг друга, но благодаря сайту наконец встретились!"
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mr-4">
                    <Icon name="Heart" className="text-green-500" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold">Ольга и Андрей</div>
                    <div className="text-sm text-gray-500">Вместе 3 года</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Здесь я нашла не просто партнера, а лучшего друга и любовь всей жизни."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Heart" className="text-red-500" size={24} />
                <span className="text-xl font-bold">LoveConnect</span>
              </div>
              <p className="text-gray-400">
                Самый надежный сайт знакомств для серьезных отношений
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <div className="space-y-2 text-gray-400">
                <div>О нас</div>
                <div>Карьера</div>
                <div>Пресса</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Помощь</h4>
              <div className="space-y-2 text-gray-400">
                <div>FAQ</div>
                <div>Поддержка</div>
                <div>Безопасность</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-gray-400">
                <div>help@loveconnect.ru</div>
                <div>+7 (800) 123-45-67</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}