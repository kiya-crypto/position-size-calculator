export type MarketType = 'crypto' | 'forex';

export type TradeDirection = 'long' | 'short';

export type RiskInputMode = 'usd' | 'percent';

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
  forexLotType: 'standard' | 'mini' | 'micro';
  customPipValueUsd?: number; // Optional override for exotic pairs
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
  
  // Core outputs
  positionSizeCoins?: number; // Crypto
  totalPositionValueUsd?: number; // Crypto
  requiredMarginUsd?: number; // Crypto with leverage
  
  lotSizeStandard?: number; // Forex
  lotSizeMini?: number; // Forex
  lotSizeMicro?: number; // Forex
  totalUnits?: number; // Forex contract units
  
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
  riskRewardRatio?: number; // e.g. 2.5 means 1:2.5
}
