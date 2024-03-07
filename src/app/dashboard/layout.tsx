'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { SideNav } from './_components/side-nav';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const profile = useQuery(api.users.getMe);

    return (
        <main className="container mx-auto pt-4 min-h-screen">
            {/* <div className="flex flex-col">
                <div className="flex gap-5 items-center justify-start">
                    <a href="#" className="pb-2 border-b-2 border-primary">
                        Link 01
                    </a>
                    <a href="#">Link 01</a>
                    <a href="#">Link 01</a>
                </div>
                <div className="">{children}</div>
            </div> */}

            <div className="flex flex-col lg:flex-row">
                <div className="flex gap-5 items-center justify-start lg:hidden mb-5">
                    <Link
                        href="/dashboard/articles"
                        className={cn('pb-2 border-b-2', pathname.includes('/dashboard/articles') ? 'border-accent-foreground' : 'border-secondary')}
                    >
                        Articles
                    </Link>
                    <Link
                        href="/dashboard/cryptos"
                        className={cn('pb-2 border-b-2', pathname.includes('/dashboard/cryptos') ? 'border-accent-foreground' : 'border-secondary')}
                    >
                        Cryptos
                    </Link>
                    <Link
                        href="/dashboard/users"
                        className={cn('pb-2 border-b-2', pathname.includes('/dashboard/users') ? 'border-accent-foreground' : 'border-secondary')}
                    >
                        Users
                    </Link>
                    <Link
                        href="/dashboard/debrid"
                        className={cn('pb-2 border-b-2', pathname.includes('/dashboard/debrid') ? 'border-accent-foreground' : 'border-secondary')}
                    >
                        Debrid
                    </Link>
                </div>
                <SideNav className="hidden lg:flex lg:rounded-none lg:border-r" userRole={profile?.role} />
                <div className="w-full mt-1">{children}</div>
            </div>
        </main>
    );
}
