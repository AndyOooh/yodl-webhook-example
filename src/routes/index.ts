import { Router } from "express";
import webhookRoutes from "./webhook.routes";
import healthCheckRoutes from "./health.routes";

const router = Router();

// Mount routes
router.use("/health", healthCheckRoutes);
router.use("/webhooks", webhookRoutes);

export default router;
