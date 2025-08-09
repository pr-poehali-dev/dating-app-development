import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function HomeWeb() {
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
      await register({ email, password, name, age: 25 });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-red-50">
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ec4899' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Найди свою идеальную 
                <span className="text-red-500 block">половинку</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Более 2 миллионов пользователей уже нашли свою любовь на нашем сайте. 
                Присоединяйся к сообществу людей, которые ищут серьезные отношения.
              </p>
              
              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <Icon name="Shield" className="text-red-500" size={20} />
                  </div>
                  <span className="text-gray-700">Безопасно и надежно</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Icon name="Users" className="text-blue-500" size={20} />
                  </div>
                  <span className="text-gray-700">2M+ активных пользователей</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Icon name="Heart" className="text-green-500" size={20} />
                  </div>
                  <span className="text-gray-700">500K+ счастливых пар</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Icon name="Zap" className="text-purple-500" size={20} />
                  </div>
                  <span className="text-gray-700">Умный подбор партнеров</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-red-500 hover:bg-red-600 text-white px-8"
                  onClick={() => setIsLogin(false)}
                >
                  <Icon name="Heart" size={20} className="mr-2" />
                  Начать знакомства
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-gray-300"
                >
                  <Icon name="Play" size={20} className="mr-2" />
                  Как это работает
                </Button>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:pl-8">
              <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {isLogin ? 'Добро пожаловать!' : 'Создать аккаунт'}
                    </h2>
                    <p className="text-gray-600">
                      {isLogin ? 'Войдите в свой аккаунт' : 'Начните поиск своей любви'}
                    </p>
                  </div>

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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ваше имя
                        </label>
                        <Input
                          type="text"
                          placeholder="Введите ваше имя"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-12"
                          required
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email адрес
                      </label>
                      <Input
                        type="email"
                        placeholder="your@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Пароль
                      </label>
                      <Input
                        type="password"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold text-lg"
                    >
                      {isLogin ? 'Войти в аккаунт' : 'Создать аккаунт'}
                    </Button>
                  </form>

                  {!isLogin && (
                    <p className="text-xs text-gray-500 text-center mt-4">
                      Создавая аккаунт, вы соглашаетесь с нашими 
                      <a href="#" className="text-red-500 hover:underline"> Условиями использования</a> и 
                      <a href="#" className="text-red-500 hover:underline"> Политикой конфиденциальности</a>
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Доверьтесь цифрам
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Тысячи людей каждый день находят свою любовь благодаря нашему сервису
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">2M+</div>
              <div className="text-gray-600">Активных пользователей</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">500K+</div>
              <div className="text-gray-600">Счастливых пар</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">95%</div>
              <div className="text-gray-600">Довольных клиентов</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">24/7</div>
              <div className="text-gray-600">Поддержка</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Как это работает?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Простой и эффективный способ найти свою вторую половинку
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="UserPlus" className="text-red-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Создайте профиль</h3>
              <p className="text-gray-600">
                Расскажите о себе, добавьте фотографии и укажите свои интересы
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Search" className="text-blue-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Найдите совпадения</h3>
              <p className="text-gray-600">
                Наш алгоритм подберет для вас наиболее совместимых партнеров
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="MessageCircle" className="text-green-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Начните общение</h3>
              <p className="text-gray-600">
                Отправляйте сообщения, планируйте встречи и стройте отношения
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}