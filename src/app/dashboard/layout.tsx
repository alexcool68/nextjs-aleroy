import { SideNav } from './side-nav';

export default function DashboardLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // <main className="container pt-12">
        //     <div className="flex gap-8 border rounded">
        //         <div className="w-full">{children}</div>
        //     </div>
        // </main>
        <main className="container mx-auto pt-12 min-h-screen">
            <div className="flex gap-8">
                <SideNav className="hidden lg:block" />

                <div className="w-full">{children}</div>
            </div>
        </main>
    );
}
