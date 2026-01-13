'use client';

import { Card, ThemeType } from '@/domain/entities/Card';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardViewProps {
  card: Card;
  variant?: 'preview' | 'full';
}

export function CardView({ card, variant = 'preview' }: CardViewProps) {
  const themeClasses = getThemeClasses(card.theme);
  const isTwoColumn = card.layout === 'two-column';
  
  // Size classes based on variant
  // Use percentage of container width instead of screen width to prevent excessive size
  const avatarDimensions = variant === 'full' 
    ? 'w-32 h-32 md:w-1/3 md:h-auto md:aspect-square max-w-[300px]' 
    : 'w-24 h-24';
    
  const avatarFontSize = variant === 'full'
    ? 'text-6xl md:text-8xl'
    : 'text-5xl';
    
  const avatarContainerClasses = variant === 'full'
    ? 'mb-8 flex justify-center'
    : 'mb-5 flex justify-center';

  // Deterministic fruit avatar based on name
  const getFruitAvatar = (name: string) => {
    const fruits = ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🥭', '🍍', '🥝', '🥥'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % fruits.length;
    return fruits[index];
  };

  const getPlatformIcon = (platform: string) => {
    const iconProps = { size: 18 };
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github {...iconProps} />;
      case 'linkedin':
        return <Linkedin {...iconProps} />;
      case 'twitter':
        return <Twitter {...iconProps} />;
      default:
        return null;
    }
  };

  const SocialLinks = () => (
    card.links && card.links.length > 0 ? (
      <div className={cn("flex gap-3", isTwoColumn ? "justify-start" : "justify-center mt-6 pt-6 border-t border-current/10")}>
        {card.links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'p-2.5 rounded-full transition-all duration-300 hover:-translate-y-1',
              themeClasses.socialLink
            )}
            aria-label={link.platform}
          >
            {getPlatformIcon(link.platform)}
          </a>
        ))}
      </div>
    ) : null
  );

  const ContactDetails = () => (
    card.contact && (
      <div className="space-y-1.5 text-sm">
        {card.contact.email && (
          <div className={cn('flex items-center gap-2', themeClasses.contact)}>
            <Mail size={16} />
            <a href={`mailto:${card.contact.email}`} className="no-underline hover:text-inherit">
              {card.contact.email}
            </a>
          </div>
        )}
        {card.contact.phone && (
          <div className={cn('flex items-center gap-2', themeClasses.contact)}>
            <Phone size={16} />
            <a href={`tel:${card.contact.phone}`} className="no-underline hover:text-inherit">
              {card.contact.phone}
            </a>
          </div>
        )}
        {card.contact.location && (
          <div className={cn('flex items-center gap-2', themeClasses.contact)}>
            <MapPin size={16} />
            <span>{card.contact.location}</span>
          </div>
        )}
      </div>
    )
  );

  return (
    <div className={cn('max-w-2xl mx-auto p-8 rounded-2xl shadow-xl transition-all duration-300', themeClasses.container)}>
      {isTwoColumn ? (
        <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-8 items-start">
          {/* Left Column: Avatar */}
          <div className="flex flex-col items-center md:items-start gap-4">
            {card.avatar ? (
              <img
                src={card.avatar}
                alt={card.name}
                className="w-32 h-32 rounded-full object-cover border-4 shadow-sm"
                style={{ borderColor: card.accentColor || 'currentColor' }}
              />
            ) : (
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-inner bg-gray-50"
              >
                {getFruitAvatar(card.name)}
              </div>
            )}
            <SocialLinks />
          </div>

          {/* Right Column: Info */}
          <div className="text-left space-y-4">
            <div>
              <h1 className={cn('text-3xl font-bold mb-1', themeClasses.name)}>
                {card.name}
              </h1>
              <p className={cn('text-lg font-medium', themeClasses.title)}>
                {card.title}
              </p>
              {card.company && (
                <p className={cn('text-base opacity-90', themeClasses.company)}>
                  {card.company}
                </p>
              )}
            </div>

            {card.bio && (
              <p className={cn('text-sm leading-relaxed max-w-prose', themeClasses.bio)}>
                {card.bio}
              </p>
            )}

            <div className="pt-2">
              <ContactDetails />
            </div>
          </div>
        </div>
      ) : (
        /* Original Centered Layout (Optimized) */
        <div className="text-center">
          <div className={avatarContainerClasses}>
            {card.avatar ? (
              <img
                src={card.avatar}
                alt={card.name}
                className={cn('rounded-full object-cover border-4 shadow-sm', avatarDimensions)}
                style={{ borderColor: card.accentColor || 'currentColor' }}
              />
            ) : (
              <div className={cn('rounded-full flex items-center justify-center shadow-inner bg-gray-50', avatarDimensions, avatarFontSize)}>
                {getFruitAvatar(card.name)}
              </div>
            )}
          </div>
          <div className={variant === 'full' ? 'mb-8' : 'mb-5'}>
            <h1 className={cn('font-bold mb-1', themeClasses.name, variant === 'full' ? 'text-4xl md:text-6xl' : 'text-3xl')}>
              {card.name}
            </h1>
            <p className={cn('font-medium', themeClasses.title, variant === 'full' ? 'text-xl md:text-2xl' : 'text-lg')}>
              {card.title}
            </p>
            {card.company && (
              <p className={cn('text-base opacity-90', themeClasses.company)}>
                {card.company}
              </p>
            )}
          </div>

          {card.bio && (
            <div className="mb-6 max-w-lg mx-auto">
              <p className={cn('text-sm leading-relaxed', themeClasses.bio)}>
                {card.bio}
              </p>
            </div>
          )}

          <div className="flex justify-center mb-6">
            <ContactDetails />
          </div>

          <SocialLinks />
        </div>
      )}
    </div>
  );
}

function getThemeClasses(theme: ThemeType) {
  switch (theme) {
    case 'minimal':
      return {
        container: 'bg-white text-gray-900 border border-gray-100',
        name: 'text-gray-900 tracking-tight',
        title: 'text-gray-500 uppercase tracking-widest text-sm font-medium',
        company: 'text-gray-400 font-light',
        bio: 'text-gray-600 leading-relaxed font-light',
        contact: 'text-gray-500 hover:text-gray-900 transition-colors',
        socialLink: 'bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white',
      };
    case 'gradient':
      return {
        container: 'bg-gradient-to-br from-[#5DAC81] to-[#2E8B57] text-white shadow-xl shadow-[#5DAC81]/20',
        name: 'text-white tracking-tight',
        title: 'text-white/80 font-medium',
        company: 'text-white/70',
        bio: 'text-white/90 leading-relaxed',
        contact: 'text-white/80 hover:text-white transition-opacity',
        socialLink: 'bg-white/20 text-white hover:bg-white hover:text-[#5DAC81] backdrop-blur-sm',
      };
    case 'corporate':
      return {
        container: 'bg-slate-900 text-white border-t-4 border-accent shadow-2xl',
        name: 'text-white',
        title: 'text-accent font-medium',
        company: 'text-slate-400',
        bio: 'text-slate-300 leading-relaxed',
        contact: 'text-slate-400 hover:text-accent transition-colors',
        socialLink: 'bg-slate-800 text-slate-300 hover:bg-accent hover:text-white',
      };
    default:
      return {
        container: 'bg-white text-gray-900',
        name: 'text-gray-900',
        title: 'text-gray-600',
        company: 'text-gray-500',
        bio: 'text-gray-700',
        contact: 'text-gray-600',
        socialLink: 'text-white',
      };
  }
}
