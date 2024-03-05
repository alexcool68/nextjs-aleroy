'use client';

import { useEffect } from 'react';

function TestingDashboard() {
    useEffect(() => {}, []);

    return (
        <div className="p-5">
            <div className="flex flex-row justify-between items-center border-b pb-5 mb-5">
                <h1 className="text-xl lg:text-3xl font-medium tracking-wider"># Testing</h1>
            </div>
        </div>
    );
}

export default TestingDashboard;
