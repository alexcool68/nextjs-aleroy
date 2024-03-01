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
        title: v.string(),
        userId: v.id('users'),
        link: v.string(),
        shouldDelete: v.optional(v.boolean())
    })
        .index('by_userId', ['userId'])
        .index('by_shouldDelete', ['shouldDelete']),
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
        orgIds: v.array(
            v.object({
                orgId: v.string(),
                role: roles
            })
        )
    }).index('by_tokenIdentifier', ['tokenIdentifier'])
});
