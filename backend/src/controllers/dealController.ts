import { Request, Response } from 'express';
import { dealService } from '../services/dealService';
import { AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

export const dealController = {
  async create(req: AuthRequest, res: Response) {
    try {
      const deal = await dealService.createDeal({
        ...req.body,
        owner_id: req.user.userId,
      });
      res.status(201).json(deal);
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }
  },

  async get(req: AuthRequest, res: Response) {
    try {
      const deal = await dealService.getDeal(req.params.id);
      if (!deal) throw new AppError('Deal not found', 404);
      res.json(deal);
    } catch (error: any) {
      throw new AppError(error.message, 404);
    }
  },

  async list(req: AuthRequest, res: Response) {
    try {
      const { status } = req.query;
      const deals = await dealService.getDealsByOwner(
        req.user.userId,
        status as string | undefined
      );
      res.json(deals);
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }
  },

  async update(req: AuthRequest, res: Response) {
    try {
      const deal = await dealService.updateDeal(req.params.id, req.body);
      res.json(deal);
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }
  },

  async delete(req: AuthRequest, res: Response) {
    try {
      await dealService.deleteDeal(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }
  },

  async getPipeline(req: AuthRequest, res: Response) {
    try {
      const pipeline = await dealService.calculatePipeline();
      res.json(pipeline);
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }
  },
};
