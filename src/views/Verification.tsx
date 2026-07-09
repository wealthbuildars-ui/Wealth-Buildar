import React, { useState, useEffect } from 'react';
import { ShieldAlert, CreditCard, Clipboard, CheckCircle2, Clock, Upload, ArrowLeft } from 'lucide-react';
import { UserProfile, AdminSettings } from '../types';

interface VerificationProps {
  currentUser: UserProfile;
  adminSettings: AdminSettings;
  submitVerificationPayment: (proofName: string) => void;
  logout: () => void;
}

export default function Verification({ currentUser, adminSettings, submitVerificationPayment, logout }: VerificationProps) {
  const [copied, setCopied] = useState(false);
  const [proofName, setProofName] = useState('');
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');

  // Countdown simulation for 24h timer if pending
  useEffect(() => {
    if (currentUser.accountStatus !== 'Pending Verification' || !adminSettings.isTimerEnabled) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - currentUser.paymentSubmittedTime;
      const limit = 24 * 60 * 60 * 1000; // 24h
      const remaining = limit - elapsed;

      if (remaining <= 0) {
        setTimeRemaining("Verification Expired. Re-upload receipt.");
        clearInterval(interval);
      } else {
        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
        setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser, adminSettings]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(adminSettings.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofName.trim()) {
      setError("Please provide the transaction reference or receipt name.");
      return;
    }
    setError('');
    submitVerificationPayment(proofName);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 overflow-hidden shadow-2xl p-6 sm:p-10 z-10">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100">{adminSettings.siteName} Premium Enrollment</h1>
            <p className="text-sm text-slate-400">Account status: 
              <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                currentUser.accountStatus === 'Pending Verification' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                currentUser.accountStatus === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                'bg-slate-500/10 text-slate-400 border border-slate-500/20'
              }`}>
                {currentUser.accountStatus}
              </span>
            </p>
          </div>
          <button onClick={logout} className="text-xs text-slate-400 hover:text-slate-100 transition-all flex items-center gap-1 focus:outline-none">
            <ArrowLeft className="w-3.5 h-3.5" /> Logout
          </button>
        </div>

        {currentUser.accountStatus === 'Rejected' && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-300 text-sm flex gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <p className="font-bold">Prior Verification Declined</p>
              <p className="text-rose-400 mt-1">{currentUser.rejectionReason || "Audit discrepancy. Please submit correct receipt parameters."}</p>
            </div>
          </div>
        )}

        {currentUser.accountStatus === 'Pending Verification' ? (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto animate-pulse text-amber-400">
              <Clock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Audit Queue Pending Verification</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                We are validating your transfer of <strong className="text-emerald-400">₦{adminSettings.registrationFee.toLocaleString()}</strong>. Standard approval sweeps occur within 1 to 24 hours.
              </p>
            </div>

            {adminSettings.isTimerEnabled && (
              <div className="p-4 bg-slate-950 rounded-2xl inline-block border border-slate-800">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Time Remaining for Verification</p>
                <p className="font-mono text-2xl font-bold text-amber-500 tracking-wider">{timeRemaining || "Calculating..."}</p>
              </div>
            )}

            <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row justify-center gap-4 text-xs text-slate-400">
              <p>Uploaded Reference: <strong className="text-slate-200">{currentUser.paymentProofName}</strong></p>
              <span className="hidden sm:inline">•</span>
              <p>Submitted Time: <strong className="text-slate-200">{new Date(currentUser.paymentSubmittedTime).toLocaleString()}</strong></p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <p className="font-bold">Enrollment Guide</p>
                <p className="text-emerald-300 mt-0.5">Please make a direct bank transfer of the required activation fee to the account details listed below, then input your transaction receipt details to launch auditing.</p>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-inner">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-slate-500">Official Receiving Bank Parameters</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-slate-500 text-xs">Bank Provider</p>
                  <p className="font-bold text-slate-200 mt-0.5">{adminSettings.bankName}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Registration Fee</p>
                  <p className="font-bold text-emerald-400 mt-0.5">₦{adminSettings.registrationFee.toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-500 text-xs">Account Name</p>
                  <p className="font-bold text-slate-200 mt-0.5">{adminSettings.accountName}</p>
                </div>
                <div className="col-span-2 flex justify-between items-center border-t border-slate-800/60 pt-3">
                  <div>
                    <p className="text-slate-500 text-xs">Account Number</p>
                    <p className="font-mono text-lg font-bold text-amber-400 mt-0.5 tracking-wider">{adminSettings.accountNumber}</p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500/30 transition-all text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    <Clipboard className="w-4 h-4" />
                    <span className="text-xs">{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 pt-4 border-t border-slate-800">
              {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Transaction Reference Name / OPay Session ID</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={proofName}
                    onChange={(e) => setProofName(e.target.value)}
                    placeholder="OPay Session ID: 26112891283..."
                    className="block w-full pl-10 pr-3 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-100 placeholder-slate-500 text-sm transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 active:scale-95 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Submit Verification Proof
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
