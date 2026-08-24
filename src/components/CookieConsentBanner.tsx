import React from 'react';
import { ShieldCheck, Cookie, Settings } from 'lucide-react';

interface CookieConsentBannerProps {
  onAccept: () => void;
  onOpenPreferences: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onAccept,
  onOpenPreferences
}) => {
  return (
    <div 
      id="cookie-consent-banner"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40 bg-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-2xl border border-slate-700/80 animate-slideUp font-sans"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="space-y-1 flex-1">
          <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
            <span>Your Privacy & Session Storage</span>
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
            CymbalMart uses local storage to keep your party planning drafts, dietary preferences, and cart selections private to your browser session.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              id="cookie-accept-btn"
              onClick={onAccept}
              className="px-3.5 py-1.5 bg-sky-400 hover:bg-sky-300 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Accept & Continue
            </button>
            <button
              type="button"
              onClick={onOpenPreferences}
              className="px-3 py-1.5 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Settings className="w-3 h-3" />
              <span>Customize</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
