'use server';

import { Clerk, InvitationStatus } from '@clerk/nextjs/server';

const CLERK_SK = process.env.CLERK_SECRET_KEY;

async function getUserList() {
    try {
        const clerk = Clerk({ apiKey: CLERK_SK });

        const list = await clerk.users.getUserList();

        const data = JSON.parse(JSON.stringify(list));

        return data;
    } catch (error) {
        return { message: 'Error fetching data' };
    }
}

async function getInvitationList(status: InvitationStatus) {
    try {
        const clerk = Clerk({ apiKey: CLERK_SK });

        const list = await clerk.invitations.getInvitationList({ status: status });

        const data = JSON.parse(JSON.stringify(list));

        return data;
    } catch (error) {
        return { message: 'Error fetching data' };
    }
}

async function createInvitation(email: string) {
    try {
        const clerk = Clerk({ apiKey: CLERK_SK });

        const list = await clerk.invitations.createInvitation({ emailAddress: email });

        const data = JSON.parse(JSON.stringify(list));

        return data;
    } catch (error) {
        return { message: 'Error fetching data' };
    }
}

export { getUserList, getInvitationList, createInvitation };
