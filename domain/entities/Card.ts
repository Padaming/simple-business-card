export type ThemeType = 'minimal' | 'gradient' | 'corporate';

export interface Theme {
  name: ThemeType;
  displayName: string;
  description: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Card {
  slug: string;
  name: string;
  title: string;
  company?: string;
  bio?: string;
  avatar?: string;
  theme: ThemeType;
  accentColor?: string;
  contact?: ContactInfo;
  links?: SocialLink[];
}

export const AVAILABLE_THEMES: Theme[] = [
  {
    name: 'minimal',
    displayName: 'Minimal',
    description: '簡約淺色風格',
  },
  {
    name: 'gradient',
    displayName: 'Gradient',
    description: '漸層深色風格',
  },
  {
    name: 'corporate',
    displayName: 'Corporate',
    description: '企業專業風格',
  },
];
