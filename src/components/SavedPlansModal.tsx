import React, { useState } from 'react';
import { PartyPlan, SavedPlanSummary } from '../types';
import { 
  Bookmark, 
  X, 
  Trash2, 
  FolderOpen, 
  Save, 
  Sparkles, 
  Calendar, 
  Users, 
  DollarSign, 
  Check,
  Plus
} from 'lucide-react';

interface SavedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: SavedPlanSummary[];
  currentPlan: PartyPlan | null;
  onSaveCurrentPlan: (customTitle?: string) => void;
  onLoadPlan: (plan: PartyPlan) => void;
  onDeletePlan: (planId: string) => void;
}

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({
  isOpen,
  onClose,
  savedPlans,
  currentPlan,
  onSaveCurrentPlan,
  onLoadPlan,
  onDeletePlan
}) => {
  const [saveTitle, setSaveTitle] = useState(currentPlan?.title || '');
  const [justSaved, setJustSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPlan) return;
    onSaveCurrentPlan(saveTitle.trim() || currentPlan.title);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  return (
    <div 
      id="saved-plans-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 animate-scaleUp my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                My Saved Party Plans
              </h2>
              <p className="text-xs text-slate-500">
                Save your active customized cart or switch between party drafts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Save Current Plan Section */}
        {currentPlan && (
          <form onSubmit={handleSave} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5 text-sky-600" />
                <span>Save Active Session to Saved Plans</span>
              </span>
              {justSaved && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved successfully!</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="Give your plan a memorable name..."
                className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="submit"
                className="py-2 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 shadow-2xs shrink-0"
              >
                <Bookmark className="w-4 h-4" />
                <span>Save Plan</span>
              </button>
            </div>
          </form>
        )}

        {/* List of Saved Plans */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            All Saved Plans ({savedPlans.length})
          </h3>

          {savedPlans.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
              <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-700">No Saved Plans Yet</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Once you generate or customize a party shopping list, click "Save Plan" to store it for future access.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {savedPlans.map(sp => (
                <div 
                  key={sp.id}
                  className="bg-white hover:bg-slate-50 p-4 rounded-2xl border border-slate-200 transition-all flex flex-col justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 uppercase">
                        {sp.eventType}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(sp.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{sp.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{sp.theme}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span>👥 {sp.guestCount} guests</span>
                    <span className="font-bold text-slate-900">${sp.totalCost.toFixed(2)}</span>
                  </div>

                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadPlan(sp.planData);
                        onClose();
                      }}
                      className="flex-1 py-1.5 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Load Plan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeletePlan(sp.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
