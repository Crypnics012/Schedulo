import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Schedulo Pro Audit',
    default: 'Schedulo Pro Audit - Security & Performance Analysis',
  },
  description: 'Comprehensive audit findings and improvements for Schedulo Pro, a social media scheduling platform.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://schedulo-pro-audit.vercel.app',
    siteName: 'Schedulo Pro Audit',
    title: 'Schedulo Pro Audit - Security & Performance Analysis',
    description: 'Comprehensive audit findings and improvements for Schedulo Pro, a social media scheduling platform.',
    images: [
      {
        url: 'https://schedulo-pro-audit.vercel.app/api/og',
        width: 1200,
        height: 630,
        alt: 'Schedulo Pro Audit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Schedulo Pro Audit - Security & Performance Analysis',
    description: 'Comprehensive audit findings and improvements for Schedulo Pro, a social media scheduling platform.',
    images: ['https://schedulo-pro-audit.vercel.app/api/og'],
  },
  metadataBase: new URL('https://schedulo-pro-audit.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
