import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const roles = v.union(v.literal('superadmin'), v.literal('admin'), v.literal('member'));

export default defineSchema({
    todos: defineTable({
        title: v.string(),
        userId: v.id('users'),
        orgId: v.string(),
        shouldDelete: v.optional(v.boolean())
    })
        .index('by_orgId', ['orgId'])
        .index('by_shouldDelete', ['shouldDelete']),
    articles: defineTable({
        title: v.string(),
        slug: v.string(),
        imgId: v.optional(v.id('_storage')),
        content: v.string(),
        categories: v.optional(v.array(v.id('categories'))),
        userId: v.id('users'),
        shouldDelete: v.optional(v.boolean()),
        isPublished: v.optional(v.boolean())
    })
        .index('by_userId', ['userId'])
        .index('by_slug', ['slug'])
        .index('by_published', ['isPublished'])
        .index('by_shouldDelete', ['shouldDelete']),
    categories: defineTable({
        title: v.string(),
        slug: v.string(),
        shouldDelete: v.optional(v.boolean()),
        userId: v.id('users')
    })
        .index('by_slug', ['slug'])
        .index('by_shouldDelete', ['shouldDelete']),
    videos: defineTable({
        userId: v.id('users'),
        title: v.string(),
        link: v.string(),
        size: v.number(),
        original: v.string(),
        isOnServer: v.optional(v.boolean()),
        shouldDelete: v.optional(v.boolean()),
        verfiedAt: v.optional(v.float64())
    })
        .index('by_userId', ['userId'])
        .index('by_shouldDelete', ['shouldDelete'])
        .index('by_userId_shouldDelete', ['userId', 'shouldDelete']),
    favorites: defineTable({
        todoId: v.id('todos'),
        orgId: v.string(),
        userId: v.id('users')
    }).index('by_userId_orgId_todoId', ['userId', 'orgId', 'todoId']),
    users: defineTable({
        tokenIdentifier: v.string(),
        name: v.optional(v.string()),
        email: v.string(),
        image: v.optional(v.string()),
        role: v.optional(roles),
        orgIds: v.array(
            v.object({
                orgId: v.string(),
                role: roles
            })
        )
    }).index('by_tokenIdentifier', ['tokenIdentifier'])
});
