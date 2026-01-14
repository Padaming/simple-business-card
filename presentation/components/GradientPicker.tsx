import React from 'react';
import { GradientConfig } from '@/domain/entities/Card';
import { Label } from '@/presentation/components/ui/label';
import { Input } from '@/presentation/components/ui/input';

interface GradientPickerProps {
  value?: GradientConfig;
  onChange: (config: GradientConfig) => void;
}

const DEFAULT_GRADIENT: GradientConfig = {
  from: '#4f46e5',
  to: '#06b6d4',
  direction: 'to-br',
};

export function GradientPicker({ value = DEFAULT_GRADIENT, onChange }: GradientPickerProps) {
  const handleChange = (key: keyof GradientConfig, val: string) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-gray-50/50">
      <Label className="text-gray-700 font-medium">漸層設定</Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-gray-500">起始顏色</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              type="color"
              value={value.from}
              onChange={(e) => handleChange('from', e.target.value)}
              className="w-8 h-8 p-1 rounded-full cursor-pointer"
            />
            <Input
              type="text"
              value={value.from}
              onChange={(e) => handleChange('from', e.target.value)}
              className="flex-1 text-xs"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs text-gray-500">結束顏色</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              type="color"
              value={value.to}
              onChange={(e) => handleChange('to', e.target.value)}
              className="w-8 h-8 p-1 rounded-full cursor-pointer"
            />
            <Input
              type="text"
              value={value.to}
              onChange={(e) => handleChange('to', e.target.value)}
              className="flex-1 text-xs"
            />
          </div>
        </div>
      </div>
      <div>
        <Label className="text-xs text-gray-500">方向</Label>
        <div className="flex gap-2 mt-1">
          {['to-r', 'to-l', 'to-t', 'to-b', 'to-br'].map((dir) => (
            <button
              key={dir}
              onClick={() => handleChange('direction', dir as any)}
              className={`w-8 h-8 rounded border flex items-center justify-center text-xs ${
                value.direction === dir ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white'
              }`}
            >
              {dir === 'to-br' ? '↘' : dir === 'to-r' ? '→' : dir === 'to-b' ? '↓' : dir === 'to-l' ? '←' : '↑'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
