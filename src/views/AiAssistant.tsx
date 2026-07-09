import React, { useState } from 'react';
import { Sparkles, Send, Bot, HelpCircle, MessageSquare, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface AiAssistantProps {
  currentUser: UserProfile;
}

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export default function AiAssistant({ currentUser }: AiAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: `Hello, ${currentUser.displayName}! I am your personal Wealth Builder AI strategist. Ask me anything about affiliate link structures, freelance pricing formulas, or digital asset scalability strategies!`, time: '10:00 AM' }
  ]);
  const [inputText, setInputText] = useState('');

  const suggestions = [
    { label: "Draft Affiliate Funnel", query: "Can you outline a step-by-step affiliate marketing sales funnel?" },
    { label: "Evaluate Digital Scalability", query: "What makes a digital product template highly scalable?" },
    { label: "Check Freelance Hours", query: "How should I structure my weekly billable hours?" }
  ];

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Dynamic response simulation
    setTimeout(() => {
      let replyText = "That is an excellent inquiry! Based on official Wealth Builder blueprints, you should focus on: \n\n1. Target severe market pain points (Pain severity >= 7/10).\n2. Create high-margin digital PDF/Templates that require zero shipping costs.\n3. Leverage our active Toolbox calculators to simulate gross annual needs.\n\nWould you like me to elaborate on a specific item?";
      const lower = textToSend.toLowerCase();

      if (lower.includes('affiliate') || lower.includes('funnel')) {
        replyText = "Here is your Elite Affiliate Marketing Blueprint:\n\n### 1. Source High-Yield Offers\nPartner with verified SaaS merchants offering at least 30%-50% recurring commissions.\n\n### 2. High-Value Lead Magnet\nDraft a free 3-page Notion worksheet solving a specific headache for your target prospects (e.g. 'Figma Audit Checklist').\n\n### 3. Pinned Campaign Placement\nUse our platform's Ad Campaign Hub to secure home screen banner traffic. Route click flows directly to your Notion squeeze page.";
      } else if (lower.includes('scale') || lower.includes('scalability') || lower.includes('digital')) {
        replyText = "Scalability Assessment:\n\n### 1. Production Overhead\nTemplates, guides, and UI kits are 100% digital, meaning your replicative margin is nearly 100% after first-draft assets are completed.\n\n### 2. Multi-Vendor Listing\nHost your resources inside our premium Multi-Vendor Marketplace. Configure a 10%-15% commission rate to let our entire user base refer sales on your behalf.";
      } else if (lower.includes('freelance') || lower.includes('rate') || lower.includes('hours')) {
        replyText = "Freelance Formula Analysis:\n\n### 1. Billable Efficiency\nRemember that out of a 40-hour work week, typically only 20-25 hours are truly 'billable'. The rest are spent on proposal writes, admin details, or outreach.\n\n### 2. Tax Allocations\nAlways compound an extra 20%-30% tax allowance on top of your required net target to ensure you do not experience cash bottlenecks during year-end filings.";
      }

      const botMsg: ChatMessage = {
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <Bot className="w-8 h-8 text-brand-green" />
          Wealth AI Strategist
        </h1>
        <p className="text-slate-400 text-sm mt-1">Converse with our pre-loaded local intelligence engine to outline customized digital blueprints.</p>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col h-[520px] justify-between relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

        {/* Suggestion prompt chips */}
        <div className="flex gap-2 pb-3 overflow-x-auto border-b border-slate-800/80 scrollbar-none shrink-0">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s.query)}
              className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 hover:border-emerald-500/30 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all focus:outline-none shrink-0"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 px-1 scrollbar-thin">
          {messages.map((m, idx) => (
            <div 
              key={idx}
              className={`flex flex-col max-w-lg rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                m.sender === 'bot' 
                  ? 'bg-slate-950/80 border border-slate-850 text-slate-200 mr-auto' 
                  : 'bg-slate-850 text-slate-100 ml-auto'
              }`}
            >
              {m.sender === 'bot' && (
                <span className="font-extrabold text-emerald-400 text-[10px] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5 text-emerald-400" /> Wealth Builder AI
                </span>
              )}
              {/* Simple split blocks for rich rendering */}
              <div className="space-y-3">
                {m.text.split('\n\n').map((block, i) => {
                  if (block.startsWith('### ')) {
                    return <h4 key={i} className="font-bold text-slate-100 mt-2 text-sm">{block.replace('### ', '')}</h4>;
                  }
                  return <p key={i}>{block}</p>;
                })}
              </div>
              <span className="text-[9px] text-slate-500 mt-2 text-right block">
                {m.time}
              </span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
          className="flex gap-2 border-t border-slate-800/60 pt-4 shrink-0"
        >
          <input 
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Ask AI about passive streams, affiliate codes, rates..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button 
            type="submit"
            className="p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center focus:outline-none transition-all active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
