export interface TransactionResponse {
  txHash: string;
  chainId: number;
  state: string;
  gasFee: string;
  blockTimestamp: string;
  yodlPayments: YodlPayment[];
}

export interface YodlPayment {
  txHash: string;
  paymentIndex: number;
  memo: string;
  tokenOut: Token;
  invoiceCurrency: string;
  invoiceAmount: string;
  invoiceAmountInUsd: string;
  tokenOutGross: string;
  yodlFee: any;
  totalFees: any;
  tokenOutNet: string;
  tokenIn: Token;
  sender: Person;
  receiver: Person;
}

export interface Token {
  chainId: number;
  address: string;
  yodlConfig: YodlConfig;
}

export interface YodlConfig {
  symbol: string;
  decimals: number;
}

export interface Person {
  address: string;
  ensPrimaryName?: string;
}
