import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileBio from '@/components/profile/ProfileBio';
import ProfileInterests from '@/components/profile/ProfileInterests';
import ProfileAdditionalInfo from '@/components/profile/ProfileAdditionalInfo';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfilePhotos from '@/components/profile/ProfilePhotos';
import ProfileTips from '@/components/profile/ProfileTips';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    age: user?.age || 18,
    interests: user?.interests || [],
    height: user?.height || 170,
    education: user?.education || '',
    job: user?.job || '',
    zodiac: user?.zodiac || '',
    smoking: user?.smoking || 'never',
    drinking: user?.drinking || 'socially'
  });

  const [stats, setStats] = useState({
    likes: 0,
    matches: 0,
    views: 0,
    messages: 0
  });

  useEffect(() => {
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    const profileViews = localStorage.getItem('profileViews') || '0';
    setStats({
      likes: Math.floor(Math.random() * 50) + 15,
      matches: matches.length,
      views: parseInt(profileViews) + Math.floor(Math.random() * 25) + 10,
      messages: Math.floor(Math.random() * 20) + 5
    });
  }, []);

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      age: user?.age || 18,
      interests: user?.interests || [],
      height: user?.height || 170,
      education: user?.education || '',
      job: user?.job || '',
      zodiac: user?.zodiac || '',
      smoking: user?.smoking || 'never',
      drinking: user?.drinking || 'socially'
    });
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleFormChange = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-light to-love-dark p-4 pb-24">
      <div className="max-w-md mx-auto pt-safe">
        <div className="flex items-center justify-between mb-6 pt-4">
          <h1 className="text-2xl font-bold text-white">Профиль</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              className="text-white hover:bg-white/10"
            >
              <Icon name="Settings" size={20} />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <Icon name="LogOut" size={20} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Выйти из аккаунта?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Вы действительно хотите выйти из своего аккаунта?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    Выйти
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <ProfileHeader 
                user={user}
                isEditing={isEditing}
                formData={formData}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                onFormChange={handleFormChange}
              />
            </CardContent>
          </Card>

          <ProfileBio 
            user={user}
            isEditing={isEditing}
            formData={formData}
            onFormChange={handleFormChange}
          />

          <ProfileInterests 
            user={user}
            isEditing={isEditing}
            formData={formData}
            onToggleInterest={toggleInterest}
          />

          <ProfileAdditionalInfo user={user} />

          <ProfileStats stats={stats} />

          <ProfilePhotos user={user} />

          <ProfileTips user={user} />
        </div>
      </div>
    </div>
  );
};

export default Profile;