import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/react';

import { fonts } from '@/lib/fonts';
import { cn } from '@/lib/utils';

import ConvexClientProvider from './ConvexClientProvider';

import './globals.css';

import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/navbar/header';
import { Footer } from '@/components/footer/footer';

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
                    <div className="mt-20">{children}</div>
                    <Footer />
                    <Analytics debug={false} />
                </ConvexClientProvider>
            </body>
        </html>
    );
}
