'use client';

import { Button } from '@/components/ui/button';

import { Loader2, User, UserPlus } from 'lucide-react';
import { DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogDescription, Dialog } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { User as typeUser } from '@clerk/backend';
import { Invitation as typeInvitation } from '@clerk/backend';

import { getUserList, getInvitationList, createInvitation } from '@/server/clerck-backend';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const formSchema = z.object({
    email: z.string()
});

export default function UsersDashboard() {
    const users = [];
    const [userList, setUserList] = useState<typeUser[]>([]);
    const [invitationList, setInvitationList] = useState<typeInvitation[]>([]);

    const { toast } = useToast();
    const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ''
        }
    });

    useEffect(() => {
        try {
            getUserList().then((data) => {
                setUserList(data);
            });
            getInvitationList('pending').then((data) => {
                setInvitationList(data);
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createInvitation(values.email);

            form.reset();

            setIsFileDialogOpen(false);

            toast({
                variant: 'default',
                title: 'User invited',
                description: 'An email was sent to the user'
            });
        } catch (err) {
            console.log(err);
            toast({
                variant: 'destructive',
                title: 'Something went wrong',
                description: 'Your invitation had failed, try again later'
            });
        }
    }

    return (
        <div className="p-5">
            <div className="flex flex-row justify-between items-center border-b pb-5">
                <h1 className="text-4xl font-medium tracking-wider"># Utilisateurs</h1>

                {/* <Button variant={'secondary'} size={'sm'} asChild>
                    <Link href="/dashboard/users/add">
                        <UserPlus className="w-4 h-4 mr-2" /> Add
                    </Link>
                </Button> */}
                <Dialog
                    open={isFileDialogOpen}
                    onOpenChange={(isOpen) => {
                        setIsFileDialogOpen(isOpen);
                    }}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="w-4 h-4 mr-2" /> Add
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="mb-8">Upload your File Here</DialogTitle>
                            <DialogDescription>This file will be accessible by anyone in your organization</DialogDescription>
                        </DialogHeader>
                        <div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" disabled={form.formState.isSubmitting} className="flex gap-1">
                                        {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                        Submit
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <h2 className="text-2xl font-medium tracking-wider my-2">Users from DB</h2>
            {users?.length === 0 && (
                <div className="flex items-center justify-center bg-background/45 border-2 border-dotted rounded-2xl my-5 py-20">
                    <div className="flex items-center text-2xl text-muted-foreground">
                        <User className="size-10 mr-5" /> No data found
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-medium tracking-wider my-2">Users from Clerk</h2>
            {userList.length === 0 && (
                <div className="flex items-center justify-center bg-background/45 border-2 border-dotted rounded-2xl my-5 py-20">
                    <div className="flex items-center text-2xl text-muted-foreground">
                        <User className="size-10 mr-5" /> No data found
                    </div>
                </div>
            )}

            {userList &&
                userList.length > 0 &&
                userList.map((user) => (
                    <div key={user.id} className="flex items-center py-2 gap-5">
                        {user.hasImage && (
                            <Avatar>
                                <AvatarImage src={user.imageUrl} alt={user.emailAddresses[0].emailAddress.slice(0, 2)} />
                                <AvatarFallback>{user.emailAddresses[0].emailAddress.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                        )}
                        <span>{user.emailAddresses[0].emailAddress}</span>
                    </div>
                ))}

            <h2 className="text-2xl font-medium tracking-wider my-2">Pending invitation</h2>
            {invitationList &&
                invitationList.length > 0 &&
                invitationList.map((invitation) => (
                    <div key={invitation.id} className="flex items-center h-12 py-2 gap-5 border-b">
                        <Badge variant={'outline'}>{invitation.status}</Badge>
                        <span>{format(invitation.createdAt, 'dd MMMM yyy')}</span>
                        <span>{invitation.emailAddress}</span>
                    </div>
                ))}

            {invitationList.length === 0 && (
                <div className="flex items-center justify-center bg-background/45 border-2 border-dotted rounded-2xl my-5 py-20">
                    <div className="flex items-center text-2xl text-muted-foreground">
                        <User className="size-10 mr-5" /> No data found
                    </div>
                </div>
            )}
        </div>
    );
}
