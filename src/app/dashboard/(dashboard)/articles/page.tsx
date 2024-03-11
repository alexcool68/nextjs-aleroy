'use client';

import React from 'react';

import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';

import TitleHeader from '../../_components/title-header';
import { Button } from '@/components/ui/button';
import { NotebookText, Plus, Trash } from 'lucide-react';
import Link from 'next/link';
import NoDataFound from '@/components/no-data-found';

export default function ArticlesDashboard() {
    const articles = useQuery(api.articles.getArticles, { deletedOnly: false });
    return (
        <>
            <div className="md:p-5">
                <TitleHeader title="Articles">
                    <div className="flex flex-row items-center justify-end gap-2">
                        <Button variant={'secondary'} size={'sm'} asChild>
                            <Link href="/dashboard/articles/add">
                                <Plus className="w-4 h-4 lg:mr-2" />
                                <span className="hidden lg:block">Add</span>
                            </Link>
                        </Button>
                        <Button variant={'secondary'} size={'sm'} asChild>
                            <Link href="/dashboard/articles/trash">
                                <Trash className="w-4 h-4 lg:mr-2" />
                                <span className="hidden lg:block">Trash</span>
                            </Link>
                        </Button>
                    </div>
                </TitleHeader>

                {articles?.length === 0 && <NoDataFound icon={<NotebookText className="size-10 mr-5" />} text="No articles found" />}

                {articles && articles.map((article) => <p key={article._id}>{article.title}</p>)}
            </div>
        </>
    );
}
