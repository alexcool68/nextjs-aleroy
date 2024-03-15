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
            <div className="p-0">
                <TopNavMobile className="mb-5" userRole={userRole} />

                <div className="flex flex-col lg:flex-row">
                    <SideNav className="hidden lg:flex lg:rounded-none max-w-56" userRole={userRole} />
                    <div className="flex-grow">{children}</div>
                </div>
            </div>
        </main>
    );
}
