'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/utils';

export default function Page({ params }: { params: { slug: string } }) {
    const article = useQuery(api.articles.getArticleBySlug, { slug: params.slug });

    if (article === null) {
        throw new Error('Article not found');
    }

    return (
        <>
            <div className="container mx-auto p-8">
                {article?.imgId && (
                    <div className="relative max-w-full">
                        <Image
                            src={getImageUrl(article?.imgId)}
                            alt="article image"
                            sizes="100vh"
                            width={0}
                            height={0}
                            className="w-full max-h-64 rounded-xl opacity-65 object-cover"
                        />
                    </div>
                )}
                {article && (
                    <div className="flex flex-col items-center justify-start gap-10 mt-5">
                        <h1 className="text-7xl items-center text-center">{article.title}</h1>

                        <div className="article article-invert article-xl" dangerouslySetInnerHTML={{ __html: article.content }} />

                        <Button variant={'default'} asChild>
                            <Link href="/">Back</Link>
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
