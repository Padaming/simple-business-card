import React, { useRef, useState, useEffect } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { CardElement, PhysicalCardSide } from '@/domain/entities/Card';
import { Button } from '@/presentation/components/ui/button';
import { Label } from '@/presentation/components/ui/label';
import { Input } from '@/presentation/components/ui/input';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface PhysicalCardCanvasProps {
  side: 'front' | 'back';
  config: PhysicalCardSide;
  onChange: (newConfig: PhysicalCardSide) => void;
  scale?: number;
  readOnly?: boolean;
  id?: string;
}

const MM_TO_PX = 5; // Scaling factor for display (1mm = 5px approx for good screen size)
const CARD_WIDTH_MM = 90;
const CARD_HEIGHT_MM = 54;
const CARD_WIDTH = CARD_WIDTH_MM * MM_TO_PX;
const CARD_HEIGHT = CARD_HEIGHT_MM * MM_TO_PX;

const FONT_FAMILIES = [
    { name: '預設(Sans)', value: 'sans-serif' },
    { name: '襯線(Serif)', value: 'serif' },
    { name: '等寬(Mono)', value: 'monospace' },
    { name: 'Arial', value: "Arial, sans-serif" },
    { name: 'Helvetica', value: "'Helvetica Neue', Helvetica, sans-serif" },
    { name: 'Times New Roman', value: "'Times New Roman', serif" },
    { name: 'Courier New', value: "'Courier New', monospace" },
    { name: 'Georgia', value: "Georgia, serif" },
    { name: 'Verdana', value: "Verdana, sans-serif" },
    { name: 'Trebuchet MS', value: "'Trebuchet MS', sans-serif" },
    { name: 'Impact', value: "Impact, sans-serif" },
    { name: 'Arial Black', value: "'Arial Black', sans-serif" },
];

export function PhysicalCardCanvas({ 
  side, 
  config, 
  onChange, 
  scale = 1,
  readOnly = false,
  id
}: PhysicalCardCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [isMultiDrag, setIsMultiDrag] = useState(false);

  const handleDrag = (e: DraggableEvent, data: DraggableData, elementId: string) => {
    const { deltaX, deltaY } = data;
    if (deltaX === 0 && deltaY === 0) return;

    const updatedElements = config.elements.map(el => {
      if (selectedElements.includes(el.id)) {
           // Move all selected elements
           // If dragging the primary one, data.x/y matches its new pos, but simpler to use delta for all
           return { ...el, x: el.x + deltaX, y: el.y + deltaY };
      } else if (el.id === elementId) {
           // If dragging an unselected one, move it
           return { ...el, x: el.x + deltaX, y: el.y + deltaY };
      }
      return el;
    });
    onChange({ ...config, elements: updatedElements });
  };

  const handleStop = (e: DraggableEvent, data: DraggableData, elementId: string) => {
    const dx = data.x - (config.elements.find(el => el.id === elementId)?.x || 0);
    const dy = data.y - (config.elements.find(el => el.id === elementId)?.y || 0);

    const updatedElements = config.elements.map(el => {
      if (selectedElements.includes(el.id)) {
          // If this is the element being dragged, use data.x/y
          if (el.id === elementId) {
             return { ...el, x: data.x, y: data.y };
          }
          // If this is another selected element, apply delta
          // ONLY if we consider this a group move.
          // However, react-draggable only fires for the one being dragged.
          // So we need to manually update others.
          return { ...el, x: el.x + dx, y: el.y + dy };
      }
      return el;
    });
    onChange({ ...config, elements: updatedElements });
  };

  const updateElementStyle = (id: string, updates: Partial<CardElement>) => {
    const updatedElements = config.elements.map(el => {
        if (el.id === id) {
            return { ...el, ...updates };
        }
        return el;
    });
    onChange({ ...config, elements: updatedElements });
  };

  const handleElementClick = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (readOnly) return;
      
      if (e.ctrlKey || e.metaKey) {
          setSelectedElements(prev => 
              prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
          );
      } else {
          // If clicking an already selected item without ctrl, keep selection if dragging might happen?
          // But here it's click.
          if (!selectedElements.includes(id)) {
               setSelectedElements([id]);
          }
      }
  };

  const handleCanvasClick = () => {
      if (!readOnly) setSelectedElements([]);
  };

  const addNewText = () => {
      const newId = `text-${Date.now()}`;
      const newEl: CardElement = {
          id: newId,
          type: 'text',
          content: 'New Text',
          x: 20,
          y: 20,
          fontSize: 12,
          color: '#000000',
          isVisible: true
      };
      onChange({ ...config, elements: [...config.elements, newEl] });
      setSelectedElements([newId]);
  };

  const deleteSelected = () => {
      const remaining = config.elements.filter(el => !selectedElements.includes(el.id));
      onChange({ ...config, elements: remaining });
      setSelectedElements([]);
  };

  const updateSelectedStyle = (updates: Partial<CardElement>) => {
      const updatedElements = config.elements.map(el => {
          if (selectedElements.includes(el.id)) {
              return { ...el, ...updates };
          }
          return el;
      });
      onChange({ ...config, elements: updatedElements });
  };

  // Only the primary selected element (last one or first one) shows floating toolbar?
  // Or showing a fixed toolbar?
  // Let's go with a fixed toolbar for better UX with multi-select.

  return (
    <div className="flex flex-col gap-4">
      {!readOnly && (
        <div className="bg-gray-50 border p-2 rounded flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
                <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} />
                        顯示格線
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={snapToGrid} onChange={e => setSnapToGrid(e.target.checked)} />
                        對齊格線 (磁吸)
                    </label>
                </div>
                <div className="text-gray-500">
                    {side === 'front' ? '正面' : '背面'} (90x54mm)
                </div>
            </div>
            
            <div className="flex flex-wrap gap-2 border-t pt-2 items-center">
                 <Button size="sm" variant="outline" onClick={addNewText} className="h-7 text-xs">+ 文字</Button>
                 {selectedElements.length > 0 && (
                     <>
                        <div className="h-4 w-px bg-gray-300 mx-1" />
                        <Button size="sm" variant="destructive" onClick={deleteSelected} className="h-7 text-xs px-2">刪除</Button>
                        
                        <div className="h-4 w-px bg-gray-300 mx-1" />
                        <select 
                            className="h-7 text-[10px] border rounded bg-white max-w-[80px]"
                            value={config.elements.find(e => e.id === selectedElements[0])?.fontFamily || 'sans-serif'}
                            onChange={(e) => updateSelectedStyle({ fontFamily: e.target.value })}
                        >
                            {FONT_FAMILIES.map(f => <option key={f.name} value={f.value}>{f.name}</option>)}
                        </select>

                        <select 
                            className="h-7 text-[10px] border rounded bg-white w-[55px]"
                            value={config.elements.find(e => e.id === selectedElements[0])?.fontSize || 12}
                            onChange={(e) => updateSelectedStyle({ fontSize: parseInt(e.target.value) })}
                            title="字體大小"
                        >
                            {[10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 60, 72].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                         
                         {config.elements.find(e => e.id === selectedElements[0])?.type === 'logo' && (
                            <div className="flex items-center gap-1 border rounded px-1 bg-white ml-1">
                                <span className="text-[10px] text-gray-400">W:</span>
                                <input 
                                    type="number" 
                                    className="h-5 w-10 text-xs border-0 p-0 focus-visible:ring-0 text-center"
                                    value={config.elements.find(e => e.id === selectedElements[0])?.width || 40}
                                    onChange={(e) => updateSelectedStyle({ width: parseInt(e.target.value) || 0 })}
                                />
                                <span className="text-[10px] text-gray-400">H:</span>
                                <input 
                                    type="number" 
                                    className="h-5 w-10 text-xs border-0 p-0 focus-visible:ring-0 text-center"
                                    value={config.elements.find(e => e.id === selectedElements[0])?.height || 40}
                                    onChange={(e) => updateSelectedStyle({ height: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                         )}

                         <div className="h-4 w-px bg-gray-300 mx-1" />
                         <Button size="sm" variant="ghost" onClick={() => updateSelectedStyle({ align: 'left' })} title="靠左對齊" className="h-7 w-7 p-0"><AlignLeft size={14} /></Button>
                         <Button size="sm" variant="ghost" onClick={() => updateSelectedStyle({ align: 'center' })} title="置中對齊" className="h-7 w-7 p-0"><AlignCenter size={14} /><span className="sr-only">Center</span></Button>
                         <Button size="sm" variant="ghost" onClick={() => updateSelectedStyle({ align: 'right' })} title="靠右對齊" className="h-7 w-7 p-0"><AlignRight size={14} /></Button>
                         <div className="flex items-center gap-1 border rounded px-1 bg-white">
                             <span className="text-xs text-gray-400">Color:</span>
                             <input type="color" 
                                value={config.elements.find(e => e.id === selectedElements[0])?.color || '#000000'}
                                onChange={(e) => updateSelectedStyle({ color: e.target.value })}
                                className="w-4 h-4 p-0 border-0"
                             />
                         </div>
                         <div className="flex items-center gap-1 border rounded px-1 bg-white">
                            <span className="text-xs text-gray-400">Content:</span>
                            <Input 
                                className="h-5 w-32 text-xs border-0 p-0 focus-visible:ring-0" 
                                value={selectedElements.length === 1 ? config.elements.find(e => e.id === selectedElements[0])?.content || '' : ''}
                                onChange={(e) => updateSelectedStyle({ content: e.target.value })}
                                placeholder={selectedElements.length > 1 ? "Multiple..." : "Text"}
                                disabled={selectedElements.length > 1}
                            />
                         </div>
                     </>
                 )}
            </div>
             <div className="flex gap-2 items-center text-xs">
                    <span className="text-gray-500">背景:</span>
                    <input type="color" 
                        value={config.backgroundColor || '#ffffff'}
                        onChange={(e) => onChange({ ...config, backgroundColor: e.target.value })}
                        className="w-5 h-5 p-0 border rounded cursor-pointer"
                    />
                    <Input 
                        placeholder="背景圖片 URL" 
                        value={config.backgroundImage || ''}
                        onChange={(e) => onChange({ ...config, backgroundImage: e.target.value })}
                        className="h-6 text-xs w-48"
                    />
             </div>
        </div>
      )}

      <div 
        id={id}
        ref={containerRef}
        className="relative bg-white shadow-lg overflow-hidden mx-auto transition-transform origin-top-left"
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          transform: `scale(${scale})`,
          // Check if backgroundImage looks like a CSS gradient or URL
          backgroundImage: config.backgroundImage 
            ? (config.backgroundImage.includes('gradient') ? config.backgroundImage : `url(${config.backgroundImage})`)
            : 'none',
          backgroundColor: config.backgroundColor || '#ffffff',
          marginBottom: readOnly ? 0 : (CARD_HEIGHT * scale - CARD_HEIGHT) // Adjust margin if scaled
        }}
        onClick={handleCanvasClick}
      >
        {/* Grid Overlay */}
        {!readOnly && showGrid && (
           <div 
             className="absolute inset-0 pointer-events-none opacity-20"
             style={{
               backgroundImage: `linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)`,
               backgroundSize: `${10 * MM_TO_PX / 2}px ${10 * MM_TO_PX / 2}px` // ~5mm grid
             }}
           />
        )}

        {/* Elements sorted manually if needed, but array order is default z-index. 
            If Z-Index is present, we might want to sort? For simplicity, we rely on DOM order mostly 
            unless Z-Index is explicitly handled. Let's just apply z-index style.
        */}
        {config.elements.filter(el => el.isVisible).map((element) => (
          <DraggableElementWrapper
            key={element.id}
            element={element}
            readOnly={readOnly}
            snapToGrid={snapToGrid}
            isSelected={selectedElements.includes(element.id)}
            onStop={(e, data) => handleStop(e, data, element.id)}
            onDrag={(e, data) => handleDrag(e, data, element.id)}
            onClick={(e) => handleElementClick(e, element.id)}
            updateElementStyle={updateElementStyle}
          />
        ))}
      </div>
    </div>
  );
}

interface DraggableElementWrapperProps {
  element: CardElement;
  readOnly: boolean;
  snapToGrid: boolean;
  isSelected: boolean;
  onStop: (e: DraggableEvent, data: DraggableData) => void;
  onDrag: (e: DraggableEvent, data: DraggableData) => void;
  onClick: (e: React.MouseEvent) => void;
  updateElementStyle: (id: string, updates: Partial<CardElement>) => void;
}

function DraggableElementWrapper({ 
  element, 
  readOnly, 
  snapToGrid, 
  isSelected,
  onStop, 
  onDrag, 
  onClick,
  updateElementStyle 
}: DraggableElementWrapperProps) {
  const nodeRef = useRef(null);
  const isText = ['name', 'title', 'company', 'email', 'phone', 'text'].includes(element.type);

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: element.x, y: element.y }}
      onStop={onStop}
      onDrag={onDrag}
      bounds="parent"
      grid={snapToGrid ? [5, 5] : undefined}
      disabled={readOnly}
    >
      <div 
        ref={nodeRef}
        className={`absolute cursor-move group hover:ring-1 hover:ring-blue-300 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        style={{
            fontSize: element.fontSize || 14,
            fontFamily: element.fontFamily || 'inherit',
            color: element.color || '#000000',
            textAlign: element.align || 'left',
            // Extended Typography
            letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : undefined,
            fontWeight: element.fontWeight || 'normal',
            fontStyle: element.italic ? 'italic' : 'normal',
            // Use width/height if set (primarily for images/logos), otherwise auto for text to fit content
            width: isText ? 'auto' : (element.width ? element.width : 'auto'),
            height: isText ? 'auto' : (element.height ? element.height : 'auto'),
            minWidth: isText ? 0 : 20, 
            minHeight: isText ? 0 : 20,
            whiteSpace: isText ? 'nowrap' : 'normal',
            display: 'flex',
            alignItems: 'center',
            justifyContent: element.align === 'center' ? 'center' : (element.align === 'right' ? 'flex-end' : 'flex-start'),
            // New Transformations
            transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
            opacity: element.opacity ?? 1,
            zIndex: isSelected ? 100 : (element.zIndex || 1), // Selected items pop to top usually, or keep original
            backdropFilter: element.hasBackdropBlur ? 'blur(4px)' : undefined,
            backgroundColor: element.hasBackdropBlur ? 'rgba(255,255,255,0.2)' : 'transparent', // Ensure transparent unless blurred
            borderRadius: element.hasBackdropBlur ? '4px' : '0'
        }}
        onClick={onClick}
        onMouseDown={(e) => {
            // Select immediately on mouse down to allow dragging without prior click
            if (!readOnly && !isSelected) {
                 onClick(e); 
            }
        }}
      >
        {renderElementContent(element)}
      </div>
    </Draggable>
  );
}

function renderElementContent(element: CardElement) {
    switch (element.type) {
        case 'logo':
             if (element.content) {
                 // Use 100% of the wrapper size
                 return <img src={element.content} alt="Logo" className="w-full h-full object-contain pointer-events-none" />; 
             }
             // Default Leaf Icon if no content
             return (
                 <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color: element.color || '#4f46e5'}}>
                     <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 19.7 7.3 20.5 7.8c1 .6 1.8 1.9.5 4C19 14.7 12 18.5 11 20z" />
                     <path d="M21 8c-3 1.5-7 1.5-12 1.5" />
                 </svg>
             );
        case 'qrcode':
            // Placeholder for QR Code
             return <div className="w-[80px] h-[80px] bg-gray-100 flex items-center justify-center text-xs text-gray-400">QR Code</div>;
        default:
            return <div style={{ whiteSpace: 'inherit', width: '100%' }}>{element.content || element.type}</div>;
    }
}
