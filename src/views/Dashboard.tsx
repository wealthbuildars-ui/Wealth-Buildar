import React, { useState } from 'react';
import { 
  DollarSign, Flame, Award, Share2, Clipboard, 
  HelpCircle, MessageSquare, PlusCircle, CreditCard, Clock, CheckCircle, ArrowRight, UserPlus 
} from 'lucide-react';
import { UserProfile, SupportTicket, WithdrawalRequest, AdminSettings } from '../types';

interface DashboardProps {
  currentUser: UserProfile;
  tickets: SupportTicket[];
  withdrawals: WithdrawalRequest[];
  adminSettings: AdminSettings;
  fileSupportTicket: (subject: string, body: string) => void;
  requestWithdrawal: (amount: number, method: string, details: string, walletType: 'Affiliate' | 'Seller') => { success: boolean; message: string };
  addFunds: (amount: number) => void;
  onNavigateToTab?: (tab: number) => void;
}

export default function Dashboard({
  currentUser, tickets, withdrawals, adminSettings,
  fileSupportTicket, requestWithdrawal, addFunds, onNavigateToTab
}: DashboardProps) {
  const [copied, setCopied] = useState(false);
  
  // Funding states
  const [fundingAmount, setFundingAmount] = useState(100);
  const [fundSuccess, setFundSuccess] = useState('');

  // Support states
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketBody, setTicketBody] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');

  // Withdrawal States
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [withdrawMethod, setWithdrawMethod] = useState('OPay Bank Transfer');
  const [withdrawDetails, setWithdrawDetails] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');

  const myTickets = tickets.filter(t => t.userId === currentUser.uid);
  const myWithdrawals = withdrawals.filter(w => w.userUid === currentUser.uid && w.walletType === 'Affiliate');

  const referralUrl = `${window.location.origin}/register?ref=${currentUser.referralCode}`;

  const copyReferralUrl = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFundWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (fundingAmount <= 0) return;
    addFunds(fundingAmount);
    setFundSuccess(`Success! Mock added $${fundingAmount.toLocaleString()} to your balance.`);
    setTimeout(() => setFundSuccess(''), 2500);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketBody.trim()) return;
    fileSupportTicket(ticketSubject, ticketBody);
    setTicketSuccess("Support ticket registered! Administrative agents will reply shortly.");
    setTicketSubject('');
    setTicketBody('');
    setTimeout(() => setTicketSuccess(''), 2500);
  };

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawSuccess('');

    if (withdrawAmount <= 0) {
      setWithdrawError("Specify a valid payout amount.");
      return;
    }

    if (!withdrawDetails.trim()) {
      setWithdrawError("Please provide withdrawal target parameters.");
      return;
    }

    const res = requestWithdrawal(withdrawAmount, withdrawMethod, withdrawDetails, 'Affiliate');
    if (!res.success) {
      setWithdrawError(res.message);
    } else {
      setWithdrawSuccess(res.message);
      setWithdrawAmount(50);
      setWithdrawDetails('');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Welcome Banner */}
      <div className="relative bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />
        <div className="space-y-2 relative z-10">
          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md font-bold text-[10px] uppercase tracking-wider">
            Premium Elite Member
          </span>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">
            Greetings, {currentUser.displayName}!
          </h1>
          <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
            Welcome to the centralized Wealth Builder Command. You have active access to digital master Blueprints, interactive simulation calculators, and multi-vendor affiliate commission streams.
          </p>
        </div>

        {/* Streak element */}
        <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 shrink-0 shadow-inner">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Lesson Streak</p>
            <p className="text-xl font-bold text-slate-200 mt-0.5">{currentUser.lessonStreakCount} Consecutive Days</p>
          </div>
        </div>
      </div>

      {/* Primary Financial Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Saved Investment Balance</p>
            <p className="text-3xl font-black text-slate-200 mt-1">${currentUser.currentSavedBalance.toLocaleString()}</p>
          </div>
          
          <form onSubmit={handleFundWallet} className="flex gap-2">
            <input 
              type="number" 
              value={fundingAmount} 
              onChange={e => setFundingAmount(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
            />
            <button 
              type="submit" 
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Mock Fund Wallet
            </button>
          </form>
          {fundSuccess && <p className="text-[10px] text-emerald-400 font-medium">{fundSuccess}</p>}
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Affiliate Referral Balance</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">${currentUser.referralBalance.toLocaleString()}</p>
          </div>
          <div className="text-xs text-slate-400">
            Total Commission Earned: <strong className="text-slate-200">${currentUser.totalCommissionEarned.toLocaleString()}</strong>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Earned Milestones Badging</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {currentUser.badges.map((badge, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold rounded-md flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" /> {badge}
                </span>
              ))}
              {currentUser.badges.length === 0 && (
                <span className="text-xs text-slate-500 font-medium">Verify lessons or clear quizzes to unlock badges!</span>
              )}
            </div>
          </div>
          <div className="text-xs text-slate-400">
            Current Referrals Count: <strong className="text-slate-200">{currentUser.referrals.length} active leads</strong>
          </div>
        </div>
      </div>

      {/* Referrals & Link Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800/60 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-200 flex items-center gap-1.5">
                <Share2 className="w-4.5 h-4.5 text-emerald-400" />
                Affiliate Share Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1">Generate dynamic registration links to claim ₦{adminSettings.referralRewardAmount.toLocaleString()} commissions.</p>
            </div>
            
            <button
              onClick={copyReferralUrl}
              className="p-2 bg-slate-950 border border-slate-800 hover:border-emerald-500/30 rounded-xl text-slate-400 hover:text-slate-100 flex items-center gap-1 transition-all focus:outline-none"
            >
              <Clipboard className="w-4 h-4" />
              <span className="text-xs font-bold">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-xs text-slate-400 font-mono select-all truncate">
            {referralUrl}
          </div>

          {/* Referral history */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Commissions Ledger</h4>
            <div className="divide-y divide-slate-800/60">
              {currentUser.referrals.map((ref, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-300">{ref.referredName}</p>
                    <p className="text-[10px] text-slate-500">Joined: {new Date(ref.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-400">+{ref.commissionAmount.toLocaleString()} Credit</p>
                    <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-slate-400 font-medium">Approved</span>
                  </div>
                </div>
              ))}

              {currentUser.referrals.length === 0 && (
                <div className="text-center py-6 text-slate-500 space-y-1">
                  <UserPlus className="w-8 h-8 text-slate-800 mx-auto" />
                  <p className="text-xs font-bold text-slate-400">No affiliate leads referred yet</p>
                  <p className="text-[10px] text-slate-600">Share your custom affiliate token link above to drive sweeps.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Withdrawal form */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-200">Withdraw Referral Commissions</h3>

          {withdrawError && <p className="text-xs text-rose-400 font-bold">{withdrawError}</p>}
          {withdrawSuccess && <p className="text-xs text-emerald-400 font-bold">{withdrawSuccess}</p>}

          <form onSubmit={handleWithdrawal} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold uppercase tracking-wider mb-1">Amount ($)</label>
              <input 
                type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Withdrawable: ${currentUser.referralBalance.toLocaleString()}</span>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold uppercase tracking-wider mb-1">Payout Provider Channel</label>
              <select
                value={withdrawMethod} onChange={e => setWithdrawMethod(e.target.value)}
                className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs focus:outline-none"
              >
                <option value="OPay Bank Transfer">OPay Bank Transfer</option>
                <option value="PayPal Payout">PayPal Payout</option>
                <option value="USDT TRC20 Crypto">USDT TRC-20 Wallet</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold uppercase tracking-wider mb-1">Receiving Target Account / Wallet</label>
              <input 
                type="text" value={withdrawDetails} onChange={e => setWithdrawDetails(e.target.value)}
                placeholder="OPay Account Number or USDT address..."
                className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-md focus:outline-none"
            >
              File Withdrawal Request
            </button>
          </form>
        </div>
      </div>

      {/* Support Ticketing Desk */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-slate-200">Support Desk Ticketing</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create ticket form */}
          <div className="lg:col-span-1 space-y-4 pr-0 lg:pr-4 lg:border-r lg:border-slate-800/80">
            <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">File Support Inquiry</h4>
            
            {ticketSuccess && <p className="text-xs text-emerald-400 font-bold">{ticketSuccess}</p>}

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold uppercase mb-1">Subject Title</label>
                <input 
                  type="text" value={ticketSubject} onChange={e => setTicketSubject(e.target.value)}
                  placeholder="e.g. OPay verification delay..."
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold uppercase mb-1">Message Body</label>
                <textarea 
                  value={ticketBody} onChange={e => setTicketBody(e.target.value)}
                  placeholder="Describe your inquiry or question detail in full..."
                  rows={4}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-200 font-bold rounded-xl border border-slate-800 focus:outline-none"
              >
                Register Inquiry Ticket
              </button>
            </form>
          </div>

          {/* Tickets list history */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Your Active Ticketing Log ({myTickets.length})</h4>
            <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto pr-2 scrollbar-thin">
              {myTickets.map((t, idx) => (
                <div key={idx} className="py-3.5 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-extrabold text-slate-200">Subject: {t.subject}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                      t.status === 'Open' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  {/* Thread messages logs */}
                  <div className="space-y-1.5 pl-3 border-l border-slate-800">
                    {t.messages.map((m, mIdx) => (
                      <div key={mIdx} className="text-xs space-y-0.5">
                        <p className="text-slate-500 font-bold">{m.senderName}:</p>
                        <p className="text-slate-400">{m.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {myTickets.length === 0 && (
                <p className="text-xs text-slate-600 py-10 text-center">You have no registered support inquiries.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
