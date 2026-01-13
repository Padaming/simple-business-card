'use client';

import { useState } from 'react';
import { Card, ThemeType, AVAILABLE_THEMES } from '@/domain/entities/Card';
import { UpdateCardUseCase } from '@/domain/use-cases/UpdateCard';
import { Input } from '@/presentation/components/ui/input';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Button } from '@/presentation/components/ui/button';
import { Label } from '@/presentation/components/ui/label';
import { CardView } from './CardView';

const updateCardUseCase = new UpdateCardUseCase();

export function CardEditor() {
  const [card, setCard] = useState<Card>({
    slug: 'preview',
    name: 'Your Name',
    title: 'Your Title',
    company: 'Your Company',
    bio: 'A brief introduction about yourself...',
    avatar: '',
    theme: 'minimal',
    accentColor: '#4f46e5',
    contact: {
      email: 'your@email.com',
      phone: '+886-900-000-000',
      location: 'Taipei, Taiwan',
    },
    links: [
      { platform: 'github', url: 'https://github.com/username' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/username' },
    ],
  });

  const updateField = (field: string, value: any) => {
    const updates: Partial<Card> = {};
    
    if (field.startsWith('contact.')) {
      const contactField = field.split('.')[1];
      updates.contact = { ...card.contact, [contactField]: value };
    } else if (field === 'link0' || field === 'link1') {
      const index = parseInt(field.replace('link', ''));
      const newLinks = [...(card.links || [])];
      newLinks[index] = value;
      updates.links = newLinks;
    } else {
      (updates as any)[field] = value;
    }
    
    setCard(updateCardUseCase.execute(card, updates));
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(card, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${card.slug || 'card'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
      {/* Editor Form */}
      <div className="space-y-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">編輯名片</h2>
        
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="slug">Slug (URL 識別碼)</Label>
            <Input
              id="slug"
              value={card.slug}
              onChange={(e) => updateField('slug', e.target.value)}
              placeholder="john-doe"
            />
          </div>
          
          <div>
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              value={card.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <Label htmlFor="title">職稱</Label>
            <Input
              id="title"
              value={card.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Senior Engineer"
            />
          </div>
          
          <div>
            <Label htmlFor="company">公司/品牌</Label>
            <Input
              id="company"
              value={card.company || ''}
              onChange={(e) => updateField('company', e.target.value)}
              placeholder="Acme Corp"
            />
          </div>
          
          <div>
            <Label htmlFor="bio">簡介</Label>
            <Textarea
              id="bio"
              value={card.bio || ''}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="簡短自我介紹..."
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="avatar">頭像 URL</Label>
            <Input
              id="avatar"
              value={card.avatar || ''}
              onChange={(e) => updateField('avatar', e.target.value)}
              placeholder="/avatars/john.jpg"
            />
          </div>
        </div>

        {/* Theme Selection */}
        <div>
          <Label>主題風格</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {AVAILABLE_THEMES.map((theme) => (
              <button
                key={theme.name}
                onClick={() => updateField('theme', theme.name)}
                className={`p-3 rounded border-2 transition-all ${
                  card.theme === theme.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{theme.displayName}</div>
                <div className="text-xs text-gray-500">{theme.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <Label htmlFor="accentColor">主題色</Label>
          <div className="flex gap-2">
            <Input
              id="accentColor"
              type="color"
              value={card.accentColor || '#4f46e5'}
              onChange={(e) => updateField('accentColor', e.target.value)}
              className="w-20 h-10"
            />
            <Input
              value={card.accentColor || '#4f46e5'}
              onChange={(e) => updateField('accentColor', e.target.value)}
              placeholder="#4f46e5"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="font-semibold">聯絡資訊</h3>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={card.contact?.email || ''}
              onChange={(e) => updateField('contact.email', e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">電話</Label>
            <Input
              id="phone"
              value={card.contact?.phone || ''}
              onChange={(e) => updateField('contact.phone', e.target.value)}
              placeholder="+886-900-000-000"
            />
          </div>
          
          <div>
            <Label htmlFor="location">地點</Label>
            <Input
              id="location"
              value={card.contact?.location || ''}
              onChange={(e) => updateField('contact.location', e.target.value)}
              placeholder="Taipei, Taiwan"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="font-semibold">社群連結</h3>
          
          {card.links?.map((link, index) => (
            <div key={index} className="space-y-2">
              <div>
                <Label htmlFor={`platform${index}`}>平台 {index + 1}</Label>
                <Input
                  id={`platform${index}`}
                  value={link.platform}
                  onChange={(e) =>
                    updateField(`link${index}`, { ...link, platform: e.target.value })
                  }
                  placeholder="github"
                />
              </div>
              <div>
                <Label htmlFor={`url${index}`}>URL {index + 1}</Label>
                <Input
                  id={`url${index}`}
                  value={link.url}
                  onChange={(e) =>
                    updateField(`link${index}`, { ...link, url: e.target.value })
                  }
                  placeholder="https://github.com/username"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Export Button */}
        <Button onClick={handleExportJSON} className="w-full">
          匯出 JSON
        </Button>
      </div>

      {/* Live Preview */}
      <div className="lg:sticky lg:top-6 h-fit">
        <h2 className="text-2xl font-bold mb-4">即時預覽</h2>
        <CardView card={card} />
      </div>
    </div>
  );
}
