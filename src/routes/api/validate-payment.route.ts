import { Router } from 'express';
import createHttpError from 'http-errors';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validatePayment } from '../../services/payment-validation.service';

const router = Router();

/**
 * Validates a payment transaction against expected parameters
 *
 * @route POST /api/validate-payment
 * @description Fetches payment details from Yodl indexer API and validates against request parameters
 *
 * @warning This endpoint assumes that all tokens in acceptedTokens are pegged to the same currency
 * as the expectedAmount. For example, if expectedAmount is in USD, all acceptedTokens should be
 * USD-pegged stablecoins.
 *
 * @param {string} req.body.txHash - The transaction hash of the payment
 * @param {number} [req.body.paymentIndex] - The index of the payment in the transaction (defaults to 0)
 * @param {string[]} req.body.acceptedTokens - The list of tokens that are accepted for payment
 * @param {number} req.body.expectedAmount - The expected amount of the payment
 * @param {string} req.body.receiverEnsOrAddress - The ENS name or address of the receiver
 *
 * @returns {Response} 200 - Payment validated successfully with payment details
 * @returns {Response} 400 - Invalid payment (wrong token or amount)
 * @returns {Response} 500 - Server error during verification
 */
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { txHash, acceptedTokens, expectedAmount, receiverEnsOrAddress } = req.body;

    if (!txHash || !acceptedTokens || !expectedAmount) throw createHttpError(400, 'Missing required fields');

    try {
      const validation = await validatePayment(txHash, {
        acceptedTokens,
        expectedAmount,
        receiverEnsOrAddress,
      });

      if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
      }

      res.status(200).json({ message: 'Payment validated successfully', payment: validation.payment });
    } catch (error) {
      res.status(500).json({ error: 'Verification failed' });
    }
  })
);

export default router;
