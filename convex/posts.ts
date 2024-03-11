import { mutation, query } from './_generated/server';
import { getUser } from './users';
import { v } from 'convex/values';

export const createPost = mutation({
    args: {
        title: v.string(),
        content: v.string()
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

        await ctx.db.insert('posts', {
            title: args.title,
            slug: args.title,
            content: args.content,
            shouldDelete: false,
            userId: user._id
        });
    }
});

export const getPosts = query({
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
        let posts = await ctx.db.query('posts').collect();

        if (args.deletedOnly) {
            posts = posts.filter((post) => post.shouldDelete);
        } else {
            posts = posts.filter((post) => !post.shouldDelete);
        }

        return posts;
    }
});

export const getPostBySlug = query({
    args: {
        slug: v.string()
    },
    async handler(ctx, args) {
        const post = await ctx.db
            .query('posts')
            .withIndex('by_slug', (q) => q.eq('slug', args.slug))
            .unique();

        return post;
    }
});
