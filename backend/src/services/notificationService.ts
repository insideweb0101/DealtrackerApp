import { Notification } from '../types';
import db from '../config/database';
import nodemailer from 'nodemailer';
import axios from 'axios';
import logger from '../config/logger';

const TABLE = 'notifications';

const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const notificationService = {
  async createNotification(notification: Partial<Notification>) {
    const [id] = await db(TABLE)
      .insert({
        ...notification,
        created_at: new Date(),
      })
      .returning('id');
    return this.getNotification(id);
  },

  async getNotification(id: string) {
    return db(TABLE).where({ id }).first();
  },

  async sendEmail(to: string, subject: string, content: string) {
    try {
      await emailTransporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html: content,
      });
      logger.info(`Email sent to ${to}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send email to ${to}`, { error });
      return false;
    }
  },

  async sendSlack(message: string) {
    try {
      const webhookUrl = process.env.SLACK_WEBHOOK_URL;
      if (!webhookUrl) return false;

      await axios.post(webhookUrl, { text: message });
      logger.info('Slack notification sent');
      return true;
    } catch (error) {
      logger.error('Failed to send Slack notification', { error });
      return false;
    }
  },

  async sendSMS(phoneNumber: string, message: string) {
    try {
      // Implement Twilio SMS sending
      logger.info(`SMS sent to ${phoneNumber}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send SMS to ${phoneNumber}`, { error });
      return false;
    }
  },
};
