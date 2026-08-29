import express, { Router } from 'express';
import { alertController } from '../controllers/alertController';
import { authenticate } from '../middleware/auth';

const router: Router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Alert routes
router.get('/unread', alertController.getUnread);
router.patch('/:id/read', alertController.markAsRead);

export default router;
