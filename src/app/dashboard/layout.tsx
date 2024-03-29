import { Metadata } from 'next';

import { getRole } from '@/lib/roles';

import { TopNavDashboard } from './_components/top-nav-dashboard';

export const metadata: Metadata = {
    title: 'Alexis LEROY - Dashboard',
    description: 'Blog, CV, Projets - Alexis LEROY'
};

export default function DashboardLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const userRole = getRole();
    return (
        <div className="flex min-h-screen w-full flex-col">
            <TopNavDashboard className="" userRole={userRole} />
            <main className="container mx-auto pt-4 min-h-screen">
                <div className="flex flex-col lg:flex-row">
                    <div className="flex-grow">{children}</div>
                </div>
            </main>
        </div>
    );
}
