import React, { useState, useEffect } from 'react';
import { 
  PartyPlan, 
  PartyFormInput, 
  ShoppingItem, 
  ChatMessage, 
  CheckoutOrderDetails,
  UserPreferences,
  SavedPlanSummary
} from './types';
import { PARTY_TEMPLATES } from './data/templates';
import { Header } from './components/Header';
import { PartyCreationHero } from './components/PartyCreationHero';
import { BudgetOverviewCard } from './components/BudgetOverviewCard';
import { BeverageAndFoodMathCard } from './components/BeverageAndFoodMathCard';
import { ShoppingListView } from './components/ShoppingListView';
import { BatchRecipesView } from './components/BatchRecipesView';
import { StoreRunChecklist } from './components/StoreRunChecklist';
import { UnifiedAgentAssistant } from './components/UnifiedAgentAssistant';
import { PartySetupModal } from './components/PartySetupModal';
import { SubstitutionModal } from './components/SubstitutionModal';
import { OptimizationModal } from './components/OptimizationModal';
import { ExportModal } from './components/ExportModal';
import { ItemFormModal } from './components/ItemFormModal';
import { AutoAlignBudgetModal } from './components/AutoAlignBudgetModal';
import { CymbalCheckoutModal } from './components/CymbalCheckoutModal';
import { EventDateNotifier } from './components/EventDateNotifier';
import { ResetPlanConfirmModal } from './components/ResetPlanConfirmModal';
import { SavedPlansModal } from './components/SavedPlansModal';
import { UserPreferencesModal } from './components/UserPreferencesModal';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { AlertCircle } from 'lucide-react';

const SAVED_PLANS_KEY = 'cymbal_saved_plans_v2';
const USER_PREFS_KEY = 'cymbal_user_preferences_v2';
const COOKIE_CONSENT_KEY = 'cymbal_cookie_consent_v2';

const DEFAULT_USER_PREFS: UserPreferences = {
  userId: 'host-default',
  userName: 'Party Host',
  dietaryRestrictions: [],
  preferredCurrency: 'USD',
  preferredLanguage: 'en-US',
  accessibility: {
    highContrast: false,
    largeFont: false,
    speechFeedback: true
  },
  cookieConsent: {
    accepted: false
  }
};

export default function App() {
  // 1. Session Plan State - starts null for a clean fresh session
  const [plan, setPlan] = useState<PartyPlan | null>(null);

  // 2. Persistent User Preferences State
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(USER_PREFS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse user preferences', e);
    }
    return DEFAULT_USER_PREFS;
  });

  // 3. Persistent Saved Plans List
  const [savedPlans, setSavedPlans] = useState<SavedPlanSummary[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_PLANS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved plans', e);
    }
    return [];
  });

  // 4. Cookie Consent
  const [hasAcceptedCookies, setHasAcceptedCookies] = useState<boolean>(() => {
    try {
      return localStorage.getItem(COOKIE_CONSENT_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState<'shopping' | 'calculations' | 'recipes' | 'store-run'>('shopping');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modals
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isOptimizeOpen, setIsOptimizeOpen] = useState<boolean>(false);
  const [isAlignBudgetOpen, setIsAlignBudgetOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isSavedPlansModalOpen, setIsSavedPlansModalOpen] = useState<boolean>(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState<boolean>(false);
  
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [substitutingItem, setSubstitutingItem] = useState<ShoppingItem | null>(null);
  const [lastOrderDetails, setLastOrderDetails] = useState<CheckoutOrderDetails | null>(null);

  // Unified Agent Assistant (Chat + Voice)
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'fresh-welcome-msg',
      sender: 'agent',
      text: `✨ **Hello! I'm your CymbalMart Party Planner Shopping Agent.**\n\nI'm waiting for your party instructions to calculate beverage formulas, balance your budget, and build your store-ready shopping list.\n\n• **Step 1:** Define your party type, theme, guest count, and budget.\n• **Step 2:** I will curate items, store brands, and portions.\n• **Step 3:** Refine items hands-free or with 1-click checkout.\n\nHow can I help plan your event today?`,
      timestamp: new Date().toISOString()
    }
  ]);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Persist User Preferences
  useEffect(() => {
    try {
      localStorage.setItem(USER_PREFS_KEY, JSON.stringify(userPreferences));
    } catch (e) {
      console.error(e);
    }
  }, [userPreferences]);

  // Persist Saved Plans
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(savedPlans));
    } catch (e) {
      console.error(e);
    }
  }, [savedPlans]);

  const handleAcceptCookies = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
      setHasAcceptedCookies(true);
    } catch (e) {
      setHasAcceptedCookies(true);
    }
  };

  // Generate a full new plan from server AI
  const handleGeneratePlan = async (input: PartyFormInput) => {
    setIsGenerating(true);
    setGlobalError(null);

    // Incorporate persistent dietary preferences if not already set
    const mergedDietary = Array.from(new Set([
      ...(input.dietaryRestrictions || []),
      ...userPreferences.dietaryRestrictions
    ]));

    const payload: PartyFormInput = {
      ...input,
      dietaryRestrictions: mergedDietary
    };

    try {
      const res = await fetch('/api/plan-party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to generate party plan');
      }

      const newPlan: PartyPlan = await res.json();
      setPlan(newPlan);
      setIsWizardOpen(false);
      setSelectedCategory('all');
      setActiveTab('shopping');

      // Update chat with fresh context
      setChatHistory([
        {
          id: `plan-ready-${Date.now()}`,
          sender: 'agent',
          text: `🎉 **${newPlan.title}** plan is ready!\n\n• **Guests:** ${newPlan.guestCount.total} (${newPlan.guestCount.adults} adults, ${newPlan.guestCount.kids} kids)\n• **Estimated Cost:** $${newPlan.items.reduce((a, b) => a + (b.estimatedCost || 0), 0).toFixed(2)} (Target Budget: $${newPlan.targetBudget})\n• **Shopping Items:** ${newPlan.items.length} curated CymbalMart items\n\n${newPlan.agentSummary || ''}\n\nReview your list below or ask me anything to refine quantities, store brands, or formulas!`,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setGlobalError(err.message || 'Error generating plan with AI');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save active plan to Saved Plans
  const handleSaveActivePlan = (customTitle?: string) => {
    if (!plan) return;
    const title = customTitle || plan.title;
    const totalCost = plan.items.reduce((a, b) => a + (b.estimatedCost || 0), 0);
    
    const summary: SavedPlanSummary = {
      id: `plan-${Date.now()}`,
      title,
      eventType: plan.eventType,
      theme: plan.theme,
      guestCount: plan.guestCount.total,
      totalCost,
      targetBudget: plan.targetBudget,
      itemCount: plan.items.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      planData: {
        ...plan,
        title
      }
    };

    setSavedPlans(prev => [summary, ...prev.filter(p => p.id !== summary.id)]);
  };

  // Load a plan from saved plans or template
  const handleLoadPlan = (loadedPlan: PartyPlan) => {
    setPlan(loadedPlan);
    setSelectedCategory('all');
    setActiveTab('shopping');
    setChatHistory([
      {
        id: `loaded-${Date.now()}`,
        sender: 'agent',
        text: `📂 Loaded **${loadedPlan.title}** with ${loadedPlan.items.length} shopping items and beverage formulas ready.`,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  // Start fresh plan flow (with reset confirmation if active plan exists)
  const handleStartNewPlanClick = () => {
    if (plan) {
      setIsResetModalOpen(true);
    } else {
      setIsWizardOpen(true);
    }
  };

  const handleConfirmReset = () => {
    setPlan(null);
    setIsResetModalOpen(false);
    setIsWizardOpen(true);
    setSelectedCategory('all');
    setActiveTab('shopping');
  };

  const handleSaveAndReset = () => {
    if (plan) {
      handleSaveActivePlan();
    }
    setPlan(null);
    setIsResetModalOpen(false);
    setIsWizardOpen(true);
    setSelectedCategory('all');
    setActiveTab('shopping');
  };

  // Send message to AI Agent
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          currentPlan: plan,
          chatHistory: chatHistory.slice(-6)
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Agent encountered a temporary issue');
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: data.text,
        timestamp: new Date().toISOString(),
        suggestedAction: data.suggestedAction
      };

      setChatHistory(prev => [...prev, agentMsg]);
    } catch (err: any) {
      console.error(err);
      setChatHistory(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'agent',
          text: `⚠️ I encountered an issue processing your request: ${err.message}. Please try again.`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Apply suggested action from chat (e.g. adding items or aligning budget)
  const handleApplyAgentAction = (action: any) => {
    if (!plan) return;
    if (action.type === 'add_items' && Array.isArray(action.items)) {
      const newItems: ShoppingItem[] = action.items.map((it: any, idx: number) => ({
        id: `agent-item-${Date.now()}-${idx}`,
        name: it.name,
        category: it.category || 'groceries',
        quantity: Number(it.quantity) || 1,
        unit: it.unit || 'pack',
        estimatedCost: Number(it.estimatedCost) || 0,
        store: it.store || 'CymbalMart Supercenter',
        aisle: it.aisle || 'Aisle 1: General Grocery',
        brandTier: it.brandTier || 'Cymbal Select',
        priority: it.priority || 'recommended',
        purchased: false,
        notes: it.notes || 'Added by AI Shopping Agent'
      }));

      setPlan(prev => prev ? ({
        ...prev,
        items: [...prev.items, ...newItems]
      }) : null);

      setChatHistory(prev => [
        ...prev,
        {
          id: `applied-${Date.now()}`,
          sender: 'agent',
          text: `✅ Added **${newItems.length} items** (${newItems.map(i => i.name).join(', ')}) to your CymbalMart cart list!`,
          timestamp: new Date().toISOString()
        }
      ]);
    } else if (action.type === 'align_budget') {
      setIsAlignBudgetOpen(true);
    }
  };

  // Toggle single item purchased state
  const handleTogglePurchased = (itemId: string) => {
    if (!plan) return;
    setPlan(prev => prev ? ({
      ...prev,
      items: prev.items.map(it => 
        it.id === itemId ? { ...it, purchased: !it.purchased } : it
      )
    }) : null);
  };

  // Update an existing item or add if new
  const handleUpdateItem = (updated: ShoppingItem) => {
    if (!plan) return;
    setPlan(prev => {
      if (!prev) return null;
      const exists = prev.items.some(it => it.id === updated.id);
      return {
        ...prev,
        items: exists 
          ? prev.items.map(it => it.id === updated.id ? updated : it)
          : [...prev.items, updated]
      };
    });
  };

  // Update target budget directly
  const handleUpdateTargetBudget = (newBudget: number) => {
    if (!plan) return;
    setPlan(prev => prev ? ({
      ...prev,
      targetBudget: Math.max(1, newBudget)
    }) : null);
  };

  // Delete item
  const handleDeleteItem = (itemId: string) => {
    if (!plan) return;
    setPlan(prev => prev ? ({
      ...prev,
      items: prev.items.filter(it => it.id !== itemId)
    }) : null);
  };

  // Add / Save custom item from modal
  const handleSaveItem = (itemData: Partial<ShoppingItem>) => {
    if (!plan) return;
    if (itemData.id) {
      setPlan(prev => prev ? ({
        ...prev,
        items: prev.items.map(it => it.id === itemData.id ? { ...it, ...itemData } as ShoppingItem : it)
      }) : null);
    } else {
      const newItem: ShoppingItem = {
        id: `custom-item-${Date.now()}`,
        name: itemData.name || 'New Item',
        category: itemData.category || 'groceries',
        quantity: itemData.quantity || 1,
        unit: itemData.unit || 'item',
        estimatedCost: itemData.estimatedCost || 0,
        store: itemData.store || 'CymbalMart Supercenter',
        aisle: itemData.aisle || 'Aisle 1: Grocery',
        brandTier: itemData.brandTier || 'Cymbal Select',
        priority: itemData.priority || 'recommended',
        purchased: false,
        notes: itemData.notes || '',
        dietaryTags: itemData.dietaryTags || []
      };
      setPlan(prev => prev ? ({
        ...prev,
        items: [...prev.items, newItem]
      }) : null);
    }
    setEditingItem(null);
  };

  // Add batch of items (e.g. from recipe sync)
  const handleAddItemsToList = (itemsToAdd: Partial<ShoppingItem>[]) => {
    if (!plan) return;
    const formatted: ShoppingItem[] = itemsToAdd.map((it, idx) => ({
      id: `recipe-item-${Date.now()}-${idx}`,
      name: it.name || 'Recipe Item',
      category: it.category || 'groceries',
      quantity: it.quantity || 1,
      unit: it.unit || 'item',
      estimatedCost: it.estimatedCost || 0,
      store: (it.store as any) || 'CymbalMart Supercenter',
      aisle: it.aisle || 'Aisle 1: Fresh Grocery',
      brandTier: 'Cymbal Select',
      priority: it.priority || 'must-have',
      purchased: false,
      notes: it.notes || ''
    }));

    setPlan(prev => prev ? ({
      ...prev,
      items: [...prev.items, ...formatted]
    }) : null);
  };

  // Apply substitution
  const handleApplySubstitution = (originalItemId: string, sub: any) => {
    if (!plan) return;
    setPlan(prev => prev ? ({
      ...prev,
      items: prev.items.map(it => {
        if (it.id === originalItemId) {
          return {
            ...it,
            name: sub.name,
            estimatedCost: sub.estimatedCost,
            originalCost: it.estimatedCost,
            store: sub.store || it.store,
            notes: `Substituted: ${sub.description}`,
            dietaryTags: sub.dietaryFit ? [sub.dietaryFit] : it.dietaryTags
          };
        }
        return it;
      })
    }) : null);

    setChatHistory(prev => [
      ...prev,
      {
        id: `sub-msg-${Date.now()}`,
        sender: 'agent',
        text: `✨ Substituted **${sub.name}** (Est. $${sub.estimatedCost.toFixed(2)}) into your CymbalMart cart.`,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  // Apply budget alignment swaps
  const handleApplyBudgetSwaps = (updatedItems: ShoppingItem[]) => {
    if (!plan) return;
    setPlan(prev => prev ? ({
      ...prev,
      items: updatedItems
    }) : null);

    const newTotal = updatedItems.reduce((acc, i) => acc + (i.estimatedCost || 0), 0);
    setChatHistory(prev => [
      ...prev,
      {
        id: `align-${Date.now()}`,
        sender: 'agent',
        text: `🎯 **Budget Aligned!** Applied Cymbal Select store brand and bulk value swaps. New total is **$${newTotal.toFixed(2)}** (Target Budget: $${plan.targetBudget}).`,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  // Bulk check/uncheck
  const handleBulkTogglePurchased = (markPurchased: boolean) => {
    if (!plan) return;
    setPlan(prev => prev ? ({
      ...prev,
      items: prev.items.map(it => {
        if (selectedCategory === 'all' || it.category === selectedCategory) {
          return { ...it, purchased: markPurchased };
        }
        return it;
      })
    }) : null);
  };

  // Update Event Date
  const handleUpdateEventDate = (newDate: string) => {
    if (!plan) return;
    setPlan(prev => prev ? ({
      ...prev,
      eventDate: newDate
    }) : null);
  };

  // Switch active user profile
  const handleSwitchUser = (userId: string, userName: string) => {
    setUserPreferences(prev => ({
      ...prev,
      userId,
      userName
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-sky-500/20">
      {/* Top Main Navigation Header with CUJ Step Indicator */}
      <Header
        plan={plan}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenOptimize={() => setIsOptimizeOpen(true)}
        onOpenAlignBudget={() => setIsAlignBudgetOpen(true)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onStartNewPlan={handleStartNewPlanClick}
        onOpenSavedPlans={() => setIsSavedPlansModalOpen(true)}
        onSaveCurrentPlan={plan ? () => handleSaveActivePlan() : undefined}
        onOpenPreferences={() => setIsPreferencesModalOpen(true)}
        isChatOpen={isAssistantOpen}
        setIsChatOpen={setIsAssistantOpen}
        userPreferences={userPreferences}
        onSwitchUser={handleSwitchUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Global Error Banner */}
        {globalError && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between text-xs text-rose-800 animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{globalError}</span>
            </div>
            <button
              onClick={() => setGlobalError(null)}
              className="text-rose-600 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. FRESH START / NO ACTIVE PLAN VIEW */}
        {!plan && (
          <PartyCreationHero
            onCreatePlan={handleGeneratePlan}
            savedPlans={savedPlans}
            onLoadSavedPlan={handleLoadPlan}
            onDeleteSavedPlan={(id) => setSavedPlans(prev => prev.filter(p => p.id !== id))}
            isGenerating={isGenerating}
            userDefaultDietary={userPreferences.dietaryRestrictions}
          />
        )}

        {/* 2. ACTIVE PLAN DASHBOARD VIEWS */}
        {plan && (
          <>
            {/* Approaching Event Date & Unpurchased Items Notification Toast */}
            <EventDateNotifier
              plan={plan}
              onNavigateToStoreRun={() => setActiveTab('store-run')}
              onBulkCheckPurchased={(purchased) => handleBulkTogglePurchased(purchased)}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              onUpdateEventDate={handleUpdateEventDate}
            />

            {/* Global Budget & CUJ Task 2 Alignment Tracker */}
            <BudgetOverviewCard
              plan={plan}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onOpenAlignBudget={() => setIsAlignBudgetOpen(true)}
              onUpdateBudget={handleUpdateTargetBudget}
            />

            {/* Tab Views */}
            {activeTab === 'shopping' && (
              <ShoppingListView
                plan={plan}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onTogglePurchased={handleTogglePurchased}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                onAddItem={() => {
                  setEditingItem(null);
                  setIsItemModalOpen(true);
                }}
                onEditItem={(item) => {
                  setEditingItem(item);
                  setIsItemModalOpen(true);
                }}
                onOpenSubstitution={(item) => setSubstitutingItem(item)}
                onBulkTogglePurchased={handleBulkTogglePurchased}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
                onOpenAlignBudget={() => setIsAlignBudgetOpen(true)}
              />
            )}

            {activeTab === 'calculations' && (
              <BeverageAndFoodMathCard plan={plan} />
            )}

            {activeTab === 'recipes' && (
              <BatchRecipesView
                plan={plan}
                onAddItemsToList={handleAddItemsToList}
              />
            )}

            {activeTab === 'store-run' && (
              <StoreRunChecklist
                plan={plan}
                onTogglePurchased={handleTogglePurchased}
                onUpdateEventDate={handleUpdateEventDate}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Unified Agent Assistant (AI Chat + Hands-Free Voice Control in ONE place) */}
      <UnifiedAgentAssistant
        plan={plan}
        activeTab={activeTab}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onTogglePurchased={handleTogglePurchased}
        onBulkTogglePurchased={handleBulkTogglePurchased}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onUpdateTargetBudget={handleUpdateTargetBudget}
        onOpenAlignBudget={() => setIsAlignBudgetOpen(true)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSubstitution={(item) => setSubstitutingItem(item)}
        onOpenAddItemModal={() => {
          setEditingItem(null);
          setIsItemModalOpen(true);
        }}
        chatHistory={chatHistory}
        onSendMessage={handleSendMessage}
        onApplyAction={handleApplyAgentAction}
        isChatLoading={isChatLoading}
        isOpen={isAssistantOpen}
        setIsOpen={setIsAssistantOpen}
      />

      {/* Task 1: Define Event Modal */}
      <PartySetupModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onGeneratePlan={handleGeneratePlan}
        onLoadTemplate={(tPlan) => {
          setPlan(tPlan);
          setIsWizardOpen(false);
        }}
        isGenerating={isGenerating}
      />

      {/* Task 2: Budget Alignment Modal */}
      {plan && (
        <AutoAlignBudgetModal
          isOpen={isAlignBudgetOpen}
          onClose={() => setIsAlignBudgetOpen(false)}
          plan={plan}
          onApplySwaps={handleApplyBudgetSwaps}
        />
      )}

      {/* Task 3: Refine & Checkout Modal */}
      {plan && (
        <CymbalCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          plan={plan}
          onOrderConfirmed={(details) => setLastOrderDetails(details)}
        />
      )}

      {/* Substitutions Modal */}
      {plan && (
        <SubstitutionModal
          isOpen={!!substitutingItem}
          onClose={() => setSubstitutingItem(null)}
          item={substitutingItem}
          plan={plan}
          onApplySubstitution={handleApplySubstitution}
        />
      )}

      {/* Route & Store Optimizer Modal */}
      {plan && (
        <OptimizationModal
          isOpen={isOptimizeOpen}
          onClose={() => setIsOptimizeOpen(false)}
          plan={plan}
        />
      )}

      {/* Export / Print Modal */}
      {plan && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          plan={plan}
        />
      )}

      {/* Custom Item Form Modal */}
      <ItemFormModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        onSaveItem={handleSaveItem}
        initialItem={editingItem}
      />

      {/* Start New Plan / Discard Active Confirmation Modal */}
      <ResetPlanConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
        onSaveAndReset={handleSaveAndReset}
        planTitle={plan?.title}
      />

      {/* Saved Plans Modal */}
      <SavedPlansModal
        isOpen={isSavedPlansModalOpen}
        onClose={() => setIsSavedPlansModalOpen(false)}
        savedPlans={savedPlans}
        currentPlan={plan}
        onSaveCurrentPlan={handleSaveActivePlan}
        onLoadPlan={handleLoadPlan}
        onDeletePlan={(planId) => setSavedPlans(prev => prev.filter(p => p.id !== planId))}
      />

      {/* User Preferences & Defaults Modal */}
      <UserPreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        preferences={userPreferences}
        onSavePreferences={(updated) => setUserPreferences(updated)}
      />

      {/* Cookie / Storage Consent Banner */}
      {!hasAcceptedCookies && (
        <CookieConsentBanner
          onAccept={handleAcceptCookies}
          onOpenPreferences={() => setIsPreferencesModalOpen(true)}
        />
      )}
    </div>
  );
}
