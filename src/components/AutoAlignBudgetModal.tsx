import React, { useState } from 'react';
import { PartyPlan, ShoppingItem } from '../types';
import { 
  TrendingDown, 
  Sparkles, 
  X, 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  Tag, 
  DollarSign,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface AutoAlignBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PartyPlan;
  onApplySwaps: (updatedItems: ShoppingItem[]) => void;
}

interface BudgetSwapProposal {
  id: string;
  originalItemId: string;
  originalName: string;
  originalCost: number;
  replacementName: string;
  replacementCost: number;
  savings: number;
  rationale: string;
  category: string;
  brandTier: 'Cymbal Select' | 'Bulk Value';
  selected: boolean;
}

export const AutoAlignBudgetModal: React.FC<AutoAlignBudgetModalProps> = ({
  isOpen,
  onClose,
  plan,
  onApplySwaps
}) => {
  const totalCost = plan.items.reduce((acc, item) => acc + (item.estimatedCost || 0), 0);
  const diff = plan.targetBudget - totalCost;
  const isOver = diff < 0;

  // Generate intelligent swap proposals based on items in the plan
  const [proposals, setProposals] = useState<BudgetSwapProposal[]>(() => {
    const list: BudgetSwapProposal[] = [];

    plan.items.forEach(item => {
      // Wine / Spirits swaps
      if (item.category === 'beverages' && item.estimatedCost >= 25) {
        list.push({
          id: `swap-${item.id}`,
          originalItemId: item.id,
          originalName: item.name,
          originalCost: item.estimatedCost,
          replacementName: `Cymbal Select Reserve Value Pack (${item.quantity} ${item.unit})`,
          replacementCost: Math.round(item.estimatedCost * 0.72 * 100) / 100,
          savings: Math.round((item.estimatedCost - item.estimatedCost * 0.72) * 100) / 100,
          rationale: 'Switch to Cymbal Select private label. Identical vintage quality with 28% direct host savings.',
          category: 'Drinks & Bar',
          brandTier: 'Cymbal Select',
          selected: true
        });
      }

      // Meat & Deli / Cheese swaps
      if (item.category === 'groceries' && (item.name.toLowerCase().includes('cheese') || item.name.toLowerCase().includes('meat') || item.name.toLowerCase().includes('charcuterie') || item.estimatedCost >= 15)) {
        list.push({
          id: `swap-${item.id}`,
          originalItemId: item.id,
          originalName: item.name,
          originalCost: item.estimatedCost,
          replacementName: `Cymbal Deli Club Family Pack (${item.name.split('(')[0].trim()})`,
          replacementCost: Math.round(item.estimatedCost * 0.75 * 100) / 100,
          savings: Math.round((item.estimatedCost - item.estimatedCost * 0.75) * 100) / 100,
          rationale: 'Switch from pre-sliced individual trays to Cymbal Club bulk deli pack for 25% lower price/oz.',
          category: 'Groceries & Deli',
          brandTier: 'Bulk Value',
          selected: true
        });
      }

      // Tableware & Decor
      if ((item.category === 'tableware' || item.category === 'decor') && item.estimatedCost >= 10) {
        list.push({
          id: `swap-${item.id}`,
          originalItemId: item.id,
          originalName: item.name,
          originalCost: item.estimatedCost,
          replacementName: `Cymbal Party Pack Eco-Bundle (${item.quantity} ${item.unit})`,
          replacementCost: Math.round(item.estimatedCost * 0.65 * 100) / 100,
          savings: Math.round((item.estimatedCost - item.estimatedCost * 0.65) * 100) / 100,
          rationale: 'Bundled tableware packs save 35% compared to purchasing separate boutique designer sets.',
          category: 'Tableware & Paper',
          brandTier: 'Cymbal Select',
          selected: true
        });
      }
    });

    // If few proposals generated, provide general store brand swaps
    if (list.length === 0 && plan.items.length > 0) {
      const topItems = [...plan.items].sort((a, b) => b.estimatedCost - a.estimatedCost).slice(0, 3);
      topItems.forEach(item => {
        list.push({
          id: `swap-${item.id}`,
          originalItemId: item.id,
          originalName: item.name,
          originalCost: item.estimatedCost,
          replacementName: `Cymbal Select Value Alternative: ${item.name}`,
          replacementCost: Math.round(item.estimatedCost * 0.75 * 100) / 100,
          savings: Math.round((item.estimatedCost - item.estimatedCost * 0.75) * 100) / 100,
          rationale: 'Cymbal Select brand price match guarantee.',
          category: item.category,
          brandTier: 'Cymbal Select',
          selected: true
        });
      });
    }

    return list;
  });

  if (!isOpen) return null;

  const totalSelectedSavings = proposals
    .filter(p => p.selected)
    .reduce((acc, p) => acc + p.savings, 0);

  const projectedNewTotal = Math.max(0, totalCost - totalSelectedSavings);
  const projectedDiff = plan.targetBudget - projectedNewTotal;

  const toggleProposal = (id: string) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  };

  const handleApply = () => {
    const swapMap = new Map<string, BudgetSwapProposal>();
    proposals.filter(p => p.selected).forEach(p => {
      swapMap.set(p.originalItemId, p);
    });

    const updated = plan.items.map(item => {
      const swap = swapMap.get(item.id);
      if (swap) {
        return {
          ...item,
          name: swap.replacementName,
          originalCost: item.estimatedCost,
          estimatedCost: swap.replacementCost,
          brandTier: swap.brandTier,
          notes: `${item.notes ? item.notes + ' • ' : ''}Auto-aligned for $${swap.savings.toFixed(2)} savings.`
        };
      }
      return item;
    });

    onApplySwaps(updated);
    onClose();
  };

  return (
    <div id="auto-align-budget-modal" className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-black shadow-xs">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
                  CUJ Task 2
                </span>
                <span className="text-[10px] bg-emerald-500/30 text-white px-2 py-0.2 rounded-full border border-emerald-400/40">
                  Smart Budget Alignment
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Align Shopping List with ${plan.targetBudget} Target Budget
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current vs Projected Comparison Bar */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-3 text-center">
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold">Current Total</div>
            <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
              ${totalCost.toFixed(2)}
            </div>
            <span className={`text-[10px] font-bold ${isOver ? 'text-rose-600' : 'text-emerald-600'}`}>
              {isOver ? `+$${Math.abs(diff).toFixed(2)} over` : `$${diff.toFixed(2)} under`}
            </span>
          </div>

          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <div className="text-[11px] text-emerald-800 font-semibold">Selected Savings</div>
            <div className="text-base sm:text-lg font-black text-emerald-700 mt-0.5">
              -${totalSelectedSavings.toFixed(2)}
            </div>
            <span className="text-[10px] font-bold text-emerald-600">
              {proposals.filter(p => p.selected).length} Swaps Applied
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <div className="text-[11px] text-slate-500 font-semibold">Projected Spend</div>
            <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
              ${projectedNewTotal.toFixed(2)}
            </div>
            <span className={`text-[10px] font-bold ${projectedDiff < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {projectedDiff < 0 ? `+$${Math.abs(projectedDiff).toFixed(2)} over` : `✓ Under Budget ($${projectedDiff.toFixed(2)} buffer)`}
            </span>
          </div>
        </div>

        {/* Swap Items List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600 font-medium">
              Review and select CymbalMart store brand & bulk size swaps to align your budget:
            </p>
            <button
              onClick={() => {
                const allSelected = proposals.every(p => p.selected);
                setProposals(prev => prev.map(p => ({ ...p, selected: !allSelected })));
              }}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              {proposals.every(p => p.selected) ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {proposals.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Your party shopping list is already well optimized for your budget!
            </div>
          ) : (
            <div className="space-y-3">
              {proposals.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => toggleProposal(prop.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    prop.selected 
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs' 
                      : 'border-slate-200 bg-white hover:border-slate-300 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                      prop.selected 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'border-slate-300 bg-white'
                    }`}>
                      {prop.selected && <Check className="w-3.5 h-3.5" />}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                          {prop.category}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800">
                          {prop.brandTier}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 line-through">
                        {prop.originalName} (${prop.originalCost.toFixed(2)})
                      </div>

                      <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{prop.replacementName}</span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {prop.rationale}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-lg inline-block">
                      Save ${prop.savings.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold mt-1">
                      New: ${prop.replacementCost.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            disabled={totalSelectedSavings === 0}
            className="w-full sm:w-auto py-2.5 px-6 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply Selected Swaps (Save ${totalSelectedSavings.toFixed(2)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
