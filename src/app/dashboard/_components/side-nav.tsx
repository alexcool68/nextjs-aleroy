'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Key, TestTube, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuInterface {
    label: string;
    title: string;
    href: string;
    icon: React.ReactNode;
}
const MENU_DASHBOARD: MenuInterface[] = [
    {
        label: 'users',
        title: 'Utilisateurs',
        href: '/dashboard/users',
        icon: <Users className="h-4 w-4 mr-2" />
    },
    {
        label: 'test',
        title: 'Test',
        href: '/dashboard/test',
        icon: <TestTube className="h-4 w-4 mr-2" />
    }
];

const MENU_TOOLS: MenuInterface[] = [
    {
        label: 'debrid',
        title: 'Debrideur de liens',
        href: '/dashboard/debrid',
        icon: <Key className="h-4 w-4 mr-2" />
    }
];

const MENU_SETTINGS: MenuInterface[] = [];

interface SideNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SideNav({ className }: SideNavProps) {
    const pathname = usePathname();

    return (
        <div className={cn('pb-12', className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
                    <div className="space-y-1">
                        {MENU_DASHBOARD.map((item) => (
                            <Button
                                key={item.label}
                                variant={pathname.includes(`${item.href}`) ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                                asChild>
                                <Link href={item.href}>
                                    {item.icon} {item.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Outils</h2>
                    <div className="space-y-1">
                        {MENU_TOOLS.map((item) => (
                            <Button
                                key={item.label}
                                variant={pathname.includes(`${item.href}`) ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                                asChild>
                                <Link href={item.href}>
                                    {item.icon} {item.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Settings</h2>
                    <div className="space-y-1">
                        {MENU_SETTINGS.map((item) => (
                            <Button
                                key={item.label}
                                variant={pathname.includes(`${item.href}`) ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                                asChild>
                                <Link href={item.href}>
                                    {item.icon} {item.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
