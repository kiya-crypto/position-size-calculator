'use client';

import React from 'react';
import { MarketType, TradeDirection } from '@/types/calculator';
import { TrendingUp, TrendingDown, Bitcoin, DollarSign } from 'lucide-react';

interface MarketSelectorProps {
  marketType: MarketType;
  onChangeMarketType: (type: MarketType) => void;
  direction: TradeDirection;
  onChangeDirection: (dir: TradeDirection) => void;
}

export default function MarketSelector({
  marketType,
  onChangeMarketType,
  direction,
  onChangeDirection,
}: MarketSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* 1. Market Type Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-300">
          نوع بازار معاملاتی
        </label>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => onChangeMarketType('crypto')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              marketType === 'crypto'
                ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bitcoin className="w-4 h-4 text-amber-400" />
            <span>ارز دیجیتال (Crypto)</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeMarketType('forex')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              marketType === 'forex'
                ? 'bg-blue-500/15 border border-blue-500/40 text-blue-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4 text-blue-400" />
            <span>فارکس و طلا (Forex)</span>
          </button>
        </div>
      </div>

      {/* 2. Trade Direction Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-300">
          جهت پوزیشن (اعتبارسنجی حد ضرر)
        </label>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => onChangeDirection('long')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              direction === 'long'
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>خرید (Long)</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeDirection('short')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              direction === 'short'
                ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingDown className="w-4 h-4 text-rose-400" />
            <span>فروش (Short)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
