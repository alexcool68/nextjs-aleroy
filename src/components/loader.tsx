import React from 'react';

import { cn } from '@/lib/utils';

import { BeatLoader } from 'react-spinners';

interface loaderProps extends React.HTMLAttributes<HTMLDivElement> {
    color?: string;
    size?: number;
}
function Loader({ color = '#ea580c', size = 128, className }: loaderProps) {
    return (
        <div className={cn('flex justify-center items-center py-10 my-5', className)}>
            <BeatLoader color={color} size={size} aria-label="Loading Spinner" />
        </div>
    );
}

export default Loader;
