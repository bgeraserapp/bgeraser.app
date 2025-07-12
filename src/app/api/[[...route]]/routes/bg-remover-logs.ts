import { Hono } from 'hono';

import { connectDB } from '@/db';
import { BgRemoverLog } from '@/db/models';
import { HonoContext } from '@/types/hono';

import { requireAuth } from '../middleware';

const app = new Hono<HonoContext>();

// Apply authentication middleware to all routes
app.use('*', requireAuth);

// Get user's bg remover logs with pagination
app.get('/', async (c) => {
  try {
    const user = c.get('user')!;

    // Get query parameters
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const status = c.req.query('status'); // Optional filter by status
    const skip = (page - 1) * limit;

    await connectDB();

    // Build query for pagination
    const query: Record<string, unknown> = { userId: user.id };
    if (status && ['success', 'error', 'processing'].includes(status)) {
      query.status = status;
    }

    // Build query for overall statistics (all user data, no filter)
    const statsQuery: Record<string, unknown> = { userId: user.id };

    // Get logs with pagination and overall statistics
    const [logs, totalCount, allUserLogs] = await Promise.all([
      BgRemoverLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      BgRemoverLog.countDocuments(query),
      BgRemoverLog.find(statsQuery).lean(), // Get all logs for statistics
    ]);

    // Calculate statistics from all user logs
    const totalCreditsUsed = allUserLogs.reduce((sum, item) => sum + item.creditsUsed, 0);
    const completedProcesses = allUserLogs.filter((item) => item.status === 'success');
    const averageProcessingTime =
      completedProcesses.length > 0
        ? completedProcesses
            .filter((item) => item.processingTime)
            .reduce((sum, item) => sum + (item.processingTime || 0), 0) / completedProcesses.length
        : 0;

    const totalPages = Math.ceil(totalCount / limit);

    return c.json({
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        statistics: {
          totalCreditsUsed,
          totalProcesses: allUserLogs.length,
          completedProcesses: completedProcesses.length,
          errorProcesses: allUserLogs.filter((item) => item.status === 'error').length,
          processingProcesses: allUserLogs.filter((item) => item.status === 'processing').length,
          averageProcessingTime, // in milliseconds
          successRate:
            allUserLogs.length > 0 ? (completedProcesses.length / allUserLogs.length) * 100 : 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching bg remover logs:', error);
    return c.json({ error: 'Failed to fetch logs' }, 500);
  }
});

// Get a specific log by ID
app.get('/:id', async (c) => {
  try {
    const user = c.get('user')!;
    const logId = c.req.param('id');

    await connectDB();

    const log = await BgRemoverLog.findOne({
      _id: logId,
      userId: user.id,
    }).lean();

    if (!log) {
      return c.json({ error: 'Log not found' }, 404);
    }

    return c.json({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error('Error fetching bg remover log:', error);
    return c.json({ error: 'Failed to fetch log' }, 500);
  }
});

export { app as bgRemoverLogsRoute };
