'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

import NoDataFound from '@/components/no-data-found';

function articleSlug({ params }: { params: { slug: string } }) {
    const article = useQuery(api.posts.getPostBySlug, { slug: params.slug });

    return (
        <>
            {article && (
                <div>
                    <h1 className="text-7xl items-center text-center py-5">{article.title}</h1>
                    <p className="">{article.content}</p>
                </div>
            )}

            {article === null && <NoDataFound />}
        </>
    );
}

export default articleSlug;
