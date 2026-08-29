import express, { Router } from 'express';
import { dealController } from '../controllers/dealController';
import { authenticate, authorize } from '../middleware/auth';
import Joi from 'joi';
import { validateRequest } from '../middleware/validation';

const router: Router = express.Router();

const createDealSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  value: Joi.number().required(),
  status: Joi.string().valid('prospecting', 'qualified', 'negotiating', 'won', 'lost').required(),
  client_name: Joi.string().required(),
  expected_close_date: Joi.date().required(),
  probability: Joi.number().min(0).max(100).required(),
});

const updateDealSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  value: Joi.number().optional(),
  status: Joi.string().valid('prospecting', 'qualified', 'negotiating', 'won', 'lost').optional(),
  client_name: Joi.string().optional(),
  expected_close_date: Joi.date().optional(),
  probability: Joi.number().min(0).max(100).optional(),
});

// Apply authentication middleware to all routes
router.use(authenticate);

// Deal routes
router.post('/', validateRequest(createDealSchema), dealController.create);
router.get('/', dealController.list);
router.get('/pipeline', dealController.getPipeline);
router.get('/:id', dealController.get);
router.patch('/:id', validateRequest(updateDealSchema), dealController.update);
router.delete('/:id', dealController.delete);

export default router;
