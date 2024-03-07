'use client';

import { useEffect, useState } from 'react';
import { User as typeUser } from '@clerk/backend';
import { deleteUser, getUserList } from '@/server/clerck-backend';
import { CpuIcon, Crown, Trash } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NoDataFound from '@/components/no-data-found';
import TableStatusInvitations from './_components/table-status-invitations';
import ButtonInviteUser from './_components/button-invite-user';
import { Button } from '@/components/ui/button';
import TitleHeader from '../../_components/title-header';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const SAFE_EMAIL = ['alexis.leroy.it@gmail.com', 'leroy.clement68@gmail.com'];

export default function UsersDashboard() {
    const { toast } = useToast();
    const [userList, setUserList] = useState<typeUser[]>([]);

    const getAllUsersList = () => {
        getUserList().then((data) => {
            setUserList(data);
        });
    };

    const onDeleteUser = async (userId: string) => {
        try {
            const result = await deleteUser(userId);

            if (result.message) {
                toast({ description: result.message });
            }

            if (result.deleted) {
                setUserList(userList.filter((item) => userId !== item.id));
                toast({ description: 'User deleted' });
            }
        } catch (error) {
            toast({ description: 'Something went wrong' });
            console.log(error);
        }
    };

    useEffect(() => {
        try {
            getAllUsersList();
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <div className="md:p-5">
            <TitleHeader title="Users">
                <ButtonInviteUser />
            </TitleHeader>

            <div className="grid grid-rows-1 lg:grid-cols-2 gap-5">
                <div className="border rounded-lg">
                    <TableStatusInvitations showElements={3} />
                </div>
                <div className="border rounded-lg">
                    <h3 className="text-sm text-muted-foreground flex items-center gap-2 my-2 px-2">
                        <CpuIcon size={16} />
                        Other stuff
                    </h3>
                </div>
            </div>

            <h2 className="text-xl font-medium tracking-wide my-5">Users from Clerk</h2>
            {userList.length === 0 && <NoDataFound />}

            {userList.map((user) => (
                <div key={user.id} className="flex items-center justify-between gap-5 py-2 lg:py-5 border-b">
                    <div className="flex flex-row items-center justify-start gap-2 lg:gap-5 text-sm lg:text-md">
                        <Avatar className="border">
                            {user.hasImage && <AvatarImage src={user.imageUrl} alt={user.emailAddresses[0].emailAddress.slice(0, 2)} />}
                            <AvatarFallback>{user.emailAddresses[0].emailAddress.slice(0, 2)}</AvatarFallback>
                        </Avatar>

                        <Crown className={cn('size-4', (user.publicMetadata.role as string) === 'admin' ? 'text-primary' : 'text-muted')} />

                        <div className="flex flex-col lg:flex-row lg:gap-5 items-start justify-center">
                            <div>{user.emailAddresses[0].emailAddress}</div>
                            {user.firstName && user.lastName && <div>{`${user.firstName} ${user.lastName}`}</div>}
                        </div>
                    </div>

                    <Button
                        variant={'destructive'}
                        size={'icon'}
                        onClick={() => onDeleteUser(user.id)}
                        disabled={user.emailAddresses.some((email) => SAFE_EMAIL.includes(email.emailAddress)) ? true : false}
                    >
                        <Trash className="w-4 h-4" />
                    </Button>
                </div>
            ))}
        </div>
    );
}
