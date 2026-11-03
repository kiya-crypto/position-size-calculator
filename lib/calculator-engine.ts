import {
  CalculatorInputs,
  CalculationResult,
} from '@/types/calculator';
import { getForexPairConfig, calculatePipValueInUsd } from '@/lib/forex-pairs';

export function calculatePositionSize(inputs: CalculatorInputs): CalculationResult {
  const {
    marketType,
    tradeDirection,
    accountBalance,
    riskAmountUsd,
    symbol,
    entryPrice,
    stopLossPrice,
    takeProfitPrice,
    leverage = 1,
    usdJpyRate = 154.50,
    customPipValueUsd,
  } = inputs;

  // Basic sanity check
  if (!accountBalance || accountBalance <= 0) {
    return {
      isValid: false,
      errorMessage: 'لطفاً موجودی حساب را به درستی وارد نمایید (بیشتر از صفر).',
      riskAmountUsd: 0,
      riskPercent: 0,
      stopDistancePrice: 0,
      stopDistancePercent: 0,
      hasTakeProfit: false,
    };
  }

  if (!riskAmountUsd || riskAmountUsd <= 0) {
    return {
      isValid: false,
      errorMessage: 'لطفاً مبلغ ریسک را به درستی مشخص کنید (بیشتر از صفر).',
      riskAmountUsd: 0,
      riskPercent: 0,
      stopDistancePrice: 0,
      stopDistancePercent: 0,
      hasTakeProfit: false,
    };
  }

  if (!entryPrice || entryPrice <= 0) {
    return {
      isValid: false,
      errorMessage: 'لطفاً قیمت معتبر ورود به معامله را وارد کنید.',
      riskAmountUsd,
      riskPercent: (riskAmountUsd / accountBalance) * 100,
      stopDistancePrice: 0,
      stopDistancePercent: 0,
      hasTakeProfit: false,
    };
  }

  if (!stopLossPrice || stopLossPrice <= 0) {
    return {
      isValid: false,
      errorMessage: 'لطفاً قیمت حد ضرر (Stop Loss) را وارد کنید.',
      riskAmountUsd,
      riskPercent: (riskAmountUsd / accountBalance) * 100,
      stopDistancePrice: 0,
      stopDistancePercent: 0,
      hasTakeProfit: false,
    };
  }

  // Direction validation (Long vs Short)
  if (tradeDirection === 'long') {
    if (stopLossPrice >= entryPrice) {
      return {
        isValid: false,
        errorMessage: 'در معامله خرید (Long)، قیمت حد ضرر باید کمتر از قیمت ورود باشد.',
        riskAmountUsd,
        riskPercent: (riskAmountUsd / accountBalance) * 100,
        stopDistancePrice: 0,
        stopDistancePercent: 0,
        hasTakeProfit: false,
      };
    }
  } else {
    // Short
    if (stopLossPrice <= entryPrice) {
      return {
        isValid: false,
        errorMessage: 'در معامله فروش (Short)، قیمت حد ضرر باید بیشتر از قیمت ورود باشد.',
        riskAmountUsd,
        riskPercent: (riskAmountUsd / accountBalance) * 100,
        stopDistancePrice: 0,
        stopDistancePercent: 0,
        hasTakeProfit: false,
      };
    }
  }

  // Take profit validation
  let warningMessage: string | undefined;
  let hasValidTakeProfit = false;
  if (takeProfitPrice && takeProfitPrice > 0) {
    if (tradeDirection === 'long' && takeProfitPrice <= entryPrice) {
      warningMessage = 'توجه: در پوزیشن خرید، حد سود باید بالاتر از قیمت ورود باشد.';
    } else if (tradeDirection === 'short' && takeProfitPrice >= entryPrice) {
      warningMessage = 'توجه: در پوزیشن فروش، حد سود باید پایین‌تر از قیمت ورود باشد.';
    } else {
      hasValidTakeProfit = true;
    }
  }

  const riskPercent = (riskAmountUsd / accountBalance) * 100;
  const stopDistancePrice = Math.abs(entryPrice - stopLossPrice);
  const stopDistancePercent = (stopDistancePrice / entryPrice) * 100;

  if (stopDistancePrice === 0) {
    return {
      isValid: false,
      errorMessage: 'فاصله قیمت ورود و حد ضرر نمی‌تواند صفر باشد.',
      riskAmountUsd,
      riskPercent,
      stopDistancePrice: 0,
      stopDistancePercent: 0,
      hasTakeProfit: false,
    };
  }

  // 1. CRYPTO MARKET CALCULATION
  if (marketType === 'crypto') {
    // Position size in Coins = Risk Amount ($) / Price Difference ($)
    const positionSizeCoins = riskAmountUsd / stopDistancePrice;
    const totalPositionValueUsd = positionSizeCoins * entryPrice;
    const effectiveLeverage = Math.max(1, leverage);
    const requiredMarginUsd = totalPositionValueUsd / effectiveLeverage;

    let takeProfitDistancePrice: number | undefined;
    let takeProfitDistancePercent: number | undefined;
    let potentialProfitUsd: number | undefined;
    let potentialProfitPercent: number | undefined;
    let riskRewardRatio: number | undefined;

    if (hasValidTakeProfit && takeProfitPrice) {
      takeProfitDistancePrice = Math.abs(takeProfitPrice - entryPrice);
      takeProfitDistancePercent = (takeProfitDistancePrice / entryPrice) * 100;
      potentialProfitUsd = positionSizeCoins * takeProfitDistancePrice;
      potentialProfitPercent = (potentialProfitUsd / accountBalance) * 100;
      riskRewardRatio = takeProfitDistancePrice / stopDistancePrice;
    }

    return {
      isValid: true,
      warningMessage,
      riskAmountUsd,
      riskPercent,
      stopDistancePrice,
      stopDistancePercent,
      positionSizeCoins,
      totalPositionValueUsd,
      requiredMarginUsd,
      hasTakeProfit: hasValidTakeProfit,
      takeProfitDistancePrice,
      takeProfitDistancePercent,
      potentialProfitUsd,
      potentialProfitPercent,
      riskRewardRatio,
    };
  }

  // 2. FOREX MARKET CALCULATION
  const pairConfig = getForexPairConfig(symbol, entryPrice);
  const pipSize = pairConfig.pipSize;
  const stopDistancePips = stopDistancePrice / pipSize;

  const pipValuePerStandardLotUsd =
    customPipValueUsd && customPipValueUsd > 0
      ? customPipValueUsd
      : calculatePipValueInUsd(pairConfig, entryPrice, usdJpyRate);

  // Lot Size = Risk Amount / (Pips * Pip Value per Standard Lot)
  const lotSizeStandard = riskAmountUsd / (stopDistancePips * pipValuePerStandardLotUsd);
  const lotSizeMini = lotSizeStandard * 10;
  const lotSizeMicro = lotSizeStandard * 100;
  const totalUnits = lotSizeStandard * pairConfig.contractSize;

  let takeProfitDistancePrice: number | undefined;
  let takeProfitDistancePips: number | undefined;
  let takeProfitDistancePercent: number | undefined;
  let potentialProfitUsd: number | undefined;
  let potentialProfitPercent: number | undefined;
  let riskRewardRatio: number | undefined;

  if (hasValidTakeProfit && takeProfitPrice) {
    takeProfitDistancePrice = Math.abs(takeProfitPrice - entryPrice);
    takeProfitDistancePips = takeProfitDistancePrice / pipSize;
    takeProfitDistancePercent = (takeProfitDistancePrice / entryPrice) * 100;
    potentialProfitUsd = lotSizeStandard * takeProfitDistancePips * pipValuePerStandardLotUsd;
    potentialProfitPercent = (potentialProfitUsd / accountBalance) * 100;
    riskRewardRatio = takeProfitDistancePips / stopDistancePips;
  }

  return {
    isValid: true,
    warningMessage,
    riskAmountUsd,
    riskPercent,
    stopDistancePrice,
    stopDistancePercent,
    stopDistancePips,
    pipValuePerStandardLotUsd,
    lotSizeStandard,
    lotSizeMini,
    lotSizeMicro,
    totalUnits,
    hasTakeProfit: hasValidTakeProfit,
    takeProfitDistancePrice,
    takeProfitDistancePips,
    takeProfitDistancePercent,
    potentialProfitUsd,
    potentialProfitPercent,
    riskRewardRatio,
  };
}
