import 'dotenv/config';
import { Router } from 'express';
import createHttpError from 'http-errors';
import { Hex, isHex, verifyMessage } from 'viem';
import { asyncHandler } from '../../middleware/asyncHandler';
import { getYodlSigningAddress } from '../../services/ens.service';

const router = Router();

/**
 * Handles incoming webhooks from Yodl
 *
 * @route POST /api/webhooks
 * @description Receives and verifies webhook payloads from Yodl
 *
 * @param {string} req.headers['x-yodl-signature'] - The signature of the webhook payload
 * @param {Object} req.body - The webhook payload including txHash, chainId, paymentIndex
 *
 * @returns {Response} 200 - Webhook processed successfully
 * @returns {Response} 400 - Invalid webhook signature or payload
 * @returns {Response} 500 - Server error during processing
 */
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const signature = req.headers['x-yodl-signature'];

    if (!signature || !isHex(signature)) throw createHttpError(400, 'Invalid signature');

    const message = JSON.stringify(req.body);

    try {
      const signingAddress = await getYodlSigningAddress();

      const isValid = await verifyMessage({
        message,
        signature,
        address: signingAddress as Hex,
      });

      if (!isValid) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      // TODO (optional):
      // Update Database/send notification to frontend here

      return res.status(200).json({ message: 'Webhook received and verified', data: req.body });
    } catch (error) {
      res.status(500).json({ error: 'Verification failed' });
    }
  })
);

export default router;
