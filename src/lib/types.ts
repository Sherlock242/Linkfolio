export type SocialLink = {
  id: string;
  platform: 'twitter' | 'linkedin' | 'github' | 'instagram' | 'facebook' | 'website' | 'youtube' | 'snapchat' | 'edengram';
  url: string;
};

export type CustomLink = {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
};

export type ThemeSettings = {
  background: { h: number; s: number; l: number };
  primary: { h: number; s: number; l: number };
  accent: { h: number; s: number; l: number };
  font: 'inter' | 'space-grotesk' | 'geist-sans';
};

export type ProfileData = {
  profilePictureUrl: string;
  name: string;
  bio: string;
  socialLinks: SocialLink[];
  customLinks: CustomLink[];
  theme: ThemeSettings;
};
