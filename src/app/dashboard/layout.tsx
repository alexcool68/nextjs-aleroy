import { SideNav } from './_components/side-nav';
import { TopNavMobile } from './_components/top-nav-mobile';

export default function DashboardLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="container mx-auto pt-4 min-h-screen">
            <div className="flex flex-col lg:flex-row">
                <TopNavMobile className="flex gap-5 items-center justify-start lg:hidden mb-5 " />
                <SideNav className="hidden lg:flex lg:rounded-none lg:border-r" />
                <div className="w-full mt-1">{children}</div>
            </div>
        </main>
    );
}
