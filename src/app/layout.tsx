import type { Metadata } from 'next';
import { Outfit, Playfair_Display } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Trails and Miles — Smart Travel Planning for Indian Travellers',
    template: '%s | Trails and Miles',
  },
  description:
    'AI-powered travel planning platform for Indian travellers. Personalized itineraries, visa guides, and destination intelligence — all in INR.',
  keywords: [
    'travel planning india',
    'indian travel',
    'itinerary generator',
    'visa guide',
    'AI travel assistant',
    'thailand vietnam indonesia singapore maldives',
  ],
  authors: [{ name: 'Trails and Miles' }],
  creator: 'Trails and Miles',
  metadataBase: new URL(process.env.APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Trails and Miles',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${playfairDisplay.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
