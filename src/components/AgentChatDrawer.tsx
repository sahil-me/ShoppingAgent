import React, { useState, useRef, useEffect } from 'react';
import { PartyPlan, ChatMessage, ShoppingItem } from '../types';
import { 
  BotMessageSquare, 
  Send, 
  Sparkles, 
  X, 
  PlusCircle, 
  Check, 
  DollarSign, 
  Wine, 
  Users, 
  HelpCircle,
  Loader2
} from 'lucide-react';

interface AgentChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PartyPlan;
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onApplyAction: (action: any) => void;
  isLoading: boolean;
}

const QUICK_PROMPTS = [
  'Cut $40 from current budget with smart swaps',
  'Add a refreshing signature mocktail with ingredients',
  'Add kid-friendly finger foods and juice boxes',
  'Audit this list for nut and gluten allergens',
  'What should I buy at Costco vs the grocery store?'
];

export const AgentChatDrawer: React.FC<AgentChatDrawerProps> = ({
  isOpen,
  onClose,
  plan,
  chatHistory,
  onSendMessage,
  onApplyAction,
  isLoading
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isOpen, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput('');
    onSendMessage(text);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  if (!isOpen) return null;

  return (
    <div id="agent-chat-panel" className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
      {/* Drawer Header */}
      <div className="p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
            <BotMessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Shopping Agent Assistant
            </h3>
            <p className="text-[11px] text-slate-500">
              Assisting with {plan.title} ({plan.guestCount.total} guests)
            </p>
          </div>
        </div>

        <button
          id="close-chat-drawer-btn"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {chatHistory.length === 0 && (
          <div className="text-center py-6 px-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">
              How can I refine your party shopping?
            </h4>
            <p className="text-slate-500 text-xs max-w-xs mx-auto">
              Ask me to trim costs, adjust quantities for extra guests, suggest recipes, or add custom drink menus.
            </p>
          </div>
        )}

        {chatHistory.map((msg) => {
          const isAgent = msg.sender === 'agent';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3 leading-relaxed ${
                  isAgent
                    ? 'bg-slate-100 text-slate-900 rounded-tl-xs border border-slate-200/80'
                    : 'bg-amber-600 text-white rounded-tr-xs shadow-xs'
                }`}
              >
                {/* Content formatting */}
                <div className="whitespace-pre-wrap space-y-1">
                  {msg.text}
                </div>

                {/* Interactive Action Widget */}
                {isAgent && msg.suggestedAction && msg.suggestedAction.type === 'add_items' && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80">
                    <button
                      onClick={() => onApplyAction(msg.suggestedAction)}
                      className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{msg.suggestedAction.label || 'Add Suggested Items to List'}</span>
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-slate-500 max-w-[70%]">
            <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
            <span>Agent is calculating shopping formulas...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPrompt(qp)}
            disabled={isLoading}
            className="text-[11px] font-medium bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-800 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors disabled:opacity-50"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          id="agent-chat-input"
          type="text"
          placeholder="Ask shopping agent anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
        />
        <button
          id="agent-chat-send-btn"
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl transition-colors shadow-xs shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
