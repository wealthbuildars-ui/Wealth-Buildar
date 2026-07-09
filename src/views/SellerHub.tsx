import React, { useState } from 'react';
import { 
  Building, DollarSign, PlusCircle, Trash, 
  Settings, Truck, HelpCircle, Package, ArrowRight, CheckCircle 
} from 'lucide-react';
import { UserProfile, AffiliateProduct, Order } from '../types';

interface SellerHubProps {
  currentUser: UserProfile;
  products: AffiliateProduct[];
  orders: Order[];
  registerSeller: (businessName: string, phone: string, nationalId: string, bizReg: string) => void;
  addProduct: (
    name: string, desc: string, cat: string, price: number, qty: number, 
    specs: Record<string, string>, deliveryFee: number, img: string
  ) => void;
  requestWithdrawal: (amount: number, method: string, details: string, walletType: 'Affiliate' | 'Seller') => { success: boolean; message: string };
}

export default function SellerHub({ currentUser, products, orders, registerSeller, addProduct, requestWithdrawal }: SellerHubProps) {
  // Hub states
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PRODUCTS' | 'ORDERS' | 'WITHDRAWAL'>('OVERVIEW');

  // Reg form states
  const [bizName, setBizName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [bizReg, setBizReg] = useState('');
  const [regError, setRegError] = useState('');

  // Add Product form states
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pCat, setPCat] = useState('Development & Templates');
  const [pPrice, setPPrice] = useState(25);
  const [pQty, setPQty] = useState(50);
  const [pDelivery, setPDelivery] = useState(0);
  const [pImg, setPImg] = useState('');
  const [pError, setPError] = useState('');
  const [pSuccess, setPSuccess] = useState('');

  // Withdrawal States
  const [wAmount, setWAmount] = useState(50);
  const [wMethod, setWMethod] = useState('Bank Transfer');
  const [wDetails, setWDetails] = useState('');
  const [wError, setWError] = useState('');
  const [wSuccess, setWSuccess] = useState('');

  const sellerProducts = products.filter(p => p.sellerId === currentUser.uid);
  const sellerOrders = orders.filter(o => o.sellerId === currentUser.uid);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!bizName.trim() || !phone.trim() || !nationalId.trim()) {
      setRegError("Please fill out all merchant verification credentials.");
      return;
    }
    registerSeller(bizName, phone, nationalId, bizReg);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setPError('');
    setPSuccess('');

    if (!pName.trim() || !pDesc.trim()) {
      setPError("Product name and description are required.");
      return;
    }

    const specs = {
      "Seller License": "Approved Merchant",
      "Format": "Digital Download / Package",
      "Instant Access": "Yes"
    };

    addProduct(pName, pDesc, pCat, pPrice, pQty, specs, pDelivery, pImg);
    setPSuccess("Digital product successfully listed on Marketplace!");
    setPName('');
    setPDesc('');
    setPPrice(25);
    setPQty(50);
    setPDelivery(0);
    setPImg('');
    setTimeout(() => setShowAddForm(false), 1500);
  };

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWError('');
    setWSuccess('');

    if (wAmount <= 0) {
      setWError("Please specify a valid payout amount.");
      return;
    }

    if (!wDetails.trim()) {
      setWError("Please fill in receiving account destination parameters.");
      return;
    }

    const res = requestWithdrawal(wAmount, wMethod, wDetails, 'Seller');
    if (!res.success) {
      setWError(res.message);
    } else {
      setWSuccess(res.message);
      setWAmount(0);
      setWDetails('');
    }
  };

  // If user is not verified as a seller
  if (!currentUser.isSeller) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <Building className="w-12 h-12 text-brand-green mx-auto animate-pulse" />
            <h2 className="text-2xl font-black text-slate-100">Activate Your Seller Store</h2>
            <p className="text-sm text-slate-400">Fill in corporate or national registration parameters to upload and sell digital resources.</p>
          </div>

          {regError && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold">
              {regError}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Business / Store Brand Name</label>
              <input 
                type="text" value={bizName} onChange={e => setBizName(e.target.value)}
                placeholder="e.g. Amajor Tech Solutions"
                className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Corporate Phone Number</label>
              <input 
                type="text" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="e.g. +234 916 207 2645"
                className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">National Identity Number (NIN)</label>
                <input 
                  type="text" value={nationalId} onChange={e => setNationalId(e.target.value)}
                  placeholder="e.g. NIN-128919"
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">Company CAC Registry <span className="text-slate-500 font-normal">(Optional)</span></label>
                <input 
                  type="text" value={bizReg} onChange={e => setBizReg(e.target.value)}
                  placeholder="e.g. RC-44812"
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all focus:outline-none shadow-lg cursor-pointer flex items-center justify-center gap-1"
            >
              Confirm Store Activation <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Building className="w-8 h-8 text-brand-green" />
            Seller Hub: {currentUser.sellerBusinessName}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage active listings, process incoming orders, and withdraw available sales income.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-md flex items-center gap-1 transition-all focus:outline-none shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          {showAddForm ? 'Close console' : 'List New Product'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-800/60 pb-3">
            <h3 className="text-lg font-black text-slate-100">Add Product to Marketplace</h3>
            <p className="text-xs text-slate-400">List digital templates, guides, checklists, or widgets.</p>
          </div>

          {pError && <p className="text-xs text-rose-400 font-bold">{pError}</p>}
          {pSuccess && <p className="text-xs text-emerald-400 font-bold">{pSuccess}</p>}

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Product Title</label>
                <input 
                  type="text" value={pName} onChange={e => setPName(e.target.value)}
                  placeholder="e.g. Master React Template v1"
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
                <textarea 
                  value={pDesc} onChange={e => setPDesc(e.target.value)}
                  placeholder="Detail exactly what the buyer receives and setup instruction downloads..."
                  rows={4}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label>
                <select
                  value={pCat} onChange={e => setPCat(e.target.value)}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none"
                >
                  <option value="Development & Templates">Development & Templates</option>
                  <option value="Productivity Tools">Productivity Tools</option>
                  <option value="Marketing & Growth">Marketing & Growth</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Asset Image URL</label>
                <input 
                  type="text" value={pImg} onChange={e => setPImg(e.target.value)}
                  placeholder="Unsplash image link (Optional)"
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Selling Price ($)</label>
                <input 
                  type="number" value={pPrice} onChange={e => setPPrice(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Initial Quantity In Stock</label>
                <input 
                  type="number" value={pQty} onChange={e => setPQty(Math.max(1, parseInt(e.target.value) || 0))}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all focus:outline-none shadow-md cursor-pointer"
            >
              Launch Product in Store
            </button>
          </form>
        </div>
      )}

      {/* Sub tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all focus:outline-none shrink-0 ${
            activeTab === 'OVERVIEW' ? 'border-brand-green text-brand-green font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Merchant Overview
        </button>
        <button
          onClick={() => setActiveTab('PRODUCTS')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all focus:outline-none shrink-0 ${
            activeTab === 'PRODUCTS' ? 'border-brand-green text-brand-green font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Manage Listings ({sellerProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all focus:outline-none shrink-0 ${
            activeTab === 'ORDERS' ? 'border-brand-green text-brand-green font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Client Orders ({sellerOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('WITHDRAWAL')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all focus:outline-none shrink-0 ${
            activeTab === 'WITHDRAWAL' ? 'border-brand-green text-brand-green font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Withdraw Earnings
        </button>
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Store Total Income Sales</p>
            <p className="text-3xl font-black text-slate-200 mt-1">${currentUser.sellerTotalSales.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Available Balance</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">${currentUser.sellerBalance.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Client Orders</p>
            <p className="text-3xl font-black text-amber-500 mt-1">{sellerOrders.length}</p>
          </div>
        </div>
      )}

      {activeTab === 'PRODUCTS' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-slate-200">Active Listed Catalog</h3>
          <div className="divide-y divide-slate-800">
            {sellerProducts.map((p, idx) => (
              <div key={idx} className="py-4 flex justify-between items-center text-sm">
                <div>
                  <p className="font-bold text-slate-200">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.category} • In Stock: {p.availableQuantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-300">${p.price}</p>
                  <p className="text-[10px] text-emerald-400">{p.commissionPercent}% Affiliate Comm</p>
                </div>
              </div>
            ))}

            {sellerProducts.length === 0 && (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <Package className="w-10 h-10 text-slate-800 mx-auto" />
                <p className="font-bold text-slate-400">No listed items found</p>
                <p className="text-xs text-slate-600">Use the list new product button to host templates inside the catalog.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'ORDERS' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-slate-200">Incoming Buyer Transactions</h3>
          <div className="divide-y divide-slate-800">
            {sellerOrders.map((o, idx) => (
              <div key={idx} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-slate-200 text-sm">Order: {o.id}</p>
                  <p className="text-slate-400">Purchased: <strong className="text-slate-300">{o.productName}</strong> x {o.quantity}</p>
                  <p className="text-slate-500">Destination/Email: {o.shippingAddress}</p>
                </div>
                <div className="text-right space-y-1 shrink-0">
                  <p className="text-emerald-400 font-bold text-sm">${o.finalPayableAmount.toFixed(2)}</p>
                  <span className="inline-block px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded text-[10px]">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}

            {sellerOrders.length === 0 && (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <Truck className="w-10 h-10 text-slate-800 mx-auto" />
                <p className="font-bold text-slate-400">No purchase transactions found</p>
                <p className="text-xs text-slate-600">When users checkout using their active balances, orders register here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'WITHDRAWAL' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Payout Request Form</h3>
            
            {wError && <p className="text-xs text-rose-400 font-bold">{wError}</p>}
            {wSuccess && <p className="text-xs text-emerald-400 font-bold">{wSuccess}</p>}

            <form onSubmit={handleWithdrawal} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-slate-500 font-semibold mb-1">Withdrawal Amount ($)</label>
                <input 
                  type="number" value={wAmount} onChange={e => setWAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Maximum withdrawable: ${currentUser.sellerBalance.toLocaleString()}</span>
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-500 font-semibold mb-1">Payout Channel</label>
                <select
                  value={wMethod} onChange={e => setWMethod(e.target.value)}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm"
                >
                  <option value="OPay Bank Transfer">OPay Direct Transfer</option>
                  <option value="USDT Crypto TRC20">USDT Wallet (TRC-20)</option>
                  <option value="PayPal Payment">PayPal Payout</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-500 font-semibold mb-1">Receiving Destination details</label>
                <input 
                  type="text" value={wDetails} onChange={e => setWDetails(e.target.value)}
                  placeholder="Account Number or USDT Address..."
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all shadow-md focus:outline-none"
              >
                File Withdrawal Claim
              </button>
            </form>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 space-y-4 text-sm text-slate-400">
            <h4 className="text-sm font-bold text-slate-200">Processing Sweeps</h4>
            <ul className="space-y-3 list-disc pl-5 text-xs text-slate-400">
              <li>Platform administrative teams process merchant payouts within <strong className="text-emerald-400">12 hours</strong> of form auditing.</li>
              <li>Minimal transaction fees apply depending on the target provider (typically free on OPay).</li>
              <li>Funds are securely locked while claims are pending approval. Discrepancies are refunded to core wallets immediately.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
