import createHttpError from 'http-errors';
import { PaymentResponse } from '../types/payment.js';

export async function fetchPayment(txHash: string): Promise<PaymentResponse> {
  const response = await fetch(`${process.env.YODL_INDEXER_URL}/payments/${txHash}`);

  if (!response.ok) {
    throw createHttpError(response.status, response.statusText);
  }

  return await response.json();
}
