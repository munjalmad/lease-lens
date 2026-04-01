import React from 'react';
import { CalculatorInputs } from '../lib/types';

interface PresetsProps {
  onApplyPreset: (updates: Partial<CalculatorInputs>) => void;
}

export default function Presets({ onApplyPreset }: PresetsProps) {
  const presets = [
    {
      name: 'Average Market',
      description: 'Typical rates currently',
      values: { financeApr: 6.45, leaseApr: 4.99, salesTaxPercent: 13 }
    },
    {
      name: 'Conservative',
      description: 'Higher expected rates',
      values: { financeApr: 7.20, leaseApr: 5.49 }
    },
    {
      name: 'Promo Lease Deal',
      description: 'Manufacturer incentives',
      values: { financeApr: 5.99, leaseApr: 3.99 }
    }
  ];

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Presets</h3>
      <div className="flex flex-wrap gap-3">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onApplyPreset(preset.values)}
            className="group relative flex flex-col items-start px-5 py-3 rounded-xl border border-gray-200 bg-white hover:border-blue-500 hover:ring-1 hover:ring-blue-500 transition-all text-left shadow-sm"
          >
            <span className="text-sm font-semibold text-gray-900">{preset.name}</span>
            <span className="text-xs text-gray-500 mt-1">{preset.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
