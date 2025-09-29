"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_KEY = 'linkfolio-auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const authStatus = sessionStorage.getItem(AUTH_KEY);
      setIsAuthenticated(authStatus === 'true');
    } catch (error) {
      console.error('Could not access session storage:', error);
      setIsAuthenticated(false);
    }
  }, []);

  const login = useCallback((password: string) => {
    if (password === '2805prerna') {
      try {
        sessionStorage.setItem(AUTH_KEY, 'true');
        setIsAuthenticated(true);
        router.push('/admin');
        return true;
      } catch (error) {
        console.error('Could not access session storage:', error);
        return false;
      }
    }
    return false;
  }, [router]);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(AUTH_KEY);
      setIsAuthenticated(false);
      // No need to push here, the Link component will handle navigation
    } catch (error) {
      console.error('Could not access session storage:', error);
    }
  }, []);

  return { isAuthenticated, login, logout };
}
