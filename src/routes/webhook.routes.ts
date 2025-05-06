import { Router } from 'express';
import createHttpError from 'http-errors';
import { Hex, isHex, verifyMessage } from 'viem';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

/* 
  POST /api/webhooks
  Description:
  - Receives webhook from Yodl
  - Verifies webhook signature
 */
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const signature = req.headers['x-yodl-signature'];

    if (!signature || !isHex(signature)) throw createHttpError(400, 'Invalid signature');

    const message = JSON.stringify(req.body);

    try {
      const isValid = await verifyMessage({
        message,
        signature,
        address: process.env.YODL_SIGNING_ADDRESS as Hex,
      });

      if (!isValid) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      const data = req.body; // data.txHash, data.chainId, data.paymentIndex

      // TODO:
      // Update Databse/send notification to frontend here
    } catch (error) {
      res.status(500).json({ error: 'Verification failed' });
    }
  })
);

export default router;
