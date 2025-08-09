import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const Auth = () => {
  const { login, register, isLoading } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    bio: '',
    interests: [] as string[]
  });
  const [error, setError] = useState('');

  const popularInterests = [
    'Путешествия', 'Музыка', 'Спорт', 'Кино', 'Книги', 'Готовка',
    'Танцы', 'Йога', 'Фотография', 'Искусство', 'Природа', 'Животные'
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!loginForm.email || !loginForm.password) {
      setError('Заполните все поля');
      return;
    }

    const success = await login(loginForm.email, loginForm.password);
    if (!success) {
      setError('Неверный email или пароль');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.age) {
      setError('Заполните все обязательные поля');
      return;
    }

    if (parseInt(registerForm.age) < 18) {
      setError('Вам должно быть не менее 18 лет');
      return;
    }

    const success = await register({
      ...registerForm,
      age: parseInt(registerForm.age)
    });
    
    if (!success) {
      setError('Пользователь с таким email уже существует');
    }
  };

  const toggleInterest = (interest: string) => {
    setRegisterForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-love-light via-love-DEFAULT to-love-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="Heart" size={32} className="text-white" />
            <h1 className="text-3xl font-bold text-white">Noumi Dating</h1>
          </div>
          <p className="text-white/80">Найди свою вторую половинку</p>
        </div>

        <Card className="backdrop-blur-lg bg-white/10 border-white/20">
          <CardContent className="p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="login" className="text-white data-[state=active]:bg-white data-[state=active]:text-love-DEFAULT">
                  Вход
                </TabsTrigger>
                <TabsTrigger value="register" className="text-white data-[state=active]:bg-white data-[state=active]:text-love-DEFAULT">
                  Регистрация
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="text-white">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password" className="text-white">Пароль</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="••••••••"
                    />
                  </div>
                  {error && (
                    <p className="text-red-200 text-sm flex items-center gap-2">
                      <Icon name="AlertCircle" size={16} />
                      {error}
                    </p>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full bg-white text-love-DEFAULT hover:bg-white/90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Вход...' : 'Войти'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Имя *</Label>
                    <Input
                      id="name"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-email" className="text-white">Email *</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-password" className="text-white">Пароль *</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age" className="text-white">Возраст *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      max="100"
                      value={registerForm.age}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, age: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio" className="text-white">О себе</Label>
                    <Textarea
                      id="bio"
                      value={registerForm.bio}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, bio: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[80px]"
                      placeholder="Расскажите о себе..."
                    />
                  </div>
                  <div>
                    <Label className="text-white">Интересы</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {popularInterests.map((interest) => (
                        <Badge
                          key={interest}
                          variant={registerForm.interests.includes(interest) ? "default" : "outline"}
                          className={`cursor-pointer transition-colors ${
                            registerForm.interests.includes(interest)
                              ? 'bg-white text-love-DEFAULT'
                              : 'border-white/40 text-white hover:bg-white/10'
                          }`}
                          onClick={() => toggleInterest(interest)}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {error && (
                    <p className="text-red-200 text-sm flex items-center gap-2">
                      <Icon name="AlertCircle" size={16} />
                      {error}
                    </p>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full bg-white text-love-DEFAULT hover:bg-white/90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Создание...' : 'Создать аккаунт'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;