'use client';

import { useState } from 'react';
import Link from 'next/link';
import { filesize } from 'filesize';
import { formatDistance } from 'date-fns';

import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQuery } from 'convex/react';
import validator from 'validator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Film, Trash } from 'lucide-react';
import { api } from '../../../../../convex/_generated/api';

export default function DebridDashboard() {
    const { toast } = useToast();

    const [link, setLink] = useState<string>('');
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const createVideo = useMutation(api.videos.createVideo);
    const deleteVideo = useMutation(api.videos.deleteVideo);

    const videos = useQuery(api.videos.getVideos, { deletedOnly: false });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validator.isURL(link)) {
            toast({ description: 'this is not a valid url' });
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
            console.log(data.data);
            createVideo({
                title: data.data.filename,
                link: data.data.link,
                size: data.data.filesize
            });
            setLink('');
        }

        setIsFetching(false);
    };

    return (
        <>
            <div className="p-5">
                <div className="flex flex-row justify-between items-center border-b pb-5">
                    <h1 className="text-xl lg:text-3xl font-medium tracking-wider"># Debrideur</h1>
                    <Button variant={'secondary'} size={'sm'} asChild>
                        <Link href="/dashboard/debrid/trash">
                            <Trash className="w-4 h-4 mr-2" /> Trash
                        </Link>
                    </Button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-row gap-5 space-x-5 my-5">
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

                {videos?.length === 0 && (
                    <div className="flex items-center justify-center bg-background/45 border-2 border-dotted rounded-2xl my-5 py-20">
                        <div className="flex items-center text-2xl text-muted-foreground">
                            <Film className="size-10 mr-5" /> No data found
                        </div>
                    </div>
                )}

                {videos &&
                    videos.map((video) => (
                        <div key={video._id} className="flex items-center justify-between gap-5 py-5 border-b">
                            <span className="truncate">{video.title}</span>

                            <div className="flex gap-2 items-center">
                                <div className="hidden lg:flex flex-row gap-5 items-center justify-end ">
                                    <span>{filesize(video.size, { locale: 'fr' })}</span>
                                    <span className="text-foreground hidden lg:block">
                                        {formatDistance(video._creationTime, new Date(), { addSuffix: true })}
                                    </span>
                                </div>
                                <Button variant={'link'} size={'sm'} asChild>
                                    <a href={video.link}>Download</a>
                                </Button>
                                <Button size={'sm'} variant={'link'} onClick={() => deleteVideo({ videoId: video._id })}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );
}
