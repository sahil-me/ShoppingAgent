import React, { useState, useMemo } from 'react';
import { PartyPlan, ShoppingItem } from '../types';
import { 
  CheckSquare, 
  Store, 
  CheckCircle2, 
  Circle, 
  PartyPopper, 
  Sparkles, 
  ShoppingBag, 
  DollarSign, 
  Check, 
  Calendar, 
  AlertTriangle, 
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface StoreRunChecklistProps {
  plan: PartyPlan;
  onTogglePurchased: (itemId: string) => void;
  onUpdateEventDate?: (newDate: string) => void;
  onOpenCheckout?: () => void;
}

export const StoreRunChecklist: React.FC<StoreRunChecklistProps> = ({
  plan,
  onTogglePurchased,
  onUpdateEventDate,
  onOpenCheckout
}) => {
  const [activeStoreTab, setActiveStoreTab] = useState<string>('all');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Group by store
  const storeGroups = useMemo(() => {
    const map: Record<string, ShoppingItem[]> = {};
    plan.items.forEach(item => {
      const store = item.store || 'Supermarket / Grocery';
      if (!map[store]) map[store] = [];
      map[store].push(item);
    });
    return map;
  }, [plan.items]);

  const stores = Object.keys(storeGroups);

  const totalItems = plan.items.length;
  const purchasedItems = plan.items.filter(i => i.purchased).length;
  const unpurchasedItems = totalItems - purchasedItems;
  const isAllDone = totalItems > 0 && purchasedItems === totalItems;

  const purchasedSpend = plan.items.filter(i => i.purchased).reduce((acc, i) => acc + (i.estimatedCost || 0), 0);
  const totalSpend = plan.items.reduce((acc, i) => acc + (i.estimatedCost || 0), 0);
  const remainingSpend = totalSpend - purchasedSpend;

  // Date countdown calculation
  const eventDateStr = plan.eventDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
  const eventTime = new Date(`${eventDateStr}T12:00:00`).getTime();
  const now = Date.now();
  const diffMs = eventTime - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const isApproaching = unpurchasedItems > 0 && diffDays <= 3;
  const isUrgent = unpurchasedItems > 0 && diffDays <= 1;

  const dateObj = new Date(`${eventDateStr}T12:00:00`);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : eventDateStr;

  const displayedStores = activeStoreTab === 'all' 
    ? stores 
    : stores.filter(s => s === activeStoreTab);

  return (
    <div id="store-run-checklist" className="space-y-4">
      {/* Event Date Approaching Warning in Store Run Mode */}
      {isApproaching && (
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs ${
          isUrgent 
            ? 'bg-rose-50 border-rose-300 text-rose-950' 
            : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}>
          <div className="flex items-start gap-2.5">
            <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${isUrgent ? 'text-rose-600 animate-pulse' : 'text-amber-600'}`} />
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <span>{isUrgent ? '🚨 Urgent Store Run Alert:' : '⏳ Approaching Event Warning:'}</span>
                <span className="font-normal text-slate-700">
                  Event date is <strong>{formattedDate}</strong> ({diffDays <= 0 ? 'Today!' : diffDays === 1 ? 'Tomorrow!' : `in ${diffDays} days`})
                </span>
              </div>
              <p className="mt-0.5 text-slate-600">
                You have <strong>{unpurchasedItems} items</strong> remaining. Tap items below as you navigate aisles, or switch to 2-hour Curbside Express Pickup.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            {onOpenCheckout && (
              <button
                onClick={onOpenCheckout}
                className="px-3 py-1.5 rounded-xl font-bold bg-sky-600 hover:bg-sky-500 text-white transition-colors flex items-center gap-1 shadow-2xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Express Curbside</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Live Store Run Summary Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Live Shopping Mode
              </span>
              <h2 className="text-base sm:text-lg font-bold">
                In-Store Checklist
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Tap items to check off as you put them in your cart</span>
              <span>•</span>
              <button 
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 underline"
              >
                <Calendar className="w-3 h-3" />
                <span>Event: {formattedDate}</span>
              </button>
            </div>
          </div>

          {/* Cart Numbers */}
          <div className="flex items-center gap-5 text-xs">
            <div>
              <div className="text-slate-400">Cart Progress</div>
              <div className="text-lg sm:text-xl font-bold text-amber-400">
                {purchasedItems} / {totalItems} items
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-slate-400">In Cart Total</div>
              <div className="text-lg sm:text-xl font-bold text-emerald-400">
                ${purchasedSpend.toFixed(2)}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden sm:block" />
            <div className="hidden sm:block">
              <div className="text-slate-400">Remaining to Buy</div>
              <div className="text-lg sm:text-xl font-bold text-slate-300">
                ${remainingSpend.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Date Selector Row if toggled */}
        {showDatePicker && onUpdateEventDate && (
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Set Target Event Date:</span>
            <button
              onClick={() => {
                onUpdateEventDate(new Date().toISOString().split('T')[0]);
                setShowDatePicker(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900 font-semibold"
            >
              Today
            </button>
            <button
              onClick={() => {
                onUpdateEventDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
                setShowDatePicker(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900 font-semibold"
            >
              Tomorrow
            </button>
            <button
              onClick={() => {
                onUpdateEventDate(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
                setShowDatePicker(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 font-semibold"
            >
              In 2 Days
            </button>
            <input
              type="date"
              value={plan.eventDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                if (e.target.value) {
                  onUpdateEventDate(e.target.value);
                  setShowDatePicker(false);
                }
              }}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none"
            />
          </div>
        )}

        {/* Global Progress Bar */}
        <div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${totalItems ? (purchasedItems / totalItems) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Victory Celebration when completed */}
      {isAllDone && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 text-center space-y-2 animate-fadeIn shadow-xs">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <PartyPopper className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-emerald-950">
            Shopping Run Complete! 🎉
          </h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">
            You've secured all {totalItems} party supplies and ingredients for {plan.title}. Total spend: ${purchasedSpend.toFixed(2)}.
          </p>
        </div>
      )}

      {/* Store Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveStoreTab('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
            activeStoreTab === 'all'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Stores ({stores.length})
        </button>

        {stores.map((store) => {
          const items = storeGroups[store] || [];
          const done = items.filter(i => i.purchased).length;
          const isSelected = activeStoreTab === store;

          return (
            <button
              key={store}
              onClick={() => setActiveStoreTab(store)}
              className={`px-3 py-2 rounded-xl text-xs font-medium shrink-0 transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-600 font-semibold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>{store}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                done === items.length
                  ? 'bg-emerald-100 text-emerald-800'
                  : isSelected ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {done}/{items.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Store Run Sections */}
      <div className="space-y-4">
        {displayedStores.map((storeName) => {
          const items = storeGroups[storeName] || [];
          const doneCount = items.filter(i => i.purchased).length;
          const isStoreDone = doneCount === items.length && items.length > 0;
          const storeSubtotal = items.reduce((acc, i) => acc + (i.estimatedCost || 0), 0);

          return (
            <div
              key={storeName}
              id={`store-card-${storeName.replace(/\s+/g, '-').toLowerCase()}`}
              className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                isStoreDone 
                  ? 'border-emerald-200 shadow-2xs' 
                  : 'border-slate-200/80 shadow-xs'
              }`}
            >
              {/* Store Header */}
              <div className={`p-4 border-b flex items-center justify-between ${
                isStoreDone 
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                  : 'bg-slate-50/80 border-slate-200 text-slate-900'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-xl ${isStoreDone ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-tight">
                      {storeName}
                    </h3>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {doneCount} of {items.length} items collected • Est. ${storeSubtotal.toFixed(2)}
                    </div>
                  </div>
                </div>

                {isStoreDone && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                    <Check className="w-3.5 h-3.5" />
                    Stop Complete
                  </span>
                )}
              </div>

              {/* In-Store Checklist Items */}
              <div className="divide-y divide-slate-100">
                {items.map((item) => {
                  const isChecked = item.purchased;

                  return (
                    <div
                      key={item.id}
                      onClick={() => onTogglePurchased(item.id)}
                      className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                        isChecked 
                          ? 'bg-slate-50/70 opacity-60' 
                          : 'hover:bg-amber-50/40 active:bg-amber-100/50'
                      }`}
                    >
                      {/* Checkbox and Name */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="shrink-0 text-slate-400">
                          {isChecked ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-6 h-6 hover:text-amber-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className={`text-xs sm:text-sm font-semibold ${
                            isChecked ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}>
                            {item.name}
                          </div>
                          {item.aisle && (
                            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded mr-2">
                              {item.aisle}
                            </span>
                          )}
                          {item.notes && (
                            <span className="text-[11px] text-slate-500 italic">
                              {item.notes}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md inline-block">
                          {item.quantity} {item.unit}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                          ${(item.estimatedCost || 0).toFixed(2)}
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
    </div>
  );
};
