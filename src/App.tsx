import React, { useState } from 'react';
import { 
  Home, Compass, Calculator, Award, Bot, 
  ShoppingBag, Building, ShieldAlert, LogOut, Wallet, Flame, Menu, X, Globe, User 
} from 'lucide-react';
import { useAppStore } from './state/Store';

// Views
import Auth from './views/Auth';
import Verification from './views/Verification';
import Dashboard from './views/Dashboard';
import Discover from './views/Discover';
import Toolbox from './views/Toolbox';
import Quizzes from './views/Quizzes';
import Marketplace from './views/Marketplace';
import SellerHub from './views/SellerHub';
import AiAssistant from './views/AiAssistant';
import AdminPanel from './views/AdminPanel';

export default function App() {
  const {
    currentUser,
    users,
    products,
    orders,
    tickets,
    campaigns,
    withdrawals,
    adminSettings,
    savedArticleIds,
    login,
    signup,
    logout,
    submitVerificationPayment,
    addFunds,
    toggleSaveArticle,
    addBadge,
    createSupportTicket: fileSupportTicket,
    requestWithdrawal,
    purchaseProduct,
    registerSeller,
    addProduct,
    approveUser,
    rejectUser,
    processWithdrawal,
    processAdCampaign,
    replyToTicket,
    updateSettings
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If not logged in
  if (!currentUser) {
    return <Auth login={login} signup={signup} />;
  }

  // If not fully verified (and not the Administrator account)
  const isAdmin = currentUser.email.toLowerCase() === 'wealthbuilder@gmail.com';
  if (currentUser.accountStatus !== 'Approved' && !isAdmin) {
    return (
      <Verification 
        currentUser={currentUser} 
        adminSettings={adminSettings} 
        submitVerificationPayment={submitVerificationPayment} 
        logout={logout} 
      />
    );
  }

  // Navigation Items
  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { icon: <Compass className="w-5 h-5" />, label: 'Blueprints' },
    { icon: <Calculator className="w-5 h-5" />, label: 'Toolbox' },
    { icon: <Award className="w-5 h-5" />, label: 'Quizzes' },
    { icon: <ShoppingBag className="w-5 h-5" />, label: 'Marketplace' },
    { icon: <Building className="w-5 h-5" />, label: 'Seller Hub' },
    { icon: <Bot className="w-5 h-5" />, label: 'AI Strategist' },
  ];

  // Admin access
  if (isAdmin) {
    navItems.push({ icon: <ShieldAlert className="w-5 h-5" />, label: 'Admin Panel' });
  }

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Dashboard 
            currentUser={currentUser} 
            tickets={tickets} 
            withdrawals={withdrawals} 
            adminSettings={adminSettings}
            fileSupportTicket={fileSupportTicket}
            requestWithdrawal={requestWithdrawal}
            addFunds={addFunds}
            onNavigateToTab={setActiveTab}
          />
        );
      case 1:
        return (
          <Discover 
            savedArticleIds={savedArticleIds} 
            toggleSaveArticle={toggleSaveArticle} 
            onNavigateToTab={setActiveTab}
          />
        );
      case 2:
        return <Toolbox />;
      case 3:
        return <Quizzes currentUser={currentUser} addBadge={addBadge} />;
      case 4:
        return (
          <Marketplace 
            currentUser={currentUser} 
            products={products} 
            adminSettings={adminSettings} 
            purchaseProduct={purchaseProduct} 
          />
        );
      case 5:
        return (
          <SellerHub 
            currentUser={currentUser} 
            products={products} 
            orders={orders} 
            registerSeller={registerSeller} 
            addProduct={addProduct}
            requestWithdrawal={requestWithdrawal}
          />
        );
      case 6:
        return <AiAssistant currentUser={currentUser} />;
      case 7:
        if (isAdmin) {
          return (
            <AdminPanel 
              currentUser={currentUser} 
              users={users} 
              tickets={tickets} 
              campaigns={campaigns} 
              withdrawals={withdrawals} 
              adminSettings={adminSettings}
              approveUser={approveUser}
              rejectUser={rejectUser}
              processWithdrawal={processWithdrawal}
              processAdCampaign={processAdCampaign}
              replyToTicket={replyToTicket}
              updateSettings={updateSettings}
            />
          );
        }
        return <div className="text-center py-10">Access Denied</div>;
      default:
        return <Dashboard currentUser={currentUser} tickets={tickets} withdrawals={withdrawals} adminSettings={adminSettings} fileSupportTicket={fileSupportTicket} requestWithdrawal={requestWithdrawal} addFunds={addFunds} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none" />

      {/* Top Header */}
      <header className="sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-brand-green">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-emerald-400 via-emerald-500 to-amber-400 bg-clip-text text-transparent">
                {adminSettings.siteName}
              </h1>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Learn • Earn • Scale</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveTab(idx); setMobileMenuOpen(false); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all focus:outline-none cursor-pointer ${
                  activeTab === idx 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Header Profile / Log out button */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-200 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> {currentUser.displayName}
              </p>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                Saved Balance: ${currentUser.currentSavedBalance.toLocaleString()}
              </p>
            </div>

            <button
              onClick={logout}
              className="p-2.5 bg-slate-900 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 rounded-xl transition-all focus:outline-none"
              title="Log Out"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 bg-slate-900 border border-slate-850 rounded-xl text-slate-300 hover:text-slate-100 transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-slate-950/95 backdrop-blur-xl z-40 border-t border-slate-900 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-900 pb-4">
              <div>
                <p className="text-xs font-bold text-slate-200">{currentUser.displayName}</p>
                <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                  Saved Balance: ${currentUser.currentSavedBalance.toLocaleString()}
                </p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-rose-600/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveTab(idx); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl text-sm font-bold transition-all text-left ${
                    activeTab === idx 
                      ? 'bg-emerald-500/15 border-l-4 border-emerald-500 text-emerald-300' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Panel */}
      <main className="flex-1 pb-16 pt-6 relative z-10">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500 z-10">
        <p className="max-w-md mx-auto px-4 leading-relaxed">
          &copy; {new Date().getFullYear()} {adminSettings.siteName} Global Inc. All rights reserved. Platform audits occur 24/7.
        </p>
      </footer>
    </div>
  );
}
