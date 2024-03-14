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

import NoDataFound from '@/components/no-data-found';

export default function Home() {
    const articles = useQuery(api.articles.getArticles, { deletedOnly: false, publishedOnly: true });

    return (
        <main className="container mx-auto pt-4 min-h-screen border-l border-r">
            <div className="border rounded-lg p-8">
                <div className="">Last articles :</div>

                {articles && articles.length === 0 && <NoDataFound />}

                <div className="mt-5 flex flex-col gap-10 justify-center items-stretch lg:flex-row lg:justify-evenly lg:gap-16">
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
                </div>
            </div>
        </main>
    );
}
