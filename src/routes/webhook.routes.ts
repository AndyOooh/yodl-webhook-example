import { Router } from "express";

const router = Router();

// POST /api/webhooks
router.post("/", (req, res) => {
  // TOOD:
  // Verify signature
  // Fetch payment
  // Verify payment (data to valudate against)

  res.json({ message: "Webhook endpoint is ready" });
});

export default router;
