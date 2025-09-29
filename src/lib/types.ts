export type SocialLink = {
  id: string;
  platform: 'twitter' | 'linkedin' | 'github' | 'instagram' | 'facebook' | 'website';
  url: string;
};

export type CustomLink = {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
};

export type ProfileData = {
  profilePictureUrl: string;
  name: string;
  bio: string;
  socialLinks: SocialLink[];
  customLinks: CustomLink[];
};
