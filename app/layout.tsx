import type { Metadata } from 'next';
import './globals.css';
import AppWalletProvider from '@/components/AppWalletProvider';

export const metadata: Metadata = {
  title: {
    default: 'CNC DAO',
    template: '%s · CNC DAO',
  },
  description: 'Solana-based regenerative finance initiative rewarding real-world environmental action.',
  icons: {
    icon: 'https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/882f885f89c906eed6ee1a28374bd83e2242ac97/assets/logo.jpg',
    apple: 'https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/882f885f89c906eed6ee1a28374bd83e2242ac97/assets/logo.jpg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link
          rel="icon"
          href="https://raw.githubusercontent.com/cncdaodas-gif/CNC-DAO/882f885f89c906eed6ee1a28374bd83e2242ac97/assets/logo.jpg"
          type="image/jpeg"
        />
      </head>
      <body>
        <AppWalletProvider>
          {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}
