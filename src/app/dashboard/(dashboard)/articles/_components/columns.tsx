'use client';

import { format } from 'date-fns';

import { ColumnDef } from '@tanstack/react-table';

import { Doc } from '../../../../../../convex/_generated/dataModel';

import { cn } from '@/lib/utils';

import { CheckCircle } from 'lucide-react';

import { DataTableRowActions } from './data-table-row-actions';
import { DataTableColumnHeader } from './data-table-colum-header';

export const columns: ColumnDef<Doc<'articles'>>[] = [
    {
        accessorKey: 'title',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">{row.getValue('title')}</span>
                </div>
            );
        },
        enableHiding: true,
        enableSorting: false
    },
    {
        id: '_creationTime',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created at" />,
        cell: ({ row }) => {
            return <div>{format(row.original._creationTime, 'dd/MM/yyy')}</div>;
        },
        enableHiding: true,
        enableSorting: false
    },
    {
        accessorKey: 'isPublished',
        header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
        cell: ({ row }) => (
            <div>
                <CheckCircle className={cn('w-4 h-4', row.original.isPublished ? 'text-primary' : 'text-muted')} />
            </div>
        ),
        enableHiding: false,
        enableSorting: true
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            return <DataTableRowActions itemId={row.original._id} isPublished={row.original.isPublished} />;
        },
        enableHiding: false,
        enableSorting: false
    }
];
