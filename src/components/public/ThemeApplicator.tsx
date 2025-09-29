
'use client';

import { ThemeSettings } from '@/lib/types';
import { useEffect } from 'react';

type ThemeApplicatorProps = {
  theme: ThemeSettings;
};

const fontFamilies = {
    inter: "'Inter', sans-serif",
    'space-grotesk': "'Space Grotesk', sans-serif",
    'geist-sans': "'__Geist_Sans_variable', '__Geist_Sans_Fallback_variable', sans-serif",
};

const fontUrls = {
    inter: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap",
    'space-grotesk': "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap",
    'geist-sans': "https://assets.vercel.com/raw/upload/v1689698285/public/fonts/geist-sans.zip" // This is a dummy URL for geist, which should be self-hosted
}


export default function ThemeApplicator({ theme }: ThemeApplicatorProps) {
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--background-h', `${theme.background.h}`);
    root.style.setProperty('--background-s', `${theme.background.s}%`);
    root.style.setProperty('--background-l', `${theme.background.l}%`);
    
    root.style.setProperty('--primary-h', `${theme.primary.h}`);
    root.style.setProperty('--primary-s', `${theme.primary.s}%`);
    root.style.setProperty('--primary-l', `${theme.primary.l}%`);
    
    root.style.setProperty('--accent-h', `${theme.accent.h}`);
    root.style.setProperty('--accent-s', `${theme.accent.s}%`);
    root.style.setProperty('--accent-l', `${theme.accent.l}%`);

    if(theme.font === 'geist-sans'){
        // Geist font requires special handling as it's often self-hosted.
        // For this example, we assume it's available. A real app would need to link it properly.
    } else {
        const linkId = 'dynamic-font-stylesheet';
        let link = document.getElementById(linkId) as HTMLLinkElement;
        if (!link) {
            link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
        link.href = fontUrls[theme.font];
    }
    
    document.body.style.fontFamily = fontFamilies[theme.font];

  }, [theme]);

  return null;
}
