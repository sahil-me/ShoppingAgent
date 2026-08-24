import React, { useState } from 'react';
import { PartyPlan } from '../types';
import { Share2, X, Copy, Check, Printer, FileText, Download } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PartyPlan;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  plan
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build clean formatted text
  const generateFormattedText = () => {
    let txt = `🎉 PARTY SHOPPING LIST: ${plan.title.toUpperCase()}\n`;
    txt += `📅 Theme: ${plan.theme} | Guests: ${plan.guestCount.total} (${plan.guestCount.adults} adults, ${plan.guestCount.kids} kids)\n`;
    txt += `💰 Budget: $${plan.targetBudget} | Est Total: $${plan.items.reduce((a, b) => a + (b.estimatedCost || 0), 0).toFixed(2)}\n\n`;

    // Group by store
    const storeMap: Record<string, typeof plan.items> = {};
    plan.items.forEach(i => {
      const store = i.store || 'Supermarket';
      if (!storeMap[store]) storeMap[store] = [];
      storeMap[store].push(i);
    });

    Object.entries(storeMap).forEach(([store, items]) => {
      txt += `📍 ${store.toUpperCase()} (${items.length} items):\n`;
      items.forEach(it => {
        txt += `  [${it.purchased ? 'X' : ' '}] ${it.name} - ${it.quantity} ${it.unit} (~$${(it.estimatedCost || 0).toFixed(2)})${it.notes ? ` (${it.notes})` : ''}\n`;
      });
      txt += `\n`;
    });

    if (plan.drinkCalc) {
      txt += `🍹 BAR & DRINK GUIDE:\n`;
      txt += `  • Wine: ~${plan.drinkCalc.wineBottlesEstimate || 5} bottles\n`;
      txt += `  • Beer: ~${plan.drinkCalc.beerCasesEstimate || 1} case\n`;
      txt += `  • Ice: ~${plan.drinkCalc.icePoundsNeeded || 20} lbs\n\n`;
    }

    txt += `Generated with Party Planner Shopping Agent`;
    return txt;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateFormattedText());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${plan.title.replace(/\s+/g, '-').toLowerCase()}-shopping-plan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="export-modal" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Export & Print Shopping List
              </h3>
              <p className="text-[11px] text-slate-500">
                Share via text, WhatsApp, print, or download JSON
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save JSON</span>
          </button>
        </div>

        {/* Text Preview */}
        <div className="p-5 overflow-y-auto flex-1 font-mono text-xs text-slate-800 bg-slate-50/50 whitespace-pre-wrap leading-relaxed border-t border-slate-100">
          {generateFormattedText()}
        </div>
      </div>
    </div>
  );
};
