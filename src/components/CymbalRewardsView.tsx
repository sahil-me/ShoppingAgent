import React, { useState } from 'react';
import { PartyPlan, ShoppingItem } from '../types';
import { 
  Award, 
  Sparkles, 
  Gift, 
  TrendingUp, 
  ShieldCheck, 
  Coins, 
  Flame, 
  Star, 
  CheckCircle2, 
  ChevronRight,
  Zap,
  Percent,
  Tag,
  ArrowUpRight,
  ShoppingBag
} from 'lucide-react';

export interface CymbalRewardsProps {
  plan: PartyPlan;
  subtotal: number;
  fulfillmentMethod: string;
  pointsToRedeem: number;
  onSetPointsToRedeem: (points: number) => void;
  onSwitchToOrderTab?: () => void;
}

export const CymbalRewardsView: React.FC<CymbalRewardsProps> = ({
  plan,
  subtotal,
  fulfillmentMethod,
  pointsToRedeem,
  onSetPointsToRedeem,
  onSwitchToOrderTab
}) => {
  // Existing host account balance (simulated host loyalty balance)
  const existingPointsBalance = 1250; 

  // Points Calculation based on cart
  const basePoints = Math.round(subtotal * 10); // 10 pts per $1 spent

  // Store Brand items in cart earn 2x multiplier (+20 pts per $1)
  const cymbalBrandItems = plan.items.filter(item => 
    item.brandTier === 'cymbal-basics' || 
    item.brandTier === 'cymbal-select' || 
    item.name.toLowerCase().includes('cymbal')
  );
  const cymbalBrandSpend = cymbalBrandItems.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  const brandBonusPoints = Math.round(cymbalBrandSpend * 10); // extra 10 pts per $1 on store brand

  // Host milestone bonus
  const hostMilestoneBonus = subtotal >= 200 ? 500 : subtotal >= 100 ? 250 : 100;

  // Fulfillment eco/curbside bonus
  const fulfillmentBonus = fulfillmentMethod === 'pickup' ? 150 : fulfillmentMethod === 'in-store-route' ? 200 : 50;

  // Total trip points earned
  const totalTripPoints = basePoints + brandBonusPoints + hostMilestoneBonus + fulfillmentBonus;
  
  // Total projected balance after this shopping trip
  const projectedBalance = existingPointsBalance + totalTripPoints - pointsToRedeem;

  // Cash value equivalent (100 points = $1.00)
  const pointsCashValue = (totalTripPoints / 100).toFixed(2);
  const projectedCashValue = (projectedBalance / 100).toFixed(2);

  // Determine loyalty tier
  const getTierInfo = (points: number) => {
    if (points >= 3000) {
      return { name: 'Platinum Party Maestro', color: 'from-amber-400 to-amber-600', nextTier: 'Max Tier', needed: 0, progress: 100 };
    }
    if (points >= 1500) {
      return { name: 'Gold Event Host', color: 'from-amber-500 to-yellow-400', nextTier: 'Platinum Party Maestro', needed: 3000 - points, progress: Math.min(100, Math.round((points - 1500) / 15)) };
    }
    return { name: 'Silver Host', color: 'from-slate-400 to-slate-600', nextTier: 'Gold Event Host', needed: 1500 - points, progress: Math.min(100, Math.round(points / 15)) };
  };

  const currentTier = getTierInfo(existingPointsBalance);
  const nextTierInfo = getTierInfo(projectedBalance);

  const maxRedeemablePoints = Math.min(existingPointsBalance, Math.floor(subtotal * 50)); // Max 50% of cart value

  return (
    <div id="cymbalmart-rewards-view" className="space-y-6 animate-fadeIn text-slate-900">
      {/* Top Banner Card: Total Trip Points Earned */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 p-6 text-white shadow-xl border border-indigo-800/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-400/20 text-amber-300 rounded-xl border border-amber-400/30">
                <Award className="w-4 h-4" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                CymbalMart Host Rewards
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              +{totalTripPoints.toLocaleString()} Points
            </h3>
            <p className="text-xs text-slate-300 flex items-center gap-1.5">
              <span>Estimated earnings on this ${subtotal.toFixed(2)} party cart</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                ≈ ${pointsCashValue} in Cymbal Cash
              </span>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center sm:text-right">
            <div className="text-[11px] text-slate-300 font-medium">Projected Balance</div>
            <div className="text-lg font-black text-amber-300">
              {projectedBalance.toLocaleString()} pts
            </div>
            <div className="text-[10px] text-slate-400">
              (${projectedCashValue} available to spend)
            </div>
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="mt-5 pt-4 border-t border-indigo-900/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Current Status: <strong>{currentTier.name}</strong></span>
            </span>
            <span className="text-slate-400 text-[11px]">
              {nextTierInfo.needed > 0 ? `${nextTierInfo.needed} pts to ${nextTierInfo.nextTier}` : 'Top Tier Unlocked!'}
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700">
            <div 
              className="bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${Math.max(10, nextTierInfo.progress)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Points Breakdown Matrix */}
      <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-indigo-600" />
            <span>How Your Points Are Calculated</span>
          </span>
          <span className="text-[11px] text-indigo-600 font-semibold lowercase">
            10 pts / $1 base rate
          </span>
        </h4>

        <div className="divide-y divide-slate-200 text-xs">
          {/* Base cart rate */}
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <div>
                <div className="font-bold text-slate-800">Base Cart Points</div>
                <div className="text-[11px] text-slate-500">10 points per $1 on party items (${subtotal.toFixed(2)})</div>
              </div>
            </div>
            <span className="font-black text-slate-900">+{basePoints.toLocaleString()} pts</span>
          </div>

          {/* Cymbal Brand multiplier */}
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div>
                <div className="font-bold text-emerald-800 flex items-center gap-1">
                  <span>Cymbal Brand 2X Multiplier</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                    {cymbalBrandItems.length} items
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Extra points for Cymbal Select & Basics items (${cymbalBrandSpend.toFixed(2)})
                </div>
              </div>
            </div>
            <span className="font-black text-emerald-600">+{brandBonusPoints.toLocaleString()} pts</span>
          </div>

          {/* Host Milestone */}
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <div>
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <span>Party Host Volume Milestone</span>
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                </div>
                <div className="text-[11px] text-slate-500">
                  {subtotal >= 200 ? 'Super Host $200+ party tier' : subtotal >= 100 ? 'Big Bash $100+ party tier' : 'Standard Host reward'}
                </div>
              </div>
            </div>
            <span className="font-black text-amber-600">+{hostMilestoneBonus.toLocaleString()} pts</span>
          </div>

          {/* Fulfillment Bonus */}
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sky-500" />
              <div>
                <div className="font-bold text-slate-800">
                  {fulfillmentMethod === 'pickup' 
                    ? 'Curbside Express Eco-Bonus' 
                    : fulfillmentMethod === 'in-store-route' 
                    ? 'In-Store Smart Shopper Pass Bonus' 
                    : 'Delivery Rewards Boost'}
                </div>
                <div className="text-[11px] text-slate-500">Selected {fulfillmentMethod} fulfillment method</div>
              </div>
            </div>
            <span className="font-black text-sky-600">+{fulfillmentBonus.toLocaleString()} pts</span>
          </div>
        </div>

        {/* Total Points line */}
        <div className="pt-2 border-t-2 border-slate-300 flex items-center justify-between text-sm font-black text-slate-900">
          <span>Total Points Earned on this Order</span>
          <span className="text-indigo-600">+{totalTripPoints.toLocaleString()} pts</span>
        </div>
      </div>

      {/* Redeem Points Section */}
      <div className="bg-indigo-50/70 border border-indigo-200/90 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 text-white rounded-xl">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                Redeem Cymbal Rewards On This Trip
              </h4>
              <p className="text-[11px] text-indigo-700">
                You have <strong>{existingPointsBalance.toLocaleString()} points</strong> available (${(existingPointsBalance / 100).toFixed(2)} credit)
              </p>
            </div>
          </div>

          {pointsToRedeem > 0 && (
            <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-xl border border-emerald-300">
              -${(pointsToRedeem / 100).toFixed(2)} Off Applied
            </span>
          )}
        </div>

        {/* Quick Redemption Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onSetPointsToRedeem(0)}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
              pointsToRedeem === 0
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Save Points
          </button>

          <button
            type="button"
            onClick={() => onSetPointsToRedeem(Math.min(500, maxRedeemablePoints))}
            disabled={existingPointsBalance < 500}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
              pointsToRedeem === 500
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            } ${existingPointsBalance < 500 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Redeem 500 ($5)
          </button>

          <button
            type="button"
            onClick={() => onSetPointsToRedeem(Math.min(1000, maxRedeemablePoints))}
            disabled={existingPointsBalance < 1000}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
              pointsToRedeem === 1000
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            } ${existingPointsBalance < 1000 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Redeem 1,000 ($10)
          </button>

          <button
            type="button"
            onClick={() => onSetPointsToRedeem(maxRedeemablePoints)}
            disabled={existingPointsBalance <= 0}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
              pointsToRedeem === maxRedeemablePoints && pointsToRedeem > 0
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Max (${(maxRedeemablePoints / 100).toFixed(2)})
          </button>
        </div>
      </div>

      {/* Host Club Unlockable Perks */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Gift className="w-4 h-4 text-amber-500" />
          <span>Active Host Perks Included With Your Order</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-start gap-2.5 shadow-2xs">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Freshness & Ice Guarantee</div>
              <div className="text-[11px] text-slate-500 leading-snug">
                Free ice replacement if melted during transport or delivery delay.
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-start gap-2.5 shadow-2xs">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">10% Next Beverage Voucher</div>
              <div className="text-[11px] text-slate-500 leading-snug">
                Unlocks automatically when checking out this party order today.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action button to switch back to checkout */}
      {onSwitchToOrderTab && (
        <button
          type="button"
          onClick={onSwitchToOrderTab}
          className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue to Order Fulfillment & Checkout</span>
        </button>
      )}
    </div>
  );
};
