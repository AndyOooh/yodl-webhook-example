import { type Address, type Hex } from 'viem';

export type PaymentResponse = {
  txHash: Hex;
  chainId: number;
  state: string;
  gasFee: string;
  blockTimestamp: string;
  yodlPayments: YodlPayment[];
};

export type YodlPayment = {
  txHash: Hex;
  paymentIndex: number;
  memo: string;
  tokenOut: Token;
  invoiceCurrency: string;
  invoiceAmount: string;
  invoiceAmountInUsd: string;
  tokenOutGross: string;
  yodlFee: null;
  totalFees: null;
  tokenOutNet: string;
  tokenIn: Token;
  sender: Person;
  receiver: Person;

  chainId: number;
  blockTimestamp: string;

  tokenOutSymbol: string;
  tokenOutAddress: Address;
  tokenOutAmountGross: string;

  receiverAddress: Address;
  receiverEnsPrimaryName: string;
  receiverYodlConfig: null;

  senderAddress: Address;
  senderEnsPrimaryName: string;
};

export type Token = {
  chainId: number;
  address: Address;
  yodlConfig: YodlConfig;
};

export type YodlConfig = {
  symbol: string;
  decimals: number;
};

export type Person = {
  address: Address;
  ensPrimaryName?: string;
};
