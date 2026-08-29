import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

export const userController = {
  async register(req: Request, res: Response) {
    try {
      const { email, name, password, role } = req.body;
      const result = await userService.register(email, name, password, role);
      res.status(201).json(result);
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      res.json(result);
    } catch (error: any) {
      throw new AppError(error.message, 401);
    }
  },

  async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await userService.getUser(req.user.userId);
      res.json(user);
    } catch (error: any) {
      throw new AppError(error.message, 404);
    }
  },

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const user = await userService.updateUser(req.user.userId, req.body);
      res.json(user);
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }
  },
};
