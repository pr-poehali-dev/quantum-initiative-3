import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AUTH_API = 'https://functions.poehali.dev/f56c2e7f-63c4-483a-a94d-9ea7c0a4ee6c';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    const expiresAt = sessionStorage.getItem('admin_expires');
    
    if (token && expiresAt) {
      const expiry = new Date(expiresAt);
      if (new Date() < expiry) {
        setIsAuthenticated(true);
      } else {
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_expires');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(AUTH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        sessionStorage.setItem('admin_token', data.token);
        sessionStorage.setItem('admin_expires', data.expires_at);
        setIsAuthenticated(true);
        toast({
          title: 'Вход выполнен',
          description: 'Добро пожаловать в панель управления',
        });
        return true;
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Неверный пароль',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выполнить вход',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_expires');
    navigate('/');
  };

  return {
    isAuthenticated,
    password,
    setPassword,
    handleLogin,
    handleLogout,
  };
}
