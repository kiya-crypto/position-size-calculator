/**
 * Persian number and string utilities for financial calculations
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number): string {
  if (input === null || input === undefined) return '';
  const str = input.toString();
  return str.replace(/[0-9]/g, (w) => PERSIAN_DIGITS[+w]);
}

/**
 * Format numbers with commas (e.g. 12,345.67) and optional Persian digits
 */
export function formatFinancialNumber(
  value: number | null | undefined,
  decimals: number = 2,
  usePersianDigits: boolean = false
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return usePersianDigits ? '۰' : '0';
  }

  // Format with Intl.NumberFormat
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);

  return usePersianDigits ? toPersianDigits(formatted) : formatted;
}

/**
 * Formats a currency amount in USD ($)
 */
export function formatUsd(
  value: number | null | undefined,
  decimals: number = 2,
  usePersianDigits: boolean = false
): string {
  const num = formatFinancialNumber(value, decimals, usePersianDigits);
  return `$${num}`;
}

/**
 * Formats percentage
 */
export function formatPercent(
  value: number | null | undefined,
  decimals: number = 2,
  usePersianDigits: boolean = false
): string {
  const num = formatFinancialNumber(value, decimals, usePersianDigits);
  return `${num}٪`;
}

/**
 * Generates formatted Persian trade summary text for clipboard
 */
export function generateTradeSummaryText(data: {
  marketType: 'crypto' | 'forex';
  direction: 'long' | 'short';
  symbol: string;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number | null;
  positionSizeFormatted: string;
  totalValueUsd?: number;
  riskUsd: number;
  riskPercent: number;
  riskRewardRatio?: number;
  requiredMargin?: number;
  pips?: number;
}): string {
  const dirFa = data.direction === 'long' ? 'خرید (Long / Buy) 🟢' : 'فروش (Short / Sell) 🔴';
  const marketFa = data.marketType === 'crypto' ? 'ارز دیجیتال (Crypto)' : 'فارکس (Forex)';
  
  let summary = `📋 یادداشت و ژورنال معامله\n`;
  summary += `──────────────\n`;
  summary += `🌐 بازار: ${marketFa}\n`;
  summary += `📌 نماد: ${data.symbol}\n`;
  summary += `🎯 جهت: ${dirFa}\n`;
  summary += `💵 قیمت ورود: ${data.entryPrice.toLocaleString()}\n`;
  summary += `🛑 حد ضرر (SL): ${data.stopLossPrice.toLocaleString()}\n`;
  
  if (data.takeProfitPrice) {
    summary += `🎯 حد سود (TP): ${data.takeProfitPrice.toLocaleString()}\n`;
    if (data.riskRewardRatio) {
      summary += `⚖️ نسبت ریسک به ریوارد: 1:${data.riskRewardRatio.toFixed(2)}\n`;
    }
  }

  summary += `──────────────\n`;
  summary += `📦 حجم مجاز پوزیشن: ${data.positionSizeFormatted}\n`;
  
  if (data.totalValueUsd) {
    summary += `💰 ارزش کل پوزیشن: $${data.totalValueUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}\n`;
  }
  
  if (data.requiredMargin) {
    summary += `🔒 مارجین مورد نیاز: $${data.requiredMargin.toLocaleString(undefined, { maximumFractionDigits: 2 })}\n`;
  }

  if (data.pips !== undefined) {
    summary += `📏 فاصله استاپ: ${data.pips.toFixed(1)} پیپ\n`;
  }

  summary += `⚠️ حداکثر ریسک معامله: $${data.riskUsd.toFixed(2)} (${data.riskPercent.toFixed(2)}% از بالانس)\n`;
  summary += `──────────────\n`;
  summary += `محاسبه شده توسط محاسبه‌گر هوشمند اندازه پوزیشن`;

  return summary;
}
