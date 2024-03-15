'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

import NoDataFound from '@/components/no-data-found';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function articlePage({ params }: { params: { slug: string } }) {
    const article = useQuery(api.articles.getArticleBySlug, { slug: params.slug });

    if (article === null) {
        throw new Error('Article not found');
    }

    return (
        <>
            <div className="container mx-auto p-8">
                {article && (
                    <div className="flex flex-col items-center justify-start gap-10">
                        <h1 className="text-7xl items-center text-center">{article.title}</h1>
                        <p className="">{article.content}</p>
                        <Button variant={'default'} asChild>
                            <Link href="/">Back</Link>
                        </Button>
                    </div>
                )}

                {/* {article === undefined && <NoDataFound />} */}
            </div>
        </>
    );
}
