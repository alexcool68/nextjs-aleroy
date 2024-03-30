'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import { MAIN_MENU } from '../_data/menu';

import { LayoutDashboardIcon, Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface TopNavDashboardProps extends React.HTMLAttributes<HTMLDivElement> {
    userRole: string | null;
}

export function TopNavDashboard({ className, userRole }: TopNavDashboardProps) {
    const pathname = usePathname();

    return (
        <>
            <header className={cn('sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6 bg-background/85 backdrop-blur-sm', className)}>
                <div className="container mx-auto">
                    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                            <LayoutDashboardIcon
                                className={cn('h-5 w-5', pathname.endsWith('dashboard') ? 'text-foreground' : 'text-muted-foreground')}
                            />
                            <span className="sr-only">Dashboard</span>
                        </Link>
                        {MAIN_MENU.map((item, _idx) => (
                            <React.Fragment key={_idx}>
                                {item.role.includes(userRole !== null ? userRole : '')
                                    ? item.menu.map((submenu, _idx) => (
                                          <Link
                                              key={_idx}
                                              href={submenu.href}
                                              className={cn(
                                                  'transition-colors hover:text-foreground',
                                                  pathname.includes(submenu.href)
                                                      ? 'text-foreground border-b border-primary py-1.5'
                                                      : 'text-muted-foreground'
                                              )}
                                          >
                                              {submenu.title}
                                          </Link>
                                      ))
                                    : null}
                            </React.Fragment>
                        ))}
                    </nav>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <nav className="grid gap-6 text-lg font-medium">
                                <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
                                    <LayoutDashboardIcon
                                        className={cn('h-5 w-5', pathname.endsWith('dashboard') ? 'text-foreground' : 'text-muted-foreground')}
                                    />
                                    <span className="sr-only">Dashboard</span>
                                </Link>
                                {MAIN_MENU.map((item, _idx) => (
                                    <React.Fragment key={_idx}>
                                        {item.role.includes(userRole !== null ? userRole : '')
                                            ? item.menu.map((submenu, _idx) => (
                                                  <Link
                                                      key={_idx}
                                                      href={submenu.href}
                                                      className={cn(
                                                          'transition-colors hover:text-foreground',
                                                          pathname.includes(submenu.href) ? 'text-foreground' : 'text-muted-foreground'
                                                      )}
                                                  >
                                                      {submenu.title}
                                                  </Link>
                                              ))
                                            : null}
                                    </React.Fragment>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                        {/* <form className="ml-auto flex-1 sm:flex-initial">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="search" placeholder="Search products..." className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]" />
                            </div>
                        </form>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full">
                                    <CircleUser className="h-5 w-5" />
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem>Support</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu> */}
                    </div>
                </div>
            </header>
        </>
    );
}
