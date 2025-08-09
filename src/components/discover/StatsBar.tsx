import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface StatsBarProps {
  superLikes: number;
  matches: number;
  variant?: 'desktop' | 'tablet' | 'mobile';
  layout?: 'horizontal' | 'vertical' | 'sidebar';
}

const StatsBar = ({ 
  superLikes, 
  matches, 
  variant = 'mobile',
  layout = 'horizontal'
}: StatsBarProps) => {
  const StatCard = ({ 
    icon, 
    value, 
    label, 
    gradient 
  }: { 
    icon: string; 
    value: number; 
    label: string; 
    gradient: string; 
  }) => {
    const cardSizes = {
      desktop: 'p-4',
      tablet: 'p-4',
      mobile: 'w-10 h-10'
    };

    const textSizes = {
      desktop: { value: 'text-2xl', label: 'text-sm' },
      tablet: { value: 'text-2xl', label: 'text-sm' },
      mobile: { value: 'text-lg', label: 'text-sm' }
    };

    const iconSizes = {
      desktop: 20,
      tablet: 20,
      mobile: 18
    };

    if (variant === 'mobile' && layout === 'horizontal') {
      return (
        <div className="flex items-center gap-2">
          <div className={cn("rounded-full flex items-center justify-center shadow-lg", cardSizes.mobile, gradient)}>
            <Icon name={icon as any} size={iconSizes.mobile} className="text-white" />
          </div>
          <span className={cn("font-bold text-gray-800", textSizes.mobile.value)}>{value}</span>
        </div>
      );
    }

    return (
      <div className={cn(
        "bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg",
        cardSizes[variant],
        layout === 'vertical' && variant === 'desktop' && "mb-4"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", gradient)}>
            <Icon name={icon as any} size={iconSizes[variant]} className="text-white" />
          </div>
          <div>
            <p className={cn("font-bold text-gray-800", textSizes[variant].value)}>{value}</p>
            <p className={cn("text-gray-600", textSizes[variant].label)}>{label}</p>
          </div>
        </div>
      </div>
    );
  };

  const containerClass = cn(
    "flex",
    layout === 'horizontal' && "items-center justify-between",
    layout === 'vertical' && "flex-col gap-4",
    layout === 'sidebar' && "flex-col gap-4",
    variant === 'mobile' && layout === 'horizontal' && "mb-6",
    variant === 'tablet' && layout === 'horizontal' && "mb-6 px-4",
    variant === 'desktop' && layout === 'horizontal' && "justify-center items-center gap-8"
  );

  if (variant === 'mobile' && layout === 'horizontal') {
    return (
      <div className={containerClass}>
        <StatCard 
          icon="Zap"
          value={superLikes}
          label="Супер-лайков"
          gradient="bg-gradient-to-br from-yellow-400 to-orange-500"
        />
        <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Знакомства
        </h1>
        <StatCard 
          icon="Heart"
          value={matches}
          label="Совпадений"
          gradient="bg-gradient-to-br from-pink-400 to-red-500"
        />
      </div>
    );
  }

  if (variant === 'tablet' && layout === 'horizontal') {
    return (
      <div className={containerClass}>
        <StatCard 
          icon="Zap"
          value={superLikes}
          label="Супер-лайков"
          gradient="bg-gradient-to-br from-yellow-400 to-orange-500"
        />
        <StatCard 
          icon="Heart"
          value={matches}
          label="Совпадений"
          gradient="bg-gradient-to-br from-pink-400 to-red-500"
        />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <StatCard 
        icon="Zap"
        value={superLikes}
        label="Супер-лайков"
        gradient="bg-gradient-to-br from-yellow-400 to-orange-500"
      />
      <StatCard 
        icon="Heart"
        value={matches}
        label="Совпадений"
        gradient="bg-gradient-to-br from-pink-400 to-red-500"
      />
    </div>
  );
};

export default StatsBar;