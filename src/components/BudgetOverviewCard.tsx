import React, { useState } from 'react';
import { PartyPlan, PartyCategory } from '../types';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  ShoppingBag, 
  Wine, 
  Cake, 
  Sparkles, 
  Utensils, 
  Gamepad2, 
  Package,
  Wand2,
  AlertTriangle,
  Edit3,
  Check,
  X,
  Calculator
} from 'lucide-react';

interface BudgetOverviewCardProps {
  plan: PartyPlan;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenAlignBudget?: () => void;
  onUpdateBudget?: (newBudget: number) => void;
}

const CATEGORY_META: Record<PartyCategory, { label: string; icon: React.FC<{ className?: string }>; color: string; bg: string }> = {
  groceries: { label: 'Produce & Deli', icon: ShoppingBag, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  beverages: { label: 'Drinks & Bar', icon: Wine, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  bakery: { label: 'Bakery & Sweets', icon: Cake, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  decor: { label: 'Decor & Vibe', icon: Sparkles, color: 'text-pink-700', bg: 'bg-pink-50 border-pink-200' },
  tableware: { label: 'Tableware & Paper', icon: Utensils, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  entertainment: { label: 'Games & Fun', icon: Gamepad2, color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  essentials: { label: 'Essentials & Ice', icon: Package, color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-200' },
};

export const BudgetOverviewCard: React.FC<BudgetOverviewCardProps> = ({
  plan,
  selectedCategory,
  onSelectCategory,
  onOpenAlignBudget,
  onUpdateBudget
}) => {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudgetValue, setTempBudgetValue] = useState(plan.targetBudget.toString());

  const totalCost = plan.items.reduce((acc, item) => acc + (item.estimatedCost || 0), 0);
  const purchasedCost = plan.items
    .filter(i => i.purchased)
    .reduce((acc, item) => acc + (item.estimatedCost || 0), 0);
  
  const budget = plan.targetBudget || 1;
  const percentUsed = Math.min(100, Math.round((totalCost / budget) * 100));
  const diff = budget - totalCost;
  const isOver = diff < 0;

  // Compute category subtotals live from items
  const categoryTotals: Record<string, { total: number; count: number }> = {};
  for (const item of plan.items) {
    const cat = item.category || 'groceries';
    if (!categoryTotals[cat]) {
      categoryTotals[cat] = { total: 0, count: 0 };
    }
    categoryTotals[cat].total += item.estimatedCost || 0;
    categoryTotals[cat].count += 1;
  }

  const handleSaveBudget = () => {
    const val = parseFloat(tempBudgetValue);
    if (!isNaN(val) && val > 0 && onUpdateBudget) {
      onUpdateBudget(val);
    }
    setIsEditingBudget(false);
  };

  return (
    <div id="budget-overview-card" className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      {/* Top Banner & Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded uppercase tracking-wider border border-sky-200/60">
              Live Budget & Cart Calculations
            </span>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <span>Spend & Allocation Tracker</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200/60">
                Auto-Recalculating
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time totals across <strong>{plan.items.length} items</strong> • <strong>${(totalCost / (plan.guestCount.total || 1)).toFixed(2)}</strong> / guest ({plan.guestCount.total} total guests)
          </p>
        </div>

        {/* Big Numbers & Alignment CTA */}
        <div className="flex items-center flex-wrap gap-4 sm:gap-6">
          <div>
            <div className="text-[11px] text-slate-500 font-semibold uppercase">Estimated Total</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              ${totalCost.toFixed(2)}
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <div>
            <div className="text-[11px] text-slate-500 font-semibold uppercase flex items-center gap-1">
              <span>Target Budget</span>
              {onUpdateBudget && !isEditingBudget && (
                <button
                  onClick={() => {
                    setTempBudgetValue(plan.targetBudget.toString());
                    setIsEditingBudget(true);
                  }}
                  className="text-sky-600 hover:text-sky-800"
                  title="Edit Target Budget"
                >
                  <Edit3 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            {isEditingBudget ? (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs font-bold text-slate-500">$</span>
                <input
                  type="number"
                  autoFocus
                  value={tempBudgetValue}
                  onChange={(e) => setTempBudgetValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveBudget();
                    if (e.key === 'Escape') setIsEditingBudget(false);
                  }}
                  className="w-20 px-1.5 py-0.5 border-2 border-sky-500 rounded text-sm font-black text-slate-900 focus:outline-none"
                />
                <button
                  onClick={handleSaveBudget}
                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsEditingBudget(false)}
                  className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => {
                  if (onUpdateBudget) {
                    setTempBudgetValue(plan.targetBudget.toString());
                    setIsEditingBudget(true);
                  }
                }}
                className="text-xl sm:text-2xl font-black text-slate-700 cursor-pointer hover:text-sky-600 transition-colors"
                title="Click to edit Target Budget"
              >
                ${plan.targetBudget.toFixed(2)}
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <div>
            <div className="text-[11px] text-slate-500 font-semibold uppercase">Alignment Status</div>
            <div className={`text-xs sm:text-sm font-black flex items-center gap-1 ${
              isOver ? 'text-rose-600' : 'text-emerald-600'
            }`}>
              {isOver ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>+${Math.abs(diff).toFixed(2)} Over Budget</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>${diff.toFixed(2)} Under Budget</span>
                </>
              )}
            </div>
          </div>

          {/* 1-Click Align Button */}
          {onOpenAlignBudget && (
            <button
              id="budget-align-cta-btn"
              onClick={onOpenAlignBudget}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                isOver 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isOver ? 'Auto-Align Under Budget' : 'Optimize & Trim Costs'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress & Allocation Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <span className="text-slate-600">
            ${purchasedCost.toFixed(2)} in cart ({Math.round((purchasedCost / (totalCost || 1)) * 100)}% carted)
          </span>
          <span className={isOver ? 'text-rose-600 font-bold' : 'text-slate-600 font-semibold'}>
            {percentUsed}% of ${plan.targetBudget} budget allocated
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden flex shadow-inner">
          <div 
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${Math.min(100, (purchasedCost / budget) * 100)}%` }}
            title="Carted items"
          />
          <div 
            className={`h-full transition-all duration-500 ${isOver ? 'bg-rose-400' : 'bg-sky-500'}`}
            style={{ width: `${Math.max(0, Math.min(100 - (purchasedCost / budget) * 100, ((totalCost - purchasedCost) / budget) * 100))}%` }}
            title="Pending estimated items"
          />
        </div>
      </div>

      {/* Category Filter Pills with Live Subtotals */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          id="cat-filter-all"
          onClick={() => onSelectCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          All Departments ({plan.items.length}) • ${totalCost.toFixed(0)}
        </button>

        {(Object.keys(CATEGORY_META) as PartyCategory[]).map((catKey) => {
          const meta = CATEGORY_META[catKey];
          const data = categoryTotals[catKey] || { total: 0, count: 0 };
          const Icon = meta.icon;
          const isSelected = selectedCategory === catKey;

          if (data.count === 0 && selectedCategory !== catKey) return null;

          return (
            <button
              key={catKey}
              id={`cat-filter-${catKey}`}
              onClick={() => onSelectCategory(catKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : `${meta.bg} ${meta.color} hover:brightness-95`
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{meta.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isSelected ? 'bg-sky-700 text-white' : 'bg-white text-slate-800 border border-slate-200/60'
              }`}>
                ${Math.round(data.total)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
