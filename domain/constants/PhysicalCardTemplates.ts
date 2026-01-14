// 10 styles with names, description, suggested colors/backgrounds, and font families.
import { PhysicalCardSide, CardElement } from '@/domain/entities/Card';

export interface PhysicalCardTemplate {
  id: string;
  name: string;
  description: string;
  previewColor: string; // Color to show in the selector
  thumbnailGradient?: string;
  
  // Style config to apply
  style: {
    backgroundColor: string;
    backgroundImage?: string;
    textStyle: Partial<CardElement>; // Default style for text elements
    
    // Decorative elements associated with this style (shapes, lines, etc.)
    decorations: CardElement[];
    
    // Layout overrides: Map of 'element-type' (name, title, company, etc.) to position/style
    // This allows the template to move the user's text to specific grid locations.
    layoutOverrides?: {
        [key: string]: Partial<CardElement>;
    };
  };
}

// Helper to create safe SVG data URI
const encodeSVG = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

// Helper to create simple colored rect SVG
const createRectSVG = (color: string) => encodeSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1 1" preserveAspectRatio="none"><rect width="1" height="1" fill="${color}" /></svg>`);
const createCircleSVG = (color: string) => encodeSVG(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="${color}" /></svg>`);
const createTriangleSVG = (color: string) => encodeSVG(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,0 100,100 0,100" fill="${color}" /></svg>`);
const createLineSVG = (color: string) => encodeSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none"><line x1="0" y1="50%" x2="100%" y2="50%" stroke="${color}" stroke-width="2" /></svg>`);
const createGridSVG = (color: string) => encodeSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="${color}" stroke-width="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>`);

// New Helpers for Styles 21-30
const createStarSVG = (color: string) => encodeSVG(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" fill="${color}" /></svg>`);
const createWaveSVG = (color: string) => encodeSVG(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0,10 C20,0 30,20 50,10 C70,0 80,20 100,10" fill="none" stroke="${color}" stroke-width="2"/></svg>`);
const createDotPatternSVG = (color: string) => encodeSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="${color}" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg>`);
const createLeafSVG = (color: string) => encodeSVG(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 0 C20 0 0 50 50 100 C80 50 100 0 50 0" fill="${color}" /></svg>`);
const createVerticalTextSVG = (text: string, color: string) => encodeSVG(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="300"><text x="10" y="20" font-family="serif" font-size="16" fill="${color}" text-anchor="middle" style="writing-mode: tb;">${text}</text></svg>`);
const createCrosshairSVG = (color: string) => encodeSVG(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><line x1="25" y1="0" x2="25" y2="50" stroke="${color}" stroke-width="1"/><line x1="0" y1="25" x2="50" y2="25" stroke="${color}" stroke-width="1"/><circle cx="25" cy="25" r="15" fill="none" stroke="${color}" stroke-width="1"/></svg>`);

export const PHYSICAL_CARD_TEMPLATES: PhysicalCardTemplate[] = [
  // 1. Swiss International Style (Safe margins >= 15px)
  {
    id: 'swiss',
    name: '1. 瑞士國際主義 (Swiss)',
    description: 'Strict grid, asymmetrical layout, bold sans-serif.',
    previewColor: '#e0e0e0',
    style: {
      backgroundColor: '#f5f5f5',
      textStyle: { color: '#000000', fontFamily: "'Helvetica Neue', 'Arial', sans-serif" },
      decorations: [
         { id: 'swiss_grid', type: 'logo', content: createGridSVG('#cccccc'), x: 0, y: 0, width: 450, height: 270, isVisible: true, isTemplateDecoration: true },
         { id: 'swiss_bar', type: 'logo', content: createRectSVG('#ff3333'), x: 25, y: 0, width: 20, height: 270, isVisible: true, isTemplateDecoration: true },
      ],
      layoutOverrides: {
          'name': { x: 70, y: 40, fontSize: 32, align: 'left', color: '#000000' },
          'title': { x: 70, y: 80, fontSize: 14, align: 'left', color: '#333333' },
          'company': { x: 70, y: 230, fontSize: 16, align: 'left', color: '#000000' },
          'email': { x: 280, y: 40, fontSize: 10, align: 'left' },
          'phone': { x: 280, y: 55, fontSize: 10, align: 'left' },
          'logo': { x: 280, y: 80, width: 60, height: 60 }
      }
    }
  },
  // 2. Art Deco
  {
    id: 'art_deco',
    name: '2. 裝飾藝術 (Art Deco)',
    description: 'Geometric symmetry, gold gold outlines, decorative.',
    previewColor: '#2b2b2b',
    thumbnailGradient: 'linear-gradient(to right, #2b2b2b, #d4af37)',
    style: {
      backgroundColor: '#1f1f1f',
      textStyle: { color: '#e5c100', fontFamily: "serif" },
      decorations: [
          { id: 'ad_border_outer', type: 'logo', content: createRectSVG('#e5c100'), x: 15, y: 15, width: 420, height: 240, isVisible: true, isTemplateDecoration: true },
          { id: 'ad_bg_cover', type: 'logo', content: createRectSVG('#1f1f1f'), x: 17, y: 17, width: 416, height: 236, isVisible: true, isTemplateDecoration: true },
          { id: 'ad_ctr_line', type: 'logo', content: createRectSVG('#e5c100'), x: 224, y: 25, width: 2, height: 220, isVisible: true, isTemplateDecoration: true },
          { id: 'ad_dia', type: 'logo', content: createTriangleSVG('#e5c100'), x: 215, y: 125, width: 20, height: 20, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 25, y: 80, fontSize: 24, align: 'center', width: 400 },
          'title': { x: 25, y: 110, fontSize: 14, align: 'center', width: 400 },
          'company': { x: 25, y: 50, fontSize: 18, align: 'center', width: 400 },
          'email': { x: 25, y: 200, fontSize: 10, align: 'center', width: 400 },
          'phone': { x: 25, y: 215, fontSize: 10, align: 'center', width: 400 },
          'logo': { x: 195, y: 150, width: 60, height: 60 }
      }
    }
  },
  // 3. Architectural
  {
    id: 'architectural',
    name: '3. 極簡建築感 (Architectural)',
    description: 'Structural lines, blueprint style, corner text.',
    previewColor: '#f0f0f0',
    style: {
      backgroundColor: '#f8f9fa',
      textStyle: { color: '#555555', fontFamily: 'monospace' },
      decorations: [
          { id: 'arch_cross', type: 'logo', content: createLineSVG('#aaaaaa'), x: 0, y: 135, width: 450, height: 1, isVisible: true, isTemplateDecoration: true },
          { id: 'arch_cross_v', type: 'logo', content: createRectSVG('#aaaaaa'), x: 225, y: 0, width: 1, height: 270, isVisible: true, isTemplateDecoration: true },
          { id: 'arch_dot', type: 'logo', content: createCircleSVG('#000000'), x: 222, y: 132, width: 6, height: 6, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 25, y: 25, fontSize: 18, align: 'left' },
          'title': { x: 25, y: 50, fontSize: 12, align: 'left' },
          'company': { x: 295, y: 25, fontSize: 14, align: 'right', width: 130 },
          'email': { x: 25, y: 225, fontSize: 10, align: 'left' },
          'phone': { x: 295, y: 225, fontSize: 10, align: 'right', width: 130 },
          'logo': { x: 295, y: 150, width: 50, height: 50 } 
      }
    }
  },
  // 4. Wabi-Sabi
  {
    id: 'wabi_sabi',
    name: '4. 日式侘寂 (Wabi-Sabi)',
    description: 'Vertical text, organic imperfections, earthy.',
    previewColor: '#e8e4dc',
    style: {
      backgroundColor: '#e6e2d8',
      textStyle: { color: '#4a4640', fontFamily: 'serif' },
      decorations: [
          { id: 'wabi_ink', type: 'logo', content: createCircleSVG('#d0cdc5'), x: 340, y: 140, width: 80, height: 80, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 290, y: 50, fontSize: 28, align: 'right', fontFamily: 'serif' },
          'title': { x: 290, y: 90, fontSize: 14, align: 'right' },
          'company': { x: 40, y: 220, fontSize: 12, align: 'left' },
          'email': { x: 290, y: 200, fontSize: 10, align: 'right' },
          'phone': { x: 290, y: 215, fontSize: 10, align: 'right' },
          'logo': { x: 40, y: 40, width: 60, height: 60 }
      }
    }
  },
  // 5. Bauhaus
  {
    id: 'bauhaus_v2',
    name: '5. 包浩斯 (Bauhaus)',
    description: 'Geometric shapes, primary colors.',
    previewColor: '#e31d2b',
    style: {
      backgroundColor: '#f4f4f4',
      textStyle: { color: '#111111', fontFamily: 'sans-serif' },
      decorations: [
          { id: 'bau_c', type: 'logo', content: createCircleSVG('#e31d2b'), x: -50, y: 50, width: 200, height: 200, isVisible: true, isTemplateDecoration: true },
          { id: 'bau_t', type: 'logo', content: createTriangleSVG('#0055a4'), x: 350, y: 150, width: 150, height: 150, isVisible: true, isTemplateDecoration: true },
          { id: 'bau_r', type: 'logo', content: createRectSVG('#f0ad00'), x: 150, y: 250, width: 150, height: 20, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 160, y: 100, fontSize: 32, align: 'left' },
          'title': { x: 160, y: 140, fontSize: 14, align: 'left' },
          'company': { x: 20, y: 25, fontSize: 12, align: 'left', color: '#ffffff' },
          'email': { x: 160, y: 170, fontSize: 10, align: 'left' },
          'phone': { x: 160, y: 185, fontSize: 10, align: 'left' },
          'logo': { x: 360, y: 20, width: 60, height: 60 }
      }
    }
  },
  // 6. Neo-Brutalist
  {
    id: 'neo_brutalist',
    name: '6. 現代野獸派 (Neo-Brutalist)',
    description: 'Thick borders, high saturation.',
    previewColor: '#ccff00',
    style: {
      backgroundColor: '#ccff00',
      textStyle: { color: '#000000', fontFamily: 'sans-serif' },
      decorations: [
           { id: 'nb_border', type: 'logo', content: createRectSVG('#000000'), x: 10, y: 10, width: 430, height: 250, isVisible: true, isTemplateDecoration: true },
           { id: 'nb_inner', type: 'logo', content: createRectSVG('#ccff00'), x: 14, y: 14, width: 422, height: 242, isVisible: true, isTemplateDecoration: true },
           { id: 'nb_shadow', type: 'logo', content: createRectSVG('#000000'), x: 20, y: 20, width: 430, height: 250, isVisible: true, isTemplateDecoration: true },
      ],
      layoutOverrides: {
          'name': { x: 50, y: 50, fontSize: 40, align: 'left', fontFamily: 'Arial Black' },
          'title': { x: 50, y: 100, fontSize: 24, align: 'left', color: '#000000' }, 
          'company': { x: 50, y: 215, fontSize: 18, align: 'left' },
          'email': { x: 240, y: 215, fontSize: 12, align: 'right', width: 150 },
          'phone': { x: 240, y: 230, fontSize: 12, align: 'right', width: 150 },
          'logo': { x: 340, y: 40, width: 70, height: 70 }
      }
    }
  },
  // 7. Glassmorphism
  {
    id: 'glass_v2',
    name: '7. 毛玻璃 (Glassmorphism)',
    description: 'Gradient background, blurry panels.',
    previewColor: '#a8c0ff',
    style: {
      backgroundColor: '#ffffff',
      backgroundImage: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
      textStyle: { color: '#ffffff', fontFamily: 'sans-serif' },
      decorations: [
           { id: 'gls_panel', type: 'logo', content: createRectSVG('rgba(255,255,255,0.4)'), x: 40, y: 40, width: 370, height: 190, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 60, y: 60, fontSize: 28, align: 'left', color: '#ffffff' },
          'title': { x: 60, y: 100, fontSize: 14, align: 'left', color: '#ffffff' },
          'company': { x: 60, y: 180, fontSize: 14, align: 'left', color: '#ffffff' },
          'email': { x: 240, y: 180, fontSize: 10, align: 'right', color: '#ffffff', width: 140 },
          'phone': { x: 240, y: 195, fontSize: 10, align: 'right', color: '#ffffff', width: 140 },
          'logo': { x: 320, y: 60, width: 60, height: 60 }
      }
    }
  },
  // 8. Data Viz
  {
    id: 'data_viz',
    name: '8. 數據可視化 (Data Viz)',
    description: 'Tech lines, coordinates, code-like.',
    previewColor: '#0b1021',
    style: {
      backgroundColor: '#0b1021',
      textStyle: { color: '#00d4ff', fontFamily: 'monospace' },
      decorations: [
          { id: 'dv_ruler_t', type: 'logo', content: createRectSVG('#00d4ff'), x: 20, y: 20, width: 410, height: 1, isVisible: true, isTemplateDecoration: true },
          { id: 'dv_ruler_b', type: 'logo', content: createRectSVG('#00d4ff'), x: 20, y: 250, width: 410, height: 1, isVisible: true, isTemplateDecoration: true },
          { id: 'dv_graph', type: 'logo', content: createRectSVG('#333333'), x: 320, y: 50, width: 100, height: 60, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 30, y: 40, fontSize: 20, align: 'left' },
          'title': { x: 30, y: 70, fontSize: 12, align: 'left' },
          'company': { x: 30, y: 215, fontSize: 12, align: 'left', fontFamily: 'monospace' },
          'email': { x: 280, y: 215, fontSize: 10, align: 'right', width: 150 },
          'phone': { x: 280, y: 230, fontSize: 10, align: 'right', width: 150 },
          'logo': { x: 320, y: 130, width: 60, height: 60 }
      }
    }
  },
  // 9. Liquid Fluid
  {
    id: 'liquid',
    name: '9. 流體漸層 (Liquid)',
    description: 'Organic shapes, smooth gradients.',
    previewColor: '#ff9a9e',
    thumbnailGradient: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
    style: {
      backgroundColor: '#fbc2eb',
      backgroundImage: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
      textStyle: { color: '#ffffff', fontFamily: 'sans-serif' },
      decorations: [],
      layoutOverrides: {
          'name': { x: 40, y: 90, fontSize: 36, align: 'left', color: '#ffffff' },
          'title': { x: 40, y: 135, fontSize: 16, align: 'left', color: '#ffffff' },
          'company': { x: 250, y: 40, fontSize: 14, align: 'right', width: 160, color: '#ffffff' },
          'email': { x: 250, y: 200, fontSize: 12, align: 'right', width: 160 },
          'phone': { x: 250, y: 220, fontSize: 12, align: 'right', width: 160 },
          'logo': { x: 40, y: 180, width: 60, height: 60 }
      }
    }
  },
  // 10. Mid-Century
  {
    id: 'mid_century',
    name: '10. 摩登復古 (Mid-Century)',
    description: 'Olive/Mustard tones, organic shapes.',
    previewColor: '#d6c66b',
    style: {
      backgroundColor: '#f4f3e9',
      textStyle: { color: '#4a5d23', fontFamily: 'serif' },
      decorations: [
          { id: 'mc_circle', type: 'logo', content: createCircleSVG('#d6c66b'), x: 300, y: -50, width: 200, height: 200, isVisible: true, isTemplateDecoration: true },
          { id: 'mc_rect', type: 'logo', content: createRectSVG('#cf5c36'), x: 0, y: 220, width: 450, height: 50, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 40, y: 80, fontSize: 28, align: 'left', color: '#2f3a16' },
          'title': { x: 40, y: 115, fontSize: 14, align: 'left' },
          'company': { x: 40, y: 40, fontSize: 12, align: 'left', letterSpacing: 2 },
          'email': { x: 40, y: 235, fontSize: 12, align: 'left', color: '#ffffff' },
          'phone': { x: 200, y: 235, fontSize: 12, align: 'left', color: '#ffffff' },
          'logo': { x: 350, y: 150, width: 70, height: 70 }
      }
    }
  },
  // 11. Botanical
  {
    id: 'botanical',
    name: '11. 植物線描 (Botanical)',
    description: 'Fine lines, earth tones, nature.',
    previewColor: '#e0e7df',
    style: {
      backgroundColor: '#f7f9f7',
      textStyle: { color: '#4a5d4a', fontFamily: 'serif' },
      decorations: [
          { id: 'bot_border', type: 'logo', content: createRectSVG('#8f9e8f'), x: 20, y: 20, width: 410, height: 230, isVisible: true, isTemplateDecoration: true },
          { id: 'bot_bg', type: 'logo', content: createRectSVG('#ffffff'), x: 21, y: 21, width: 408, height: 228, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 60, y: 60, fontSize: 24, align: 'left'},
          'title': { x: 60, y: 90, fontSize: 14, align: 'left', color: '#8f9e8f' },
          'company': { x: 60, y: 190, fontSize: 12, align: 'left' },
          'email': { x: 250, y: 60, fontSize: 12, align: 'right', width: 140 },
          'phone': { x: 250, y: 80, fontSize: 12, align: 'right', width: 140 },
          'logo': { x: 280, y: 140, width: 60, height: 60 }
      }
    }
  },
  // 12. Clean Cyber
  {
    id: 'clean_cyber',
    name: '12. 賽博專業 (Clean Cyber)',
    description: 'Minimal dark, thin neon lines.',
    previewColor: '#0a0a0a',
    style: {
      backgroundColor: '#0a0a0a',
      textStyle: { color: '#00ffaa', fontFamily: 'monospace' },
      decorations: [
          { id: 'cc_line_l', type: 'logo', content: createRectSVG('#00ffaa'), x: 20, y: 20, width: 2, height: 40, isVisible: true, isTemplateDecoration: true },
          { id: 'cc_line_b', type: 'logo', content: createRectSVG('#00ffaa'), x: 20, y: 250, width: 40, height: 2, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 50, y: 30, fontSize: 22, align: 'left' },
          'title': { x: 50, y: 60, fontSize: 12, align: 'left', color: '#888888' },
          'company': { x: 40, y: 220, fontSize: 14, align: 'left' },
          'email': { x: 280, y: 220, fontSize: 10, align: 'right' },
          'phone': { x: 280, y: 235, fontSize: 10, align: 'right' },
          'logo': { x: 370, y: 20, width: 50, height: 50 }
      }
    }
  },
  // 13. Monochrome
  {
    id: 'monochrome',
    name: '13. 永恆單色 (Monochrome)',
    description: 'Black background, centered embossed look.',
    previewColor: '#000000',
    style: {
      backgroundColor: '#000000',
      textStyle: { color: '#ffffff', fontFamily: 'sans-serif' },
      decorations: [],
      layoutOverrides: {
          'name': { x: 25, y: 90, width: 400, fontSize: 28, align: 'center', color: '#ffffff' },
          'title': { x: 25, y: 130, width: 400, fontSize: 12, align: 'center', color: '#888888', letterSpacing: 4 },
          'company': { x: 25, y: 60, width: 400, fontSize: 10, align: 'center', color: '#444444' },
          'email': { x: 25, y: 200, width: 400, fontSize: 10, align: 'center' },
          'phone': { x: 25, y: 215, width: 400, fontSize: 10, align: 'center' },
          'logo': { x: 195, y: 25, width: 60, height: 60 }
      }
    }
  },
  // 14. Scandi
  {
    id: 'scandi',
    name: '14. 北歐斯堪地 (Scandi)',
    description: 'Light wood tones, geometric.',
    previewColor: '#e8e0d5',
    style: {
      backgroundColor: '#f2ece4',
      textStyle: { color: '#5e5046', fontFamily: 'sans-serif' },
      decorations: [
          { id: 'sc_c', type: 'logo', content: createCircleSVG('#d8d0c5'), x: 300, y: 150, width: 200, height: 200, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 40, y: 100, fontSize: 26, align: 'left' },
          'title': { x: 40, y: 135, fontSize: 14, align: 'left', color: '#8c7b70' },
          'company': { x: 40, y: 40, fontSize: 14, align: 'left' },
          'email': { x: 40, y: 210, fontSize: 11, align: 'left' },
          'phone': { x: 40, y: 225, fontSize: 11, align: 'left' },
          'logo': { x: 300, y: 50, width: 60, height: 60 }
      }
    }
  },
  // 15. Classic Serif
  {
    id: 'classic_serif',
    name: '15. 古典排版 (Classic Serif)',
    description: 'Traditional center align, rules.',
    previewColor: '#ffffff',
    style: {
      backgroundColor: '#ffffff',
      textStyle: { color: '#000000', fontFamily: 'serif' },
      decorations: [
          { id: 'cl_line', type: 'logo', content: createRectSVG('#000000'), x: 175, y: 145, width: 100, height: 1, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 25, y: 90, width: 400, fontSize: 32, align: 'center' },
          'title': { x: 25, y: 125, width: 400, fontSize: 14, align: 'center', color: '#555555' },
          'company': { x: 25, y: 50, width: 400, fontSize: 16, align: 'center' },
          'email': { x: 25, y: 200, width: 400, fontSize: 11, align: 'center' },
          'phone': { x: 25, y: 215, width: 400, fontSize: 11, align: 'center' },
          'logo': { x: 195, y: 160, width: 60, height: 60 }
      }
    }
  },
  // 16. Vaporwave
  {
    id: 'vaporwave',
    name: '16. 蒸氣波 (Vaporwave)',
    description: '80s aesthetics, grid horizon, purple.',
    previewColor: '#240046',
    thumbnailGradient: 'linear-gradient(to bottom, #240046, #ff9e00)',
    style: {
      backgroundColor: '#240046',
      backgroundImage: 'linear-gradient(to bottom, #240046 60%, #9d4edd 100%)',
      textStyle: { color: '#00fff2', fontFamily: 'sans-serif' },
      decorations: [
           { id: 'vap_sun', type: 'logo', content: createCircleSVG('#ff9e00'), x: 175, y: 150, width: 100, height: 100, isVisible: true, isTemplateDecoration: true },
           { id: 'vap_grid', type: 'logo', content: createGridSVG('rgba(0, 255, 242, 0.3)'), x: 0, y: 200, width: 450, height: 70, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 20, y: 20, fontSize: 24, align: 'left', color: '#ff9e00' },
          'title': { x: 20, y: 50, fontSize: 14, align: 'left' },
          'company': { x: 20, y: 220, fontSize: 16, align: 'left', color: '#00fff2', width: 200 },
          'email': { x: 300, y: 20, fontSize: 10, align: 'right' },
          'phone': { x: 300, y: 35, fontSize: 10, align: 'right' },
          'logo': { x: 360, y: 100, width: 60, height: 60 }
      }
    }
  },
  // 17. Industrial
  {
    id: 'industrial',
    name: '17. 工業冷調 (Industrial)',
    description: 'Concrete texture, technical labels.',
    previewColor: '#7a7a7a',
    style: {
      backgroundColor: '#dcdcdc',
      textStyle: { color: '#333333', fontFamily: 'monospace' },
      decorations: [
          { id: 'ind_bar', type: 'logo', content: createRectSVG('#000000'), x: 0, y: 0, width: 30, height: 270, isVisible: true, isTemplateDecoration: true },
          { id: 'ind_serial', type: 'text', content: 'NO. 849-22', x: 350, y: 20, fontSize: 10, color: '#666666', isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 50, y: 100, fontSize: 22, align: 'left', fontFamily: 'Arial Black' },
          'title': { x: 50, y: 130, fontSize: 12, align: 'left' },
          'company': { x: 50, y: 50, fontSize: 10, align: 'left', letterSpacing: 1 },
          'email': { x: 50, y: 215, fontSize: 10, align: 'left' },
          'phone': { x: 50, y: 230, fontSize: 10, align: 'left' },
          'logo': { x: 350, y: 50, width: 60, height: 60 }
      }
    }
  },
  // 18. High Fashion
  {
    id: 'high_fashion',
    name: '18. 高級時裝 (High Fashion)',
    description: 'High contrast, compressed font.',
    previewColor: '#ffffff',
    style: {
      backgroundColor: '#ffffff',
      textStyle: { color: '#000000', fontFamily: 'sans-serif' },
      decorations: [
          { id: 'hf_border', type: 'logo', content: createRectSVG('#000000'), x: 0, y: 0, width: 450, height: 4, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 25, y: 120, width: 400, fontSize: 40, align: 'center', letterSpacing: -2, fontFamily: 'sans-serif' },
          'title': { x: 25, y: 160, width: 400, fontSize: 12, align: 'center', letterSpacing: 4 },
          'company': { x: 25, y: 30, width: 400, fontSize: 14, align: 'center', fontWeight: 'bold' },
          'email': { x: 25, y: 245, fontSize: 10, align: 'left' },
          'phone': { x: 380, y: 245, fontSize: 10, align: 'right', width: 50 },
          'logo': { x: 195, y: 70, width: 60, height: 60 }
      }
    }
  },
  // 19. Origami
  {
    id: 'origami',
    name: '19. 摺紙風格 (Origami)',
    description: 'Sharp angles, shadows.',
    previewColor: '#e0f7fa',
    style: {
      backgroundColor: '#ffffff',
      textStyle: { color: '#006064', fontFamily: 'sans-serif' },
      decorations: [
          { id: 'ori_tri', type: 'logo', content: createTriangleSVG('#b2ebf2'), x: 0, y: 0, width: 200, height: 200, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 220, y: 50, fontSize: 24, align: 'left' },
          'title': { x: 220, y: 80, fontSize: 14, align: 'left' },
          'company': { x: 220, y: 20, fontSize: 12, align: 'left', color: '#00bcd4' },
          'email': { x: 180, y: 215, fontSize: 10, align: 'right', width: 250 },
          'phone': { x: 180, y: 230, fontSize: 10, align: 'right', width: 250 },
          'logo': { x: 360, y: 120, width: 60, height: 60 }
      }
    }
  },
  // 20. Light Leaks
  {
    id: 'light_leaks',
    name: '20. 抽象光線 (Light Leaks)',
    description: 'Dreamy light effects.',
    previewColor: '#1a1a2e',
    thumbnailGradient: 'linear-gradient(45deg, #1a1a2e, #16213e)',
    style: {
      backgroundColor: '#16213e',
      backgroundImage: 'radial-gradient(circle at 10% 10%, rgba(255, 0, 150, 0.3), transparent 40%), radial-gradient(circle at 90% 90%, rgba(0, 255, 255, 0.3), transparent 40%)',
      textStyle: { color: '#ffffff', fontFamily: 'sans-serif' },
      decorations: [],
      layoutOverrides: {
          'name': { x: 25, y: 110, width: 400, fontSize: 26, align: 'center', color: '#ffffff' },
          'title': { x: 25, y: 145, width: 400, fontSize: 14, align: 'center', color: 'rgba(255,255,255,0.7)' },
          'company': { x: 25, y: 60, width: 400, fontSize: 12, align: 'center', letterSpacing: 2 },
          'email': { x: 25, y: 230, fontSize: 10, align: 'left', color: 'rgba(255,255,255,0.5)' },
          'phone': { x: 325, y: 230, fontSize: 10, align: 'right', color: 'rgba(255,255,255,0.5)', width: 100 },
          'logo': { x: 200, y: 20, width: 50, height: 50 } 
      }
    }
  },
  // 21. Celestial
  {
    id: 'celestial',
    name: '21. 星象占星 (Celestial)',
    description: 'Gold stars, midnight blue.',
    previewColor: '#0c1445',
    style: {
      backgroundColor: '#0c1445',
      textStyle: { color: '#ffd700', fontFamily: 'serif' },
      decorations: [
        { id: 'cel_circle', type: 'logo', content: createCircleSVG('none'), x: 125, y: 35, width: 200, height: 200, isVisible: true, isTemplateDecoration: true, color: '#ffd700' }, // Circle border handled via color? SVG helper needs dynamic stroke. Using generic circle for now.
        { id: 'cel_star1', type: 'logo', content: createStarSVG('#ffd700'), x: 20, y: 20, width: 30, height: 30, isVisible: true, isTemplateDecoration: true },
        { id: 'cel_star2', type: 'logo', content: createStarSVG('#ffd700'), x: 400, y: 220, width: 20, height: 20, isVisible: true, isTemplateDecoration: true },
      ],
      layoutOverrides: {
          'name': { x: 135, y: 100, width: 180, fontSize: 24, align: 'center', color: '#ffd700' },
          'title': { x: 135, y: 130, width: 180, fontSize: 12, align: 'center', color: '#b0c4de' }, // Metallic blue-ish
          'company': { x: 135, y: 150, width: 180, fontSize: 10, align: 'center', color: '#ffd700' },
          'email': { x: 25, y: 230, fontSize: 10, align: 'left', color: '#87cefa' },
          'phone': { x: 325, y: 230, fontSize: 10, align: 'right', color: '#87cefa', width: 100 },
          'logo': { x: 200, y: 50, width: 50, height: 50 }
      }
    }
  },
  // 22. Memphis
  {
    id: 'memphis',
    name: '22. 孟菲斯 (Memphis)',
    description: 'Pop art patterns, fun.',
    previewColor: '#ffec40',
    style: {
      backgroundColor: '#ffec40',
      textStyle: { color: '#000000', fontFamily: 'sans-serif' },
      decorations: [
         { id: 'mem_dots', type: 'logo', content: createDotPatternSVG('rgba(0,0,0,0.1)'), x: 0, y: 0, width: 450, height: 270, isVisible: true, isTemplateDecoration: true },
         { id: 'mem_tri', type: 'logo', content: createTriangleSVG('#ff0055'), x: 350, y: 50, width: 80, height: 80, isVisible: true, isTemplateDecoration: true },
         { id: 'mem_wave', type: 'logo', content: createWaveSVG('#3333ff'), x: 20, y: 220, width: 100, height: 20, isVisible: true, isTemplateDecoration: true },
         { id: 'mem_card', type: 'logo', content: createRectSVG('#ffffff'), x: 110, y: 35, width: 230, height: 200, isVisible: true, isTemplateDecoration: true } // Text bg
      ],
      layoutOverrides: {
          'name': { x: 120, y: 60, width: 210, fontSize: 22, align: 'center', color: '#000000' },
          'title': { x: 120, y: 90, width: 210, fontSize: 14, align: 'center', color: '#333333' },
          'company': { x: 120, y: 120, width: 210, fontSize: 12, align: 'center' },
          'email': { x: 120, y: 190, width: 210, fontSize: 10, align: 'center' },
          'phone': { x: 120, y: 205, width: 210, fontSize: 10, align: 'center' },
          'logo': { x: 205, y: 140, width: 40, height: 40 }
      }
    }
  },
  // 23. Mesh Gradient
  {
    id: 'mesh_gradient',
    name: '23. 網格漸層 (Mesh Gradient)',
    description: 'Fluid, grain texture.',
    previewColor: '#ff9a9e',
    thumbnailGradient: 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)',
    style: {
      backgroundColor: '#000000',
      backgroundImage: 'radial-gradient(at 0% 0%, #4a00e0 0, transparent 50%), radial-gradient(at 100% 100%, #8e2de2 0, transparent 50%)',
      textStyle: { color: '#ffffff', fontFamily: 'sans-serif' },
      decorations: [], // Gradient does the heavy lifting
      layoutOverrides: {
          'name': { x: 25, y: 115, width: 400, fontSize: 32, align: 'center', fontWeight: 'bold' },
          'title': { x: 25, y: 155, width: 400, fontSize: 14, align: 'center', letterSpacing: 2 },
          'company': { x: 25, y: 30, width: 400, fontSize: 12, align: 'center', opacity: 0.8 },
          'email': { x: 25, y: 230, fontSize: 10, align: 'center', width: 400, opacity: 0.7 },
          'phone': { x: 25, y: 245, fontSize: 10, align: 'center', width: 400, opacity: 0.7 }, // Hidden if not careful with overlapping
          'logo': { x: 200, y: 60, width: 50, height: 50 } 
      }
    }
  },
  // 24. Cyber-East
  {
    id: 'cyber_east',
    name: '24. 東方賽博 (Cyber-East)',
    description: 'Vertical layout, neon red.',
    previewColor: '#000000',
    style: {
      backgroundColor: '#080808',
      textStyle: { color: '#ff003c', fontFamily: 'monospace' },
      decorations: [
         { id: 'cyb_v_line', type: 'logo', content: createRectSVG('#ff003c'), x: 380, y: 20, width: 2, height: 230, isVisible: true, isTemplateDecoration: true },
         { id: 'cyb_h_box', type: 'logo', content: createRectSVG('rgba(255, 0, 60, 0.1)'), x: 20, y: 220, width: 340, height: 30, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 320, y: 30, width: 40, fontSize: 24, align: 'center', fontFamily: 'serif' }, // Mimic vertical writing by narrow width? No, 'writing-mode' not supported in simple div. Just place right. Usually user enters horizontal text.
          'title': { x: 280, y: 30, width: 30, fontSize: 14, align: 'center' },
          'company': { x: 20, y: 20, fontSize: 18, align: 'left', fontFamily: 'Arial Black' },
          'email': { x: 30, y: 228, fontSize: 10, align: 'left', color: '#ffffff' },
          'phone': { x: 180, y: 228, fontSize: 10, align: 'right', color: '#ffffff', width: 140 },
          'logo': { x: 20, y: 50, width: 60, height: 60 }
      }
    }
  },
  // 25. Baroque
  {
    id: 'baroque',
    name: '25. 巴洛克雕花 (Baroque)',
    description: 'Luxury, dark velvet, borders.',
    previewColor: '#2b0a0d',
    style: {
      backgroundColor: '#2b0a0d',
      textStyle: { color: '#e5c100', fontFamily: 'serif' },
      decorations: [
         { id: 'bar_border_out', type: 'logo', content: createRectSVG('#e5c100'), x: 10, y: 10, width: 430, height: 250, isVisible: true, isTemplateDecoration: true },
         { id: 'bar_border_in', type: 'logo', content: createRectSVG('#2b0a0d'), x: 12, y: 12, width: 426, height: 246, isVisible: true, isTemplateDecoration: true }, // Mask
         { id: 'bar_inner', type: 'logo', content: createRectSVG('none'), x: 20, y: 20, width: 410, height: 230, isVisible: true, isTemplateDecoration: true } // Placeholder for fancy border
      ],
      layoutOverrides: {
          'name': { x: 25, y: 100, width: 400, fontSize: 30, align: 'center', color: '#e5c100', italic: true },
          'title': { x: 25, y: 140, width: 400, fontSize: 14, align: 'center', color: '#cfb53b' },
          'company': { x: 25, y: 70, width: 400, fontSize: 16, align: 'center', color: '#cfb53b' },
          'email': { x: 25, y: 210, width: 400, fontSize: 10, align: 'center' },
          'phone': { x: 25, y: 225, width: 400, fontSize: 10, align: 'center' },
          'logo': { x: 195, y: 25, width: 60, height: 60 }
      }
    }
  },
  // 26. Flat 2.0
  {
    id: 'flat_2',
    name: '26. 新平滑主義 (Flat 2.0)',
    description: 'Cards within cards, soft shadows.',
    previewColor: '#f1f5f9',
    style: {
      backgroundColor: '#f1f5f9',
      textStyle: { color: '#334155', fontFamily: 'sans-serif' },
      decorations: [
         { id: 'fl_card_l', type: 'logo', content: createRectSVG('#ffffff'), x: 20, y: 20, width: 250, height: 230, isVisible: true, isTemplateDecoration: true }, // Main card
         { id: 'fl_card_r1', type: 'logo', content: createRectSVG('#ffffff'), x: 290, y: 20, width: 140, height: 100, isVisible: true, isTemplateDecoration: true }, // Top right
         { id: 'fl_card_r2', type: 'logo', content: createRectSVG('#ffffff'), x: 290, y: 140, width: 140, height: 110, isVisible: true, isTemplateDecoration: true }, // Bottom right
      ],
      layoutOverrides: {
          'name': { x: 40, y: 100, fontSize: 28, align: 'left', color: '#1e293b' },
          'title': { x: 40, y: 140, fontSize: 14, align: 'left', color: '#64748b' },
          'company': { x: 40, y: 40, fontSize: 12, align: 'left', color: '#94a3b8' },
          'logo': { x: 330, y: 40, width: 60, height: 60 },
          'email': { x: 300, y: 160, width: 120, fontSize: 10, align: 'center', color: '#64748b' },
          'phone': { x: 300, y: 190, width: 120, fontSize: 10, align: 'center', color: '#64748b' }
      }
    }
  },
  // 27. Editorial
  {
    id: 'editorial',
    name: '27. 雜誌導報 (Editorial)',
    description: 'Big typography, grid lines.',
    previewColor: '#ffffff',
    style: {
      backgroundColor: '#ffffff',
      textStyle: { color: '#000000', fontFamily: 'serif' },
      decorations: [
          { id: 'ed_line_v', type: 'logo', content: createRectSVG('#000000'), x: 225, y: 20, width: 1, height: 230, isVisible: true, isTemplateDecoration: true },
          { id: 'ed_line_h', type: 'logo', content: createRectSVG('#000000'), x: 20, y: 135, width: 410, height: 1, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 25, y: 50, width: 190, fontSize: 36, align: 'right', fontWeight: 'bold' },
          'title': { x: 240, y: 60, width: 190, fontSize: 14, align: 'left', italic: true },
          'company': { x: 25, y: 20, fontSize: 10, align: 'left' },
          'email': { x: 25, y: 150, fontSize: 10, align: 'left' },
          'phone': { x: 25, y: 170, fontSize: 10, align: 'left' },
          'logo': { x: 350, y: 150, width: 60, height: 60 }
      }
    }
  },
  // 28. Tropical
  {
    id: 'tropical',
    name: '28. 熱帶現代 (Tropical)',
    description: 'Leaf shadows, sage green.',
    previewColor: '#e0efe0',
    style: {
      backgroundColor: '#eaf4ea',
      textStyle: { color: '#3c5c3c', fontFamily: 'sans-serif' },
      decorations: [
         { id: 'trop_leaf', type: 'logo', content: createLeafSVG('#ccdcc6'), x: -50, y: 0, width: 300, height: 300, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 200, y: 80, width: 230, fontSize: 26, align: 'right' },
          'title': { x: 200, y: 120, width: 230, fontSize: 14, align: 'right' },
          'company': { x: 200, y: 40, width: 230, fontSize: 14, align: 'right', letterSpacing: 2 },
          'email': { x: 200, y: 210, width: 230, fontSize: 10, align: 'right' },
          'phone': { x: 200, y: 225, width: 230, fontSize: 10, align: 'right' },
          'logo': { x: 370, y: 150, width: 60, height: 60 } // Overlap implies need careful placement
      }
    }
  },
  // 29. Schematic
  {
    id: 'schematic',
    name: '29. 藍圖手稿 (Schematic)',
    description: 'Blueprint blue, white dashed lines.',
    previewColor: '#0044aa',
    style: {
      backgroundColor: '#0055cc',
      textStyle: { color: '#ffffff', fontFamily: 'monospace' },
      decorations: [
          { id: 'sch_grid', type: 'logo', content: createGridSVG('rgba(255,255,255,0.2)'), x: 0, y: 0, width: 450, height: 270, isVisible: true, isTemplateDecoration: true },
          { id: 'sch_cross', type: 'logo', content: createCrosshairSVG('#ffffff'), x: 225, y: 135, width: 50, height: 50, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 25, y: 20, fontSize: 20, align: 'left', color: '#ffffff' },
          'title': { x: 25, y: 50, fontSize: 12, align: 'left', color: '#dddddd' },
          'company': { x: 300, y: 20, fontSize: 12, align: 'right', color: '#ffffff', width: 120 },
          'email': { x: 25, y: 220, fontSize: 10, align: 'left' },
          'phone': { x: 25, y: 240, fontSize: 10, align: 'left' },
          'logo': { x: 200, y: 110, width: 50, height: 50 }
      }
    }
  },
  // 30. Glitch
  {
    id: 'glitch',
    name: '30. 數位故障 (Glitch)',
    description: 'RGB offset, noise.',
    previewColor: '#000000',
    style: {
      backgroundColor: '#121212',
      textStyle: { color: '#ffffff', fontFamily: 'sans-serif' },
      decorations: [
           { id: 'gl_red', type: 'logo', content: createRectSVG('rgba(255,0,0,0.5)'), x: 24, y: 40, width: 150, height: 40, isVisible: true, isTemplateDecoration: true }, // Behind name
           { id: 'gl_cyan', type: 'logo', content: createRectSVG('rgba(0,255,255,0.5)'), x: 20, y: 38, width: 150, height: 40, isVisible: true, isTemplateDecoration: true }
      ],
      layoutOverrides: {
          'name': { x: 22, y: 39, fontSize: 32, align: 'left', color: '#ffffff', fontWeight: 'bold' },
          'title': { x: 22, y: 80, fontSize: 14, align: 'left', color: '#aaaaaa' },
          'company': { x: 22, y: 215, fontSize: 14, align: 'left', letterSpacing: 3 },
          'email': { x: 250, y: 215, fontSize: 10, align: 'right', width: 180 },
          'phone': { x: 250, y: 230, fontSize: 10, align: 'right', width: 180 },
          'logo': { x: 350, y: 40, width: 60, height: 60 }
      }
    }
  }
];
