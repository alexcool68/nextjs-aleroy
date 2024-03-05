import { User } from 'lucide-react';

import React from 'react';

function NoDataFound() {
    return (
        <div className="flex items-center justify-center bg-background/45 border-2 border-dotted rounded-2xl my-5 py-12">
            <div className="flex items-center text-2xl text-muted-foreground">
                <User className="size-10 mr-5" /> No data found
            </div>
        </div>
    );
}

export default NoDataFound;
