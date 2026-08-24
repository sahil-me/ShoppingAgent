import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PartyPlan } from '../types';
import { 
  Bell, 
  BellRing, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ShoppingBag, 
  Calendar, 
  X, 
  ArrowRight, 
  Store,
  Sparkles,
  Zap,
  Volume2,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface EventDateNotifierProps {
  plan: PartyPlan;
  onNavigateToStoreRun: () => void;
  onBulkCheckPurchased: (purchased: boolean) => void;
  onOpenCheckout: () => void;
  onUpdateEventDate: (newDate: string) => void;
}

export const EventDateNotifier: React.FC<EventDateNotifierProps> = ({
  plan,
  onNavigateToStoreRun,
  onBulkCheckPurchased,
  onOpenCheckout,
  onUpdateEventDate
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isSnoozed, setIsSnoozed] = useState<boolean>(false);
  const [snoozeUntil, setSnoozeUntil] = useState<number | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<string>('default');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [hasSentBrowserNotification, setHasSentBrowserNotification] = useState<boolean>(false);

  // Check browser Notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Compute countdown metrics
  const { 
    unpurchasedCount, 
    totalCount, 
    purchasedCount,
    daysRemaining, 
    hoursRemaining, 
    isApproaching, 
    isTodayOrPast,
    isUrgent,
    formattedDate
  } = useMemo(() => {
    const unpurchased = plan.items.filter(i => !i.purchased).length;
    const total = plan.items.length;
    const purchased = total - unpurchased;

    const eventDateStr = plan.eventDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
    const eventTime = new Date(`${eventDateStr}T12:00:00`).getTime();
    const now = Date.now();
    const diffMs = eventTime - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.max(0, Math.round(diffMs / (1000 * 60 * 60)));

    // Warning triggers: Event is within 3 days AND has unpurchased items
    const approaching = unpurchased > 0 && diffDays <= 3;
    const todayOrPast = diffDays <= 0;
    const urgent = unpurchased > 0 && diffDays <= 1;

    const dateObj = new Date(`${eventDateStr}T12:00:00`);
    const dateFormatted = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      : eventDateStr;

    return {
      unpurchasedCount: unpurchased,
      totalCount: total,
      purchasedCount: purchased,
      daysRemaining: diffDays,
      hoursRemaining: diffHours,
      isApproaching: approaching,
      isTodayOrPast: todayOrPast,
      isUrgent: urgent,
      formattedDate: dateFormatted
    };
  }, [plan.items, plan.eventDate]);

  // Handle local browser desktop notification
  const triggerBrowserNotification = useCallback((title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=128&auto=format&fit=crop&q=80',
          badge: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=128&auto=format&fit=crop&q=80',
          tag: 'cymbal-store-run-warning'
        });
      } catch (e) {
        console.warn('Browser notification error:', e);
      }
    }
  }, []);

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        if (perm === 'granted') {
          triggerBrowserNotification(
            '🔔 CymbalMart Shopping Alerts Enabled',
            `You will receive alerts when ${plan.title} event date is approaching with unpurchased items.`
          );
        }
      } catch (e) {
        console.warn('Could not request notification permission', e);
      }
    }
  };

  // Trigger notification when approaching
  useEffect(() => {
    if (isApproaching && !hasSentBrowserNotification && notificationPermission === 'granted') {
      const title = isUrgent 
        ? `🚨 Urgent: ${plan.title} is ${daysRemaining <= 0 ? 'Today' : 'Tomorrow'}!`
        : `⚠️ Store Run Reminder: ${plan.title} is in ${daysRemaining} days`;
      
      const body = `${unpurchasedCount} of ${totalCount} items still need to be purchased in store or ordered for curbside pickup.`;
      triggerBrowserNotification(title, body);
      setHasSentBrowserNotification(true);
    }
  }, [isApproaching, isUrgent, daysRemaining, unpurchasedCount, totalCount, plan.title, notificationPermission, hasSentBrowserNotification, triggerBrowserNotification]);

  // Handle Snooze
  const handleSnooze = (minutes: number) => {
    setIsSnoozed(true);
    setSnoozeUntil(Date.now() + minutes * 60 * 1000);
    setTimeout(() => {
      setIsSnoozed(false);
      setSnoozeUntil(null);
    }, minutes * 60 * 1000);
  };

  // If dismissed or all items are purchased or not approaching, render minimal pill or null
  if (unpurchasedCount === 0) {
    return null;
  }

  if (isDismissed || isSnoozed) {
    // Show compact floating status pill so user can restore if wanted
    return (
      <div className="fixed bottom-20 right-6 z-30">
        <button
          onClick={() => {
            setIsDismissed(false);
            setIsSnoozed(false);
          }}
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-amber-400/40 flex items-center gap-2 transition-all animate-fadeIn"
          title="Restore Store Run Warning Toast"
        >
          <AlertTriangle className="w-4 h-4 text-amber-200 animate-pulse" />
          <span>{unpurchasedCount} Items Unpurchased • Event {daysRemaining <= 0 ? 'Today' : `in ${daysRemaining}d`}</span>
        </button>
      </div>
    );
  }

  // Determine styling based on urgency
  const bannerBg = isUrgent
    ? 'bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-rose-500/50 text-white shadow-rose-950/40'
    : 'bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-amber-500/50 text-white shadow-amber-950/40';

  const badgeBg = isUrgent
    ? 'bg-rose-500 text-white animate-pulse'
    : 'bg-amber-500 text-slate-950';

  return (
    <aside 
      aria-label="Event date approaching store run warning toast"
      id="event-date-warning-toast" 
      className={`relative z-30 rounded-3xl border p-4 sm:p-5 shadow-xl transition-all duration-300 ${bannerBg}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Alert Icon, Title, and Countdown Badge */}
        <div className="flex items-start gap-3.5 min-w-0">
          <div className={`p-3 rounded-2xl shrink-0 ${isUrgent ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
            <BellRing className="w-6 h-6 animate-bounce-short" />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${badgeBg}`}>
                {isTodayOrPast ? '🚨 Event Day Alert' : isUrgent ? '⚠️ Happening Tomorrow' : '⏳ Approaching Date'}
              </span>

              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>{formattedDate} ({daysRemaining <= 0 ? 'Today!' : daysRemaining === 1 ? '1 day left' : `${daysRemaining} days left`})</span>
              </span>

              {/* Quick Date Change Trigger */}
              <button
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className="text-[11px] text-sky-400 hover:text-sky-300 underline font-medium"
              >
                Change Date
              </button>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
              {plan.title}: <span className={isUrgent ? 'text-rose-300' : 'text-amber-300'}>{unpurchasedCount} of {totalCount} items</span> are not yet marked as purchased!
            </h3>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Your party is fast approaching. Ensure you have all essentials ready in your cart before store aisles get busy or order ahead with 2-hour express pickup.
            </p>
          </div>
        </div>

        {/* Right Side: Quick Resolution Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5 shrink-0 self-end lg:self-auto">
          {/* Action 1: Jump directly to In-Store Run View */}
          <button
            id="toast-open-storerun-btn"
            onClick={onNavigateToStoreRun}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Open In-Store Mode</span>
          </button>

          {/* Action 2: 1-Click Express Curbside Checkout */}
          <button
            id="toast-express-checkout-btn"
            onClick={onOpenCheckout}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order Express Pickup</span>
          </button>

          {/* Action 3: Mark all as purchased */}
          <button
            id="toast-mark-purchased-btn"
            onClick={() => onBulkCheckPurchased(true)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Mark all current items as purchased"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Mark All Done</span>
          </button>

          {/* Browser Notification Permission Button if not granted */}
          {notificationPermission !== 'granted' && typeof window !== 'undefined' && 'Notification' in window && (
            <button
              onClick={requestNotificationPermission}
              className="px-2.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-800 text-sky-300 border border-sky-500/30 transition-colors flex items-center gap-1"
              title="Enable Desktop Browser Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Enable Browser Push</span>
            </button>
          )}

          {/* Snooze button */}
          <button
            onClick={() => handleSnooze(30)}
            className="px-2.5 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
            title="Snooze warning for 30 minutes"
          >
            Snooze (30m)
          </button>

          {/* Dismiss button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Date Adjuster Popover */}
      {isDatePickerOpen && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-3 animate-fadeIn text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            Quick Event Date Adjuster:
          </span>

          {/* Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                onUpdateEventDate(today);
                setIsDatePickerOpen(false);
              }}
              className="px-2.5 py-1 bg-rose-950 text-rose-200 border border-rose-700/60 rounded-lg hover:bg-rose-900 font-medium"
            >
              ⚡ Today ({new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })})
            </button>

            <button
              onClick={() => {
                const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
                onUpdateEventDate(tomorrow);
                setIsDatePickerOpen(false);
              }}
              className="px-2.5 py-1 bg-amber-950 text-amber-200 border border-amber-700/60 rounded-lg hover:bg-amber-900 font-medium"
            >
              🔥 Tomorrow
            </button>

            <button
              onClick={() => {
                const in2Days = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
                onUpdateEventDate(in2Days);
                setIsDatePickerOpen(false);
              }}
              className="px-2.5 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg hover:bg-slate-700 font-medium"
            >
              In 2 Days
            </button>

            <button
              onClick={() => {
                const nextSat = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0];
                onUpdateEventDate(nextSat);
                setIsDatePickerOpen(false);
              }}
              className="px-2.5 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg hover:bg-slate-700 font-medium"
            >
              This Weekend
            </button>
          </div>

          {/* Custom Date Input */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={plan.eventDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                if (e.target.value) {
                  onUpdateEventDate(e.target.value);
                  setIsDatePickerOpen(false);
                }
              }}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-sky-400 text-xs"
            />
          </div>
        </div>
      )}
    </aside>
  );
};
