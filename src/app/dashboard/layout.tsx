export default function DashboardLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="container pt-12">
            <div className="flex gap-8 border rounded">
                <div className="w-full">{children}</div>
            </div>
        </main>
    );
}
