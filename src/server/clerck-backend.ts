'use server';

import { clerkClient } from '@clerk/nextjs';
import { checkRole } from '@/lib/roles';

import { InvitationStatus } from '@clerk/backend';

async function createInvitation(email: string) {
    try {
        const invitation = await clerkClient.invitations.createInvitation({
            emailAddress: email,
            notify: true,
            ignoreExisting: true,
            publicMetadata: {
                role: 'member'
            }
        });
        return invitation;
    } catch (error) {
        return { message: 'Error invitation' };
    }
}

async function getInvitationList(status?: InvitationStatus) {
    try {
        const list = await clerkClient.invitations.getInvitationList({ status: status == null ? undefined : status });
        const data = JSON.parse(JSON.stringify(list));
        return data;
    } catch (error) {
        return { message: 'Error fetching data' };
    }
}

async function revokeInvitation(invitationId: string) {
    try {
        const list = await clerkClient.invitations.revokeInvitation(invitationId);
        const data = JSON.parse(JSON.stringify(list));
        return data;
    } catch (error) {
        return { message: 'Error fetching data' };
    }
}

async function getUserList() {
    try {
        const list = await clerkClient.users.getUserList();
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
        const user = await clerkClient.users.deleteUser(userId);
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
        await clerkClient.users.updateUser(id, {
            publicMetadata: { role: role }
        });
        return null;
    } catch (err) {
        return { message: err };
    }
}

export { getUserList, deleteUser, createInvitation, getInvitationList, revokeInvitation, setRole };
