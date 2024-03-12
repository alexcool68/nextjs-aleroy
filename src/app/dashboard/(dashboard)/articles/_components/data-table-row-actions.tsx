'use client';

import React from 'react';

import { useMutation } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';

import { MoreHorizontal } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';

interface DataTableRowActions {
    itemId: Id<'articles'>;
    isPublished: boolean | undefined;
}

export function DataTableRowActions<TData>({ itemId, isPublished }: DataTableRowActions) {
    const toggleIsPublished = useMutation(api.articles.toggleIsPublished);
    const deleteArticle = useMutation(api.articles.deleteArticle);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => toggleIsPublished({ articleId: itemId })}>{isPublished ? 'Unpublish' : 'Publish'}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View article</DropdownMenuItem>
                <DropdownMenuItem>Edit article</DropdownMenuItem>
                <DropdownMenuItem onClick={() => deleteArticle({ articleId: itemId })}>Delete article</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
