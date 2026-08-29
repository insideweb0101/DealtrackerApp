import { Request, Response } from 'express';
import { alertService } from '../services/alertService';
import { AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

export const alertController = {
  async getUnread(req: AuthRequest, res: Response) {
    try {
      const alerts = await alertService.getUnreadAlerts(req.user.userId);
      res.json(alerts);
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }
  },

  async markAsRead(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const alert = await alertService.markAsRead(id);
      res.json(alert);
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }
  },
};
