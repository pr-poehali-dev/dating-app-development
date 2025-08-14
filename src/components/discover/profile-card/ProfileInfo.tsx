import { User } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ProfileInfoProps {
  profile: User;
  variant: 'desktop' | 'tablet' | 'mobile';
  textSizes: { [key: string]: { title: string; subtitle: string; bio: string } };
  showSwipeHints: boolean;
}

const ProfileInfo = ({
  profile,
  variant,
  textSizes,
  showSwipeHints
}: ProfileInfoProps) => {
  const navigate = useNavigate();

  return (
    <div className={cn(
      "flex flex-col justify-between",
      variant === 'desktop' ? "h-1/4 p-6" : variant === 'tablet' ? "h-1/4 p-4" : "h-1/3 p-5"
    )}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className={cn(
              "font-bold flex items-center gap-2 text-gray-800",
              textSizes[variant].title
            )}>
              {profile.name}
              {profile.verified && (
                <Icon 
                  name="BadgeCheck" 
                  size={variant === 'desktop' ? 24 : variant === 'tablet' ? 20 : 22} 
                  className="text-blue-500" 
                />
              )}
            </h3>
            <p className={cn("text-gray-600", textSizes[variant].subtitle)}>
              {profile.age} лет • {profile.location.city}
            </p>
          </div>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-sm",
            profile.settings?.showOnlineStatus 
              ? "bg-green-100 text-green-700" 
              : "bg-gray-100 text-gray-600",
            variant === 'tablet' && "px-2 py-1 text-xs gap-1"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              profile.settings?.showOnlineStatus ? "bg-green-500 animate-pulse" : "bg-gray-400"
            )} />
            <span className="font-medium">
              {profile.settings?.showOnlineStatus ? 'Онлайн' : variant === 'tablet' ? 'Недавно' : 'Недавно'}
            </span>
          </div>
        </div>

        {/* Подробная информация */}
        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-1 gap-2">
            {profile.height && (
              <div className="flex items-center gap-2 text-gray-600">
                <Icon name="Ruler" size={14} />
                <span className="text-sm">{profile.height} см</span>
                {profile.bodyType && (
                  <span className="text-sm">• {
                    profile.bodyType === 'slim' ? 'Стройное' :
                    profile.bodyType === 'athletic' ? 'Спортивное' :
                    profile.bodyType === 'average' ? 'Среднее' :
                    profile.bodyType === 'curvy' ? 'Пышное' : 'Крупное'
                  }</span>
                )}
              </div>
            )}
            
            {profile.work && (
              <div className="flex items-center gap-2 text-gray-600">
                <Icon name="Briefcase" size={14} />
                <span className="text-sm line-clamp-1">{profile.work}</span>
              </div>
            )}
            
            {profile.education && (
              <div className="flex items-center gap-2 text-gray-600">
                <Icon name="GraduationCap" size={14} />
                <span className="text-sm">
                  {profile.education === 'school' && 'Среднее образование'}
                  {profile.education === 'college' && 'Среднее специальное'}
                  {profile.education === 'bachelor' && 'Высшее (бакалавр)'}
                  {profile.education === 'master' && 'Высшее (магистр)'}
                  {profile.education === 'phd' && 'Ученая степень'}
                </span>
              </div>
            )}

            {/* Семейное положение и дети */}
            {profile.relationship && (
              <div className="flex items-center gap-2 text-gray-600">
                <Icon name="Heart" size={14} />
                <span className="text-sm">
                  {profile.relationship === 'single' && 'Не женат/не замужем'}
                  {profile.relationship === 'divorced' && 'В разводе'}
                  {profile.relationship === 'widowed' && 'Вдовец/вдова'}
                </span>
                {profile.children && (
                  <span className="text-sm">• {
                    profile.children === 'none' ? 'Нет детей' :
                    profile.children === 'have' ? 'Есть дети' :
                    profile.children === 'want' ? 'Хочу детей' : 'Не хочу детей'
                  }</span>
                )}
              </div>
            )}

            {/* Образ жизни */}
            {(profile.smoking || profile.drinking) && (
              <div className="flex items-center gap-2 text-gray-600">
                <Icon name="Coffee" size={14} />
                <div className="flex gap-3 text-sm">
                  {profile.smoking && (
                    <span>
                      {profile.smoking === 'never' && '🚭 Не курю'}
                      {profile.smoking === 'sometimes' && '🚬 Иногда'}
                      {profile.smoking === 'often' && '🚬 Курю'}
                      {profile.smoking === 'socially' && '🚬 В компании'}
                    </span>
                  )}
                  {profile.drinking && (
                    <span>
                      {profile.drinking === 'never' && '🚫 Не пью'}
                      {profile.drinking === 'socially' && '🍷 В компании'}
                      {profile.drinking === 'often' && '🍷 Регулярно'}
                      {profile.drinking === 'rarely' && '🍷 Редко'}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Что ищет */}
            {profile.lookingFor && (
              <div className="flex items-center gap-2 text-gray-600">
                <Icon name="Search" size={14} />
                <span className="text-sm">
                  Ищу: {profile.lookingFor === 'casual' && 'Общение'}
                  {profile.lookingFor === 'serious' && 'Серьезные отношения'}
                  {profile.lookingFor === 'friendship' && 'Дружбу'}
                  {profile.lookingFor === 'marriage' && 'Брак'}
                  {profile.lookingFor === 'activity_partner' && 'Партнера по интересам'}
                </span>
              </div>
            )}

            {/* Знак зодиака */}
            {profile.zodiac && (
              <div className="flex items-center gap-2 text-gray-600">
                <Icon name="Star" size={14} />
                <span className="text-sm">
                  {profile.zodiac === 'aries' && '♈ Овен'}
                  {profile.zodiac === 'taurus' && '♉ Телец'}
                  {profile.zodiac === 'gemini' && '♊ Близнецы'}
                  {profile.zodiac === 'cancer' && '♋ Рак'}
                  {profile.zodiac === 'leo' && '♌ Лев'}
                  {profile.zodiac === 'virgo' && '♍ Дева'}
                  {profile.zodiac === 'libra' && '♎ Весы'}
                  {profile.zodiac === 'scorpio' && '♏ Скорпион'}
                  {profile.zodiac === 'sagittarius' && '♐ Стрелец'}
                  {profile.zodiac === 'capricorn' && '♑ Козерог'}
                  {profile.zodiac === 'aquarius' && '♒ Водолей'}
                  {profile.zodiac === 'pisces' && '♓ Рыбы'}
                </span>
              </div>
            )}

            {/* Языки */}
            {profile.languages && profile.languages.length > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Icon name="Globe" size={14} />
                <span className="text-sm">Языки: {profile.languages.join(', ')}</span>
              </div>
            )}

            {/* Домашние животные */}
            {profile.pets && profile.pets !== 'none' && (
              <div className="flex items-center gap-2 text-gray-600">
                <Icon name="Heart" size={14} />
                <span className="text-sm">
                  {profile.pets === 'have_dogs' && '🐕 Есть собака'}
                  {profile.pets === 'have_cats' && '🐱 Есть кошка'}
                  {profile.pets === 'have_other' && '🐾 Есть питомцы'}
                  {profile.pets === 'love_all' && '❤️ Люблю животных'}
                </span>
              </div>
            )}
          </div>
        </div>

        <p className={cn(
          "text-gray-700 line-clamp-2 leading-relaxed mb-3",
          textSizes[variant].bio
        )}>
          {profile.bio}
        </p>

        <div className="flex flex-wrap gap-2">
          {profile.interests.slice(0, variant === 'tablet' ? 2 : 3).map((interest, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className={cn(
                "bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border-purple-200 px-2 py-1",
                variant === 'tablet' ? "text-xs" : "text-sm"
              )}
            >
              {interest}
            </Badge>
          ))}
          {profile.interests.length > (variant === 'tablet' ? 2 : 3) && (
            <Badge 
              variant="secondary" 
              className={cn(
                "bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border-purple-200 px-2 py-1",
                variant === 'tablet' ? "text-xs" : "text-sm"
              )}
            >
              +{profile.interests.length - (variant === 'tablet' ? 2 : 3)}
            </Badge>
          )}
        </div>
      </div>

      {/* Подсказка для свайпа только на мобильной версии */}
      {showSwipeHints && (
        <div className="text-center space-y-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/user/${profile.id}`)}
            className="w-full border-purple-200 hover:bg-purple-50 text-purple-600"
          >
            <Icon name="User" size={16} className="mr-2" />
            Посмотреть профиль
          </Button>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 bg-gray-50 rounded-full py-2 px-4">
            <div className="flex items-center gap-1">
              <Icon name="ArrowLeft" size={14} />
              <span>Пропуск</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="ArrowUp" size={14} />
              <span>Супер</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="ArrowRight" size={14} />
              <span>Лайк</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;