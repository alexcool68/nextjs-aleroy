'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';

interface headerProps extends React.HTMLAttributes<HTMLDivElement> {}
export function Header({ className }: headerProps) {
    const pathname = usePathname();

    return (
        // <div className={cn('flex-nowrap fixed top-0 z-10 flex w-full bg-background/85 backdrop-blur-sm lg:flex-wrap border-b', className)}>
        <div className={cn('flex-nowrap top-0 z-10 flex w-full bg-background/85 backdrop-blur-sm lg:flex-wrap border-b', className)}>
            <div className="container flex h-20 items-center justify-between">
                <Link href="/" className="inline-flex items-center gap-5">
                    <Image src={'/logo.png'} alt="alexis logo" width={64} height={64} className="relative size-8 lg:size-16" />
                    <div className="text-2xl font-semibold tracking-wider hidden md:block">Alexis LEROY</div>
                </Link>

                <div className="flex items-center gap-5">
                    <SignedIn>
                        <Link
                            href="/"
                            className={cn(
                                'border-b-2 px-1 py-2 transition-colors hover:text-foreground',
                                pathname === '/' ? 'border-primary' : 'border-secondary text-muted-foreground'
                            )}
                        >
                            Home
                        </Link>
                        <Link
                            href="/dashboard"
                            className={cn(
                                'border-b-2 px-1 py-2 transition-colors hover:text-foreground',
                                pathname.includes('/dashboard') ? 'border-primary' : 'border-secondary text-muted-foreground'
                            )}
                        >
                            Dashboard
                        </Link>
                    </SignedIn>
                    <UserButton afterSignOutUrl="/" />
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button>Sign In</Button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </div>
    );
}
