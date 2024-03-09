'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MAIN_MENU } from '../_data/menu';

interface TopNavMobileProps extends React.HTMLAttributes<HTMLDivElement> {
    userRole?: string;
}

export function TopNavMobile({ className, userRole }: TopNavMobileProps) {
    const pathname = usePathname();

    return (
        <>
            <div className={cn('', className)}>
                {MAIN_MENU.map((item) =>
                    item.menu.map((submenu) => (
                        <Link
                            href={submenu.href}
                            className={cn(
                                'pb-2 border-b-2 text-sm',
                                pathname.includes(submenu.href) ? 'border-accent-foreground' : 'border-secondary'
                            )}
                        >
                            {submenu.title}
                        </Link>
                    ))
                )}
            </div>
        </>
    );
}
