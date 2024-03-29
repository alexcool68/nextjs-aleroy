import Image from 'next/image';
import Link from 'next/link';

import { format } from 'date-fns';

import { useQuery } from 'convex/react';
import { Doc } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';

import { Calendar } from 'lucide-react';

import { cn, getImageUrl } from '@/lib/utils';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface articleWithImgUrl extends Doc<'articles'> {
    imgUrl?: string | null;
}

interface articleCardProps extends React.HTMLAttributes<HTMLDivElement> {
    // article: Doc<'articles'>;
    article: articleWithImgUrl;
}

export default function articleCard({ article, className }: articleCardProps) {
    return (
        <Card className={cn('w-full max-w-sm', className)}>
            {article.imgUrl && <Image src={article.imgUrl} alt={'preview image'} width={400} height={250} className="rounded-t-lg aspect-[1.6]" />}

            <CardContent className="flex flex-col aspect-square items-start justify-between px-6 py-2">
                <div>
                    <div className="flex justify-start items-center text-xs lg:text-sm text-muted-foreground mb-0.5">
                        <Calendar className="h-4 w-4 mr-2" /> posted on {format(new Date(article._creationTime), 'dd/MM/yyy')}
                    </div>
                    <span className="text-xl md:text-2xl lg:text-3xl font-semibold">{article.title}</span>
                </div>
                <div className="w-full flex flex-col justify-between lg:flex-row items-end lg:items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-1">
                        {article.categories &&
                            article.categories.map((category) => (
                                <Badge variant={'outline'} key={category}>
                                    {useQuery(api.categories.getCategoryTitleById, { id: category })}
                                </Badge>
                            ))}
                    </div>
                    <Button variant={'default'} size={'sm'} asChild>
                        <Link href={`/articles/${article.slug}`}>Read</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
