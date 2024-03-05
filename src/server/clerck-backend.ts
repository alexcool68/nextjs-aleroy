'use server';

import { Clerk, InvitationStatus } from '@clerk/nextjs/server';

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

export { getUserList, createInvitation, getInvitationList, revokeInvitation };
