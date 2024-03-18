import React from 'react';

import { cn } from '@/lib/utils';

import { Braces } from 'lucide-react';

interface noDataFoundProps extends React.HTMLAttributes<HTMLDivElement> {
    text?: string;
    icon?: React.ReactNode;
}

function NoDataFound({ text = 'No data found', icon, className }: noDataFoundProps) {
    return (
        <div className={cn('flex items-center justify-center bg-background/45 border-2 border-dotted rounded-2xl my-5 py-12', className)}>
            <div className="flex flex-row items-center text-2xl text-muted-foreground">
                {icon ? icon : <Braces className="w-10 h-10 mr-5" />} {text}
            </div>
        </div>
    );
}

export default NoDataFound;
