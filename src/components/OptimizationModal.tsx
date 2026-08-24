import React, { useState, useEffect } from 'react';
import { PartyPlan } from '../types';
import { Layers, X, Loader2, DollarSign, Store, Sparkles, Navigation, ArrowRight, ShieldCheck } from 'lucide-react';

interface OptimizationData {
  topSavingsHacks: {
    title: string;
    description: string;
    estimatedSavings: string;
  }[];
  storeRouteStrategy: {
    stopNumber: number;
    storeName: string;
    itemsToBuy: string;
    proTip: string;
  }[];
  totalEstimatedSavings: string;
}

interface OptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PartyPlan;
}

export const OptimizationModal: React.FC<OptimizationModalProps> = ({
  isOpen,
  onClose,
  plan
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OptimizationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchOptimization();
    }
  }, [isOpen]);

  const fetchOptimization = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/price-compare-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPlan: plan })
      });

      if (!res.ok) throw new Error('Failed to optimize shopping route');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error generating route strategy');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="optimization-modal" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Store Route & Budget Optimization
              </h3>
              <p className="text-[11px] text-slate-500">
                Strategic store stops & savings hacks for {plan.title}
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading && (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                Analyzing bulk club prices, store bundle routes, and money-saving hacks...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {error}
            </div>
          )}

          {!loading && data && (
            <>
              {/* Savings Banner */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
                    Total Potential Savings
                  </span>
                  <div className="text-2xl sm:text-3xl font-black mt-0.5">
                    {data.totalEstimatedSavings}
                  </div>
                  <p className="text-xs text-emerald-100 mt-1">
                    By bundling wholesale club items and party store tableware
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
                  <ShieldCheck className="w-6 h-6 text-emerald-200" />
                </div>
              </div>

              {/* Strategic Store Route */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-amber-600" />
                  Recommended Store Shopping Route
                </h4>

                <div className="space-y-3">
                  {data.storeRouteStrategy.map((stop) => (
                    <div
                      key={stop.stopNumber}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start gap-3.5"
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {stop.stopNumber}
                      </div>

                      <div className="space-y-1 flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-900 text-sm">
                            {stop.storeName}
                          </h5>
                          <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Stop #{stop.stopNumber}
                          </span>
                        </div>

                        <p className="text-slate-700 font-medium">
                          <strong>Target Items:</strong> {stop.itemsToBuy}
                        </p>

                        <p className="text-slate-500 italic pt-1">
                          💡 <strong>Pro-Tip:</strong> {stop.proTip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Savings Hacks */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Party Host Money-Saving Hacks
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.topSavingsHacks.map((hack, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/40 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-amber-950">
                          {hack.title}
                        </h5>
                        <span className="font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded text-[11px]">
                          {hack.estimatedSavings}
                        </span>
                      </div>
                      <p className="text-amber-900/80 leading-relaxed">
                        {hack.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
