import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';

// import { Inter } from 'next/font/google';
import './globals.css';
import ConvexClientProvider from './ConvexClientProvider';

import { fonts } from '@/lib/fonts';
import { cn } from '@/lib/utils';

import { Toaster } from '@/components/ui/toaster';
import { Header } from '../components/navbar/header';
import { Footer } from '../components/footer/footer';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Alexis LEROY',
    description: 'Blog, CV, Projets - Alexis LEROY'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body className={cn('min-h-screen font-sans', fonts)}>
                {/* <body className={inter.className}> */}
                <ConvexClientProvider>
                    <Toaster />
                    <Header />
                    {children}
                    <Footer />
                    <Analytics />
                </ConvexClientProvider>
            </body>
        </html>
    );
}
