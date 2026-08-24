import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { Settings, X, ShieldCheck, Check, Globe, DollarSign, Eye, Volume2 } from 'lucide-react';

interface UserPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSavePreferences: (updated: UserPreferences) => void;
}

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free (Peanut / Tree Nut)',
  'Halal',
  'Kosher',
  'Low Carb / Keto'
];

export const UserPreferencesModal: React.FC<UserPreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences
}) => {
  const [formData, setFormData] = useState<UserPreferences>({ ...preferences });

  if (!isOpen) return null;

  const handleToggleDietary = (item: string) => {
    setFormData(prev => {
      const exists = prev.dietaryRestrictions.includes(item);
      return {
        ...prev,
        dietaryRestrictions: exists
          ? prev.dietaryRestrictions.filter(d => d !== item)
          : [...prev.dietaryRestrictions, item]
      };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePreferences(formData);
    onClose();
  };

  return (
    <div 
      id="user-preferences-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6 animate-scaleUp my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                User Preferences & Defaults
              </h2>
              <p className="text-xs text-slate-500">
                Customized for account ({formData.userName})
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

        <form onSubmit={handleSave} className="space-y-5">
          {/* Default Dietary Restrictions */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Default Dietary Profile</span>
            </label>
            <p className="text-[11px] text-slate-500">
              These restrictions will automatically pre-apply to all new party plans you create.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {DIETARY_OPTIONS.map(opt => {
                const isChecked = formData.dietaryRestrictions.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleToggleDietary(opt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border flex items-center gap-1.5 ${
                      isChecked
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400'}`}>
                      {isChecked && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regional / Language / Currency */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>Preferred Language</span>
              </label>
              <select
                value={formData.preferredLanguage}
                onChange={(e) => setFormData(prev => ({ ...prev, preferredLanguage: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              >
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
                <option value="fr-FR">Français</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                <span>Currency</span>
              </label>
              <select
                value={formData.preferredCurrency}
                onChange={(e) => setFormData(prev => ({ ...prev, preferredCurrency: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-sky-600" />
              <span>Accessibility & Interface</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div className="text-xs">
                  <div className="font-bold text-slate-900">Voice Spoken Feedback</div>
                  <div className="text-[11px] text-slate-500">Read aloud AI responses and voice confirmations</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.accessibility.speechFeedback}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    accessibility: { ...prev.accessibility, speechFeedback: e.target.checked }
                  }))}
                  className="w-4 h-4 text-sky-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div className="text-xs">
                  <div className="font-bold text-slate-900">High Contrast Mode</div>
                  <div className="text-[11px] text-slate-500">Increase visual borders and high contrast tones</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.accessibility.highContrast}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    accessibility: { ...prev.accessibility, highContrast: e.target.checked }
                  }))}
                  className="w-4 h-4 text-sky-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs"
            >
              Save Preferences
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
