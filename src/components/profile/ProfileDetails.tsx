import { User } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ProfileDetailsProps {
  user: User;
  variant?: 'desktop' | 'mobile';
}

const ProfileDetails = ({ user, variant = 'mobile' }: ProfileDetailsProps) => {
  const isDesktop = variant === 'desktop';

  const getZodiacEmoji = (zodiac?: string) => {
    const zodiacEmojis = {
      aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋', leo: '♌', virgo: '♍',
      libra: '♎', scorpio: '♏', sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
    };
    return zodiac ? zodiacEmojis[zodiac as keyof typeof zodiacEmojis] : '';
  };

  const getZodiacName = (zodiac?: string) => {
    const zodiacNames = {
      aries: 'Овен', taurus: 'Телец', gemini: 'Близнецы', cancer: 'Рак',
      leo: 'Лев', virgo: 'Дева', libra: 'Весы', scorpio: 'Скорпион',
      sagittarius: 'Стрелец', capricorn: 'Козерог', aquarius: 'Водолей', pisces: 'Рыбы'
    };
    return zodiac ? zodiacNames[zodiac as keyof typeof zodiacNames] : '';
  };

  const getEducationLabel = (education?: string) => {
    const labels = {
      school: 'Среднее образование',
      college: 'Среднее специальное',
      bachelor: 'Бакалавриат',
      master: 'Магистратура',
      phd: 'Кандидат наук'
    };
    return education ? labels[education as keyof typeof labels] : '';
  };

  const getBodyTypeLabel = (bodyType?: string) => {
    const labels = {
      slim: 'Стройное', athletic: 'Спортивное', average: 'Среднее',
      curvy: 'Пышное', large: 'Крупное'
    };
    return bodyType ? labels[bodyType as keyof typeof labels] : '';
  };

  const getLookingForLabel = (lookingFor?: string) => {
    const labels = {
      casual: 'Общение', serious: 'Серьёзные отношения', friendship: 'Дружба',
      marriage: 'Брак', activity_partner: 'Партнёр по интересам'
    };
    return lookingFor ? labels[lookingFor as keyof typeof labels] : '';
  };

  return (
    <div className="space-y-4">
      {/* Основная информация */}
      <Card className={`bg-white/95 backdrop-blur-sm border-0 ${isDesktop ? 'shadow-xl' : 'shadow-lg'}`}>
        <CardHeader className={`${isDesktop ? 'pb-4' : 'pb-3'}`}>
          <CardTitle className={`flex items-center gap-2 ${isDesktop ? 'text-lg' : 'text-base'} text-gray-800`}>
            <Icon name="User" size={isDesktop ? 18 : 16} className="text-purple-500" />
            Основная информация
          </CardTitle>
        </CardHeader>
        <CardContent className={`space-y-3 ${isDesktop ? 'pt-0' : 'pt-0'}`}>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {user.height && (
              <div className="flex items-center gap-2">
                <Icon name="Ruler" size={14} className="text-gray-400" />
                <span className="text-gray-600">Рост:</span>
                <span className="font-medium">{user.height} см</span>
              </div>
            )}
            
            {user.bodyType && (
              <div className="flex items-center gap-2">
                <Icon name="User" size={14} className="text-gray-400" />
                <span className="text-gray-600">Телосложение:</span>
                <span className="font-medium">{getBodyTypeLabel(user.bodyType)}</span>
              </div>
            )}

            {user.zodiac && (
              <div className="flex items-center gap-2">
                <span className="text-lg">{getZodiacEmoji(user.zodiac)}</span>
                <span className="text-gray-600">Знак зодиака:</span>
                <span className="font-medium">{getZodiacName(user.zodiac)}</span>
              </div>
            )}

            {user.education && (
              <div className="flex items-center gap-2">
                <Icon name="GraduationCap" size={14} className="text-gray-400" />
                <span className="text-gray-600">Образование:</span>
                <span className="font-medium">{getEducationLabel(user.education)}</span>
              </div>
            )}
          </div>

          {user.work && (
            <div className="flex items-center gap-2 text-sm">
              <Icon name="Briefcase" size={14} className="text-gray-400" />
              <span className="text-gray-600">Работа:</span>
              <span className="font-medium">{user.work}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Образ жизни */}
      {(user.smoking || user.drinking || user.diet || user.pets) && (
        <Card className={`bg-white/95 backdrop-blur-sm border-0 ${isDesktop ? 'shadow-xl' : 'shadow-lg'}`}>
          <CardHeader className={`${isDesktop ? 'pb-4' : 'pb-3'}`}>
            <CardTitle className={`flex items-center gap-2 ${isDesktop ? 'text-lg' : 'text-base'} text-gray-800`}>
              <Icon name="Coffee" size={isDesktop ? 18 : 16} className="text-purple-500" />
              Образ жизни
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="grid grid-cols-1 gap-2 text-sm">
              {user.smoking && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Cigarette" size={14} className="text-gray-400" />
                    <span className="text-gray-600">Курение</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {user.smoking === 'never' && 'Не курю'}
                    {user.smoking === 'sometimes' && 'Иногда'}
                    {user.smoking === 'often' && 'Часто'}
                    {user.smoking === 'socially' && 'В компании'}
                  </Badge>
                </div>
              )}

              {user.drinking && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Wine" size={14} className="text-gray-400" />
                    <span className="text-gray-600">Алкоголь</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {user.drinking === 'never' && 'Не пью'}
                    {user.drinking === 'socially' && 'В компании'}
                    {user.drinking === 'often' && 'Часто'}
                    {user.drinking === 'rarely' && 'Редко'}
                  </Badge>
                </div>
              )}

              {user.pets && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Heart" size={14} className="text-gray-400" />
                    <span className="text-gray-600">Животные</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {user.pets === 'none' && 'Нет'}
                    {user.pets === 'have_dogs' && 'Есть собака'}
                    {user.pets === 'have_cats' && 'Есть кот'}
                    {user.pets === 'have_other' && 'Есть другие'}
                    {user.pets === 'love_all' && 'Люблю всех'}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Отношения и семья */}
      {(user.children || user.wantChildren || user.lookingFor) && (
        <Card className={`bg-white/95 backdrop-blur-sm border-0 ${isDesktop ? 'shadow-xl' : 'shadow-lg'}`}>
          <CardHeader className={`${isDesktop ? 'pb-4' : 'pb-3'}`}>
            <CardTitle className={`flex items-center gap-2 ${isDesktop ? 'text-lg' : 'text-base'} text-gray-800`}>
              <Icon name="Heart" size={isDesktop ? 18 : 16} className="text-purple-500" />
              Отношения
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="space-y-2 text-sm">
              {user.lookingFor && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ищу:</span>
                  <Badge variant="default" className="bg-purple-100 text-purple-700 text-xs">
                    {getLookingForLabel(user.lookingFor)}
                  </Badge>
                </div>
              )}

              {user.children && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Дети:</span>
                  <Badge variant="secondary" className="text-xs">
                    {user.children === 'none' && 'Нет детей'}
                    {user.children === 'have' && 'Есть дети'}
                    {user.children === 'want' && 'Хочу детей'}
                    {user.children === 'dont_want' && 'Не хочу детей'}
                  </Badge>
                </div>
              )}

              {user.wantChildren && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Планирую детей:</span>
                  <Badge variant="secondary" className="text-xs">
                    {user.wantChildren === 'yes' && 'Да'}
                    {user.wantChildren === 'no' && 'Нет'}
                    {user.wantChildren === 'maybe' && 'Возможно'}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Языки */}
      {user.languages && user.languages.length > 0 && (
        <Card className={`bg-white/95 backdrop-blur-sm border-0 ${isDesktop ? 'shadow-xl' : 'shadow-lg'}`}>
          <CardHeader className={`${isDesktop ? 'pb-4' : 'pb-3'}`}>
            <CardTitle className={`flex items-center gap-2 ${isDesktop ? 'text-lg' : 'text-base'} text-gray-800`}>
              <Icon name="Languages" size={isDesktop ? 18 : 16} className="text-purple-500" />
              Языки
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {user.languages.map((language, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {language}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileDetails;