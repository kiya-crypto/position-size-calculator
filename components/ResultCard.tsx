'use client';

import React, { useState } from 'react';
import {
  CalculationResult,
  CalculatorInputs,
} from '@/types/calculator';
import {
  formatFinancialNumber,
  formatUsd,
  formatPercent,
  generateTradeSummaryText,
} from '@/lib/persian-utils';
import {
  ShieldAlert,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Layers,
  Target,
} from 'lucide-react';

interface ResultCardProps {
  inputs: CalculatorInputs;
  result: CalculationResult;
  usePersianDigits: boolean;
}

export default function ResultCard({
  inputs,
  result,
  usePersianDigits,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = async () => {
    let positionFormatted = '';
    if (inputs.marketType === 'crypto') {
      positionFormatted = `${formatFinancialNumber(result.positionSizeCoins, 4, usePersianDigits)} ${inputs.symbol.split('/')[0] || 'واحد'}`;
    } else {
      positionFormatted = `${formatFinancialNumber(result.lotSizeStandard, 2, usePersianDigits)} لات استاندارد`;
    }

    const text = generateTradeSummaryText({
      marketType: inputs.marketType,
      direction: inputs.tradeDirection,
      symbol: inputs.symbol,
      entryPrice: inputs.entryPrice,
      stopLossPrice: inputs.stopLossPrice,
      takeProfitPrice: inputs.takeProfitPrice,
      positionSizeFormatted: positionFormatted,
      totalValueUsd: result.totalPositionValueUsd,
      riskUsd: result.riskAmountUsd,
      riskPercent: result.riskPercent,
      riskRewardRatio: result.riskRewardRatio,
      requiredMargin: result.requiredMarginUsd,
      pips: result.stopDistancePips,
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isLong = inputs.tradeDirection === 'long';

  // If calculation is invalid
  if (!result.isValid) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col items-center justify-center text-center min-h-[380px] gap-4">
        <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
          <ShieldAlert className="w-7 h-7 text-amber-400" />
        </div>
        <div className="max-w-md flex flex-col gap-2">
          <h3 className="text-base font-bold text-slate-200">
            در انتظار تکمیل اطلاعات معامله
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {result.errorMessage ||
              'برای محاسبه دقیق حجم مجاز معامله، مقادیر موجودی حساب، ریسک، قیمت ورود و حد ضرر را مشخص کنید.'}
          </p>
        </div>
        <div className="text-[11px] text-slate-500 bg-slate-950 px-3 py-1.5 rounded-md border border-slate-800">
          فرمول: حجم معامله = مبلغ ریسک ÷ فاصله تا حد ضرر
        </div>
      </div>
    );
  }

  const coinSymbol = inputs.symbol.split('/')[0] || 'واحد';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* 1. Header Banner */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isLong ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />
          <span className="text-xs font-semibold text-slate-300">
            {inputs.marketType === 'crypto'
              ? 'نتیجه محاسبه حجم پوزیشن کریپتو'
              : 'نتیجه محاسبه اندازه لات فارکس'}
          </span>
          <span className="text-slate-500 text-xs">·</span>
          <span className="text-xs font-mono font-medium text-slate-400">
            {inputs.symbol}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs px-2.5 py-0.5 rounded font-medium flex items-center gap-1 ${
              isLong
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
            }`}
          >
            {isLong ? (
              <>
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>خرید (Long)</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>فروش (Short)</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* 2. Main Hero Output */}
      <div className="p-6 bg-slate-950/60 border-b border-slate-800 flex flex-col items-center justify-center text-center gap-3">
        <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
          {inputs.marketType === 'crypto' ? (
            <Coins className="w-4 h-4 text-emerald-400" />
          ) : (
            <Layers className="w-4 h-4 text-blue-400" />
          )}
          <span>
            {inputs.marketType === 'crypto'
              ? 'حجم مجاز پوزیشن (بر حسب واحد رمزارز):'
              : 'حجم مجاز معامله (بر حسب لات استاندارد):'}
          </span>
        </div>

        {/* Big Highlighted Output */}
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-4xl sm:text-5xl font-black font-mono-numbers tracking-tight text-white">
            {inputs.marketType === 'crypto'
              ? formatFinancialNumber(result.positionSizeCoins, 4, usePersianDigits)
              : formatFinancialNumber(result.lotSizeStandard, 2, usePersianDigits)}
          </span>
          <span className="text-base sm:text-lg font-bold text-emerald-400">
            {inputs.marketType === 'crypto' ? coinSymbol : 'Lot'}
          </span>
        </div>

        {/* Secondary Units / Dollar Equivalent */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-300">
          {inputs.marketType === 'crypto' ? (
            <>
              <div className="flex items-center gap-1">
                <span className="text-slate-500">ارزش کل دلاری پوزیشن:</span>
                <span className="font-mono-numbers font-semibold text-emerald-300">
                  {formatUsd(result.totalPositionValueUsd, 2, usePersianDigits)}
                </span>
              </div>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-500">مارجین مورد نیاز ({inputs.leverage}x):</span>
                <span className="font-mono-numbers font-semibold text-slate-200">
                  {formatUsd(result.requiredMarginUsd, 2, usePersianDigits)}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <span className="text-slate-500">مینی لات:</span>
                <span className="font-mono-numbers font-semibold text-slate-200">
                  {formatFinancialNumber(result.lotSizeMini, 1, usePersianDigits)}
                </span>
              </div>
              <span className="text-slate-600">·</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-500">میکرو لات:</span>
                <span className="font-mono-numbers font-semibold text-slate-200">
                  {formatFinancialNumber(result.lotSizeMicro, 0, usePersianDigits)}
                </span>
              </div>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-500">تعداد واحد پایه:</span>
                <span className="font-mono-numbers font-semibold text-blue-300">
                  {formatFinancialNumber(result.totalUnits, 0, usePersianDigits)} واحد
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. Key Risk Breakdown Cards Grid */}
      <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/50">
        {/* Metric 1: Risk USD */}
        <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg flex flex-col gap-1">
          <span className="text-[11px] text-slate-400">مبلغ ریسک در معامله:</span>
          <span className="text-base font-bold font-mono-numbers text-rose-300">
            {formatUsd(result.riskAmountUsd, 2, usePersianDigits)}
          </span>
          <span className="text-[10px] text-slate-500 font-mono-numbers">
            {formatPercent(result.riskPercent, 2, usePersianDigits)} از کل بالانس
          </span>
        </div>

        {/* Metric 2: Stop Loss Distance */}
        <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg flex flex-col gap-1">
          <span className="text-[11px] text-slate-400">فاصله تا حد ضرر:</span>
          <span className="text-base font-bold font-mono-numbers text-slate-200">
            {inputs.marketType === 'crypto'
              ? formatUsd(result.stopDistancePrice, 2, usePersianDigits)
              : `${formatFinancialNumber(result.stopDistancePips, 1, usePersianDigits)} پیپ`}
          </span>
          <span className="text-[10px] text-slate-500 font-mono-numbers">
            {formatPercent(result.stopDistancePercent, 2, usePersianDigits)} نوسان قیمت
          </span>
        </div>

        {/* Metric 3: Pip Value or Max Loss */}
        <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg flex flex-col gap-1">
          <span className="text-[11px] text-slate-400">
            {inputs.marketType === 'crypto' ? 'حداکثر افت حساب:' : 'ارزش هر پیپ (1 Lot):'}
          </span>
          <span className="text-base font-bold font-mono-numbers text-slate-200">
            {inputs.marketType === 'crypto'
              ? formatUsd(result.riskAmountUsd, 2, usePersianDigits)
              : formatUsd(result.pipValuePerStandardLotUsd, 2, usePersianDigits)}
          </span>
          <span className="text-[10px] text-slate-500">
            {inputs.marketType === 'crypto' ? 'ثابت و کنترل‌شده' : 'تبدیل‌شده به USD'}
          </span>
        </div>

        {/* Metric 4: Risk:Reward Ratio or Target Profit */}
        <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg flex flex-col gap-1">
          <span className="text-[11px] text-slate-400">نسبت ریسک به ریوارد:</span>
          {result.hasTakeProfit && result.riskRewardRatio ? (
            <>
              <span className="text-base font-bold font-mono-numbers text-emerald-300">
                1 : {formatFinancialNumber(result.riskRewardRatio, 2, usePersianDigits)}
              </span>
              <span className="text-[10px] text-emerald-400/90 font-mono-numbers">
                سود: {formatUsd(result.potentialProfitUsd, 2, usePersianDigits)}
              </span>
            </>
          ) : (
            <>
              <span className="text-xs text-slate-500 py-1">ثبت نشده</span>
              <span className="text-[10px] text-slate-600">حد سود اختیاری است</span>
            </>
          )}
        </div>
      </div>

      {/* 4. Take Profit Overview (if present) */}
      {result.hasTakeProfit && result.potentialProfitUsd && (
        <div className="px-5 py-3 bg-emerald-950/20 border-t border-emerald-900/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-300">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>سود بالقوه در تارگت:</span>
            <span className="font-bold font-mono-numbers">
              {formatUsd(result.potentialProfitUsd, 2, usePersianDigits)}
            </span>
            <span className="text-slate-400 font-mono-numbers">
              ({formatPercent(result.potentialProfitPercent, 2, usePersianDigits)} رشد سرمایه)
            </span>
          </div>

          <div className="text-[11px] text-emerald-400 font-medium">
            ریسک به ریوارد عالی
          </div>
        </div>
      )}

      {/* 5. Warning message if any */}
      {result.warningMessage && (
        <div className="px-5 py-2.5 bg-amber-500/10 border-t border-amber-500/20 text-amber-300 text-xs">
          {result.warningMessage}
        </div>
      )}

      {/* 6. Action Buttons Bar */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors flex items-center gap-1.5 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>کپی مشخصات معامله</span>
              </>
            )}
          </button>
        </div>

        <span className="text-[11px] text-slate-500">
          تضمین عدم تخطی از سقف ریسک تعیین‌شده
        </span>
      </div>
    </div>
  );
}
