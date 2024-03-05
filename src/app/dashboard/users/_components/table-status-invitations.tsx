import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { getInvitationList, revokeInvitation } from '@/server/clerck-backend';
import { InvitationStatus, Invitation as typeInvitation } from '@clerk/backend';
import { Calendar, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface TableStatusInvitationsProps {
    showElements?: number;
}

function TableStatusInvitations({ showElements }: TableStatusInvitationsProps) {
    const [query, setQuery] = useState<InvitationStatus>('accepted');
    const [data, setData] = useState<typeInvitation[]>([]);

    const MAX_ELEMENTS = showElements ?? 5;

    const invitationList: any = (status: InvitationStatus) => {
        getInvitationList(status).then((data) => {
            setData(data);
        });
    };

    const onRevokeHandler = (invitationId: string) => {
        revokeInvitation(invitationId).then(() => {
            setQuery('revoked');
        });
    };

    useEffect(() => {
        switch (query) {
            case 'pending':
            case 'accepted':
            case 'revoked':
                invitationList(query);
                break;
        }
    }, [query]);

    return (
        <>
            <h3 className="text-sm text-muted-foreground flex items-center gap-2 my-2">
                <Calendar size={16} />
                Invitations status (latest {MAX_ELEMENTS} elements)
            </h3>
            <ToggleGroup
                type="single"
                defaultValue="accepted"
                onValueChange={(e: InvitationStatus) => setQuery(e)}
                size={'sm'}
                value={query}
                variant={'outline'}
                className="my-5">
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
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">
                                No data
                            </TableCell>
                        </TableRow>
                    )}
                    {data.slice(0, MAX_ELEMENTS).map((invitation) => (
                        <TableRow key={invitation.id}>
                            <TableCell>
                                <Badge variant={'secondary'}>{invitation.status}</Badge>
                            </TableCell>
                            <TableCell>{format(invitation.createdAt, 'dd/MM/yy')}</TableCell>
                            <TableCell>{invitation.emailAddress}</TableCell>
                            <TableCell>
                                {invitation.status === 'pending' && (
                                    <X size={16} onClick={() => onRevokeHandler(invitation.id)} className="cursor-pointer" />
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}

export default TableStatusInvitations;
