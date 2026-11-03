export type MarketType = 'crypto' | 'forex';

export type TradeDirection = 'long' | 'short';

export type RiskInputMode = 'usd' | 'percent';

export type ForexLotType = 'standard' | 'mini' | 'micro';

export interface CalculatorInputs {
  marketType: MarketType;
  tradeDirection: TradeDirection;
  accountBalance: number;
  riskAmountUsd: number;
  riskPercent: number;
  riskInputMode: RiskInputMode;
  symbol: string;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number | null;
  leverage: number; // For crypto
  forexLotType: ForexLotType; // For forex: 'standard' (1.0), 'mini' (0.1), 'micro' (0.01)
  customPipValueUsd?: number; // Optional override
  usdJpyRate?: number; // For JPY quote conversion when needed
}

export interface ForexPairConfig {
  symbol: string;
  nameFa: string;
  category: 'major' | 'cross' | 'metal' | 'jpy';
  baseCurrency: string;
  quoteCurrency: string;
  pipSize: number; // 0.0001, 0.01, 0.10, etc.
  contractSize: number; // 100,000 for currency, 100 for XAU
  defaultPrice: number;
  decimals: number;
}

export interface CryptoPairConfig {
  symbol: string;
  nameFa: string;
  defaultPrice: number;
  coinUnit: string;
  decimals: number;
}

export interface CalculationResult {
  isValid: boolean;
  errorMessage?: string;
  warningMessage?: string;
  
  // Core outputs - Crypto
  positionSizeCoins?: number;
  totalPositionValueUsd?: number;
  requiredMarginUsd?: number;
  
  // Core outputs - Forex (Lot-based)
  lotSizeSelected?: number; // Calculated size in chosen lot type
  pipValuePerSelectedLotUsd?: number; // Pip value for 1 lot of chosen type
  lotTypeNameFa?: string;
  lotSizeStandard?: number; // 1.00 Lot (100k)
  lotSizeMini?: number; // 0.10 Lot (10k)
  lotSizeMicro?: number; // 0.01 Lot (1k)
  
  // Common risk metrics
  riskAmountUsd: number;
  riskPercent: number;
  stopDistancePrice: number;
  stopDistancePercent: number;
  stopDistancePips?: number;
  pipValuePerStandardLotUsd?: number;
  
  // Profit & Reward (if TP entered)
  hasTakeProfit: boolean;
  takeProfitDistancePrice?: number;
  takeProfitDistancePercent?: number;
  takeProfitDistancePips?: number;
  potentialProfitUsd?: number;
  potentialProfitPercent?: number;
  riskRewardRatio?: number;
}
