import { Router } from 'express';
import createHttpError from 'http-errors';
import { asyncHandler } from '../../middleware/asyncHandler';
import { fetchPayment } from '../../services/payment.service';

const router = Router();

/**
 * Validates a payment transaction against expected parameters
 *
 * @route POST /api/validate-payment
 * @description Fetches payment details from Yodl indexer API and validates against request parameters
 *
 * @param {string} req.body.txHash - The transaction hash of the payment
 * @param {number} [req.body.paymentIndex] - The index of the payment in the transaction (defaults to 0)
 * @param {string[]} req.body.acceptedTokens - The list of tokens that are accepted for payment
 * @param {number} req.body.expectedAmount - The expected amount of the payment
 *
 * @returns {Response} 200 - Payment validated successfully with payment details
 * @returns {Response} 400 - Invalid payment (wrong token or amount)
 * @returns {Response} 500 - Server error during verification
 */
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { txHash, paymentIndex, acceptedTokens, expectedAmount } = req.body;

    if (!txHash || !acceptedTokens || !expectedAmount) throw createHttpError(400, 'Missing required fields');

    try {
      const result = await fetchPayment(txHash);
      const payment = result.yodlPayments[paymentIndex || 0];

      // Validate token is in approved list
      if (!acceptedTokens.includes(payment.tokenIn.yodlConfig.symbol)) {
        return res.status(400).json({ error: 'Payment token not in approved list' });
      }

      const amountPaid = payment.tokenOutGross; // Amount before fees

      // Validate amount paid is equal or greater than expected
      if (amountPaid < expectedAmount) {
        return res.status(400).json({ error: 'Payment amount less than expected' });
      }

      res.status(200).json({ message: 'Payment validated successfully', payment });
    } catch (error) {
      res.status(500).json({ error: 'Verification failed' });
    }
  })
);

export default router;
