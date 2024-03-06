import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const roles = v.union(v.literal('admin'), v.literal('member'));

export default defineSchema({
    todos: defineTable({
        title: v.string(),
        userId: v.id('users'),
        orgId: v.string(),
        shouldDelete: v.optional(v.boolean())
    })
        .index('by_orgId', ['orgId'])
        .index('by_shouldDelete', ['shouldDelete']),
    videos: defineTable({
        userId: v.id('users'),
        title: v.string(),
        link: v.string(),
        size: v.number(),
        original: v.string(),
        isOnServer: v.optional(v.boolean()),
        shouldDelete: v.optional(v.boolean())
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
