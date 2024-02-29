import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval('delete any old files marked for deletion', { minutes: 2 }, internal.todos.deleteAllTodos);

export default crons;
