'use client';

import { useEffect } from 'react';

import TitleHeader from '../_components/title-header';

function TestingDashboard() {
    useEffect(() => {}, []);

    return (
        <div className="p-5">
            <TitleHeader title="Testing"></TitleHeader>
        </div>
    );
}

export default TestingDashboard;
