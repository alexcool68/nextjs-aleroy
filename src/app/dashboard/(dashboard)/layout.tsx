import React from 'react';
import { AuthRequiredError } from '@/lib/exceptions';
import { checkRole } from '@/lib/roles';

function dashboardDashboardLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const isSuperadmin = checkRole('superadmin');
    const isAdmin = checkRole('admin');
    if (!isSuperadmin && !isAdmin) throw new AuthRequiredError();

    return children;
}

export default dashboardDashboardLayout;
