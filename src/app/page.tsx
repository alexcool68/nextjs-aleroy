import { Button } from '@/components/ui/button';
import { SignInButton, SignOutButton, SignedIn, SignedOut } from '@clerk/nextjs';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <SignedIn>
                <p>Welcome !</p>
                <SignOutButton />
            </SignedIn>
            <SignedOut>
                <SignInButton />
            </SignedOut>
        </main>
    );
}
