import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User } from '@/contexts/AuthContext';

interface ProfileBioProps {
  user: User;
  isEditing: boolean;
  formData: {
    bio: string;
  };
  onFormChange: (data: Partial<typeof formData>) => void;
}

export default function ProfileBio({ user, isEditing, formData, onFormChange }: ProfileBioProps) {
  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="User" size={20} />
          О себе
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <p className="text-gray-700">
            {user.bio || 'Расскажите о себе...'}
          </p>
        ) : (
          <Textarea
            value={formData.bio}
            onChange={(e) => onFormChange({ bio: e.target.value })}
            placeholder="Расскажите о себе..."
            className="min-h-[100px]"
          />
        )}
      </CardContent>
    </Card>
  );
}