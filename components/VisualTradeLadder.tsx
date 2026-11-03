'use client';

import React from 'react';
import {
  CalculatorInputs,
  CalculationResult,
} from '@/types/calculator';
import {
  formatFinancialNumber,
  formatUsd,
  formatPercent,
} from '@/lib/persian-utils';
import { TrendingUp, TrendingDown, Target, ShieldAlert, Award } from 'lucide-react';

interface VisualTradeLadderProps {
  inputs: CalculatorInputs;
  result: CalculationResult;
  usePersianDigits: boolean;
}

export default function VisualTradeLadder({
  inputs,
  result,
  usePersianDigits,
}: VisualTradeLadderProps) {
  if (!result.isValid) {
    return null;
  }

  const { entryPrice, stopLossPrice, takeProfitPrice, tradeDirection, marketType } = inputs;
  const isLong = tradeDirection === 'long';

  // Compute boundaries for the ladder
  const tp = takeProfitPrice || (isLong ? entryPrice + result.stopDistancePrice * 2 : entryPrice - result.stopDistancePrice * 2);
  const highest = Math.max(entryPrice, stopLossPrice, tp);
  const lowest = Math.min(entryPrice, stopLossPrice, tp);
  const span = highest - lowest || 1;

  // Normalized percentages (0% at bottom, 100% at top)
  const getPercentPosition = (price: number) => {
    return Math.min(95, Math.max(5, ((price - lowest) / span) * 100));
  };

  const entryPos = getPercentPosition(entryPrice);
  const stopPos = getPercentPosition(stopLossPrice);
  const tpPos = getPercentPosition(tp);

  // Risk vs Reward ratio representation
  const riskAmount = result.riskAmountUsd;
  const rewardAmount = result.potentialProfitUsd || riskAmount * 2;
  const totalAmount = riskAmount + rewardAmount;
  const riskBarPercent = Math.round((riskAmount / totalAmount) * 100);
  const rewardBarPercent = 100 - riskBarPercent;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            {isLong ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              نمودار شبیه‌ساز بصری سطوح قیمت و نسبت ریسک به ریوارد
            </h3>
            <span className="text-[11px] text-slate-500">
              موقعیت خطوط ورود، حد ضرر و تارگت سود
            </span>
          </div>
        </div>

        {result.riskRewardRatio && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">R:R:</span>
            <span className="font-mono-numbers font-bold text-emerald-400">
              1:{formatFinancialNumber(result.riskRewardRatio, 2, usePersianDigits)}
            </span>
          </div>
        )}
      </div>

      {/* Visual Risk / Reward Ratio Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-rose-400 font-medium flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>ریسک احتمالی: {formatUsd(result.riskAmountUsd, 2, usePersianDigits)}</span>
          </span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <Target className="w-3.5 h-3.5" />
            <span>
              سود هدف: {formatUsd(result.potentialProfitUsd || result.riskAmountUsd * 2, 2, usePersianDigits)}
            </span>
          </span>
        </div>

        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
          <div
            style={{ width: `${riskBarPercent}%` }}
            className="h-full bg-gradient-to-r from-rose-600 to-rose-500 transition-all duration-300"
            title={`ریسک: ${riskBarPercent}%`}
          />
          <div
            style={{ width: `${rewardBarPercent}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
            title={`سود: ${rewardBarPercent}%`}
          />
        </div>
      </div>

      {/* Interactive Price Ladder Scale */}
      <div className="relative h-64 bg-slate-950 border border-slate-800/80 rounded-lg p-4 flex items-center justify-between overflow-hidden">
        {/* Background grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
          <div className="border-b border-dashed border-slate-600 w-full" />
          <div className="border-b border-dashed border-slate-600 w-full" />
          <div className="border-b border-dashed border-slate-600 w-full" />
        </div>

        {/* Visual Zone Boxes (Risk & Reward) */}
        <div className="relative w-full h-full">
          {/* Take Profit Marker */}
          <div
            style={{ bottom: `${tpPos}%` }}
            className="absolute left-0 right-0 -translate-y-1/2 flex items-center justify-between px-3 py-1 bg-emerald-500/10 border-y border-emerald-500/40 rounded transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-300">
                حد سود (Take Profit)
              </span>
              {!inputs.takeProfitPrice && (
                <span className="text-[10px] text-slate-500">(پیش‌فرض 1:2)</span>
              )}
            </div>
            <div className="flex items-center gap-2 font-mono-numbers text-xs">
              <span className="font-bold text-emerald-300">
                {formatFinancialNumber(tp, 4, usePersianDigits)}
              </span>
              {result.takeProfitDistancePercent && (
                <span className="text-emerald-400/80 text-[11px]">
                  (+{formatPercent(result.takeProfitDistancePercent, 2, usePersianDigits)})
                </span>
              )}
            </div>
          </div>

          {/* Entry Price Marker */}
          <div
            style={{ bottom: `${entryPos}%` }}
            className="absolute left-0 right-0 -translate-y-1/2 flex items-center justify-between px-3 py-1.5 bg-blue-500/15 border-y-2 border-blue-500/60 rounded transition-all duration-200 z-10"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span className="text-xs font-bold text-blue-200">
                قیمت ورود (Entry Level)
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono-numbers text-xs font-bold text-white">
              <span>{formatFinancialNumber(entryPrice, 4, usePersianDigits)}</span>
              <span className="text-[11px] text-blue-300">نقطه ورود</span>
            </div>
          </div>

          {/* Stop Loss Marker */}
          <div
            style={{ bottom: `${stopPos}%` }}
            className="absolute left-0 right-0 -translate-y-1/2 flex items-center justify-between px-3 py-1 bg-rose-500/10 border-y border-rose-500/40 rounded transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-xs font-semibold text-rose-300">
                حد ضرر (Stop Loss)
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono-numbers text-xs">
              <span className="font-bold text-rose-300">
                {formatFinancialNumber(stopLossPrice, 4, usePersianDigits)}
              </span>
              <span className="text-rose-400/80 text-[11px]">
                (-{formatPercent(result.stopDistancePercent, 2, usePersianDigits)})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>فاصله تا استاپ: {result.stopDistancePips ? `${result.stopDistancePips.toFixed(1)} پیپ` : `${formatUsd(result.stopDistancePrice, 2, usePersianDigits)}`}</span>
        <span>جهت معامله: {isLong ? 'خرید (صعودی)' : 'فروش (نزولی)'}</span>
      </div>
    </div>
  );
}
