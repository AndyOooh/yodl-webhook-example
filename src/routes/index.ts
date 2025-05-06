import { Router } from 'express';

import healthCheckRoutes from './health.routes';
import webhookRoutes from './webhook.routes';
import validatePaymentRoutes from './validate-payment.route';

const router = Router();

// Mount routes
router.use('/health', healthCheckRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/validate-payment', validatePaymentRoutes);

export default router;
