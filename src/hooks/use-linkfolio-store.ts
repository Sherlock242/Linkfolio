"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ProfileData } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const PROFILE_ID = '1'; // Assuming a single profile for this application

const profilePlaceholder = PlaceHolderImages.find(p => p.id === 'profile-picture');

const defaultTheme = {
  background: { h: 228, s: 67, l: 97 },
  primary: { h: 231, s: 48, l: 48 },
  accent: { h: 187, s: 100, l: 42 },
  font: 'inter' as const,
};

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
  theme: defaultTheme,
};


export function useLinkFolioStore() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', PROFILE_ID)
        .single();
        
      const processProfileData = (profileData: any): ProfileData => {
        return {
          ...initialData,
          ...profileData,
          theme: profileData.theme || defaultTheme,
        };
      };

      if (error && error.code === 'PGRST116') { // PostgREST error for zero rows returned
        console.warn('No profile found in DB, creating one with initial data.');
        // The table is empty, so let's insert the initial data.
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({ id: PROFILE_ID, ...initialData })
          .select()
          .single();
        
        if (insertError) {
          console.error("Failed to create initial profile in Supabase", insertError);
          setData(initialData); // Fallback to local initial data
        } else {
          setData(processProfileData(newProfile));
        }
      } else if (error) {
        console.error("Failed to load data from Supabase", error);
        setData(initialData); // Fallback to local initial data on other errors
      } else {
        setData(processProfileData(profile));
      }
      setIsInitialized(true);
    }

    fetchProfile();
  }, []);

  const updateData = useCallback(async (newData: Partial<ProfileData>) => {
    if (!data) return;
    
    const updatedData = { ...data, ...newData };
    setData(updatedData);

    const { error } = await supabase
      .from('profiles')
      .update(newData)
      .eq('id', PROFILE_ID);

    if (error) {
      console.error("Failed to save data to Supabase", error);
      // Here you might want to add error handling, like reverting the state
    }
  }, [data]);

  return { data, updateData, isInitialized };
}
