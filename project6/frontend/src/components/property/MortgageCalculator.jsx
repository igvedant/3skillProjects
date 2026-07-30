import React, { useState, useMemo } from 'react';
import { Calculator, IndianRupee, Percent, Calendar, PieChart, ShieldCheck, Home } from 'lucide-react';

const MortgageCalculator = ({ defaultPrice = 12000000 }) => {
  const [homePrice, setHomePrice] = useState(defaultPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTermYears, setLoanTermYears] = useState(20);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [annualInsurance, setAnnualInsurance] = useState(24000);

  const calculations = useMemo(() => {
    const price = Number(homePrice) || 0;
    const downPayment = (price * (Number(downPaymentPercent) || 0)) / 100;
    const principalLoan = Math.max(0, price - downPayment);

    const monthlyInterestRate = (Number(interestRate) || 0) / 100 / 12;
    const totalPayments = (Number(loanTermYears) || 20) * 12;

    let monthlyPrincipalAndInterest = 0;
    if (monthlyInterestRate > 0 && principalLoan > 0) {
      monthlyPrincipalAndInterest =
        (principalLoan *
          (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments))) /
        (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
    } else if (principalLoan > 0) {
      monthlyPrincipalAndInterest = principalLoan / totalPayments;
    }

    const monthlyTax = (price * (Number(propertyTaxRate) || 0)) / 100 / 12;
    const monthlyIns = (Number(annualInsurance) || 0) / 12;
    const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyTax + monthlyIns;

    return {
      downPayment,
      principalLoan,
      monthlyPrincipalAndInterest: Math.round(monthlyPrincipalAndInterest),
      monthlyTax: Math.round(monthlyTax),
      monthlyIns: Math.round(monthlyIns),
      totalMonthlyPayment: Math.round(totalMonthlyPayment)
    };
  }, [homePrice, downPaymentPercent, interestRate, loanTermYears, propertyTaxRate, annualInsurance]);

  const formatRupees = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white font-display">Mortgage & Loan Calculator</h3>
          <p className="text-xs text-slate-400">Estimate your monthly home financing & EMI breakdown in Rupees (₹)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="space-y-5">
          {/* Home Price Input */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
              <label>Home Purchase Price (₹)</label>
              <span className="text-cyan-400 font-display text-sm">{formatRupees(homePrice)}</span>
            </div>
            <input
              type="number"
              value={homePrice}
              onChange={(e) => setHomePrice(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-xl text-sm text-white font-semibold mb-2"
            />
            <input
              type="range"
              min="1000000"
              max="200000000"
              step="500000"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Down Payment Percent Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2">
              <label>Down Payment ({downPaymentPercent}%)</label>
              <span className="text-emerald-400 font-display text-sm">
                {formatRupees(calculations.downPayment)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          {/* Interest Rate & Loan Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 block">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 block">Loan Term</label>
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                {[15, 20, 30].map((term) => (
                  <button
                    key={term}
                    onClick={() => setLoanTermYears(term)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      loanTermYears === term
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {term} Yrs
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Result Summary Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Estimated Monthly EMI
            </span>
            <p className="text-4xl font-extrabold text-cyan-400 font-display mb-6">
              {formatRupees(calculations.totalMonthlyPayment)}
              <span className="text-sm font-normal text-slate-400">/month</span>
            </p>

            {/* Visual Progress Breakdown Bar */}
            <div className="h-3 rounded-full bg-slate-800 overflow-hidden flex mb-6">
              <div
                style={{
                  width: `${(calculations.monthlyPrincipalAndInterest / (calculations.totalMonthlyPayment || 1)) * 100}%`
                }}
                className="bg-cyan-500 h-full"
                title="Principal & Interest"
              />
              <div
                style={{
                  width: `${(calculations.monthlyTax / (calculations.totalMonthlyPayment || 1)) * 100}%`
                }}
                className="bg-emerald-400 h-full"
                title="Property Taxes"
              />
              <div
                style={{
                  width: `${(calculations.monthlyIns / (calculations.totalMonthlyPayment || 1)) * 100}%`
                }}
                className="bg-amber-400 h-full"
                title="Insurance"
              />
            </div>

            {/* Detailed Legend Items */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-cyan-500" />
                  Principal & Interest
                </span>
                <span className="font-bold text-white">{formatRupees(calculations.monthlyPrincipalAndInterest)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  Property Taxes (Est.)
                </span>
                <span className="font-bold text-white">{formatRupees(calculations.monthlyTax)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  Home Insurance
                </span>
                <span className="font-bold text-white">{formatRupees(calculations.monthlyIns)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Loan Principal: {formatRupees(calculations.principalLoan)}</span>
            <span className="text-emerald-400 font-semibold">Pre-Approval Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
