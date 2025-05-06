import { Router } from 'express';
import createHttpError from 'http-errors';
import { asyncHandler } from '../middleware/asyncHandler';
import { fetchPayment } from '../services/payment.service';

const router = Router();

/* 
  POST /api/validate-payment
  Description:
  - Fetches payment details from Yodl indexer API
  - Validates payment details against request body
  - Returns 200 if valid, 400 if invalid
 */
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { txHash, chainId, paymentIndex, acceptedTokens, expectedAmount } = req.body;

    // if (!txHash || !chainId || !paymentIndex || !acceptedTokens || !expectedAmount)
    if (!txHash || !acceptedTokens || !expectedAmount) throw createHttpError(400, 'Missing required fields');

    try {
      const result = await fetchPayment(txHash);

      const payment = result.yodlPayments[paymentIndex];

      // Validate token is approved
      if (!acceptedTokens.includes(payment.tokenIn.yodlConfig.symbol)) {
        console.error('Payment token not in approved list');
        return false;
      }

      // Convert payment amount to number and compare
      const amountPaid = payment.tokenOutGross; // Amount before fees
      if (amountPaid < expectedAmount) {
        console.error('Payment amount less than expected');
        return false;
      }

      return true;
    } catch (error) {
      res.status(500).json({ error: 'Verification failed' });
    }
  })
);

export default router;
