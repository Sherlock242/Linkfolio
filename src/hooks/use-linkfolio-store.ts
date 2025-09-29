"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ProfileData } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const STORAGE_KEY = 'linkfolio-data';

const profilePlaceholder = PlaceHolderImages.find(p => p.id === 'profile-picture');

const initialData: ProfileData = {
  profilePictureUrl: profilePlaceholder?.imageUrl || "https://picsum.photos/seed/linkfolio-profile/256/256",
  name: 'Alex Doe',
  bio: 'Digital creator, tech enthusiast, and coffee lover. Welcome to my personal corner of the internet.',
  socialLinks: [
    { id: '1', platform: 'twitter', url: 'https://twitter.com' },
    { id: '2', platform: 'linkedin', url: 'https://linkedin.com' },
    { id: '3', platform: 'github', url: 'https://github.com' },
  ],
  customLinks: [
    { id: '1', title: 'My Portfolio', url: '#', imageUrl: 'https://picsum.photos/seed/1/500/300' },
    { id: '2', title: 'Latest Blog Post', url: '#', imageUrl: 'https://picsum.photos/seed/2/500/300' },
  ],
};

export function useLinkFolioStore() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setData(JSON.parse(storedData));
      } else {
        setData(initialData);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setData(initialData);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (data && isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save data to localStorage", error);
      }
    }
  }, [data, isInitialized]);

  const updateData = useCallback((newData: Partial<ProfileData>) => {
    setData(prevData => {
      if (!prevData) return null;
      return { ...prevData, ...newData };
    });
  }, []);

  return { data, updateData, isInitialized };
}
