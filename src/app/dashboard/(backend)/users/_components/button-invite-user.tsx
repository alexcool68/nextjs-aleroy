import React, { useEffect, useState } from 'react';
import { Loader2, UserPlus } from 'lucide-react';
import { createInvitation } from '@/server/clerck-backend';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DialogHeader, DialogTrigger, DialogContent, DialogTitle, Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
    email: z.string().min(1, { message: 'This field has to be filled.' }).email('This is not a valid email.')
});

interface ButtonInviteUserProps {}
function ButtonInviteUser({}: ButtonInviteUserProps) {
    const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ''
        }
    });

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

    useEffect(() => {
        if (!isFileDialogOpen) {
            form.reset();
        }
    }, [isFileDialogOpen, form]);

    return (
        <>
            <Dialog
                open={isFileDialogOpen}
                onOpenChange={(isOpen) => {
                    setIsFileDialogOpen(isOpen);
                }}
            >
                <DialogTrigger asChild>
                    <Button variant={'secondary'} size={'sm'}>
                        <UserPlus className="w-4 h-4 mr-2" /> Invite
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="mb-8">Invite an new user</DialogTitle>
                        {/* <DialogDescription>Enter the email address of the user</DialogDescription> */}
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
                                    Invite now !
                                </Button>
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ButtonInviteUser;
