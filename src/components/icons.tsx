import { Github, Twitter, Linkedin, Instagram, Facebook, Globe, Link, type LucideProps } from 'lucide-react';
import type { SocialLink } from '@/lib/types';

export const socialIcons: { [key in SocialLink['platform']]: React.ComponentType<LucideProps> } = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  website: Globe,
};

type SocialIconProps = {
  platform: SocialLink['platform'];
} & LucideProps;

export const SocialIcon = ({ platform, ...props }: SocialIconProps) => {
  const IconComponent = socialIcons[platform] || Link;
  return <IconComponent {...props} />;
};
