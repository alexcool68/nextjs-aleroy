import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval('delete any old files marked for deletion', { hours: 24 }, internal.todos.deleteAllTodos);
crons.interval('delete any old video marked for deletion', { hours: 24 }, internal.videos.deleteAllVideos);

export default crons;
