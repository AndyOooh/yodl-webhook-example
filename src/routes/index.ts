import { Router } from 'express';

import healthCheckRoutes from './health.routes';
import webhookRoutes from './api/webhook.routes';
import validatePaymentRoutes from './api/validate-payment.route';

const router = Router();

router.use('/health', healthCheckRoutes);
router.use('/api/webhook', webhookRoutes);
router.use('/api/validate-payment', validatePaymentRoutes);

router.use('/', (req, res) => {
  res.status(404).json({ status: 404, message: 'No endpoint matches the requested url' });
});

export default router;
