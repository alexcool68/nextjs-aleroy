import { internal } from './_generated/api';
import { Doc } from './_generated/dataModel';
import { action, internalMutation, internalQuery, mutation, query } from './_generated/server';
import { getUser } from './users';
import { ConvexError, v } from 'convex/values';

function alldebridUrl(queryString: string) {
    return 'https://api.alldebrid.com/v4/link/infos?agent=myAppName&apikey=' + process.env.ALLDEBRID_KEY + queryString;
}

export const verifyVideos = action({
    args: {},
    handler: async (ctx, args) => {
        const userVideos = await ctx.runQuery(internal.videos.getVideosInternal);

        if (!userVideos) return null;

        let videosLinkString = '';

        userVideos.map((video) => (videosLinkString += encodeURI(`&link[]=${video.original}`)));

        // Call Link Info
        const data = await fetch(alldebridUrl(videosLinkString), { method: 'GET' });

        const json = await data.json();

        if (json.status === 'error') {
            throw new Error(`Alldebrid errored: ${JSON.stringify(json)}`);
        }

        if (json.status === 'success') {
            await Promise.all(
                json.data.infos.map(async (info: any) => {
                    const isVideoAvailable = userVideos.find((el) => el.original == info.link);
                    if (!isVideoAvailable) return null;

                    await ctx.runMutation(internal.videos.setIsOnServerFalseInternal, { videoId: isVideoAvailable._id });

                    if (!info.error) {
                        await ctx.runMutation(internal.videos.updateVideoInternal, {
                            videoId: isVideoAvailable._id,
                            title: info.filename,
                            size: info.size,
                            isOnServer: true
                        });
                    }
                })
            );
        }
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
            shouldDelete: false,
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

export const getVideosInternal = internalQuery({
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
            .withIndex('by_userId_shouldDelete', (q) => q.eq('userId', user._id).eq('shouldDelete', false))
            .collect();

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

export const updateVideoInternal = internalMutation({
    args: {
        videoId: v.id('videos'),
        title: v.string(),
        size: v.number(),
        isOnServer: v.boolean()
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.videoId, {
            title: args.title,
            size: args.size,
            isOnServer: args.isOnServer
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

export const deleteAllVideosInternal = internalMutation({
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

export const setIsOnServerFalseInternal = internalMutation({
    args: {
        videoId: v.id('videos')
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.videoId, {
            isOnServer: false,
            verfiedAt: Date.now()
        });
    }
});

function assertCanDeleteVideo(user: Doc<'users'>, video: Doc<'videos'>) {
    const canDelete = video.userId === user._id;

    if (!canDelete) {
        throw new ConvexError('you have no acces to delete this video');
    }
}
