import { internal } from './_generated/api';
import { Doc } from './_generated/dataModel';
import { action, internalMutation, internalQuery, mutation, query } from './_generated/server';
import { getUser } from './users';
import { ConvexError, v } from 'convex/values';

export const updateData = internalMutation({
    args: {
        videoId: v.id('videos'),
        isOnServer: v.boolean()
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.videoId, {
            isOnServer: args.isOnServer
        });
    }
});

export const readData = internalQuery({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return null;
        }

        const user = await getUser(ctx, identity.tokenIdentifier);

        if (!user) {
            return null;
        }

        let videos = await ctx.db
            .query('videos')
            .withIndex('by_userId', (q) => q.eq('userId', user._id))
            .collect();

        return videos;
    }
});

export const verifyVideos = action({
    args: {},
    handler: async (ctx, args) => {
        const videos = await ctx.runQuery(internal.videos.readData);

        if (!videos) return null;

        let videosArray: string[] = [];
        videos.map((item) => videosArray.push(item.original));

        console.log(videosArray);
        console.log(process.env.ALLDEBRID_KEY);

        const response = await fetch(
            `https://api.alldebrid.com/v4/link/infos?agent=myAppName&apikey=${process.env.ALLDEBRID_KEY}&link[]=${videosArray}`,
            {
                method: 'GET'
            }
        );

        console.log(await response.json());

        // TODO: Finish the function
        // videos.map(async (video) => {
        //     const response = await fetch(
        //         `https://api.alldebrid.com/v4/link/infos?agent=myAppName&apikey=${process.env.NEXT_PUBLIC_ALLDEBRID_KEY}&link=${encodeURI(video.original)}`,
        //         {
        //             method: 'GET'
        //         }
        //     );

        //     const data = await response.json();

        //     if (data.status === 'success') {
        //         await ctx.runMutation(internal.videos.updateData, { videoId: video._id, isOnServer: true });
        //     }
        //     if (data.status === 'error') {
        //         await ctx.runMutation(internal.videos.updateData, { videoId: video._id, isOnServer: false });
        //     }
        // });
    }
});

export const createVideo = mutation({
    args: {
        title: v.string(),
        original: v.string(),
        link: v.string(),
        size: v.number()
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return null;
        }

        const user = await getUser(ctx, identity.tokenIdentifier);

        if (!user) {
            return null;
        }

        await ctx.db.insert('videos', {
            title: args.title,
            link: args.link,
            size: args.size,
            original: args.original,
            isOnServer: true,
            userId: user._id
        });
    }
});

export const getVideos = query({
    args: {
        deletedOnly: v.optional(v.boolean())
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return null;
        }

        const user = await getUser(ctx, identity.tokenIdentifier);

        if (!user) {
            return null;
        }
        let videos = await ctx.db
            .query('videos')
            .withIndex('by_userId', (q) => q.eq('userId', user._id))
            .collect();

        if (args.deletedOnly) {
            videos = videos.filter((video) => video.shouldDelete);
        } else {
            videos = videos.filter((video) => !video.shouldDelete);
        }

        return videos;
    }
});

export const deleteVideo = mutation({
    args: {
        videoId: v.id('videos')
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return null;
        }

        const user = await getUser(ctx, identity.tokenIdentifier);

        if (!user) {
            return null;
        }

        const video = await ctx.db.get(args.videoId);

        if (!video) {
            return null;
        }

        assertCanDeleteVideo(user, video);

        await ctx.db.patch(args.videoId, {
            shouldDelete: true
        });
    }
});

export const restoreVideo = mutation({
    args: {
        videoId: v.id('videos')
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            return null;
        }

        const user = await getUser(ctx, identity.tokenIdentifier);

        if (!user) {
            return null;
        }

        const video = await ctx.db.get(args.videoId);

        if (!video) {
            return null;
        }

        await ctx.db.patch(args.videoId, {
            shouldDelete: false
        });
    }
});

export const deleteAllVideos = internalMutation({
    args: {},
    async handler(ctx) {
        const videos = await ctx.db
            .query('videos')
            .withIndex('by_shouldDelete', (q) => q.eq('shouldDelete', true))
            .collect();

        await Promise.all(
            videos.map(async (video) => {
                return await ctx.db.delete(video._id);
            })
        );
    }
});

function assertCanDeleteVideo(user: Doc<'users'>, video: Doc<'videos'>) {
    const canDelete = video.userId === user._id;

    if (!canDelete) {
        throw new ConvexError('you have no acces to delete this video');
    }
}
