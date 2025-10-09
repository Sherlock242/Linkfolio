
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

  const login = useCallback(async (password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        try {
          sessionStorage.setItem(AUTH_KEY, 'true');
          setIsAuthenticated(true);
          router.push('/admin');
          return true;
        } catch (error) {
          console.error('Could not access session storage:', error);
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login request failed:', error);
      return false;
    }
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
