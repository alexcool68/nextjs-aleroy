import React from 'react';

import { BeatLoader } from 'react-spinners';

interface LoaderProps {
    color?: string;
    size?: number;
}
function Loader({ color = '#ea580c', size = 128 }: LoaderProps) {
    return (
        <div className="flex justify-center items-center py-10 my-5">
            <BeatLoader color={color} size={size} aria-label="Loading Spinner" />
        </div>
    );
}

export default Loader;
