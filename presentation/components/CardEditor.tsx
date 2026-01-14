'use client';

import { useState, useEffect } from 'react';
import { Card, ThemeType, AVAILABLE_THEMES, PhysicalCardConfig, CardElement } from '@/domain/entities/Card';
import { UpdateCardUseCase } from '@/domain/use-cases/UpdateCard';
import { Input } from '@/presentation/components/ui/input';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Button } from '@/presentation/components/ui/button';
import { Label } from '@/presentation/components/ui/label';
import { CardView } from './CardView';
import { PhysicalCardCanvas } from './PhysicalCardCanvas';
import { GradientPicker } from './GradientPicker';
import { PHYSICAL_CARD_TEMPLATES, PhysicalCardTemplate } from '@/domain/constants/PhysicalCardTemplates';
import * as htmlToImage from 'html-to-image';

const updateCardUseCase = new UpdateCardUseCase();

const DEFAULT_PHYSICAL_ELEMENTS_FRONT: CardElement[] = [
  { id: 'name', type: 'name', content: 'Your Name', x: 20, y: 30, fontSize: 20, isVisible: true, color: '#000000', fontFamily: 'sans-serif' }, // 18-24px
  { id: 'title', type: 'title', content: 'Your Title', x: 20, y: 60, fontSize: 13, isVisible: true, color: '#666666', fontFamily: 'sans-serif' }, // 12-14px
  { id: 'company', type: 'company', content: 'Your Company', x: 20, y: 90, fontSize: 12, isVisible: true, color: '#666666', fontFamily: 'sans-serif' }, 
  { id: 'email', type: 'email', content: 'your@email.com', x: 20, y: 150, fontSize: 10, isVisible: true, color: '#666666', fontFamily: 'sans-serif' }, // 9-10px
  { id: 'phone', type: 'phone', content: '+886-900-000-000', x: 20, y: 170, fontSize: 10, isVisible: true, color: '#666666', fontFamily: 'sans-serif' }, // 9-10px
  { id: 'logo', type: 'logo', x: 350, y: 20, width: 40, height: 40, isVisible: true }, // Adjusted safe size
];

const DEFAULT_PHYSICAL_ELEMENTS_BACK: CardElement[] = [
  { id: 'logo_back', type: 'logo', x: 185, y: 95, width: 80, height: 80, isVisible: true },
];

export function CardEditor() {
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'digital' | 'physical-front' | 'physical-back'>('digital');
  
  const [card, setCard] = useState<Card>({
    slug: 'preview',
    name: 'Your Name',
    title: 'Your Title',
    company: 'Your Company',
    bio: 'A brief introduction about yourself...',
    avatar: '',
    theme: 'minimal',
    accentColor: '#4f46e5',
    layout: 'centered',
    contact: {
      email: 'your@email.com',
      phone: '+886-900-000-000',
      location: 'Taipei, Taiwan',
    },
    links: [
      { platform: 'github', url: 'https://github.com/username' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/username' },
    ],
    physicalCard: {
        front: { elements: JSON.parse(JSON.stringify(DEFAULT_PHYSICAL_ELEMENTS_FRONT)) },
        back: { elements: JSON.parse(JSON.stringify(DEFAULT_PHYSICAL_ELEMENTS_BACK)) }
    }
  });

  // Ensure physical card config exists
  useEffect(() => {
    if (!card.physicalCard) {
        setCard(prev => ({
            ...prev,
            physicalCard: {
                front: { elements: JSON.parse(JSON.stringify(DEFAULT_PHYSICAL_ELEMENTS_FRONT)) },
                back: { elements: JSON.parse(JSON.stringify(DEFAULT_PHYSICAL_ELEMENTS_BACK)) }
            }
        }));
    }

    // Ensure gradient config exists if theme is gradient
    if (card.theme === 'gradient' && !card.gradientConfig) {
         setCard(prev => ({
             ...prev,
             gradientConfig: { from: '#4f46e5', to: '#06b6d4', direction: 'to-br' }
         }));
    }
  }, [card.physicalCard, card.theme]);

  const updateField = (field: string, value: any) => {
    const updates: Partial<Card> = {};
    
    if (field.startsWith('contact.')) {
      const contactField = field.split('.')[1];
      updates.contact = { ...card.contact, [contactField]: value };
      
      // Also update physical card elements if they exist
      if (card.physicalCard) {
          const newPhysical = { ...card.physicalCard };
          ['front', 'back'].forEach(side => {
              (newPhysical as any)[side].elements = (newPhysical as any)[side].elements.map((el: CardElement) => {
                  if (el.type === contactField || (contactField === 'email' && el.type === 'email') || (contactField === 'phone' && el.type === 'phone')) {
                      return { ...el, content: value };
                  }
                  return el;
              });
          });
          updates.physicalCard = newPhysical;
      }

    } else if (field === 'link0' || field === 'link1') {
      const index = parseInt(field.replace('link', ''));
      const newLinks = [...(card.links || [])];
      newLinks[index] = value;
      updates.links = newLinks;
    } else {
      (updates as any)[field] = value;
      
      // Sync basic fields to physical card
      if (['name', 'title', 'company'].includes(field) && card.physicalCard) {
        const newPhysical = { ...card.physicalCard };
        ['front', 'back'].forEach(side => {
            (newPhysical as any)[side].elements = (newPhysical as any)[side].elements.map((el: CardElement) => {
                if (el.type === field) {
                    return { ...el, content: value };
                }
                return el;
            });
        });
        updates.physicalCard = newPhysical;
      }
      if (field === 'logo' && card.physicalCard) {
         const newPhysical = { ...card.physicalCard };
         ['front', 'back'].forEach(side => {
            const sideKey = side as 'front' | 'back';
            const currentElements = newPhysical[sideKey].elements;
            
            // 1. Remove all existing USER logos (not template decorations) to prevent duplicates
            const otherElements = currentElements.filter(el => el.type !== 'logo' || el.isTemplateDecoration);
            
            if (value) {
                // 2. Determine target position/props
                // Try to find the first existing user logo to preserve its state
                const existingLogo = currentElements.find(el => el.type === 'logo' && !el.isTemplateDecoration);
                
                const newLogo: CardElement = existingLogo 
                    ? { ...existingLogo, content: value, isVisible: true }
                    : { 
                        id: `logo-${sideKey}-${Date.now()}`, 
                        type: 'logo', 
                        x: sideKey === 'front' ? 350 : 185, 
                        y: sideKey === 'front' ? 20 : 95, 
                        width: 40, 
                        height: 40, 
                        isVisible: true, 
                        content: value 
                      };
                
                newPhysical[sideKey].elements = [...otherElements, newLogo];
            } else {
                // If value is empty, just remove user logos
                newPhysical[sideKey].elements = otherElements;
            }
        });
        updates.physicalCard = newPhysical;
      }
    }
    
    setCard(updateCardUseCase.execute(card, updates));
  };

  const applyPhysicalTemplate = (template: PhysicalCardTemplate) => {
    if (!card.physicalCard) return;

    const newPhysical = { ...card.physicalCard };
    
    ['front', 'back'].forEach(sideStr => {
       const sideKey = sideStr as 'front' | 'back';
       const side = newPhysical[sideKey];
       
       // Apply background
       side.backgroundColor = template.style.backgroundColor;
       side.backgroundImage = template.style.backgroundImage || undefined;
       
       // Filter out existing template decorations (keep user content)
       const userElements = side.elements.filter(el => !el.isTemplateDecoration);

       // UPDATE: Hide user logo if it has no content (placeholder) to avoid conflict with template decorations
       // The user can always upload a logo to make it visible again.
       const cleanedUserElements = userElements.map(el => {
           if (el.type === 'logo' && !el.content) {
               return { ...el, isVisible: false };
           }
           return el;
       });

       // Apply text styles to user content
       const updatedUserElements = cleanedUserElements.map(el => {
           let overrides = {};
           if (template.style.layoutOverrides && template.style.layoutOverrides[el.type]) {
               overrides = template.style.layoutOverrides[el.type];
           }

           if (['name', 'title', 'company', 'email', 'phone', 'text'].includes(el.type)) {
               // Ensure no background color persists and transparent background is enforced
               const { backgroundColor, ...cleanOverrides } = overrides as any;
               
               return {
                   ...el,
                   color: template.style.textStyle.color,
                   fontFamily: template.style.textStyle.fontFamily,
                   ...cleanOverrides,
                   hasBackdropBlur: false, // Reset blur to ensure transparency
                   backgroundColor: undefined
               };
           }
           // Apply overrides to non-text elements too (like logo position)
           // Important: If logo becomes visible due to override, but has no content, keep it hidden?
           // No, overrides might set x/y. We should ensure isVisible respects our content check unless override explicitly forces it.
           // However, layoutOverrides only define pos/style usually.
           if (Object.keys(overrides).length > 0) {
               const merged = { ...el, ...overrides };
               // Re-enforce hidden if no content
               if (merged.type === 'logo' && !merged.content) {
                   merged.isVisible = false;
               }
               return merged;
           }
           return el;
       });

       // Add new decorations (prepended so they are behind content by default, but PhysicalCanvas sort order matters. 
       // React renders in array order. So first items are at bottom.
       // We want decorations at bottom.)
       const newDecorations = template.style.decorations ? template.style.decorations.map(d => ({...d, id: `${d.id}-${sideKey}-${Date.now()}`})) : [];
       
       side.elements = [...newDecorations, ...updatedUserElements];
    });

    updateField('physicalCard', newPhysical);
  };

  const moveItem = (field: 'experience' | 'awards', index: number, direction: -1 | 1) => {
    const list = field === 'experience' ? [...(card.experience || [])] : [...(card.awards || [])];
    if (index + direction < 0 || index + direction >= list.length) return;
    [list[index], list[index + direction]] = [list[index + direction], list[index]];
    updateField(field, list);
  };

  const handleRedesign = () => {
    if (!card.physicalCard || previewMode === 'digital') return;
    const side = previewMode === 'physical-front' ? 'front' : 'back';
    const currentConfig = card.physicalCard[side];
    
    // 1. Layout Iteration
    const layouts = ['left', 'center', 'asym'] as const;
    const selectedLayout = layouts[Math.floor(Math.random() * layouts.length)];
    const CARD_W = 450;
    const CARD_H = 270;
    
    const elements = [...currentConfig.elements.map(e => ({...e}))]; // Deep copy refs
    
    const contentEls = elements.filter(e => !e.isTemplateDecoration);
    const decoEls = elements.filter(e => e.isTemplateDecoration);

    // Define Critical Text Zone based on layout (Safe Areas)
    // Left: Text Left, Decos Right
    // Center: Text Center, Decos Edges/Corners
    // Asym: Text Corners, Decos Center/Diag
    let textZone = { x: 0, y: 0, w: 450, h: 270 }; // Area to avoid for high opacity items

    // Apply Layout to Content
    let currentY_Top = 40;
    let currentY_Bottom = 230;

    contentEls.forEach(el => {
        // Logo handling
        if (el.type === 'logo') {
             // Randomize logo within safe zones
             if (selectedLayout === 'center') { el.x = 195; el.y = 30; currentY_Top = 100; }
             else if (selectedLayout === 'left') { el.x = 350; el.y = 30; }
             else { el.x = 350; el.y = 150; } // Asym
             return;
        }

        if (['name', 'title', 'company', 'email', 'phone', 'text', 'qrcode'].includes(el.type)) {
             el.hasBackdropBlur = false; // reset
             
             if (selectedLayout === 'center') {
                 textZone = { x: 60, y: 30, w: 330, h: 210 };
                 
                 el.align = 'center';
                 el.x = 25; 
                 el.width = 400; 
                 
                 // Specific stacking
                 if (el.type === 'name') el.y = currentY_Top;
                 if (el.type === 'title') el.y = currentY_Top + 40;
                 if (el.type === 'company') el.y = currentY_Top - 70 > 0 ? currentY_Top - 70 : 20; // Company often at top
                 if (['email','phone'].includes(el.type)) {
                     el.y = currentY_Bottom;
                     currentY_Bottom -= 15;
                 }
             } else if (selectedLayout === 'left') {
                 textZone = { x: 20, y: 20, w: 300, h: 230 };

                 el.align = 'left';
                 el.x = 30;
                 el.width = 300;
                 
                 if (el.type === 'name') el.y = 50;
                 if (el.type === 'title') el.y = 85;
                 if (el.type === 'company') el.y = 25;
                 if (['email','phone'].includes(el.type)) {
                     el.y = currentY_Bottom;
                     currentY_Bottom -= 15;
                 }
             } else { // asym
                 textZone = { x: 20, y: 20, w: 400, h: 230 }; // Asym covers a lot basically

                 if (['name','title', 'company'].includes(el.type)) {
                     el.align = 'left';
                     el.x = 30;
                     if (el.type === 'name') el.y = 50;
                     if (el.type === 'title') el.y = 85;
                     if (el.type === 'company') el.y = 25;
                 } else {
                     el.align = 'right';
                     el.x = 120;
                     el.width = 300;
                     el.y = currentY_Bottom;
                     currentY_Bottom -= 15;
                 }
             }
        }
    });

    // 2. Deco Randomization with Clash Avoidance
    decoEls.forEach(el => {
        // Randomize props
        el.rotation = Math.floor(Math.random() * 360);
        el.opacity = 0.1 + Math.random() * 0.7; // 0.1 to 0.8 range
        
        // Evolve scale slightly
        if (Math.random() > 0.5) {
             const scale = 0.8 + Math.random() * 0.4; // 0.8 - 1.2
             if (el.width) el.width *= scale;
             if (el.height) el.height *= scale;
        }

        let attempts = 0;
        let validPos = false;
        
        while (!validPos && attempts < 8) {
            // Try random position
            el.x = (Math.random() * CARD_W) - (el.width || 50)/2;
            el.y = (Math.random() * CARD_H) - (el.height || 50)/2;
            
            // Allow bounds bleed (decorations often look good cut off)
            
            // Check Collision with TextZone
            const w = el.width || 50;
            const h = el.height || 50;
            
            const overlaps = (
                el.x < textZone.x + textZone.w &&
                el.x + w > textZone.x &&
                el.y < textZone.y + textZone.h &&
                el.y + h > textZone.y
            );
            
            // If overlaps and Opacity is High, simple conflict.
            // If opacity is low (<0.3), it's background, allow overlap.
            if (overlaps && el.opacity > 0.25) {
                 validPos = false;
                 // On last attempts, try pushing to edges explicitly
                 if (attempts > 5) {
                     if (selectedLayout === 'left') el.x = 350 + Math.random() * 50; // Push Right
                     else if (selectedLayout === 'center') {
                         el.x = Math.random() > 0.5 ? -20 : 400; // Push Extremes
                     }
                 }
                 // Ultimate fallback: lower opacity
                 if (attempts === 7) {
                     el.opacity = 0.15;
                     validPos = true;
                 }
            } else {
                validPos = true;
            }
            attempts++;
        }
    });
    
    // Shuffle decorations Z-order
    decoEls.sort(() => 0.5 - Math.random());
    
    // 3. Readability Check - Force Blur if still crowded
    // Calculate if any high opacity decoration is in center
    const hasCentralDeco = decoEls.some(d => d.opacity && d.opacity > 0.4 && d.x > 100 && d.x < 350);
    
    if (selectedLayout === 'center' || hasCentralDeco) {
        contentEls.forEach(el => {
            if (['name', 'title', 'company'].includes(el.type)) {
                el.hasBackdropBlur = true;
            }
        });
    }

    const newElements = [...decoEls, ...contentEls];
    
    updateField('physicalCard', {
        ...card.physicalCard,
        [side]: { ...currentConfig, elements: newElements }
    });
  };

  const handleExportHTML = () => {
    // Helper to determine background style
    // Use card.gradientConfig if available for gradient theme, otherwise fallback
    let containerBg = '';
    if (card.theme === 'gradient') {
         const from = card.gradientConfig?.from || '#4f46e5';
         const to = card.gradientConfig?.to || '#06b6d4';
         const dir = card.gradientConfig?.direction || 'to-br';
         // Convert tailwind direction to css degree/keyword
         const dirMap: Record<string, string> = { 'to-r': '90deg', 'to-l': '-90deg', 'to-t': '0deg', 'to-b': '180deg', 'to-br': '135deg', 'to-bl': '-135deg', 'to-tr': '45deg', 'to-tl': '-45deg' };
         containerBg = `background: linear-gradient(${dirMap[dir] || '135deg'}, ${from}, ${to});`;
    } else if (card.theme === 'corporate') {
        containerBg = 'background: #0f172a;'; // slate-900
    } else {
        containerBg = 'background: #ffffff;'; // minimal
    }

    // Text Colors & Theme specifics
    let textMain = '#1f2937';
    let textSub = '#6b7280';
    let textMuted = '#9ca3af';
    let cardBg = 'rgba(255, 255, 255, 0.9)';
    let cardBorder = 'none';
    let socialBtnBg = '#f3f4f6';
    let socialBtnColor = '#4b5563';

    if (card.theme === 'gradient') {
        textMain = '#ffffff';
        textSub = 'rgba(255,255,255,0.8)';
        textMuted = 'rgba(255,255,255,0.7)';
        cardBg = 'transparent'; // CardView transparent in gradient mode? No, wait. 
        // In CardView gradient mode: container HAS gradient. 
        // But Digital Export has 'card-container' (viewport) and 'glass-panel' (card itself).
        // CardView IS the card.
        // So 'card-container' should be neutral (or same gradient?), and 'glass-panel' should match CardView.
        // Actually CardView acts as the panel.
        // Let's make body neutral, and card-container match CardView style.
    } else if (card.theme === 'corporate') {
        textMain = '#ffffff';
        textSub = '#94a3b8'; // slate-400
        textMuted = '#94a3b8'; 
        cardBg = '#0f172a';
        cardBorder = `4px solid ${card.accentColor || '#3b82f6'}`; // Top border in CardView, but here maybe all around or top?
        // CardView: border-t-4
        socialBtnBg = '#1e293b'; // slate-800
        socialBtnColor = '#cbd5e1';
    }

    // Prepare Icons (Simple SVG strings)
    const Icons = {
        email: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
        phone: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
        location: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
        link: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
        github: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
        linkedin: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
        twitter: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>`
    };

    const getPlatformIcon = (p: string) => {
        const key = p.toLowerCase();
        if (key.includes('github')) return Icons.github;
        if (key.includes('linkedin')) return Icons.linkedin;
        if (key.includes('twitter') || key.includes('x')) return Icons.twitter;
        return Icons.link;
    };

    const htmlContent = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${card.name} - Digital Business Card</title>
    <style>
        body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; background-color: #f3f4f6; display: flex; justify-content: center; min-height: 100vh; }
        .viewport { width: 100%; max-width: 480px; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; }
        
        .card-panel {
            width: 100%;
            ${containerBg}
            ${card.theme === 'corporate' ? 'border-top: 4px solid ' + (card.accentColor || '#3b82f6') + ';' : ''}
            border-radius: 24px;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
            padding: 40px 30px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: ${textMain};
            position: relative;
            overflow: hidden;
        }

        .avatar { 
            width: 96px; height: 96px; border-radius: 50%; object-fit: cover; margin-bottom: 20px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.1); background-color: #fff; 
            border: 4px solid ${card.accentColor || 'currentColor'};
            display: flex; align-items: center; justify-content: center; font-size: 40px; 
        }
        
        .name { font-size: 28px; font-weight: 700; margin: 0 0 8px 0; color: ${textMain}; }
        .title { font-size: 18px; margin: 0 0 8px 0; font-weight: 500; color: ${textSub}; }
        .company { font-size: 16px; margin-bottom: 24px; display: block; opacity: 0.9; color: ${textMuted}; }
        .bio { font-size: 14px; line-height: 1.6; margin-bottom: 24px; max-width: 100%; word-wrap: break-word; color: ${textSub}; }
        
        /* Contact Details as Text List */
        /* UPDATE: Align items to flex-start to keep icon-text alignment consistent like preview, 
           while the container itself is centered by parent (.card-panel) */
        .contact-list { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; margin-bottom: 24px; font-size: 14px; width: 100%; }
        .contact-item { display: flex; align-items: flex-start; gap: 8px; color: ${textSub}; text-decoration: none; transition: opacity 0.2s; text-align: left; width: 100%; }
        .contact-icon { flex-shrink: 0; margin-top: 2px; }
        .contact-text { word-break: break-word; }
        
        .contact-item:hover { opacity: 0.8; }
        
        /* Social Links as Icons */
        .social-links { display: flex; gap: 12px; justify-content: center; margin-bottom: 24px; }
        .social-btn {
            display: flex; align-items: center; justify-content: center;
            width: 40px; height: 40px; border-radius: 50%;
            background: ${socialBtnBg}; color: ${socialBtnColor};
            transition: transform 0.2s;
        }
        .social-btn:hover { transform: translateY(-2px); }

        /* Experience & Awards */
        .section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin: 24px 0 12px 0; opacity: 0.7; color: ${textMain}; width: 100%; text-align: left; border-top: 1px solid rgba(128,128,128,0.2); padding-top: 16px; }
        .list-container { width: 100%; text-align: left; display: flex; flex-direction: column; gap: 16px; }
        
        .exp-item { border-left: 2px solid rgba(128,128,128,0.3); padding-left: 12px; }
        .exp-period { font-size: 12px; opacity: 0.7; margin-bottom: 2px; font-family: monospace; }
        .exp-title { font-weight: 600; font-size: 14px; }
        .exp-desc { font-size: 13px; opacity: 0.8; margin-top: 2px; }

        .award-item { display: flex; gap: 12px; align-items: baseline; }
        .award-date { font-size: 12px; opacity: 0.7; width: 60px; flex-shrink: 0; font-family: monospace; }
        
        .footer { padding: 20px; font-size: 12px; color: #888; text-align: center; width: 100%; }
        ${card.theme === 'gradient' ? '.footer { color: rgba(255,255,255,0.6); }' : ''}
    </style>
</head>
<body>
    <div class="viewport">
         <div class="card-panel">
            <div class="avatar">
                ${card.avatar 
                    ? `<img src="${card.avatar}" alt="Avatar" style="width:100%; height:100%; border-radius:50%; object-fit:cover;"/>` 
                    : getFruitAvatar(card.name)}
            </div>
            
            <h1 class="name">${card.name}</h1>
            <div class="title">${card.title}</div>
            <span class="company">${card.company || ''}</span>
            <p class="bio">${card.bio || ''}</p>
            
            <div class="contact-list">
                ${card.contact?.email ? `<a href="mailto:${card.contact.email}" class="contact-item"><span class="contact-icon">${Icons.email}</span> <span class="contact-text">${card.contact.email}</span></a>` : ''}
                ${card.contact?.phone ? `<a href="tel:${card.contact.phone}" class="contact-item"><span class="contact-icon">${Icons.phone}</span> <span class="contact-text">${card.contact.phone}</span></a>` : ''}
                ${card.contact?.location ? `<div class="contact-item"><span class="contact-icon">${Icons.location}</span> <span class="contact-text">${card.contact.location}</span></div>` : ''}
            </div>

            <div class="social-links">
                ${card.links?.filter(l => l.url).map(l => `<a href="${l.url}" target="_blank" rel="noopener" class="social-btn" title="${l.platform}">${getPlatformIcon(l.platform)}</a>`).join('')}
            </div>

            ${(card.experience && card.experience.length > 0) ? `
                <div class="section-title">經歷 Experience</div>
                <div class="list-container">
                    ${card.experience.map(exp => `
                        <div class="exp-item">
                            <div class="exp-period">${exp.period}</div>
                            <div class="exp-title">${exp.title}</div>
                            ${exp.description ? `<div class="exp-desc">${exp.description}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            ${(card.awards && card.awards.length > 0) ? `
                <div class="section-title">獲獎 Awards</div>
                <div class="list-container">
                    ${card.awards.map(awd => `
                        <div class="award-item">
                            <div class="award-date">${awd.date}</div>
                            <div>
                                <div class="exp-title">${awd.title}</div>
                                ${awd.description ? `<div class="exp-desc">${awd.description}</div>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
         </div>
         <div style="position:fixed; bottom:10px; font-size:10px; color:#aaa;">Simple Business Card Export</div>
    </div>
</body>
</html>`;
    
    // Download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${card.slug || 'card'}-digital.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'logo') => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
              const dataUrl = event.target?.result as string;
              updateField(field, dataUrl);
          };
          reader.readAsDataURL(file);
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

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          // Basic validation
          if (json.name || json.slug) {
             setCard(prev => ({ ...prev, ...json }));
             alert('名片資訊匯入成功！');
          } else {
             alert('無效的名片格式');
          }
        } catch (err) {
           console.error(err);
           alert('讀取檔案失敗');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportPNG = async () => {
    const element = document.getElementById('export-card-canvas');
    if (element) {
        try {
            const dataUrl = await htmlToImage.toPng(element, { pixelRatio: 3 });
            const link = document.createElement('a');
            const side = previewMode === 'physical-back' ? 'back' : 'front';
            link.download = `${card.slug}-physical-${side}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Export failed', err);
            alert('匯出圖片失敗');
        }
    }
  };

  const handleSave = async () => {
      // ... existing save logic ...
       try {
      setIsSaving(true);
      if ('showSaveFilePicker' in window) {
        try {
          const handle = await (window as any).showSaveFilePicker({
            suggestedName: `${card.slug}.json`,
            types: [{
              description: 'JSON Files',
              accept: { 'application/json': ['.json'] },
            }],
          });
          const writable = await handle.createWritable();
          await writable.write(JSON.stringify(card, null, 2));
          await writable.close();
          alert('檔案儲存成功！');
        } catch (err) {
            if ((err as any).name !== 'AbortError') handleExportJSON();
        }
      } else {
        handleExportJSON();
      }
    } catch (error) {
      console.error(error);
      alert('發生錯誤。');
    } finally {
      setIsSaving(false);
    }
  };

  const getFruitAvatar = (name: string) => {
    // ... existing ...
    const fruits = ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🥭', '🍍', '🥝', '🥥'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % fruits.length;
    return fruits[index];
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden gap-6 p-4">
      {/* Editor Column (Scrollable) */}
      <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="flex-1 lg:w-5/12 xl:w-5/12 overflow-y-auto pr-2 space-y-8 bg-white/50 p-6 rounded-2xl border border-gray-100 backdrop-blur-sm h-full no-scrollbar">
        
        {/* Section 1: Common Info */}
        <div>
           <div className="border-b border-gray-100 pb-2 mb-4 flex justify-between items-end">
             <div>
                <h3 className="text-lg font-medium text-gray-800">通用資訊</h3>
                <p className="text-xs text-gray-500">基本資料與聯絡方式</p>
             </div>
             <div className="flex gap-2">
                 <Button variant="outline" size="sm" onClick={() => document.getElementById('import-json')?.click()} className="h-7 text-xs">
                    匯入
                 </Button>
                 <input id="import-json" type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
                 <Button variant="outline" size="sm" onClick={handleSave} className="h-7 text-xs">
                    匯出
                 </Button>
             </div>
           </div>
           
           <div className="space-y-4">
               <div>
                  <Label htmlFor="slug" className="text-gray-600">Slug</Label>
                  <Input id="slug" value={card.slug} onChange={(e) => updateField('slug', e.target.value)} className="mt-1" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <Label htmlFor="name" className="text-gray-600">姓名</Label>
                    <Input id="name" value={card.name} onChange={(e) => updateField('name', e.target.value)} className="mt-1" />
                 </div>
                 <div>
                     <Label htmlFor="title" className="text-gray-600">職稱</Label>
                     <Input id="title" value={card.title} onChange={(e) => updateField('title', e.target.value)} className="mt-1" />
                 </div>
               </div>
               <div>
                    <Label htmlFor="company" className="text-gray-600">公司名稱</Label>
                    <Input id="company" value={card.company || ''} onChange={(e) => updateField('company', e.target.value)} className="mt-1" />
               </div>
               <div>
                   <Label htmlFor="email" className="text-gray-600">Email</Label>
                   <Input id="email" value={card.contact?.email || ''} onChange={(e) => updateField('contact.email', e.target.value)} className="mt-1" />
               </div>
               <div>
                   <Label htmlFor="phone" className="text-gray-600">電話</Label>
                   <Input id="phone" value={card.contact?.phone || ''} onChange={(e) => updateField('contact.phone', e.target.value)} className="mt-1" />
               </div>
               <div>
                   <Label htmlFor="location" className="text-gray-600">地址 (Location)</Label>
                   <Input id="location" value={card.contact?.location || ''} onChange={(e) => updateField('contact.location', e.target.value)} className="mt-1" />
               </div>

               {/* Social Media & Custom Links */}
               <div className="pt-2 border-t border-gray-100 mt-2">
                    <Label className="text-gray-600 mb-2 block">社群連結 & 自訂連結</Label>
                    
                    {/* Standard Platforms */}
                    <div className="space-y-2 mb-4">
                        {['github', 'linkedin', 'facebook', 'instagram', 'youtube', 'twitter'].map(platform => {
                            const link = card.links?.find(l => l.platform === platform);
                            const isEnabled = !!link;
                            
                            return (
                                <div key={platform} className="flex gap-2 items-center">
                                    <div className="flex items-center h-9 w-28 shrink-0">
                                        <input 
                                            type="checkbox" 
                                            id={`check-${platform}`}
                                            checked={isEnabled}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                let newLinks = [...(card.links || [])];
                                                if (checked) {
                                                    // Add if not exists
                                                    if (!newLinks.find(l => l.platform === platform)) {
                                                        const defaultUrl = platform === 'twitter' ? 'https://x.com/' : `https://${platform}.com/`;
                                                        newLinks.push({ platform, url: defaultUrl });
                                                    }
                                                } else {
                                                    // Remove
                                                    newLinks = newLinks.filter(l => l.platform !== platform);
                                                }
                                                updateField('links', newLinks);
                                            }}
                                            className="mr-2"
                                        />
                                        <Label htmlFor={`check-${platform}`} className="text-gray-600 capitalize cursor-pointer select-none">
                                            {platform === 'twitter' ? 'Twitter (X)' : platform}
                                        </Label>
                                    </div>
                                    <Input 
                                        value={link?.url || ''} 
                                        onChange={(e) => {
                                            const newLinks = [...(card.links || [])];
                                            const idx = newLinks.findIndex(l => l.platform === platform);
                                            if (idx >= 0) {
                                                newLinks[idx] = { ...newLinks[idx], url: e.target.value };
                                                updateField('links', newLinks);
                                            }
                                        }}
                                        disabled={!isEnabled}
                                        placeholder={`https://${platform}.com/...`} 
                                        className="h-9 flex-1 text-xs" 
                                    />
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Custom Links */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center mb-1">
                            <Label className="text-xs text-gray-500">自訂連結 (Custom Links)</Label>
                            <Button variant="ghost" size="sm" onClick={() => {
                                const newLink = { platform: `custom-${Date.now()}`, url: 'https://', iconUrl: '' }; // Use unique platform ID for custom
                                const newLinks = [...(card.links || []), newLink];
                                updateField('links', newLinks);
                            }} className="h-6 text-xs text-blue-600">+ 新增自訂</Button>
                        </div>
                        
                        {(card.links || []).filter(l => l.platform.startsWith('custom-')).map((link, idx) => (
                             <div key={link.platform} className="flex gap-2 items-center bg-gray-50 p-2 rounded border border-gray-100 relative group">
                                <button 
                                     className="absolute top-1 right-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                     onClick={() => {
                                         const newLinks = card.links?.filter(l => l.platform !== link.platform);
                                         updateField('links', newLinks);
                                     }}
                                >✕</button>

                                <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded border overflow-hidden relative group/icon">
                                    {link.iconUrl 
                                        ? <img src={link.iconUrl} className="w-full h-full object-contain" /> 
                                        : <span className="text-[10px] text-gray-400">Icon</span>
                                    }
                                    <label className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover/icon:opacity-100 cursor-pointer text-[8px]">
                                        上傳
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                             const file = e.target.files?.[0];
                                             if (file) {
                                                 const reader = new FileReader();
                                                 reader.onload = (ev) => {
                                                     const newLinks = [...(card.links || [])];
                                                     const targetIdx = newLinks.findIndex(l => l.platform === link.platform);
                                                     if (targetIdx >= 0) {
                                                         newLinks[targetIdx] = { ...newLinks[targetIdx], iconUrl: ev.target?.result as string };
                                                         updateField('links', newLinks);
                                                     }
                                                 };
                                                 reader.readAsDataURL(file);
                                             }
                                        }} />
                                    </label>
                                </div>
                                <Input 
                                    value={link.url}
                                    onChange={(e) => {
                                        const newLinks = [...(card.links || [])];
                                        const targetIdx = newLinks.findIndex(l => l.platform === link.platform);
                                        if (targetIdx >= 0) {
                                            newLinks[targetIdx] = { ...newLinks[targetIdx], url: e.target.value };
                                            updateField('links', newLinks);
                                        }
                                    }}
                                    placeholder="https://"
                                    className="h-8 flex-1 text-xs"
                                />
                             </div>
                        ))}
                    </div>
               </div>

               <div>
                    <Label htmlFor="avatar" className="text-gray-600">電子名片頭像 (Avatar) URL</Label>
                    <div className="flex gap-2 items-center">
                        <Input id="avatar" value={card.avatar || ''} onChange={(e) => updateField('avatar', e.target.value)} className="mt-1 flex-1" placeholder="https://..." />
                        
                        {/* Avatar Display & Upload */}
                        <div className="shrink-0 relative group flex gap-2 items-center">
                             <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border flex items-center justify-center">
                                {card.avatar ? <img src={card.avatar} className="w-full h-full object-cover" /> : getFruitAvatar(card.name)}
                             </div>
                             
                             <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 px-3 py-1.5 rounded text-xs transition-colors whitespace-nowrap">
                                上傳圖片
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'avatar')} />
                             </label>
                        </div>
                    </div>
               </div>
               <div>
                    <Label htmlFor="logo" className="text-gray-600">公司 Logo URL (實體名片用)</Label>
                    <div className="flex gap-2 items-center">
                        <Input id="logo" value={card.logo || ''} onChange={(e) => updateField('logo', e.target.value)} className="mt-1 flex-1" placeholder="https://..." />
                        
                        {/* Logo Display & Upload */}
                        <div className="shrink-0 relative group flex gap-2 items-center">
                             <div className="w-10 h-10 rounded overflow-hidden bg-white border flex items-center justify-center p-1">
                                {card.logo ? <img src={card.logo} className="w-full h-full object-contain" /> : <span className="text-xs text-gray-400">Logo</span>}
                             </div>
                             
                             <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 px-3 py-1.5 rounded text-xs transition-colors whitespace-nowrap">
                                上傳圖片
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} />
                             </label>
                        </div>
                    </div>
               </div>
               
               <div className="pt-2 grid grid-cols-2 gap-2">
                   <Button onClick={handleExportJSON} variant="outline" className="w-full text-xs">匯出名片資訊 (JSON)</Button>
                   <div className="relative">
                       <Button variant="outline" className="w-full text-xs">匯入名片資訊 (JSON)</Button>
                       <input 
                           type="file" 
                           accept="application/json" 
                           className="absolute inset-0 opacity-0 cursor-pointer" 
                           onChange={handleImportJSON}
                       />
                   </div>
               </div>
           </div>
        </div>

        {/* Section 2: Digital Card Info */}
        <div className="pt-6 border-t border-gray-100">
           <div className="border-b border-gray-100 pb-2 mb-4 flex justify-between items-center">
             <div>
                <h3 className="text-lg font-medium text-gray-800">電子名片設定</h3>
                <p className="text-xs text-gray-500">更多個人化資訊與樣式</p>
             </div>
             <Button variant="ghost" size="sm" onClick={() => setPreviewMode('digital')} className={previewMode === 'digital' ? 'bg-blue-50 text-blue-600' : ''}>
                 預覽
             </Button>
           </div>

           <div className="space-y-4">
              <div>
                 <Label htmlFor="bio" className="text-gray-600">個人簡介</Label>
                 <Textarea id="bio" value={card.bio || ''} onChange={(e) => updateField('bio', e.target.value)} className="mt-1" />
              </div>
               
               {/* Experience Section */}
               <div>
                   <div className="flex justify-between items-center mb-2">
                       <Label className="text-gray-600">經歷 (Experience)</Label>
                       <Button variant="ghost" size="sm" onClick={() => {
                           const newExp = { id: `exp-${Date.now()}`, period: '2023 - Present', title: 'Job Title', description: 'Company Name' };
                           const newExperience = [...(card.experience || []), newExp];
                           updateField('experience', newExperience);
                       }} className="h-6 text-xs text-blue-600">+ 新增經歷</Button>
                   </div>
                   <div className="space-y-3">
                       {(card.experience || []).map((exp, idx) => (
                           <div key={exp.id} className="p-3 bg-gray-50 rounded border border-gray-100 space-y-2 relative group">
                               <div className="absolute top-2 right-2 flex gap-1 bg-white/80 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 p-0.5 border border-gray-100 shadow-sm">
                                  <button onClick={() => moveItem('experience', idx, -1)} disabled={idx === 0} className="w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-500 disabled:opacity-30">▲</button>
                                  <button onClick={() => moveItem('experience', idx, 1)} disabled={idx === (card.experience?.length || 0) - 1} className="w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-500 disabled:opacity-30">▼</button>
                                  <div className="w-px h-full bg-gray-200 mx-0.5"></div>
                                  <button 
                                    className="w-5 h-5 flex items-center justify-center text-xs text-red-400 hover:text-red-500 hover:bg-red-50"
                                    onClick={() => {
                                        const newExp = card.experience?.filter(e => e.id !== exp.id);
                                        updateField('experience', newExp);
                                    }}
                                  >✕</button>
                               </div>
                               <div className="grid grid-cols-3 gap-2">
                                   <div className="col-span-1">
                                       <Label className="text-xs text-gray-400">期間</Label>
                                       <Input 
                                         value={exp.period} 
                                         onChange={(e) => {
                                             const newExp = [...(card.experience || [])];
                                             newExp[idx] = { ...exp, period: e.target.value };
                                             updateField('experience', newExp);
                                         }} 
                                         className="h-7 text-xs" 
                                       />
                                   </div>
                                   <div className="col-span-2">
                                       <Label className="text-xs text-gray-400">職稱/項目</Label>
                                       <Input 
                                         value={exp.title} 
                                         onChange={(e) => {
                                              const newExp = [...(card.experience || [])];
                                              newExp[idx] = { ...exp, title: e.target.value };
                                              updateField('experience', newExp);
                                         }} 
                                         className="h-7 text-xs" 
                                       />
                                   </div>
                               </div>
                               <div>
                                   <Label className="text-xs text-gray-400">簡短說明</Label>
                                   <Textarea 
                                     value={exp.description || ''} 
                                     rows={2}
                                     onChange={(e) => {
                                          const newExp = [...(card.experience || [])];
                                          newExp[idx] = { ...exp, description: e.target.value };
                                          updateField('experience', newExp);
                                     }} 
                                     className="min-h-[40px] text-xs resize-none" 
                                   />
                               </div>
                           </div>
                       ))}
                   </div>
               </div>

               {/* Awards Section */}
               <div>
                   <div className="flex justify-between items-center mb-2">
                       <Label className="text-gray-600">獲獎 (Awards)</Label>
                       <Button variant="ghost" size="sm" onClick={() => {
                           const newAward = { id: `awd-${Date.now()}`, date: '2023', title: 'Award Name', description: 'Description' };
                           const newAwards = [...(card.awards || []), newAward];
                           updateField('awards', newAwards);
                       }} className="h-6 text-xs text-blue-600">+ 新增獎項</Button>
                   </div>
                   <div className="space-y-3">
                       {(card.awards || []).map((award, idx) => (
                           <div key={award.id} className="p-3 bg-gray-50 rounded border border-gray-100 space-y-2 relative group">
                               <div className="absolute top-2 right-2 flex gap-1 bg-white/80 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 p-0.5 border border-gray-100 shadow-sm">
                                  <button onClick={() => moveItem('awards', idx, -1)} disabled={idx === 0} className="w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-500 disabled:opacity-30">▲</button>
                                  <button onClick={() => moveItem('awards', idx, 1)} disabled={idx === (card.awards?.length || 0) - 1} className="w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-500 disabled:opacity-30">▼</button>
                                  <div className="w-px h-full bg-gray-200 mx-0.5"></div>
                                  <button 
                                    className="w-5 h-5 flex items-center justify-center text-xs text-red-400 hover:text-red-500 hover:bg-red-50"
                                    onClick={() => {
                                        const newAwards = card.awards?.filter(a => a.id !== award.id);
                                        updateField('awards', newAwards);
                                    }}
                                  >✕</button>
                               </div>
                               <div className="grid grid-cols-3 gap-2">
                                   <div className="col-span-1">
                                       <Label className="text-xs text-gray-400">日期</Label>
                                       <Input 
                                         value={award.date} 
                                         onChange={(e) => {
                                             const newAwards = [...(card.awards || [])];
                                             newAwards[idx] = { ...award, date: e.target.value };
                                             updateField('awards', newAwards);
                                         }} 
                                         className="h-7 text-xs" 
                                       />
                                   </div>
                                   <div className="col-span-2">
                                       <Label className="text-xs text-gray-400">獎項名稱</Label>
                                       <Input 
                                         value={award.title} 
                                         onChange={(e) => {
                                              const newAwards = [...(card.awards || [])];
                                              newAwards[idx] = { ...award, title: e.target.value };
                                              updateField('awards', newAwards);
                                         }} 
                                         className="h-7 text-xs" 
                                       />
                                   </div>
                               </div>
                               <div>
                                   <Label className="text-xs text-gray-400">簡短說明</Label>
                                   <Textarea 
                                     value={award.description || ''} 
                                     rows={2}
                                     onChange={(e) => {
                                          const newAwards = [...(card.awards || [])];
                                          newAwards[idx] = { ...award, description: e.target.value };
                                          updateField('awards', newAwards);
                                     }} 
                                     className="min-h-[40px] text-xs resize-none" 
                                   />
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
               
               <Button onClick={handleExportHTML} variant="outline" className="w-full mt-2">匯出電子名片 (.html)</Button>
           </div>
        </div>

        {/* Section 3: Physical Card Info */}
        <div className="pt-6 border-t border-gray-100">
             <div className="border-b border-gray-100 pb-2 mb-4 flex justify-between items-center">
                 <div>
                    <h3 className="text-lg font-medium text-gray-800">實體名片設定</h3>
                    <p className="text-xs text-gray-500">90x54mm 版面配置 (拖拉調整)</p>
                 </div>
                 <div className="flex gap-1">
                     <Button variant="ghost" size="sm" onClick={() => setPreviewMode('physical-front')} className={previewMode === 'physical-front' ? 'bg-blue-50 text-blue-600' : ''}>正面</Button>
                     <Button variant="ghost" size="sm" onClick={() => setPreviewMode('physical-back')} className={previewMode === 'physical-back' ? 'bg-blue-50 text-blue-600' : ''}>背面</Button>
                 </div>
             </div>
             
             <div className="space-y-4">
                 <p className="text-sm text-gray-500">
                     請切換至右側的「實體名片預覽」進行拖拉排版與編輯。
                 </p>
                 <Button onClick={handleExportPNG} variant="outline" className="w-full">匯出目前面 (.png)</Button>
             </div>
        </div>

      </div>

      {/* Live Preview Column (Fixed Height) */}
      <div className="flex-1 lg:w-7/12 xl:w-7/12 h-full flex flex-col min-h-0">
        <div className="flex flex-col h-full gap-4">
            <div className="flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-100 shadow-sm z-10">
                <h2 className="text-xl font-light tracking-wide text-gray-800">
                    {previewMode === 'digital' ? '電子名片預覽' : '實體名片預覽'}
                </h2>
                <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-medium">
                    <button 
                        onClick={() => setPreviewMode('digital')}
                        className={`px-3 py-1.5 rounded-md transition-all ${previewMode === 'digital' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                    >
                        Digital
                    </button>
                    <button 
                        onClick={() => setPreviewMode('physical-front')}
                        className={`px-3 py-1.5 rounded-md transition-all ${previewMode === 'physical-front' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                    >
                        Front
                    </button>
                    <button 
                        onClick={() => setPreviewMode('physical-back')}
                        className={`px-3 py-1.5 rounded-md transition-all ${previewMode === 'physical-back' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                    >
                        Back
                    </button>
                </div>
            </div>

            {/* Visual Settings - Moved Here (Digital Only) */}
            {previewMode === 'digital' && (
                <div className="bg-white p-4 rounded-xl border shadow-sm shrink-0 space-y-3">
                   {/* Theme & Accent & Layout */}
                   <div className="flex flex-col gap-2">
                       <div className="flex justify-between items-center">
                          <Label className="text-xs text-gray-600 font-medium">外觀主題 & 強調色</Label>
                       </div>
                       <div className="flex flex-wrap gap-4 items-center">
                          <div className="flex gap-1">
                              {[{n:'minimal',d:'淺色'},{n:'gradient',d:'漸層'},{n:'corporate',d:'深色'}].map(t => (
                                  <button 
                                    key={t.n}
                                    onClick={() => {
                                        updateField('theme', t.n);
                                        if (t.n === 'gradient' && !card.gradientConfig) {
                                            updateField('gradientConfig', { from: '#4f46e5', to: '#06b6d4', direction: 'to-br' });
                                        }
                                    }}
                                    className={`px-3 py-1.5 border rounded text-xs transition-colors ${card.theme === t.n ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                                  >
                                    {t.d}
                                  </button>
                              ))}
                          </div>
                          
                          <div className="w-px h-6 bg-gray-200 mx-2"></div>

                          <div className="flex items-center gap-2">
                              <input 
                                type="color" 
                                value={card.accentColor || '#4f46e5'} 
                                onChange={(e) => updateField('accentColor', e.target.value)}
                                className="w-6 h-6 p-0 border rounded-full cursor-pointer shadow-sm overflow-hidden"
                                title="Accent Color"
                              />
                          </div>
                          
                          <div className="w-px h-6 bg-gray-200 mx-2"></div>
                          
                          <div className="flex gap-1">
                               {['centered', 'two-column'].map(l => (
                                   <button
                                     key={l}
                                     onClick={() => updateField('layout', l)}
                                     className={`px-3 py-1.5 border rounded text-[10px] uppercase transition-colors ${card.layout === l ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                                   >
                                     {l === 'centered' ? '置中排版' : '兩欄排版'}
                                   </button>
                               ))}
                          </div>
                       </div>
                   </div>
                   
                   {/* Gradient Picker */}
                   {card.theme === 'gradient' && (
                       <div className="pt-2 border-t border-dashed">
                           <GradientPicker 
                             value={card.gradientConfig} 
                             onChange={(config) => updateField('gradientConfig', config)} 
                           />
                       </div>
                   )}
                </div>
            )}

            {/* Preview Container */}
            <div className={`border rounded-2xl overflow-hidden shadow-sm bg-gray-50 flex flex-col items-center justify-center p-4 relative ${previewMode === 'digital' ? 'flex-1' : 'h-auto py-8'}`}>
                {previewMode === 'digital' ? (
                    <div className="w-full h-full overflow-y-auto flex justify-center">
                         <div className="w-full max-w-[480px] my-auto">
                            <CardView card={card} />
                         </div>
                    </div>
                ) : (
                    <div id="physical-card-preview" className="bg-white shadow-xl p-0 relative group shrink-0">
                         {/* Redesign Overlay Button */}
                         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                             <Button size="sm" variant="secondary" onClick={handleRedesign} className="shadow-lg backdrop-blur-md bg-white/80 border text-xs h-7">
                                🎲 隨機重新設計
                             </Button>
                         </div>

                         {card.physicalCard && (
                             <PhysicalCardCanvas 
                                side={previewMode === 'physical-front' ? 'front' : 'back'}
                                config={previewMode === 'physical-front' ? card.physicalCard.front : card.physicalCard.back}
                                onChange={(newConfig) => {
                                    if (card.physicalCard) {
                                        const side = previewMode === 'physical-front' ? 'front' : 'back';
                                        updateField('physicalCard', {
                                            ...card.physicalCard,
                                            [side]: newConfig
                                        });
                                    }
                                }}
                                scale={1}
                             />
                         )}
                    </div>
                )}
            </div>

            {/* Template Selector (Physical Only) - EXPANDED */}
            {previewMode !== 'digital' && (
                <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col flex-1 min-h-0">
                     <Label className="text-gray-600 mb-2 block text-xs shrink-0 font-medium">快速套用風格模板 (點擊套用)</Label>
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 overflow-y-auto pr-2 pb-2">
                         {PHYSICAL_CARD_TEMPLATES.map(t => (
                             <button
                                key={t.id}
                                onClick={() => applyPhysicalTemplate(t)}
                                className="text-left border border-gray-100 rounded-lg p-2 hover:border-blue-500 hover:ring-1 hover:ring-blue-200 transition-all flex flex-col items-center gap-2 group bg-gray-50/50 hover:bg-white"
                                title={t.description}
                             >
                                <div 
                                    className="w-full aspect-[1.6] rounded border shadow-sm shrink-0 relative overflow-hidden" 
                                    style={{ 
                                        backgroundColor: t.previewColor, 
                                        backgroundImage: t.thumbnailGradient 
                                    }} 
                                >
                                    {/* Mini visual hint */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-10 transition-opacity" />
                                </div>
                                <div className="text-[11px] text-gray-700 truncate w-full text-center font-medium">{t.name.split('.')[1] || t.name}</div>
                             </button>
                         ))}
                     </div>
                </div>
            )}
            
             <p className="text-center text-xs text-gray-400 shrink-0 pb-2">
                {previewMode !== 'digital' && '可在上方拖曳元素進行排版。點擊元素可微調細節。'}
            </p>
        </div>
      </div>

      {/* Hidden Export Canvas */}
      <div style={{ position: 'fixed', left: '-10000px', top: '-10000px' }}>
          {card.physicalCard && (
             <PhysicalCardCanvas 
                id="export-card-canvas"
                side={previewMode === 'physical-back' ? 'back' : 'front'}
                config={previewMode === 'physical-back' ? card.physicalCard.back : card.physicalCard.front}
                onChange={() => {}}
                readOnly={true}
                scale={1}
             />
          )}
      </div>
    </div>
  );
}

