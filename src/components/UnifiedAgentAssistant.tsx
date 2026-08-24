import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PartyPlan, ShoppingItem, ChatMessage } from '../types';
import { 
  BotMessageSquare, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  X, 
  Send, 
  Radio, 
  HelpCircle, 
  Zap, 
  TrendingDown, 
  ShoppingBag, 
  DollarSign, 
  ChevronRight, 
  Check, 
  Wine, 
  Loader2,
  Lightbulb,
  CornerDownLeft,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export interface UnifiedAgentAssistantProps {
  plan: PartyPlan | null;
  activeTab?: 'shopping' | 'calculations' | 'recipes' | 'store-run';
  onNavigateTab?: (tab: 'shopping' | 'calculations' | 'recipes' | 'store-run') => void;
  onSelectCategory?: (category: string) => void;
  onTogglePurchased?: (itemId: string) => void;
  onBulkTogglePurchased?: (markPurchased: boolean) => void;
  onUpdateItem?: (item: ShoppingItem) => void;
  onDeleteItem?: (itemId: string) => void;
  onUpdateTargetBudget?: (newBudget: number) => void;
  onOpenAlignBudget?: () => void;
  onOpenCheckout?: () => void;
  onOpenWizard?: () => void;
  onOpenExport?: () => void;
  onOpenSubstitution?: (item: ShoppingItem) => void;
  onOpenAddItemModal?: () => void;
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onApplyAction?: (action: any) => void;
  isChatLoading?: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialMode?: 'chat' | 'voice' | 'advice';
}

export const UnifiedAgentAssistant: React.FC<UnifiedAgentAssistantProps> = ({
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
  onOpenWizard,
  onOpenExport,
  onOpenSubstitution,
  onOpenAddItemModal,
  chatHistory,
  onSendMessage,
  onApplyAction,
  isChatLoading = false,
  isOpen,
  setIsOpen,
  initialMode = 'chat'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'voice' | 'advice'>(initialMode);
  const [inputText, setInputText] = useState('');
  
  // Voice State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceSupported, setVoiceSupported] = useState<boolean>(true);
  const [transcript, setTranscript] = useState<string>('');
  const [interimText, setInterimText] = useState<string>('');
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState<boolean>(true);
  const [lastVoiceAction, setLastVoiceAction] = useState<string>('');
  const [showVoiceHelp, setShowVoiceHelp] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (isOpen && activeSubTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isOpen, activeSubTab]);

  // Voice feedback
  const speakFeedback = useCallback((text: string) => {
    if (!voiceFeedbackEnabled || !synthRef.current) return;
    try {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }, [voiceFeedbackEnabled]);

  // Fuzzy find item in plan
  const findItemByFuzzy = useCallback((query: string): ShoppingItem | undefined => {
    if (!plan || !plan.items) return undefined;
    const clean = query.toLowerCase().trim();
    if (!clean) return undefined;
    let match = plan.items.find(i => i.name.toLowerCase().includes(clean));
    if (match) return match;
    const tokens = clean.split(' ').filter(t => t.length > 2);
    for (const t of tokens) {
      match = plan.items.find(i => i.name.toLowerCase().includes(t));
      if (match) return match;
    }
    return undefined;
  }, [plan]);

  // Process voice command execution
  const processVoiceCommand = useCallback((raw: string) => {
    const text = raw.toLowerCase().trim();
    if (!text) return;
    let actionDone = '';

    // 1. Navigation
    if (text.includes('go to shopping') || text.includes('show shopping') || text.includes('open shopping')) {
      onNavigateTab?.('shopping');
      actionDone = 'Navigated to Curated Shopping List';
      speakFeedback('Switched to Shopping List.');
    } else if (text.includes('go to store run') || text.includes('show store run') || text.includes('aisle mode') || text.includes('in-store')) {
      onNavigateTab?.('store-run');
      actionDone = 'Navigated to Aisle & In-Store Mode';
      speakFeedback('Opening Aisle and In-Store Mode.');
    } else if (text.includes('calculations') || text.includes('formulas') || text.includes('math')) {
      onNavigateTab?.('calculations');
      actionDone = 'Navigated to Drink & Food Formulas';
      speakFeedback('Opening beverage and food calculation formulas.');
    } else if (text.includes('recipes') || text.includes('batch recipes') || text.includes('signature drinks')) {
      onNavigateTab?.('recipes');
      actionDone = 'Navigated to Signature Batch Recipes';
      speakFeedback('Viewing batch recipes.');
    }

    // 2. Checkout
    else if (text.includes('checkout') || text.includes('buy') || text.includes('order now') || text.includes('open checkout')) {
      onOpenCheckout?.();
      actionDone = 'Opened CymbalMart Express Checkout';
      speakFeedback('Opening CymbalMart express checkout.');
    }

    // 3. Align Budget
    else if (text.includes('align budget') || text.includes('auto align') || text.includes('optimize budget') || text.includes('balance budget')) {
      onOpenAlignBudget?.();
      actionDone = 'Opened 1-Click Budget Alignment';
      speakFeedback('Opening 1-click budget alignment.');
    }

    // 4. Check off item
    else if (text.includes('check off') || text.includes('mark') || text.includes('got the') || text.includes('bought')) {
      const cleanName = text
        .replace('check off', '')
        .replace('mark', '')
        .replace('got the', '')
        .replace('as bought', '')
        .replace('as purchased', '')
        .trim();
      const matched = findItemByFuzzy(cleanName);
      if (matched && onTogglePurchased) {
        onTogglePurchased(matched.id);
        actionDone = `Toggled '${matched.name}' purchased status`;
        speakFeedback(`Marked ${matched.name}.`);
      } else {
        actionDone = `Could not find item matching "${cleanName}"`;
        speakFeedback(`Sorry, I couldn't find ${cleanName} in your list.`);
      }
    }

    // 5. Add custom item
    else if (text.startsWith('add ') && (text.includes('for ') || text.includes('dollars') || text.includes('bucks'))) {
      const match = text.match(/add (.*) for (?:about )?\$?([0-9.]+)/i);
      if (match && onUpdateItem) {
        const name = match[1].trim();
        const cost = parseFloat(match[2]);
        const newItem: ShoppingItem = {
          id: `voice-item-${Date.now()}`,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          category: 'groceries',
          quantity: 1,
          unit: 'item',
          estimatedCost: isNaN(cost) ? 5.99 : cost,
          store: 'CymbalMart Supercenter',
          aisle: 'Aisle 1: General',
          brandTier: 'Cymbal Select',
          priority: 'recommended',
          purchased: false,
          notes: 'Added via Hands-Free Voice Assistant'
        };
        onUpdateItem(newItem);
        actionDone = `Added "${newItem.name}" ($${newItem.estimatedCost.toFixed(2)})`;
        speakFeedback(`Added ${newItem.name} to your cart list.`);
      }
    }

    // 6. Category filters
    else if (text.includes('show produce') || text.includes('show groceries') || text.includes('filter groceries')) {
      onSelectCategory?.('groceries');
      actionDone = 'Filtered to Produce & Groceries';
      speakFeedback('Showing produce and groceries.');
    } else if (text.includes('show beverages') || text.includes('show drinks') || text.includes('filter drinks')) {
      onSelectCategory?.('beverages');
      actionDone = 'Filtered to Beverages & Drinks';
      speakFeedback('Showing beverages and drinks.');
    } else if (text.includes('show all') || text.includes('clear filter')) {
      onSelectCategory?.('all');
      actionDone = 'Reset category filters';
      speakFeedback('Showing all items.');
    }

    // Default fallback: send to AI chat
    else {
      actionDone = `Processed voice request: "${raw}"`;
      onSendMessage(raw);
      setActiveSubTab('chat');
    }

    setLastVoiceAction(actionDone);
  }, [findItemByFuzzy, onNavigateTab, onOpenCheckout, onOpenAlignBudget, onTogglePurchased, onUpdateItem, onSelectCategory, onSendMessage, speakFeedback]);

  // Toggle speech recognition
  const toggleListening = useCallback(() => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
    } else {
      const win = window as IWindow;
      const SpeechClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (!SpeechClass) {
        setVoiceSupported(false);
        alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
        return;
      }

      try {
        const recognition = new SpeechClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setInterimText('');
        };

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const finalTranscript = event.results[i][0].transcript;
              setTranscript(finalTranscript);
              setInterimText('');
              processVoiceCommand(finalTranscript);
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }
          if (currentInterim) {
            setInterimText(currentInterim);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition event error:', event.error);
          if (event.error === 'not-allowed') {
            setIsListening(false);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        setIsListening(false);
      }
    }
  }, [isListening, processVoiceCommand]);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isChatLoading) return;
    const msg = inputText.trim();
    setInputText('');
    onSendMessage(msg);
  };

  const totalCost = plan?.items.reduce((acc, i) => acc + (i.estimatedCost || 0), 0) || 0;
  const targetBudget = plan?.targetBudget || 200;
  const diff = targetBudget - totalCost;
  const isOver = diff < 0;

  return (
    <>
      {/* Unified Floating Action Button Trigger */}
      {!isOpen && (
        <div 
          id="unified-agent-trigger-container"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 font-sans"
        >
          {/* Quick Voice Listening Badge if active */}
          {isListening && (
            <div 
              onClick={() => {
                setActiveSubTab('voice');
                setIsOpen(true);
              }}
              className="bg-slate-900 text-white px-3 py-2 rounded-2xl shadow-xl border border-rose-500/60 flex items-center gap-2 cursor-pointer hover:bg-slate-800 text-xs font-semibold animate-pulse"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="truncate max-w-[140px]">
                {interimText || transcript || 'Listening...'}
              </span>
            </div>
          )}

          {/* Main Agent Assistant Trigger Button */}
          <button
            id="unified-agent-assistant-btn"
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-4 py-3 bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-2xl hover:shadow-sky-500/25 border border-sky-400/30 transition-all flex items-center gap-2.5 active:scale-95 group"
            title="Open CymbalMart AI Shopping Agent & Voice Assistant"
          >
            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </div>
            <span className="font-extrabold">Agent Assistant</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-slate-950/40 px-2 py-0.5 rounded-md font-mono text-sky-200">
              💬 Chat & 🎙️ Voice
            </span>
          </button>
        </div>
      )}

      {/* Unified Agent Assistant Modal / Drawer */}
      {isOpen && (
        <div 
          id="unified-agent-assistant-drawer"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[460px] max-h-[85vh] sm:max-h-[640px] flex flex-col bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700 overflow-hidden font-sans animate-scaleUp"
        >
          {/* Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-slate-950 font-black shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black flex items-center gap-2">
                  <span>Cymbal Shopping Agent</span>
                  {plan && (
                    <span className="text-[9px] bg-sky-500/20 text-sky-300 font-bold px-1.5 py-0.2 rounded border border-sky-400/30 font-mono">
                      ${Math.round(totalCost)} / ${targetBudget}
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {plan ? plan.title : 'Ready to help plan your party'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                title="Close assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub-Tab Switcher: 💬 Chat | 🎙️ Voice | 💡 Advice */}
          <div className="px-3 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveSubTab('chat')}
              className={`flex-1 py-1.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === 'chat'
                  ? 'bg-sky-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BotMessageSquare className="w-3.5 h-3.5" />
              <span>AI Chat</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('voice')}
              className={`flex-1 py-1.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === 'voice'
                  ? isListening ? 'bg-rose-500 text-white shadow-xs animate-pulse' : 'bg-sky-500 text-slate-950 shadow-xs'
                  : isListening ? 'text-rose-400 bg-rose-950/40 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Mode</span>
              {isListening && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('advice')}
              className={`flex-1 py-1.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === 'advice'
                  ? 'bg-sky-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Insights</span>
            </button>
          </div>

          {/* TAB 1: AI Chat */}
          {activeSubTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[380px] min-h-[220px]">
                {chatHistory.map(msg => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-sky-500 text-slate-950 font-medium rounded-tr-xs'
                          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {/* Suggested Action Button */}
                      {msg.suggestedAction && msg.suggestedAction.type !== 'none' && onApplyAction && (
                        <div className="mt-3 pt-2 border-t border-slate-700/80">
                          <button
                            type="button"
                            onClick={() => onApplyAction(msg.suggestedAction)}
                            className="w-full py-2 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>{msg.suggestedAction.label || 'Apply Suggested Update'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 p-3 rounded-2xl w-fit">
                    <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                    <span>Cymbal Shopping Agent is thinking...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-3 py-1.5 bg-slate-950/60 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
                {[
                  'Cut budget by $40',
                  'Suggest signature cocktail',
                  'What ice do I need?',
                  'Align store brand savings'
                ].map(prompt => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => onSendMessage(prompt)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg whitespace-nowrap transition-colors border border-slate-700"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSendChatMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask anything or request budget adjustments..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-400 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isChatLoading}
                  className="p-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 rounded-xl font-bold transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Voice Mode */}
          {activeSubTab === 'voice' && (
            <div className="p-4 space-y-4 max-h-[440px] overflow-y-auto">
              {/* Status Banner */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-slate-600'}`} />
                    <span>{isListening ? 'Listening hands-free...' : 'Microphone is paused'}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setVoiceFeedbackEnabled(!voiceFeedbackEnabled)}
                      className={`p-1.5 rounded-lg ${voiceFeedbackEnabled ? 'text-sky-400' : 'text-slate-500'}`}
                      title={voiceFeedbackEnabled ? 'Voice responses active' : 'Voice responses muted'}
                    >
                      {voiceFeedbackEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowVoiceHelp(!showVoiceHelp)}
                      className="p-1.5 text-slate-400 hover:text-white"
                      title="Cheatsheet"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Transcript */}
                <div className="min-h-10 text-xs text-slate-300 font-medium italic">
                  {interimText ? (
                    <span className="text-amber-300">"{interimText}"</span>
                  ) : transcript ? (
                    <span>"{transcript}"</span>
                  ) : (
                    <span className="text-slate-500">Say a command or tap a suggestion below...</span>
                  )}
                </div>

                {lastVoiceAction && (
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>{lastVoiceAction}</span>
                  </div>
                )}
              </div>

              {/* Big Mic Button */}
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 ${
                    isListening
                      ? 'bg-rose-600 hover:bg-rose-500 text-white ring-8 ring-rose-500/30 animate-pulse'
                      : 'bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white'
                  }`}
                >
                  <Mic className="w-8 h-8" />
                </button>
                <span className="text-xs font-bold text-slate-300">
                  {isListening ? 'Tap to Pause Voice' : 'Tap to Start Hands-Free Voice'}
                </span>
              </div>

              {/* Popular Voice Commands */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Quick Voice Commands
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Check off wine',
                    'Add 2 bags of ice',
                    'Go to store run',
                    'Auto align budget',
                    'Show produce',
                    'Open checkout'
                  ].map(cmd => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => processVoiceCommand(cmd)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-[11px] font-semibold border border-slate-700 transition-all flex items-center gap-1"
                    >
                      <Zap className="w-2.5 h-2.5 text-sky-400" />
                      <span>"{cmd}"</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Help Cheatsheet */}
              {showVoiceHelp && (
                <div className="p-3 bg-slate-800 rounded-2xl text-[11px] space-y-1.5 border border-slate-700">
                  <div className="font-bold text-sky-300">Voice Command Cheatsheet</div>
                  <p className="text-slate-300">• "Go to shopping list" / "Go to store run"</p>
                  <p className="text-slate-300">• "Check off [item name]" / "Mark [item] as bought"</p>
                  <p className="text-slate-300">• "Add [item name] for [price]"</p>
                  <p className="text-slate-300">• "Auto align budget" / "Open checkout"</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Smart Advice */}
          {activeSubTab === 'advice' && (
            <div className="p-4 space-y-4 max-h-[440px] overflow-y-auto">
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Target Budget Health</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${isOver ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                      {isOver ? `+$${Math.abs(diff).toFixed(2)} Over` : `$${diff.toFixed(2)} Remaining Buffer`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full ${isOver ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, (totalCost / targetBudget) * 100)}%` }}
                    />
                  </div>
                  {onOpenAlignBudget && (
                    <button
                      type="button"
                      onClick={() => onOpenAlignBudget()}
                      className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all mt-1"
                    >
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>Auto-Align Store Brand Swaps</span>
                    </button>
                  )}
                </div>

                {plan && (
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-sky-300">Beverage Ratio Breakdown</span>
                    <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                      <div>🍷 Wine: ~{plan.drinkCalc?.wineBottlesEstimate || 4} bottles</div>
                      <div>🍺 Beer: ~{plan.drinkCalc?.beerCasesEstimate || 1} cases</div>
                      <div>🧊 Ice: ~{plan.drinkCalc?.icePoundsNeeded || 20} lbs</div>
                      <div>💧 Non-Alcoholic: ~{plan.drinkCalc?.softDrinksLiters || 6} liters</div>
                    </div>
                  </div>
                )}

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-amber-300">Host Pro Tip</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Setting up a signature pitcher drink (like Sangria or Punch) reduces beverage waste by up to 35% compared to stocking a full open bar.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
