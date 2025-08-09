import { useState } from 'react';
import { Heart, Users, MessageCircle, Shield, Smartphone, Tablet, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Heart,
      title: "Найди свою любовь",
      description: "Знакомства с реальными людьми в твоем городе"
    },
    {
      icon: Shield,
      title: "Безопасно и надежно",
      description: "Верифицированные анкеты и защита данных"
    },
    {
      icon: MessageCircle,
      title: "Общение без границ",
      description: "Удобный чат с мгновенными уведомлениями"
    },
    {
      icon: Users,
      title: "Умный алгоритм",
      description: "Подбор по интересам и предпочтениям"
    }
  ];

  const deviceFeatures = [
    {
      icon: Smartphone,
      title: "На смартфоне",
      description: "Удобные свайпы и мгновенные уведомления"
    },
    {
      icon: Tablet,
      title: "На планшете",
      description: "Большой экран для просмотра фото и профилей"
    },
    {
      icon: Monitor,
      title: "На компьютере",
      description: "Полнофункциональная версия с расширенными возможностями"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-pink-600" />
            <span className="text-2xl font-bold text-gray-900">NoumiDating</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <button 
              onClick={() => navigate('/auth')}
              className="text-gray-600 hover:text-pink-600 transition-colors"
            >
              Войти
            </button>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
            >
              Регистрация
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Найди свою
            <span className="block bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
              половинку
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Знакомства с реальными людьми. Никаких ботов, только настоящие эмоции и искренние отношения.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 px-8 py-4 text-lg"
            >
              Начать знакомства
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth')}
              className="border-pink-300 text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg"
            >
              Узнать больше
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Почему выбирают нас
          </h2>
          <p className="text-xl text-gray-600">
            Современный подход к знакомствам
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                  activeFeature === index
                    ? 'bg-gradient-to-br from-pink-500 to-red-500 text-white shadow-2xl transform scale-105'
                    : 'bg-white text-gray-900 shadow-lg hover:shadow-xl'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <Icon className="w-12 h-12 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-center opacity-90">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Device Compatibility */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Доступно на всех устройствах
            </h2>
            <p className="text-xl text-gray-600">
              Знакомьтесь в любое время и в любом месте
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {deviceFeatures.map((device, index) => {
              const Icon = device.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <Icon className="w-10 h-10 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {device.title}
                  </h3>
                  <p className="text-gray-600">
                    {device.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Готов найти свою любовь?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Присоединяйся к тысячам счастливых пар уже сегодня
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            Создать аккаунт бесплатно
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="w-6 h-6 text-pink-500" />
              <span className="text-xl font-bold">NoumiDating</span>
            </div>
            <p className="text-gray-400 mb-6">
              Создаем настоящие отношения
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/auth')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Политика конфиденциальности
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Пользовательское соглашение
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Поддержка
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;