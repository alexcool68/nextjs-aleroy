'use client';

import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

import ArticleCard from './_components/article-card';

export default function Home() {
    const articles = useQuery(api.articles.getArticles, { deletedOnly: false, publishedOnly: true, lastFiveOnly: true });

    return (
        <main className="container mx-auto pt-4 min-h-screen border-l border-r">
            <div className="p-8">
                {articles && articles.length > 0 && (
                    <Carousel opts={{ align: 'center' }}>
                        <CarouselContent>
                            {articles &&
                                articles.map((article, index) => (
                                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                        <div className="p-1">
                                            <ArticleCard article={article} className="select-none" />
                                        </div>
                                    </CarouselItem>
                                ))}
                        </CarouselContent>
                        <CarouselPrevious variant={'default'} />
                        <CarouselNext variant={'default'} />
                    </Carousel>
                )}
            </div>
        </main>
    );
}
