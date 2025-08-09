import { User } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface FormData {
  name: string;
  bio: string;
  age: number;
  interests: string[];
}

interface ProfileInterestsProps {
  user: User;
  isEditing: boolean;
  formData: FormData;
  popularInterests: string[];
  onToggleInterest: (interest: string) => void;
  variant?: 'desktop' | 'mobile';
}

const ProfileInterests = ({ 
  user, 
  isEditing, 
  formData, 
  popularInterests,
  onToggleInterest,
  variant = 'mobile' 
}: ProfileInterestsProps) => {
  const isDesktop = variant === 'desktop';

  return (
    <Card className={`bg-white/95 backdrop-blur-sm border-0 ${isDesktop ? 'shadow-xl' : 'shadow-lg'}`}>
      <CardContent className={isDesktop ? "p-8" : "p-6"}>
        <h3 className={`font-bold mb-4 flex items-center gap-3 ${isDesktop ? 'text-2xl' : 'font-semibold'}`}>
          <Icon 
            name="Heart" 
            size={isDesktop ? 24 : 18} 
            className="text-pink-500" 
          />
          Интересы
        </h3>
        {!isEditing ? (
          <div className={`flex flex-wrap gap-3 ${isDesktop ? '' : 'gap-2'}`}>
            {user.interests.map((interest, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className={cn(
                  "bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 border-purple-200",
                  isDesktop ? "px-4 py-2 text-sm" : ""
                )}
              >
                {interest}
              </Badge>
            ))}
            {user.interests.length === 0 && (
              <p className={`text-gray-500 ${isDesktop ? 'text-lg' : ''}`}>
                Интересы не указаны
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              Выберите интересы, которые вас описывают:
            </p>
            <div className={`flex flex-wrap gap-3 ${isDesktop ? '' : 'gap-2'}`}>
              {popularInterests.map((interest) => (
                <Badge
                  key={interest}
                  variant={formData.interests.includes(interest) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    isDesktop ? "px-4 py-2 text-sm" : "",
                    formData.interests.includes(interest)
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
                      : 'hover:bg-gray-100'
                  )}
                  onClick={() => onToggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileInterests;