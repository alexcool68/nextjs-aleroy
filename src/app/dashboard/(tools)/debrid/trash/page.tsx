'use client';

import Link from 'next/link';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { ArrowLeftFromLineIcon, Undo2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import TitleHeader from '@/app/dashboard/_components/title-header';
import NoDataFound from '@/components/no-data-found';

export default function DebridTrashDashboard() {
    const videos = useQuery(api.videos.getVideos, { deletedOnly: true });
    const restaureVideo = useMutation(api.videos.restoreVideo);

    return (
        <>
            <div className="md:p-5">
                <TitleHeader title="Debrid">
                    <div className="flex flex-row items-center justify-end gap-2">
                        <Button variant={'secondary'} size={'sm'} asChild>
                            <Link href="/dashboard/debrid" className="flex items-center h-8">
                                <ArrowLeftFromLineIcon className="w-4 h-4 mr-2" /> Back
                            </Link>
                        </Button>
                    </div>
                </TitleHeader>

                {videos?.length === 0 && <NoDataFound />}

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
