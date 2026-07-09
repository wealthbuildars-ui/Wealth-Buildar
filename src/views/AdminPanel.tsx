import React, { useState } from 'react';
import { 
  ShieldAlert, Settings, FileText, CheckCircle, 
  XCircle, Clock, Send, MessageSquare, ToggleLeft, ToggleRight 
} from 'lucide-react';
import { 
  UserProfile, SupportTicket, AdCampaign, 
  ProductReferralSale, WithdrawalRequest, AdminSettings 
} from '../types';

interface AdminPanelProps {
  currentUser: UserProfile;
  users: UserProfile[];
  tickets: SupportTicket[];
  campaigns: AdCampaign[];
  withdrawals: WithdrawalRequest[];
  adminSettings: AdminSettings;
  approveUser: (uid: string) => void;
  rejectUser: (uid: string, reason: string) => void;
  processWithdrawal: (id: string, approve: boolean, notes: string) => void;
  processAdCampaign: (id: string, approve: boolean, notes: string) => void;
  replyToTicket: (ticketId: string, text: string, senderUid: string, senderName: string) => void;
  updateSettings: (settings: AdminSettings) => void;
}

export default function AdminPanel({
  currentUser, users, tickets, campaigns, withdrawals, adminSettings,
  approveUser, rejectUser, processWithdrawal, processAdCampaign, replyToTicket, updateSettings
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'USERS' | 'WITHDRAWALS' | 'CAMPAIGNS' | 'TICKETS' | 'SETTINGS'>('USERS');

  // Rejection input state
  const [rejectUid, setRejectUid] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Withdrawal processing state
  const [processingWdr, setProcessingWdr] = useState<string | null>(null);
  const [wdrNotes, setWdrNotes] = useState('');

  // Campaign processing state
  const [processingCmp, setProcessingCmp] = useState<string | null>(null);
  const [cmpNotes, setCmpNotes] = useState('');

  // Ticket reply state
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Config settings states
  const [bankName, setBankName] = useState(adminSettings.bankName);
  const [accNo, setAccNo] = useState(adminSettings.accountNumber);
  const [accName, setAccName] = useState(adminSettings.accountName);
  const [fee, setFee] = useState(adminSettings.registrationFee);
  const [reward, setReward] = useState(adminSettings.referralRewardAmount);
  const [timerEnabled, setTimerEnabled] = useState(adminSettings.isTimerEnabled);

  const pendingUsers = users.filter(u => u.accountStatus === 'Pending Verification');
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'Pending Approval');
  const pendingCampaigns = campaigns.filter(c => c.status === 'Pending Approval');
  const openTickets = tickets.filter(t => t.status !== 'Closed');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdminSettings = {
      ...adminSettings,
      bankName,
      accountNumber: accNo,
      accountName: accName,
      registrationFee: fee,
      referralRewardAmount: reward,
      isTimerEnabled: timerEnabled
    };
    updateSettings(updated);
    alert("Administrative settings successfully updated!");
  };

  const handleTicketReplySubmit = (e: React.FormEvent, ticketId: string) => {
    e.preventDefault();
    if (!ticketReplyText.trim()) return;
    replyToTicket(ticketId, ticketReplyText, currentUser.uid, currentUser.displayName);
    setTicketReplyText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-amber-500" />
          Administrative Portal
        </h1>
        <p className="text-slate-400 text-sm mt-1">Audit platform memberships, process withdrawals, dispatch support advisories, or re-route billing targets.</p>
      </div>

      {/* Admin tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-px overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('USERS')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all focus:outline-none shrink-0 ${
            activeTab === 'USERS' ? 'border-amber-500 text-amber-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Activation Requests ({pendingUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('WITHDRAWALS')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all focus:outline-none shrink-0 ${
            activeTab === 'WITHDRAWALS' ? 'border-amber-500 text-amber-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Withdrawal Payouts ({pendingWithdrawals.length})
        </button>
        <button
          onClick={() => setActiveTab('CAMPAIGNS')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all focus:outline-none shrink-0 ${
            activeTab === 'CAMPAIGNS' ? 'border-amber-500 text-amber-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Ad Campaigns ({pendingCampaigns.length})
        </button>
        <button
          onClick={() => setActiveTab('TICKETS')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all focus:outline-none shrink-0 ${
            activeTab === 'TICKETS' ? 'border-amber-500 text-amber-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Support Tickets ({openTickets.length})
        </button>
        <button
          onClick={() => setActiveTab('SETTINGS')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all focus:outline-none shrink-0 ${
            activeTab === 'SETTINGS' ? 'border-amber-500 text-amber-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Billing & Targets
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'USERS' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-200">Pending Membership Approvals ({pendingUsers.length})</h3>
          <div className="divide-y divide-slate-800/80">
            {pendingUsers.map((u, i) => (
              <div key={i} className="py-5 flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div className="space-y-1">
                  <p className="font-bold text-slate-200 text-base">{u.displayName}</p>
                  <p className="text-xs text-slate-400">Email: {u.email} • Code: {u.referralCode}</p>
                  <p className="text-xs text-amber-400 flex items-center gap-1 mt-1">
                    <FileText className="w-3.5 h-3.5" />
                    Receipt Session ID: <strong className="text-slate-200">{u.paymentProofName}</strong>
                  </p>
                </div>

                <div className="shrink-0 space-y-2">
                  {rejectUid === u.uid ? (
                    <div className="flex gap-2">
                      <input 
                        type="text" value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                        placeholder="Reason for rejection..."
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                      />
                      <button 
                        onClick={() => { rejectUser(u.uid, rejectReason); setRejectUid(null); setRejectReason(''); }}
                        className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-500"
                      >
                        Confirm Decline
                      </button>
                      <button onClick={() => setRejectUid(null)} className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => approveUser(u.uid)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow flex items-center gap-1 focus:outline-none cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve Registration
                      </button>
                      <button 
                        onClick={() => setRejectUid(u.uid)}
                        className="px-4 py-2 bg-rose-600/10 border border-rose-500/20 hover:bg-rose-600/20 text-rose-400 font-bold rounded-xl text-xs flex items-center gap-1 focus:outline-none cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {pendingUsers.length === 0 && (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <Clock className="w-10 h-10 text-slate-800 mx-auto" />
                <p className="font-bold text-slate-400">Queue is empty</p>
                <p className="text-xs text-slate-600">When unverified users upload direct bank payment session IDs, they register here for audit sweeping.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'WITHDRAWALS' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-200">Pending Withdrawal Claims ({pendingWithdrawals.length})</h3>
          <div className="divide-y divide-slate-800/80">
            {pendingWithdrawals.map((w, i) => (
              <div key={i} className="py-5 flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold uppercase">{w.walletType} Wallet</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500">Method: {w.payoutMethod}</span>
                  </div>
                  <p className="font-bold text-slate-200 text-sm">Requested: <strong className="text-emerald-400 text-base">${w.amount}</strong></p>
                  <p className="text-xs text-slate-400">Claimant: {w.userEmail} • Payout Destination: <strong className="text-slate-200">{w.payoutDetails}</strong></p>
                </div>

                <div className="shrink-0">
                  {processingWdr === w.id ? (
                    <div className="flex gap-2">
                      <input 
                        type="text" value={wdrNotes} onChange={e => setWdrNotes(e.target.value)}
                        placeholder="Admin payout notes or Tx hash..."
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                      />
                      <button 
                        onClick={() => { processWithdrawal(w.id, true, wdrNotes); setProcessingWdr(null); setWdrNotes(''); }}
                        className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-500"
                      >
                        Confirm Dispatch
                      </button>
                      <button 
                        onClick={() => { processWithdrawal(w.id, false, wdrNotes); setProcessingWdr(null); setWdrNotes(''); }}
                        className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-500"
                      >
                        Reject
                      </button>
                      <button onClick={() => setProcessingWdr(null)} className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200">Cancel</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setProcessingWdr(w.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 focus:outline-none cursor-pointer"
                    >
                      Process Transaction Payout
                    </button>
                  )}
                </div>
              </div>
            ))}

            {pendingWithdrawals.length === 0 && (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <Clock className="w-10 h-10 text-slate-800 mx-auto" />
                <p className="font-bold text-slate-400">No payout claims pending</p>
                <p className="text-xs text-slate-600">Pending affiliate and merchant withdrawal claims register in this segment.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'CAMPAIGNS' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-200">Pending Ad Campaign Audits ({pendingCampaigns.length})</h3>
          <div className="divide-y divide-slate-800/80">
            {pendingCampaigns.map((c, i) => (
              <div key={i} className="py-5 flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold uppercase">{c.adType}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500">Tier: {c.planName} (${c.budget})</span>
                  </div>
                  <h4 className="font-extrabold text-slate-200 text-base">{c.title}</h4>
                  <p className="text-xs text-slate-400">Destination: <a href={c.destinationUrl} target="_blank" rel="noreferrer" className="text-emerald-400">{c.destinationUrl}</a></p>
                  <p className="text-xs text-amber-400">Payment Ref: <strong className="text-slate-200">{c.paymentReference}</strong></p>
                </div>

                <div className="shrink-0">
                  {processingCmp === c.id ? (
                    <div className="flex gap-2">
                      <input 
                        type="text" value={cmpNotes} onChange={e => setCmpNotes(e.target.value)}
                        placeholder="Feedback or decline notes..."
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                      />
                      <button 
                        onClick={() => { processAdCampaign(c.id, true, cmpNotes); setProcessingCmp(null); setCmpNotes(''); }}
                        className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-500"
                      >
                        Verify & Activate
                      </button>
                      <button 
                        onClick={() => { processAdCampaign(c.id, false, cmpNotes); setProcessingCmp(null); setCmpNotes(''); }}
                        className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-500"
                      >
                        Decline
                      </button>
                      <button onClick={() => setProcessingCmp(null)} className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200">Cancel</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setProcessingCmp(c.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 focus:outline-none cursor-pointer"
                    >
                      Audit Promotional Card
                    </button>
                  )}
                </div>
              </div>
            ))}

            {pendingCampaigns.length === 0 && (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <Clock className="w-10 h-10 text-slate-800 mx-auto" />
                <p className="font-bold text-slate-400">No campaigns awaiting audit</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'TICKETS' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-slate-200">Open Technical Support Tickets ({openTickets.length})</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tickets list */}
            <div className="md:col-span-1 border-r border-slate-800/80 pr-4 space-y-2">
              {openTickets.map((t, i) => (
                <div 
                  key={i}
                  onClick={() => setActiveTicketId(t.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    activeTicketId === t.id 
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="font-bold text-slate-200 text-xs truncate">Subject: {t.subject}</p>
                  <p className="text-[10px] text-slate-500 mt-1">From: {t.userName}</p>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider mt-2 font-bold ${
                    t.status === 'Open' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {t.status}
                  </span>
                </div>
              ))}

              {openTickets.length === 0 && (
                <p className="text-xs text-slate-600 text-center py-10">No active support desks open.</p>
              )}
            </div>

            {/* Selected active Ticket desk chat */}
            <div className="md:col-span-2 space-y-4">
              {activeTicketId ? (
                (() => {
                  const activeTkt = tickets.find(t => t.id === activeTicketId);
                  if (!activeTkt) return null;
                  return (
                    <div className="flex flex-col h-96 justify-between">
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Client Subject Desk</h4>
                        <p className="text-sm font-black text-slate-200 mt-0.5">"{activeTkt.subject}"</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Author: {activeTkt.userEmail}</p>
                      </div>

                      {/* Chat messages thread */}
                      <div className="flex-1 overflow-y-auto py-4 space-y-3 px-1">
                        {activeTkt.messages.map((m, mIdx) => (
                          <div 
                            key={mIdx} 
                            className={`flex flex-col max-w-sm rounded-2xl p-3.5 text-xs ${
                              m.senderUid === currentUser.uid 
                                ? 'bg-slate-800 text-slate-100 ml-auto' 
                                : 'bg-slate-950 text-slate-300 mr-auto'
                            }`}
                          >
                            <span className="font-bold text-slate-400 text-[10px] mb-1">{m.senderName}</span>
                            <p>{m.message}</p>
                            <span className="text-[9px] text-slate-500 mt-1.5 text-right">
                              {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Send response bar */}
                      <form onSubmit={(e) => handleTicketReplySubmit(e, activeTkt.id)} className="flex gap-2">
                        <input 
                          type="text" value={ticketReplyText} onChange={e => setTicketReplyText(e.target.value)}
                          placeholder="Respond to client ticket..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 text-xs text-slate-100 focus:outline-none"
                        />
                        <button 
                          type="submit"
                          className="p-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold flex items-center justify-center focus:outline-none"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  );
                })()
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600 text-xs">
                  Select an open support ticket from the side directory list to initialize advisement dispatching.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SETTINGS' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-800/60 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-200">Re-route Billing & Target Parameters</h3>
              <p className="text-xs text-slate-400">Configure public OPay addresses, toggles, fees, and referral allocations.</p>
            </div>
            <button 
              type="button" onClick={() => setTimerEnabled(!timerEnabled)}
              className="text-slate-400 hover:text-slate-100 focus:outline-none text-xs flex items-center gap-1.5"
            >
              <span>Verification Timer:</span>
              {timerEnabled ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-slate-600" />}
            </button>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-slate-500 font-semibold mb-1">Receiving Bank Provider</label>
                <input 
                  type="text" value={bankName} onChange={e => setBankName(e.target.value)}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-500 font-semibold mb-1">Account Holder Name</label>
                <input 
                  type="text" value={accName} onChange={e => setAccName(e.target.value)}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs uppercase text-slate-500 font-semibold mb-1">OPay Account Number</label>
                <input 
                  type="text" value={accNo} onChange={e => setAccNo(e.target.value)}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-500 font-semibold mb-1">Required Enrollment Fee (₦)</label>
                <input 
                  type="number" value={fee} onChange={e => setFee(parseFloat(e.target.value) || 0)}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-500 font-semibold mb-1">Affiliate Direct Referral Commission (₦)</label>
                <input 
                  type="number" value={reward} onChange={e => setReward(parseFloat(e.target.value) || 0)}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
            >
              Override System Configuration Settings
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
