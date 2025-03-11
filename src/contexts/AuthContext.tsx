import React, { useContext, useState } from 'react';
import { createUser, getUserByEmail } from '../lib/db';
import { User, AuthContext, AuthContextType } from './auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const hashPassword = async (password: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const hashedPassword = await hashPassword(password);
      const dbUser = await getUserByEmail(email);
      
      if (!dbUser || dbUser.password_hash !== hashedPassword) {
        throw new Error('Invalid email or password');
      }

      const userData = { id: dbUser.id, email: dbUser.email };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const hashedPassword = await hashPassword(password);
      const id = await createUser(email, hashedPassword);
      const userData = { id, email };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}