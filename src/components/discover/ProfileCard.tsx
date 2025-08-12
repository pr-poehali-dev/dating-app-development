import { motion } from 'framer-motion';
import { User } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  profile: User;
  dragOffset: { x: number; y: number };
  swipeDirection: 'left' | 'right' | 'up' | null;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: () => void;
  variant?: 'desktop' | 'tablet' | 'mobile';
}

const ProfileCard = ({
  profile,
  dragOffset,
  swipeDirection,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  variant = 'mobile'
}: ProfileCardProps) => {
  const getSwipeColor = () => {
    if (!swipeDirection) return 'transparent';
    if (swipeDirection === 'right') return '#10B981';
    if (swipeDirection === 'left') return '#EF4444';
    if (swipeDirection === 'up') return '#3B82F6';
    return 'transparent';
  };

  const cardSizes = {
    desktop: 'w-80 xl:w-96 h-[480px] xl:h-[600px]',
    tablet: 'w-full h-full max-h-[500px]',
    mobile: 'w-full h-full max-h-[520px]'
  };

  const avatarSizes = {
    desktop: { container: 'w-40 h-40', icon: 80 },
    tablet: { container: 'w-32 h-32', icon: 64 },
    mobile: { container: 'w-36 h-36', icon: 72 }
  };

  const textSizes = {
    desktop: { title: 'text-2xl', subtitle: 'text-lg', bio: 'text-base' },
    tablet: { title: 'text-xl', subtitle: 'text-base', bio: 'text-sm' },
    mobile: { title: 'text-2xl', subtitle: 'text-lg', bio: 'text-base' }
  };

  const showSwipeHints = variant === 'mobile';
  const isMobile = variant === 'mobile';

  return (
    <motion.div
      key={profile.id}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      initial={{ 
        scale: variant === 'desktop' ? 0.9 : 0.95, 
        opacity: 0, 
        ...(variant === 'desktop' ? { rotateY: -30 } : { y: 50 })
      }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        ...(variant === 'desktop' ? { rotateY: 0 } : { y: 0 }),
        ...(isMobile ? {
          x: dragOffset.x * 0.3,
          rotate: dragOffset.x * 0.05
        } : {})
      }}
      exit={{ 
        scale: variant === 'desktop' ? 0.9 : 0.95, 
        opacity: 0, 
        ...(variant === 'desktop' ? { rotateY: 30 } : { y: -50 })
      }}
      transition={{ 
        duration: variant === 'desktop' ? 0.5 : 0.3, 
        ease: "easeInOut",
        ...(isMobile ? { type: "spring", damping: 25, stiffness: 300 } : {})
      }}
      className={cn(
        "absolute inset-0",
        variant === 'desktop' ? "cursor-grab active:cursor-grabbing" : "touch-none",
        "w-full h-full"
      )}
      style={isMobile ? {
        border: swipeDirection ? `3px solid ${getSwipeColor()}` : 'none',
        borderRadius: '24px',
      } : undefined}
    >
      <Card className={cn(
        "w-full h-full overflow-hidden border-0 shadow-2xl",
        cardSizes[variant],
        variant === 'desktop' 
          ? "bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-300"
          : "bg-white/95 backdrop-blur-sm"
      )}>
        <div className={cn(
          "relative bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600",
          variant === 'desktop' ? "h-3/4" : variant === 'tablet' ? "h-3/4" : "h-2/3",
          variant === 'mobile' && "overflow-hidden"
        )}>
          {variant === 'desktop' && (
            <div className="absolute inset-0 bg-black/10" />
          )}
          
          {/* Декоративные элементы для мобильной версии */}
          {variant === 'mobile' && (
            <>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
            </>
          )}
          
          {/* Фото профиля */}
          <div className="absolute inset-0">
            {profile.photos && profile.photos.length > 0 ? (
              <img 
                src={profile.photos[0]} 
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className={cn(
                  "bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm",
                  avatarSizes[variant].container,
                  variant === 'mobile' && "shadow-xl"
                )}>
                  <Icon name="User" size={avatarSizes[variant].icon} className="text-white" />
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
          
          {/* Бейджи верификации и премиум */}
          {profile.verified && (
            <div className={cn(
              "absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm rounded-full p-2 shadow-lg",
              variant === 'tablet' && "p-2",
              variant === 'desktop' && "p-3"
            )}>
              <Icon 
                name="ShieldCheck" 
                size={variant === 'desktop' ? 20 : 18} 
                className="text-white" 
              />
            </div>
          )}
          
          {profile.subscription === 'premium' && (
            <div className={cn(
              "absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg",
              variant === 'mobile' ? "px-3 py-1" : "px-4 py-2"
            )}>
              <div className="flex items-center gap-1">
                <Icon 
                  name="Crown" 
                  size={variant === 'mobile' ? 14 : 16} 
                  className="text-white" 
                />
                <span className={cn(
                  "text-white font-bold",
                  variant === 'mobile' ? "text-xs" : "text-sm"
                )}>
                  Premium
                </span>
              </div>
            </div>
          )}
          
          {/* Индикаторы свайпа для мобильной версии */}
          {variant === 'mobile' && (
            <>
              {swipeDirection === 'right' && Math.abs(dragOffset.x) > 50 && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm"
                >
                  <div className="bg-green-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-xl">
                    ❤️ ЛАЙК
                  </div>
                </motion.div>
              )}
              
              {swipeDirection === 'left' && Math.abs(dragOffset.x) > 50 && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm"
                >
                  <div className="bg-red-500 text-white px-8 py-4 rounded-full font-bold text-xl shadow-xl">
                    ❌ ПРОПУСК
                  </div>
                </motion.div>
              )}
              
              {swipeDirection === 'up' && Math.abs(dragOffset.y) > 30 && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-xl shadow-xl">
                    ⭐ СУПЕР-ЛАЙК
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Информация о профиле */}
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
              {/* Основная информация */}
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
            <div className="text-center">
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
      </Card>
    </motion.div>
  );
};

export default ProfileCard;