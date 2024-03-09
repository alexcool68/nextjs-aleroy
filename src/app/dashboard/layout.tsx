'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { SideNav } from './_components/side-nav';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { TopNavMobile } from './_components/top-nav-mobile';

export default function DashboardLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const profile = useQuery(api.users.getMe);

    return (
        <main className="container mx-auto pt-4 min-h-screen">
            <div className="flex flex-col lg:flex-row">
                <TopNavMobile className="flex gap-5 items-center justify-start lg:hidden mb-5 " />
                <SideNav className="hidden lg:flex lg:rounded-none lg:border-r" userRole={profile?.role} />
                <div className="w-full mt-1">{children}</div>
            </div>
        </main>
    );
}
