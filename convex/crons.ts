import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval('delete todos marked for deletion', { minutes: 5 }, internal.todos.deleteAllTodos);
crons.interval('delete videos marked for deletion', { minutes: 5 }, internal.videos.deleteAllVideosInternal);
crons.interval('delete categories marked for deletion', { minutes: 5 }, internal.categories.deleteAllCategoriesInternal);

export default crons;
