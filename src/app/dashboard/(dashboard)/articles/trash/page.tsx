'use client';

import Link from 'next/link';

import { useMutation, useQuery } from 'convex/react';
import { Button } from '@/components/ui/button';

import { ArrowLeftFromLineIcon, NotebookText, Undo2Icon } from 'lucide-react';
import { api } from '../../../../../../convex/_generated/api';

import TitleHeader from '@/app/dashboard/_components/title-header';
import NoDataFound from '@/components/no-data-found';

export default function ArticlesTrashDashboard() {
    const articles = useQuery(api.articles.getArticles, { deletedOnly: true });
    const restaureArticle = useMutation(api.articles.restoreArticle);

    return (
        <>
            <div className="md:p-5">
                <TitleHeader title="Articles">
                    <div className="flex flex-row items-center justify-end gap-2">
                        <Button variant={'secondary'} size={'sm'} asChild>
                            <Link href="/dashboard/articles" className="flex items-center h-8">
                                <ArrowLeftFromLineIcon className="w-4 h-4 mr-2" /> Back
                            </Link>
                        </Button>
                    </div>
                </TitleHeader>

                {articles?.length === 0 && <NoDataFound icon={<NotebookText className="size-10 mr-5" />} text="No posts found" />}

                {articles &&
                    articles.map((article) => (
                        <div key={article._id} className="flex items-center justify-between gap-5 py-5 border-b">
                            <span className="truncate">{article.title}</span>

                            <div className="flex gap-2 items-center">
                                <Button size={'sm'} variant={'outline'} onClick={() => restaureArticle({ articleId: article._id })}>
                                    <Undo2Icon className="size-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );
}
