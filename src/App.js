import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Mail, 
  Gift, 
  ChevronRight, 
  Trash2, 
  Star, 
  StarOff,
  Archive,
  CheckCircle2,
  Search
} from 'lucide-react';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [userEmails, setUserEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Анимированные снежинки
  const Snowflakes = () => {
    return (
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-fall text-white opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            ❄
          </div>
        ))}
      </div>
    );
  };

  // Генерация нового email-адреса
  const generateNewEmail = () => {
    const randomString = Math.random().toString(36).substring(2, 8);
    const newEmail = `${randomString}@mailly.christmas`;
    const newMailbox = {
      address: newEmail,
      createdAt: new Date().toISOString(),
      emails: [
        {
          id: Date.now(),
          subject: "🎄 Добро пожаловать в Mailly.Christmas! 🎅",
          preview: "Поздравляем с получением вашего праздничного ящика...",
          content: "Поздравляем с получением вашего праздничного почтового ящика! Теперь вы можете получать письма в духе Рождества круглый год. Желаем волшебных моментов! 🎁✨",
          date: new Date().toISOString(),
          isRead: false,
          isStarred: false,
          isArchived: false
        }
      ]
    };
    setUserEmails([...userEmails, newMailbox]);
  };

  const Header = () => (
    <div className="relative w-full bg-gradient-to-b from-red-700 to-red-600 text-white p-6 mb-8 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-4xl font-bold mb-2 animate-bounce">
          🎄 Mailly.Christmas 🎄
        </h1>
        <p className="text-xl">
          Получите свой праздничный почтовый ящик! 🎁
        </p>
      </div>
      <div className="absolute inset-0 bg-[url('/api/placeholder/400/320')] opacity-10"></div>
    </div>
  );

  const EmailActions = ({ email, mailboxIndex, emailIndex }) => {
    const toggleStarred = () => {
      const updatedEmails = [...userEmails];
      updatedEmails[mailboxIndex].emails[emailIndex].isStarred = 
        !updatedEmails[mailboxIndex].emails[emailIndex].isStarred;
      setUserEmails(updatedEmails);
    };

    const toggleArchived = () => {
      const updatedEmails = [...userEmails];
      updatedEmails[mailboxIndex].emails[emailIndex].isArchived = 
        !updatedEmails[mailboxIndex].emails[emailIndex].isArchived;
      setUserEmails(updatedEmails);
    };

    const markAsRead = () => {
      const updatedEmails = [...userEmails];
      updatedEmails[mailboxIndex].emails[emailIndex].isRead = true;
      setUserEmails(updatedEmails);
    };

    const deleteEmail = () => {
      const updatedEmails = [...userEmails];
      updatedEmails[mailboxIndex].emails.splice(emailIndex, 1);
      setUserEmails(updatedEmails);
    };

    return (
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleStarred}
          className={email.isStarred ? 'text-yellow-500' : ''}
        >
          {email.isStarred ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleArchived}
        >
          <Archive className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={markAsRead}
          className={email.isRead ? 'text-green-500' : ''}
        >
          <CheckCircle2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={deleteEmail}
          className="text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const MailboxList = () => (
    <div className="space-y-4">
      {userEmails.map((mailbox, mailboxIndex) => (
        <Card 
          key={mailbox.address}
          className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{mailbox.address}</p>
                <p className="text-sm text-gray-500">
                  Создан: {new Date(mailbox.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="transition-all duration-300 hover:bg-red-50">
                    <Mail className="w-4 h-4 mr-2" />
                    Просмотреть письма ({mailbox.emails.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      <div className="flex items-center justify-between">
                        <span>Письма для {mailbox.address}</span>
                        <Input
                          type="text"
                          placeholder="Поиск писем..."
                          className="max-w-xs"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          prefix={<Search className="w-4 h-4" />}
                        />
                      </div>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    {mailbox.emails
                      .filter(email => !email.isArchived &&
                        (email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.content.toLowerCase().includes(searchTerm.toLowerCase())))
                      .map((email, emailIndex) => (
                        <Dialog key={email.id}>
                          <DialogTrigger asChild>
                            <div className={`p-3 rounded-lg cursor-pointer transition-all duration-300
                              ${email.isRead ? 'bg-gray-50' : 'bg-red-50'} 
                              hover:bg-red-100`}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex-1">
                                  <p className="font-medium">{email.subject}</p>
                                  <p className="text-sm text-gray-500">{email.preview}</p>
                                </div>
                                <EmailActions 
                                  email={email} 
                                  mailboxIndex={mailboxIndex}
                                  emailIndex={emailIndex}
                                />
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{email.subject}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                              <p className="text-sm text-gray-500">
                                {new Date(email.date).toLocaleString()}
                              </p>
                              <div className="mt-4 prose">
                                {email.content}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Остальной код компонентов остается таким же, но добавляем классы для анимаций...
  
  const AuthForm = () => (
    <div className="min-h-screen">
      <Header />
      <Card className="w-full max-w-md mx-auto transform transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle>{isLogin ? 'Вход' : 'Регистрация'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isLogin ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                setIsAuthenticated(true);
              }} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                />
                <Input
                  type="password"
                  placeholder="Пароль"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                />
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300">
                  Войти
                </Button>
              </form>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                setIsAuthenticated(true);
              }} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Имя"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                />
                <Input
                  type="password"
                  placeholder="Пароль"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                />
                <Input
                  type="password"
                  placeholder="Подтвердите пароль"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                />
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300">
                  Зарегистрироваться
                </Button>
              </form>
            )}
            
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
              >
                {isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт?'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Snowflakes />
      {isAuthenticated ? (
        <>
          <Header />
          <div className="max-w-4xl mx-auto p-4">
            <Card className="mb-6 transform transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Личный кабинет</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p>С Рождеством, {registerData.name || loginData.email}! 🎄</p>
                  <Button 
                    onClick={() => setIsAuthenticated(false)}
                    variant="outline"
                    className="transition-all duration-300 hover:bg-red-50"
                  >
                    Выйти
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Мои почтовые ящики</h2>
              <Button 
                onClick={generateNewEmail}
                className="bg-red-600 hover:bg-red-700 transition-all duration-300"
              >
                <Gift className="w-4 h-4 mr-2" />
                Получить новый ящик
              </Button>
            </div>

            <MailboxList />
          </div>
        </>
      ) : (
        <AuthForm />
      )}
    </div>
  );
};

export default App;

// Добавляем глобальные стили для анимаций
const style = document.createElement('style');
style.textContent = `
@keyframes fall {
  0% {
    transform: translateY(-10vh) rotate(0deg);
  }
  100% {
    transform: translateY(110vh) rotate(360deg);
  }
}
.animate-fall {
  animation: fall linear infinite;
}
`;
document.head.appendChild(style);