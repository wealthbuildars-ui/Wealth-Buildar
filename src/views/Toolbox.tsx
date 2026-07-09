import React, { useState } from 'react';
import { 
  Calculator, Percent, LineChart as ChartIcon, 
  HelpCircle, DollarSign, Sparkles, TrendingUp, RefreshCw 
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { calculateCompoundInterest, calculateFreelanceRate, evaluateDigitalProductIdea } from '../data';

export default function Toolbox() {
  const [activeSubTab, setActiveSubTab] = useState<'COMPOUND' | 'FREELANCE' | 'DIGITAL_PRODUCT' | 'ROI'>('COMPOUND');

  // 1. Compound states
  const [principal, setPrincipal] = useState(1000);
  const [contribution, setContribution] = useState(200);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(15);

  const interestData = calculateCompoundInterest(principal, contribution, rate, years);
  const finalBalance = interestData[interestData.length - 1]?.balance || 0;
  const finalContributions = interestData[interestData.length - 1]?.contributions || 0;
  const finalInterest = finalBalance - finalContributions;

  // 2. Freelance states
  const [targetNet, setTargetNet] = useState(5000);
  const [expenses, setExpenses] = useState(800);
  const [taxRate, setTaxRate] = useState(20);
  const [billableHours, setBillableHours] = useState(25);
  const [vacationWeeks, setVacationWeeks] = useState(4);

  const freelanceResult = calculateFreelanceRate(targetNet, expenses, taxRate, billableHours, vacationWeeks);

  // 3. Digital product idea validation metrics (0-10 scale)
  const [pain, setPain] = useState(7);
  const [market, setMarket] = useState(8);
  const [production, setProduction] = useState(6);
  const [margin, setMargin] = useState(9);

  const productEvaluation = evaluateDigitalProductIdea(pain, market, production, margin);

  // 4. ROI Calculator States
  const [adSpend, setAdSpend] = useState(500);
  const [cpc, setCpc] = useState(0.5);
  const [convRate, setConvRate] = useState(2.5); // %
  const [itemPrice, setItemPrice] = useState(49);

  const clicks = cpc > 0 ? adSpend / cpc : 0;
  const salesCount = clicks * (convRate / 100);
  const grossRev = salesCount * itemPrice;
  const netProfit = grossRev - adSpend;
  const roas = adSpend > 0 ? grossRev / adSpend : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <Calculator className="w-8 h-8 text-brand-green" />
          Platform Toolbox
        </h1>
        <p className="text-slate-400 text-sm mt-1">Simulate investment compound curves, freelance hourly formulas, or digital product validation ratings.</p>
      </div>

      {/* Sub tabs selector */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-800 pb-px">
        <button
          onClick={() => setActiveSubTab('COMPOUND')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all focus:outline-none shrink-0 ${
            activeSubTab === 'COMPOUND' 
              ? 'border-brand-green text-brand-green font-bold' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Compound Interest
        </button>
        <button
          onClick={() => setActiveSubTab('FREELANCE')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all focus:outline-none shrink-0 ${
            activeSubTab === 'FREELANCE' 
              ? 'border-brand-green text-brand-green font-bold' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Freelance Planner
        </button>
        <button
          onClick={() => setActiveSubTab('DIGITAL_PRODUCT')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all focus:outline-none shrink-0 ${
            activeSubTab === 'DIGITAL_PRODUCT' 
              ? 'border-brand-green text-brand-green font-bold' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Product Evaluator
        </button>
        <button
          onClick={() => setActiveSubTab('ROI')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all focus:outline-none shrink-0 ${
            activeSubTab === 'ROI' 
              ? 'border-brand-green text-brand-green font-bold' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Ad Campaign ROI
        </button>
      </div>

      {/* Calculator views */}
      {activeSubTab === 'COMPOUND' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-amber-500" />
              Compounding Inputs
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Initial Deposit ($)</label>
                <input 
                  type="number" 
                  value={principal} 
                  onChange={e => setPrincipal(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Monthly Contribution ($)</label>
                <input 
                  type="number" 
                  value={contribution} 
                  onChange={e => setContribution(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Annual Return Rate (%)</label>
                <input 
                  type="number" 
                  value={rate} 
                  onChange={e => setRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Investment Horizon (Years)</label>
                <input 
                  type="number" 
                  value={years} 
                  onChange={e => setYears(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Results and chart */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-center">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Total Balance</p>
                <p className="text-lg sm:text-2xl font-extrabold text-emerald-400 mt-1">${finalBalance.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-center">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Total Capital</p>
                <p className="text-lg sm:text-2xl font-extrabold text-slate-300 mt-1">${finalContributions.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-center">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Interest Earned</p>
                <p className="text-lg sm:text-2xl font-extrabold text-amber-500 mt-1">${finalInterest.toLocaleString()}</p>
              </div>
            </div>

            {/* Recharts chart */}
            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={interestData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="year" stroke="#475569" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis stroke="#475569" />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px' }} />
                  <Legend />
                  <Line name="Cumulative Balance" type="monotone" dataKey="balance" stroke="#10B981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  <Line name="Capital Deposits" type="monotone" dataKey="contributions" stroke="#3B82F6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'FREELANCE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-amber-500" />
              Freelance Metrics
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Target Net Monthly Income ($)</label>
                <input 
                  type="number" 
                  value={targetNet} 
                  onChange={e => setTargetNet(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Monthly Business Expenses ($)</label>
                <input 
                  type="number" 
                  value={expenses} 
                  onChange={e => setExpenses(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Estimated Tax Rate (%)</label>
                <input 
                  type="number" 
                  value={taxRate} 
                  onChange={e => setTaxRate(Math.min(90, Math.max(0, parseFloat(e.target.value) || 0)))}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Weekly Billable Hours</label>
                <input 
                  type="number" 
                  value={billableHours} 
                  onChange={e => setBillableHours(Math.min(100, Math.max(1, parseFloat(e.target.value) || 1)))}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Non-working Weeks / Year</label>
                <input 
                  type="number" 
                  value={vacationWeeks} 
                  onChange={e => setVacationWeeks(Math.min(51, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Results layout */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div className="text-center py-10 space-y-4">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Your Target Billable Rate</p>
              <h2 className="text-5xl sm:text-6xl font-extrabold text-emerald-400 tracking-tight">${freelanceResult.hourlyRate}<span className="text-lg font-medium text-slate-500">/hr</span></h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">To clear ${targetNet.toLocaleString()} net every month after covering taxes and operational overhead.</p>
            </div>

            <div className="border-t border-slate-800/60 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Gross Annual Need</p>
                <p className="text-lg font-bold text-slate-200 mt-1">${freelanceResult.annualGrossRevenueNeeded.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Estimated Annual Tax</p>
                <p className="text-lg font-bold text-slate-200 mt-1">${freelanceResult.annualTaxAmount.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Billable Hours / Yr</p>
                <p className="text-lg font-bold text-slate-200 mt-1">{freelanceResult.hoursPerYear} hrs</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'DIGITAL_PRODUCT' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sliders inputs */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-amber-500" />
              Evaluation Criteria
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <span>Pain Point Severity</span>
                  <span className="text-emerald-400">{pain}/10</span>
                </div>
                <input 
                  type="range" min="1" max="10" step="1" 
                  value={pain} onChange={e => setPain(parseInt(e.target.value))}
                  className="w-full accent-brand-green h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <span>Market Interest / Size</span>
                  <span className="text-emerald-400">{market}/10</span>
                </div>
                <input 
                  type="range" min="1" max="10" step="1" 
                  value={market} onChange={e => setMarket(parseInt(e.target.value))}
                  className="w-full accent-brand-green h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <span>Ease of Production</span>
                  <span className="text-emerald-400">{production}/10</span>
                </div>
                <input 
                  type="range" min="1" max="10" step="1" 
                  value={production} onChange={e => setProduction(parseInt(e.target.value))}
                  className="w-full accent-brand-green h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <span>Margin & Scalability</span>
                  <span className="text-emerald-400">{margin}/10</span>
                </div>
                <input 
                  type="range" min="1" max="10" step="1" 
                  value={margin} onChange={e => setMargin(parseInt(e.target.value))}
                  className="w-full accent-brand-green h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Results scores */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div className="text-center py-6 space-y-3">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Idea Viability Score</p>
              <h2 className="text-6xl font-extrabold text-emerald-400 tracking-tight">{productEvaluation.score}%</h2>
              <span className="inline-block px-3.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold rounded-lg text-xs tracking-wider uppercase mt-2">
                {productEvaluation.rating}
              </span>
            </div>

            <div className="border-t border-slate-800/60 pt-6 space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Criteria breakdown</h4>
              <div className="space-y-3">
                {productEvaluation.breakdown.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{item.criterion}</span>
                    <div className="flex items-center gap-3 w-1/2">
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.score}%` }} />
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-300 w-8 text-right">{item.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'ROI' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-amber-500" />
              Ad Spending Targets
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Ad Budget ($)</label>
                <input 
                  type="number" 
                  value={adSpend} 
                  onChange={e => setAdSpend(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Cost Per Click ($)</label>
                <input 
                  type="number" step="0.05"
                  value={cpc} 
                  onChange={e => setCpc(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Conversion Rate (%)</label>
                <input 
                  type="number" step="0.1"
                  value={convRate} 
                  onChange={e => setConvRate(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Selling Price of Product ($)</label>
                <input 
                  type="number" 
                  value={itemPrice} 
                  onChange={e => setItemPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="block w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Results table */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <div className="text-center py-6 space-y-3">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Simulated Net Profit</p>
              <h2 className={`text-5xl font-extrabold tracking-tight ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <span className={`inline-block px-3.5 py-1 rounded-lg text-xs font-extrabold tracking-wider uppercase mt-2 border ${
                netProfit >= 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                ROAS: {roas.toFixed(2)}x
              </span>
            </div>

            <div className="border-t border-slate-800/60 pt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Estimated Clicks</p>
                <p className="text-lg font-extrabold text-slate-200 mt-1">{Math.floor(clicks)}</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Estimated Sales</p>
                <p className="text-lg font-extrabold text-slate-200 mt-1">{salesCount.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
