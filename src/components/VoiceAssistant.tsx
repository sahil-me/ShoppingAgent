import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PartyPlan, ShoppingItem, PartyCategory } from '../types';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Check, 
  X, 
  HelpCircle, 
  Radio, 
  ChevronUp, 
  ChevronDown, 
  ShoppingBag, 
  DollarSign, 
  CheckSquare, 
  Zap, 
  Clock, 
  Wand2,
  Flame,
  ArrowRight,
  UtensilsCrossed,
  Calculator
} from 'lucide-react';

interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export interface VoiceAssistantProps {
  plan: PartyPlan;
  activeTab: 'shopping' | 'calculations' | 'recipes' | 'store-run';
  onNavigateTab: (tab: 'shopping' | 'calculations' | 'recipes' | 'store-run') => void;
  onSelectCategory: (category: string) => void;
  onTogglePurchased: (itemId: string) => void;
  onBulkTogglePurchased: (markPurchased: boolean) => void;
  onUpdateItem: (item: ShoppingItem) => void;
  onDeleteItem: (itemId: string) => void;
  onUpdateTargetBudget: (newBudget: number) => void;
  onOpenAlignBudget: () => void;
  onOpenCheckout: () => void;
  onCloseCheckout?: () => void;
  onOpenWizard: () => void;
  onOpenExport: () => void;
  onOpenSubstitution: (item: ShoppingItem) => void;
  onOpenAddItemModal: () => void;
  isListeningExternal?: boolean;
  onToggleListeningExternal?: () => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  plan,
  activeTab,
  onNavigateTab,
  onSelectCategory,
  onTogglePurchased,
  onBulkTogglePurchased,
  onUpdateItem,
  onDeleteItem,
  onUpdateTargetBudget,
  onOpenAlignBudget,
  onOpenCheckout,
  onCloseCheckout,
  onOpenWizard,
  onOpenExport,
  onOpenSubstitution,
  onOpenAddItemModal
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);
  const [transcript, setTranscript] = useState<string>('');
  const [lastAction, setLastAction] = useState<string>('');
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [activeInterimText, setActiveInterimText] = useState<string>('');
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Speak response back to user
  const speakFeedback = useCallback((text: string) => {
    if (!voiceFeedbackEnabled || !synthRef.current) return;
    try {
      synthRef.current.cancel(); // Cancel previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }, [voiceFeedbackEnabled]);

  // Fuzzy search item in current plan
  const findItemByFuzzyName = useCallback((query: string): ShoppingItem | undefined => {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return undefined;

    // Direct substring or exact match
    let match = plan.items.find(i => i.name.toLowerCase().includes(cleanQuery));
    if (match) return match;

    // Tokenized match
    const tokens = cleanQuery.split(' ').filter(t => t.length > 2);
    for (const token of tokens) {
      match = plan.items.find(i => i.name.toLowerCase().includes(token));
      if (match) return match;
    }

    return undefined;
  }, [plan.items]);

  // Process and execute recognized voice command
  const processVoiceCommand = useCallback((rawText: string) => {
    const text = rawText.toLowerCase().trim();
    if (!text) return;

    setTranscript(rawText);

    // 1. Navigation Commands
    if (text.includes('go to shopping') || text.includes('open shopping list') || text.includes('show list') || text.includes('view list') || text.includes('shopping list')) {
      onNavigateTab('shopping');
      setLastAction('Switched to Curated Shopping List view');
      speakFeedback('Showing your shopping list.');
      return;
    }

    if (text.includes('go to store run') || text.includes('in store mode') || text.includes('store checklist') || text.includes('aisle mode') || text.includes('store run') || text.includes('aisle')) {
      onNavigateTab('store-run');
      setLastAction('Switched to Aisle & In-Store mode');
      speakFeedback('Switched to in-store aisle checklist mode.');
      return;
    }

    if (text.includes('calculations') || text.includes('formulas') || text.includes('drink math') || text.includes('food math')) {
      onNavigateTab('calculations');
      setLastAction('Switched to Drink & Food Formulas');
      speakFeedback('Opening beverage and portion calculations.');
      return;
    }

    if (text.includes('recipes') || text.includes('batch recipes') || text.includes('cocktails') || text.includes('cook')) {
      onNavigateTab('recipes');
      setLastAction('Switched to Batch Recipes view');
      speakFeedback('Showing batch cocktail and food recipes.');
      return;
    }

    // 2. Department Category Filter Commands
    if (text.includes('show produce') || text.includes('filter produce') || text.includes('show groceries')) {
      onSelectCategory('groceries');
      setLastAction('Filtered to Produce & Groceries');
      speakFeedback('Filtered to produce and deli groceries.');
      return;
    }

    if (text.includes('show drinks') || text.includes('show beverages') || text.includes('show wine') || text.includes('show alcohol') || text.includes('show bar')) {
      onSelectCategory('beverages');
      setLastAction('Filtered to Beverages & Drinks');
      speakFeedback('Filtered to beverages and drinks.');
      return;
    }

    if (text.includes('show bakery') || text.includes('show bread') || text.includes('show cake') || text.includes('show desserts')) {
      onSelectCategory('bakery');
      setLastAction('Filtered to Bakery');
      speakFeedback('Filtered to bakery.');
      return;
    }

    if (text.includes('show decor') || text.includes('show decorations') || text.includes('show vibe')) {
      onSelectCategory('decor');
      setLastAction('Filtered to Party Decor');
      speakFeedback('Filtered to party decor.');
      return;
    }

    if (text.includes('show tableware') || text.includes('show plates') || text.includes('show cups') || text.includes('show cutlery')) {
      onSelectCategory('tableware');
      setLastAction('Filtered to Tableware');
      speakFeedback('Filtered to tableware and paper goods.');
      return;
    }

    if (text.includes('show essentials') || text.includes('show ice') || text.includes('show trash bags')) {
      onSelectCategory('essentials');
      setLastAction('Filtered to Essentials & Ice');
      speakFeedback('Filtered to essentials.');
      return;
    }

    if (text.includes('show all') || text.includes('all departments') || text.includes('clear filter')) {
      onSelectCategory('all');
      setLastAction('Cleared category filters');
      speakFeedback('Showing all departments.');
      return;
    }

    // 3. Checkout & Ordering Hands-free
    if (text.includes('open checkout') || text.includes('express checkout') || text.includes('checkout now') || text.includes('order pickup') || text.includes('ready to buy') || text.includes('refine and checkout')) {
      onOpenCheckout();
      setLastAction('Opened Express Checkout');
      speakFeedback('Opening express store checkout.');
      return;
    }

    if (text.includes('close checkout') || text.includes('cancel checkout') || text.includes('dismiss checkout')) {
      if (onCloseCheckout) onCloseCheckout();
      setLastAction('Closed Checkout');
      speakFeedback('Closed checkout.');
      return;
    }

    // 4. Budget Optimization & Auto-Alignment
    if (text.includes('auto align') || text.includes('align budget') || text.includes('optimize budget') || text.includes('trim budget') || text.includes('cut cost') || text.includes('save money')) {
      onOpenAlignBudget();
      setLastAction('Opened 1-Click Budget Auto-Align');
      speakFeedback('Opening budget optimizer to balance your target spend.');
      return;
    }

    // Change Budget: "Set budget to 250" or "Change budget to 300 dollars"
    const budgetMatch = text.match(/(?:set|change|update|make)\s+(?:target\s+)?budget\s+(?:to\s+)?\$?(\d+)/i) ||
                        text.match(/budget\s+(?:to\s+)?\$?(\d+)/i);
    if (budgetMatch && budgetMatch[1]) {
      const newB = parseFloat(budgetMatch[1]);
      if (newB > 0) {
        onUpdateTargetBudget(newB);
        setLastAction(`Target budget set to $${newB}`);
        speakFeedback(`Target budget updated to $${newB}. Recalculating allocations.`);
        return;
      }
    }

    // 5. Bulk Cart Checking
    if (text.includes('check all') || text.includes('mark all bought') || text.includes('cart all') || text.includes('got everything')) {
      onBulkTogglePurchased(true);
      setLastAction('Checked all items as carted');
      speakFeedback('Marked all items as added to cart.');
      return;
    }

    if (text.includes('uncheck all') || text.includes('reset items') || text.includes('clear cart')) {
      onBulkTogglePurchased(false);
      setLastAction('Reset all items to needed');
      speakFeedback('Reset all items back to needed.');
      return;
    }

    // 6. Check / Uncheck Single Item Hands-Free
    // Examples: "Check off wine", "Mark ice as bought", "Got the bread", "Uncheck napkins"
    const checkMatch = text.match(/(?:check\s+off|mark|check|got|bought|purchased|have)\s+(?:the\s+)?(.+)/i);
    if (checkMatch && !text.includes('all')) {
      const targetQuery = checkMatch[1]
        .replace(/(as bought|as purchased|as carted|off the list|off|done|in cart)/gi, '')
        .trim();
      
      const item = findItemByFuzzyName(targetQuery);
      if (item) {
        if (!item.purchased) {
          onTogglePurchased(item.id);
          setLastAction(`Carted: ${item.name}`);
          speakFeedback(`Checked off ${item.name}.`);
        } else {
          setLastAction(`${item.name} is already in cart`);
          speakFeedback(`${item.name} is already carted.`);
        }
        return;
      }
    }

    const uncheckMatch = text.match(/(?:uncheck|need|reset|unmark)\s+(?:the\s+)?(.+)/i);
    if (uncheckMatch && !text.includes('all')) {
      const targetQuery = uncheckMatch[1].trim();
      const item = findItemByFuzzyName(targetQuery);
      if (item) {
        if (item.purchased) {
          onTogglePurchased(item.id);
          setLastAction(`Unchecked: ${item.name}`);
          speakFeedback(`Marked ${item.name} as needed.`);
        } else {
          setLastAction(`${item.name} is already marked needed`);
          speakFeedback(`${item.name} is already needed.`);
        }
        return;
      }
    }

    // 7. Quantity Adjustments Hands-Free
    // Examples: "Add 2 more ice", "Increase napkins", "Double the wine", "Decrease cheese"
    if (text.includes('more') || text.includes('increase') || text.includes('add one more') || text.includes('double')) {
      const cleaned = text.replace(/(increase|add more|more of|double|add one more|add)\s*(the)?/gi, '').trim();
      const item = findItemByFuzzyName(cleaned);
      if (item) {
        const step = text.includes('double') ? item.quantity : 1;
        const nextQty = item.quantity + step;
        const unitPrice = (item.estimatedCost && item.quantity > 0) ? item.estimatedCost / item.quantity : 4.99;
        const newCost = Number((unitPrice * nextQty).toFixed(2));
        
        onUpdateItem({
          ...item,
          quantity: nextQty,
          estimatedCost: newCost
        });
        setLastAction(`Increased ${item.name} to ${nextQty} ${item.unit}`);
        speakFeedback(`Increased ${item.name} to ${nextQty} ${item.unit}. New cost is $${newCost.toFixed(2)}.`);
        return;
      }
    }

    if (text.includes('less') || text.includes('decrease') || text.includes('reduce')) {
      const cleaned = text.replace(/(decrease|reduce|less of|less)\s*(the)?/gi, '').trim();
      const item = findItemByFuzzyName(cleaned);
      if (item) {
        const nextQty = Math.max(0, item.quantity - 1);
        const unitPrice = (item.estimatedCost && item.quantity > 0) ? item.estimatedCost / item.quantity : 4.99;
        const newCost = Number((unitPrice * nextQty).toFixed(2));
        
        onUpdateItem({
          ...item,
          quantity: nextQty,
          estimatedCost: newCost,
          runningLow: nextQty < 1 ? true : (item as any).runningLow
        });
        setLastAction(`Decreased ${item.name} to ${nextQty}`);
        speakFeedback(`Decreased ${item.name} to ${nextQty}.`);
        return;
      }
    }

    // 8. Delete / Remove Item
    if (text.includes('delete') || text.includes('remove') || text.includes('drop')) {
      const cleaned = text.replace(/(delete|remove|drop)\s*(the)?/gi, '').trim();
      const item = findItemByFuzzyName(cleaned);
      if (item) {
        onDeleteItem(item.id);
        setLastAction(`Deleted: ${item.name}`);
        speakFeedback(`Removed ${item.name} from the shopping list.`);
        return;
      }
    }

    // 9. Quick Add Item via Voice: "Add 2 packs of tortillas for 4 dollars" or "Add guacamole"
    if (text.startsWith('add ') || text.startsWith('add item ')) {
      const addContent = text.replace(/^add\s+(item\s+)?/i, '').trim();
      
      // Try to parse quantity and price
      let quantity = 1;
      let unit = 'item';
      let estimatedCost = 5.99;
      let itemName = addContent;

      // Extract price if spoken (e.g., "for 7 dollars" or "for $8.50")
      const priceMatch = addContent.match(/for\s+\$?(\d+(?:\.\d{1,2})?)\s*(?:dollars|bucks)?/i);
      if (priceMatch) {
        estimatedCost = parseFloat(priceMatch[1]);
        itemName = itemName.replace(priceMatch[0], '').trim();
      }

      // Extract quantity (e.g., "3 bags of ice" or "2 bottles of wine")
      const qtyMatch = itemName.match(/^(\d+)\s+([a-zA-Z]+)\s+of\s+(.+)/i);
      if (qtyMatch) {
        quantity = parseInt(qtyMatch[1]);
        unit = qtyMatch[2];
        itemName = qtyMatch[3];
      } else {
        const simpleQtyMatch = itemName.match(/^(\d+)\s+(.+)/i);
        if (simpleQtyMatch) {
          quantity = parseInt(simpleQtyMatch[1]);
          itemName = simpleQtyMatch[2];
        }
      }

      // Determine appropriate category
      let category: PartyCategory = 'groceries';
      const itemLower = itemName.toLowerCase();
      if (itemLower.includes('wine') || itemLower.includes('beer') || itemLower.includes('drink') || itemLower.includes('juice') || itemLower.includes('soda') || itemLower.includes('water')) {
        category = 'beverages';
      } else if (itemLower.includes('cake') || itemLower.includes('bread') || itemLower.includes('cookie') || itemLower.includes('baguette') || itemLower.includes('pastry')) {
        category = 'bakery';
      } else if (itemLower.includes('cup') || itemLower.includes('plate') || itemLower.includes('napkin') || itemLower.includes('fork') || itemLower.includes('tableware')) {
        category = 'tableware';
      } else if (itemLower.includes('balloon') || itemLower.includes('banner') || itemLower.includes('streamer') || itemLower.includes('decor')) {
        category = 'decor';
      } else if (itemLower.includes('ice') || itemLower.includes('trash') || itemLower.includes('bag')) {
        category = 'essentials';
      }

      const newItem: ShoppingItem = {
        id: `voice-item-${Date.now()}`,
        name: itemName.charAt(0).toUpperCase() + itemName.slice(1),
        category,
        quantity,
        unit,
        estimatedCost,
        store: 'CymbalMart Supercenter',
        aisle: category === 'beverages' ? 'Aisle 4: Beverages' : 'Aisle 1: Fresh Produce & Deli',
        priority: 'recommended',
        purchased: false,
        notes: 'Added via Hands-Free Voice Control'
      };

      onUpdateItem(newItem);
      setLastAction(`Added "${newItem.name}" (${quantity} ${unit} - $${estimatedCost.toFixed(2)})`);
      speakFeedback(`Added ${quantity} ${unit} of ${newItem.name} for $${estimatedCost.toFixed(2)}. Budget recalculated.`);
      return;
    }

    // 10. Smart Substitutions: "Find substitute for cheese"
    if (text.includes('substitute') || text.includes('swap') || text.includes('alternative')) {
      const cleaned = text.replace(/(find\s+)?(substitute|swap|alternative)\s*(for)?\s*(the)?/gi, '').trim();
      const item = findItemByFuzzyName(cleaned);
      if (item) {
        onOpenSubstitution(item);
        setLastAction(`Opened AI Substitutions for ${item.name}`);
        speakFeedback(`Finding smart store-brand substitutions for ${item.name}.`);
        return;
      }
    }

    // 11. Wizard / Event Setup
    if (text.includes('define event') || text.includes('event wizard') || text.includes('change theme') || text.includes('new party')) {
      onOpenWizard();
      setLastAction('Opened Event Setup Wizard');
      speakFeedback('Opening event setup wizard.');
      return;
    }

    // 12. Export list
    if (text.includes('export list') || text.includes('print list') || text.includes('share list')) {
      onOpenExport();
      setLastAction('Opened Export & Share modal');
      speakFeedback('Opening export options.');
      return;
    }

    // 13. Help command
    if (text.includes('help') || text.includes('what can i say') || text.includes('commands')) {
      setShowHelp(true);
      setLastAction('Showing voice command guide');
      speakFeedback('You can say commands like: check off wine, add 2 bags of ice, go to store run, auto align budget, or open checkout.');
      return;
    }

    // Fallback: unrecognized command
    setLastAction(`Command recognized: "${rawText}"`);
    speakFeedback(`I heard "${rawText}". Say "help" to view voice commands.`);
  }, [
    plan.items,
    findItemByFuzzyName,
    speakFeedback,
    onNavigateTab,
    onSelectCategory,
    onOpenCheckout,
    onCloseCheckout,
    onOpenAlignBudget,
    onUpdateTargetBudget,
    onBulkTogglePurchased,
    onTogglePurchased,
    onUpdateItem,
    onDeleteItem,
    onOpenSubstitution,
    onOpenWizard,
    onOpenExport
  ]);

  // Start / Stop Speech Recognition
  const toggleListening = useCallback(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSpeechSupported(false);
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setIsListening(false);
      setActiveInterimText('');
      setLastAction('Microphone paused');
    } else {
      try {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setLastAction('Listening for hands-free commands...');
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          setActiveInterimText(interimTranscript);

          if (finalTranscript.trim()) {
            setActiveInterimText('');
            processVoiceCommand(finalTranscript.trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            setLastAction('Microphone permission blocked. Please enable microphone access.');
            setIsListening(false);
          }
        };

        recognition.onend = () => {
          // If still marked as listening, restart (continuous loop for hands-free shopping)
          if (isListening && recognitionRef.current) {
            try {
              recognition.start();
            } catch (e) {
              setIsListening(false);
            }
          } else {
            setIsListening(false);
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        setIsListening(false);
      }
    }
  }, [isListening, processVoiceCommand]);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div id="voice-control-container" className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 font-sans selection:bg-sky-500/20 max-w-sm sm:max-w-md w-full px-3 sm:px-0">
      {/* Expanded Voice Command Dashboard & Live Transcription Panel */}
      {isExpanded && (
        <div 
          id="voice-dashboard-panel"
          className="bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-700/80 w-full animate-scaleUp space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-2xl ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-sky-500/20 text-sky-400'}`}>
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black flex items-center gap-1.5">
                  <span>Hands-Free Voice Controller</span>
                  <span className="text-[9px] bg-sky-500/20 text-sky-300 font-bold px-1.5 py-0.2 rounded border border-sky-400/30">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Complete planning, carting, budget alignment & checkout hands-free
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setVoiceFeedbackEnabled(!voiceFeedbackEnabled)}
                className={`p-1.5 rounded-xl transition-colors ${
                  voiceFeedbackEnabled ? 'text-sky-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'
                }`}
                title={voiceFeedbackEnabled ? 'Voice responses active (Click to mute)' : 'Voice responses muted'}
              >
                {voiceFeedbackEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                title="Voice Command Cheatsheet"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Listening / Audio Waveform / Transcript */}
          <div className="bg-slate-950/90 rounded-2xl p-3.5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-slate-600'}`} />
                <span>{isListening ? 'Listening for your voice...' : 'Mic is idle'}</span>
              </span>
              {activeInterimText && (
                <span className="text-[10px] text-amber-400 font-mono italic animate-pulse">
                  Recognizing...
                </span>
              )}
            </div>

            {/* Live Transcript Display */}
            <div className="min-h-12 flex items-center justify-start text-xs font-medium text-slate-200">
              {activeInterimText ? (
                <span className="text-amber-300 font-semibold italic">"{activeInterimText}"</span>
              ) : transcript ? (
                <span className="text-slate-300">"{transcript}"</span>
              ) : (
                <span className="text-slate-500 italic">Say a command like "Check off wine" or "Go to store run"...</span>
              )}
            </div>

            {/* Last Execution Outcome Alert */}
            {lastAction && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] font-bold text-emerald-400">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{lastAction}</span>
              </div>
            )}
          </div>

          {/* Quick Action Suggestion Chips (Click or Say) */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Popular Voice Commands (Tap to Try)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Check off wine',
                'Add 2 bags of ice',
                'Go to store run',
                'Auto align budget',
                'Show produce',
                'Open checkout',
                'Increase napkins',
                'Help'
              ].map(cmd => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => processVoiceCommand(cmd)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white rounded-xl text-[11px] font-semibold border border-slate-700 transition-all flex items-center gap-1"
                >
                  <Zap className="w-2.5 h-2.5 text-sky-400" />
                  <span>"{cmd}"</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cheatsheet Modal Section if Help Toggled */}
          {showHelp && (
            <div className="p-3 bg-slate-800/80 rounded-2xl text-[11px] space-y-2 border border-slate-700 animate-fadeIn">
              <div className="font-bold text-sky-300 flex items-center justify-between">
                <span>Hands-Free Command Reference</span>
                <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </div>
              <ul className="space-y-1 text-slate-300">
                <li>• <strong>Navigation:</strong> "Go to shopping list", "Go to store run", "Show calculations", "Show recipes"</li>
                <li>• <strong>Carting:</strong> "Check off [item]", "Mark [item] as bought", "Got the bread", "Check all items"</li>
                <li>• <strong>Add Items:</strong> "Add [name] for [price]", "Add 3 bags of ice", "Add salsa for 4 dollars"</li>
                <li>• <strong>Quantity:</strong> "Increase [item]", "Add more [item]", "Decrease [item]", "Double the wine"</li>
                <li>• <strong>Filters:</strong> "Show produce", "Show beverages", "Show bakery", "Show all"</li>
                <li>• <strong>Budget & Cart:</strong> "Auto align budget", "Set budget to 250", "Open checkout"</li>
                <li>• <strong>Swaps & Wizard:</strong> "Substitute cheese", "Define event", "Export list"</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Persistent Floating Micro Pill / Toggle Button */}
      <div className="flex items-center gap-2">
        {/* Quick status pill when listening */}
        {isListening && !isExpanded && (
          <div 
            onClick={() => setIsExpanded(true)}
            className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-2xl shadow-xl border border-rose-500/50 flex items-center gap-2 cursor-pointer hover:bg-slate-800 transition-all text-xs font-semibold animate-pulse"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="truncate max-w-[140px] sm:max-w-[200px]">
              {activeInterimText || transcript || 'Listening...'}
            </span>
          </div>
        )}

        {/* Expand/Collapse Chevron Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl shadow-lg border border-slate-200 transition-transform active:scale-95 flex items-center justify-center"
          title={isExpanded ? 'Collapse voice control panel' : 'Open voice control commands'}
        >
          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>

        {/* Main Microphone Action Button */}
        <button
          type="button"
          id="voice-control-mic-btn"
          aria-label={isListening ? 'Stop voice control' : 'Start hands-free voice control'}
          onClick={toggleListening}
          className={`px-4 py-3 rounded-2xl shadow-2xl transition-all flex items-center gap-2.5 font-bold text-xs sm:text-sm active:scale-95 ${
            isListening
              ? 'bg-rose-600 hover:bg-rose-500 text-white ring-4 ring-rose-400/40 shadow-rose-600/30'
              : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-sky-600/30'
          }`}
          title={isListening ? 'Click to pause voice control' : 'Click to start hands-free voice control'}
        >
          {isListening ? (
            <>
              <Mic className="w-5 h-5 animate-bounce" />
              <span>Listening Hands-Free</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              <span>Voice Control</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
