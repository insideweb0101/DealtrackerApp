import Queue from 'bull';
import logger from '../config/logger';
import { notificationService } from '../services/notificationService';

const notificationQueue = new Queue('notifications', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

// Process email notifications
notificationQueue.process('email', async (job) => {
  logger.info(`Sending email notification: ${job.id}`);
  try {
    const { to, subject, content } = job.data;
    const success = await notificationService.sendEmail(to, subject, content);

    if (!success) {
      throw new Error('Failed to send email');
    }

    return { success: true, notificationId: job.id };
  } catch (error) {
    logger.error(`Email notification failed: ${job.id}`, { error });
    throw error;
  }
});

// Process Slack notifications
notificationQueue.process('slack', async (job) => {
  logger.info(`Sending Slack notification: ${job.id}`);
  try {
    const { message } = job.data;
    const success = await notificationService.sendSlack(message);

    if (!success) {
      throw new Error('Failed to send Slack message');
    }

    return { success: true, notificationId: job.id };
  } catch (error) {
    logger.error(`Slack notification failed: ${job.id}`, { error });
    throw error;
  }
});

// Process SMS notifications
notificationQueue.process('sms', async (job) => {
  logger.info(`Sending SMS notification: ${job.id}`);
  try {
    const { phoneNumber, message } = job.data;
    const success = await notificationService.sendSMS(phoneNumber, message);

    if (!success) {
      throw new Error('Failed to send SMS');
    }

    return { success: true, notificationId: job.id };
  } catch (error) {
    logger.error(`SMS notification failed: ${job.id}`, { error });
    throw error;
  }
});

notificationQueue.on('completed', (job) => {
  logger.info(`Notification sent successfully: ${job.id}`);
});

notificationQueue.on('failed', (job, err) => {
  logger.error(`Notification failed: ${job.id}`, { error: err });
});

export default notificationQueue;
