'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { User, UserPlus } from 'lucide-react';

export default function UsersDashboard() {
    const users = [];

    return (
        <div className="p-5">
            <div className="flex flex-row justify-between items-center border-b pb-5">
                <h1 className="text-4xl font-medium tracking-wider"># Utilisateurs</h1>
                <Button variant={'secondary'} size={'sm'} asChild>
                    <Link href="/dashboard/users/add">
                        <UserPlus className="w-4 h-4 mr-2" /> Add
                    </Link>
                </Button>
            </div>

            {users?.length === 0 && (
                <div className="flex items-center justify-center bg-background/45 border-2 border-dotted rounded-2xl my-5 py-20">
                    <div className="flex items-center text-2xl text-muted-foreground">
                        <User className="size-10 mr-5" /> No data found
                    </div>
                </div>
            )}
        </div>
    );
}
