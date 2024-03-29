import { ConvexError, v } from 'convex/values';
import { getUser } from './users';
import { Doc } from './_generated/dataModel';
import { mutation, query } from './_generated/server';

import urlSlug from 'url-slug';

import { v4 } from 'uuid';

export const createArticle = mutation({
    args: {
        title: v.string(),
        imgId: v.optional(v.id('_storage')),
        content: v.string(),
        categories: v.optional(v.array(v.id('categories'))),
        isPublished: v.optional(v.boolean())
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

        const articleId = await ctx.db.insert('articles', {
            title: args.title,
            imgId: args.imgId,
            slug: urlSlug(v4() + args.title),
            content: args.content,
            shouldDelete: false,
            isPublished: args.isPublished ?? false,
            userId: user._id
        });
        if (args.categories) {
            await ctx.db.patch(articleId, {
                categories: args.categories
            });
        }
    }
});

export const getArticles = query({
    args: {
        deletedOnly: v.optional(v.boolean()),
        publishedOnly: v.optional(v.boolean()),
        lastFiveOnly: v.optional(v.boolean())
    },
    async handler(ctx, args) {
        let articles = await ctx.db.query('articles').order('desc').collect();

        if (args.deletedOnly) {
            articles = articles.filter((article) => article.shouldDelete);
        } else {
            articles = articles.filter((article) => !article.shouldDelete);
        }

        if (args.publishedOnly) {
            articles = articles.filter((article) => article.isPublished);
        }

        if (args.lastFiveOnly) {
            articles = articles.slice(0, 5);
        }

        if (!articles) {
            return [];
        }

        return Promise.all(
            articles.map(async (article) => ({
                ...article,
                ...(article.imgId !== undefined
                    ? {
                          imgUrl: await ctx.storage.getUrl(article.imgId)
                      }
                    : {})
            }))
        );
    }
});

export const getArticleBySlug = query({
    args: {
        slug: v.string()
    },
    async handler(ctx, args) {
        const article = await ctx.db
            .query('articles')
            .withIndex('by_slug', (q) => q.eq('slug', args.slug))
            .unique();

        if (!article) {
            return null;
        }

        let imageUrl;

        if (article.imgId !== undefined) {
            imageUrl = await ctx.storage.getUrl(article.imgId);
        }

        return { article: article, imgUrl: imageUrl };
    }
});

export const restoreArticle = mutation({
    args: {
        articleId: v.id('articles')
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

        const article = await ctx.db.get(args.articleId);

        if (!article) {
            return null;
        }

        await ctx.db.patch(args.articleId, {
            shouldDelete: false
        });
    }
});

export const deleteArticle = mutation({
    args: {
        articleId: v.id('articles')
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

        const article = await ctx.db.get(args.articleId);

        if (!article) {
            return null;
        }

        assertCanDeleteArticle(user, article);

        await ctx.db.patch(args.articleId, {
            shouldDelete: true
        });
    }
});

export const toggleIsPublished = mutation({
    args: {
        articleId: v.id('articles')
    },
    handler: async (ctx, args) => {
        const article = await ctx.db.get(args.articleId);

        if (!article) {
            return null;
        }

        await ctx.db.patch(args.articleId, {
            isPublished: !article.isPublished
        });
    }
});

function assertCanDeleteArticle(user: Doc<'users'>, article: Doc<'articles'>) {
    const canDelete = article.userId === user._id;

    if (user.role !== 'superadmin') {
        throw new ConvexError('you have not the correct role');
    }

    if (!canDelete) {
        throw new ConvexError('you are not the same author');
    }
}
