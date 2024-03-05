'use client';

import { useEffect, useState } from 'react';
import { User as typeUser } from '@clerk/backend';
import { deleteUser, getUserList } from '@/server/clerck-backend';
import { CpuIcon, Trash } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NoDataFound from '@/components/no-data-found';
import TableStatusInvitations from './_components/table-status-invitations';
import ButtonInviteUser from './_components/button-invite-user';
import { Button } from '@/components/ui/button';

export default function UsersDashboard() {
    const [userList, setUserList] = useState<typeUser[]>([]);

    const getAllUsersList = () => {
        getUserList().then((data) => {
            setUserList(data);
        });
    };

    const onDeleteUser = (userId: string) => {
        deleteUser(userId).then(() => setUserList(userList.filter((item) => userId !== item.id)));
    };

    useEffect(() => {
        try {
            getAllUsersList();
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <div className="p-5">
            <div className="flex flex-row justify-between items-center border-b pb-5 mb-5">
                <h1 className="text-xl lg:text-3xl font-medium tracking-wider"># Users</h1>
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

            <h2 className="text-xl font-medium tracking-wide my-5">Users from Clerk</h2>
            {userList.length === 0 && <NoDataFound />}

            {userList.map((user) => (
                <>
                    <div key={user.id} className="flex items-center justify-between gap-5 py-5 border-b">
                        <div className="flex flex-row items-center justify-start gap-5">
                            <Avatar className="border">
                                {user.hasImage && <AvatarImage src={user.imageUrl} alt={user.emailAddresses[0].emailAddress.slice(0, 2)} />}
                                <AvatarFallback>{user.emailAddresses[0].emailAddress.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>{user.emailAddresses[0].emailAddress}</div>
                            {user.firstName && user.lastName && <div>{`${user.firstName} ${user.lastName}`}</div>}
                        </div>
                        <Button
                            variant={'destructive'}
                            size={'icon'}
                            onClick={() => onDeleteUser(user.id)}
                            disabled={
                                user.emailAddresses[0].emailAddress == 'alexis.leroy.it@gmail.com' || 'leroy.clement68@gmail.com' ? true : false
                            }
                        >
                            <Trash className="w-4 h-4" />
                        </Button>
                    </div>
                </>
            ))}
        </div>
    );
}
