'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import { TestTube } from 'lucide-react';

import { Button } from '@/components/ui/button';

import SideNavItem from './side-nav-item';

import { MAIN_MENU } from '../../_data/menu';

interface SideNavProps extends React.HTMLAttributes<HTMLDivElement> {
    userRole: string | null;
}

export function SideNav({ className, userRole }: SideNavProps) {
    const pathname = usePathname();
    return (
        <>
            <div className={cn('pb-12', className)}>
                <div className="space-y-4 py-4">
                    {MAIN_MENU.map((item, _idx) => (
                        <div key={_idx}>
                            {item.role.includes(userRole !== null ? userRole : '') ? (
                                <div className="px-3 py-2" key={item.label}>
                                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{item.title}</h2>
                                    <div className="space-y-1">
                                        {item.menu.map((item) => (
                                            <SideNavItem data={item} key={item.label} />
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ))}

                    <div className="px-3 py-2">
                        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Testing</h2>
                        <div className="space-y-1">
                            <Button variant={pathname.includes(`/dashboard/test`) ? 'secondary' : 'ghost'} className="w-full justify-start" asChild>
                                <Link href="/dashboard/test">
                                    <TestTube className="h-4 w-4 mr-2" /> Test
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
