import React, { useState } from 'react';
import { PartyFormInput, PartyPlan } from '../types';
import { PARTY_TEMPLATES } from '../data/templates';
import { 
  Sparkles, 
  X, 
  Users, 
  DollarSign, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Wine, 
  Wand2, 
  Loader2, 
  HelpCircle,
  Check,
  Calendar
} from 'lucide-react';

interface PartySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGeneratePlan: (input: PartyFormInput) => Promise<void>;
  onLoadTemplate: (plan: PartyPlan) => void;
  isGenerating: boolean;
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

export const PartySetupModal: React.FC<PartySetupModalProps> = ({
  isOpen,
  onClose,
  onGeneratePlan,
  isGenerating
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'custom'>('templates');
  const [formData, setFormData] = useState<PartyFormInput>({
    title: 'Summer Backyard BBQ & Lawn Games',
    theme: 'Rustic Southern BBQ & Craft Drinks',
    eventType: 'bbq',
    adults: 14,
    kids: 4,
    drinkers: 12,
    durationHours: 4,
    targetBudget: 300,
    venue: 'backyard',
    eventDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    dietaryRestrictions: ['Nut-Free for kids'],
    specialRequests: 'Include pulled pork sliders, cold brew sweet tea, watermelon slices, and craft IPA beer.'
  });

  if (!isOpen) return null;

  const handleSelectTemplate = (template: typeof PARTY_TEMPLATES[0]) => {
    setFormData(template.input);
    setActiveTab('custom');
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGeneratePlan(formData);
  };

  return (
    <div id="party-setup-modal" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Plan a New Party
              </h2>
              <p className="text-xs text-slate-500">
                AI Shopping Agent will calculate exact supplies, food, drinks, and budgets
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'templates'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎉 Quick Start Templates (5)
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'custom'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✨ Custom Party Wizard
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'templates' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                Choose a ready-to-customize theme template or switch to Custom Wizard:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PARTY_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-2xl">{tmpl.emoji}</span>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-900">
                          {tmpl.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {tmpl.tagline}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{tmpl.input.adults + tmpl.input.kids} guests</span>
                      <span className="font-semibold text-slate-700">${tmpl.input.targetBudget} budget</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Party Title & Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Party Title / Occasion
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Maya's 30th Birthday Bash"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Theme / Aesthetic
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    placeholder="e.g. Tropical Luau & Tiki Bar"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Event Type & Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Event Format
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs sm:text-sm"
                  >
                    <option value="cocktail">Cocktail & Tapas (Finger food)</option>
                    <option value="dinner">Full Dinner Party</option>
                    <option value="bbq">Backyard BBQ / Cookout</option>
                    <option value="birthday">Birthday Celebration</option>
                    <option value="gamenight">Game Night / Watch Party</option>
                    <option value="brunch">Brunch Gathering</option>
                    <option value="kids">Kids Birthday Party</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Venue
                  </label>
                  <select
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs sm:text-sm"
                  >
                    <option value="indoor-home">Indoor Home / Living Room</option>
                    <option value="backyard">Backyard / Patio</option>
                    <option value="park">Public Park / Picnic</option>
                    <option value="rented-venue">Rented Event Space</option>
                  </select>
                </div>
              </div>

              {/* Guest Matrix: Adults, Kids, Drinkers */}
              <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    Adults
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={formData.adults}
                    onChange={(e) => setFormData({ ...formData, adults: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    Kids
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.kids}
                    onChange={(e) => setFormData({ ...formData, kids: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Wine className="w-3.5 h-3.5 text-purple-600" />
                    Drinkers
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={formData.adults}
                    value={formData.drinkers}
                    onChange={(e) => setFormData({ ...formData, drinkers: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Budget and Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    Target Budget (USD $)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="10000"
                    step="10"
                    required
                    value={formData.targetBudget}
                    onChange={(e) => setFormData({ ...formData, targetBudget: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Duration (Hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={formData.durationHours}
                    onChange={(e) => setFormData({ ...formData, durationHours: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900 text-sm"
                  />
                </div>
              </div>

              {/* Event Date Picker & Readiness Warning Alert */}
              <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    Target Event Date
                  </label>
                  <span className="text-[11px] text-amber-800 font-medium">
                    Powers automatic shopping reminder notifications
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="date"
                    required
                    value={formData.eventDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-900 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, eventDate: new Date().toISOString().split('T')[0] })}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, eventDate: new Date(Date.now() + 86400000).toISOString().split('T')[0] })}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, eventDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] })}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700"
                    >
                      In 2 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, eventDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0] })}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700"
                    >
                      This Weekend
                    </button>
                  </div>
                </div>
              </div>

              {/* Dietary Restrictions Chips */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  Dietary Restrictions & Allergies
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DIETARY_OPTIONS.map((opt) => {
                    const isSelected = formData.dietaryRestrictions.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => handleToggleDietary(opt)}
                        className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-600 font-semibold shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Special Requests, Signature Dish, or Must-Have Drinks
                </label>
                <textarea
                  rows={2}
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="e.g. Include big batch mojitos, charcuterie board, lawn games, photo backdrop..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Shopping Agent is Generating Itemized Plan...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-amber-400" />
                      <span>Generate Party Shopping List & Quantities</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
