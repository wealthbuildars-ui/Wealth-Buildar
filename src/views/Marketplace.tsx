import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Tag, DollarSign, 
  Truck, Star, CheckCircle, AlertCircle, ShoppingCart 
} from 'lucide-react';
import { AffiliateProduct, UserProfile, AdminSettings } from '../types';

interface MarketplaceProps {
  currentUser: UserProfile;
  products: AffiliateProduct[];
  adminSettings: AdminSettings;
  purchaseProduct: (
    productId: string, qty: number, couponCode: string, 
    shippingAddress: string, paymentMethod: 'Saved Balance' | 'Referral Balance'
  ) => { success: boolean; message: string };
}

export default function Marketplace({ currentUser, products, adminSettings, purchaseProduct }: MarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState<AffiliateProduct | null>(null);

  // Purchase state
  const [qty, setQty] = useState(1);
  const [coupon, setCoupon] = useState('');
  const [address, setAddress] = useState('');
  const [payMethod, setPayMethod] = useState<'Saved Balance' | 'Referral Balance'>('Saved Balance');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = ['ALL', 'Development & Templates', 'Productivity Tools', 'Marketing & Growth'];

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'ALL' || p.category === selectedCat;
    return matchesSearch && matchesCat && !p.isArchived;
  });

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedProduct) return;

    if (!address.trim()) {
      setError("Please fill in your Delivery Address or email download instructions.");
      return;
    }

    const res = purchaseProduct(selectedProduct.id, qty, coupon, address, payMethod);
    if (!res.success) {
      setError(res.message);
    } else {
      setSuccess(res.message);
      setQty(1);
      setCoupon('');
      setAddress('');
      setTimeout(() => setSelectedProduct(null), 1500);
    }
  };

  const getPriceBreakdown = (p: AffiliateProduct) => {
    const base = p.price * qty;
    let disc = 0;
    if (coupon.toUpperCase() === "WEALTH5" && adminSettings.isCustomerDiscountEnabled) {
      disc = base * (adminSettings.customerDiscountPercent / 100);
    }
    const shipping = p.deliveryFee * qty;
    return {
      subtotal: base,
      discount: disc,
      shipping,
      total: base - disc + shipping
    };
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {selectedProduct ? (
        // Detailed Product Page and Checkout
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Back button and item info */}
          <div className="lg:col-span-2 space-y-6">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
            >
              &larr; Back to Marketplace
            </button>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                <img 
                  src={selectedProduct.images[0]} 
                  alt={selectedProduct.name} 
                  className="object-cover w-full h-full opacity-90 hover:scale-105 transition-transform"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md font-bold uppercase tracking-wider">
                    {selectedProduct.category}
                  </span>
                  <span className="text-slate-700">•</span>
                  <span className="text-slate-500">Seller: <strong className="text-slate-300">{selectedProduct.sellerName}</strong></span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{selectedProduct.name}</h1>
                <p className="text-slate-400 text-sm leading-relaxed">{selectedProduct.description}</p>
              </div>

              {/* Specs map */}
              <div className="pt-6 border-t border-slate-800/60 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(selectedProduct.specifications).map(([key, value], i) => (
                    <div key={i} className="p-3 bg-slate-950/60 border border-slate-800/50 rounded-xl flex justify-between text-xs">
                      <span className="text-slate-500 font-semibold">{key}</span>
                      <span className="text-slate-300 font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="pt-6 border-t border-slate-800/60 flex flex-wrap gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                  <Truck className="w-4 h-4 text-emerald-500" />
                  <span>Delivery: <strong>{selectedProduct.estimatedDeliveryTime}</strong></span>
                </div>
                {selectedProduct.deliveryFee > 0 ? (
                  <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    <span>Handling Fee: <strong>${selectedProduct.deliveryFee}</strong></span>
                  </div>
                ) : (
                  <span className="px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-lg uppercase tracking-wider text-[10px]">Free Delivery</span>
                )}
              </div>
            </div>
          </div>

          {/* Checkout Panel */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 h-fit space-y-6 relative overflow-hidden">
            <h3 className="text-lg font-black text-slate-100 flex items-center gap-1.5">
              <ShoppingCart className="w-5 h-5 text-emerald-500" />
              Secure Checkout
            </h3>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex gap-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs flex gap-2">
                <CheckCircle className="w-4.5 h-4.5 shrink-0 text-emerald-500" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Purchase Quantity</label>
                <input 
                  type="number" min="1" max={selectedProduct.availableQuantity}
                  value={qty} onChange={e => setQty(Math.min(selectedProduct.availableQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">In Stock: {selectedProduct.availableQuantity}</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Promo Coupon Code</label>
                <input 
                  type="text" value={coupon} onChange={e => setCoupon(e.target.value)}
                  placeholder="e.g. WEALTH5 (for 5% Off)"
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Delivery Email / Address</label>
                <textarea 
                  value={address} onChange={e => setAddress(e.target.value)}
                  placeholder="Input email for digital download or home address for physical goods..."
                  rows={3}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Payment Wallet Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod('Saved Balance')}
                    className={`p-3 text-xs font-bold rounded-xl border transition-all text-center focus:outline-none ${
                      payMethod === 'Saved Balance' 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    Saved Bal: <p className="text-[10px] font-normal text-slate-400">${currentUser.currentSavedBalance.toLocaleString()}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod('Referral Balance')}
                    className={`p-3 text-xs font-bold rounded-xl border transition-all text-center focus:outline-none ${
                      payMethod === 'Referral Balance' 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    Referrals: <p className="text-[10px] font-normal text-slate-400">${currentUser.referralBalance.toLocaleString()}</p>
                  </button>
                </div>
              </div>

              {/* Price list */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="text-slate-300">${getPriceBreakdown(selectedProduct).subtotal.toFixed(2)}</span>
                </div>
                {getPriceBreakdown(selectedProduct).discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount (coupon applied)</span>
                    <span>-${getPriceBreakdown(selectedProduct).discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping / Handling</span>
                  <span className="text-slate-300">${getPriceBreakdown(selectedProduct).shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800/80 pt-2 font-bold text-sm">
                  <span className="text-slate-200">Total Cost</span>
                  <span className="text-emerald-400">${getPriceBreakdown(selectedProduct).total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-sm text-white shadow-lg focus:outline-none transition-all active:scale-95 cursor-pointer"
              >
                Confirm Purchase Order
              </button>
            </form>
          </div>
        </div>
      ) : (
        // Grid View of items
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
                <ShoppingBag className="w-8 h-8 text-brand-green" />
                Multi-Vendor Marketplace
              </h1>
              <p className="text-slate-400 text-sm mt-1">Browse, purchase, or claim affiliate referral commissions on validated digital items.</p>
            </div>

            {/* Search */}
            <div className="relative rounded-xl max-w-sm w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search premium templates, Notion workspaces..."
                className="block w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-100 placeholder-slate-500 text-sm"
              />
            </div>
          </div>

          {/* Filters Tab */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all focus:outline-none shrink-0 border ${
                  selectedCat === cat 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 border-transparent text-white shadow-lg' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All categories' : cat}
              </button>
            ))}
          </div>

          {/* Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((prod) => (
              <div 
                key={prod.id}
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 hover:border-emerald-500/30 rounded-3xl p-5 shadow-xl transition-all flex flex-col justify-between group cursor-pointer relative"
                onClick={() => setSelectedProduct(prod)}
              >
                {prod.isFeatured && (
                  <span className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold rounded-md text-[9px] px-2 py-0.5 uppercase tracking-wider z-10">
                    Featured
                  </span>
                )}

                <div className="space-y-4">
                  <div className="h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                    <img 
                      src={prod.images[0]} 
                      alt={prod.name} 
                      className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{prod.category}</span>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="font-bold">{prod.rating}</span>
                        <span>({prod.reviewCount})</span>
                      </div>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">{prod.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{prod.description}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/60 mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Store price</p>
                    <p className="text-base font-black text-slate-200">${prod.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Affiliate payout</p>
                    <p className="text-sm font-bold text-emerald-400">{(prod.price * (prod.commissionPercent / 100)).toFixed(2)} ({prod.commissionPercent}%)</p>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-500 space-y-2">
                <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-lg font-bold">No products found</p>
                <p className="text-sm">Try exploring alternative categories.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
