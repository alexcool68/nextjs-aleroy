import React from 'react';

import { cn } from '@/lib/utils';

interface titleHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    children?: React.ReactNode;
}

export default function titleHeader({ children, title, className }: titleHeaderProps) {
    return (
        <>
            <div className={cn('flex flex-row justify-between items-center border-b pb-5 mb-5', className)}>
                <h1 className="text-xl lg:text-3xl font-medium tracking-wider"># {title}</h1>
                {children}
            </div>
        </>
    );
}
