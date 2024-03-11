import React from 'react';

function articlesLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className="container">{children}</div>;
}

export default articlesLayout;
