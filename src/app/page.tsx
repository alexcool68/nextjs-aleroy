'use client';

import Image from 'next/image';
import { format } from 'date-fns';

import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

import { getImageUrl } from '@/lib/utils';

import { Calendar } from 'lucide-react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
    const articles = useQuery(api.articles.getArticles, { deletedOnly: false, publishedOnly: true, lastFiveOnly: true });

    return (
        <main className="container mx-auto pt-4 min-h-screen border-l border-r">
            <div className="p-8">
                {articles && articles.length >= 1 && (
                    <Carousel opts={{ align: 'center' }} className="w-full">
                        <CarouselContent>
                            {/* {Array.from({ length: 5 }).map((_, index) => ( */}
                            {articles &&
                                articles.map((article, index) => (
                                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                        <div className="p-1">
                                            <Card className="select-none">
                                                <AspectRatio ratio={16 / 9}>
                                                    {article.imgId && (
                                                        <Image
                                                            src={getImageUrl(article.imgId)}
                                                            layout="fill"
                                                            alt="Image"
                                                            className="rounded-t-lg object-cover"
                                                        />
                                                    )}
                                                </AspectRatio>
                                                <CardContent className="flex flex-col aspect-square items-start justify-between p-6 gap-2">
                                                    <div>
                                                        <div className="flex justify-start items-center text-xs lg:text-sm text-muted-foreground">
                                                            <Calendar className="h-4 w-4 mr-2" /> posted on{' '}
                                                            {format(new Date(article._creationTime), 'dd/MM/yyy')}
                                                        </div>
                                                        <span className="text-3xl font-semibold">{article.title}</span>
                                                    </div>
                                                    <div className="w-full flex flex-col justify-between lg:flex-row items-end lg:items-center gap-4">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex flex-row gap-1">
                                                                <Badge variant={'outline'}>backend</Badge>
                                                                <Badge variant={'outline'}>developpement</Badge>
                                                            </div>
                                                        </div>
                                                        <Button variant={'default'} size={'sm'} disabled>
                                                            Read
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                )}

                {/* <div className="mt-5 flex flex-col gap-10 justify-center items-stretch lg:flex-row lg:justify-evenly lg:gap-16">
                    {articles &&
                        articles.map((article) => {
                            return (
                                <div className="lg:max-w-xs flex flex-col gap-2 border-t border-primary justify-end pt-2" key={article._id}>
                                    <p className="text-lg lg:text-3xl font-semibold">{article.title}</p>
                                    <div className="flex justify-start items-center text-xs lg:text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 mr-2" /> posted on {format(new Date(article._creationTime), 'dd/MM/yyy')}
                                    </div>
                                    <AspectRatio ratio={16 / 9}>
                                        {article.imgId && (
                                            <Image src={getImageUrl(article.imgId)} layout="fill" alt="Image" className="rounded-md object-cover" />
                                        )}
                                    </AspectRatio>
                                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-row gap-1">
                                                <Badge variant={'outline'}>backend</Badge>
                                                <Badge variant={'outline'}>developpement</Badge>
                                            </div>
                                        </div>
                                        <Button variant={'link'} className="w-full" disabled>
                                            Read
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                </div> */}
            </div>
        </main>
    );
}
