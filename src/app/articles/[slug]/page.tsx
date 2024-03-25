'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { Button } from '@/components/ui/button';

export default function Page({ params }: { params: { slug: string } }) {
    const data = useQuery(api.articles.getArticleBySlug, { slug: params.slug });

    if (data?.article === null) {
        throw new Error('Article not found');
    }

    return (
        <>
            <div className="container mx-auto p-8">
                {data?.imgUrl && (
                    <div className="relative max-w-full">
                        <Image
                            src={data.imgUrl}
                            alt="article image"
                            sizes="100vh"
                            width={0}
                            height={0}
                            className="w-full max-h-64 rounded-xl opacity-65 object-cover"
                        />
                    </div>
                )}
                {data?.article && (
                    <div className="flex flex-col items-center justify-start gap-10 mt-5">
                        <h1 className="text-7xl items-center text-center">{data.article.title}</h1>

                        <div className="article article-invert article-xl" dangerouslySetInnerHTML={{ __html: data.article.content }} />

                        <Button variant={'default'} asChild>
                            <Link href="/">Back</Link>
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
