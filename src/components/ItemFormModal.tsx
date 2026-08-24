import React, { useState, useEffect } from 'react';
import { ShoppingItem, PartyCategory, StoreType } from '../types';
import { Plus, X, Tag, Store, DollarSign, Package, Edit3, Sparkles } from 'lucide-react';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveItem: (item: Partial<ShoppingItem>) => void;
  initialItem?: ShoppingItem | null;
}

const CATEGORIES: { value: PartyCategory; label: string }[] = [
  { value: 'groceries', label: '🛒 Groceries & Fresh' },
  { value: 'beverages', label: '🍹 Drinks & Bar' },
  { value: 'bakery', label: '🧁 Bakery & Sweets' },
  { value: 'decor', label: '🎈 Decor & Vibe' },
  { value: 'tableware', label: '🍽️ Tableware & Disposables' },
  { value: 'entertainment', label: '🎲 Games & Entertainment' },
  { value: 'essentials', label: '🧊 Essentials & Ice' },
];

const STORES: StoreType[] = [
  'CymbalMart Supercenter',
  'CymbalMart Express',
  'Cymbal Spirits & Beverages',
  'Supermarket / Grocery',
  'Wholesale Club (Costco/Sam\'s)',
  'Liquor Store',
  'Party Supply / Dollar Store',
  'Bakery',
  'Online / Amazon',
  'Specialty / Farmers Market'
];

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  isOpen,
  onClose,
  onSaveItem,
  initialItem
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PartyCategory>('groceries');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>('pack');
  const [estimatedCost, setEstimatedCost] = useState<number>(5);
  const [store, setStore] = useState<StoreType>('CymbalMart Supercenter');
  const [priority, setPriority] = useState<'must-have' | 'recommended' | 'nice-to-have'>('recommended');
  const [notes, setNotes] = useState<string>('');
  const [dietaryInput, setDietaryInput] = useState<string>('');

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name || '');
      setCategory(initialItem.category || 'groceries');
      setQuantity(initialItem.quantity || 1);
      setUnit(initialItem.unit || 'pack');
      setEstimatedCost(initialItem.estimatedCost || 5);
      setStore(initialItem.store || 'CymbalMart Supercenter');
      setPriority(initialItem.priority || 'recommended');
      setNotes(initialItem.notes || '');
      setDietaryInput(initialItem.dietaryTags?.join(', ') || '');
    } else {
      setName('');
      setCategory('groceries');
      setQuantity(1);
      setUnit('pack');
      setEstimatedCost(5);
      setStore('CymbalMart Supercenter');
      setPriority('recommended');
      setNotes('');
      setDietaryInput('');
    }
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const dietaryTags = dietaryInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onSaveItem({
      ...(initialItem?.id ? { id: initialItem.id } : {}),
      name: name.trim(),
      category,
      quantity: Number(quantity) || 1,
      unit: unit.trim() || 'item',
      estimatedCost: Number(estimatedCost) || 0,
      store,
      priority,
      notes: notes.trim(),
      dietaryTags,
      purchased: initialItem?.purchased || false
    });

    onClose();
  };

  return (
    <div id="item-form-modal" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {initialItem ? 'Edit Item' : 'Add Custom Item'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Add to your party shopping list
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Item Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lime Slices & Cocktail Cherries"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs sm:text-sm font-medium"
            />
          </div>

          {/* Category & Store */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PartyCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs font-medium"
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Store Destination
              </label>
              <select
                value={store}
                onChange={(e) => setStore(e.target.value as StoreType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs font-medium"
              >
                {STORES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity, Unit & Estimated Cost */}
          <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="0.1"
                step="0.5"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="pack, lbs, bottles"
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Est. Cost ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Priority & Dietary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="must-have">Must-Have (Essential)</option>
                <option value="recommended">Recommended</option>
                <option value="nice-to-have">Nice-to-Have (Optional)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Dietary Tags (comma separated)
              </label>
              <input
                type="text"
                value={dietaryInput}
                onChange={(e) => setDietaryInput(e.target.value)}
                placeholder="e.g. Gluten-Free, Vegan"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Notes / Brand Preferences
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Buy the 2-pack for extra savings"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
            >
              {initialItem ? 'Save Changes' : 'Add to Shopping List'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
