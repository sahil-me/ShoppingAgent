import React, { useState } from 'react';
import { PartyFormInput, PartyPlan, SavedPlanSummary } from '../types';
import { PARTY_TEMPLATES } from '../data/templates';
import { 
  Sparkles, 
  Users, 
  DollarSign, 
  Clock, 
  MapPin, 
  Wine, 
  Wand2, 
  Loader2, 
  Check, 
  Calendar, 
  Bookmark, 
  ArrowRight,
  ShieldCheck,
  Tag,
  ChefHat,
  HeartHandshake,
  Trash2,
  FolderOpen
} from 'lucide-react';

interface PartyCreationHeroProps {
  onCreatePlan: (input: PartyFormInput) => Promise<void>;
  onLoadSavedPlan?: (savedPlan: PartyPlan) => void;
  savedPlans?: SavedPlanSummary[];
  onDeleteSavedPlan?: (planId: string) => void;
  isGenerating: boolean;
  userDefaultDietary?: string[];
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

const EVENT_TYPE_PRESETS = [
  { id: 'cocktail', label: '🍸 Cocktail & Drinks', defaultTheme: 'Sunset Cocktails & Small Bites' },
  { id: 'bbq', label: '🔥 Backyard BBQ', defaultTheme: 'Smokehouse BBQ & Lawn Games' },
  { id: 'dinner', label: '🍝 Dinner Party', defaultTheme: 'Cozy Table & Multi-Course Dinner' },
  { id: 'birthday', label: '🎂 Birthday Celebration', defaultTheme: 'Festive Birthday Bash & Sweets' },
  { id: 'gamenight', label: '🏈 Game Day & Snacks', defaultTheme: 'Tailgate Stadium & Finger Foods' },
  { id: 'kids', label: '🚀 Kids Party', defaultTheme: 'Fun Space & Colorful Snacks' },
  { id: 'brunch', label: '🥐 Weekend Brunch', defaultTheme: 'Mimosa Bar & Pastry Spread' },
  { id: 'custom', label: '✨ Custom Event', defaultTheme: 'Special Gathering' }
];

export const PartyCreationHero: React.FC<PartyCreationHeroProps> = ({
  onCreatePlan,
  onLoadSavedPlan,
  savedPlans = [],
  onDeleteSavedPlan,
  isGenerating,
  userDefaultDietary = []
}) => {
  const [viewMode, setViewMode] = useState<'create' | 'saved'>('create');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Clean, neutral default state for fresh user
  const [formData, setFormData] = useState<PartyFormInput>({
    title: '',
    theme: '',
    eventType: 'cocktail',
    adults: 12,
    kids: 0,
    drinkers: 10,
    durationHours: 3,
    targetBudget: 200,
    venue: 'indoor-home',
    eventDate: '',
    dietaryRestrictions: [...userDefaultDietary],
    specialRequests: ''
  });

  const handleApplyTemplate = (tpl: typeof PARTY_TEMPLATES[0]) => {
    setSelectedTemplateId(tpl.id);
    setFormData({
      title: tpl.input.title,
      theme: tpl.input.theme,
      eventType: tpl.input.eventType,
      adults: tpl.input.adults,
      kids: tpl.input.kids,
      drinkers: tpl.input.drinkers,
      durationHours: tpl.input.durationHours,
      targetBudget: tpl.input.targetBudget,
      venue: tpl.input.venue,
      eventDate: tpl.input.eventDate || '',
      dietaryRestrictions: [...tpl.input.dietaryRestrictions],
      specialRequests: tpl.input.specialRequests
    });
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

  const handleEventTypeSelect = (typeId: string, defaultTheme: string) => {
    setFormData(prev => ({
      ...prev,
      eventType: typeId,
      theme: prev.theme ? prev.theme : defaultTheme
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      // Set sensible fallback title if blank
      formData.title = formData.theme ? `${formData.theme} Party` : 'Party Gathering';
    }
    onCreatePlan?.(formData);
  };

  return (
    <div id="party-creation-hero" className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Welcoming Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white p-6 sm:p-10 shadow-2xl border border-sky-800/40">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CymbalMart AI Party Planner Shopping Agent</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Plan Your Next Event with Precision Shopping & Budget Control
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Tell our AI Agent what you're hosting. We will calculate exact drink ratios, portion sizes, ingredients, and curate an itemized CymbalMart cart optimized for your budget.
          </p>

          {/* Mode Switcher Buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('create')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                viewMode === 'create'
                  ? 'bg-sky-400 text-slate-950 shadow-md scale-102'
                  : 'bg-white/10 text-slate-200 hover:bg-white/15'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>Create New Party Plan</span>
            </button>

            {savedPlans.length > 0 && (
              <button
                type="button"
                onClick={() => setViewMode('saved')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  viewMode === 'saved'
                    ? 'bg-amber-400 text-slate-950 shadow-md scale-102'
                    : 'bg-white/10 text-slate-200 hover:bg-white/15'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>My Saved Plans ({savedPlans.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {viewMode === 'saved' ? (
        /* Saved Plans View */
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-500" />
                <span>My Saved Party Plans</span>
              </h2>
              <p className="text-xs text-slate-500">
                Pick up where you left off or load an earlier party template
              </p>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('create')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>+ Create New Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedPlans.map(sp => (
              <div 
                key={sp.id}
                className="bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-5 border border-slate-200 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {sp.eventType}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Saved {new Date(sp.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{sp.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-1">{sp.theme}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                  <span>👥 {sp.guestCount} Guests</span>
                  <span>🛒 {sp.itemCount} Items</span>
                  <span className="font-bold text-slate-900">${sp.totalCost.toFixed(2)}</span>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onLoadSavedPlan && onLoadSavedPlan(sp.planData)}
                    className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Open This Plan</span>
                  </button>

                  {onDeleteSavedPlan && (
                    <button
                      type="button"
                      onClick={() => onDeleteSavedPlan(sp.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete saved plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Create New Plan Form */
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quick Start Inspiration Templates */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Quick Inspiration Templates (Optional)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Select a party archetype to auto-populate fields or customize from scratch below
                </p>
              </div>
              {selectedTemplateId && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTemplateId(null);
                    setFormData(prev => ({ ...prev, title: '', theme: '' }));
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {PARTY_TEMPLATES.slice(0, 6).map(tpl => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-sky-50/90 border-sky-400 ring-2 ring-sky-300 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{tpl.emoji}</span>
                      {tpl.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                          {tpl.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-snug">{tpl.name}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{tpl.tagline}</div>
                    </div>
                    <div className="text-[10px] font-semibold text-sky-700 flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span>{tpl.input.adults + tpl.input.kids} guests</span>
                      <span>Est. ${tpl.input.targetBudget}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Event Details Configuration Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Event Details & Logistics</span>
            </h2>

            {/* Event Type Select */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Party Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EVENT_TYPE_PRESETS.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleEventTypeSelect(type.id, type.defaultTheme)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold text-left transition-all border ${
                      formData.eventType === type.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Party Title & Theme Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="input-party-title" className="block text-xs font-bold text-slate-800">
                  Party Title
                </label>
                <input
                  id="input-party-title"
                  type="text"
                  placeholder="e.g., Summer Sunset Soirée or Alex's 30th Birthday"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="input-party-theme" className="block text-xs font-bold text-slate-800">
                  Theme / Occasion
                </label>
                <input
                  id="input-party-theme"
                  type="text"
                  placeholder="e.g., Spanish Tapas, Neon Space, Rustic BBQ"
                  value={formData.theme}
                  onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Numbers: Guests, Drinkers, Hours, Budget */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <label htmlFor="input-adults" className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-sky-600" />
                  <span>Adult Guests</span>
                </label>
                <input
                  id="input-adults"
                  type="number"
                  min={1}
                  max={200}
                  value={formData.adults}
                  onChange={(e) => {
                    const val = Math.max(1, parseInt(e.target.value) || 1);
                    setFormData(prev => ({
                      ...prev,
                      adults: val,
                      drinkers: Math.min(prev.drinkers, val)
                    }));
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <label htmlFor="input-kids" className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kids</span>
                </label>
                <input
                  id="input-kids"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.kids}
                  onChange={(e) => setFormData(prev => ({ ...prev, kids: Math.max(0, parseInt(e.target.value) || 0) }))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <label htmlFor="input-drinkers" className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Wine className="w-3.5 h-3.5 text-purple-600" />
                  <span>Alcohol Drinkers</span>
                </label>
                <input
                  id="input-drinkers"
                  type="number"
                  min={0}
                  max={formData.adults}
                  value={formData.drinkers}
                  onChange={(e) => setFormData(prev => ({ ...prev, drinkers: Math.min(formData.adults, Math.max(0, parseInt(e.target.value) || 0)) }))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <label htmlFor="input-budget" className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Target Budget ($)</span>
                </label>
                <input
                  id="input-budget"
                  type="number"
                  min={20}
                  max={10000}
                  step={10}
                  value={formData.targetBudget}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetBudget: Math.max(20, parseInt(e.target.value) || 50) }))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-emerald-700"
                />
              </div>
            </div>

            {/* Venue & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-600" />
                  <span>Venue Setting</span>
                </label>
                <select
                  value={formData.venue}
                  onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value as any }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                >
                  <option value="indoor-home">Indoor Home / Living Room & Kitchen</option>
                  <option value="backyard">Backyard / Patio / Grill Area</option>
                  <option value="park">Public Park / Outdoor Pavilion</option>
                  <option value="rented-venue">Rented Event Hall / Clubroom</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="input-event-date" className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-600" />
                  <span>Event Date (Optional)</span>
                </label>
                <input
                  id="input-event-date"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                />
              </div>
            </div>

            {/* Dietary Tags */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Dietary Restrictions & Allergies</span>
              </label>
              <div className="flex flex-wrap gap-2">
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

            {/* Special Requests */}
            <div className="space-y-1.5">
              <label htmlFor="input-special-requests" className="block text-xs font-bold text-slate-800">
                Special Requests / Specific Menu Ideas
              </label>
              <textarea
                id="input-special-requests"
                rows={2}
                placeholder="e.g., Include two signature sangria pitchers, artisanal charcuterie, gluten-free crackers, and ambient party lighting..."
                value={formData.specialRequests}
                onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
              />
            </div>

            {/* Submit Primary CTA */}
            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                id="create-shopping-plan-btn"
                disabled={isGenerating}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-98"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Calculating Ratios & Curating CymbalMart List...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>Create My Shopping Plan</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
