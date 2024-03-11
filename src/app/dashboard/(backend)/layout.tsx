import { AuthRequiredError } from '@/lib/exceptions';
import { checkRole } from '@/lib/roles';
import React from 'react';

function backendDashboardLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const isSuperAdmin = checkRole('superadmin');
    if (!isSuperAdmin) throw new AuthRequiredError();
    return children;
}

export default backendDashboardLayout;
