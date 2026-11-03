'use client';

import React, { useState } from 'react';
import {
  CalculatorInputs,
  MarketType,
  TradeDirection,
  RiskInputMode,
  ForexLotType,
} from '@/types/calculator';
import MarketSelector from './MarketSelector';
import QuickPairs from './QuickPairs';
import {
  Sliders,
  RotateCcw,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toPersianDigits } from '@/lib/persian-utils';

interface CalculatorFormProps {
  inputs: CalculatorInputs;
  onChangeInputs: (inputs: CalculatorInputs) => void;
  onReset: () => void;
  usePersianDigits: boolean;
  validationError?: string;
}

export default function CalculatorForm({
  inputs,
  onChangeInputs,
  onReset,
  usePersianDigits,
  validationError,
}: CalculatorFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const RISK_PERCENT_PRESETS = [0.5, 1.0, 1.5, 2.0, 3.0, 5.0];
  const CRYPTO_LEVERAGE_PRESETS = [1, 2, 5, 10, 20, 50, 100];

  const handleBalanceChange = (valStr: string) => {
    const val = parseFloat(valStr) || 0;
    if (inputs.riskInputMode === 'percent') {
      const newRiskUsd = (val * inputs.riskPercent) / 100;
      onChangeInputs({
        ...inputs,
        accountBalance: val,
        riskAmountUsd: Number(newRiskUsd.toFixed(2)),
      });
    } else {
      const newRiskPercent = val > 0 ? (inputs.riskAmountUsd / val) * 100 : 0;
      onChangeInputs({
        ...inputs,
        accountBalance: val,
        riskPercent: Number(newRiskPercent.toFixed(2)),
      });
    }
  };

  const handleRiskUsdChange = (valStr: string) => {
    const val = parseFloat(valStr) || 0;
    const newPercent = inputs.accountBalance > 0 ? (val / inputs.accountBalance) * 100 : 0;
    onChangeInputs({
      ...inputs,
      riskAmountUsd: val,
      riskPercent: Number(newPercent.toFixed(2)),
      riskInputMode: 'usd',
    });
  };

  const handleRiskPercentChange = (valStr: string) => {
    const val = parseFloat(valStr) || 0;
    const newUsd = (inputs.accountBalance * val) / 100;
    onChangeInputs({
      ...inputs,
      riskPercent: val,
      riskAmountUsd: Number(newUsd.toFixed(2)),
      riskInputMode: 'percent',
    });
  };

  const handleSelectRiskPreset = (preset: number) => {
    const newUsd = (inputs.accountBalance * preset) / 100;
    onChangeInputs({
      ...inputs,
      riskPercent: preset,
      riskAmountUsd: Number(newUsd.toFixed(2)),
      riskInputMode: 'percent',
    });
  };

  const handleSelectQuickPair = (symbol: string, defaultPrice?: number) => {
    const isCrypto = inputs.marketType === 'crypto';
    let newEntry = inputs.entryPrice;
    let newStop = inputs.stopLossPrice;
    let newTP = inputs.takeProfitPrice;

    if (defaultPrice) {
      newEntry = defaultPrice;
      if (inputs.tradeDirection === 'long') {
        const offset = defaultPrice * (isCrypto ? 0.03 : 0.003);
        newStop = Number((defaultPrice - offset).toFixed(4));
        newTP = Number((defaultPrice + offset * 2).toFixed(4));
      } else {
        const offset = defaultPrice * (isCrypto ? 0.03 : 0.003);
        newStop = Number((defaultPrice + offset).toFixed(4));
        newTP = Number((defaultPrice - offset * 2).toFixed(4));
      }
    }

    onChangeInputs({
      ...inputs,
      symbol,
      entryPrice: newEntry,
      stopLossPrice: newStop,
      takeProfitPrice: newTP,
    });
  };

  const handleDirectionChange = (newDir: TradeDirection) => {
    // If user flips direction, smartly adjust SL if it would cause immediate invalid state
    let newStop = inputs.stopLossPrice;
    let newTP = inputs.takeProfitPrice;
    const entry = inputs.entryPrice;

    if (entry > 0 && newStop > 0) {
      const distance = Math.abs(entry - newStop);
      if (newDir === 'long' && newStop >= entry) {
        newStop = Number((entry - distance).toFixed(4));
        if (newTP) newTP = Number((entry + distance * 2).toFixed(4));
      } else if (newDir === 'short' && newStop <= entry) {
        newStop = Number((entry + distance).toFixed(4));
        if (newTP) newTP = Number((entry - distance * 2).toFixed(4));
      }
    }

    onChangeInputs({
      ...inputs,
      tradeDirection: newDir,
      stopLossPrice: newStop,
      takeProfitPrice: newTP,
    });
  };

  const handleMarketTypeChange = (newType: MarketType) => {
    const isNowCrypto = newType === 'crypto';
    const newSymbol = isNowCrypto ? 'BTC/USDT' : 'EUR/USD';
    const newEntry = isNowCrypto ? 91500 : 1.0850;
    const offset = isNowCrypto ? 1500 : 0.0030;
    const newStop =
      inputs.tradeDirection === 'long' ? newEntry - offset : newEntry + offset;
    const newTP =
      inputs.tradeDirection === 'long' ? newEntry + offset * 2 : newEntry - offset * 2;

    onChangeInputs({
      ...inputs,
      marketType: newType,
      symbol: newSymbol,
      entryPrice: newEntry,
      stopLossPrice: Number(newStop.toFixed(4)),
      takeProfitPrice: Number(newTP.toFixed(4)),
    });
  };

  const isLong = inputs.tradeDirection === 'long';
  const isStopInvalid = isLong
    ? inputs.stopLossPrice >= inputs.entryPrice && inputs.entryPrice > 0 && inputs.stopLossPrice > 0
    : inputs.stopLossPrice <= inputs.entryPrice && inputs.entryPrice > 0 && inputs.stopLossPrice > 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl flex flex-col gap-6">
      {/* 1. Market & Direction Selection */}
      <MarketSelector
        marketType={inputs.marketType}
        onChangeMarketType={handleMarketTypeChange}
        direction={inputs.tradeDirection}
        onChangeDirection={handleDirectionChange}
      />

      {/* 2. Forex Lot Type Selector (When Forex is active) */}
      {inputs.marketType === 'forex' && (
        <div className="flex flex-col gap-1.5 p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>واحد لات معاملاتی (Forex Lot Unit)</span>
            <span className="text-[11px] text-slate-500">مبنای اصلی محاسبه لات</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => onChangeInputs({ ...inputs, forexLotType: 'standard' })}
              className={`py-2 px-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center justify-center gap-1 ${
                inputs.forexLotType === 'standard' || !inputs.forexLotType
                  ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>لات استاندارد</span>
              <span className="text-[10px] opacity-75 font-mono">(1.0)</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeInputs({ ...inputs, forexLotType: 'mini' })}
              className={`py-2 px-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center justify-center gap-1 ${
                inputs.forexLotType === 'mini'
                  ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>مینی لات</span>
              <span className="text-[10px] opacity-75 font-mono">(0.1)</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeInputs({ ...inputs, forexLotType: 'micro' })}
              className={`py-2 px-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center justify-center gap-1 ${
                inputs.forexLotType === 'micro'
                  ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>میکرو لات</span>
              <span className="text-[10px] opacity-75 font-mono">(0.01)</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Quick Symbol Selector */}
      <QuickPairs
        marketType={inputs.marketType}
        selectedSymbol={inputs.symbol}
        onSelectPair={handleSelectQuickPair}
      />

      {/* 4. Account Balance & Risk Amount Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
        {/* Account Balance */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>موجودی کل حساب (Balance)</span>
            <span className="text-[11px] text-slate-500">دلار آمریکا (USD)</span>
          </label>
          <div className="relative">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm pointer-events-none">
              $
            </span>
            <input
              type="number"
              step="any"
              min="0"
              value={inputs.accountBalance || ''}
              onChange={(e) => handleBalanceChange(e.target.value)}
              placeholder="10000"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg pr-8 pl-3 py-2.5 text-sm text-slate-100 font-mono-numbers outline-none transition-colors"
            />
          </div>
        </div>

        {/* Risk Amount (USD or %) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              میزان ریسک معامله
            </label>
            {/* Mode switch */}
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => onChangeInputs({ ...inputs, riskInputMode: 'usd' })}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  inputs.riskInputMode === 'usd'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                دلار ($)
              </button>
              <button
                type="button"
                onClick={() => onChangeInputs({ ...inputs, riskInputMode: 'percent' })}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  inputs.riskInputMode === 'percent'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                درصد (%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* USD Input */}
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs pointer-events-none">
                $
              </span>
              <input
                type="number"
                step="any"
                min="0"
                value={inputs.riskAmountUsd || ''}
                onChange={(e) => handleRiskUsdChange(e.target.value)}
                placeholder="200"
                className={`w-full bg-slate-950 border rounded-lg pr-7 pl-2 py-2.5 text-sm text-slate-100 font-mono-numbers outline-none transition-colors ${
                  inputs.riskInputMode === 'usd'
                    ? 'border-emerald-500/70 ring-1 ring-emerald-500/30'
                    : 'border-slate-800'
                }`}
              />
            </div>

            {/* Percent Input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs pointer-events-none">
                %
              </span>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={inputs.riskPercent || ''}
                onChange={(e) => handleRiskPercentChange(e.target.value)}
                placeholder="2.0"
                className={`w-full bg-slate-950 border rounded-lg pr-3 pl-7 py-2.5 text-sm text-slate-100 font-mono-numbers outline-none transition-colors ${
                  inputs.riskInputMode === 'percent'
                    ? 'border-emerald-500/70 ring-1 ring-emerald-500/30'
                    : 'border-slate-800'
                }`}
              />
            </div>
          </div>

          {/* Quick Risk Presets */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-500">درصد سریع:</span>
            {RISK_PERCENT_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleSelectRiskPreset(p)}
                className={`px-1.5 py-0.5 text-[11px] font-mono-numbers rounded border transition-colors ${
                  inputs.riskPercent === p && inputs.riskInputMode === 'percent'
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {usePersianDigits ? toPersianDigits(p) : p}٪
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Symbol & Price Levels */}
      <div className="flex flex-col gap-4 pt-2 border-t border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Symbol */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">
              نماد معاملاتی (Symbol)
            </label>
            <input
              type="text"
              value={inputs.symbol}
              onChange={(e) => onChangeInputs({ ...inputs, symbol: e.target.value.toUpperCase() })}
              placeholder={inputs.marketType === 'crypto' ? 'BTC/USDT' : 'EUR/USD'}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-100 outline-none uppercase transition-colors"
            />
          </div>

          {/* Entry Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>قیمت ورود (Entry)</span>
              <span className="text-[11px] text-slate-500">نقطه ورود</span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={inputs.entryPrice || ''}
              onChange={(e) =>
                onChangeInputs({
                  ...inputs,
                  entryPrice: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3 py-2.5 text-sm text-slate-100 font-mono-numbers outline-none transition-colors"
            />
          </div>

          {/* Stop Loss Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>قیمت حد ضرر (Stop Loss)</span>
              <span className={isLong ? 'text-[11px] text-rose-400' : 'text-[11px] text-rose-400'}>
                {isLong ? 'باید کمتر از ورود باشد' : 'باید بیشتر از ورود باشد'}
              </span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={inputs.stopLossPrice || ''}
              onChange={(e) =>
                onChangeInputs({
                  ...inputs,
                  stopLossPrice: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
              className={`w-full bg-slate-950 border rounded-lg px-3 py-2.5 text-sm font-mono-numbers outline-none transition-colors ${
                isStopInvalid
                  ? 'border-rose-500 ring-1 ring-rose-500 text-rose-200'
                  : 'border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-100'
              }`}
            />
          </div>
        </div>

        {/* Take Profit (Optional) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>قیمت حد سود (Take Profit - اختیاری)</span>
              <span className="text-[11px] text-slate-500">برای محاسبه سود و ریسک/ریوارد</span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={inputs.takeProfitPrice || ''}
              onChange={(e) =>
                onChangeInputs({
                  ...inputs,
                  takeProfitPrice: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
              placeholder="اختیاری..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3 py-2.5 text-sm text-slate-100 font-mono-numbers outline-none transition-colors"
            />
          </div>

          {/* Quick R:R preset buttons for Take Profit */}
          {inputs.entryPrice > 0 && inputs.stopLossPrice > 0 && !isStopInvalid && (
            <div className="flex flex-col justify-end gap-1.5">
              <span className="text-[11px] text-slate-400">تنظیم سریع حد سود بر اساس نسبت R:R:</span>
              <div className="flex items-center gap-1.5">
                {[1.5, 2.0, 3.0, 4.0].map((rr) => {
                  const slDistance = Math.abs(inputs.entryPrice - inputs.stopLossPrice);
                  const tpVal = isLong
                    ? inputs.entryPrice + slDistance * rr
                    : inputs.entryPrice - slDistance * rr;
                  return (
                    <button
                      key={rr}
                      type="button"
                      onClick={() =>
                        onChangeInputs({
                          ...inputs,
                          takeProfitPrice: Number(tpVal.toFixed(4)),
                        })
                      }
                      className="px-2.5 py-1 text-xs font-mono font-medium bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-300 rounded-md transition-colors text-slate-300"
                    >
                      1:{rr}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stop Loss Validation Error Alert */}
      {isStopInvalid && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            {isLong
              ? 'خطای اعتبارسنجی: در پوزیشن خرید (Long)، حد ضرر باید حتماً کمتر از قیمت ورود باشد.'
              : 'خطای اعتبارسنجی: در پوزیشن فروش (Short)، حد ضرر باید حتماً بیشتر از قیمت ورود باشد.'}
          </span>
        </div>
      )}

      {/* 6. Advanced Market Settings */}
      <div className="pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {inputs.marketType === 'crypto'
              ? 'تنظیمات اهرم و لوریج (Leverage)'
              : 'تنظیمات نرخ تبدیل ارز و پیپ (Forex Conversion)'}
          </span>
          {showAdvanced ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-3 p-3.5 bg-slate-950 border border-slate-800 rounded-lg flex flex-col gap-3">
            {inputs.marketType === 'crypto' ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">اهرم معاملاتی (Leverage):</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {inputs.leverage}x
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CRYPTO_LEVERAGE_PRESETS.map((lev) => (
                    <button
                      key={lev}
                      type="button"
                      onClick={() => onChangeInputs({ ...inputs, leverage: lev })}
                      className={`px-3 py-1 text-xs font-mono font-medium rounded border transition-colors ${
                        inputs.leverage === lev
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lev}x
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500">
                  توجه: لوریج اندازه پوزیشن را تغییر نمی‌دهد؛ بلکه صرفاً مقدار مارجین اولیه مورد نیاز برای باز کردن معامله را کاهش می‌دهد.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-300 font-medium">
                    نرخ برابری USD/JPY (برای جفت‌ارزهای ین):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={inputs.usdJpyRate || 154.50}
                    onChange={(e) =>
                      onChangeInputs({
                        ...inputs,
                        usdJpyRate: parseFloat(e.target.value) || 154.50,
                      })
                    }
                    className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 font-mono-numbers outline-none"
                  />
                  <span className="text-[10px] text-slate-500">
                    برای محاسبه دقیق ارزش هر پیپ در جفت‌ارزهای کراس مانند EUR/JPY
                  </span>
                </div>

                <div className="flex flex-col gap-1 justify-center bg-slate-900/50 p-2.5 rounded border border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <span>محاسبه حجم فارکس بر مبنای لات:</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    محاسبه مستقیماً بر مبنای لات (Lot) انجام می‌شود: ۱ لات استاندارد (1.0) | مینی لات (0.1) | میکرو لات (0.01).
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 7. Form Footer with Reset Button */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">
          محاسبات به صورت آنی و همگام با هر تغییر به‌روزرسانی می‌شوند.
        </span>

        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors flex items-center gap-2 active:scale-95 whitespace-nowrap"
          title="پاک‌کردن تمامی مقادیر ورودی و شروع مجدد"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>حذف ورودی ها</span>
        </button>
      </div>
    </div>
  );
}
