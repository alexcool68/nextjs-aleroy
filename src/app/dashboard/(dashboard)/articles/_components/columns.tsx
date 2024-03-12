'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Doc } from '../../../../../../convex/_generated/dataModel';

import { cn } from '@/lib/utils';

import { CheckCircle } from 'lucide-react';

import { DataTableRowActions } from './data-table-row-actions';
import { DataTableColumnHeader } from './data-table-colum-header';

export const columns: ColumnDef<Doc<'articles'>>[] = [
    {
        accessorKey: 'isPublished',
        header: '',
        cell: ({ row }) => (
            <div className="flex w-[18px] items-center">
                <CheckCircle className={cn('w-4 h-4', row.original.isPublished ? 'text-primary' : 'text-muted')} />
            </div>
        ),
        enableHiding: false,
        enableSorting: false
    },
    {
        accessorKey: 'title',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">{row.getValue('title')}</span>
                </div>
            );
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            return <DataTableRowActions itemId={row.original._id} isPublished={row.original.isPublished} />;
        }
    }
];
