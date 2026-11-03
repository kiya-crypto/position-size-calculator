import { ForexPairConfig } from '@/types/calculator';

export const FOREX_PAIRS: ForexPairConfig[] = [
  {
    symbol: 'EUR/USD',
    nameFa: 'یورو / دلار آمریکا',
    category: 'major',
    baseCurrency: 'EUR',
    quoteCurrency: 'USD',
    pipSize: 0.0001,
    contractSize: 100000,
    defaultPrice: 1.0850,
    decimals: 4,
  },
  {
    symbol: 'GBP/USD',
    nameFa: 'پوند انگلیس / دلار آمریکا',
    category: 'major',
    baseCurrency: 'GBP',
    quoteCurrency: 'USD',
    pipSize: 0.0001,
    contractSize: 100000,
    defaultPrice: 1.2950,
    decimals: 4,
  },
  {
    symbol: 'USD/JPY',
    nameFa: 'دلار آمریکا / ین ژاپن',
    category: 'jpy',
    baseCurrency: 'USD',
    quoteCurrency: 'JPY',
    pipSize: 0.01,
    contractSize: 100000,
    defaultPrice: 154.50,
    decimals: 2,
  },
  {
    symbol: 'XAU/USD',
    nameFa: 'طلا / دلار آمریکا (انس جهانی)',
    category: 'metal',
    baseCurrency: 'XAU',
    quoteCurrency: 'USD',
    pipSize: 0.10, // 1 pip = $0.10, 100 oz contract => $10/pip standard lot
    contractSize: 100, // 100 troy ounces
    defaultPrice: 2750.00,
    decimals: 2,
  },
  {
    symbol: 'USD/CAD',
    nameFa: 'دلار آمریکا / دلار کانادا',
    category: 'major',
    baseCurrency: 'USD',
    quoteCurrency: 'CAD',
    pipSize: 0.0001,
    contractSize: 100000,
    defaultPrice: 1.3850,
    decimals: 4,
  },
  {
    symbol: 'USD/CHF',
    nameFa: 'دلار آمریکا / فرانک سوئیس',
    category: 'major',
    baseCurrency: 'USD',
    quoteCurrency: 'CHF',
    pipSize: 0.0001,
    contractSize: 100000,
    defaultPrice: 0.8650,
    decimals: 4,
  },
  {
    symbol: 'AUD/USD',
    nameFa: 'دلار استرالیا / دلار آمریکا',
    category: 'major',
    baseCurrency: 'AUD',
    quoteCurrency: 'USD',
    pipSize: 0.0001,
    contractSize: 100000,
    defaultPrice: 0.6580,
    decimals: 4,
  },
  {
    symbol: 'EUR/JPY',
    nameFa: 'یورو / ین ژاپن',
    category: 'jpy',
    baseCurrency: 'EUR',
    quoteCurrency: 'JPY',
    pipSize: 0.01,
    contractSize: 100000,
    defaultPrice: 167.60,
    decimals: 2,
  },
  {
    symbol: 'GBP/JPY',
    nameFa: 'پوند انگلیس / ین ژاپن',
    category: 'jpy',
    baseCurrency: 'GBP',
    quoteCurrency: 'JPY',
    pipSize: 0.01,
    contractSize: 100000,
    defaultPrice: 200.10,
    decimals: 2,
  },
  {
    symbol: 'NZD/USD',
    nameFa: 'دلار نیوزیلند / دلار آمریکا',
    category: 'major',
    baseCurrency: 'NZD',
    quoteCurrency: 'USD',
    pipSize: 0.0001,
    contractSize: 100000,
    defaultPrice: 0.5980,
    decimals: 4,
  },
  {
    symbol: 'EUR/GBP',
    nameFa: 'یورو / پوند انگلیس',
    category: 'cross',
    baseCurrency: 'EUR',
    quoteCurrency: 'GBP',
    pipSize: 0.0001,
    contractSize: 100000,
    defaultPrice: 0.8380,
    decimals: 4,
  },
  {
    symbol: 'XAG/USD',
    nameFa: 'نقره / دلار آمریکا',
    category: 'metal',
    baseCurrency: 'XAG',
    quoteCurrency: 'USD',
    pipSize: 0.01,
    contractSize: 5000,
    defaultPrice: 32.50,
    decimals: 2,
  },
];

/**
 * Detects or constructs Forex configuration for any symbol
 */
export function getForexPairConfig(symbol: string, currentPrice?: number): ForexPairConfig {
  const normalized = symbol.trim().toUpperCase().replace('-', '/').replace('_', '');
  const cleanSymbol = normalized.includes('/') ? normalized : `${normalized.slice(0, 3)}/${normalized.slice(3)}`;
  
  const existing = FOREX_PAIRS.find(
    (p) => p.symbol.replace('/', '') === cleanSymbol.replace('/', '') || p.symbol === symbol
  );
  if (existing) {
    return existing;
  }

  // Auto-detect based on currency codes
  const isJpy = cleanSymbol.includes('JPY');
  const isGold = cleanSymbol.includes('XAU') || cleanSymbol.includes('GOLD');
  const isSilver = cleanSymbol.includes('XAG') || cleanSymbol.includes('SILVER');

  let pipSize = 0.0001;
  let contractSize = 100000;
  let decimals = 4;
  let category: ForexPairConfig['category'] = 'major';

  if (isJpy) {
    pipSize = 0.01;
    decimals = 2;
    category = 'jpy';
  } else if (isGold) {
    pipSize = 0.10;
    contractSize = 100;
    decimals = 2;
    category = 'metal';
  } else if (isSilver) {
    pipSize = 0.01;
    contractSize = 5000;
    decimals = 2;
    category = 'metal';
  }

  const parts = cleanSymbol.split('/');
  const baseCurrency = parts[0] || 'BASE';
  const quoteCurrency = parts[1] || 'USD';

  return {
    symbol: cleanSymbol,
    nameFa: cleanSymbol,
    category,
    baseCurrency,
    quoteCurrency,
    pipSize,
    contractSize,
    defaultPrice: currentPrice || 1.0,
    decimals,
  };
}

/**
 * Calculates pip value per standard lot in USD.
 *
 * Formulas:
 * 1. Quote currency is USD (EUR/USD, GBP/USD, AUD/USD, XAU/USD):
 *    Pip Value = Contract Size * Pip Size = 100,000 * 0.0001 = $10.00 per pip.
 *    For XAU/USD: 100 oz * 0.10 = $10.00 per pip.
 *
 * 2. Base currency is USD, Quote is another currency (USD/JPY, USD/CAD, USD/CHF):
 *    Pip Value in Quote = Contract Size * Pip Size (e.g. 100,000 * 0.01 = 1,000 JPY)
 *    Pip Value in USD = (Contract Size * Pip Size) / Current Exchange Rate
 *    e.g. at USD/JPY = 154.50: 1,000 / 154.50 ≈ $6.472 per pip per standard lot.
 *
 * 3. Cross pair where quote is JPY (EUR/JPY, GBP/JPY):
 *    Pip Value in JPY = 100,000 * 0.01 = 1,000 JPY.
 *    Converted to USD via USD/JPY rate: 1,000 / usdJpyRate (e.g. ~154.50 -> ~$6.47).
 *
 * 4. Cross pair where quote is GBP (EUR/GBP):
 *    Pip Value in GBP = 100,000 * 0.0001 = 10 GBP.
 *    Converted to USD = 10 * GBP/USD rate (e.g. 10 * 1.295 ≈ $12.95).
 */
export function calculatePipValueInUsd(
  pairConfig: ForexPairConfig,
  currentPrice: number,
  usdJpyRate: number = 154.50,
  gbpUsdRate: number = 1.2950,
  eurUsdRate: number = 1.0850
): number {
  const { quoteCurrency, baseCurrency, contractSize, pipSize } = pairConfig;

  // 1. Quote is USD (EUR/USD, GBP/USD, XAU/USD, AUD/USD, NZD/USD)
  if (quoteCurrency === 'USD') {
    return contractSize * pipSize;
  }

  // 2. Base is USD (USD/JPY, USD/CAD, USD/CHF)
  if (baseCurrency === 'USD') {
    if (currentPrice <= 0) return 10.0;
    return (contractSize * pipSize) / currentPrice;
  }

  // 3. Cross pair where Quote is JPY (e.g. EUR/JPY, GBP/JPY, AUD/JPY)
  if (quoteCurrency === 'JPY') {
    const quotePipAmount = contractSize * pipSize; // 1,000 JPY
    const effectiveUsdJpy = usdJpyRate > 0 ? usdJpyRate : 154.50;
    return quotePipAmount / effectiveUsdJpy;
  }

  // 4. Cross pair where Quote is GBP (e.g. EUR/GBP)
  if (quoteCurrency === 'GBP') {
    const quotePipAmount = contractSize * pipSize; // 10 GBP
    return quotePipAmount * gbpUsdRate;
  }

  // 5. Cross pair where Quote is EUR (e.g. GBP/EUR)
  if (quoteCurrency === 'EUR') {
    const quotePipAmount = contractSize * pipSize; // 10 EUR
    return quotePipAmount * eurUsdRate;
  }

  // Default fallback for other pairs:
  // If base is not USD and quote is not USD, estimate via current exchange rate if available
  if (currentPrice > 0) {
    return (contractSize * pipSize) / currentPrice;
  }

  return 10.0;
}
