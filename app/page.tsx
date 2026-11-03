'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import CalculatorForm from '@/components/CalculatorForm';
import ResultCard from '@/components/ResultCard';
import {
  CalculatorInputs,
  CalculationResult,
} from '@/types/calculator';
import { calculatePositionSize } from '@/lib/calculator-engine';
import { ShieldCheck, Zap } from 'lucide-react';

const INITIAL_INPUTS: CalculatorInputs = {
  marketType: 'crypto',
  tradeDirection: 'long',
  accountBalance: 10000,
  riskAmountUsd: 200,
  riskPercent: 2.0,
  riskInputMode: 'percent',
  symbol: 'BTC/USDT',
  entryPrice: 91500,
  stopLossPrice: 89500,
  takeProfitPrice: 96500,
  leverage: 10,
  forexLotType: 'standard',
  usdJpyRate: 154.50,
};

const EMPTY_INPUTS: CalculatorInputs = {
  marketType: 'crypto',
  tradeDirection: 'long',
  accountBalance: 0,
  riskAmountUsd: 0,
  riskPercent: 0,
  riskInputMode: 'usd',
  symbol: '',
  entryPrice: 0,
  stopLossPrice: 0,
  takeProfitPrice: null,
  leverage: 1,
  forexLotType: 'standard',
  usdJpyRate: 154.50,
};

export default function HomePage() {
  const [inputs, setInputs] = useState<CalculatorInputs>(INITIAL_INPUTS);
  const [usePersianDigits, setUsePersianDigits] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Instant calculation memoized
  const result: CalculationResult = useMemo(() => {
    return calculatePositionSize(inputs);
  }, [inputs]);

  // Reset handler (حذف ورودی ها)
  const handleReset = () => {
    setInputs(EMPTY_INPUTS);
    showToast('تمامی ورودی‌های ماشین‌حساب حذف و پاکسازی شدند.');
  };

  // Restore sample data
  const handleRestoreSample = () => {
    setInputs(INITIAL_INPUTS);
    showToast('اطلاعات نمونه بارگذاری شد.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-2xl border border-emerald-400 flex items-center gap-2 animate-bounce">
          <Zap className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onReset={handleReset}
        usePersianDigits={usePersianDigits}
        onTogglePersianDigits={() => setUsePersianDigits(!usePersianDigits)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>سیستم مدیریت ریسک حرفه‌ای بازارهای مالی</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              محاسبه‌گر حرفه‌ای اندازه پوزیشن و لات (فارکس و کریپتو)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              اندازه مجاز ورود به معامله را بر اساس بالانس حساب، سقف ریسک دلاری، قیمت ورود و حد ضرر به صورت آنی محاسبه کنید؛ با پشتیبانی دقیق از پیپ جفت‌ارزهای ین ژاپن (JPY) و طلا.
            </p>
          </div>

          {/* Quick Restore Sample Button if empty */}
          <div className="flex items-center gap-2 shrink-0">
            {inputs.accountBalance === 0 && (
              <button
                type="button"
                onClick={handleRestoreSample}
                className="px-3.5 py-2 text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors whitespace-nowrap"
              >
                بارگذاری اطلاعات نمونه
              </button>
            )}
          </div>
        </section>

        {/* Calculator Main Section: Two Columns on Desktop */}
        <section
          id="calculator-section"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-8"
        >
          {/* Left Column (Inputs Form): 7 Cols */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <CalculatorForm
              inputs={inputs}
              onChangeInputs={setInputs}
              onReset={handleReset}
              usePersianDigits={usePersianDigits}
              validationError={result.errorMessage}
            />
          </div>

          {/* Right Column (Results): 5 Cols */}
          <div className="lg:col-span-5 flex flex-col gap-6 sticky top-20">
            <ResultCard
              inputs={inputs}
              result={result}
              usePersianDigits={usePersianDigits}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            محاسبه‌گر حجم پوزیشن و مدیریت سرمایه فارکس و ارز دیجیتال · طراحی‌شده برای معامله‌گران حرفه‌ای
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>مدیریت ریسک سرمایه</span>
            <span>·</span>
            <span>محاسبه پیپ و لات</span>
            <span>·</span>
            <span>RTL Persian</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
