import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { getInvitationList, revokeInvitation } from '@/server/clerck-backend';
import { InvitationStatus, Invitation as typeInvitation } from '@clerk/backend';
import { Calendar, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
            <h3 className="text-sm text-muted-foreground flex items-center gap-2 my-2 px-2">
                <Calendar size={16} />
                Invitations status (latest {MAX_ELEMENTS})
            </h3>

            {/* <ToggleGroup
                type="single"
                defaultValue="accepted"
                onValueChange={(e: InvitationStatus) => setQuery(e)}
                size={'sm'}
                value={query}
                variant={'outline'}
                className=""
            >
                <ToggleGroupItem value="accepted" aria-label="Toggle accepted">
                    Accepted
                </ToggleGroupItem>
                <ToggleGroupItem value="pending" aria-label="Toggle pending">
                    Pending
                </ToggleGroupItem>
                <ToggleGroupItem value="revoked" aria-label="Toggle revoked">
                    Revoked
                </ToggleGroupItem>
            </ToggleGroup> */}

            <div className="px-2 py-1">
                <div className="flex items-center justify-center gap-2 cursor-pointer">
                    <Badge variant={query === 'accepted' ? 'default' : 'secondary'} onClick={() => setQuery('accepted')}>
                        Accepted
                    </Badge>
                    <Badge variant={query === 'pending' ? 'default' : 'secondary'} onClick={() => setQuery('pending')}>
                        Pending
                    </Badge>
                    <Badge variant={query === 'revoked' ? 'default' : 'secondary'} onClick={() => setQuery('revoked')}>
                        Revoked
                    </Badge>
                </div>
            </div>

            {data.length === 0 && (
                <div className="py-4">
                    <div className="text-center text-sm">No data</div>
                </div>
            )}

            <div className="py-1">
                {data.slice(0, MAX_ELEMENTS).map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-start gap-2 border-b h-10 last:border-0 px-2 text-sm">
                        <div className="text-muted">{format(invitation.createdAt, 'dd/MM/yy')}</div>
                        <div>{invitation.emailAddress}</div>
                        <div>
                            {invitation.status === 'pending' && (
                                <X size={16} onClick={() => onRevokeHandler(invitation.id)} className="cursor-pointer" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default TableStatusInvitations;
