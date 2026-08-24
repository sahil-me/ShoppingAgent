import React from 'react';
import { AlertCircle, Trash2, Bookmark, X, ArrowRight } from 'lucide-react';

interface ResetPlanConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
  onSaveAndReset: () => void;
  planTitle?: string;
}

export const ResetPlanConfirmModal: React.FC<ResetPlanConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
  onSaveAndReset,
  planTitle = 'current party plan'
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="reset-plan-confirm-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900">
            Start a Fresh Party Plan?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Starting a new plan will clear your active shopping list and customizations for <strong className="text-slate-900">"{planTitle}"</strong> from this session.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
          <button
            type="button"
            id="confirm-save-and-reset-btn"
            onClick={onSaveAndReset}
            className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Bookmark className="w-4 h-4" />
            <span>Save to My Plans & Start Fresh</span>
          </button>

          <button
            type="button"
            id="confirm-discard-and-reset-btn"
            onClick={onConfirmReset}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Discard & Start Fresh</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-4 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors text-center"
          >
            Cancel and Keep Editing
          </button>
        </div>
      </div>
    </div>
  );
};
