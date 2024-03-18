'use client';

import { useEffect } from 'react';

import { ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <main className="flex flex-col items-center justify-center my-16 gap-5">
            <ShieldAlert className="h-32 w-32 text-muted" />
            <h2 className="text-3xl text-center">Something went wrong!</h2>
            <p className="mb-5">{error.message}</p>
            <Button
                variant={'default'}
                onClick={
                    // Attempt to recover by trying to re-render the invoices route
                    () => reset()
                }
            >
                Try again
            </Button>
        </main>
    );
}
