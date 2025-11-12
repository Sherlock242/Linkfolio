import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

export const metadata: Metadata = {
  title: 'LinkFolio',
  description: 'Your personal corner of the internet.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        {children}
        <Toaster />
        <Script type='text/javascript' src='//certainwolveshonestly.com/c2/e3/2a/c2e32af9398348a7c7abfb3b5f4985df.js' />
        <Script type='text/javascript' src='//certainwolveshonestly.com/b8/17/3b/b8173b354c2214ec5a8c4a1b64c0e6b8.js' />
      </body>
    </html>
  );
}
