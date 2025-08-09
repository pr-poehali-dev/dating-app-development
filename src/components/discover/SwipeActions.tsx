import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface SwipeActionsProps {
  onSwipeLeft: () => void;
  onSwipeUp: () => void;
  onSwipeRight: () => void;
  superLikes: number;
  variant?: 'desktop' | 'tablet' | 'mobile';
  orientation?: 'horizontal' | 'vertical';
}

const SwipeActions = ({
  onSwipeLeft,
  onSwipeUp,
  onSwipeRight,
  superLikes,
  variant = 'mobile',
  orientation = 'horizontal'
}: SwipeActionsProps) => {
  const buttonSizes = {
    desktop: {
      pass: 'w-16 h-16',
      superLike: 'w-14 h-14',
      like: 'w-16 h-16',
      iconPass: 28,
      iconSuper: 24,
      iconLike: 28
    },
    tablet: {
      pass: 'w-14 h-14',
      superLike: 'w-12 h-12',
      like: 'w-14 h-14',
      iconPass: 24,
      iconSuper: 20,
      iconLike: 24
    },
    mobile: {
      pass: 'w-16 h-16',
      superLike: 'w-14 h-14',
      like: 'w-16 h-16',
      iconPass: 28,
      iconSuper: 24,
      iconLike: 28
    }
  };

  const sizes = buttonSizes[variant];
  const isVertical = orientation === 'vertical';

  const buttonBaseClass = cn(
    "rounded-full border-2 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95",
    variant === 'desktop' || variant === 'tablet' 
      ? "bg-white/80 backdrop-blur-sm" 
      : "bg-white/90 backdrop-blur-sm"
  );

  return (
    <div className={cn(
      "flex items-center gap-6",
      isVertical ? "flex-col gap-4" : "justify-center",
      variant === 'desktop' && isVertical && "gap-4"
    )}>
      {/* Кнопка "Пропуск" */}
      <Button
        size="lg"
        variant="outline"
        className={cn(
          buttonBaseClass,
          sizes.pass,
          "border-red-400 hover:bg-red-50 hover:border-red-500"
        )}
        onClick={onSwipeLeft}
      >
        <Icon name="X" size={sizes.iconPass} className="text-red-500" />
      </Button>
      
      {/* Кнопка "Супер-лайк" */}
      <Button
        size="lg"
        variant="outline"
        className={cn(
          buttonBaseClass,
          sizes.superLike,
          "border-blue-400 hover:bg-blue-50 hover:border-blue-500",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        onClick={onSwipeUp}
        disabled={superLikes === 0}
      >
        <Icon name="Star" size={sizes.iconSuper} className="text-blue-500" />
      </Button>
      
      {/* Кнопка "Лайк" */}
      <Button
        size="lg"
        variant="outline"
        className={cn(
          buttonBaseClass,
          sizes.like,
          "border-green-400 hover:bg-green-50 hover:border-green-500"
        )}
        onClick={onSwipeRight}
      >
        <Icon name="Heart" size={sizes.iconLike} className="text-green-500" />
      </Button>
    </div>
  );
};

export default SwipeActions;