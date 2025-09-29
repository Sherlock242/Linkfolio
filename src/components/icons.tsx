import { Github, Twitter, Linkedin, Instagram, Facebook, Globe, Link, Youtube, type LucideProps } from 'lucide-react';
import type { SocialLink } from '@/lib/types';
import React from 'react';

const SnapchatIcon = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c2.76 0 5.26-1.12 7.07-2.93.18-.18.35-.37.51-.57l-1.41-1.41c-.16.2-.33.39-.51.57A8 8 0 1 1 12 4a8 8 0 0 1 5.66 2.34l1.41-1.41A9.96 9.96 0 0 0 12 2z"/>
    <path d="M16.5 9.5c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5-3.5-1.57-3.5-3.5z"/>
  </svg>
);


export const socialIcons: { [key in SocialLink['platform']]: React.ComponentType<LucideProps> } = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  website: Globe,
  youtube: Youtube,
  snapchat: SnapchatIcon,
  edengram: Globe,
};

type SocialIconProps = {
  platform: SocialLink['platform'];
} & LucideProps;

export const SocialIcon = ({ platform, ...props }: SocialIconProps) => {
  const IconComponent = socialIcons[platform] || Link;
  return <IconComponent {...props} />;
};
