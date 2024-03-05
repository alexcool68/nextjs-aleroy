import React, { useEffect, useState } from 'react';
import { InvitationStatus, Invitation as typeInvitation } from '@clerk/backend';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface TableInvitationProps {
    data: typeInvitation[];
}

function InvitationsStatus({ data }: TableInvitationProps) {
    const [dataModified, setDataModified] = useState<typeInvitation[]>([]);

    const onTabChange = (value: string) => {
        switch (value) {
            case 'all':
                setDataModified(data);
                break;
            default:
                const res = data.filter((el) => el.status === value);
                setDataModified(res);
        }
    };

    useEffect(() => {
        setDataModified(data);
    }, [data]);

    return (
        <>
            <ToggleGroup type="single" defaultValue="all" onValueChange={onTabChange} size={'sm'} variant={'outline'} className="my-5">
                <ToggleGroupItem value="all" aria-label="Toggle all">
                    All
                </ToggleGroupItem>
                <ToggleGroupItem value="accepted" aria-label="Toggle accepted">
                    Accepted
                </ToggleGroupItem>
                <ToggleGroupItem value="pending" aria-label="Toggle pending">
                    Pending
                </ToggleGroupItem>
                <ToggleGroupItem value="revoked" aria-label="Toggle revoked">
                    Revoked
                </ToggleGroupItem>
            </ToggleGroup>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Email</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataModified.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">
                                No data
                            </TableCell>
                        </TableRow>
                    )}
                    {dataModified.map((invitation) => (
                        <TableRow key={invitation.id}>
                            <TableCell>
                                <Badge variant={invitation.status === 'revoked' ? 'destructive' : 'default'}>{invitation.status}</Badge>
                            </TableCell>
                            <TableCell>{format(invitation.createdAt, 'dd MMMM yyy')}</TableCell>
                            <TableCell>{invitation.emailAddress}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}

export default InvitationsStatus;
