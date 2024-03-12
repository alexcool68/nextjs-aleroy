import React from 'react';
import { CheckCircle } from 'lucide-react';

interface PublishedInfoProps {}
function PublishedInfo({}: PublishedInfoProps) {
    return (
        <div className="flex flex-row items-center justify-end gap-7 lg:gap-10 rounded-lg border border-dashed my-2 lg:my-5 p-2 lg:p-5">
            <div className="flex items-center text-xs lg:text-sm">
                <CheckCircle className="size-4 text-primary mr-2 lg:-mb-1" />
                Published
            </div>
            <div className="flex items-center text-xs lg:text-sm">
                <CheckCircle className="size-4 text-muted-foreground mr-2 lg:-mb-1" />
                Unpublished
            </div>
        </div>
    );
}

export default PublishedInfo;
