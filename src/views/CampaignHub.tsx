import React, { useState } from 'react';
import { 
  Sparkles, DollarSign, PlusCircle, CheckCircle, 
  Tv, Eye, MousePointer, Info, ArrowUpRight 
} from 'lucide-react';
import { UserProfile, AdCampaign, AdPackage } from '../types';

interface CampaignHubProps {
  currentUser: UserProfile;
  campaigns: AdCampaign[];
  createAdCampaign: (
    title: string, desc: string, destUrl: string, 
    adType: string, budget: number, ref: string
  ) => void;
}

export default function CampaignHub({ currentUser, campaigns, createAdCampaign }: CampaignHubProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [destUrl, setDestUrl] = useState('');
  const [adType, setAdType] = useState('Homepage Banner');
  const [budget, setBudget] = useState(50);
  const [ref, setRef] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const myCampaigns = campaigns.filter(c => c.userId === currentUser.uid);

  const adPackages: AdPackage[] = [
    { id: 'pkg_1', name: 'Basic Tier Card', price: 25, durationDays: 14, description: 'Promote your links in the sidebar carousel. Basic impressions count.', adType: 'Sidebar Banner' },
    { id: 'pkg_2', name: 'Standard Lead Card', price: 50, durationDays: 30, description: 'Standard dashboard promotional placement. Double click weights.', adType: 'Homepage Banner' },
    { id: 'pkg_3', name: 'Featured Banner Premium', price: 100, durationDays: 30, description: 'Featured banner pinned on the main homepage. Elite CTR priority.', adType: 'Featured Homepage Banner' }
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !destUrl.trim() || !ref.trim()) {
      setError("Please fill out the campaign headline, destination link, and payment reference.");
      return;
    }

    createAdCampaign(title, desc, destUrl, adType, budget, ref);
    setSuccess("Ad campaign submitted! Our admin team is verifying your transfer payment receipt.");
    setTitle('');
    setDesc('');
    setDestUrl('');
    setRef('');
    setTimeout(() => setShowAddForm(false), 2000);
  };

  const handleSelectPackage = (price: number, type: string) => {
    setBudget(price);
    setAdType(type);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Tv className="w-8 h-8 text-brand-green" />
            Ad Campaign Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">Acquire targeted traffic and customers by launching premium pinned promotional cards.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-md flex items-center gap-1 transition-all focus:outline-none shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          {showAddForm ? 'Close console' : 'Launch New Campaign'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto space-y-6">
          <div className="border-b border-slate-800/60 pb-3">
            <h3 className="text-lg font-black text-slate-100">Launch New Promotional Card</h3>
            <p className="text-xs text-slate-400">Select a budget and enter the receiving destination landing page.</p>
          </div>

          {error && <p className="text-xs text-rose-400 font-bold">{error}</p>}
          {success && <p className="text-xs text-emerald-400 font-bold">{success}</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {adPackages.map((pkg, i) => (
              <div 
                key={i} 
                onClick={() => handleSelectPackage(pkg.price, pkg.adType)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  budget === pkg.price 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">{pkg.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{pkg.description}</p>
                </div>
                <div className="mt-4 flex justify-between items-center border-t border-slate-800/60 pt-2 text-xs">
                  <span className="font-bold text-slate-400">{pkg.durationDays} Days</span>
                  <span className="font-black text-slate-200 text-sm">${pkg.price}</span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleCreate} className="space-y-4 pt-4 border-t border-slate-800/60">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Campaign Headline</label>
                <input 
                  type="text" value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Save 5 hours/week on Figma Designs!"
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Landing Page URL</label>
                <input 
                  type="text" value={destUrl} onChange={e => setDestUrl(e.target.value)}
                  placeholder="e.g. https://yourstore.gumroad.com"
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Promo Description Card</label>
                <input 
                  type="text" value={desc} onChange={e => setDesc(e.target.value)}
                  placeholder="Summarize your unique product hook for premium members..."
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">OPay Bank Transfer Transaction Reference / Session ID</label>
                <input 
                  type="text" value={ref} onChange={e => setRef(e.target.value)}
                  placeholder="Session ID of transfer to Chizaram W. Amajor..."
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-1.5 block">
                  Please transfer the package fee (e.g. ₦{(budget * 1500).toLocaleString()}) to OPay receipt desks before filing reference session ID.
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all focus:outline-none shadow-md"
            >
              Initialize Promotion Auditing
            </button>
          </form>
        </div>
      )}

      {/* Campaigns list */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-slate-200">Your Active Advertisements ({myCampaigns.length})</h3>

        <div className="divide-y divide-slate-800">
          {myCampaigns.map((c, idx) => (
            <div key={idx} className="py-5 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2.5 py-0.5 rounded font-bold uppercase">
                    {c.adType}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    c.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    c.status === 'Pending Approval' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                    'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-200 text-sm sm:text-base flex items-center gap-1">
                  {c.title}
                  <a href={c.destinationUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300">
                    <ArrowUpRight className="w-4 h-4 inline" />
                  </a>
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xl">{c.description}</p>
                {c.adminNotes && (
                  <p className="text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-amber-400">
                    <strong>Admin Note:</strong> {c.adminNotes}
                  </p>
                )}
              </div>

              {/* Analytics row */}
              <div className="flex gap-4 shrink-0 text-center bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                <div>
                  <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-slate-500" /> Views
                  </p>
                  <p className="text-base font-extrabold text-slate-200 mt-0.5">{c.viewsCount}</p>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1">
                    <MousePointer className="w-3 h-3 text-slate-500" /> Clicks
                  </p>
                  <p className="text-base font-extrabold text-slate-200 mt-0.5">{c.clicksCount}</p>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500">CTR</p>
                  <p className="text-base font-extrabold text-emerald-400 mt-0.5">
                    {c.viewsCount > 0 ? ((c.clicksCount / c.viewsCount) * 100).toFixed(1) : "0.0"}%
                  </p>
                </div>
              </div>
            </div>
          ))}

          {myCampaigns.length === 0 && (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Tv className="w-10 h-10 text-slate-800 mx-auto" />
              <p className="font-bold text-slate-400">No ad campaigns launched</p>
              <p className="text-xs text-slate-600">Promote your custom SaaS platforms or e-commerce products through targeted pinned placement cards.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
