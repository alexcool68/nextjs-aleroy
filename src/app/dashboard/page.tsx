'use client';

import { useState } from 'react';
import { formatDistance } from 'date-fns';
import { api } from '../../../convex/_generated/api';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQuery } from 'convex/react';
import validator from 'validator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// const API_KEY = 'SStOONRiC8fdyLczg14y';

export default function Dashboard() {
    const { toast } = useToast();
    const [link, setLink] = useState<string>('');
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const createVideo = useMutation(api.videos.createVideo);
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
            createVideo({
                title: data.data.filename,
                link: data.data.link
            });
            setLink('');
        }

        setIsFetching(false);
    };

    return (
        <div className="p-5">
            <form onSubmit={handleSubmit} className="flex flex-row gap-5 space-x-5 my-5">
                <Input
                    name="link"
                    placeholder="https://1fichier.com/?xyz"
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                    disabled={isFetching}
                />
                <Button type="submit" disabled={isFetching}>
                    Debrider
                </Button>
            </form>

            {videos &&
                videos.map((video) => (
                    <div key={video._id} className="flex items-center justify-between gap-5 h-10">
                        <span>{formatDistance(video._creationTime, new Date(), { addSuffix: true })}</span>
                        <span>{video.title}</span>
                        <Button size={'sm'} asChild>
                            <a href={video.link}>Download</a>
                        </Button>
                    </div>
                ))}
        </div>
    );
}
