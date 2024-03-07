import React from 'react';

interface titleHeaderProps {
    title: string;
    children?: React.ReactNode;
}
export default function titleHeader({ children, title }: titleHeaderProps) {
    return (
        <>
            <div className="flex flex-row justify-between items-center border-b pb-5 mb-5">
                <h1 className="text-xl lg:text-3xl font-medium tracking-wider"># {title}</h1>
                {children}
            </div>
        </>
    );
}
