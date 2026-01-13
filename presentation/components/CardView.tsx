'use client';

import { Card, ThemeType } from '@/domain/entities/Card';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardViewProps {
  card: Card;
}

export function CardView({ card }: CardViewProps) {
  const themeClasses = getThemeClasses(card.theme);

  const getPlatformIcon = (platform: string) => {
    const iconProps = { size: 20 };
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

  return (
    <div className={cn('max-w-2xl mx-auto p-6 rounded-2xl shadow-2xl', themeClasses.container)}>
      {/* Header Section */}
      <div className="text-center mb-6">
        {card.avatar && (
          <div className="mb-4 flex justify-center">
            <img
              src={card.avatar}
              alt={card.name}
              className="w-32 h-32 rounded-full object-cover border-4"
              style={{ borderColor: card.accentColor || 'currentColor' }}
            />
          </div>
        )}
        <h1 className={cn('text-4xl font-bold mb-2', themeClasses.name)}>
          {card.name}
        </h1>
        <p className={cn('text-xl mb-1', themeClasses.title)}>
          {card.title}
        </p>
        {card.company && (
          <p className={cn('text-lg', themeClasses.company)}>
            {card.company}
          </p>
        )}
      </div>

      {/* Bio Section */}
      {card.bio && (
        <div className="mb-6">
          <p className={cn('text-center', themeClasses.bio)}>
            {card.bio}
          </p>
        </div>
      )}

      {/* Contact Information */}
      {card.contact && (
        <div className="mb-6 space-y-2">
          {card.contact.email && (
            <div className={cn('flex items-center gap-2', themeClasses.contact)}>
              <Mail size={18} />
              <a href={`mailto:${card.contact.email}`} className="hover:underline">
                {card.contact.email}
              </a>
            </div>
          )}
          {card.contact.phone && (
            <div className={cn('flex items-center gap-2', themeClasses.contact)}>
              <Phone size={18} />
              <a href={`tel:${card.contact.phone}`} className="hover:underline">
                {card.contact.phone}
              </a>
            </div>
          )}
          {card.contact.location && (
            <div className={cn('flex items-center gap-2', themeClasses.contact)}>
              <MapPin size={18} />
              <span>{card.contact.location}</span>
            </div>
          )}
        </div>
      )}

      {/* Social Links */}
      {card.links && card.links.length > 0 && (
        <div className="flex justify-center gap-4 mt-6">
          {card.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'p-3 rounded-full transition-transform hover:scale-110',
                themeClasses.socialLink
              )}
              style={{ backgroundColor: card.accentColor }}
              aria-label={link.platform}
            >
              {getPlatformIcon(link.platform)}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function getThemeClasses(theme: ThemeType) {
  switch (theme) {
    case 'minimal':
      return {
        container: 'bg-white text-gray-900',
        name: 'text-gray-900',
        title: 'text-gray-600',
        company: 'text-gray-500',
        bio: 'text-gray-700',
        contact: 'text-gray-600',
        socialLink: 'text-white',
      };
    case 'gradient':
      return {
        container: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white',
        name: 'text-white',
        title: 'text-purple-200',
        company: 'text-purple-300',
        bio: 'text-gray-200',
        contact: 'text-gray-200',
        socialLink: 'text-white',
      };
    case 'corporate':
      return {
        container: 'bg-slate-50 text-slate-900 border border-slate-200',
        name: 'text-slate-900',
        title: 'text-slate-700',
        company: 'text-slate-600',
        bio: 'text-slate-700',
        contact: 'text-slate-600',
        socialLink: 'text-white',
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
