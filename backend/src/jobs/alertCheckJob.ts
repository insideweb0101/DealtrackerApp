import Queue from 'bull';
import redis from '../config/redis';
import { alertService } from '../services/alertService';
import logger from '../config/logger';

const alertQueue = new Queue('alerts', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

// Process alert checking job
alertQueue.process(async (job) => {
  logger.info(`Processing alert check job: ${job.id}`);
  try {
    await alertService.checkAllDeals();
    logger.info('Alert check completed successfully');
    return { success: true };
  } catch (error) {
    logger.error('Error processing alert check', { error });
    throw error;
  }
});

// Schedule alert checks every 5 minutes
alertQueue.add(
  {},
  {
    repeat: {
      every: 5 * 60 * 1000, // 5 minutes
    },
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  }
);

alertQueue.on('completed', (job) => {
  logger.info(`Alert check job completed: ${job.id}`);
});

alertQueue.on('failed', (job, err) => {
  logger.error(`Alert check job failed: ${job.id}`, { error: err });
});

export default alertQueue;
