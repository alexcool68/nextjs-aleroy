'use client';

import { useState } from 'react';

import Link from 'next/link';

import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { cn, truncateLongString, validateVideoLinkRegex } from '@/lib/utils';

import { formatDistance } from 'date-fns';
import { filesize } from 'filesize';
import { fr } from 'date-fns/locale';
import validator from 'validator';

import { CircleDashed, RefreshCcw, Trash } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import NoDataFound from '@/components/no-data-found';

import TitleHeader from '@/app/dashboard/_components/title-header';

export default function DebridDashboard() {
    const { toast } = useToast();

    const [link, setLink] = useState<string>('');
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isVerifying, setIsVerifying] = useState<boolean>(false);

    const createVideo = useMutation(api.videos.createVideo);
    const deleteVideo = useMutation(api.videos.deleteVideo);
    const verifyVideo = useAction(api.videos.verifyVideos);

    const videos = useQuery(api.videos.getVideos, { deletedOnly: false });

    const notTrashedVideo = videos && videos.length === 0 ? true : false;

    const handleVerify = async (item: any) => {
        setIsVerifying(true);

        try {
            await verifyVideo().then(() => setIsVerifying(false));
        } catch (err) {
            console.log(err);
            setIsVerifying(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const valideVideoLink = validateVideoLinkRegex(link);

        if (!validator.isURL(link)) {
            toast({ description: 'this is not a valid url' });
        }

        if (valideVideoLink === null) {
            toast({ description: 'this is not a 1fichier.com domain' });
            return null;
        }

        setIsFetching(true);

        const response = await fetch(
            `https://api.alldebrid.com/v4/link/unlock?agent=myAppName&apikey=${process.env.NEXT_PUBLIC_ALLDEBRID_KEY}&link=${encodeURI(link)}`,
            {
                method: 'GET'
            }
        );

        const data = await response.json();

        if (data.status === 'error') {
            toast({ description: data.error.message, variant: 'destructive' });
        }

        if (data.status === 'success') {
            createVideo({
                title: data.data.filename,
                link: data.data.link,
                original: valideVideoLink[0],
                size: data.data.filesize
            });
            setLink('');
        }

        setIsFetching(false);
    };

    return (
        <>
            <div className="md:p-5">
                <TitleHeader title="Debrid">
                    <div className="flex flex-row items-center justify-end gap-2">
                        <Button variant={'secondary'} size={'sm'} onClick={handleVerify} disabled={notTrashedVideo}>
                            <RefreshCcw className={cn('w-4 h-4 lg:mr-2', isVerifying ? 'animate-spin' : null)} />
                            <span className="hidden lg:block">Verify</span>
                        </Button>
                        <Button variant={'secondary'} size={'sm'} asChild>
                            <Link href="/dashboard/debrid/trash">
                                <Trash className="w-4 h-4 lg:mr-2" />
                                <span className="hidden lg:block">Trash</span>
                            </Link>
                        </Button>
                    </div>
                </TitleHeader>

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-2 my-5">
                    <Input
                        name="link"
                        placeholder="https://1fichier.com/?xyz"
                        value={link}
                        onChange={(event) => setLink(event.target.value)}
                        disabled={isFetching}
                    />
                    <Button type="submit" disabled={isFetching}>
                        Debrider !
                    </Button>
                </form>

                {videos?.length === 0 && <NoDataFound />}

                <div className="flex flex-col gap-5">
                    {videos &&
                        videos.map((video) => (
                            <Card key={video._id} className="">
                                <CardHeader>
                                    <CardTitle className="flex flex-row items-center justify-start text-sm lg:text-xl">
                                        <div className="flex items-center">
                                            <CircleDashed
                                                className={cn(
                                                    '-mb-0 size-3 lg:-mb-1 mr-2 md:size-4 animate-pulse',
                                                    video.isOnServer ? 'text-sky-500' : 'text-red-500'
                                                )}
                                            />
                                            <div className="hidden md:flex">{video.title}</div>
                                            <div className="md:hidden"> {truncateLongString(video.title, 25)}</div>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-muted-foreground text-sm">Size : {filesize(video.size, { locale: 'fr' })}</div>
                                    <div className="text-muted-foreground text-sm">
                                        Last check :{' '}
                                        {video.verfiedAt
                                            ? formatDistance(new Date(video.verfiedAt), new Date(), { locale: fr, addSuffix: true })
                                            : 'not verified'}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant={'secondary'} size={'sm'} asChild>
                                        <a href={video.link}>Download</a>
                                    </Button>
                                    <Button variant={'outline'} size={'sm'} onClick={() => deleteVideo({ videoId: video._id })}>
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                </div>
            </div>
        </>
    );
}
