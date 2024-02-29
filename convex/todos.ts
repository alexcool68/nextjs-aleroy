import { v, ConvexError } from 'convex/values';
import { MutationCtx, QueryCtx, internalMutation, mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

export async function hasAccessToOrg(ctx: QueryCtx | MutationCtx, orgId: string) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
        return null;
    }

    const user = await ctx.db
        .query('users')
        .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
        .first();

    if (!user) {
        return null;
    }

    const hasAccess = user.orgIds.some((item) => item.orgId === orgId) || user.tokenIdentifier.includes(orgId);

    if (!hasAccess) {
        return null;
    }

    return { user };
}

export const createTodo = mutation({
    args: {
        name: v.string(),
        fileId: v.id('_storage'),
        orgId: v.string()
    },
    async handler(ctx, args) {
        const hasAccess = await hasAccessToOrg(ctx, args.orgId);

        if (!hasAccess) {
            throw new ConvexError('you do not have access to this org');
        }

        await ctx.db.insert('todos', {
            title: args.name,
            orgId: args.orgId,
            userId: hasAccess.user._id
        });
    }
});

export const getTodos = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string()),
        favorites: v.optional(v.boolean()),
        deletedOnly: v.optional(v.boolean())
    },
    async handler(ctx, args) {
        const hasAccess = await hasAccessToOrg(ctx, args.orgId);

        if (!hasAccess) {
            return [];
        }

        let todos = await ctx.db
            .query('todos')
            .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
            .collect();

        const query = args.query;

        if (query) {
            todos = todos.filter((todo) => todo.title.toLowerCase().includes(query.toLowerCase()));
        }

        if (args.favorites) {
            const favorites = await ctx.db
                .query('favorites')
                .withIndex('by_userId_orgId_todoId', (q) => q.eq('userId', hasAccess.user._id).eq('orgId', args.orgId))
                .collect();

            todos = todos.filter((todo) => favorites.some((favorite) => favorite.todoId === todo._id));
        }

        if (args.deletedOnly) {
            todos = todos.filter((todo) => todo.shouldDelete);
        } else {
            todos = todos.filter((todo) => !todo.shouldDelete);
        }

        // if (args.type) {
        //     todos = todos.filter((todo) => todo.type === args.type);
        // }

        return todos;
    }
});

export const deleteAllTodos = internalMutation({
    args: {},
    async handler(ctx) {
        const todos = await ctx.db
            .query('todos')
            .withIndex('by_shouldDelete', (q) => q.eq('shouldDelete', true))
            .collect();

        await Promise.all(
            todos.map(async (todo) => {
                return await ctx.db.delete(todo._id);
            })
        );
    }
});

function assertCanDeleteTodo(user: Doc<'users'>, todo: Doc<'todos'>) {
    const canDelete = todo.userId === user._id || user.orgIds.find((org) => org.orgId === todo.orgId)?.role === 'admin';

    if (!canDelete) {
        throw new ConvexError('you have no acces to delete this todo');
    }
}

export const deleteTodo = mutation({
    args: {
        todoId: v.id('todos')
    },
    async handler(ctx, args) {
        const access = await hasAccessToTodo(ctx, args.todoId);

        if (!access) {
            throw new ConvexError('no access to todo');
        }

        assertCanDeleteTodo(access.user, access.todo);

        await ctx.db.patch(args.todoId, {
            shouldDelete: true
        });
    }
});

export const restoreTodo = mutation({
    args: {
        todoId: v.id('todos')
    },
    async handler(ctx, args) {
        const access = await hasAccessToTodo(ctx, args.todoId);

        if (!access) {
            throw new ConvexError('no access to todo');
        }

        assertCanDeleteTodo(access.user, access.todo);

        await ctx.db.patch(args.todoId, {
            shouldDelete: false
        });
    }
});

export const toggleFavorite = mutation({
    args: {
        todoId: v.id('todos')
    },
    async handler(ctx, args) {
        const access = await hasAccessToTodo(ctx, args.todoId);

        if (!access) {
            throw new ConvexError('no access to todo');
        }

        const favorite = await ctx.db
            .query('favorites')
            .withIndex('by_userId_orgId_todoId', (q) => q.eq('userId', access.user._id).eq('orgId', access.todo.orgId).eq('todoId', access.todo._id))
            .first();

        if (!favorite) {
            await ctx.db.insert('favorites', {
                todoId: access.todo._id,
                userId: access.user._id,
                orgId: access.todo.orgId
            });
        } else {
            await ctx.db.delete(favorite._id);
        }
    }
});

export const getAllFavorites = query({
    args: {
        orgId: v.string()
    },
    async handler(ctx, args) {
        const hasAccess = await hasAccessToOrg(ctx, args.orgId);

        if (!hasAccess) {
            return [];
        }

        const favorites = await ctx.db
            .query('favorites')
            .withIndex('by_userId_orgId_todoId', (q) => q.eq('userId', hasAccess.user._id).eq('orgId', args.orgId))
            .collect();

        return favorites;
    }
});

async function hasAccessToTodo(ctx: QueryCtx | MutationCtx, todoId: Id<'todos'>) {
    const todo = await ctx.db.get(todoId);

    if (!todo) {
        return null;
    }

    const hasAccess = await hasAccessToOrg(ctx, todo.orgId);

    if (!hasAccess) {
        return null;
    }

    return { user: hasAccess.user, todo };
}
