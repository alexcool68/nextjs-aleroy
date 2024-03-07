'use server';

import { Clerk, InvitationStatus } from '@clerk/nextjs/server';
import { checkRole } from '@/lib/roles';

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

async function createInvitation(email: string) {
    try {
        const list = await clerk.invitations.createInvitation({ emailAddress: email });
        const data = JSON.parse(JSON.stringify(list));
        return data;
    } catch (error) {
        return { message: 'Error fetching data' };
    }
}

async function getInvitationList(status?: InvitationStatus) {
    try {
        const list = await clerk.invitations.getInvitationList({ status: status == null ? undefined : status });
        const data = JSON.parse(JSON.stringify(list));
        return data;
    } catch (error) {
        return { message: 'Error fetching data' };
    }
}

async function revokeInvitation(invitationId: string) {
    try {
        const list = await clerk.invitations.revokeInvitation(invitationId);
        const data = JSON.parse(JSON.stringify(list));
        return data;
    } catch (error) {
        return { message: 'Error fetching data' };
    }
}

async function getUserList() {
    try {
        const list = await clerk.users.getUserList();
        const data = JSON.parse(JSON.stringify(list));
        return data;
    } catch (error) {
        return { message: 'Error fetching data' };
    }
}

async function deleteUser(userId: string) {
    if (!checkRole('admin')) {
        return { message: 'Not Authorized' };
    }

    try {
        const user = await clerk.users.deleteUser(userId);
        const data = JSON.parse(JSON.stringify(user));
        return data;
    } catch (error) {
        return { message: 'Error fetching data' };
    }
}

async function setRole(id: string, role: string) {
    if (!checkRole('admin')) {
        return { message: 'Not Authorized' };
    }

    try {
        const res = await clerk.users.updateUser(id, {
            publicMetadata: { role: role }
        });
        return { message: res.publicMetadata };
    } catch (err) {
        return { message: err };
    }
}
export { getUserList, deleteUser, createInvitation, getInvitationList, revokeInvitation, setRole };
