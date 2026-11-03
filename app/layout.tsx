import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'محاسبه‌گر حجم پوزیشن فارکس و ارز دیجیتال',
  description: 'ماشین‌حساب پیشرفته و حرفه‌ای اندازه پوزیشن و لات معاملاتی برای کریپتو و فارکس با مدیریت ریسک هوشمند به زبان فارسی',
  openGraph: {
    title: 'محاسبه‌گر حجم پوزیشن فارکس و ارز دیجیتال',
    description: 'ماشین‌حساب پیشرفته و حرفه‌ای اندازه پوزیشن و لات معاملاتی برای کریپتو و فارکس با مدیریت ریسک هوشمند به زبان فارسی',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'محاسبه‌گر حجم پوزیشن فارکس و ارز دیجیتال',
    description: 'ماشین‌حساب پیشرفته و حرفه‌ای اندازه پوزیشن و لات معاملاتی برای کریپتو و فارکس با مدیریت ریسک هوشمند به زبان فارسی',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fa" dir="rtl">
      <body suppressHydrationWarning className="bg-slate-950 text-slate-100 min-h-screen selection:bg-emerald-500/20 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
