import { v } from 'convex/values';

import { internalMutation, mutation, query } from './_generated/server';
import { getUser } from './users';

import urlSlug from 'url-slug';

export const createCategory = mutation({
    args: {
        title: v.string()
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

        await ctx.db.insert('categories', {
            title: args.title,
            slug: urlSlug(args.title),
            shouldDelete: false,
            userId: user._id
        });
    }
});

export const getCategories = query({
    args: { deletedOnly: v.optional(v.boolean()) },
    async handler(ctx, args) {
        let categories = await ctx.db.query('categories').collect();

        if (!categories) {
            return [];
        }

        if (args.deletedOnly) {
            categories = categories.filter((category) => category.shouldDelete);
        } else {
            categories = categories.filter((category) => !category.shouldDelete);
        }

        return categories;
    }
});

export const getCategoryTitleById = query({
    args: {
        id: v.id('categories')
    },
    async handler(ctx, args) {
        const category = await ctx.db.get(args.id);

        if (!category) {
            return null;
        }

        return category.title;
    }
});

export const deleteCategory = mutation({
    args: {
        categoryId: v.id('categories')
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

        const category = await ctx.db.get(args.categoryId);

        if (!category) {
            return null;
        }

        await ctx.db.patch(args.categoryId, {
            shouldDelete: true
        });
    }
});

export const restoreCategory = mutation({
    args: {
        categoryId: v.id('categories')
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

        const category = await ctx.db.get(args.categoryId);

        if (!category) {
            return null;
        }

        await ctx.db.patch(args.categoryId, {
            shouldDelete: false
        });
    }
});

// INTERNAL

export const deleteAllCategoriesInternal = internalMutation({
    args: {},
    async handler(ctx) {
        const categories = await ctx.db
            .query('categories')
            .withIndex('by_shouldDelete', (q) => q.eq('shouldDelete', true))
            .collect();

        await Promise.all(
            categories.map(async (category) => {
                return await ctx.db.delete(category._id);
            })
        );
    }
});
