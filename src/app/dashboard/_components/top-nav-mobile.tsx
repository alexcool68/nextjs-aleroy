'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MAIN_MENU } from '../_data/menu';
import React from 'react';

interface TopNavMobileProps extends React.HTMLAttributes<HTMLDivElement> {
    userRole: string | null;
}

export function TopNavMobile({ className, userRole }: TopNavMobileProps) {
    const pathname = usePathname();

    return (
        <>
            <div className={cn('flex flex-row gap-5 items-center justify-start lg:hidden', className)}>
                {MAIN_MENU.map((item, _idx) => (
                    <React.Fragment key={_idx}>
                        {item.role.includes(userRole !== null ? userRole : '')
                            ? item.menu.map((submenu, _idx) => (
                                  <Link
                                      key={_idx}
                                      href={submenu.href}
                                      className={cn(
                                          'text-center pb-2 border-b-2 text-xs h-8',
                                          pathname.includes(submenu.href) ? 'border-accent-foreground' : 'border-secondary'
                                      )}
                                  >
                                      {submenu.title}
                                  </Link>
                              ))
                            : null}
                    </React.Fragment>
                ))}
            </div>
        </>
    );
}
