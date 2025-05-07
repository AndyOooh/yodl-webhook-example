import { normalize } from 'viem/ens';
import { YodlPayment } from '../types/payment';
import { fetchPayment } from './payment.service';
import { Hex, isAddress } from 'viem';
import { publicClient } from '../lib/publicClient';

type ValidationParams = {
  acceptedTokens: string[];
  expectedAmount: number;
  receiverEnsOrAddress: string | Hex;
};

type ValidationResult = {
  isValid: boolean;
  error?: string;
  payment?: YodlPayment;
};

export async function validatePayment(
  txHash: Hex,
  { acceptedTokens, expectedAmount, receiverEnsOrAddress }: ValidationParams
): Promise<ValidationResult> {
  // Fetch payment details from Yodl indexer
  const { payment } = await fetchPayment(txHash);

  // Fetch reciever addres if ENS
  const receiverAddress = isAddress(receiverEnsOrAddress)
    ? receiverEnsOrAddress
    : await publicClient.getEnsAddress({
        name: normalize(receiverEnsOrAddress),
      });

  if (!receiverAddress) {
    return {
      isValid: false,
      error: 'Invalid receiver address',
    };
  }

  // Match receiver address
  if (receiverAddress !== payment.receiverAddress) {
    return {
      isValid: false,
      error: 'Receiver address does not match payment receiver',
    };
  }

  // Validate token is in approved list
  if (!acceptedTokens.includes(payment.tokenOutSymbol)) {
    return {
      isValid: false,
      error: 'Payment token not in approved list',
    };
  }

  // Validate amount paid is equal or greater than expected
  const amountPaid = Number(payment.tokenOutAmountGross); // Amount before fees
  if (amountPaid < expectedAmount) {
    return {
      isValid: false,
      error: 'Payment amount less than expected',
    };
  }

  return {
    isValid: true,
    payment,
  };
}
