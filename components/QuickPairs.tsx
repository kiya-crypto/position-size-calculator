'use client';

import React from 'react';
import { MarketType } from '@/types/calculator';
import { FOREX_PAIRS } from '@/lib/forex-pairs';
import { CRYPTO_PAIRS } from '@/lib/crypto-pairs';

interface QuickPairsProps {
  marketType: MarketType;
  selectedSymbol: string;
  onSelectPair: (symbol: string, defaultPrice?: number) => void;
}

export default function QuickPairs({
  marketType,
  selectedSymbol,
  onSelectPair,
}: QuickPairsProps) {
  const pairs = marketType === 'crypto' ? CRYPTO_PAIRS : FOREX_PAIRS;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>نمادهای پرمعامله و سریع:</span>
        <span className="text-[11px] text-slate-500">یا نماد دلخواه خود را تایپ کنید</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {pairs.slice(0, 8).map((pair) => {
          const isSelected =
            selectedSymbol.toUpperCase().replace('/', '') ===
            pair.symbol.toUpperCase().replace('/', '');

          return (
            <button
              key={pair.symbol}
              type="button"
              onClick={() => onSelectPair(pair.symbol, pair.defaultPrice)}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md border transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              {pair.symbol}
            </button>
          );
        })}
      </div>
    </div>
  );
}
