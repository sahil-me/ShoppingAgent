import React, { useState } from 'react';
import { PartyPlan, UserPreferences } from '../types';
import { 
  Sparkles, 
  PlusCircle, 
  Layers, 
  Share2, 
  ShoppingBag, 
  UtensilsCrossed, 
  CheckSquare, 
  BotMessageSquare,
  DollarSign,
  Users,
  Clock,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Calendar,
  Mic,
  Bookmark,
  RotateCcw,
  Settings,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  plan: PartyPlan | null;
  activeTab: 'shopping' | 'calculations' | 'recipes' | 'store-run';
  setActiveTab: (tab: 'shopping' | 'calculations' | 'recipes' | 'store-run') => void;
  onOpenWizard: () => void;
  onOpenExport: () => void;
  onOpenOptimize: () => void;
  onOpenAlignBudget: () => void;
  onOpenCheckout: () => void;
  onStartNewPlan: () => void;
  onOpenSavedPlans: () => void;
  onSaveCurrentPlan?: () => void;
  onOpenPreferences: () => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  userPreferences?: UserPreferences;
  onSwitchUser?: (userId: string, userName: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  plan,
  activeTab,
  setActiveTab,
  onOpenWizard,
  onOpenExport,
  onOpenOptimize,
  onOpenAlignBudget,
  onOpenCheckout,
  onStartNewPlan,
  onOpenSavedPlans,
  onSaveCurrentPlan,
  onOpenPreferences,
  isChatOpen,
  setIsChatOpen,
  userPreferences,
  onSwitchUser
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const totalCost = plan?.items.reduce((acc, item) => acc + (item.estimatedCost || 0), 0) || 0;
  const purchasedCount = plan?.items.filter(i => i.purchased).length || 0;
  const targetBudget = plan?.targetBudget || 200;
  const diff = targetBudget - totalCost;
  const isOverBudget = diff < 0;

  return (
    <header id="main-header" className="bg-slate-900 text-white sticky top-0 z-30 shadow-md border-b border-slate-800">
      {/* CUJ Step Progress & Account Bar */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 sm:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-sky-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
              CYMBALMART
            </span>
            <span className="text-slate-300 font-semibold hidden sm:inline">
              Party Planner Shopping Agent
            </span>
          </div>

          {/* 3-Step CUJ Journey Trackers when a plan is active */}
          {plan ? (
            <div className="flex items-center gap-1 sm:gap-2 text-[11px]">
              <button
                onClick={onOpenWizard}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/90 text-sky-300 hover:bg-slate-800 transition-colors font-medium border border-sky-500/30"
                title="Task 1: Define party type, theme, budget, guest count"
              >
                <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-300 font-bold flex items-center justify-center text-[10px]">1</span>
                <span>Define Event</span>
              </button>

              <span className="text-slate-600">→</span>

              <button
                onClick={onOpenAlignBudget}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/90 text-emerald-300 hover:bg-slate-800 transition-colors font-medium border border-emerald-500/30"
                title="Task 2: Align items with total budget"
              >
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-[10px]">2</span>
                <span>Review & Align Budget</span>
              </button>

              <span className="text-slate-600">→</span>

              <button
                onClick={onOpenCheckout}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-600 text-white hover:bg-sky-500 transition-colors font-bold shadow-xs"
                title="Task 3: Adjust constraints & finalize checkout"
              >
                <span className="w-4 h-4 rounded-full bg-white/20 text-white font-bold flex items-center justify-center text-[10px]">3</span>
                <span>Refine & Checkout</span>
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-sky-300 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 1: Define your event to generate curated cart & formulas</span>
            </div>
          )}

          {/* User Account & Preference Trigger */}
          <div className="relative flex items-center gap-2">
            <button
              type="button"
              id="header-user-menu-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <div className="w-4 h-4 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center text-[9px] font-bold">
                {userPreferences?.userName ? userPreferences.userName.charAt(0).toUpperCase() : 'G'}
              </div>
              <span className="max-w-[100px] truncate">{userPreferences?.userName || 'Guest User'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div 
                className="absolute right-0 top-full mt-1 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="p-2 border-b border-slate-800 text-slate-400 text-[11px]">
                  Signed in as <strong className="text-white">{userPreferences?.userName || 'Guest'}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onOpenPreferences();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-xl text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                >
                  <Settings className="w-4 h-4 text-sky-400" />
                  <span>Dietary & Account Preferences</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onOpenSavedPlans();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-xl text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                >
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>My Saved Plans</span>
                </button>

                {onSwitchUser && (
                  <div className="pt-1 border-t border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-500 px-2 uppercase font-bold">Switch Profile</div>
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchUser('student-01', 'Host (Student 01)');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 text-[11px]"
                    >
                      👤 Student Host Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchUser('guest', 'Guest Host');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 text-[11px]"
                    >
                      👥 Guest Profile
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar with Brand, Party Info, and Action Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Active Party Title & Quick Details (or Brand Header if No Plan) */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-sm shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {plan ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-sky-400 font-medium">
                  {plan.theme}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">
                  {plan.guestCount.total} guests ({plan.guestCount.adults} adults, {plan.guestCount.kids} kids)
                </span>
                {plan.eventDate && (
                  <>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <span className="text-xs font-semibold text-amber-300 hidden sm:flex items-center gap-1 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-md">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{plan.eventDate}</span>
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-base sm:text-lg font-black text-white leading-tight truncate max-w-md sm:max-w-xl">
                {plan.title}
              </h1>
            </div>
          ) : (
            <div>
              <div className="text-xs text-sky-400 font-medium">
                AI Shopping Assistant
              </div>
              <h1 className="text-base sm:text-lg font-black text-white leading-tight">
                Plan Your Party & Optimize CymbalMart Shopping
              </h1>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {plan && (
            <>
              {/* Budget status badge */}
              <button
                onClick={onOpenAlignBudget}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isOverBudget 
                    ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 hover:bg-rose-900' 
                    : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900'
                }`}
                title="Click to auto-align budget"
              >
                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                <span>${Math.round(totalCost)} / ${targetBudget}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${isOverBudget ? 'bg-rose-500 text-white' : 'bg-emerald-500/30 text-emerald-200'}`}>
                  {isOverBudget ? `+$${Math.abs(diff).toFixed(0)} over` : `-$${diff.toFixed(0)} buffer`}
                </span>
              </button>

              {/* Align Budget Quick CTA */}
              <button
                onClick={onOpenAlignBudget}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 rounded-xl transition-colors border border-emerald-500/40 flex items-center gap-1.5"
                title="Auto-align with target budget"
              >
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Align Budget</span>
              </button>

              {/* Save Plan Button */}
              {onSaveCurrentPlan && (
                <button
                  id="header-save-plan-btn"
                  onClick={onSaveCurrentPlan}
                  className="px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 rounded-xl transition-colors border border-amber-500/40 flex items-center gap-1.5"
                  title="Save this plan to your account"
                >
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Save Plan</span>
                </button>
              )}

              {/* Export / Share */}
              <button
                id="header-export-btn"
                onClick={onOpenExport}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5"
                title="Export or Print Shopping List"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {/* 1-Click CymbalMart Checkout */}
              <button
                id="header-checkout-btn"
                onClick={onOpenCheckout}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                title="Refine & Checkout via CymbalMart Express"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Checkout ({plan.items.length})</span>
              </button>
            </>
          )}

          {/* Start New Plan / Fresh Session CTA */}
          <button
            id="header-start-new-plan-btn"
            onClick={onStartNewPlan}
            className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 flex items-center gap-1.5"
            title="Start a fresh party plan"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
            <span>{plan ? 'Start Fresh' : 'Plan Event'}</span>
          </button>

          {/* Saved Plans */}
          <button
            id="header-saved-plans-btn"
            onClick={onOpenSavedPlans}
            className="px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl transition-colors border border-amber-500/30 flex items-center gap-1.5"
            title="View saved party plans"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">My Plans</span>
          </button>

          {/* AI Chat Drawer Toggle */}
          <button
            id="header-toggle-agent-chat-btn"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 border ${
              isChatOpen 
                ? 'bg-sky-400 text-slate-950 border-sky-300 shadow-xs font-bold' 
                : 'bg-sky-500/15 text-sky-300 border-sky-500/40 hover:bg-sky-500/25'
            }`}
          >
            <BotMessageSquare className="w-3.5 h-3.5" />
            <span>Agent Assistant</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs when Plan is Active */}
      {plan && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/80 pt-1">
          <button
            id="nav-tab-shopping"
            onClick={() => setActiveTab('shopping')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'shopping'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Curated Shopping List ({plan.items.length})</span>
          </button>

          <button
            id="nav-tab-calculations"
            onClick={() => setActiveTab('calculations')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'calculations'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Formulas & Calculations</span>
          </button>

          <button
            id="nav-tab-recipes"
            onClick={() => setActiveTab('recipes')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'recipes'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Batch Recipes ({plan.signatureRecipes?.length || 0})</span>
          </button>

          <button
            id="nav-tab-store-run"
            onClick={() => setActiveTab('store-run')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'store-run'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Aisle & In-Store Mode</span>
            {purchasedCount > 0 && (
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold border border-emerald-500/40">
                {purchasedCount}/{plan.items.length}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
