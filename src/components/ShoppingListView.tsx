import React, { useState, useMemo } from 'react';
import { PartyPlan, ShoppingItem, PartyCategory, StoreType } from '../types';
import { 
  Plus, 
  Search, 
  Store, 
  Filter, 
  Sparkles, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Circle, 
  ArrowUpDown, 
  Tag, 
  Check, 
  Layers,
  AlertCircle,
  TrendingDown,
  ShoppingBag,
  MapPin,
  Barcode,
  Minus,
  DollarSign,
  Zap,
  Calculator,
  CornerDownLeft,
  X,
  Scale,
  Award
} from 'lucide-react';
import { UnitConverterModal } from './UnitConverterModal';

interface ShoppingListViewProps {
  plan: PartyPlan;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onTogglePurchased: (itemId: string) => void;
  onUpdateItem: (item: ShoppingItem) => void;
  onDeleteItem: (itemId: string) => void;
  onAddItem: () => void;
  onEditItem?: (item: ShoppingItem) => void;
  onOpenSubstitution: (item: ShoppingItem) => void;
  onBulkTogglePurchased: (markPurchased: boolean) => void;
  onOpenCheckout?: () => void;
  onOpenAlignBudget?: () => void;
}

const STORE_COLORS: Record<string, string> = {
  'CymbalMart Supercenter': 'bg-sky-50 text-sky-800 border-sky-200',
  'CymbalMart Express': 'bg-teal-50 text-teal-800 border-teal-200',
  'Cymbal Spirits & Beverages': 'bg-purple-50 text-purple-800 border-purple-200',
  'Supermarket / Grocery': 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'Wholesale Club (Costco/Sam\'s)': 'bg-blue-50 text-blue-800 border-blue-200',
  'Liquor Store': 'bg-purple-50 text-purple-800 border-purple-200',
  'Party Supply / Dollar Store': 'bg-amber-50 text-amber-800 border-amber-200',
  'Bakery': 'bg-orange-50 text-orange-800 border-orange-200',
  'Online / Amazon': 'bg-indigo-50 text-indigo-800 border-indigo-200',
  'Specialty / Farmers Market': 'bg-teal-50 text-teal-800 border-teal-200'
};

const CATEGORY_NAMES: Record<PartyCategory, string> = {
  groceries: '🛒 Produce, Deli & Fresh Groceries',
  beverages: '🍹 Beverages, Beer, Wine & Spirits',
  bakery: '🧁 In-Store Bakery & Desserts',
  decor: '🎈 Party Decor, Themes & Lighting',
  tableware: '🍽️ Tableware, Cutlery & Paper Goods',
  entertainment: '🎲 Games, Favors & Entertainment',
  essentials: '🧊 Essentials, Trash Bags & Ice'
};

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  plan,
  selectedCategory,
  onSelectCategory,
  onTogglePurchased,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onEditItem,
  onOpenSubstitution,
  onBulkTogglePurchased,
  onOpenCheckout,
  onOpenAlignBudget
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'purchased'>('all');
  const [groupBy, setGroupBy] = useState<'category' | 'aisle' | 'store' | 'none'>('category');
  const [sortBy, setSortBy] = useState<'default' | 'price-desc' | 'price-asc' | 'priority'>('default');

  // Quick inline add state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickCategory, setQuickCategory] = useState<PartyCategory>('groceries');
  const [quickQuantity, setQuickQuantity] = useState(1);
  const [quickUnit, setQuickUnit] = useState('pack');
  const [quickPrice, setQuickPrice] = useState(6.99);

  // Inline price editing state
  const [editingPriceItemId, setEditingPriceItemId] = useState<string | null>(null);
  const [tempPriceValue, setTempPriceValue] = useState<string>('');

  // Notification / Highlight of live recalculations
  const [lastRecalcMessage, setLastRecalcMessage] = useState<string | null>(null);
  
  // Unit Converter Modal state
  const [isConverterOpen, setIsConverterOpen] = useState<boolean>(false);
  const [converterTargetItem, setConverterTargetItem] = useState<ShoppingItem | null>(null);

  const showRecalcToast = (msg: string) => {
    setLastRecalcMessage(msg);
    setTimeout(() => {
      setLastRecalcMessage(null);
    }, 3000);
  };

  // Stores available in current plan
  const availableStores = useMemo(() => {
    const stores = new Set<string>();
    plan.items.forEach(i => {
      if (i.store) stores.add(i.store);
    });
    return Array.from(stores);
  }, [plan.items]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return plan.items.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Store filter
      if (selectedStore !== 'all' && item.store !== selectedStore) {
        return false;
      }
      // Priority filter
      if (selectedPriority !== 'all' && item.priority !== selectedPriority) {
        return false;
      }
      // Status filter
      if (statusFilter === 'pending' && item.purchased) return false;
      if (statusFilter === 'purchased' && !item.purchased) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesNotes = item.notes?.toLowerCase().includes(q) || false;
        const matchesStore = item.store.toLowerCase().includes(q);
        const matchesAisle = item.aisle?.toLowerCase().includes(q) || false;
        return matchesName || matchesNotes || matchesStore || matchesAisle;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-desc') return (b.estimatedCost || 0) - (a.estimatedCost || 0);
      if (sortBy === 'price-asc') return (a.estimatedCost || 0) - (b.estimatedCost || 0);
      if (sortBy === 'priority') {
        const pOrder: Record<string, number> = { 'must-have': 1, 'recommended': 2, 'nice-to-have': 3 };
        return (pOrder[a.priority] || 4) - (pOrder[b.priority] || 4);
      }
      return 0;
    });
  }, [plan.items, selectedCategory, selectedStore, selectedPriority, statusFilter, searchQuery, sortBy]);

  // Grouping structure
  const groupedData: Record<string, ShoppingItem[]> = useMemo(() => {
    if (groupBy === 'category') {
      const groups: Record<string, ShoppingItem[]> = {};
      filteredItems.forEach(item => {
        const cat = item.category || 'groceries';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(item);
      });
      return groups;
    } else if (groupBy === 'aisle') {
      const groups: Record<string, ShoppingItem[]> = {};
      filteredItems.forEach(item => {
        const aisle = item.aisle || 'General Grocery & Party';
        if (!groups[aisle]) groups[aisle] = [];
        groups[aisle].push(item);
      });
      return groups;
    } else if (groupBy === 'store') {
      const groups: Record<string, ShoppingItem[]> = {};
      filteredItems.forEach(item => {
        const store = item.store || 'CymbalMart Supercenter';
        if (!groups[store]) groups[store] = [];
        groups[store].push(item);
      });
      return groups;
    }
    return { 'All Items': filteredItems };
  }, [filteredItems, groupBy]);

  const totalFilteredCost = filteredItems.reduce((acc, i) => acc + (i.estimatedCost || 0), 0);
  const purchasedFilteredCost = filteredItems.filter(i => i.purchased).reduce((acc, i) => acc + (i.estimatedCost || 0), 0);
  const grandTotalCost = plan.items.reduce((acc, i) => acc + (i.estimatedCost || 0), 0);

  // Handle inline quantity adjustments with automatic budget recalculation
  const handleQuantityStep = (item: ShoppingItem, delta: number) => {
    const currentQty = Math.max(1, item.quantity);
    const newQty = Math.max(1, currentQty + delta);
    if (newQty === currentQty) return;

    // Calculate unit price based on previous total cost and quantity
    const unitPrice = currentQty > 0 ? (item.estimatedCost || 0) / currentQty : (item.estimatedCost || 0);
    const newCost = Number((unitPrice * newQty).toFixed(2));

    const updatedItem: ShoppingItem = {
      ...item,
      quantity: newQty,
      estimatedCost: newCost
    };

    onUpdateItem(updatedItem);
    showRecalcToast(`Updated "${item.name}" quantity to ${newQty} ${item.unit} • New Item Total: $${newCost.toFixed(2)}`);
  };

  // Handle inline price update with automatic budget recalculation
  const handleSaveInlinePrice = (item: ShoppingItem) => {
    const parsedPrice = parseFloat(tempPriceValue);
    if (!isNaN(parsedPrice) && parsedPrice >= 0) {
      const updatedItem: ShoppingItem = {
        ...item,
        estimatedCost: Number(parsedPrice.toFixed(2))
      };
      onUpdateItem(updatedItem);
      showRecalcToast(`Updated "${item.name}" price to $${parsedPrice.toFixed(2)} • Budget recalculated`);
    }
    setEditingPriceItemId(null);
    setTempPriceValue('');
  };

  // Handle quick inline item addition
  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;

    const newItem: ShoppingItem = {
      id: `quick-item-${Date.now()}`,
      name: quickName.trim(),
      category: quickCategory,
      quantity: Number(quickQuantity) || 1,
      unit: quickUnit.trim() || 'pack',
      estimatedCost: Number(quickPrice) || 0,
      store: 'CymbalMart Supercenter',
      aisle: quickCategory === 'beverages' ? 'Aisle 4: Beverages & Spirits' : 'Aisle 1: Fresh Grocery',
      brandTier: 'Cymbal Select',
      priority: 'recommended',
      purchased: false,
      notes: 'Added via Quick Add'
    };

    // Use onUpdateItem or save directly
    onUpdateItem(newItem);
    setQuickName('');
    setQuickQuantity(1);
    setQuickPrice(6.99);
    showRecalcToast(`Added "${newItem.name}" ($${newItem.estimatedCost.toFixed(2)}) to list • Budget recalculated`);
  };

  return (
    <div id="shopping-list-view" className="space-y-4">
      {/* Live Budget Recalculation Toast / Notification Alert */}
      {lastRecalcMessage && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-lg animate-fadeIn border border-emerald-400/40">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-200 animate-pulse" />
            <span>{lastRecalcMessage}</span>
          </div>
          <span className="text-[11px] bg-emerald-700/80 px-2 py-0.5 rounded-md font-bold">
            Grand Total: ${grandTotalCost.toFixed(2)}
          </span>
        </div>
      )}

      {/* Search, Filter and Quick Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="search-items-input"
              type="text"
              placeholder="Search CymbalMart items, aisles, ingredients, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Quick Add Toggle */}
            <button
              id="quick-add-toggle-btn"
              onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs ${
                isQuickAddOpen 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isQuickAddOpen ? 'Close Quick Add' : 'Quick Add Item'}</span>
            </button>

            {/* Unit Converter Tool Trigger */}
            <button
              id="unit-converter-toolbar-btn"
              onClick={() => {
                setConverterTargetItem(null);
                setIsConverterOpen(true);
              }}
              className="px-3 py-2.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1.5 shadow-xs"
              title="Smart Unit & Portion Converter (oz to lbs, ml to liters, etc.)"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Unit Converter</span>
            </button>

            {/* Custom Modal Item Add */}
            <button
              id="add-custom-item-btn"
              onClick={onAddItem}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Full Item Form</span>
            </button>

            <button
              id="bulk-check-all-btn"
              onClick={() => onBulkTogglePurchased(true)}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              title="Mark all filtered items as purchased"
            >
              Check All
            </button>

            <button
              id="bulk-uncheck-all-btn"
              onClick={() => onBulkTogglePurchased(false)}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              title="Uncheck all items"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Quick Add Bar Form */}
        {isQuickAddOpen && (
          <form 
            onSubmit={handleQuickAddSubmit}
            className="p-3.5 bg-gradient-to-r from-amber-50/90 via-sky-50/80 to-slate-50 rounded-2xl border border-amber-200/90 flex flex-wrap items-center gap-2.5 animate-fadeIn"
          >
            <div className="flex-1 min-w-[180px]">
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Item Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Lime Wedges, Brioche Buns"
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="w-32">
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Department</label>
              <select
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value as PartyCategory)}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
              >
                <option value="groceries">Produce/Groceries</option>
                <option value="beverages">Beverages/Bar</option>
                <option value="bakery">Bakery</option>
                <option value="tableware">Tableware</option>
                <option value="decor">Decor</option>
                <option value="entertainment">Games/Fun</option>
                <option value="essentials">Essentials</option>
              </select>
            </div>

            <div className="w-18">
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Qty</label>
              <input
                type="number"
                min="1"
                value={quickQuantity}
                onChange={(e) => setQuickQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none text-center"
              />
            </div>

            <div className="w-20">
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Unit</label>
              <input
                type="text"
                placeholder="pack"
                value={quickUnit}
                onChange={(e) => setQuickUnit(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none text-center"
              />
            </div>

            <div className="w-24">
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Est. Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={quickPrice}
                onChange={(e) => setQuickPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none text-right font-bold"
              />
            </div>

            <div className="self-end pb-0.5">
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add & Calculate</span>
              </button>
            </div>
          </form>
        )}

        {/* Filters and Grouping Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Left filters: Store, Priority, Status */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Store dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="filter-store-select"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">All Store Formats ({availableStores.length})</option>
                {availableStores.map(store => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>
            </div>

            {/* Priority dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="filter-priority-select"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">All Priorities</option>
                <option value="must-have">Must-Have</option>
                <option value="recommended">Recommended</option>
                <option value="nice-to-have">Nice-to-Have</option>
              </select>
            </div>

            {/* Status Segment */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({filteredItems.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  statusFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Need
              </button>
              <button
                onClick={() => setStatusFilter('purchased')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  statusFilter === 'purchased' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Carted
              </button>
            </div>
          </div>

          {/* Right controls: Grouping and Sorting */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="group-by-select"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer text-xs"
              >
                <option value="category">Group: Department</option>
                <option value="aisle">Group: Store Aisle</option>
                <option value="store">Group: Store Format</option>
                <option value="none">Flat List</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="sort-by-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer text-xs"
              >
                <option value="default">Sort: Default</option>
                <option value="priority">Priority First</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="price-asc">Price (Low to High)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* CymbalMart Host Pro Tip Banner */}
      {plan.shoppingTips && plan.shoppingTips.length > 0 && selectedCategory === 'all' && (
        <div className="bg-sky-50/80 border border-sky-200/80 rounded-2xl p-3.5 text-xs text-sky-950 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold text-sky-900">CymbalMart Shopping Agent Tip: </strong>
            {plan.shoppingTips[0]}
          </div>
        </div>
      )}

      {/* Item Groups */}
      {Object.keys(groupedData).length === 0 || filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No matching items found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, clearing filters, or adding a new custom item.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStore('all');
              setSelectedPriority('all');
              setStatusFilter('all');
              onSelectCategory('all');
            }}
            className="mt-3 text-xs font-bold text-sky-600 hover:text-sky-700"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {(Object.entries(groupedData) as [string, ShoppingItem[]][]).map(([groupTitle, items]) => {
            if (items.length === 0) return null;

            const groupTotal = items.reduce((acc, i) => acc + (i.estimatedCost || 0), 0);
            const groupPurchased = items.filter(i => i.purchased).length;

            const titleDisplay = groupBy === 'category' 
              ? (CATEGORY_NAMES[groupTitle as PartyCategory] || groupTitle)
              : groupTitle;

            return (
              <div key={groupTitle} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
                {/* Group Header */}
                <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900">
                      {titleDisplay}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded-lg border border-slate-200/70">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-500 hidden sm:inline">
                      {groupPurchased}/{items.length} carted
                    </span>
                    <span className="font-black text-slate-900">
                      ${groupTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items in this group */}
                <div className="divide-y divide-slate-100">
                  {items.map((item) => {
                    const isPurchased = item.purchased;
                    const isEditingPrice = editingPriceItemId === item.id;
                    const isRunningLow = item.quantity < 1 || (item as any).runningLow || item.notes?.toLowerCase().includes('running low');

                    return (
                      <div
                        key={item.id}
                        id={`item-row-${item.id}`}
                        className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                          isRunningLow
                            ? 'bg-rose-50/80 border-2 border-rose-400 rounded-2xl my-1 shadow-xs'
                            : isPurchased 
                              ? 'bg-slate-50/60 opacity-75' 
                              : 'hover:bg-slate-50/40'
                        }`}
                      >
                        {/* Checkbox & Details */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            id={`toggle-item-${item.id}`}
                            onClick={() => onTogglePurchased(item.id)}
                            className="mt-0.5 text-slate-400 hover:text-sky-600 transition-colors shrink-0"
                            title={isPurchased ? 'Mark as needed' : 'Mark as in cart'}
                          >
                            {isPurchased ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5 hover:text-sky-600" />
                            )}
                          </button>

                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className={`text-xs sm:text-sm font-bold ${
                                isRunningLow
                                  ? 'text-rose-950 font-black'
                                  : isPurchased 
                                    ? 'line-through text-slate-400' 
                                    : 'text-slate-900'
                              }`}>
                                {item.name}
                              </span>

                              {/* Running Low / Critical Shortage Alert Badge */}
                              {isRunningLow && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse flex items-center gap-1 shadow-xs">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>RUNNING LOW / REPLENISH</span>
                                </span>
                              )}

                              {/* Brand Tier Tag */}
                              {item.brandTier && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 border border-sky-200">
                                  {item.brandTier}
                                </span>
                              )}

                              {/* Priority Tag */}
                              {item.priority === 'must-have' && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                                  Must-Have
                                </span>
                              )}
                              {item.priority === 'recommended' && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                  Recommended
                                </span>
                              )}
                              {item.priority === 'nice-to-have' && (
                                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                  Optional
                                </span>
                              )}

                              {/* Visually Distinct Color-Coded Dietary Badges */}
                              {item.dietaryTags?.map(tag => {
                                const tLower = tag.toLowerCase();
                                let badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                                let icon = '🌱';

                                if (tLower.includes('gluten') || tLower === 'gf') {
                                  badgeStyle = 'bg-amber-50 text-amber-800 border-amber-300';
                                  icon = '🌾';
                                } else if (tLower.includes('nut') || tLower.includes('peanut')) {
                                  badgeStyle = 'bg-sky-50 text-sky-800 border-sky-300';
                                  icon = '🥜';
                                } else if (tLower.includes('dairy') || tLower === 'df') {
                                  badgeStyle = 'bg-blue-50 text-blue-800 border-blue-300';
                                  icon = '🥛';
                                } else if (tLower.includes('vegan')) {
                                  badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300';
                                  icon = '🌿';
                                } else if (tLower.includes('kosher') || tLower.includes('halal')) {
                                  badgeStyle = 'bg-purple-50 text-purple-800 border-purple-300';
                                  icon = '✨';
                                }

                                return (
                                  <span 
                                    key={tag} 
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 shadow-2xs ${badgeStyle}`}
                                  >
                                    <span>{icon}</span>
                                    <span>{tag}</span>
                                  </span>
                                );
                              })}
                            </div>

                            {/* Store, Aisle & Notes */}
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                              {item.aisle && (
                                <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {item.aisle}
                                </span>
                              )}

                              {groupBy !== 'store' && item.store && (
                                <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                                  STORE_COLORS[item.store] || 'bg-slate-50 text-slate-700 border-slate-200'
                                }`}>
                                  {item.store}
                                </span>
                              )}

                              {item.notes && (
                                <span className="text-[11px] text-slate-600 italic">
                                  {item.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Interactive Quantity Stepper, Price & Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          {/* Live Quantity Adjuster Stepper */}
                          <div className="flex items-center bg-slate-100/90 border border-slate-200 rounded-xl p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleQuantityStep(item, -1)}
                              disabled={item.quantity <= 1}
                              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                              title="Decrease quantity (auto-recalculates cost)"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            <div className="px-2 text-center min-w-8">
                              <span className="font-black text-xs text-slate-900">
                                {item.quantity}
                              </span>
                              <span className="text-[10px] text-slate-500 ml-1 font-medium hidden sm:inline">
                                {item.unit}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleQuantityStep(item, 1)}
                              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
                              title="Increase quantity (auto-recalculates cost)"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price Display / Inline Editable Input */}
                          <div className="text-right min-w-20">
                            {isEditingPrice ? (
                              <div className="flex items-center gap-1 justify-end">
                                <span className="text-xs text-slate-400">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  autoFocus
                                  value={tempPriceValue}
                                  onChange={(e) => setTempPriceValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveInlinePrice(item);
                                    if (e.key === 'Escape') setEditingPriceItemId(null);
                                  }}
                                  className="w-16 px-1.5 py-0.5 bg-white border-2 border-sky-500 rounded text-xs font-bold text-slate-900 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveInlinePrice(item)}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                  title="Save price"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingPriceItemId(null)}
                                  className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                                  title="Cancel"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div 
                                onClick={() => {
                                  setEditingPriceItemId(item.id);
                                  setTempPriceValue((item.estimatedCost || 0).toString());
                                }}
                                className="cursor-pointer group"
                                title="Click to edit item price directly"
                              >
                                <div className={`text-xs sm:text-sm font-black flex items-center justify-end gap-1 ${
                                  isPurchased ? 'text-slate-400' : 'text-slate-900 group-hover:text-sky-600'
                                }`}>
                                  <span>${(item.estimatedCost || 0).toFixed(2)}</span>
                                  <Edit3 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-sky-500 transition-opacity" />
                                </div>
                                {item.originalCost && item.originalCost > item.estimatedCost && (
                                  <div className="text-[10px] text-emerald-600 font-bold">
                                    Save ${(item.originalCost - item.estimatedCost).toFixed(2)}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Action icons */}
                          <div className="flex items-center gap-1">
                            {/* Unit Converter for Item */}
                            <button
                              id={`convert-item-${item.id}`}
                              onClick={() => {
                                setConverterTargetItem(item);
                                setIsConverterOpen(true);
                              }}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                              title={`Convert units for "${item.name}" (oz, lbs, ml, etc.)`}
                            >
                              <Scale className="w-3.5 h-3.5" />
                            </button>

                            {/* Full Edit Modal */}
                            {onEditItem && (
                              <button
                                id={`edit-item-${item.id}`}
                                onClick={() => onEditItem(item)}
                                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                                title="Edit item details (name, category, store, notes)"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* AI Smart Swap */}
                            <button
                              id={`sub-item-${item.id}`}
                              onClick={() => onOpenSubstitution(item)}
                              className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                              title="Smart Substitutions, Allergens & Store Brand Savings"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Item */}
                            <button
                              id={`del-item-${item.id}`}
                              onClick={() => {
                                onDeleteItem(item.id);
                                showRecalcToast(`Removed "${item.name}" • Budget recalculated`);
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                              title="Delete Item from shopping list"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Footer & Fast Checkout CTA with live recalculation numbers */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="text-xs text-sky-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-sky-400" />
            <span>Live Recalculated Cart Total</span>
          </div>
          <div className="text-xl sm:text-2xl font-black flex items-center gap-2 mt-0.5">
            <span>${totalFilteredCost.toFixed(2)}</span>
            <span className="text-xs font-normal text-slate-400">
              (${purchasedFilteredCost.toFixed(2)} in cart • ${grandTotalCost.toFixed(2)} all items)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onAddItem}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>

          {onOpenCheckout && (
            <button
              id="express-checkout-footer-btn"
              onClick={onOpenCheckout}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sky-400 hover:bg-sky-300 text-slate-950 transition-all flex items-center gap-2 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Express Checkout ({filteredItems.length} items)</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40">
                <Award className="w-2.5 h-2.5" />
                <span>+{(Math.round(totalFilteredCost * 10) + 350).toLocaleString()} pts</span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Smart Unit & Portion Converter Modal */}
      <UnitConverterModal
        isOpen={isConverterOpen}
        onClose={() => {
          setIsConverterOpen(false);
          setConverterTargetItem(null);
        }}
        targetItem={converterTargetItem}
        items={plan.items}
        onApplyConversion={(updated) => {
          onUpdateItem(updated);
          showRecalcToast(`Converted "${updated.name}" to ${updated.quantity} ${updated.unit} • Cart updated`);
        }}
      />
    </div>
  );
};
