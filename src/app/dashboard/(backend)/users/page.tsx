'use client';

import { useEffect, useState } from 'react';
import { User as typeUser } from '@clerk/backend';
import { getUserList } from '@/server/clerck-backend';
import { CpuIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NoDataFound from '@/components/no-data-found';
import TableStatusInvitations from './_components/table-status-invitations';
import ButtonInviteUser from './_components/button-invite-user';

export default function UsersDashboard() {
    const [userList, setUserList] = useState<typeUser[]>([]);

    useEffect(() => {
        try {
            getUserList().then((data) => {
                setUserList(data);
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <div className="p-5">
            <div className="flex flex-row justify-between items-center border-b pb-5 mb-5">
                <h1 className="text-xl lg:text-3xl font-medium tracking-wider"># Utilisateurs</h1>
                <ButtonInviteUser />
            </div>

            <div className="grid grid-cols-2 gap-5">
                <div className="border rounded-lg p-5">
                    <TableStatusInvitations showElements={3} />
                </div>
                <div className="border rounded-lg p-5">
                    <h3 className="text-sm text-muted-foreground flex items-center gap-2 my-2">
                        <CpuIcon size={16} />
                        Other stuff
                    </h3>
                </div>
            </div>

            <h2 className="text-2xl font-medium tracking-wider my-3">Users from Clerk</h2>
            {userList.length === 0 && <NoDataFound />}

            {userList.map((user) => (
                <div key={user.id} className="flex items-center py-2 gap-5">
                    <Avatar>
                        {user.hasImage && <AvatarImage src={user.imageUrl} alt={user.emailAddresses[0].emailAddress.slice(0, 2)} />}
                        <AvatarFallback>{user.emailAddresses[0].emailAddress.slice(0, 2)}</AvatarFallback>
                    </Avatar>

                    <span>{user.emailAddresses[0].emailAddress}</span>
                </div>
            ))}
        </div>
    );
}