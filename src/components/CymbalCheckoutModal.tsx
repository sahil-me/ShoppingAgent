import React, { useState } from 'react';
import { PartyPlan, CheckoutOrderDetails, FulfillmentMethod } from '../types';
import { 
  ShoppingBag, 
  X, 
  CheckCircle2, 
  Truck, 
  Store, 
  QrCode, 
  Clock, 
  ShieldCheck, 
  Printer, 
  Check, 
  ArrowRight,
  Sparkles,
  DollarSign,
  AlertCircle,
  Award,
  Coins,
  Gift,
  Star,
  Zap
} from 'lucide-react';
import { CymbalRewardsView } from './CymbalRewardsView';

interface CymbalCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PartyPlan;
  onOrderConfirmed?: (details: CheckoutOrderDetails) => void;
}

export const CymbalCheckoutModal: React.FC<CymbalCheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  onOrderConfirmed
}) => {
  const [activeCheckoutTab, setActiveCheckoutTab] = useState<'fulfillment' | 'rewards'>('fulfillment');
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>('pickup');
  const [selectedSlot, setSelectedSlot] = useState<string>('Today • Ready in 2 Hours (4:00 PM - 5:00 PM)');
  const [storeLocation, setStoreLocation] = useState<string>('CymbalMart Supercenter #1042 — Westside Plaza');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('742 Evergreen Terrace, Springfield');
  const [subPreference, setSubPreference] = useState<'best-match' | 'no-substitutions' | 'call-host'>('best-match');
  const [hostNotes, setHostNotes] = useState<string>('Please select firm avocados and cold ice bags last.');
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<CheckoutOrderDetails | null>(null);

  if (!isOpen) return null;

  const totalCost = plan.items.reduce((acc, item) => acc + (item.estimatedCost || 0), 0);
  const discountSavings = plan.items.reduce((acc, item) => {
    if (item.originalCost && item.originalCost > item.estimatedCost) {
      return acc + (item.originalCost - item.estimatedCost);
    }
    return acc;
  }, 0) + (totalCost > 150 ? 15.00 : 8.50); // Host club rollback bundle saving

  const taxes = Math.round(totalCost * 0.065 * 100) / 100;
  const serviceFee = fulfillmentMethod === 'delivery' ? 5.99 : 0.00;
  const rewardsRedemptionDiscount = pointsToRedeem > 0 ? (pointsToRedeem / 100) : 0;
  const finalTotal = Math.max(0, Math.round((totalCost + taxes + serviceFee - rewardsRedemptionDiscount) * 100) / 100);

  // Rewards Points Calculation
  const basePoints = Math.round(totalCost * 10);
  const cymbalBrandItems = plan.items.filter(item => 
    item.brandTier === 'cymbal-basics' || 
    item.brandTier === 'cymbal-select' || 
    item.name.toLowerCase().includes('cymbal')
  );
  const cymbalBrandSpend = cymbalBrandItems.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  const brandBonusPoints = Math.round(cymbalBrandSpend * 10);
  const hostMilestoneBonus = totalCost >= 200 ? 500 : totalCost >= 100 ? 250 : 100;
  const fulfillmentBonus = fulfillmentMethod === 'pickup' ? 150 : fulfillmentMethod === 'in-store-route' ? 200 : 50;
  const totalTripPointsEarned = basePoints + brandBonusPoints + hostMilestoneBonus + fulfillmentBonus;

  const handleConfirmOrder = () => {
    const details: CheckoutOrderDetails = {
      orderId: `CYM-${Math.floor(100000 + Math.random() * 900000)}`,
      fulfillmentMethod,
      storeLocation,
      slotTime: selectedSlot,
      deliveryAddress: fulfillmentMethod === 'delivery' ? deliveryAddress : undefined,
      substitutionPreference: subPreference,
      hostNotes,
      subtotal: totalCost,
      discountSavings: discountSavings + rewardsRedemptionDiscount,
      taxes,
      serviceFee,
      total: finalTotal,
      itemCount: plan.items.length,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
      pointsEarned: totalTripPointsEarned,
      pointsRedeemed: pointsToRedeem,
      rewardTier: totalCost >= 200 ? 'Gold Event Host' : 'Silver Host'
    };

    setOrderDetails(details);
    setIsSubmitted(true);
    if (onOrderConfirmed) {
      onOrderConfirmed(details);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div id="cymbal-checkout-modal" className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-sky-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider">
                  CymbalMart Express
                </span>
                <span className="text-[10px] bg-amber-400/20 text-amber-200 px-2 py-0.2 rounded-full border border-amber-400/30 flex items-center gap-1 font-bold">
                  <Award className="w-2.5 h-2.5 text-amber-300" />
                  <span>+{totalTripPointsEarned.toLocaleString()} pts</span>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {isSubmitted ? 'Order Confirmed!' : 'Review & Checkout Party Supplies'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs (Fulfillment vs CymbalMart Rewards) */}
        {!isSubmitted && (
          <div className="grid grid-cols-2 bg-slate-100 p-1.5 border-b border-slate-200 text-xs font-bold">
            <button
              type="button"
              id="checkout-tab-fulfillment-btn"
              onClick={() => setActiveCheckoutTab('fulfillment')}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeCheckoutTab === 'fulfillment'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>1. Order & Fulfillment ({plan.items.length})</span>
            </button>

            <button
              type="button"
              id="checkout-tab-rewards-btn"
              onClick={() => setActiveCheckoutTab('rewards')}
              className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeCheckoutTab === 'rewards'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>2. CymbalMart Rewards</span>
              <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-md border border-amber-300">
                +{totalTripPointsEarned.toLocaleString()} pts
              </span>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isSubmitted && orderDetails ? (
            <div className="space-y-6 py-2">
              {/* Order Success Card */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    CymbalMart Order Placed
                  </span>
                  <h3 className="text-xl font-black text-emerald-950 mt-0.5">
                    Order #{orderDetails.orderId}
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
                    {fulfillmentMethod === 'pickup' 
                      ? `Your party order of ${orderDetails.itemCount} items is being assembled for Curbside Express Pickup at ${orderDetails.storeLocation}.`
                      : fulfillmentMethod === 'delivery'
                      ? `Your party groceries will be delivered to ${orderDetails.deliveryAddress} during ${orderDetails.slotTime}.`
                      : `Your in-store smart shopping pass with aisle navigation is activated!`}
                  </p>
                </div>
              </div>

              {/* CymbalMart Rewards Points Earned Celebration Badge */}
              <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 rounded-2xl p-4 text-white border border-indigo-700/50 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                      CymbalMart Host Rewards Earned
                    </div>
                    <div className="text-lg font-black text-white">
                      +{orderDetails.pointsEarned?.toLocaleString() || totalTripPointsEarned.toLocaleString()} Points Added!
                    </div>
                    <div className="text-[11px] text-slate-300">
                      ≈ ${(Number(orderDetails.pointsEarned || totalTripPointsEarned) / 100).toFixed(2)} in Cymbal Cash credited to your Host Account
                    </div>
                  </div>
                </div>

                <div className="text-center sm:text-right bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  <div className="text-[10px] text-slate-300">New Host Balance</div>
                  <div className="text-sm font-black text-amber-300">
                    {(1250 + (orderDetails.pointsEarned || totalTripPointsEarned) - (orderDetails.pointsRedeemed || 0)).toLocaleString()} pts
                  </div>
                </div>
              </div>

              {/* Order Breakdown */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Event Plan</span>
                  <span className="font-bold text-slate-900">{plan.title}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Scheduled Time</span>
                  <span className="font-bold text-slate-900">{orderDetails.slotTime}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Items Total ({orderDetails.itemCount})</span>
                  <span className="font-bold text-slate-900">${orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-emerald-700">
                  <span className="font-medium">Cymbal Host Club Savings</span>
                  <span className="font-bold">-${orderDetails.discountSavings.toFixed(2)}</span>
                </div>
                {orderDetails.pointsRedeemed ? (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-indigo-700">
                    <span className="font-medium">Cymbal Rewards Points Redeemed</span>
                    <span className="font-bold">-${(orderDetails.pointsRedeemed / 100).toFixed(2)}</span>
                  </div>
                ) : null}
                <div className="flex items-center justify-between pt-1 text-sm font-black text-slate-900">
                  <span>Total Paid</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handlePrintReceipt}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 border border-slate-300"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Packing Slip & Receipt</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Return to Party Dashboard</span>
                </button>
              </div>
            </div>
          ) : activeCheckoutTab === 'rewards' ? (
            /* Dedicated CymbalMart Rewards View */
            <CymbalRewardsView
              plan={plan}
              subtotal={totalCost}
              fulfillmentMethod={fulfillmentMethod}
              pointsToRedeem={pointsToRedeem}
              onSetPointsToRedeem={(pts) => setPointsToRedeem(pts)}
              onSwitchToOrderTab={() => setActiveCheckoutTab('fulfillment')}
            />
          ) : (
            <div className="space-y-6">
              {/* Rewards Points Teaser Card */}
              <div 
                onClick={() => setActiveCheckoutTab('rewards')}
                className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-3.5 border border-indigo-800/40 shadow-xs flex items-center justify-between cursor-pointer hover:border-amber-400/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-400/20 text-amber-300 rounded-xl border border-amber-400/30">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">
                        Earn +{totalTripPointsEarned.toLocaleString()} CymbalMart Points
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 rounded">
                        ≈ ${(totalTripPointsEarned / 100).toFixed(2)} Cash
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Includes 10x base + 2x Cymbal Brand & Host Milestones
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-300 group-hover:translate-x-0.5 transition-transform">
                  <span>View Rewards</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Step 1: Select Fulfillment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  1. Choose Fulfillment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setFulfillmentMethod('pickup')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      fulfillmentMethod === 'pickup'
                        ? 'border-sky-600 bg-sky-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Store className={`w-4 h-4 ${fulfillmentMethod === 'pickup' ? 'text-sky-600' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold text-slate-900">Curbside Pickup</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Free ready in 2 hours. Loaded directly into your trunk.
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md inline-block">
                        FREE • Recommended
                      </span>
                      <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        +150 pts
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => setFulfillmentMethod('delivery')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      fulfillmentMethod === 'delivery'
                        ? 'border-sky-600 bg-sky-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className={`w-4 h-4 ${fulfillmentMethod === 'delivery' ? 'text-sky-600' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold text-slate-900">Venue Delivery</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Same-day courier drop-off with insulated bags & cold ice.
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-md inline-block">
                        $5.99 Flat Fee
                      </span>
                      <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        +50 pts
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => setFulfillmentMethod('in-store-route')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      fulfillmentMethod === 'in-store-route'
                        ? 'border-sky-600 bg-sky-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <QrCode className={`w-4 h-4 ${fulfillmentMethod === 'in-store-route' ? 'text-sky-600' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold text-slate-900">In-Store Pass</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Aisle-by-aisle optimized route for self-shopping.
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md inline-block">
                        Instant Pass
                      </span>
                      <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        +200 pts
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Time Slot & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Pickup / Delivery Time Slot
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  >
                    <option value="Today • Ready in 2 Hours (4:00 PM - 5:00 PM)">Today • Ready in 2 Hours (4:00 PM - 5:00 PM)</option>
                    <option value="Today • Evening Slot (6:00 PM - 7:00 PM)">Today • Evening Slot (6:00 PM - 7:00 PM)</option>
                    <option value="Tomorrow • Morning of Event (9:00 AM - 10:00 AM)">Tomorrow • Morning of Event (9:00 AM - 10:00 AM)</option>
                    <option value="Tomorrow • Afternoon (1:00 PM - 2:00 PM)">Tomorrow • Afternoon (1:00 PM - 2:00 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-slate-500" />
                    {fulfillmentMethod === 'delivery' ? 'Delivery Address' : 'CymbalMart Store Location'}
                  </label>
                  {fulfillmentMethod === 'delivery' ? (
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter street address"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  ) : (
                    <select
                      value={storeLocation}
                      onChange={(e) => setStoreLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    >
                      <option value="CymbalMart Supercenter #1042 — Westside Plaza">CymbalMart Supercenter #1042 — Westside Plaza (0.8 mi)</option>
                      <option value="CymbalMart Express #2018 — Downtown Metro">CymbalMart Express #2018 — Downtown Metro (2.1 mi)</option>
                      <option value="CymbalMart Supercenter #3105 — Northway Mall">CymbalMart Supercenter #3105 — Northway Mall (3.5 mi)</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Substitution Policy & Host Instructions */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    If an item is out of stock:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSubPreference('best-match')}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        subPreference === 'best-match'
                          ? 'bg-white border-sky-600 text-sky-900 font-bold shadow-2xs'
                          : 'bg-white/60 border-slate-200 text-slate-600'
                      }`}
                    >
                      ✓ Replace with Best Match
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubPreference('no-substitutions')}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        subPreference === 'no-substitutions'
                          ? 'bg-white border-sky-600 text-sky-900 font-bold shadow-2xs'
                          : 'bg-white/60 border-slate-200 text-slate-600'
                      }`}
                    >
                      ✕ Do Not Substitute
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubPreference('call-host')}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        subPreference === 'call-host'
                          ? 'bg-white border-sky-600 text-sky-900 font-bold shadow-2xs'
                          : 'bg-white/60 border-slate-200 text-slate-600'
                      }`}
                    >
                      📞 Call Host for Approval
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Host Shopper Notes (e.g. Ice packing, fruit ripeness)
                  </label>
                  <input
                    type="text"
                    value={hostNotes}
                    onChange={(e) => setHostNotes(e.target.value)}
                    placeholder="e.g. Pack cold beer and ice in separate thermal bag..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Order Summary & Rollback Savings */}
              <div className="bg-sky-950 text-white rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between text-xs text-sky-200">
                  <span>Party Items Subtotal ({plan.items.length} items)</span>
                  <span className="font-semibold text-white">${totalCost.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    CymbalMart Host Club Rollback Savings
                  </span>
                  <span>-${discountSavings.toFixed(2)}</span>
                </div>
                {pointsToRedeem > 0 && (
                  <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      CymbalMart Points Redeemed ({pointsToRedeem} pts)
                    </span>
                    <span>-${rewardsRedemptionDiscount.toFixed(2)}</span>
                  </div>
                )}
                {fulfillmentMethod === 'delivery' && (
                  <div className="flex items-center justify-between text-xs text-sky-200">
                    <span>Delivery Courier Fee</span>
                    <span>$5.99</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-sky-200">
                  <span>Estimated Tax</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-sky-800/80 flex items-center justify-between text-base sm:text-lg font-black text-white">
                  <span>Final Total</span>
                  <span className="text-emerald-400">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Final Confirm CTA */}
              <button
                onClick={handleConfirmOrder}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <span>
                  {fulfillmentMethod === 'pickup' 
                    ? 'Place Curbside Express Pickup Order'
                    : fulfillmentMethod === 'delivery'
                    ? 'Schedule Venue Express Delivery'
                    : 'Activate In-Store Route Pass'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
