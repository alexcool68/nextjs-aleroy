import { Doc } from './_generated/dataModel';
import { internalMutation, mutation, query } from './_generated/server';
import { getUser } from './users';
import { ConvexError, v } from 'convex/values';

export const createVideo = mutation({
    args: {
        title: v.string(),
        link: v.string()
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
