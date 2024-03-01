import { v, ConvexError } from 'convex/values';
import { MutationCtx, QueryCtx, mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';
import { getUser } from './users';

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
