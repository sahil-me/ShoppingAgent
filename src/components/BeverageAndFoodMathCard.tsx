import React, { useState } from 'react';
import { PartyPlan } from '../types';
import { 
  Wine, 
  Beer, 
  GlassWater, 
  Sparkles, 
  Utensils, 
  Info, 
  Calculator, 
  Plus, 
  Minus,
  Check
} from 'lucide-react';

interface BeverageAndFoodMathCardProps {
  plan: PartyPlan;
  onUpdatePlanMetrics?: (drinkers: number, duration: number, totalGuests: number) => void;
}

export const BeverageAndFoodMathCard: React.FC<BeverageAndFoodMathCardProps> = ({
  plan,
  onUpdatePlanMetrics
}) => {
  const [activeTab, setActiveTab] = useState<'drinks' | 'food'>('drinks');
  const [simDrinkers, setSimDrinkers] = useState(plan.guestCount.drinkers || 10);
  const [simDuration, setSimDuration] = useState(plan.durationHours || 4);
  const [simTotalGuests, setSimTotalGuests] = useState(plan.guestCount.total || 14);

  // Dynamic formula calculation
  // Formula: 2 drinks per drinker first hour, 1 drink per hour thereafter
  const simTotalAlcoholicDrinks = Math.round(simDrinkers * (1 + simDuration));
  const simNonDrinkers = Math.max(0, simTotalGuests - simDrinkers);
  const simNonAlcoholicDrinks = Math.round(simNonDrinkers * (simDuration * 1.2) + (simDrinkers * simDuration * 0.5));
  
  // Standard split: 45% wine, 40% beer, 15% liquor / cocktails (or customizable)
  const wineGlasses = Math.round(simTotalAlcoholicDrinks * 0.45);
  const wineBottles = Math.ceil(wineGlasses / 5); // 5 glasses per 750ml bottle
  
  const beerCans = Math.round(simTotalAlcoholicDrinks * 0.40);
  const beerPacks = Math.ceil(beerCans / 24); // 24-can cases
  
  const spiritDrinks = Math.round(simTotalAlcoholicDrinks * 0.15);
  const liquorBottles = Math.ceil(spiritDrinks / 16); // 16 standard 1.5oz shots per 750ml bottle
  
  const icePounds = Math.round(simTotalGuests * 1.5);
  const waterGallons = Math.ceil((simTotalGuests * simDuration * 8) / 128); // 8 oz water/hr/person

  // Food formula
  const appBitesPerPerson = plan.foodCalc?.appetizerBitesPerPerson || 8;
  const totalBites = simTotalGuests * appBitesPerPerson;
  const totalMeatLbs = Math.round((simTotalGuests * 0.4) * 10) / 10; // ~6.4 oz protein/person

  return (
    <div id="beverage-food-math-card" className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
      {/* Header with Selector */}
      <div className="p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-700" />
            <h2 className="text-base font-bold text-slate-900">
              Party Math & Consumption Engine
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Automated host portion formulas for {plan.title}
          </p>
        </div>

        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl self-start sm:self-auto">
          <button
            id="tab-drink-calc"
            onClick={() => setActiveTab('drinks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'drinks'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wine className="w-3.5 h-3.5 text-purple-600" />
            <span>Bar & Drinks Calculator</span>
          </button>
          <button
            id="tab-food-calc"
            onClick={() => setActiveTab('food')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'food'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-emerald-600" />
            <span>Food & Portions Engine</span>
          </button>
        </div>
      </div>

      {/* Simulator Controls */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/60 flex flex-wrap items-center gap-4 sm:gap-8 text-xs">
        <span className="font-semibold text-slate-700 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          Interactive Sim:
        </span>

        {/* Total Guests */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Total Guests:</span>
          <div className="flex items-center bg-white border border-slate-200 rounded-md">
            <button
              onClick={() => setSimTotalGuests(Math.max(2, simTotalGuests - 1))}
              className="p-1 hover:bg-slate-100 text-slate-600"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 font-bold text-slate-800">{simTotalGuests}</span>
            <button
              onClick={() => setSimTotalGuests(simTotalGuests + 1)}
              className="p-1 hover:bg-slate-100 text-slate-600"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Drinkers */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Drinkers:</span>
          <div className="flex items-center bg-white border border-slate-200 rounded-md">
            <button
              onClick={() => setSimDrinkers(Math.max(0, simDrinkers - 1))}
              className="p-1 hover:bg-slate-100 text-slate-600"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 font-bold text-slate-800">{simDrinkers}</span>
            <button
              onClick={() => setSimDrinkers(Math.min(simTotalGuests, simDrinkers + 1))}
              className="p-1 hover:bg-slate-100 text-slate-600"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Party Length:</span>
          <div className="flex items-center bg-white border border-slate-200 rounded-md">
            <button
              onClick={() => setSimDuration(Math.max(1, simDuration - 1))}
              className="p-1 hover:bg-slate-100 text-slate-600"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 font-bold text-slate-800">{simDuration} hrs</span>
            <button
              onClick={() => setSimDuration(simDuration + 1)}
              className="p-1 hover:bg-slate-100 text-slate-600"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Beverage Engine */}
      {activeTab === 'drinks' && (
        <div className="p-5 space-y-6">
          {/* Formula Explanation Card */}
          <div className="bg-purple-50/50 border border-purple-200/70 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700 shrink-0">
              <Wine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-purple-950">
                The Golden Bar Formula: 2 Drinks in Hour 1 + 1 Drink / Hour After
              </h3>
              <p className="text-xs text-purple-900/80 mt-1 leading-relaxed">
                For {simDrinkers} drinkers over {simDuration} hours, you need approximately{' '}
                <strong className="text-purple-950">{simTotalAlcoholicDrinks} total alcoholic servings</strong>, plus{' '}
                <strong className="text-purple-950">{simNonAlcoholicDrinks} non-alcoholic & hydration servings</strong> for non-drinkers and pacing.
              </p>
            </div>
          </div>

          {/* Bar Bottle Quantities Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* Wine */}
            <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-purple-700 mb-1">
                  <Wine className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 px-1.5 py-0.5 rounded">45% Share</span>
                </div>
                <div className="text-2xl font-black text-slate-900">{wineBottles}</div>
                <div className="text-xs font-semibold text-slate-700">Wine Bottles (750ml)</div>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-purple-100">
                ~{wineGlasses} glasses (3 red, {Math.max(1, wineBottles - 3)} white/sparkling)
              </div>
            </div>

            {/* Beer */}
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-amber-700 mb-1">
                  <Beer className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 px-1.5 py-0.5 rounded">40% Share</span>
                </div>
                <div className="text-2xl font-black text-slate-900">{beerCans}</div>
                <div className="text-xs font-semibold text-slate-700">Beer / Seltzers</div>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-amber-100">
                ~{beerPacks} case (24-pack) or craft 6-packs
              </div>
            </div>

            {/* Spirits */}
            <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-indigo-700 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 px-1.5 py-0.5 rounded">15% Share</span>
                </div>
                <div className="text-2xl font-black text-slate-900">{liquorBottles}</div>
                <div className="text-xs font-semibold text-slate-700">Spirits / Batch Base</div>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-indigo-100">
                ~{spiritDrinks} cocktails (16 drinks/750ml)
              </div>
            </div>

            {/* Ice */}
            <div className="p-3.5 rounded-xl border border-cyan-200 bg-cyan-50/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-cyan-700 mb-1">
                  <GlassWater className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-100 px-1.5 py-0.5 rounded">Crucial</span>
                </div>
                <div className="text-2xl font-black text-slate-900">{icePounds} <span className="text-sm font-semibold text-slate-500">lbs</span></div>
                <div className="text-xs font-semibold text-slate-700">Ice Required</div>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-cyan-100">
                1.5 lbs/guest (drink ice + cooler chilling)
              </div>
            </div>

            {/* Hydration */}
            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-blue-700 mb-1">
                  <GlassWater className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 px-1.5 py-0.5 rounded">Hydration</span>
                </div>
                <div className="text-2xl font-black text-slate-900">{waterGallons} <span className="text-sm font-semibold text-slate-500">gal</span></div>
                <div className="text-xs font-semibold text-slate-700">Water / Soft Drinks</div>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-blue-100">
                ~{Math.round(waterGallons * 3.8)} liters + flavored seltzers
              </div>
            </div>
          </div>

          {/* Pro-Tips from the Agent */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Bar Host Essentials:
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li>Plan for <strong>1.5 to 2 cups/glasses per guest</strong>, as people frequently misplace their drink between chats.</li>
              <li>Always have 2 designated ice buckets: one with a scoop for clean drink ice, and one for bottle chilling.</li>
              <li>Offer a signature batch mocktail so non-drinkers and designated drivers feel equally celebrated.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Food Engine */}
      {activeTab === 'food' && (
        <div className="p-5 space-y-6">
          {/* Vibe Notes Card */}
          <div className="bg-emerald-50/50 border border-emerald-200/70 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Portion Planning: {plan.eventType.toUpperCase()} Style
              </h3>
              <p className="text-xs text-emerald-900/80 mt-1 leading-relaxed">
                {plan.foodCalc?.foodVibeNotes || 'Portions calculated to keep guests happily satiated with zero food waste.'}
              </p>
            </div>
          </div>

          {/* Food Matrix Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">Appetizer Bites</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{totalBites}</div>
                <div className="text-xs font-semibold text-slate-700">Total Pieces</div>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200">
                ~{appBitesPerPerson} pieces / guest
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">Protein / Mains</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{totalMeatLbs} <span className="text-sm font-semibold text-slate-500">lbs</span></div>
                <div className="text-xs font-semibold text-slate-700">Meat / Plant Base</div>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200">
                ~6 oz per adult, 4 oz per child
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">Side Dishes</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{simTotalGuests * 2}</div>
                <div className="text-xs font-semibold text-slate-700">Total Side Servings</div>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200">
                2-3 variety options (carbs, greens, salads)
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">Dessert Bites</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{simTotalGuests * 1.5}</div>
                <div className="text-xs font-semibold text-slate-700">Sweet Portions</div>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200">
                Finger-friendly pastries or cake slices
              </div>
            </div>
          </div>

          {/* Timeline Milestones */}
          {plan.timeline && plan.timeline.length > 0 && (
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Preparation & Kitchen Timeline
              </h4>
              <div className="space-y-2.5">
                {plan.timeline.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 shrink-0 w-28 text-center">
                      {event.timeframe}
                    </span>
                    <span className="text-slate-700 leading-relaxed">
                      {event.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
