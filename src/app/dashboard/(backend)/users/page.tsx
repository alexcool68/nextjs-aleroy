'use client';

import { useEffect, useState } from 'react';
import { User as typeUser } from '@clerk/backend';
import { deleteUser, getUserList, setRole } from '@/server/clerck-backend';
import { CpuIcon, Crown, Trash } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NoDataFound from '@/components/no-data-found';
import TableStatusInvitations from './_components/table-status-invitations';
import ButtonInviteUser from './_components/button-invite-user';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TitleHeader from '../../_components/title-header';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CrownInfo from './_components/crown-info';

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

    const changeRole = async (userId: string, role: string) => {
        try {
            await setRole(userId, role);
            getAllUsersList();
        } catch (error) {
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
            <CrownInfo />

            {userList.length === 0 && <NoDataFound />}

            {userList.map((user) => (
                <div key={user.id} className="flex items-center justify-between gap-5 py-2 lg:py-5 border-b">
                    <div className="flex flex-row items-center justify-start gap-2 lg:gap-5 text-sm lg:text-md">
                        <Avatar className="border">
                            {user.hasImage && <AvatarImage src={user.imageUrl} alt={user.emailAddresses[0].emailAddress.slice(0, 2)} />}
                            <AvatarFallback>{user.emailAddresses[0].emailAddress.slice(0, 2)}</AvatarFallback>
                        </Avatar>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Crown
                                        className={cn(
                                            'size-4',

                                            (user.publicMetadata.role as string) === 'superadmin'
                                                ? 'text-primary'
                                                : (user.publicMetadata.role as string) === 'admin'
                                                  ? 'text-muted-foreground'
                                                  : 'text-muted'
                                        )}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{user.publicMetadata.role as string}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <div className="flex flex-col lg:flex-row lg:gap-5 items-start justify-center">
                            <div>{user.emailAddresses[0].emailAddress}</div>
                            {user.firstName && user.lastName && <div>{`${user.firstName} ${user.lastName}`}</div>}
                        </div>
                    </div>
                    <div className="hidden sm:flex space-x-2 items-center">
                        <Select onValueChange={(e) => changeRole(user.id, e)} value={user.publicMetadata.role as string}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="superadmin">Super admin</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant={'destructive'}
                            size={'icon'}
                            onClick={() => onDeleteUser(user.id)}
                            disabled={user.emailAddresses.some((email) => SAFE_EMAIL.includes(email.emailAddress)) ? true : false}
                        >
                            <Trash className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
