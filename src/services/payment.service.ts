import createHttpError from 'http-errors';
import { TransactionResponse } from '../types/transaction.js';

export async function fetchPayment(txHash: string): Promise<TransactionResponse> {
  const response = await fetch(`${process.env.YODL_INDEXER_URL}/tx/${txHash}`);

  if (!response.ok) {
    throw createHttpError(response.status, response.statusText);
  }

  return response.json();
}
