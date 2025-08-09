import { User } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface FormData {
  name: string;
  bio: string;
  age: number;
  interests: string[];
}

interface ProfileBioProps {
  user: User;
  isEditing: boolean;
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  variant?: 'desktop' | 'mobile';
}

const ProfileBio = ({ 
  user, 
  isEditing, 
  formData, 
  setFormData, 
  variant = 'mobile' 
}: ProfileBioProps) => {
  const isDesktop = variant === 'desktop';

  return (
    <Card className={`bg-white/95 backdrop-blur-sm border-0 ${isDesktop ? 'shadow-xl' : 'shadow-lg'}`}>
      <CardContent className={isDesktop ? "p-8" : "p-6"}>
        <h3 className={`font-bold mb-4 flex items-center gap-3 ${isDesktop ? 'text-2xl' : 'font-semibold'}`}>
          <Icon 
            name="FileText" 
            size={isDesktop ? 24 : 18} 
            className="text-pink-500" 
          />
          О себе
        </h3>
        {!isEditing ? (
          <div className={`text-gray-700 leading-relaxed ${isDesktop ? 'text-lg' : ''}`}>
            {user.bio || 'Пользователь пока не рассказал о себе...'}
          </div>
        ) : (
          <Textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Расскажите о себе..."
            className={`min-h-[120px] ${isDesktop ? 'text-base' : 'min-h-[100px]'}`}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileBio;