'use client';

import React from 'react';
import { Calculator, RotateCcw, Hash } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  usePersianDigits: boolean;
  onTogglePersianDigits: () => void;
}

export default function Navbar({
  onReset,
  usePersianDigits,
  onTogglePersianDigits,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single line, no descriptors) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Calculator className="w-5 h-5" />
          </div>
          <span className="text-base sm:text-lg font-bold text-slate-100 tracking-tight whitespace-nowrap">
            محاسبه‌گر حجم پوزیشن
          </span>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
          <a
            href="#calculator-section"
            className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
          >
            ماشین‌حساب
          </a>
          <a
            href="#visual-ladder-section"
            className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
          >
            شبیه‌ساز بصری قیمت
          </a>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onTogglePersianDigits}
            title={usePersianDigits ? 'تغییر به ارقام لاتین' : 'تغییر به ارقام فارسی'}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Hash className="w-3.5 h-3.5 text-emerald-400" />
            <span>{usePersianDigits ? 'ارقام فارسی' : 'ارقام انگلیسی'}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-3.5 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95"
            title="پاک‌کردن تمامی ورودی‌ها و بازنشانی"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>حذف ورودی ها</span>
          </button>
        </div>
      </div>
    </header>
  );
}
