import { getRole } from '@/lib/roles';
import { SideNav } from './_components/side-nav';
import { TopNavMobile } from './_components/top-nav-mobile';

export default function DashboardLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const userRole = getRole();
    return (
        <main className="container mx-auto pt-4 min-h-screen">
            <TopNavMobile className="mb-5" userRole={userRole} />

            <div className="flex flex-col lg:flex-row">
                <SideNav className="hidden lg:flex lg:rounded-none lg:border-r" userRole={userRole} />
                <div className="w-full mt-1">{children}</div>
            </div>
        </main>
    );
}
