'use client';

import { useEffect } from 'react';

import TitleHeader from '../_components/title-header';

import TipTapEditor from '../(dashboard)/articles/_components/tip-tap-editor';

function TestingDashboard() {
    useEffect(() => {}, []);

    return (
        <div className="p-5">
            <TitleHeader title="Testing"></TitleHeader>

            <div className="w-full p-3 max-h-[600px] overflow-auto border rounded-xl">
                <TipTapEditor />
            </div>
        </div>
    );
}

export default TestingDashboard;
