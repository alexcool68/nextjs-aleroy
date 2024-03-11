import React from 'react';
import { ClipLoader } from 'react-spinners';

function Loader() {
    return (
        <div className="flex justify-center items-center py-10 my-5">
            <ClipLoader color={'orange'} size={150} aria-label="Loading Spinner" />
        </div>
    );
}

export default Loader;
