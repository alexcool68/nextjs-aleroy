import Link from 'next/link';
import { OrganizationSwitcher, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { AirVentIcon } from 'lucide-react';

export function Header() {
    return (
        <div className="relative z-10 border-b py-5 bg-background">
            <div className="container flex items-center justify-between mx-auto">
                <Link href="/" className="flex gap-5 items-center">
                    <AirVentIcon className="size-10 text-primary/75" />
                    {/* <Image src="/logo.png" width="50" height="50" alt="file drive logo" /> */}
                    <div className="text-2xl font-semibold tracking-wider hidden md:block">Alexis LEROY</div>
                </Link>

                <SignedIn>
                    <Button variant={'ghost'}>
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                </SignedIn>

                <div className="flex gap-5">
                    <OrganizationSwitcher />
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
