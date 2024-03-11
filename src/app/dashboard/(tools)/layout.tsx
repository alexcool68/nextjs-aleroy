import React from 'react';
import { AuthRequiredError } from '@/lib/exceptions';
import { checkRole, getRole } from '@/lib/roles';

function toolsDashboardLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const isSuperadmin = checkRole('superadmin');
    const isAdmin = checkRole('admin');
    const isMember = checkRole('member');

    if (!isSuperadmin && !isAdmin && !isMember) throw new AuthRequiredError();

    return children;
}

export default toolsDashboardLayout;
