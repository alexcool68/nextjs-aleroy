'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { SideNav } from './_components/side-nav';

export default function DashboardLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const profile = useQuery(api.users.getMe);

    return (
        <main className="container mx-auto pt-12 min-h-screen">
            <div className="flex gap-8">
                <SideNav className="hidden lg:block" userRole={profile?.role} />

                <div className="w-full">{children}</div>
            </div>
        </main>
    );
}
