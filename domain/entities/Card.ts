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
  id?: string;
  platform: string;
  url: string;
  iconUrl?: string; // For custom uploaded icons
  enable?: boolean; // For toggling standard links, though usually presence in array implies enabled. 
                   // However, for the editor UI state, it's easier if we just manage the array. 
                   // But user asked for "Toggle selection". 
                   // If I keep them all in the array, I can use a 'show' property? 
                   // Or just add/remove from array.
                   // Let's stick to: if it's in the array, it's shown. The UI will handle the "Toggle" by adding/removing or searching by platform name.
}

export interface ExperienceItem {
  id: string;
  period: string; // e.g., "2020 - 2023"
  title: string;
  description?: string;
}

export interface AwardItem {
  id: string;
  date: string; // e.g., "2023 Dec"
  title: string;
  description?: string;
}

export interface GradientConfig {
  from: string;
  to: string;
  direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl';
}

export interface CardElement {
  id: string;
  type: 'name' | 'title' | 'company' | 'email' | 'phone' | 'logo' | 'qrcode' | 'text';
  content?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  align?: 'left' | 'center' | 'right';
  isVisible: boolean;
  isTemplateDecoration?: boolean;
  // New visual properties
  rotation?: number; // degrees
  opacity?: number; // 0.0 to 1.0
  hasBackdropBlur?: boolean;
  zIndex?: number; // Though array order usually handles this, explicit index can help
}

export interface PhysicalCardSide {
  elements: CardElement[];
  backgroundColor?: string;
  backgroundImage?: string;
}

export interface PhysicalCardConfig {
  front: PhysicalCardSide;
  back: PhysicalCardSide;
}

export interface Card {
  slug: string;
  name: string;
  title: string;
  company?: string;
  bio?: string;
  avatar?: string;
  logo?: string;
  theme: ThemeType;
  layout?: 'centered' | 'two-column' | 'custom';
  accentColor?: string;
  gradientConfig?: GradientConfig;
  physicalCard?: PhysicalCardConfig;
  contact?: ContactInfo;
  links?: SocialLink[];
  experience?: ExperienceItem[];
  awards?: AwardItem[];
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
