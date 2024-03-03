'use client';

import Link from 'next/link';

import { useMutation, useQuery } from 'convex/react';
import { Button } from '@/components/ui/button';

import { ArrowLeftFromLineIcon, Film, Undo2Icon } from 'lucide-react';
import { api } from '../../../../../convex/_generated/api';

export default function DebridTrashDashboard() {
    const videos = useQuery(api.videos.getVideos, { deletedOnly: true });
    const restaureVideo = useMutation(api.videos.restoreVideo);

    return (
        <>
            <div className="p-5">
                <div className="flex flex-row justify-between items-center border-b pb-5">
                    <h1 className="text-xl lg:text-3xl font-medium tracking-wider"># Debrideur</h1>
                    <Button variant={'secondary'} size={'sm'} asChild>
                        <Link href="/dashboard/debrid" className="flex items-center h-8">
                            <ArrowLeftFromLineIcon className="w-4 h-4 mr-2" /> Back
                        </Link>
                    </Button>
                </div>

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
                                <Button size={'sm'} variant={'outline'} onClick={() => restaureVideo({ videoId: video._id })}>
                                    <Undo2Icon className="size-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );
}
