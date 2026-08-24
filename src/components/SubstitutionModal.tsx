import React, { useState, useEffect } from 'react';
import { ShoppingItem, PartyPlan } from '../types';
import { Sparkles, X, Loader2, ArrowRight, Check, Store, Tag } from 'lucide-react';

interface SubstitutionOption {
  name: string;
  description: string;
  estimatedCost: number;
  costDifference: string;
  store: string;
  dietaryFit?: string;
}

interface SubstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ShoppingItem | null;
  plan: PartyPlan;
  onApplySubstitution: (originalItemId: string, newSubstitution: SubstitutionOption) => void;
}

export const SubstitutionModal: React.FC<SubstitutionModalProps> = ({
  isOpen,
  onClose,
  item,
  plan,
  onApplySubstitution
}) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<SubstitutionOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && item) {
      fetchSubstitutions();
    }
  }, [isOpen, item]);

  const fetchSubstitutions = async () => {
    if (!item) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/suggest-substitutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: item.name,
          itemCategory: item.category,
          currentCost: item.estimatedCost,
          dietaryNeed: plan.dietaryRestrictions.join(', ')
        })
      });

      if (!res.ok) throw new Error('Failed to fetch smart substitutions');
      const data = await res.json();
      setOptions(data.substitutions || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error generating substitutions');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div id="substitution-modal" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                AI Smart Swap & Alternatives
              </h3>
              <p className="text-[11px] text-slate-500">
                Budget cuts, allergen alternatives, and crowd-pleasing upgrades
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

        {/* Current Item Overview */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500">Target Item:</span>
            <div className="font-bold text-slate-900">{item.name}</div>
          </div>
          <div className="text-right">
            <span className="text-slate-500">Current Est:</span>
            <div className="font-bold text-slate-900">${(item.estimatedCost || 0).toFixed(2)}</div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-6 h-6 animate-spin text-amber-600 mx-auto" />
              <p className="text-xs text-slate-500">
                Finding intelligent budget swaps and delicious dietary alternatives...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {error}
            </div>
          )}

          {!loading && !error && options.map((opt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 transition-all space-y-2 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-900">
                    {opt.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Store className="w-3 h-3 text-slate-400" />
                      {opt.store}
                    </span>
                    {opt.dietaryFit && (
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-medium">
                        🌱 {opt.dietaryFit}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-900">
                    ${opt.estimatedCost.toFixed(2)}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5">
                    {opt.costDifference}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {opt.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    onApplySubstitution(item.id, opt);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <span>Replace With This</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
