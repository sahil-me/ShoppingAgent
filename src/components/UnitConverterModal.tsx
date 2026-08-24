import React, { useState, useEffect } from 'react';
import { ShoppingItem } from '../types';
import { 
  Scale, 
  ArrowRightLeft, 
  Check, 
  X, 
  Sparkles, 
  RotateCcw, 
  Droplets, 
  Package, 
  Layers, 
  Zap,
  Info
} from 'lucide-react';

interface UnitConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem?: ShoppingItem | null;
  items?: ShoppingItem[];
  onApplyConversion?: (updatedItem: ShoppingItem) => void;
}

type UnitCategory = 'weight' | 'volume' | 'count';

interface ConversionRatio {
  [fromUnit: string]: {
    [toUnit: string]: number;
  };
}

// Precise conversion matrices
const WEIGHT_CONVERSIONS: ConversionRatio = {
  oz: { oz: 1, lbs: 1 / 16, g: 28.3495, kg: 0.0283495 },
  lbs: { oz: 16, lbs: 1, g: 453.592, kg: 0.453592 },
  g: { oz: 1 / 28.3495, lbs: 1 / 453.592, g: 1, kg: 0.001 },
  kg: { oz: 35.274, lbs: 2.20462, g: 1000, kg: 1 }
};

const VOLUME_CONVERSIONS: ConversionRatio = {
  ml: { ml: 1, l: 0.001, 'fl oz': 0.033814, cups: 0.00422675, pints: 0.00211338, quarts: 0.00105669, gallons: 0.000264172 },
  l: { ml: 1000, l: 1, 'fl oz': 33.814, cups: 4.22675, pints: 2.11338, quarts: 1.05669, gallons: 0.264172 },
  'fl oz': { ml: 29.5735, l: 0.0295735, 'fl oz': 1, cups: 0.125, pints: 0.0625, quarts: 0.03125, gallons: 0.0078125 },
  cups: { ml: 236.588, l: 0.236588, 'fl oz': 8, cups: 1, pints: 0.5, quarts: 0.25, gallons: 0.0625 },
  pints: { ml: 473.176, l: 0.473176, 'fl oz': 16, cups: 2, pints: 1, quarts: 0.5, gallons: 0.125 },
  quarts: { ml: 946.353, l: 0.946353, 'fl oz': 32, cups: 4, pints: 2, quarts: 1, gallons: 0.25 },
  gallons: { ml: 3785.41, l: 3.78541, 'fl oz': 128, cups: 16, pints: 8, quarts: 4, gallons: 1 }
};

const UNIT_OPTIONS: Record<UnitCategory, string[]> = {
  weight: ['oz', 'lbs', 'g', 'kg'],
  volume: ['ml', 'l', 'fl oz', 'cups', 'pints', 'quarts', 'gallons'],
  count: ['items', 'pack', '6-pack', '12-pack', 'case', 'dozen']
};

export const UnitConverterModal: React.FC<UnitConverterModalProps> = ({
  isOpen,
  onClose,
  targetItem,
  items = [],
  onApplyConversion
}) => {
  const [selectedItem, setSelectedItem] = useState<ShoppingItem | null>(targetItem || null);
  const [category, setCategory] = useState<UnitCategory>('weight');
  const [inputValue, setInputValue] = useState<number>(16);
  const [fromUnit, setFromUnit] = useState<string>('oz');
  const [toUnit, setToUnit] = useState<string>('lbs');
  const [convertedResult, setConvertedResult] = useState<number>(1);

  // Auto-detect unit and quantity from target item
  useEffect(() => {
    if (targetItem) {
      setSelectedItem(targetItem);
      const unitLower = (targetItem.unit || '').toLowerCase().trim();
      const qty = targetItem.quantity || 1;

      // Extract embedded quantities if present
      const nameAndUnit = `${targetItem.name} ${targetItem.unit}`.toLowerCase();
      
      if (nameAndUnit.includes('750ml') || nameAndUnit.includes('ml') || nameAndUnit.includes('liter') || nameAndUnit.includes('fl oz') || nameAndUnit.includes('gallon')) {
        setCategory('volume');
        if (nameAndUnit.includes('750ml')) {
          setInputValue(750 * qty);
          setFromUnit('ml');
          setToUnit('l');
        } else if (unitLower.includes('ml')) {
          setInputValue(qty);
          setFromUnit('ml');
          setToUnit('l');
        } else if (unitLower.includes('liter') || unitLower === 'l') {
          setInputValue(qty);
          setFromUnit('l');
          setToUnit('fl oz');
        } else if (unitLower.includes('fl oz')) {
          setInputValue(qty);
          setFromUnit('fl oz');
          setToUnit('cups');
        } else {
          setInputValue(qty);
          setFromUnit('ml');
          setToUnit('l');
        }
      } else if (nameAndUnit.includes('oz') || nameAndUnit.includes('lb') || nameAndUnit.includes('pound') || nameAndUnit.includes('gram') || nameAndUnit.includes('kg')) {
        setCategory('weight');
        if (nameAndUnit.includes('16oz') || unitLower === '16oz bag') {
          setInputValue(16 * qty);
          setFromUnit('oz');
          setToUnit('lbs');
        } else if (unitLower.includes('lb') || unitLower.includes('pound')) {
          setInputValue(qty);
          setFromUnit('lbs');
          setToUnit('oz');
        } else if (unitLower.includes('oz')) {
          setInputValue(qty);
          setFromUnit('oz');
          setToUnit('lbs');
        } else {
          setInputValue(qty);
          setFromUnit('oz');
          setToUnit('lbs');
        }
      } else {
        setInputValue(qty);
      }
    } else {
      setSelectedItem(null);
    }
  }, [targetItem, isOpen]);

  // Recalculate converted result
  useEffect(() => {
    if (isNaN(inputValue) || inputValue < 0) {
      setConvertedResult(0);
      return;
    }

    if (category === 'weight') {
      const matrix = WEIGHT_CONVERSIONS[fromUnit];
      if (matrix && matrix[toUnit] !== undefined) {
        const res = inputValue * matrix[toUnit];
        setConvertedResult(Number(res.toFixed(3)));
      }
    } else if (category === 'volume') {
      const matrix = VOLUME_CONVERSIONS[fromUnit];
      if (matrix && matrix[toUnit] !== undefined) {
        const res = inputValue * matrix[toUnit];
        setConvertedResult(Number(res.toFixed(3)));
      }
    } else {
      // Simple count / pack conversion ratios
      const baseCounts: Record<string, number> = {
        items: 1,
        pack: 1,
        '6-pack': 6,
        '12-pack': 12,
        case: 24,
        dozen: 12
      };
      const fromCount = baseCounts[fromUnit] || 1;
      const toCount = baseCounts[toUnit] || 1;
      const totalUnits = inputValue * fromCount;
      const res = totalUnits / toCount;
      setConvertedResult(Number(res.toFixed(2)));
    }
  }, [inputValue, fromUnit, toUnit, category]);

  // Handle Quick Swap
  const handleSwapUnits = () => {
    const prevFrom = fromUnit;
    const prevTo = toUnit;
    setFromUnit(prevTo);
    setToUnit(prevFrom);
    setInputValue(convertedResult);
  };

  // Quick Preset Handlers
  const handleSelectPreset = (cat: UnitCategory, from: string, to: string, val: number) => {
    setCategory(cat);
    setFromUnit(from);
    setToUnit(to);
    setInputValue(val);
  };

  // Apply conversion to selected item
  const handleApplyToItem = () => {
    if (!selectedItem || !onApplyConversion) return;

    const roundedQty = convertedResult > 0.05 ? Number(convertedResult.toFixed(2)) : convertedResult;
    const updatedItem: ShoppingItem = {
      ...selectedItem,
      quantity: roundedQty,
      unit: toUnit,
      notes: selectedItem.notes 
        ? `${selectedItem.notes} (Converted from ${inputValue} ${fromUnit})` 
        : `Converted from ${inputValue} ${fromUnit}`
    };

    onApplyConversion(updatedItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="unit-converter-modal"
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp overflow-y-auto max-h-[90vh] space-y-5 text-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-200">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span>Smart Unit & Portion Converter</span>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  Tool
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Quickly convert grocery weights, liquid volumes, and party pack counts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Item Selection */}
        {items.length > 0 && (
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Select Cart Item to Convert (Optional):
            </label>
            <select
              value={selectedItem?.id || ''}
              onChange={(e) => {
                const found = items.find(i => i.id === e.target.value);
                setSelectedItem(found || null);
                if (found) {
                  setInputValue(found.quantity || 1);
                }
              }}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Standalone Converter Mode (No item attached) --</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.quantity} {item.unit}) - ${(item.estimatedCost || 0).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Category Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setCategory('weight');
              setFromUnit('oz');
              setToUnit('lbs');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              category === 'weight'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Weight (oz / lbs / g)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCategory('volume');
              setFromUnit('ml');
              setToUnit('l');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              category === 'volume'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Volume (ml / L / oz)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCategory('count');
              setFromUnit('pack');
              setToUnit('items');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              category === 'count'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Packs & Cases</span>
          </button>
        </div>

        {/* Popular Presets */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Quick Conversion Presets:
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleSelectPreset('weight', 'oz', 'lbs', 16)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-colors"
            >
              16 oz → 1 lb
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('weight', 'lbs', 'oz', 2)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-colors"
            >
              2 lbs → 32 oz
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('volume', 'ml', 'l', 750)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-colors"
            >
              750 ml → 0.75 L (Wine)
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('volume', 'fl oz', 'cups', 32)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-colors"
            >
              32 fl oz → 4 cups
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('volume', 'gallons', 'cups', 1)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-colors"
            >
              1 gal → 16 cups
            </button>
          </div>
        </div>

        {/* Input & Output Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-center">
          {/* FROM CARD */}
          <div className="sm:col-span-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase">From Value</label>
            <input
              id="converter-input-val"
              type="number"
              step="any"
              min="0"
              value={inputValue}
              onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-lg font-black text-slate-900 focus:outline-none focus:border-indigo-500"
            />
            <select
              id="converter-from-unit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
            >
              {UNIT_OPTIONS[category].map(u => (
                <option key={u} value={u}>{u.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* SWAP BUTTON */}
          <div className="sm:col-span-1 flex justify-center">
            <button
              type="button"
              id="converter-swap-btn"
              onClick={handleSwapUnits}
              className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl border border-indigo-200 shadow-xs transition-transform active:scale-95"
              title="Swap units"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* TO RESULT CARD */}
          <div className="sm:col-span-3 bg-gradient-to-br from-indigo-50/90 to-sky-50 p-3.5 rounded-2xl border border-indigo-200/90 space-y-2">
            <label className="block text-[11px] font-bold text-indigo-900 uppercase">Converted Result</label>
            <div 
              id="converter-result-val"
              className="w-full px-3 py-2 bg-white/90 border border-indigo-200 rounded-xl text-lg font-black text-indigo-950 flex items-center justify-between"
            >
              <span>{convertedResult}</span>
              <span className="text-xs text-indigo-600 font-bold">{toUnit}</span>
            </div>
            <select
              id="converter-to-unit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-indigo-900 focus:outline-none"
            >
              {UNIT_OPTIONS[category].map(u => (
                <option key={u} value={u}>{u.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Calculation Info */}
        <div className="bg-slate-100/80 rounded-xl p-3 text-xs text-slate-600 flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            <strong>Calculation: </strong> 
            {inputValue} {fromUnit} = <strong className="text-indigo-700">{convertedResult} {toUnit}</strong>
          </span>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 text-xs"
          >
            Close
          </button>

          {selectedItem && onApplyConversion && (
            <button
              type="button"
              id="apply-converted-unit-btn"
              onClick={handleApplyToItem}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Apply to "{selectedItem.name}" ({convertedResult} {toUnit})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
