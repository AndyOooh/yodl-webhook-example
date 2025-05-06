import { YodlPayment } from '../types/payment';

type ValidationResult = {
  isValid: boolean;
  error?: string;
  payment?: YodlPayment;
};

export function validatePayment(
  payment: YodlPayment,
  acceptedTokens: string[],
  expectedAmount: number
): ValidationResult {
  // Validate token is in approved list
  if (!acceptedTokens.includes(payment.tokenIn.yodlConfig.symbol)) {
    return {
      isValid: false,
      error: 'Payment token not in approved list',
    };
  }

  const amountPaid = Number(payment.tokenOutGross); // Amount before fees

  // Validate amount paid is equal or greater than expected
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
