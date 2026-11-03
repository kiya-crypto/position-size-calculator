import { CryptoPairConfig } from '@/types/calculator';

export const CRYPTO_PAIRS: CryptoPairConfig[] = [
  {
    symbol: 'BTC/USDT',
    nameFa: 'بیت‌کوین / تتر',
    defaultPrice: 91500,
    coinUnit: 'BTC',
    decimals: 2,
  },
  {
    symbol: 'ETH/USDT',
    nameFa: 'اتریوم / تتر',
    defaultPrice: 3250,
    coinUnit: 'ETH',
    decimals: 2,
  },
  {
    symbol: 'SOL/USDT',
    nameFa: 'سولانا / تتر',
    defaultPrice: 195,
    coinUnit: 'SOL',
    decimals: 2,
  },
  {
    symbol: 'BNB/USDT',
    nameFa: 'بایننس کوین / تتر',
    defaultPrice: 620,
    coinUnit: 'BNB',
    decimals: 2,
  },
  {
    symbol: 'XRP/USDT',
    nameFa: 'ریپل / تتر',
    defaultPrice: 1.15,
    coinUnit: 'XRP',
    decimals: 4,
  },
  {
    symbol: 'DOGE/USDT',
    nameFa: 'دوج‌کوین / تتر',
    defaultPrice: 0.28,
    coinUnit: 'DOGE',
    decimals: 4,
  },
  {
    symbol: 'ADA/USDT',
    nameFa: 'کاردانو / تتر',
    defaultPrice: 0.75,
    coinUnit: 'ADA',
    decimals: 4,
  },
  {
    symbol: 'AVAX/USDT',
    nameFa: 'آوالانچ / تتر',
    defaultPrice: 34.5,
    coinUnit: 'AVAX',
    decimals: 2,
  },
];

export function getCryptoPairConfig(symbol: string): CryptoPairConfig {
  const clean = symbol.trim().toUpperCase().replace('-', '/').replace('_', '');
  const formatted = clean.includes('/') ? clean : `${clean}/USDT`;
  
  const found = CRYPTO_PAIRS.find(
    (c) => c.symbol.replace('/', '') === formatted.replace('/', '') || c.symbol === symbol
  );
  if (found) return found;

  const coinUnit = formatted.split('/')[0] || 'COIN';
  return {
    symbol: formatted,
    nameFa: formatted,
    defaultPrice: 100,
    coinUnit,
    decimals: 2,
  };
}
