'use client';

import { useState } from 'react';
import { Card, ThemeType, AVAILABLE_THEMES } from '@/domain/entities/Card';
import { UpdateCardUseCase } from '@/domain/use-cases/UpdateCard';
import { saveCardAction } from '@/app/actions/saveCard';
import { useRouter } from 'next/navigation';
import { Input } from '@/presentation/components/ui/input';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Button } from '@/presentation/components/ui/button';
import { Label } from '@/presentation/components/ui/label';
import { CardView } from './CardView';

const updateCardUseCase = new UpdateCardUseCase();

export function CardEditor() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
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

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const result = await saveCardAction(card);
      if (result.success) {
        alert('名片儲存成功！');
        router.push(`/cards/${card.slug}`);
      } else {
        alert('儲存失敗，請稍後再試。');
      }
    } catch (error) {
      console.error(error);
      alert('發生錯誤。');
    } finally {
      setIsSaving(false);
    }
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

  const getFruitAvatar = (name: string) => {
    const fruits = ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🥭', '🍍', '🥝', '🥥'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % fruits.length;
    return fruits[index];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-2">
      {/* Editor Form */}
      <div className="space-y-8 bg-white/50 p-8 rounded-2xl border border-gray-100 backdrop-blur-sm">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-xl font-light tracking-wide text-gray-800">編輯名片資料</h2>
          <p className="text-sm text-gray-500 mt-1">自訂您的個人風格與資訊</p>
        </div>
        
        {/* Basic Info */}
        <div className="space-y-5">
          <div>
            <Label htmlFor="slug" className="text-gray-600">Slug (URL 識別碼)</Label>
            <Input
              id="slug"
              value={card.slug}
              onChange={(e) => updateField('slug', e.target.value)}
              placeholder="john-doe"
              className="mt-1.5 bg-white border-gray-200 focus-visible:ring-soft-green focus-visible:border-soft-green transition-all"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-600">姓名</Label>
              <Input
                id="name"
                value={card.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="John Doe"
                className="mt-1.5 bg-white border-gray-200 focus-visible:ring-soft-green focus-visible:border-soft-green transition-all"
              />
            </div>
            <div>
              <Label htmlFor="title" className="text-gray-600">職稱</Label>
              <Input
                id="title"
                value={card.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Senior Engineer"
                className="mt-1.5 bg-white border-gray-200 focus-visible:ring-soft-green focus-visible:border-soft-green transition-all"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="company" className="text-gray-600">公司/組織</Label>
            <Input
              id="company"
              value={card.company || ''}
              onChange={(e) => updateField('company', e.target.value)}
              placeholder="Tech Corp Inc."
              className="mt-1.5 bg-white border-gray-200 focus-visible:ring-soft-green focus-visible:border-soft-green transition-all"
            />
          </div>

          <div>
            <Label htmlFor="avatar" className="text-gray-600">頭像 URL</Label>
            <div className="flex gap-4 items-center">
              <Input
                id="avatar"
                value={card.avatar || ''}
                onChange={(e) => updateField('avatar', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="mt-1.5 bg-white border-gray-200 focus-visible:ring-soft-green focus-visible:border-soft-green transition-all"
              />
              <div className="shrink-0 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl border border-gray-200 mt-1.5">
                {card.avatar ? (
                  <img src={card.avatar} alt="Preview" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span>{getFruitAvatar(card.name)}</span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1.5 ml-1">若未填寫，將顯示預設水果頭貼</p>
          </div>
          
          <div>
            <Label htmlFor="bio" className="text-gray-600">個人簡介</Label>
            <Textarea
              id="bio"
              value={card.bio || ''}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="簡單介紹一下您自己..."
              className="mt-1.5 bg-white border-gray-200 focus-visible:ring-soft-green focus-visible:border-soft-green transition-all min-h-[100px]"
            />
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">外觀樣式</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="mb-2 block text-gray-600">主題風格</Label>
              <div className="space-y-2">
                {AVAILABLE_THEMES.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => updateField('theme', theme.name)}
                    className={`w-full p-3 rounded-lg border text-left transition-all flex flex-col ${
                      card.theme === theme.name
                        ? 'border-soft-green bg-soft-green/10 ring-1 ring-soft-green'
                        : 'border-gray-100 hover:border-gray-300 hover:bg-white'
                    }`}
                  >
                    <span className="font-medium text-gray-900">{theme.displayName}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{theme.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-gray-600">版面配置</Label>
              <div className="space-y-2">
                <button
                  onClick={() => updateField('layout', 'centered')}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    (card.layout || 'centered') === 'centered'
                      ? 'border-soft-green bg-soft-green/10 ring-1 ring-soft-green'
                      : 'border-gray-100 hover:border-gray-300 hover:bg-white'
                  }`}
                >
                  <div className="font-medium text-gray-900">置中排版</div>
                  <div className="text-xs text-gray-500 mt-0.5">經典的單欄置中設計</div>
                </button>
                <button
                  onClick={() => updateField('layout', 'two-column')}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    card.layout === 'two-column'
                      ? 'border-soft-green bg-soft-green/10 ring-1 ring-soft-green'
                      : 'border-gray-100 hover:border-gray-300 hover:bg-white'
                  }`}
                >
                  <div className="font-medium text-gray-900">雙欄排版</div>
                  <div className="text-xs text-gray-500 mt-0.5">左圖右文的現代設計</div>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
             <Label htmlFor="accentColor" className="text-gray-600 mb-2 block">自訂強調色</Label>
             <div className="flex gap-3 items-center">
                <div className="relative w-10 h-10 overflow-hidden rounded-full shadow-sm ring-1 ring-gray-200">
                  <Input
                    id="accentColor"
                    type="color"
                    value={card.accentColor || '#4f46e5'}
                    onChange={(e) => updateField('accentColor', e.target.value)}
                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 border-0 cursor-pointer"
                  />
                </div>
                <Input
                  value={card.accentColor || '#4f46e5'}
                  onChange={(e) => updateField('accentColor', e.target.value)}
                  placeholder="#4f46e5"
                  className="w-32 font-mono bg-white border-gray-200 focus-visible:ring-soft-green focus-visible:border-soft-green" 
                />
             </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">聯絡資訊</h3>
          
          <div>
            <Label htmlFor="email" className="text-gray-600">Email</Label>
            <Input
              id="email"
              type="email"
              value={card.contact?.email || ''}
              onChange={(e) => updateField('contact.email', e.target.value)}
              placeholder="your@email.com"
              className="mt-1.5 bg-white border-gray-200 focus-visible:ring-soft-green focus-visible:border-soft-green transition-all"
            />
          </div>
          
          <div>
            <Label htmlFor="phone" className="text-gray-600">電話</Label>
            <Input
              id="phone"
              value={card.contact?.phone || ''}
              onChange={(e) => updateField('contact.phone', e.target.value)}
              placeholder="+886-900-000-000"
              className="mt-1.5 bg-white border-gray-200 focus-visible:ring-soft-green focus-visible:border-soft-green transition-all"
            />
          </div>
          
          <div>
            <Label htmlFor="location" className="text-gray-600">地點</Label>
            <Input
              id="location"
              value={card.contact?.location || ''}
              onChange={(e) => updateField('contact.location', e.target.value)}
              placeholder="Taipei, Taiwan"
              className="mt-1.5 bg-white border-gray-200 focus-visible:ring-soft-green focus-visible:border-soft-green transition-all"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">社群連結</h3>
          
          {card.links?.map((link, index) => (
            <div key={index} className="space-y-2 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
              <div>
                <Label htmlFor={`platform${index}`} className="text-gray-600 text-xs">平台 {index + 1}</Label>
                <Input
                  id={`platform${index}`}
                  value={link.platform}
                  onChange={(e) =>
                    updateField(`link${index}`, { ...link, platform: e.target.value })
                  }
                  placeholder="github"
                  className="mt-1 h-8 bg-white border-gray-200 focus-visible:ring-soft-green focus-visible:border-soft-green transition-all"
                />
              </div>
              <div>
                <Label htmlFor={`url${index}`} className="text-gray-600 text-xs">URL {index + 1}</Label>
                <Input
                  id={`url${index}`}
                  value={link.url}
                  onChange={(e) =>
                    updateField(`link${index}`, { ...link, url: e.target.value })
                  }
                  placeholder="https://github.com/username"
                  className="mt-1 h-8 bg-white border-gray-200 focus-visible:ring-soft-green focus-visible:border-soft-green transition-all"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6">
          <Button onClick={handleExportJSON} variant="outline" className="flex-1 border-gray-200 hover:bg-gray-50 hover:text-gray-900">
            匯出 JSON
          </Button>
          <Button 
            onClick={handleSave} 
            className="flex-1 bg-soft-green hover:bg-[#8da379] text-white shadow-md hover:shadow-lg transition-all"
            disabled={isSaving}
          >
            {isSaving ? '儲存中...' : '儲存名片'}
          </Button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="lg:sticky lg:top-6 h-fit">
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-xl font-light tracking-wide text-gray-800">即時預覽</h2>
           <span className="text-xs text-gray-400 font-mono">LIVE PREVIEW</span>
        </div>
        <CardView card={card} />
      </div>
    </div>
  );
}

