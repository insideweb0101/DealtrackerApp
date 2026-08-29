import { dealModel } from '../models/Deal';
import { alertModel } from '../models/Alert';
import { Deal, Alert } from '../types';
import logger from '../config/logger';

export const alertService = {
  /**
   * Check all deals for alert conditions
   */
  async checkAllDeals() {
    try {
      const deals = await dealModel.findAll();
      logger.info(`Checking ${deals.length} deals for alerts`);

      for (const deal of deals) {
        await this.checkDeal(deal);
      }
    } catch (error) {
      logger.error('Error checking deals', { error });
    }
  },

  /**
   * Check a specific deal for alert conditions
   */
  async checkDeal(deal: Deal) {
    const alerts = [];

    // Check for approaching deadline
    const closingDate = new Date(deal.expected_close_date);
    const daysUntilClose = Math.ceil((closingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    if (daysUntilClose <= 7 && daysUntilClose > 0 && deal.status !== 'won' && deal.status !== 'lost') {
      alerts.push({
        type: 'approaching_deadline',
        message: `Deal "${deal.title}" closing in ${daysUntilClose} days`,
        severity: daysUntilClose <= 1 ? 'critical' : 'high',
      });
    }

    // Check for stalled deals (no updates in 7 days)
    const lastUpdate = new Date(deal.updated_at);
    const daysSinceUpdate = Math.ceil((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceUpdate > 7 && deal.status !== 'won' && deal.status !== 'lost') {
      alerts.push({
        type: 'stalled',
        message: `Deal "${deal.title}" has not been updated for ${daysSinceUpdate} days`,
        severity: 'medium',
      });
    }

    // Check for low probability deals
    if (deal.probability < 20 && deal.status === 'prospecting') {
      alerts.push({
        type: 'anomaly',
        message: `Deal "${deal.title}" has low probability (${deal.probability}%)`,
        severity: 'low',
      });
    }

    // Create alerts in database
    for (const alertData of alerts) {
      const existingAlert = await alertModel.findByDealId(deal.id);
      const isDuplicate = existingAlert.some(
        (a) => a.type === alertData.type && !a.is_read
      );

      if (!isDuplicate) {
        await alertModel.create({
          deal_id: deal.id,
          ...alertData,
        } as Partial<Alert>);
      }
    }
  },

  /**
   * Get unread alerts for a user
   */
  async getUnreadAlerts(userId: string) {
    return alertModel.findUnread(userId);
  },

  /**
   * Mark alert as read
   */
  async markAsRead(alertId: string) {
    return alertModel.markAsRead(alertId);
  },
};
